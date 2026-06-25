import type { JSX } from "react";

import { useRouter } from "next/router";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

import { Container } from "@/src/features/home/components/container/Container";
import { Button } from "@/src/shared/components/button/Button";
import { FadeIn } from "@/src/shared/components/motion/FadeIn";
import { Text } from "@/src/shared/components/text/Text";
import { WrapperMotion } from "@/src/shared/components/wrapper-motion/WrapperMotion";
import { api } from "@/src/shared/api/index.api";
import type { ITranslations } from "@/src/shared/interfaces/i18n.interface";

import { ContactsFilters } from "../components/contacts-filters/ContactsFilters";
import { ContactsPagination } from "../components/contacts-pagination/ContactsPagination";
import { ContactsStatus } from "../components/contacts-status/ContactsStatus";
import { ContactsTable } from "../components/contacts-table/ContactsTable";
import {
  DEFAULT_PAGE_SIZE,
  useDashboardContactsQuery,
} from "../hooks/useDashboardContacts.query";
import { useDashboardFiltersController } from "../hooks/useDashboardFilters.controller";
import type { ContactsResponse } from "../validations/contacts-query.validation";

import styles from "./dashboard.module.css";

type DashboardViewProps = {
  t: ITranslations;
  initial: ContactsResponse;
};

const DashboardView = ({ t, initial }: DashboardViewProps): JSX.Element => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      router.push("/login");
    }
  };

  const {
    search,
    setSearch,
    debouncedSearch,
    from,
    setFrom,
    to,
    setTo,
    page,
    setPage,
    reset,
  } = useDashboardFiltersController();

  const { data, isLoading, isFetching } = useDashboardContactsQuery({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: debouncedSearch,
    from,
    to,
    initialData: initial,
  });

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? initial.totalPages;
  const total = data?.total ?? initial.total;

  return (
    <Container className={styles.dashboard} padding="xl">
      <FadeIn y={16}>
        <header className={styles.header}>
          <div>
            <Text
              tag="h1"
              variant="title_small"
              color="secondary"
              weight="bold"
              delay={{ enter: 0.53, exit: 0.15 }}
            >
              {t("title") as string}
            </Text>
            <Text
              tag="p"
              variant="description"
              color="muted"
              delay={{ enter: 0.54, exit: 0.14 }}
            >
              {t("subtitle") as string}
            </Text>
          </div>
          <div>
            <WrapperMotion delay={{ enter: 0.55, exit: 0.13 }} immediate>
              <Button
                text={t("logout") as string}
                style="primary"
                type="button"
                icon={faRightFromBracket}
                onClick={handleLogout}
                className={styles.logout}
              />
            </WrapperMotion>
          </div>
        </header>
      </FadeIn>

      <WrapperMotion delay={{ enter: 0.56, exit: 0.12 }} immediate>
        <ContactsFilters
          t={t}
          search={search}
          onSearchChange={setSearch}
          from={from}
          onFromChange={setFrom}
          to={to}
          onToChange={setTo}
          onReset={reset}
        />
      </WrapperMotion>

      <WrapperMotion delay={{ enter: 0.57, exit: 0.11 }} immediate>
        <ContactsStatus
          t={t}
          total={total}
          isFetching={isFetching && !isLoading}
        />
      </WrapperMotion>

      <WrapperMotion delay={{ enter: 0.57, exit: 0.11 }} immediate>
        <ContactsTable
          t={t}
          items={items}
          isLoading={isLoading}
          isFetching={isFetching && !isLoading}
        />
      </WrapperMotion>

      <WrapperMotion delay={{ enter: 0.58, exit: 0.1 }} immediate>
        <ContactsPagination
          t={t}
          page={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </WrapperMotion>
    </Container>
  );
};

export { DashboardView };
