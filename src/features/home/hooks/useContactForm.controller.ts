import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useContactFormMutation } from "./useContactForm.query";
import {
  ContactFormInterface,
  contactFormValidation,
} from "../validations/contact-form.validation";
import { useToastStore } from "@/src/shared/stores/toast.store";
import { pushDataLayer } from "@/src/shared/helpers/data-layer";

const useContactFormController = () => {
  const mutation = useContactFormMutation();
  const showToast = useToastStore((state) => state.show);
  const hideToast = useToastStore((state) => state.hide);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
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

  const onSubmit = async (formData: ContactFormInterface) => {
    showToast("loading");
    try {
      await mutation.mutateAsync({
        ...formData,
        phone_number: `${formData.phone_extension} ${formData.phone_number}`,
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
