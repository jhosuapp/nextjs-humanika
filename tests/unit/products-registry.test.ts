import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  getProductBySlug,
  getProductSlugs,
  productsStaticData,
} from "@/src/features/products/data/products.registry";

import { ROOT, readLocale } from "./helpers/site-routes";

const CATEGORIES = [
  "atencion-ciudadana",
  "documentos-tramites",
  "contratacion-inversion",
  "investigacion-participacion",
  "educacion",
  "vision-computacional",
];

describe("products registry", () => {
  it("has the 18 products of the brief with unique slugs", () => {
    const slugs = getProductSlugs();
    expect(slugs).toHaveLength(18);
    expect(new Set(slugs).size).toBe(18);
  });

  it("uses URL-safe slugs (lowercase, no accents, hyphens)", () => {
    getProductSlugs().forEach((slug) => expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/));
  });

  it("assigns every product to a known family", () => {
    productsStaticData.forEach((p) => expect(CATEGORIES).toContain(p.category));
  });

  it("links exactly 3 existing, distinct related products (never itself)", () => {
    productsStaticData.forEach((p) => {
      expect(p.related).toHaveLength(3);
      expect(new Set(p.related).size).toBe(3);
      expect(p.related).not.toContain(p.slug);
      p.related.forEach((r) => expect(getProductBySlug(r), `${p.slug} → ${r}`).toBeDefined());
    });
  });

  it("points to an image that exists in public/", () => {
    productsStaticData.forEach((p) => {
      expect(fs.existsSync(path.join(ROOT, "public", p.image)), p.image).toBe(true);
    });
  });

  it("has one icon per feature and 3 features of copy (es + en)", () => {
    const es = readLocale("es", "products");
    const en = readLocale("en", "products");
    productsStaticData.forEach((p) => {
      expect(p.featureIcons).toHaveLength(3);
      expect(es.items[p.slug].features).toHaveLength(3);
      expect(en.items[p.slug].features).toHaveLength(3);
    });
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProductBySlug("no-existe")).toBeUndefined();
  });
});
