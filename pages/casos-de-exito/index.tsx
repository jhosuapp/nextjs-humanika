import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import type { GetStaticPropsContext } from "next";

import { CaseStudiesView } from "@/src/features/case-studies/views/CaseStudies.view";
import { getCaseStudySlugs } from "@/src/features/case-studies/data/case-studies.registry";
import { PageLayout } from "@/src/shared/layouts/page-layout/PageLayout";
import { PageTransition } from "@/src/shared/layouts/pageTransition/PageTransition";

export default function CaseStudiesPage() {
  // `casos` is the listing's own namespace; each case namespace is also loaded
  // (see getStaticProps) so the cards can read each case's hero copy.
  const { t } = useTranslation("casos");

  return (
    <PageLayout
      title={t("seo.title") as string}
      description={t("seo.description") as string}
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
