import { describe, expect, it } from "vitest";

import { SITE_URL } from "@/src/config/site";
import { getArticleSlugs } from "@/src/features/article/data/articles.registry";
import { getCaseStudySlugs } from "@/src/features/case-studies/data/case-studies.registry";
import { getProductSlugs } from "@/src/features/products/data/products.registry";
import { buildLlmsTxt } from "@/src/shared/helpers/seo/build-llms-txt";
import { buildLlmsContent } from "@/src/shared/helpers/seo/llms-content";

import { knownRoutes } from "./helpers/site-routes";

const txt = buildLlmsTxt(buildLlmsContent());
const lines = txt.split("\n");
const links = [...txt.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(([, url]) => url);

describe("/llms.txt (llmstxt.org format)", () => {
  it("starts with the H1 and a blockquote summary", () => {
    expect(lines[0]).toBe("# Humanika");
    expect(lines[2].startsWith("> ")).toBe(true);
    expect(lines[2].length).toBeGreaterThan(80);
  });

  it("ends with an Optional section", () => {
    const headings = lines.filter((l) => l.startsWith("## "));
    expect(headings.at(-1)).toBe("## Optional");
    expect(headings).toContain("## Productos");
  });

  it("lists every product, case study and article", () => {
    getProductSlugs().forEach((s) => expect(links).toContain(`${SITE_URL}/productos/${s}`));
    getCaseStudySlugs().forEach((s) => expect(links).toContain(`${SITE_URL}/casos-de-exito/${s}`));
    getArticleSlugs().forEach((s) => expect(links).toContain(`${SITE_URL}/blog/${s}`));
  });

  it("only links to real pages, with absolute URLs and no duplicates", () => {
    const routes = knownRoutes();
    expect(new Set(links).size).toBe(links.length);
    links.forEach((url) => {
      expect(url.startsWith(SITE_URL)).toBe(true);
      const routePath = url.slice(SITE_URL.length) || "/";
      expect(routes.has(routePath), routePath).toBe(true);
    });
  });

  it("link titles and descriptions are clean (no SEO suffix, no empty text)", () => {
    lines
      .filter((l) => l.startsWith("- ["))
      .forEach((l) => {
        expect(l).not.toMatch(/\| Humanika\]/);
        expect(l).toMatch(/^- \[[^\]]+\]\([^)]+\)(: .{10,})?$/);
      });
  });

  it("states who runs it and how to reach them", () => {
    expect(txt).toContain("150 Por Ciento");
    expect(txt).toMatch(/WhatsApp \+\d+/);
  });
});
