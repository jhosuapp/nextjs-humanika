import { useState } from "react";

import { postContactFormAction } from "../actions/post-contact-form";
import type { ContactFormInterface } from "../validations/contact-form.validation";

type Status = "idle" | "pending" | "success" | "error";

const useContactFormMutation = () => {
  const [status, setStatus] = useState<Status>("idle");

  const mutateAsync = async (body: ContactFormInterface) => {
    setStatus("pending");
    try {
      const data = await postContactFormAction(body);
      setStatus("success");
      return data;
    } catch (e) {
      setStatus("error");
      throw e;
    }
  };

  return {
    mutateAsync,
    isPending: status === "pending",
    isSuccess: status === "success",
    isError: status === "error",
  };
};

export { useContactFormMutation };
