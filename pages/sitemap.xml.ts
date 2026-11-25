import type { GetServerSideProps } from "next";

import { SITE_URL } from "@/src/config/site";
import { getSortedArticles } from "@/src/features/article/data/articles.registry";
import { getSortedCaseStudies } from "@/src/features/case-studies/data/case-studies.registry";
import { getProductSlugs } from "@/src/features/products/data/products.registry";

type SitemapEntry = { path: string; lastmod?: string };

/** Public, indexable routes. Internal ones (/login, /dashboard) stay out. */
const buildEntries = (): SitemapEntry[] => [
  { path: "" },
  { path: "/blog" },
  { path: "/casos-de-exito" },
  { path: "/productos" },
  { path: "/plataforma" },
  { path: "/empresas" },
  { path: "/entidades-publicas" },
  { path: "/nosotros" },
  { path: "/privacy" },
  { path: "/terms" },
  ...getSortedArticles().map((a) => ({ path: `/blog/${a.slug}`, lastmod: a.publishedAt })),
  ...getSortedCaseStudies().map((c) => ({
    path: `/casos-de-exito/${c.slug}`,
    lastmod: c.publishedAt,
  })),
  ...getProductSlugs().map((slug) => ({ path: `/productos/${slug}` })),
];

const toXml = (entries: SitemapEntry[]) =>
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

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=3600");
  res.write(toXml(buildEntries()));
  res.end();
  return { props: {} };
};

/** The response is written in getServerSideProps; nothing renders. */
export default function Sitemap() {
  return null;
}
