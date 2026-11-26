import fs from "node:fs";
import path from "node:path";

import { getArticleSlugs } from "@/src/features/article/data/articles.registry";
import { getCaseStudySlugs } from "@/src/features/case-studies/data/case-studies.registry";
import { getProductSlugs } from "@/src/features/products/data/products.registry";

const ROOT = path.resolve(__dirname, "../../..");

/** Every route the site can actually serve, derived from pages/ + registries. */
const knownRoutes = (): Set<string> => {
  const routes = new Set<string>(["/"]);
  const pagesDir = path.join(ROOT, "pages");

  const walk = (dir: string, prefix: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (entry.name === "api") continue;
        walk(path.join(dir, entry.name), `${prefix}/${entry.name}`);
      } else if (/^index\.tsx?$/.test(entry.name) && prefix) {
        routes.add(prefix);
      }
    }
  };
  walk(pagesDir, "");

  getArticleSlugs().forEach((s) => routes.add(`/blog/${s}`));
  getCaseStudySlugs().forEach((s) => routes.add(`/casos-de-exito/${s}`));
  getProductSlugs().forEach((s) => routes.add(`/productos/${s}`));
  return routes;
};

const readLocale = (locale: string, ns: string) =>
  JSON.parse(
    fs.readFileSync(path.join(ROOT, "public/locales", locale, `${ns}.json`), "utf8"),
  );

export { ROOT, knownRoutes, readLocale };
