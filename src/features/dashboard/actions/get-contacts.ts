import { api } from "@/src/shared/api/index.api";
import type {
  ContactsQueryInput,
  ContactsResponse,
} from "../validations/contacts-query.validation";

const getContactsAction = async (
  params: ContactsQueryInput,
): Promise<ContactsResponse> => {
  const data = await api.get<ContactsResponse>("/admin/contacts", {
    params,
  });
  return data;
};

export { getContactsAction };
