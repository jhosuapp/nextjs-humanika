import type { ArticleContent } from "@/src/features/article/types/article.types";

// Structural schema for the "Fuerza laboral híbrida" article. Every string is
// resolved from public/locales/<locale>/fuerza-laboral-hibrida.json at render time.
const fuerzaLaboralHibridaContent: ArticleContent = {
  blocks: [
    { type: "hero", image: "/images/bg-article-4.jpeg" },

    { type: "quote", key: "intro.quote" },

    {
      type: "section",
      id: "transformacion",
      index: "01",
      key: "transformacion",
      nav: "toc.transformacion",
      content: [
        { kind: "paragraphs", key: "transformacion.paragraphs" },
        { kind: "list", key: "transformacion.examples" },
        { kind: "emphasis", key: "transformacion.emphasis" },
      ],
    },

    {
      type: "section",
      id: "diferencia",
      index: "02",
      key: "diferencia",
      nav: "toc.diferencia",
      content: [
        { kind: "paragraphs", key: "diferencia.paragraphs" },
        { kind: "emphasis", key: "diferencia.emphasis" },
      ],
    },

    {
      type: "section",
      id: "workforce",
      index: "03",
      key: "workforce",
      nav: "toc.workforce",
      content: [
        { kind: "paragraphs", key: "workforce.paragraphs" },
        {
          kind: "quote",
          key: "workforce.quote",
          accentKey: "workforce.quoteAccent",
        },
        { kind: "emphasis", key: "workforce.tagline" },
      ],
    },

    { type: "takeaways", key: "takeaways" },

    { type: "cta", key: "cta" },
  ],
};

export { fuerzaLaboralHibridaContent };
