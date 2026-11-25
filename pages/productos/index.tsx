import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import type { GetStaticPropsContext } from "next";

import { ProductsCatalogView } from "@/src/features/products/views/ProductsCatalog.view";
import { PageLayout } from "@/src/shared/layouts/page-layout/PageLayout";
import { PageTransition } from "@/src/shared/layouts/pageTransition/PageTransition";

export default function ProductsPage() {
  const { t } = useTranslation("products");

  return (
    <PageLayout
      title={t("catalog.seo.title") as string}
      description={t("catalog.seo.description") as string}
    >
      <PageTransition>
        <ProductsCatalogView t={t} />
      </PageTransition>
    </PageLayout>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "es", ["common", "products"])),
    },
  };
}
