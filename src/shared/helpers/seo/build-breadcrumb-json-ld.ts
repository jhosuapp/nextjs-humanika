import { absoluteUrl } from "@/src/shared/helpers/seo/absolute-url";

type Crumb = { name: string; path: string };

/** schema.org BreadcrumbList from ordered crumbs (home first, page last). */
const buildBreadcrumbJsonLd = (crumbs: Crumb[]): Record<string, unknown> => {
  const last = crumbs[crumbs.length - 1];

  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(last.path)}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
};

export { buildBreadcrumbJsonLd };
export type { Crumb };
