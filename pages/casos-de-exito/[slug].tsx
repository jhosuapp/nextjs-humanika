import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import type { GetStaticPaths, GetStaticPropsContext } from "next";

import { CaseStudyDetailView } from "@/src/features/case-studies/views/CaseStudyDetail.view";
import {
  getCaseStudyBySlug,
  getCaseStudySlugs,
} from "@/src/features/case-studies/data/case-studies.registry";
import { PageLayout } from "@/src/shared/layouts/page-layout/PageLayout";
import { SITE_URL } from "@/src/config/site";
import { buildArticleJsonLd } from "@/src/shared/helpers/seo/build-article-json-ld";
import { buildBreadcrumbJsonLd } from "@/src/shared/helpers/seo/build-breadcrumb-json-ld";
import { PageTransition } from "@/src/shared/layouts/pageTransition/PageTransition";

type CaseStudyPageProps = { slug: string };

export default function CaseStudyPage({ slug }: CaseStudyPageProps) {
  // The case's namespace matches its slug; loaded in getStaticProps below.
  const { t } = useTranslation(slug);
  const entry = getCaseStudyBySlug(slug);

  if (!entry) return null;

  const path = `/casos-de-exito/${slug}`;
  const headline = t("hero.title") as string;
  const jsonLd = [
    buildArticleJsonLd({
      type: "Article",
      path,
      headline,
      description: t("seo.description") as string,
      image: entry.cover,
      datePublished: entry.publishedAt,
      about: entry.client,
      authorIsParentOrg: true,
      inLanguage: "es-CO",
    }),
    buildBreadcrumbJsonLd([
      { name: t("common:nav.bot") as string, path: "/" },
      { name: t("common:nav.caseStudies") as string, path: "/casos-de-exito" },
      { name: entry.client, path },
    ]),
  ];

  return (
    <PageLayout
      title={t("seo.title") as string}
      description={t("seo.description") as string}
      image={`${SITE_URL}${entry.cover}`}
      ogType="article"
      publishedTime={entry.publishedAt}
      jsonLd={jsonLd}
    >
      <PageTransition>
        <CaseStudyDetailView t={t} entry={entry} />
      </PageTransition>
    </PageLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getCaseStudySlugs().map((slug) => ({ params: { slug } })),
  fallback: false,
});

export async function getStaticProps({
  params,
  locale,
}: GetStaticPropsContext) {
  const slug = String(params?.slug);

  // Unknown slug → 404 (fallback is false, so this is defensive only).
  if (!getCaseStudyBySlug(slug)) return { notFound: true };

  return {
    props: {
      slug,
      // Load every case namespace too, so the "related cases" section can read
      // each card's copy cross-namespace (same pattern as the listing page).
      ...(await serverSideTranslations(locale ?? "es", [
        "common",
        slug,
        ...getCaseStudySlugs(),
      ])),
    },
  };
}
