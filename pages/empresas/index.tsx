import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import type { GetStaticPropsContext } from "next";

import { createLandingPage } from "@/src/features/landing/helpers/create-landing-page";
import { empresasStaticData } from "@/src/features/landing/data/empresas.content";

export default createLandingPage(empresasStaticData);

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "es", ["common", empresasStaticData.namespace])),
    },
  };
}
