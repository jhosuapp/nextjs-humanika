import type { ArticleContent } from "@/src/features/article/types/article.types";

// Structural schema for the "Cerveza Águila — el Mundial por WhatsApp" success
// story. It reuses the article block renderer, so every string is resolved from
// public/locales/<locale>/aguila.json at render time.
const aguilaContent: ArticleContent = {
  blocks: [
    { type: "hero", image: "/images/servicio-y-soporte.jpg" },

    { type: "quote", key: "intro.quote", accentKey: "intro.quoteAccent" },

    {
      type: "section",
      id: "canal-vivo",
      index: "01",
      key: "canal",
      nav: "toc.canal",
      content: [{ kind: "paragraphs", key: "canal.paragraphs" }],
    },

    {
      type: "section",
      id: "detras",
      index: "02",
      key: "detras",
      nav: "toc.detras",
      content: [
        { kind: "paragraphs", key: "detras.paragraphs" },
        { kind: "list", key: "detras.items" },
        { kind: "emphasis", key: "detras.emphasis" },
      ],
    },

    {
      type: "section",
      id: "resultados",
      index: "03",
      key: "resultados",
      nav: "toc.resultados",
      content: [{ kind: "paragraphs", key: "resultados.paragraphs" }],
    },

    {
      type: "section",
      id: "humanika",
      index: "04",
      key: "humanika",
      nav: "toc.humanika",
      content: [
        { kind: "paragraphs", key: "humanika.paragraphs" },
        { kind: "emphasis", key: "humanika.emphasis" },
        { kind: "paragraphs", key: "humanika.closing" },
      ],
    },

    { type: "takeaways", key: "takeaways" },

    { type: "cta", key: "cta" },
  ],
};

export { aguilaContent };
