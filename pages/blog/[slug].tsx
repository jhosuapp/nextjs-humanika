import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import type { GetStaticPaths, GetStaticPropsContext } from "next";

import { ArticleRenderer } from "@/src/features/article/renderer/ArticleRenderer";
import {
  getArticleBySlug,
  getArticleSlugs,
} from "@/src/features/article/data/articles.registry";
import { PageLayout } from "@/src/shared/layouts/page-layout/PageLayout";
import { buildArticleJsonLd } from "@/src/shared/helpers/seo/build-article-json-ld";
import { buildBreadcrumbJsonLd } from "@/src/shared/helpers/seo/build-breadcrumb-json-ld";
import { SITE_URL } from "@/src/config/site";
import { PageTransition } from "@/src/shared/layouts/pageTransition/PageTransition";

type ArticlePageProps = { slug: string };

export default function ArticlePage({ slug }: ArticlePageProps) {
  // The article's namespace matches its slug; loaded in getStaticProps below.
  const { t } = useTranslation(slug);
  const article = getArticleBySlug(slug);

  if (!article) return null;

  const path = `/blog/${slug}`;
  const headline = [
    t("hero.titleLead"),
    t("hero.titleAccent"),
    t("hero.titleTrail"),
  ]
    .join("")
    .trim();
  const jsonLd = [
    buildArticleJsonLd({
      type: "BlogPosting",
      path,
      headline,
      description: t("seo.description") as string,
      image: article.cover,
      datePublished: article.publishedAt,
      inLanguage: "es-CO",
    }),
    buildBreadcrumbJsonLd([
      { name: t("common:nav.bot") as string, path: "/" },
      { name: t("common:nav.articles") as string, path: "/blog" },
      { name: headline, path },
    ]),
  ];

  return (
    <PageLayout
      title={t("seo.title") as string}
      description={t("seo.description") as string}
      image={`${SITE_URL}${article.cover}`}
      ogType="article"
      publishedTime={article.publishedAt}
      jsonLd={jsonLd}
    >
      <PageTransition>
        <ArticleRenderer t={t} content={article.content} />
      </PageTransition>
    </PageLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getArticleSlugs().map((slug) => ({ params: { slug } })),
  fallback: false,
});

export async function getStaticProps({
  params,
  locale,
}: GetStaticPropsContext) {
  const slug = String(params?.slug);

  // Unknown slug → 404 (fallback is false, so this is defensive only).
  if (!getArticleBySlug(slug)) return { notFound: true };

  return {
    props: {
      slug,
      ...(await serverSideTranslations(locale ?? "es", ["common", slug])),
    },
  };
}
