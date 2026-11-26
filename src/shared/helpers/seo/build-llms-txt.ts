import { SITE_PARENT_ORG, SITE_URL, WHATSAPP_NUMBER } from "@/src/config/site";

type Link = { title: string; path: string; description?: string };
type Section = { title: string; links: Link[] };

type LlmsTxtInput = {
  /** One-paragraph summary shown as the blockquote under the H1. */
  summary: string;
  /** Short factual notes (who, where, how to contact) under the summary. */
  facts: string[];
  sections: Section[];
  /** Sections an agent may skip when it needs a shorter context. */
  optional: Section[];
};

const line = ({ title, path, description }: Link) =>
  `- [${title}](${SITE_URL}${path === "/" ? "" : path})${description ? `: ${description}` : ""}`;

const block = ({ title, links }: Section) => `## ${title}\n\n${links.map(line).join("\n")}`;

/**
 * /llms.txt following the llmstxt.org proposal: H1 → blockquote summary →
 * plain notes → H2 sections of links, with an "Optional" section last.
 * Markdown on purpose: it's meant to be read by language models.
 */
const buildLlmsTxt = ({ summary, facts, sections, optional }: LlmsTxtInput): string =>
  [
    "# Humanika",
    `> ${summary}`,
    [
      ...facts,
      `Humanika es una iniciativa de ${SITE_PARENT_ORG}.`,
      `Contacto comercial: WhatsApp +${WHATSAPP_NUMBER} · ${SITE_URL}`,
    ]
      .map((fact) => `- ${fact}`)
      .join("\n"),
    ...sections.map(block),
    block({ title: "Optional", links: optional.flatMap((s) => s.links) }),
  ].join("\n\n") + "\n";

export { buildLlmsTxt };
export type { LlmsTxtInput, Link as LlmsLink, Section as LlmsSection };
