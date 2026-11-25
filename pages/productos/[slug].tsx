import { useRouter } from "next/router";
import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import type { GetStaticPaths, GetStaticPropsContext } from "next";

import { ProductDetailView } from "@/src/features/products/views/ProductDetail.view";
import {
  getProductBySlug,
  getProductSlugs,
} from "@/src/features/products/data/products.registry";
import { buildProductJsonLd } from "@/src/features/products/helpers/build-product-json-ld";
import { SITE_URL } from "@/src/config/site";
import { PageLayout } from "@/src/shared/layouts/page-layout/PageLayout";
import { PageTransition } from "@/src/shared/layouts/pageTransition/PageTransition";

type ProductPageProps = { slug: string };

export default function ProductPage({ slug }: ProductPageProps) {
  const { t } = useTranslation("products");
  const { locale } = useRouter();
  const entry = getProductBySlug(slug);

  if (!entry) return null;

  const jsonLd = buildProductJsonLd({
    slug,
    name: t(`items.${slug}.title`) as string,
    description: t(`items.${slug}.description`) as string,
    category: t(`categories.${entry.category}`) as string,
    image: entry.image,
    homeLabel: t("ui.breadcrumbHome") as string,
    catalogLabel: t("catalog.hero.eyebrow") as string,
    localePath: locale && locale !== "es" ? `/${locale}` : "",
  });

  return (
    <PageLayout
      title={t(`items.${slug}.seo.title`) as string}
      description={t(`items.${slug}.seo.description`) as string}
      image={`${SITE_URL}${entry.image}`}
      jsonLd={jsonLd}
    >
      <PageTransition>
        <ProductDetailView t={t} entry={entry} />
      </PageTransition>
    </PageLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getProductSlugs().map((slug) => ({ params: { slug } })),
  fallback: false,
});

export async function getStaticProps({
  params,
  locale,
}: GetStaticPropsContext) {
  const slug = String(params?.slug);

  if (!getProductBySlug(slug)) return { notFound: true };

  return {
    props: {
      slug,
      ...(await serverSideTranslations(locale ?? "es", ["common", "products"])),
    },
  };
}
