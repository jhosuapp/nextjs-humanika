import { useTranslation } from "next-i18next/pages";

import type { LandingStaticData } from "@/src/features/landing/types/landing.types";
import { LandingView } from "@/src/features/landing/views/Landing.view";
import { buildBreadcrumbJsonLd } from "@/src/shared/helpers/seo/build-breadcrumb-json-ld";
import { PageLayout } from "@/src/shared/layouts/page-layout/PageLayout";
import { PageTransition } from "@/src/shared/layouts/pageTransition/PageTransition";

/**
 * Builds the page component for a landing. `getStaticProps` must stay in each
 * `pages/<namespace>/index.tsx`: Next only strips it (and its server-only
 * imports such as `fs`) from the client bundle when it's defined in the page.
 */
const createLandingPage = (data: LandingStaticData) => {
  const { namespace } = data;

  const LandingPage = () => {
    const { t } = useTranslation(namespace);

    const jsonLd = [
      buildBreadcrumbJsonLd([
        { name: t("common:nav.bot") as string, path: "/" },
        { name: t("breadcrumb") as string, path: `/${namespace}` },
      ]),
    ];

    return (
      <PageLayout
        title={t("seo.title") as string}
        description={t("seo.description") as string}
        jsonLd={jsonLd}
      >
        <PageTransition>
          <LandingView t={t} data={data} />
        </PageTransition>
      </PageLayout>
    );
  };

  return LandingPage;
};

export { createLandingPage };
