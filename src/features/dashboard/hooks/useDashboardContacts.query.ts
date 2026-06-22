import { useEffect, useRef, useState } from "react";

import { getContactsAction } from "../actions/get-contacts";
import type { ContactsResponse } from "../validations/contacts-query.validation";

type Args = {
  page: number;
  pageSize: number;
  search: string;
  from: string;
  to: string;
  initialData?: ContactsResponse;
};

const DEFAULT_PAGE_SIZE = 30;

const useDashboardContactsQuery = ({
  page,
  pageSize,
  search,
  from,
  to,
  initialData,
}: Args) => {
  const isInitialState =
    page === 1 &&
    pageSize === DEFAULT_PAGE_SIZE &&
    search === "" &&
    from === "" &&
    to === "";

  const [data, setData] = useState<ContactsResponse | undefined>(
    isInitialState ? initialData : undefined,
  );
  const [isFetching, setIsFetching] = useState(false);
  // Evita el doble fetch del primer render cuando ya hay initialData del SSR.
  const skipNext = useRef(isInitialState && initialData !== undefined);

  useEffect(() => {
    if (skipNext.current) {
      skipNext.current = false;
      return;
    }

    let cancelled = false;
    setIsFetching(true);

    getContactsAction({
      page,
      pageSize,
      search: search || undefined,
      from: from || undefined,
      to: to || undefined,
    })
      // keepPreviousData: no limpiamos `data`; al resolver se reemplaza.
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .finally(() => {
        if (!cancelled) setIsFetching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, pageSize, search, from, to]);

  return { data, isFetching, isLoading: isFetching && data === undefined };
};

export { useDashboardContactsQuery, DEFAULT_PAGE_SIZE };
