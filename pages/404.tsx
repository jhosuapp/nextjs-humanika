import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import type { GetStaticPropsContext } from "next";

import { NotFoundView } from "@/src/features/not-found/views/NotFound.view";
import { PageLayout } from "@/src/shared/layouts/page-layout/PageLayout";
import { PageTransition } from "@/src/shared/layouts/pageTransition/PageTransition";

export default function NotFoundPage() {
  const { t } = useTranslation("common");

  return (
    <PageLayout
      title={t("notFound.seoTitle") as string}
      description={t("notFound.seoDescription") as string}
      hasNoIndex
    >
      <PageTransition>
        <NotFoundView t={t} />
      </PageTransition>
    </PageLayout>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "es", ["common"])),
    },
  };
}
