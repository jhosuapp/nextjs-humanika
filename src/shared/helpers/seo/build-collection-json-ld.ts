import { absoluteUrl, ORGANIZATION_ID } from "@/src/shared/helpers/seo/absolute-url";

type CollectionJsonLdInput = {
  path: string;
  name: string;
  description: string;
  items: { name: string; path: string }[];
  inLanguage: string;
};

/** schema.org CollectionPage with an ItemList of its entries (listings). */
const buildCollectionJsonLd = ({
  path,
  name,
  description,
  items,
  inLanguage,
}: CollectionJsonLdInput): Record<string, unknown> => {
  const url = absoluteUrl(path);

  return {
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name,
    description,
    inLanguage,
    isPartOf: { "@id": `${absoluteUrl()}/#website` },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
};

export { buildCollectionJsonLd };
