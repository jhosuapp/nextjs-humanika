import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import type { GetStaticPropsContext } from "next";

import { BlogView } from "@/src/features/blog/views/Blog.view";
import {
  getArticleSlugs,
  getSortedArticles,
} from "@/src/features/article/data/articles.registry";
import { buildCollectionJsonLd } from "@/src/shared/helpers/seo/build-collection-json-ld";
import { buildBreadcrumbJsonLd } from "@/src/shared/helpers/seo/build-breadcrumb-json-ld";
import { PageLayout } from "@/src/shared/layouts/page-layout/PageLayout";
import { PageTransition } from "@/src/shared/layouts/pageTransition/PageTransition";

export default function BlogPage() {
  // `blog` is the listing's own namespace; each article namespace is also loaded
  // (see getStaticProps) so the cards can read each article's hero copy.
  const { t } = useTranslation("blog");

  const jsonLd = [
    buildCollectionJsonLd({
      path: "/blog",
      name: t("hero.title") as string,
      description: t("seo.description") as string,
      inLanguage: "es-CO",
      items: getSortedArticles().map((article) => ({
        name: t(`${article.slug}:seo.title`) as string,
        path: `/blog/${article.slug}`,
      })),
    }),
    buildBreadcrumbJsonLd([
      { name: t("common:nav.bot") as string, path: "/" },
      { name: t("common:nav.articles") as string, path: "/blog" },
    ]),
  ];

  return (
    <PageLayout
      title={t("seo.title") as string}
      description={t("seo.description") as string}
      jsonLd={jsonLd}
    >
      <PageTransition>
        <BlogView t={t} />
      </PageTransition>
    </PageLayout>
  );
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "es", [
        "common",
        "blog",
        ...getArticleSlugs(),
      ])),
    },
  };
}
