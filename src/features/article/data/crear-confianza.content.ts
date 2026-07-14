import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faGlobe,
  faMobileScreenButton,
  faDisplay,
  faStore,
  faCube,
} from "@fortawesome/free-solid-svg-icons";

import type { ArticleContent } from "@/src/features/article/types/article.types";

// Structural schema for the "Crear confianza" article. Every string is resolved
// from public/locales/<locale>/crear-confianza.json at render time.
const crearConfianzaContent: ArticleContent = {
  blocks: [
    { type: "hero", image: "/images/bg-article-3.jpeg" },

    {
      type: "section",
      id: "hiperrealismo",
      index: "01",
      key: "hiperrealismo",
      nav: "toc.hiperrealismo",
      content: [{ kind: "paragraphs", key: "hiperrealismo.paragraphs" }],
    },

    {
      type: "section",
      id: "ai-native",
      index: "02",
      key: "aiNative",
      nav: "toc.aiNative",
      content: [
        { kind: "paragraphs", key: "aiNative.paragraphs" },
        { kind: "emphasis", key: "aiNative.shortLines" },
        {
          kind: "inlineHighlight",
          leadKey: "aiNative.closingLead",
          termKey: "aiNative.closingTerm",
          trailKey: "aiNative.closingTrail",
        },
      ],
    },

    { type: "comparison", key: "comparison" },

    {
      type: "section",
      id: "comportamiento",
      index: "03",
      key: "comportamiento",
      nav: "toc.comportamiento",
      content: [
        { kind: "paragraphs", key: "comportamiento.intro" },
        { kind: "list", key: "comportamiento.bullets" },
        { kind: "paragraphs", key: "comportamiento.paragraphs" },
        { kind: "quote", key: "comportamiento.quote" },
      ],
    },

    {
      type: "section",
      id: "futuro",
      index: "04",
      key: "futuro",
      nav: "toc.futuro",
      content: [
        { kind: "paragraphs", key: "futuro.paragraphs" },
        { kind: "quote", key: "futuro.quote", accentKey: "futuro.quoteAccent" },
      ],
    },

    {
      type: "iconGrid",
      id: "canales",
      key: "channels",
      nav: "toc.canales",
      items: [
        { key: "whatsapp", icon: faWhatsapp },
        { key: "web", icon: faGlobe },
        { key: "apps", icon: faMobileScreenButton },
        { key: "screens", icon: faDisplay },
        { key: "kiosks", icon: faStore },
        { key: "immersive", icon: faCube },
      ],
    },

    { type: "takeaways", key: "takeaways" },

    { type: "cta", key: "cta" },
  ],
};

export { crearConfianzaContent };
