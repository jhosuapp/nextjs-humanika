import {
  faGears,
  faBrain,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";

import type { ArticleContent } from "@/src/features/article/types/article.types";

// Structural schema for the "Colaboradores digitales" article. Every string is
// resolved from public/locales/<locale>/colaboradores-digitales.json at render time.
const colaboradoresDigitalesContent: ArticleContent = {
  blocks: [
    { type: "hero", image: "/images/bg-article-2.jpeg" },

    { type: "quote", key: "intro.quote" },

    {
      type: "section",
      id: "fluidez",
      index: "01",
      key: "fluidez",
      nav: "toc.fluidez",
      content: [
        { kind: "paragraphs", key: "fluidez.paragraphs" },
        {
          kind: "inlineHighlight",
          leadKey: "fluidez.highlightLead",
          termKey: "fluidez.highlightTerm",
          trailKey: "fluidez.highlightTrail",
        },
        { kind: "emphasis", key: "fluidez.emphasis" },
      ],
    },

    {
      type: "iconGrid",
      id: "niveles",
      key: "levels",
      nav: "toc.niveles",
      items: [
        { key: "automation", icon: faGears },
        { key: "augmentation", icon: faBrain },
        { key: "agency", icon: faUserGear },
      ],
    },

    {
      type: "section",
      id: "automation",
      index: "02",
      key: "automation",
      nav: "toc.automation",
      content: [
        { kind: "paragraphs", key: "automation.paragraphs" },
        { kind: "list", key: "automation.examples" },
        { kind: "paragraphs", key: "automation.limit" },
        { kind: "emphasis", key: "automation.emphasis" },
      ],
    },

    {
      type: "section",
      id: "augmentation",
      index: "03",
      key: "augmentation",
      nav: "toc.augmentation",
      content: [
        { kind: "paragraphs", key: "augmentation.paragraphs" },
        {
          kind: "quote",
          key: "augmentation.quote",
          accentKey: "augmentation.quoteAccent",
        },
        { kind: "paragraphs", key: "augmentation.lectura" },
        { kind: "emphasis", key: "augmentation.emphasis" },
      ],
    },

    {
      type: "section",
      id: "agency",
      index: "04",
      key: "agency",
      nav: "toc.agency",
      content: [
        { kind: "paragraphs", key: "agency.paragraphs" },
        {
          kind: "inlineHighlight",
          leadKey: "agency.highlightLead",
          termKey: "agency.highlightTerm",
          trailKey: "agency.highlightTrail",
        },
        { kind: "paragraphs", key: "agency.requisitos" },
      ],
    },

    {
      type: "comparison",
      key: "comparison",
      id: "comparacion",
      nav: "toc.comparacion",
    },

    {
      type: "section",
      id: "madurez",
      index: "05",
      key: "madurez",
      nav: "toc.madurez",
      content: [
        { kind: "paragraphs", key: "madurez.paragraphs" },
        { kind: "list", key: "madurez.examples" },
        { kind: "emphasis", key: "madurez.emphasis" },
      ],
    },

    {
      type: "section",
      id: "pregunta",
      index: "06",
      key: "pregunta",
      nav: "toc.pregunta",
      content: [
        { kind: "paragraphs", key: "pregunta.paragraphs" },
        { kind: "list", key: "pregunta.decisiones" },
        { kind: "quote", key: "pregunta.quote" },
      ],
    },

    {
      type: "section",
      id: "humanika",
      index: "07",
      key: "humanika",
      nav: "toc.humanika",
      content: [
        { kind: "paragraphs", key: "humanika.paragraphs" },
        { kind: "list", key: "humanika.niveles" },
        { kind: "paragraphs", key: "humanika.closing" },
        {
          kind: "quote",
          key: "humanika.quote",
          accentKey: "humanika.quoteAccent",
        },
        { kind: "paragraphs", key: "humanika.referencia" },
      ],
    },

    { type: "takeaways", key: "takeaways" },

    { type: "cta", key: "cta" },
  ],
};

export { colaboradoresDigitalesContent };
