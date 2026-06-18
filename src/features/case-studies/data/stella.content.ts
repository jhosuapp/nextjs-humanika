import type { ArticleContent } from "@/src/features/article/types/article.types";

// Structural schema for the "Stella Artois Perfect Serve" success story. It
// reuses the article block renderer, so every string is resolved from
// public/locales/<locale>/stella.json at render time.
const stellaContent: ArticleContent = {
  blocks: [
    { type: "hero", image: "/images/contociento-organizacional.jpg" },

    { type: "quote", key: "intro.quote", accentKey: "intro.quoteAccent" },

    {
      type: "section",
      id: "wimbledon",
      index: "01",
      key: "wimbledon",
      nav: "toc.wimbledon",
      content: [
        { kind: "paragraphs", key: "wimbledon.paragraphs" },
        { kind: "list", key: "wimbledon.items" },
        { kind: "emphasis", key: "wimbledon.emphasis" },
      ],
    },

    {
      type: "section",
      id: "gamification",
      index: "02",
      key: "gamification",
      nav: "toc.gamification",
      content: [
        { kind: "paragraphs", key: "gamification.paragraphs" },
        { kind: "emphasis", key: "gamification.emphasis" },
      ],
    },

    {
      type: "section",
      id: "whatsapp",
      index: "03",
      key: "whatsapp",
      nav: "toc.whatsapp",
      content: [
        { kind: "paragraphs", key: "whatsapp.paragraphs" },
        { kind: "emphasis", key: "whatsapp.emphasis" },
        { kind: "paragraphs", key: "whatsapp.closing" },
      ],
    },

    {
      type: "section",
      id: "insights",
      index: "04",
      key: "insights",
      nav: "toc.insights",
      content: [
        { kind: "paragraphs", key: "insights.paragraphs" },
        { kind: "emphasis", key: "insights.emphasis" },
        { kind: "paragraphs", key: "insights.closing" },
      ],
    },

    {
      type: "section",
      id: "ensenar",
      index: "05",
      key: "ensenar",
      nav: "toc.ensenar",
      content: [
        { kind: "paragraphs", key: "ensenar.paragraphs" },
        { kind: "emphasis", key: "ensenar.emphasis" },
      ],
    },

    {
      type: "section",
      id: "humanika",
      index: "06",
      key: "humanika",
      nav: "toc.humanika",
      content: [
        { kind: "paragraphs", key: "humanika.paragraphs" },
        { kind: "emphasis", key: "humanika.emphasis" },
        { kind: "paragraphs", key: "humanika.closing" },
        { kind: "list", key: "humanika.capabilities" },
      ],
    },

    { type: "takeaways", key: "takeaways" },

    { type: "cta", key: "cta" },
  ],
};

export { stellaContent };
