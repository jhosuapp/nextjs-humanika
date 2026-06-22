import { api } from "@/src/shared/api/index.api";
import { ContactFormInterface } from "../validations/contact-form.validation";

const postContactFormAction = async (
  body: ContactFormInterface,
): Promise<{ success?: boolean; error?: string }> => {
  const data = await api.post<{ success?: boolean; error?: string }>(
    "/contact",
    body,
  );

  return data;
};

export { postContactFormAction };
