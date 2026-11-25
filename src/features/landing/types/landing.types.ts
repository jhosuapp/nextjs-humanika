import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

/**
 * Structural data for an informational landing page (/plataforma,
 * /empresas, /entidades-publicas, /nosotros).
 *
 * Only non-text data lives here (section order, kinds, icons, links). Every
 * visible string comes from the page's i18n namespace
 * (`public/locales/<locale>/<namespace>.json`):
 *   seo.*, hero.*, sections.<id>.*, cta.*
 */
type LandingCardsSection = {
  id: string;
  kind: "cards";
  /** One icon per card, in the same order as `sections.<id>.items`. */
  icons: IconDefinition[];
  /** Optional link per card (same order); `null` for no link. */
  links?: (string | null)[];
};

type LandingGroupsSection = {
  id: string;
  kind: "groups";
  /** Number of groups in `sections.<id>.groups` (each: title + chips). */
  groups: number;
};

type LandingSection = LandingCardsSection | LandingGroupsSection;

type LandingStaticData = {
  /** i18n namespace and URL segment ("/<namespace>"). */
  namespace: string;
  /** Secondary hero link (e.g. "/productos"). */
  secondaryHref: string;
  sections: LandingSection[];
};

export type {
  LandingCardsSection,
  LandingGroupsSection,
  LandingSection,
  LandingStaticData,
};
