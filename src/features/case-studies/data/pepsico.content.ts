import type { ArticleContent } from "@/src/features/article/types/article.types";

// Structural schema for the "PepsiCo Colombia — Copa de Sabores" success story.
// It reuses the article block renderer, so every string is resolved from
// public/locales/<locale>/pepsico.json at render time.
const pepsicoContent: ArticleContent = {
  blocks: [
    { type: "hero", image: "/images/productividad-y-opetaciones.jpg" },

    { type: "quote", key: "intro.quote", accentKey: "intro.quoteAccent" },

    {
      type: "section",
      id: "partido-sabor",
      index: "01",
      key: "sabor",
      nav: "toc.sabor",
      content: [
        { kind: "paragraphs", key: "sabor.paragraphs" },
        { kind: "emphasis", key: "sabor.emphasis" },
      ],
    },

    {
      type: "section",
      id: "whatsapp-encuentro",
      index: "02",
      key: "whatsapp",
      nav: "toc.whatsapp",
      content: [
        { kind: "paragraphs", key: "whatsapp.paragraphs" },
        { kind: "list", key: "whatsapp.items" },
        { kind: "paragraphs", key: "whatsapp.closing" },
        { kind: "emphasis", key: "whatsapp.emphasis" },
      ],
    },

    {
      type: "section",
      id: "conocer-gustos",
      index: "03",
      key: "gustos",
      nav: "toc.gustos",
      content: [
        { kind: "paragraphs", key: "gustos.paragraphs" },
        { kind: "emphasis", key: "gustos.emphasis" },
      ],
    },

    {
      type: "section",
      id: "juegos-mundialistas",
      index: "04",
      key: "juegos",
      nav: "toc.juegos",
      content: [
        { kind: "paragraphs", key: "juegos.paragraphs" },
        { kind: "emphasis", key: "juegos.emphasis" },
        { kind: "paragraphs", key: "juegos.closing" },
      ],
    },

    {
      type: "section",
      id: "governance",
      index: "05",
      key: "governance",
      nav: "toc.governance",
      content: [
        { kind: "paragraphs", key: "governance.paragraphs" },
        { kind: "emphasis", key: "governance.emphasis" },
        { kind: "paragraphs", key: "governance.closing" },
      ],
    },

    {
      type: "section",
      id: "lo-que-pasaba-debajo",
      index: "06",
      key: "debajo",
      nav: "toc.debajo",
      content: [
        { kind: "paragraphs", key: "debajo.paragraphs" },
        { kind: "emphasis", key: "debajo.emphasis" },
      ],
    },

    {
      type: "section",
      id: "cierre",
      index: "07",
      key: "cierre",
      nav: "toc.cierre",
      content: [
        { kind: "paragraphs", key: "cierre.paragraphs" },
        { kind: "list", key: "cierre.capabilities" },
        { kind: "paragraphs", key: "cierre.closing" },
        { kind: "emphasis", key: "cierre.finalEmphasis" },
      ],
    },

    { type: "takeaways", key: "takeaways" },

    { type: "cta", key: "cta" },
  ],
};

export { pepsicoContent };
