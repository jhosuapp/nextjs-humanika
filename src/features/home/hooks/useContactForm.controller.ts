import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useContactFormMutation } from "./useContactForm.query";
import { useRecaptcha } from "@/src/shared/hooks/useRecaptcha";
import {
  ContactFormInterface,
  contactFormValidation,
} from "../validations/contact-form.validation";
import { useToastStore } from "@/src/shared/stores/toast.store";
import { pushDataLayer } from "@/src/shared/helpers/data-layer";

const RECAPTCHA_ACTION = "contact_form";

const useContactFormController = () => {
  const mutation = useContactFormMutation();
  const showToast = useToastStore((state) => state.show);
  const hideToast = useToastStore((state) => state.hide);
  const { load: loadRecaptcha, execute: executeRecaptcha } = useRecaptcha();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ContactFormInterface>({
    mode: "onChange",
    resolver: zodResolver(contactFormValidation),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone_number: "",
      phone_extension: "57",
    },
  });

  useEffect(() => {
    if (isDirty) loadRecaptcha();
  }, [isDirty, loadRecaptcha]);

  const onSubmit = async (formData: ContactFormInterface) => {
    showToast("loading");

    let recaptcha_token: string;
    try {
      recaptcha_token = await executeRecaptcha(RECAPTCHA_ACTION);
    } catch (e) {
      console.error("[contact] no se pudo obtener el token de recaptcha:", e);
      showToast("error");
      return;
    }

    try {
      await mutation.mutateAsync({
        ...formData,
        phone_number: `${formData.phone_extension} ${formData.phone_number}`,
        recaptcha_token,
      });
      showToast("success");
      pushDataLayer({ event: "form_submit_success" });
      reset({
        name: "",
        company: "",
        email: "",
        phone_number: "",
        phone_extension: "",
      });
    } catch {
      showToast("error");
    }
  };

  return {
    errors,
    control,
    handleSubmit,
    onSubmit,
    mutation,
    hideToast,
  };
};

export { useContactFormController };
