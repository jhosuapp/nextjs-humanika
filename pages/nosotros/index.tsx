import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import type { GetStaticPropsContext } from "next";

import { createLandingPage } from "@/src/features/landing/helpers/create-landing-page";
import { nosotrosStaticData } from "@/src/features/landing/data/nosotros.content";

export default createLandingPage(nosotrosStaticData);

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "es", ["common", nosotrosStaticData.namespace])),
    },
  };
}
