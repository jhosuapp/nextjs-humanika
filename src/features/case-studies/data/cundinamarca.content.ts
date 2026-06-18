import type { ArticleContent } from "@/src/features/article/types/article.types";

// Structural schema for the "Universidad de Cundinamarca — WhatsApp como motor de
// inscripción para posgrados" success story. It reuses the article block
// renderer, so every string is resolved from
// public/locales/<locale>/cundinamarca.json at render time.
const cundinamarcaContent: ArticleContent = {
  blocks: [
    { type: "hero", image: "/images/servicio-y-soporte.jpg" },

    { type: "quote", key: "intro.quote" },

    {
      type: "section",
      id: "el-reto",
      index: "01",
      key: "reto",
      nav: "toc.reto",
      content: [
        { kind: "paragraphs", key: "reto.paragraphs" },
        { kind: "emphasis", key: "reto.emphasis" },
      ],
    },

    {
      type: "section",
      id: "whatsapp",
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
      id: "caracterizacion",
      index: "03",
      key: "leads",
      nav: "toc.leads",
      content: [
        { kind: "list", key: "leads.items" },
        { kind: "paragraphs", key: "leads.paragraphs" },
        { kind: "emphasis", key: "leads.emphasis" },
      ],
    },

    {
      type: "section",
      id: "crm",
      index: "04",
      key: "crm",
      nav: "toc.crm",
      content: [
        { kind: "paragraphs", key: "crm.paragraphs" },
        { kind: "emphasis", key: "crm.emphasis" },
        { kind: "paragraphs", key: "crm.closing" },
      ],
    },

    {
      type: "section",
      id: "timing",
      index: "05",
      key: "timing",
      nav: "toc.timing",
      content: [
        { kind: "paragraphs", key: "timing.paragraphs" },
        { kind: "emphasis", key: "timing.emphasis" },
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
        { kind: "list", key: "resultados.capabilities" },
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
        { kind: "emphasis", key: "cierre.emphasis" },
      ],
    },

    { type: "takeaways", key: "takeaways" },

    { type: "cta", key: "cta" },
  ],
};

export { cundinamarcaContent };
