import type { GetServerSideProps } from "next";

import {
  buildSitemapEntries,
  sitemapToXml,
} from "@/src/shared/helpers/seo/build-sitemap";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=3600");
  res.write(sitemapToXml(buildSitemapEntries()));
  res.end();
  return { props: {} };
};

/** The response is written in getServerSideProps; nothing renders. */
export default function Sitemap() {
  return null;
}
