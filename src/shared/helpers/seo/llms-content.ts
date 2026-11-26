import fs from "node:fs";
import path from "node:path";

import { getSortedArticles } from "@/src/features/article/data/articles.registry";
import { getSortedCaseStudies } from "@/src/features/case-studies/data/case-studies.registry";
import { productsStaticData } from "@/src/features/products/data/products.registry";
import type { LlmsTxtInput } from "@/src/shared/helpers/seo/build-llms-txt";

import products from "@/public/locales/es/products.json";
import plataforma from "@/public/locales/es/plataforma.json";
import empresas from "@/public/locales/es/empresas.json";
import entidadesPublicas from "@/public/locales/es/entidades-publicas.json";
import nosotros from "@/public/locales/es/nosotros.json";
import casos from "@/public/locales/es/casos.json";
import blog from "@/public/locales/es/blog.json";
import privacy from "@/public/locales/es/privacy.json";
import terms from "@/public/locales/es/terms.json";

type SeoCopy = { seo: { title: string; description: string } };
type ProductCopy = { title: string; cardLine: string };

/**
 * Article / case namespaces are one file per slug, read from disk. Server
 * only (called from getServerSideProps); the locale files are shipped with
 * the deploy through `outputFileTracingIncludes` in next.config.ts.
 */
const readNamespace = (slug: string): SeoCopy =>
  JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public/locales/es", `${slug}.json`), "utf8"),
  );

const stripBrand = (title: string) => title.replace(/\s*\|\s*Humanika$/, "");

/**
 * Everything /llms.txt lists, assembled from the same registries and Spanish
 * copy the site renders — so the file can't drift from the real pages.
 */
const buildLlmsContent = (): LlmsTxtInput => {
  const items = products.items as Record<string, ProductCopy>;

  return {
    summary:
      "Humanika diseña, integra y opera agentes de inteligencia artificial (colaboradores digitales) para empresas y entidades públicas. Los agentes trabajan con el conocimiento, los sistemas y los canales de cada organización, con roles y permisos, trazabilidad y revisión humana.",
    facts: [
      "Canales: chat web, WhatsApp Business, Microsoft Teams y voz.",
      "Idiomas de atención: español, inglés y portugués (chat); también francés en voz.",
      "Audiencias: empresas (formación, conocimiento, servicio, ventas, operaciones, marketing) y entidades públicas (atención ciudadana, PQRSD, trámites, contratación pública, proyectos MGA).",
    ],
    sections: [
      {
        title: "Plataforma y audiencias",
        links: [
          { title: stripBrand(plataforma.seo.title), path: "/plataforma", description: plataforma.seo.description },
          { title: stripBrand(empresas.seo.title), path: "/empresas", description: empresas.seo.description },
          { title: stripBrand(entidadesPublicas.seo.title), path: "/entidades-publicas", description: entidadesPublicas.seo.description },
          { title: stripBrand(nosotros.seo.title), path: "/nosotros", description: nosotros.seo.description },
        ],
      },
      {
        title: "Productos",
        links: [
          { title: "Catálogo de soluciones", path: "/productos", description: products.catalog.seo.description },
          ...productsStaticData.map((p) => ({
            title: items[p.slug].title,
            path: `/productos/${p.slug}`,
            description: items[p.slug].cardLine,
          })),
        ],
      },
      {
        title: "Casos de éxito",
        links: getSortedCaseStudies().map((c) => ({
          title: c.client,
          path: `/casos-de-exito/${c.slug}`,
          description: readNamespace(c.slug).seo.description,
        })),
      },
      {
        title: "Artículos",
        links: getSortedArticles().map((a) => ({
          title: stripBrand(readNamespace(a.slug).seo.title),
          path: `/blog/${a.slug}`,
          description: readNamespace(a.slug).seo.description,
        })),
      },
    ],
    optional: [
      {
        title: "Optional",
        links: [
          { title: "Todos los casos de éxito", path: "/casos-de-exito", description: (casos as SeoCopy).seo.description },
          { title: "Todos los artículos", path: "/blog", description: (blog as SeoCopy).seo.description },
          { title: "Política de privacidad", path: "/privacy", description: (privacy as SeoCopy).seo.description },
          { title: "Términos y condiciones", path: "/terms", description: (terms as SeoCopy).seo.description },
        ],
      },
    ],
  };
};

export { buildLlmsContent };
