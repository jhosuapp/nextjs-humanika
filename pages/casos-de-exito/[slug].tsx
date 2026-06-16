import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import type { GetStaticPaths, GetStaticPropsContext } from "next";

import { CaseStudyDetailView } from "@/src/features/case-studies/views/CaseStudyDetail.view";
import {
  getCaseStudyBySlug,
  getCaseStudySlugs,
} from "@/src/features/case-studies/data/case-studies.registry";
import { PageLayout } from "@/src/shared/layouts/page-layout/PageLayout";
import { PageTransition } from "@/src/shared/layouts/pageTransition/PageTransition";

type CaseStudyPageProps = { slug: string };

export default function CaseStudyPage({ slug }: CaseStudyPageProps) {
  // The case's namespace matches its slug; loaded in getStaticProps below.
  const { t } = useTranslation(slug);
  const entry = getCaseStudyBySlug(slug);

  if (!entry) return null;

  return (
    <PageLayout
      title={t("seo.title") as string}
      description={t("seo.description") as string}
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
      ...(await serverSideTranslations(locale ?? "es", ["common", slug])),
    },
  };
}
