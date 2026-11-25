import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

/** Product families from the catalog brief. Ids double as i18n keys
 *  (`products:categories.<id>`). */
type ProductCategoryId =
  | "atencion-ciudadana"
  | "documentos-tramites"
  | "contratacion-inversion"
  | "investigacion-participacion"
  | "educacion"
  | "vision-computacional";

/**
 * Structural data for a product detail page ("ficha").
 *
 * All visible copy lives in `public/locales/<locale>/products.json` under
 * `items.<slug>`; this entry only carries what is not text.
 */
type ProductEntry = {
  /** URL segment ("/productos/<slug>") and i18n key (`items.<slug>`). */
  slug: string;
  category: ProductCategoryId;
  /** Main scene image (16:10), reused cropped on cards. */
  image: string;
  /** One icon per feature, in the same order as `items.<slug>.features`. */
  featureIcons: [IconDefinition, IconDefinition, IconDefinition];
  /** Exactly three related product slugs, as listed in the brief. */
  related: [string, string, string];
};

export type { ProductCategoryId, ProductEntry };
