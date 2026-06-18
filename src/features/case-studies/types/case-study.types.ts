import type { ArticleContent } from "@/src/features/article/types/article.types";

/**
 * Schema for a success story ("caso de éxito").
 *
 * Each entry is purely structural (slug, cover, logo, optional metric, date).
 * All visible copy lives in the matching i18n namespace
 * `public/locales/<locale>/<slug>.json`, mirroring the article system.
 */
type CaseStudyEntry = {
  /** URL segment + i18n namespace ("/casos-de-exito/<slug>"). */
  slug: string;
  /** Demonstrative cover image shown on the card and the detail hero. */
  cover: string;
  /** Brand logo (in /public/logos), rendered on the card. */
  logo: string;
  /** When present, the card metric animates as a count-up; otherwise the
   *  static i18n `metric.value` string is shown. */
  count?: { to: number; decimals?: number };
  /** ISO publish date, used to order the listing (newest first). */
  publishedAt: string;
  /** When present, the detail page renders with the block-based
   *  `ArticleRenderer` (blog-style layout) instead of the simple template. */
  content?: ArticleContent;
  /** Set for white / monochrome-light logos: they get a dark chip on the home
   *  featured section so they don't disappear on the light chip background. */
  logoOnDark?: boolean;
};

export type { CaseStudyEntry };
