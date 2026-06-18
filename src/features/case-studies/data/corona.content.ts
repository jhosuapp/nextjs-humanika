import type { ArticleContent } from "@/src/features/article/types/article.types";

// Structural schema for the "Cerveza Corona México — el Mundial, las corcholatas
// y una conversación que movió millones" success story. It reuses the article
// block renderer, so every string is resolved from
// public/locales/<locale>/corona.json at render time.
const coronaContent: ArticleContent = {
  blocks: [
    { type: "hero", image: "/images/ventas-y-crecimiento.jpg" },

    { type: "quote", key: "intro.quote", accentKey: "intro.quoteAccent" },

    {
      type: "section",
      id: "puerta-de-entrada",
      index: "01",
      key: "corcholata",
      nav: "toc.corcholata",
      content: [
        { kind: "paragraphs", key: "corcholata.paragraphs" },
        { kind: "list", key: "corcholata.items" },
        { kind: "emphasis", key: "corcholata.emphasis" },
      ],
    },

    {
      type: "section",
      id: "premios-localizacion",
      index: "02",
      key: "premios",
      nav: "toc.premios",
      content: [
        { kind: "paragraphs", key: "premios.paragraphs" },
        { kind: "emphasis", key: "premios.emphasis" },
      ],
    },

    {
      type: "section",
      id: "gamification",
      index: "03",
      key: "gamification",
      nav: "toc.gamification",
      content: [
        { kind: "paragraphs", key: "gamification.paragraphs" },
        { kind: "emphasis", key: "gamification.emphasis" },
        { kind: "paragraphs", key: "gamification.closing" },
      ],
    },

    {
      type: "section",
      id: "avatares",
      index: "04",
      key: "avatares",
      nav: "toc.avatares",
      content: [
        { kind: "paragraphs", key: "avatares.paragraphs" },
        { kind: "emphasis", key: "avatares.emphasis" },
        { kind: "paragraphs", key: "avatares.closing" },
      ],
    },

    {
      type: "section",
      id: "whatsapp-os",
      index: "05",
      key: "whatsapp",
      nav: "toc.whatsapp",
      content: [
        { kind: "paragraphs", key: "whatsapp.paragraphs" },
        { kind: "emphasis", key: "whatsapp.emphasis" },
      ],
    },

    {
      type: "section",
      id: "resultados",
      index: "06",
      key: "resultados",
      nav: "toc.resultados",
      content: [
        { kind: "paragraphs", key: "resultados.paragraphs" },
        { kind: "emphasis", key: "resultados.emphasis" },
      ],
    },

    {
      type: "section",
      id: "insights",
      index: "07",
      key: "insights",
      nav: "toc.insights",
      content: [
        { kind: "paragraphs", key: "insights.paragraphs" },
        { kind: "emphasis", key: "insights.emphasis" },
      ],
    },

    {
      type: "section",
      id: "cierre",
      index: "08",
      key: "cierre",
      nav: "toc.cierre",
      content: [
        { kind: "paragraphs", key: "cierre.paragraphs" },
        { kind: "list", key: "cierre.layers" },
        { kind: "paragraphs", key: "cierre.connection" },
        { kind: "emphasis", key: "cierre.emphasis" },
        { kind: "paragraphs", key: "cierre.closing" },
        { kind: "emphasis", key: "cierre.finalEmphasis" },
      ],
    },

    { type: "takeaways", key: "takeaways" },

    { type: "cta", key: "cta" },
  ],
};

export { coronaContent };
