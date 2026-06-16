import {
  faGraduationCap,
  faBuilding,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

import type { ArticleContent } from "@/src/features/article/types/article.types";

// Structural schema for the "Agentes de IA para empresas" article. Every string
// is resolved from public/locales/<locale>/agentes-ia-empresas.json at render time.
const agentesIaEmpresasContent: ArticleContent = {
  blocks: [
    { type: "hero", image: "/images/bg-update.jpg" },

    { type: "quote", key: "intro.quote" },

    {
      type: "comparison",
      key: "comparison",
      id: "chatbot-vs-agente",
      nav: "toc.comparacion",
    },

    {
      type: "section",
      id: "cuello-botella",
      index: "01",
      key: "cuello",
      nav: "toc.cuello",
      content: [
        { kind: "paragraphs", key: "cuello.paragraphs" },
        { kind: "list", key: "cuello.bottlenecks" },
        { kind: "emphasis", key: "cuello.emphasis" },
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
        { kind: "list", key: "diferencia.capabilities" },
        { kind: "emphasis", key: "diferencia.emphasis" },
      ],
    },

    {
      type: "section",
      id: "documento-accion",
      index: "03",
      key: "documento",
      nav: "toc.documento",
      content: [
        { kind: "paragraphs", key: "documento.paragraphs" },
        { kind: "list", key: "documento.triggers" },
        { kind: "paragraphs", key: "documento.flow" },
        {
          kind: "inlineHighlight",
          leadKey: "documento.highlightLead",
          termKey: "documento.highlightTerm",
          trailKey: "documento.highlightTrail",
        },
      ],
    },

    {
      type: "iconGrid",
      id: "donde-aporta",
      key: "domains",
      nav: "toc.donde",
      items: [
        { key: "educacion", icon: faGraduationCap },
        { key: "empresas", icon: faBuilding },
        { key: "gobierno", icon: faShieldHalved },
      ],
    },

    {
      type: "section",
      id: "educacion",
      index: "04",
      key: "educacion",
      nav: "toc.educacion",
      content: [
        { kind: "paragraphs", key: "educacion.paragraphs" },
        { kind: "list", key: "educacion.useCases" },
        { kind: "paragraphs", key: "educacion.examples" },
        { kind: "emphasis", key: "educacion.emphasis" },
      ],
    },

    {
      type: "section",
      id: "empresas",
      index: "05",
      key: "empresas",
      nav: "toc.empresas",
      content: [
        { kind: "paragraphs", key: "empresas.paragraphs" },
        { kind: "list", key: "empresas.useCases" },
        { kind: "paragraphs", key: "empresas.examples" },
      ],
    },

    {
      type: "section",
      id: "gobierno",
      index: "06",
      key: "gobierno",
      nav: "toc.gobierno",
      content: [
        { kind: "paragraphs", key: "gobierno.paragraphs" },
        { kind: "list", key: "gobierno.rules" },
        {
          kind: "quote",
          key: "gobierno.quote",
          accentKey: "gobierno.quoteAccent",
        },
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
        {
          kind: "inlineHighlight",
          leadKey: "humanika.highlightLead",
          termKey: "humanika.highlightTerm",
          trailKey: "humanika.highlightTrail",
        },
        { kind: "paragraphs", key: "humanika.future" },
        {
          kind: "quote",
          key: "humanika.quote",
          accentKey: "humanika.quoteAccent",
        },
        { kind: "paragraphs", key: "humanika.closing" },
      ],
    },

    { type: "takeaways", key: "takeaways" },

    { type: "cta", key: "cta" },
  ],
};

export { agentesIaEmpresasContent };
