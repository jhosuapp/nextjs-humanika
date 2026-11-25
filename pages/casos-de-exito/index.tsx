import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import type { GetStaticPropsContext } from "next";

import { CaseStudiesView } from "@/src/features/case-studies/views/CaseStudies.view";
import {
  getCaseStudySlugs,
  getSortedCaseStudies,
} from "@/src/features/case-studies/data/case-studies.registry";
import { buildCollectionJsonLd } from "@/src/shared/helpers/seo/build-collection-json-ld";
import { buildBreadcrumbJsonLd } from "@/src/shared/helpers/seo/build-breadcrumb-json-ld";
import { PageLayout } from "@/src/shared/layouts/page-layout/PageLayout";
import { PageTransition } from "@/src/shared/layouts/pageTransition/PageTransition";

export default function CaseStudiesPage() {
  // `casos` is the listing's own namespace; each case namespace is also loaded
  // (see getStaticProps) so the cards can read each case's hero copy.
  const { t } = useTranslation("casos");

  const jsonLd = [
    buildCollectionJsonLd({
      path: "/casos-de-exito",
      name: t("hero.title") as string,
      description: t("seo.description") as string,
      inLanguage: "es-CO",
      items: getSortedCaseStudies().map((entry) => ({
        name: entry.client,
        path: `/casos-de-exito/${entry.slug}`,
      })),
    }),
    buildBreadcrumbJsonLd([
      { name: t("common:nav.bot") as string, path: "/" },
      { name: t("common:nav.caseStudies") as string, path: "/casos-de-exito" },
    ]),
  ];

  return (
    <PageLayout
      title={t("seo.title") as string}
      description={t("seo.description") as string}
      jsonLd={jsonLd}
    >
      <PageTransition>
        <CaseStudiesView t={t} />
      </PageTransition>
    </PageLayout>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "es", [
        "common",
        "casos",
        ...getCaseStudySlugs(),
      ])),
    },
  };
}
