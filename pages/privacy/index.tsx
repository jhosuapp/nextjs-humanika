import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import type { GetStaticPropsContext } from "next";

import { PrivacyView } from "@/src/features/privacy/views/Privacy.view";
import { PageLayout } from "@/src/shared/layouts/page-layout/PageLayout";
import { PageTransition } from "@/src/shared/layouts/pageTransition/PageTransition";

export default function PrivacyPage() {
  const { t } = useTranslation("privacy");

  return (
    <PageLayout
      title={t("seo.title") as string}
      description={t("seo.description") as string}
    >
      <PageTransition>
        <PrivacyView t={t} />
      </PageTransition>
    </PageLayout>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "es", ["common", "privacy"])),
    },
  };
}
