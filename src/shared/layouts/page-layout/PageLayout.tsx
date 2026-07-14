import type { ReactNode } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import {
  SITE_DESCRIPTION,
  SITE_LINKEDIN,
  SITE_LOGO,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_OG_IMAGE_HEIGHT,
  SITE_OG_IMAGE_TYPE,
  SITE_OG_IMAGE_WIDTH,
  SITE_PARENT_ORG,
  SITE_URL,
} from "@/src/config/site";

const OG_LOCALE_MAP: Record<string, string> = {
  es: "es_ES",
  en: "en_US",
  pt: "pt_PT",
  fr: "fr_FR",
  de: "de_DE",
};

type PageLayoutProps = {
  children: ReactNode;
  title: string;
  description: string;
  image?: string;
  hasNoIndex?: boolean;
};

const PageLayout = ({
  children,
  title,
  description,
  image = SITE_OG_IMAGE,
  hasNoIndex = false,
}: PageLayoutProps) => {
  const router = useRouter();
  const locale = router.locale ?? "es";
  const localePath = locale !== "es" ? `/${locale}` : "";
  const canonicalPath = router.asPath.split("?")[0];
  const canonicalUrl = `${SITE_URL}${localePath}${canonicalPath === "/" ? "" : canonicalPath}`;
  const ogLocale = OG_LOCALE_MAP[locale] ?? "es_ES";
  // Las dimensiones/tipo declaradas corresponden a la imagen por defecto; si una
  // página pasa su propia imagen, se omiten para no declarar valores incorrectos.
  const isDefaultImage = image === SITE_OG_IMAGE;

  // Grafo de datos estructurados (JSON-LD) compartido por todo el sitio. Ayuda a
  // buscadores y a motores generativos (GEO) a entender qué es Humanika.
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: SITE_LOGO,
        image: SITE_OG_IMAGE,
        description: SITE_DESCRIPTION,
        parentOrganization: { "@type": "Organization", name: SITE_PARENT_ORG },
        sameAs: [SITE_LINKEDIN],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        inLanguage: locale,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content={ogLocale} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:image:alt" content={title} />
        {isDefaultImage && (
          <>
            <meta property="og:image:type" content={SITE_OG_IMAGE_TYPE} />
            <meta
              property="og:image:width"
              content={String(SITE_OG_IMAGE_WIDTH)}
            />
            <meta
              property="og:image:height"
              content={String(SITE_OG_IMAGE_HEIGHT)}
            />
          </>
        )}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        <meta
          name="robots"
          content={hasNoIndex ? "noindex, follow" : "index, follow"}
        />
        <meta name="theme-color" content="#ffffff" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      {children}
    </>
  );
};

export { PageLayout };
