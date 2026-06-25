import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import type { GetServerSidePropsContext } from "next";

import { LoginView } from "@/src/features/login/views/Login.view";
import { PageLayout } from "@/src/shared/layouts/page-layout/PageLayout";
import { PageTransition } from "@/src/shared/layouts/pageTransition/PageTransition";
import { isAuthenticated } from "@/src/shared/libs/session";

export default function Login() {
  const { t } = useTranslation("login");
  const { t: tc } = useTranslation("common");

  return (
    <PageLayout
      title={tc("seo.loginTitle") as string}
      description={tc("seo.loginDescription") as string}
      hasNoIndex
    >
      <PageTransition>
        <LoginView t={t} />
      </PageTransition>
    </PageLayout>
  );
}

export async function getServerSideProps({
  locale,
  req,
}: GetServerSidePropsContext) {
  if (isAuthenticated(req)) {
    return {
      redirect: { destination: "/dashboard", permanent: false },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "es", ["common", "login"])),
    },
  };
}
