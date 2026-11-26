import { describe, expect, it } from "vitest";

import { SITE_URL } from "@/src/config/site";
import {
  buildSitemapEntries,
  sitemapToXml,
} from "@/src/shared/helpers/seo/build-sitemap";
import { headerStaticData } from "@/src/shared/layouts/header/header-content";
import { footerStaticData } from "@/src/shared/layouts/footer/footer-content";
import { productsStaticData } from "@/src/features/products/data/products.registry";
import { plataformaStaticData } from "@/src/features/landing/data/plataforma.content";
import { empresasStaticData } from "@/src/features/landing/data/empresas.content";
import { entidadesPublicasStaticData } from "@/src/features/landing/data/entidades-publicas.content";
import { nosotrosStaticData } from "@/src/features/landing/data/nosotros.content";

import { knownRoutes } from "./helpers/site-routes";

const routes = knownRoutes();
const CATEGORY_ANCHORS = new Set(productsStaticData.map((p) => p.category));

/** Internal href → is it a real page (and, for /productos#x, a real family)? */
const resolves = (href: string) => {
  const [path, hash] = href.split("#");
  const page = path === "" ? "/" : path;
  if (!routes.has(page)) return false;
  if (page === "/productos" && hash) return CATEGORY_ANCHORS.has(hash as never);
  return true;
};

describe("sitemap", () => {
  const entries = buildSitemapEntries();
  const paths = entries.map((e) => e.path || "/");

  it("lists only real, unique, public routes", () => {
    expect(new Set(paths).size).toBe(paths.length);
    paths.forEach((p) => expect(routes.has(p), p).toBe(true));
    expect(paths.some((p) => p.startsWith("/dashboard") || p.startsWith("/login"))).toBe(false);
  });

  it("includes every product, the catalog and the new landings", () => {
    productsStaticData.forEach((p) => expect(paths).toContain(`/productos/${p.slug}`));
    ["/productos", "/plataforma", "/empresas", "/entidades-publicas", "/nosotros"].forEach((p) =>
      expect(paths).toContain(p),
    );
  });

  it("serializes valid-looking XML with absolute URLs and ISO lastmod", () => {
    const xml = sitemapToXml(entries);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect((xml.match(/<url>/g) ?? []).length).toBe(entries.length);
    expect(xml).toContain(`<loc>${SITE_URL}/plataforma</loc>`);
    (xml.match(/<lastmod>([^<]+)<\/lastmod>/g) ?? []).forEach((m) =>
      expect(m).toMatch(/\d{4}-\d{2}-\d{2}/),
    );
  });
});

describe("navigation links", () => {
  it("header links point to existing pages", () => {
    headerStaticData.nav.forEach((item) => {
      if (!item.external) expect(resolves(item.href), item.href).toBe(true);
      item.children?.forEach((c) => expect(resolves(c.href), c.href).toBe(true));
    });
  });

  it("footer internal links point to existing pages", () => {
    footerStaticData.nav.columns.forEach((col) =>
      col.links
        .filter((l) => !l.external)
        .forEach((l) => {
          const path = l.href.split("#")[0] || "/";
          expect(routes.has(path), l.href).toBe(true);
        }),
    );
    footerStaticData.bottom.legalLinks.forEach((l) => expect(resolves(l.href), l.href).toBe(true));
  });

  it("landing card links and secondary CTAs resolve", () => {
    [plataformaStaticData, empresasStaticData, entidadesPublicasStaticData, nosotrosStaticData].forEach(
      (data) => {
        expect(resolves(data.secondaryHref), data.secondaryHref).toBe(true);
        data.sections.forEach((s) => {
          if (s.kind === "cards") s.links?.forEach((l) => l && expect(resolves(l), l).toBe(true));
        });
      },
    );
  });
});
