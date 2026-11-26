import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

import type { LandingStaticData } from "@/src/features/landing/types/landing.types";
import { plataformaStaticData } from "@/src/features/landing/data/plataforma.content";
import { empresasStaticData } from "@/src/features/landing/data/empresas.content";
import { entidadesPublicasStaticData } from "@/src/features/landing/data/entidades-publicas.content";
import { nosotrosStaticData } from "@/src/features/landing/data/nosotros.content";
import { headerStaticData } from "@/src/shared/layouts/header/header-content";
import { footerStaticData } from "@/src/shared/layouts/footer/footer-content";

import { ROOT, readLocale } from "./helpers/site-routes";

const LANDINGS: LandingStaticData[] = [
  plataformaStaticData,
  empresasStaticData,
  entidadesPublicasStaticData,
  nosotrosStaticData,
];

/** Flattened key paths with array lengths, to compare locale structure. */
const shape = (value: unknown, prefix = ""): string[] => {
  if (Array.isArray(value)) {
    return [`${prefix}[${value.length}]`, ...value.flatMap((v, i) => shape(v, `${prefix}[${i}]`))];
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => shape(v, prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
};

describe("es/en locale parity", () => {
  const namespaces = ["products", "plataforma", "empresas", "entidades-publicas", "nosotros"];

  it.each(namespaces)("%s has the same keys and list sizes in es and en", (ns) => {
    expect(shape(readLocale("en", ns))).toEqual(shape(readLocale("es", ns)));
  });

  it("every header, footer and 404 label in use has text in es and en", () => {
    const get = (obj: Record<string, unknown>, keyPath: string) =>
      keyPath.split(".").reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], obj);

    const keys = [
      ...headerStaticData.nav.flatMap((item) => [
        `nav.${item.key}`,
        ...(item.children ?? []).map((c) => `nav.${c.key}`),
      ]),
      ...footerStaticData.nav.columns.flatMap((col) => [
        `footer.nav.${col.key}.title`,
        ...col.links.map((l) => `footer.nav.${col.key}.${l.key}`),
      ]),
      ...footerStaticData.bottom.legalLinks.map((l) => `footer.bottom.legal.${l.key}`),
      "footer.brand.tagline",
      "notFound.title",
      "notFound.seoTitle",
      "notFound.seoDescription",
    ];

    for (const locale of ["es", "en"]) {
      const common = readLocale(locale, "common");
      keys.forEach((key) => {
        const value = get(common, key);
        expect(typeof value === "string" && value.trim().length > 0, `${locale}: ${key}`).toBe(true);
      });
    }
  });

  it("footer copy has the same structure in es and en", () => {
    expect(shape(readLocale("en", "common").footer)).toEqual(
      shape(readLocale("es", "common").footer),
    );
  });
});

describe("landing pages: data ↔ copy", () => {
  it.each(LANDINGS.map((d) => [d.namespace, d] as const))(
    "%s: icons, links and groups match its copy",
    (_, data) => {
      for (const locale of ["es", "en"]) {
        const copy = readLocale(locale, data.namespace);
        expect(copy.seo.title).toBeTruthy();
        expect(copy.hero.title).toBeTruthy();
        expect(copy.cta.whatsappMessage).toBeTruthy();
        data.sections.forEach((section) => {
          const block = copy.sections[section.id];
          expect(block, `${locale} sections.${section.id}`).toBeDefined();
          if (section.kind === "cards") {
            expect(block.items).toHaveLength(section.icons.length);
            if (section.links) expect(section.links).toHaveLength(section.icons.length);
          } else {
            expect(block.groups).toHaveLength(section.groups);
          }
        });
      }
    },
  );

  it("never claims capabilities the platform doesn't have", () => {
    const banned = /linkedin ads|salesforce|zendesk|datos personales detect|residencia de datos/i;
    for (const ns of ["plataforma", "empresas", "entidades-publicas", "nosotros", "products"]) {
      for (const locale of ["es", "en"]) {
        expect(JSON.stringify(readLocale(locale, ns)), `${locale}/${ns}`).not.toMatch(banned);
      }
    }
  });
});

describe("seo:check script", () => {
  it("passes on the current copy (titles, descriptions, alts in range)", () => {
    const out = execFileSync("node", ["scripts/seo-check.mjs"], { cwd: ROOT, encoding: "utf8" });
    expect(out).toContain("Todo dentro de rango");
  });
});
