import { useState } from "react";

import {
  postContactFormAction,
  type ContactFormPayload,
} from "../actions/post-contact-form";

type Status = "idle" | "pending" | "success" | "error";

const useContactFormMutation = () => {
  const [status, setStatus] = useState<Status>("idle");

  const mutateAsync = async (body: ContactFormPayload) => {
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
