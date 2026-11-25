import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import type { GetStaticPropsContext } from "next";

import { createLandingPage } from "@/src/features/landing/helpers/create-landing-page";
import { entidadesPublicasStaticData } from "@/src/features/landing/data/entidades-publicas.content";

export default createLandingPage(entidadesPublicasStaticData);

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "es", ["common", entidadesPublicasStaticData.namespace])),
    },
  };
}
