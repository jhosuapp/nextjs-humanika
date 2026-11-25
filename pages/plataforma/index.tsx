import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import type { GetStaticPropsContext } from "next";

import { createLandingPage } from "@/src/features/landing/helpers/create-landing-page";
import { plataformaStaticData } from "@/src/features/landing/data/plataforma.content";

export default createLandingPage(plataformaStaticData);

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "es", ["common", plataformaStaticData.namespace])),
    },
  };
}
