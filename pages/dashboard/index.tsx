import { useTranslation } from "next-i18next/pages";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import type { GetServerSidePropsContext } from "next";

import { DashboardView } from "@/src/features/dashboard/views/Dashboard.view";
import type { ContactsResponse } from "@/src/features/dashboard/validations/contacts-query.validation";
import { PageLayout } from "@/src/shared/layouts/page-layout/PageLayout";
import { PageTransition } from "@/src/shared/layouts/pageTransition/PageTransition";
import { prisma } from "@/src/shared/libs/prisma";
import { isAuthenticated } from "@/src/shared/libs/session";

const PAGE_SIZE = 30;

type DashboardPageProps = {
  initial: ContactsResponse;
};

export default function DashboardPage({ initial }: DashboardPageProps) {
  const { t } = useTranslation("dashboard");
  const { t: tc } = useTranslation("common");

  return (
    <PageLayout
      title={tc("seo.dashboardTitle") as string}
      description={tc("seo.dashboardDescription") as string}
      hasNoIndex
    >
      <PageTransition>
        <DashboardView t={t} initial={initial} />
      </PageTransition>
    </PageLayout>
  );
}

export async function getServerSideProps({
  locale,
  req,
}: GetServerSidePropsContext) {
  if (!isAuthenticated(req)) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  const [items, total] = await prisma.$transaction([
    prisma.contactForm.findMany({
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
    }),
    prisma.contactForm.count(),
  ]);

  const initial: ContactsResponse = {
    items: items.map((it) => ({
      ...it,
      createdAt: it.createdAt.toISOString(),
    })),
    total,
    page: 1,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "es", [
        "common",
        "dashboard",
      ])),
      initial,
    },
  };
}
