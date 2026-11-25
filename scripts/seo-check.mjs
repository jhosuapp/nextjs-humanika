#!/usr/bin/env node
/**
 * SEO copy guard — `npm run seo:check`
 *
 * Checks every indexable page's <title> and meta description (from the
 * Spanish locale files) against the editorial ranges of the SEO plan:
 *   - title: 30–60 characters, ending in "| Humanika"
 *   - description: 120–155 characters
 *   - no duplicated titles or descriptions
 *   - product image alt text: 50–125 characters
 *
 * Google sets no hard limits (it truncates by device width); these ranges keep
 * titles and snippets readable on mobile and desktop. Exits 1 on any failure.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const LOCALE_DIR = path.join(ROOT, "public/locales/es");
const RULES = {
  title: { min: 30, max: 60, suffix: "| Humanika" },
  description: { min: 120, max: 155 },
  alt: { min: 50, max: 125 },
};

const read = (file) =>
  JSON.parse(fs.readFileSync(path.join(LOCALE_DIR, file), "utf8"));

/** Collect { page, title, description } for every indexable page. */
const collectPages = () => {
  const pages = [];
  const push = (page, seo) =>
    seo && pages.push({ page, title: seo.title, description: seo.description });

  const common = read("common.json");
  push("/", { title: common.seo.homeTitle, description: common.seo.homeDescription });

  // Namespaces whose `seo` block is a page of its own (listings, legal,
  // articles and case studies). Internal/noindex pages are skipped.
  const skip = new Set(["common.json", "products.json", "home.json", "bot.json", "dashboard.json", "login.json"]);
  for (const file of fs.readdirSync(LOCALE_DIR).sort()) {
    if (!file.endsWith(".json") || skip.has(file)) continue;
    const json = read(file);
    if (json.seo) push(file.replace(".json", ""), json.seo);
  }

  const products = read("products.json");
  push("/productos", products.catalog?.seo);
  for (const [slug, item] of Object.entries(products.items)) {
    push(`/productos/${slug}`, item.seo);
  }
  return { pages, products };
};

const errors = [];
const check = (page, field, value, { min, max, suffix }) => {
  if (typeof value !== "string" || !value.trim()) {
    errors.push(`${page} · ${field}: falta`);
    return;
  }
  const len = [...value].length;
  if (len < min || len > max) {
    errors.push(`${page} · ${field}: ${len} caracteres (rango ${min}–${max}) → "${value}"`);
  }
  if (suffix && !value.endsWith(suffix)) {
    errors.push(`${page} · ${field}: debe terminar en "${suffix}" → "${value}"`);
  }
};

const { pages, products } = collectPages();

for (const { page, title, description } of pages) {
  check(page, "title", title, RULES.title);
  check(page, "description", description, RULES.description);
}

for (const field of ["title", "description"]) {
  const seen = new Map();
  for (const p of pages) {
    const value = p[field];
    if (!value) continue;
    if (seen.has(value)) errors.push(`${field} duplicado en ${seen.get(value)} y ${p.page}`);
    else seen.set(value, p.page);
  }
}

for (const [slug, item] of Object.entries(products.items)) {
  check(`/productos/${slug}`, "imageAlt", item.imageAlt, RULES.alt);
}

console.log(`seo:check · ${pages.length} páginas revisadas`);
if (errors.length) {
  console.error(`\n${errors.length} problema(s):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log("Todo dentro de rango ✔");
