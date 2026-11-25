import { SITE_NAME, SITE_URL } from "@/src/config/site";

type ProductJsonLdInput = {
  slug: string;
  name: string;
  description: string;
  category: string;
  image: string;
  homeLabel: string;
  localePath: string;
};

/** schema.org nodes for a product ficha: the software product itself plus a
 *  breadcrumb trail (Home › Product). Merged into PageLayout's `@graph`. */
const buildProductJsonLd = ({
  slug,
  name,
  description,
  category,
  image,
  homeLabel,
  localePath,
}: ProductJsonLdInput): Record<string, unknown>[] => {
  const url = `${SITE_URL}${localePath}/productos/${slug}`;

  return [
    {
      "@type": "SoftwareApplication",
      "@id": `${url}#product`,
      name,
      description,
      url,
      image: `${SITE_URL}${image}`,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: category,
      operatingSystem: "Web",
      brand: { "@type": "Brand", name: SITE_NAME },
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: homeLabel,
          item: `${SITE_URL}${localePath}`,
        },
        { "@type": "ListItem", position: 2, name, item: url },
      ],
    },
  ];
};

export { buildProductJsonLd };
