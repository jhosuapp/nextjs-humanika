import type { ArticleContent } from "@/src/features/article/types/article.types";

// Structural schema for the "Festival del Pollo Colombiano — el pollo encontró su
// ruta en WhatsApp" success story. It reuses the article block renderer, so every
// string is resolved from public/locales/<locale>/festival-pollo.json at render time.
const festivalPolloContent: ArticleContent = {
  blocks: [
    { type: "hero", image: "/images/formacion-empresarial.jpg" },

    { type: "quote", key: "intro.quote", accentKey: "intro.quoteAccent" },

    {
      type: "section",
      id: "receta",
      index: "01",
      key: "receta",
      nav: "toc.receta",
      content: [
        { kind: "paragraphs", key: "receta.paragraphs" },
        { kind: "emphasis", key: "receta.emphasis" },
        { kind: "paragraphs", key: "receta.closing" },
      ],
    },

    {
      type: "section",
      id: "restaurante",
      index: "02",
      key: "restaurante",
      nav: "toc.restaurante",
      content: [
        { kind: "paragraphs", key: "restaurante.paragraphs" },
        { kind: "emphasis", key: "restaurante.emphasis" },
      ],
    },

    {
      type: "section",
      id: "categoria",
      index: "03",
      key: "categoria",
      nav: "toc.categoria",
      content: [
        { kind: "paragraphs", key: "categoria.paragraphs" },
        { kind: "emphasis", key: "categoria.emphasis" },
        { kind: "paragraphs", key: "categoria.closing" },
      ],
    },

    {
      type: "section",
      id: "guia",
      index: "04",
      key: "guia",
      nav: "toc.guia",
      content: [
        { kind: "paragraphs", key: "guia.paragraphs" },
        { kind: "list", key: "guia.items" },
        { kind: "paragraphs", key: "guia.closing" },
        { kind: "emphasis", key: "guia.emphasis" },
      ],
    },

    {
      type: "section",
      id: "debajo",
      index: "05",
      key: "debajo",
      nav: "toc.debajo",
      content: [
        { kind: "paragraphs", key: "debajo.paragraphs" },
        { kind: "emphasis", key: "debajo.emphasis" },
      ],
    },

    {
      type: "section",
      id: "insights",
      index: "06",
      key: "insights",
      nav: "toc.insights",
      content: [
        { kind: "paragraphs", key: "insights.paragraphs" },
        { kind: "list", key: "insights.items" },
        { kind: "paragraphs", key: "insights.closing" },
        { kind: "emphasis", key: "insights.emphasis" },
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
        { kind: "emphasis", key: "cierre.emphasis" },
      ],
    },

    { type: "takeaways", key: "takeaways" },

    { type: "cta", key: "cta" },
  ],
};

export { festivalPolloContent };
