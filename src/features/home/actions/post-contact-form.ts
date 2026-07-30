import { api } from "@/src/shared/api/index.api";
import { ContactFormInterface } from "../validations/contact-form.validation";

type ContactFormPayload = ContactFormInterface & { recaptcha_token: string };

const postContactFormAction = async (
  body: ContactFormPayload,
): Promise<{ success?: boolean; error?: string }> => {
  const data = await api.post<{ success?: boolean; error?: string }>(
    "/contact",
    body,
  );

  return data;
};

export { postContactFormAction };
export type { ContactFormPayload };
