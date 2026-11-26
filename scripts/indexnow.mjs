#!/usr/bin/env node
/**
 * IndexNow — tell Bing (and other IndexNow engines) which URLs changed.
 * https://www.indexnow.org/documentation
 *
 *   npm run indexnow            # dry run: lists what would be sent
 *   npm run indexnow -- --send  # actually notifies IndexNow
 *
 * Run it AFTER a production deploy: it reads the live sitemap, and the key
 * file (public/<key>.txt) must already be reachable on the site.
 * Env: SITE_URL (default https://humanika.co), INDEXNOW_KEY (default: the
 * key file found in public/).
 */
import fs from "node:fs";
import path from "node:path";

const SITE_URL = (process.env.SITE_URL ?? "https://humanika.co").replace(/\/$/, "");
const ENDPOINT = "https://api.indexnow.org/indexnow";
const SEND = process.argv.includes("--send");

const findKey = () => {
  if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY;
  const file = fs
    .readdirSync(path.join(process.cwd(), "public"))
    .find((name) => /^[a-f0-9]{32}\.txt$/.test(name));
  if (!file) throw new Error("No IndexNow key file (public/<32 hex>.txt) found.");
  return file.replace(".txt", "");
};

const main = async () => {
  const key = findKey();
  const host = new URL(SITE_URL).host;
  const keyLocation = `${SITE_URL}/${key}.txt`;

  // The key file must be live, or IndexNow rejects the submission (403).
  const keyRes = await fetch(keyLocation);
  const keyBody = keyRes.ok ? (await keyRes.text()).trim() : "";
  if (keyBody !== key) {
    console.error(`La clave no está publicada en ${keyLocation} (HTTP ${keyRes.status}). Despliega primero.`);
    process.exit(1);
  }

  const sitemap = await (await fetch(`${SITE_URL}/sitemap.xml`)).text();
  const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc);
  if (!urlList.length) throw new Error("El sitemap no tiene URLs.");

  console.log(`IndexNow · ${host} · ${urlList.length} URLs`);
  if (!SEND) {
    urlList.forEach((url) => console.log(`  ${url}`));
    console.log("\nSimulación: no se envió nada. Usa `npm run indexnow -- --send` para notificar.");
    return;
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation, urlList }),
  });
  // 200 OK / 202 Accepted = received. 4xx = key, host or payload problem.
  console.log(`Respuesta de IndexNow: HTTP ${res.status}`);
  if (res.status !== 200 && res.status !== 202) process.exit(1);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
