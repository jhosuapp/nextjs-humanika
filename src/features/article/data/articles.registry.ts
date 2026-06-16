import type { ArticleContent } from "@/src/features/article/types/article.types";
import { crearConfianzaContent } from "./crear-confianza.content";
import { fuerzaLaboralHibridaContent } from "./fuerza-laboral-hibrida.content";
import { colaboradoresDigitalesContent } from "./colaboradores-digitales.content";

/**
 * Single source of truth for every article.
 *
 * Each entry is purely structural (slug, schema, cover, date). All visible copy
 * lives in the matching i18n namespace `public/locales/<locale>/<slug>.json`.
 *
 * The `slug` doubles as:
 *   - the URL segment  →  /blog/<slug>
 *   - the i18n namespace loaded by both the article page and the blog listing.
 *
 * To publish a new article:
 *   1. public/locales/<locale>/<slug>.json  — the copy.
 *   2. src/features/article/data/<slug>.content.ts — the `ArticleContent` schema.
 *   3. add one entry here. The /blog listing and /blog/<slug> route pick it up
 *      automatically — no new page file required.
 */

type ArticleEntry = {
  /** URL segment + i18n namespace. */
  slug: string;
  /** Structural block schema rendered by `ArticleRenderer`. */
  content: ArticleContent;
  /** Cover image used on the listing card. */
  cover: string;
  /** ISO publish date, used to order the listing (newest first). */
  publishedAt: string;
};

const articlesRegistry: ReadonlyArray<ArticleEntry> = [
  {
    slug: "colaboradores-digitales",
    content: colaboradoresDigitalesContent,
    cover: "/images/bg-update.jpg",
    publishedAt: "2026-06-16",
  },
  {
    slug: "fuerza-laboral-hibrida",
    content: fuerzaLaboralHibridaContent,
    cover: "/images/bg-update.jpg",
    publishedAt: "2026-06-09",
  },
  {
    slug: "crear-confianza",
    content: crearConfianzaContent,
    cover: "/images/bg-update.jpg",
    publishedAt: "2026-06-08",
  },
];

/** Newest-first list for the blog index. */
const getSortedArticles = (): ReadonlyArray<ArticleEntry> =>
  [...articlesRegistry].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

const getArticleSlugs = (): string[] => articlesRegistry.map((a) => a.slug);

const getArticleBySlug = (slug: string): ArticleEntry | undefined =>
  articlesRegistry.find((a) => a.slug === slug);

export {
  articlesRegistry,
  getSortedArticles,
  getArticleSlugs,
  getArticleBySlug,
};
export type { ArticleEntry };
