import { SITE_URL } from "@/src/config/site";
import { getSortedArticles } from "@/src/features/article/data/articles.registry";
import { getSortedCaseStudies } from "@/src/features/case-studies/data/case-studies.registry";
import { getProductSlugs } from "@/src/features/products/data/products.registry";

type SitemapEntry = { path: string; lastmod?: string };

/** Indexable static routes. Internal ones (/login, /dashboard) stay out. */
const STATIC_PATHS = [
  "",
  "/plataforma",
  "/empresas",
  "/entidades-publicas",
  "/nosotros",
  "/productos",
  "/casos-de-exito",
  "/blog",
  "/privacy",
  "/terms",
] as const;

/** Every public URL of the site, with lastmod where the registry has a date. */
const buildSitemapEntries = (): SitemapEntry[] => [
  ...STATIC_PATHS.map((path) => ({ path })),
  ...getSortedArticles().map((a) => ({ path: `/blog/${a.slug}`, lastmod: a.publishedAt })),
  ...getSortedCaseStudies().map((c) => ({
    path: `/casos-de-exito/${c.slug}`,
    lastmod: c.publishedAt,
  })),
  ...getProductSlugs().map((slug) => ({ path: `/productos/${slug}` })),
];

const sitemapToXml = (entries: SitemapEntry[]) =>
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    ({ path, lastmod }) =>
      `  <url><loc>${SITE_URL}${path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`,
  )
  .join("\n")}
</urlset>
`;

export { STATIC_PATHS, buildSitemapEntries, sitemapToXml };
export type { SitemapEntry };
