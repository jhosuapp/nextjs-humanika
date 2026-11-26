import type { GetServerSideProps } from "next";

import { buildLlmsTxt } from "@/src/shared/helpers/seo/build-llms-txt";
import { buildLlmsContent } from "@/src/shared/helpers/seo/llms-content";

/**
 * /llms.txt (llmstxt.org): a Markdown map of the site for AI assistants.
 * Google states it neither helps nor hurts Search; other assistants may read
 * it. Generated from the site's own registries and copy.
 */
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=3600");
  res.write(buildLlmsTxt(buildLlmsContent()));
  res.end();
  return { props: {} };
};

/** The response is written in getServerSideProps; nothing renders. */
export default function LlmsTxt() {
  return null;
}
