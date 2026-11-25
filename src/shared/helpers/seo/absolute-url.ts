import { SITE_URL } from "@/src/config/site";

/** Absolute URL for a site path ("/blog" → "https://humanika.co/blog"). */
const absoluteUrl = (path = ""): string =>
  `${SITE_URL}${path === "/" ? "" : path}`;

/** Stable `@id` of the site-wide Organization node emitted by PageLayout. */
const ORGANIZATION_ID = `${absoluteUrl()}/#organization`;

export { absoluteUrl, ORGANIZATION_ID };
