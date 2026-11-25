import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import type { GetStaticPropsContext } from "next";

import { ProductsCatalogView } from "@/src/features/products/views/ProductsCatalog.view";
import { PageLayout } from "@/src/shared/layouts/page-layout/PageLayout";
import { productsStaticData } from "@/src/features/products/data/products.registry";
import { buildCollectionJsonLd } from "@/src/shared/helpers/seo/build-collection-json-ld";
import { buildBreadcrumbJsonLd } from "@/src/shared/helpers/seo/build-breadcrumb-json-ld";
import { PageTransition } from "@/src/shared/layouts/pageTransition/PageTransition";

export default function ProductsPage() {
  const { t } = useTranslation("products");

  const jsonLd = [
    buildCollectionJsonLd({
      path: "/productos",
      name: t("catalog.hero.title") as string,
      description: t("catalog.seo.description") as string,
      inLanguage: "es-CO",
      items: productsStaticData.map((entry) => ({
        name: t(`items.${entry.slug}.title`) as string,
        path: `/productos/${entry.slug}`,
      })),
    }),
    buildBreadcrumbJsonLd([
      { name: t("ui.breadcrumbHome") as string, path: "/" },
      { name: t("catalog.hero.eyebrow") as string, path: "/productos" },
    ]),
  ];

  return (
    <PageLayout
      title={t("catalog.seo.title") as string}
      description={t("catalog.seo.description") as string}
      jsonLd={jsonLd}
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
