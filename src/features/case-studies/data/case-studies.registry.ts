import type { CaseStudyEntry } from "@/src/features/case-studies/types/case-study.types";
import { coronaContent } from "@/src/features/case-studies/data/corona.content";
import { aguilaContent } from "@/src/features/case-studies/data/aguila.content";
import { stellaContent } from "@/src/features/case-studies/data/stella.content";
import { pepsicoContent } from "@/src/features/case-studies/data/pepsico.content";

/**
 * Single source of truth for every success story ("caso de éxito").
 *
 * Each entry is purely structural (slug, cover, logo, metric, date). All visible
 * copy lives in the matching i18n namespace `public/locales/<locale>/<slug>.json`.
 *
 * The `slug` doubles as:
 *   - the URL segment  →  /casos-de-exito/<slug>
 *   - the i18n namespace loaded by the detail page, the listing and the home
 *     "Casos de éxito" section.
 *
 * To publish a new case study:
 *   1. public/locales/<locale>/<slug>.json  — the copy.
 *   2. add one entry here. The /casos-de-exito listing, the /casos-de-exito/<slug>
 *      route and the home section pick it up automatically — no new page file.
 *
 * NOTE: `corona`, `aguila`, `stella` and `michelob` are real WhatsApp-bot cases.
 * To add another, drop its copy in public/locales/<locale>/<slug>.json and add
 * one entry here; the listing, the /casos-de-exito/<slug> route and the home
 * section pick it up automatically — no new page file.
 */
const caseStudiesRegistry: ReadonlyArray<CaseStudyEntry> = [
  {
    slug: "corona",
    cover: "/images/ventas-y-crecimiento.jpg",
    logo: "/logos/uses-cases/corona.svg",
    count: { to: 1 },
    publishedAt: "2026-06-16",
    content: coronaContent,
  },
  {
    slug: "aguila",
    cover: "/images/servicio-y-soporte.jpg",
    logo: "/logos/aguila.png",
    publishedAt: "2026-06-14",
    content: aguilaContent,
  },
  {
    slug: "stella",
    cover: "/images/contociento-organizacional.jpg",
    logo: "/logos/uses-cases/stella.png",
    publishedAt: "2026-06-12",
    content: stellaContent,
  },
  {
    slug: "pepsico",
    cover: "/images/productividad-y-opetaciones.jpg",
    logo: "/logos/uses-cases/pepsico.svg",
    publishedAt: "2026-06-10",
    content: pepsicoContent,
  },
];

/** Newest-first list for the listing and the home section. */
const getSortedCaseStudies = (): ReadonlyArray<CaseStudyEntry> =>
  [...caseStudiesRegistry].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

const getCaseStudySlugs = (): string[] =>
  caseStudiesRegistry.map((c) => c.slug);

const getCaseStudyBySlug = (slug: string): CaseStudyEntry | undefined =>
  caseStudiesRegistry.find((c) => c.slug === slug);

export {
  caseStudiesRegistry,
  getSortedCaseStudies,
  getCaseStudySlugs,
  getCaseStudyBySlug,
};
