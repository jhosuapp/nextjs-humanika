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

/** Points of the 3D demo scene the light packet can travel through. */
type DemoNodeRef =
  | "channel-0"
  | "channel-1"
  | "channel-2"
  | "source-0"
  | "source-1"
  | "source-2"
  | "channels-hub"
  | "sources-hub"
  | "agent"
  | "operator";

/** Scene area highlighted while a step plays. */
type DemoFocus = "channels" | "sources" | "agent" | "operator";

type ProductDemoStep = {
  /** Path the light packet follows during the step. */
  route: DemoNodeRef[];
  focus: DemoFocus;
  /** How many chat lines (`demo.chat`) are visible once the step plays. */
  messages: number;
};

/**
 * Structural config of the interactive 3D "how it works" scene. Copy lives in
 * `items.<slug>.demo` (layers, node labels, steps and the chat script).
 */
type ProductDemoConfig = {
  channelIcons: [IconDefinition, IconDefinition, IconDefinition];
  sourceIcons: [IconDefinition, IconDefinition, IconDefinition];
  operatorIcon: IconDefinition;
  steps: ProductDemoStep[];
};

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
  /** Optional interactive 3D demo shown between features and use case. */
  demo?: ProductDemoConfig;
};

export type {
  DemoFocus,
  DemoNodeRef,
  ProductCategoryId,
  ProductDemoConfig,
  ProductDemoStep,
  ProductEntry,
};
