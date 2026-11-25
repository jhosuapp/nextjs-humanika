import { SITE_PARENT_ORG } from "@/src/config/site";
import { absoluteUrl, ORGANIZATION_ID } from "@/src/shared/helpers/seo/absolute-url";

type ArticleJsonLdInput = {
  /** BlogPosting for blog articles, Article for case studies. */
  type: "BlogPosting" | "Article";
  path: string;
  headline: string;
  description: string;
  /** Site-relative image path ("/images/…"). */
  image: string;
  /** ISO date (YYYY-MM-DD). */
  datePublished: string;
  dateModified?: string;
  /** Case studies: the client the story is about. */
  about?: string;
  /** Case studies are authored by the agency behind Humanika. */
  authorIsParentOrg?: boolean;
  inLanguage: string;
};

/** schema.org BlogPosting / Article node, linked to the site Organization. */
const buildArticleJsonLd = ({
  type,
  path,
  headline,
  description,
  image,
  datePublished,
  dateModified,
  about,
  authorIsParentOrg = false,
  inLanguage,
}: ArticleJsonLdInput): Record<string, unknown> => {
  const url = absoluteUrl(path);

  return {
    "@type": type,
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline,
    description,
    image: absoluteUrl(image),
    datePublished,
    dateModified: dateModified ?? datePublished,
    inLanguage,
    author: authorIsParentOrg
      ? { "@type": "Organization", name: SITE_PARENT_ORG }
      : { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    ...(about ? { about: { "@type": "Organization", name: about } } : {}),
  };
};

export { buildArticleJsonLd };
