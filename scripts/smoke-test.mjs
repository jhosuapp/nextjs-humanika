#!/usr/bin/env node
/**
 * End-to-end smoke test — `npm run test:smoke` (needs a running server).
 *
 *   npm run build && npx next start -p 3005
 *   BASE_URL=http://localhost:3005 npm run test:smoke
 *
 * Crawls every URL in the sitemap like a search engine would and checks, per
 * page: HTTP 200, exactly one <h1>, title ending in "| Humanika", a meta
 * description, a canonical matching the URL, parseable JSON-LD and an
 * indexable robots tag. Then follows every internal link and #anchor found and
 * checks the site files (robots.txt, manifest, icons) and the 404 page.
 * Exits 1 on any failure.
 */
const BASE = (process.env.BASE_URL ?? "http://localhost:3005").replace(/\/$/, "");
const SITE_URL = "https://humanika.co";

const failures = [];
const fail = (where, message) => failures.push(`${where} → ${message}`);
const htmlCache = new Map();

const get = async (path) => {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  const type = res.headers.get("content-type") ?? "";
  const body = /text|xml|json/.test(type) ? await res.text() : "";
  return { status: res.status, body, headers: res.headers };
};

const toPath = (loc) => loc.replace(SITE_URL, "") || "/";

const checkPage = async (path) => {
  const { status, body } = await get(path);
  if (status !== 200) return fail(path, `HTTP ${status}`);
  htmlCache.set(path, body);

  const h1 = (body.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) fail(path, `${h1} <h1> (debe haber 1)`);

  const title = body.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? "";
  if (!title.endsWith("| Humanika")) fail(path, `título sin "| Humanika": "${title}"`);

  if (!/<meta name="description" content="[^"]{20,}"/.test(body)) fail(path, "sin meta description");

  const canonical = body.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const expected = `${SITE_URL}${path === "/" ? "" : path}`;
  if (canonical !== expected) fail(path, `canonical ${canonical} ≠ ${expected}`);

  if (!/<meta name="robots" content="index, follow"/.test(body)) fail(path, "robots no indexable");

  for (const [, json] of body.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const graph = JSON.parse(json)["@graph"] ?? [];
      if (!graph.some((n) => n["@type"] === "Organization")) fail(path, "JSON-LD sin Organization");
    } catch (error) {
      fail(path, `JSON-LD inválido: ${error.message}`);
    }
  }
};

const internalLinks = (html) =>
  [...html.matchAll(/href="(\/[^"]*)"/g)]
    .map(([, href]) => href)
    .filter((href) => !href.startsWith("/_next") && !/\.(png|svg|ico|webp|jpe?g|css|js|webmanifest)$/.test(href));

const main = async () => {
  console.log(`smoke-test · ${BASE}`);

  // 1. Site files
  const robots = await get("/robots.txt");
  if (robots.status !== 200 || !robots.body.includes("Sitemap:")) fail("/robots.txt", "falta o sin Sitemap");
  for (const file of ["/site.webmanifest", "/icon.svg", "/apple-touch-icon.png", "/favicon.ico"]) {
    const res = await fetch(`${BASE}${file}`);
    if (res.status !== 200) fail(file, `HTTP ${res.status}`);
  }

  // 2. 404 page: real 404 status + noindex
  const missing = await get("/esta-pagina-no-existe");
  if (missing.status !== 404) fail("404", `HTTP ${missing.status}`);
  if (!missing.body.includes('content="noindex, follow"')) fail("404", "sin noindex");

  // 3. Every sitemap URL
  const sitemap = await get("/sitemap.xml");
  const paths = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => toPath(loc));
  if (paths.length < 30) fail("/sitemap.xml", `solo ${paths.length} URLs`);
  for (const path of paths) await checkPage(path);

  // 4. Every internal link (and #anchor) found on those pages
  const links = new Set([...htmlCache.values()].flatMap(internalLinks));
  for (const link of links) {
    const [path, hash] = link.split("#");
    const target = path || "/";
    let html = htmlCache.get(target);
    if (html === undefined) {
      const res = await get(target);
      if (res.status !== 200 && res.status !== 308) {
        fail(`link ${link}`, `HTTP ${res.status}`);
        continue;
      }
      html = res.body;
      htmlCache.set(target, html);
    }
    if (hash && !html.includes(`id="${hash}"`)) fail(`link ${link}`, `no existe el ancla #${hash}`);
  }

  console.log(`${paths.length} páginas del sitemap · ${links.size} enlaces internos revisados`);
  if (failures.length) {
    console.error(`\n${failures.length} problema(s):\n- ${failures.join("\n- ")}`);
    process.exit(1);
  }
  console.log("Sin errores ✔");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
