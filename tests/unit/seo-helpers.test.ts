import { describe, expect, it } from "vitest";

import { SITE_URL } from "@/src/config/site";
import { absoluteUrl, ORGANIZATION_ID } from "@/src/shared/helpers/seo/absolute-url";
import { buildArticleJsonLd } from "@/src/shared/helpers/seo/build-article-json-ld";
import { buildBreadcrumbJsonLd } from "@/src/shared/helpers/seo/build-breadcrumb-json-ld";
import { buildCollectionJsonLd } from "@/src/shared/helpers/seo/build-collection-json-ld";
import { buildProductJsonLd } from "@/src/features/products/helpers/build-product-json-ld";
import { buildDemoWhatsappUrl } from "@/src/features/products/helpers/build-demo-whatsapp-url";

describe("absoluteUrl", () => {
  it("joins paths to the site URL without a trailing slash on home", () => {
    expect(absoluteUrl()).toBe(SITE_URL);
    expect(absoluteUrl("/")).toBe(SITE_URL);
    expect(absoluteUrl("/blog")).toBe(`${SITE_URL}/blog`);
    expect(ORGANIZATION_ID).toBe(`${SITE_URL}/#organization`);
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("numbers crumbs from 1 and uses absolute URLs", () => {
    const node = buildBreadcrumbJsonLd([
      { name: "Inicio", path: "/" },
      { name: "Artículos", path: "/blog" },
    ]) as { itemListElement: { position: number; item: string }[]; "@id": string };
    expect(node.itemListElement.map((i) => i.position)).toEqual([1, 2]);
    expect(node.itemListElement[1].item).toBe(`${SITE_URL}/blog`);
    expect(node["@id"]).toBe(`${SITE_URL}/blog#breadcrumb`);
  });
});

describe("buildArticleJsonLd", () => {
  const base = {
    path: "/blog/x",
    headline: "Titular",
    description: "Descripción",
    image: "/images/a.jpg",
    datePublished: "2026-06-16",
    inLanguage: "es-CO",
  };

  it("BlogPosting is authored and published by the Organization", () => {
    const node = buildArticleJsonLd({ ...base, type: "BlogPosting" });
    expect(node["@type"]).toBe("BlogPosting");
    expect(node.author).toEqual({ "@id": ORGANIZATION_ID });
    expect(node.publisher).toEqual({ "@id": ORGANIZATION_ID });
    expect(node.image).toBe(`${SITE_URL}/images/a.jpg`);
    expect(node.dateModified).toBe("2026-06-16");
    expect(node).not.toHaveProperty("about");
  });

  it("case studies credit the parent org and name the client", () => {
    const node = buildArticleJsonLd({
      ...base,
      type: "Article",
      about: "Corona México",
      authorIsParentOrg: true,
    });
    expect(node.author).toEqual({ "@type": "Organization", name: "150 Por Ciento" });
    expect(node.about).toEqual({ "@type": "Organization", name: "Corona México" });
  });
});

describe("buildCollectionJsonLd", () => {
  it("lists every item with positions and a count", () => {
    const node = buildCollectionJsonLd({
      path: "/productos",
      name: "Catálogo",
      description: "d",
      inLanguage: "es-CO",
      items: [
        { name: "A", path: "/productos/a" },
        { name: "B", path: "/productos/b" },
      ],
    }) as { mainEntity: { numberOfItems: number; itemListElement: { position: number; url: string }[] } };
    expect(node.mainEntity.numberOfItems).toBe(2);
    expect(node.mainEntity.itemListElement[1]).toMatchObject({ position: 2, url: `${SITE_URL}/productos/b` });
  });
});

describe("buildProductJsonLd", () => {
  it("emits SoftwareApplication + 3-level breadcrumb (Inicio › Productos › Ficha)", () => {
    const [app, crumbs] = buildProductJsonLd({
      slug: "gestion-pqrsd",
      name: "Humanika – Gestión de PQRSD",
      description: "d",
      category: "Atención ciudadana",
      image: "/images/products/gestion-pqrsd.webp",
      homeLabel: "Inicio",
      catalogLabel: "Productos",
      localePath: "",
    }) as [Record<string, unknown>, { itemListElement: { item: string }[] }];
    expect(app["@type"]).toBe("SoftwareApplication");
    expect(crumbs.itemListElement.map((i) => i.item)).toEqual([
      SITE_URL,
      `${SITE_URL}/productos`,
      `${SITE_URL}/productos/gestion-pqrsd`,
    ]);
  });
});

describe("buildDemoWhatsappUrl", () => {
  it("encodes the message (accents, dashes, spaces)", () => {
    const url = buildDemoWhatsappUrl("Hola, quiero una demostración de Humanika – PQRSD");
    expect(url).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(decodeURIComponent(url.split("text=")[1])).toBe(
      "Hola, quiero una demostración de Humanika – PQRSD",
    );
    expect(url).not.toContain(" ");
  });
});
