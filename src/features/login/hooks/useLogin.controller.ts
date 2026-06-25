import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToastStore } from "@/src/shared/stores/toast.store";
import { postLoginAction } from "../actions/post-login";
import {
  loginValidation,
  type LoginInterface,
} from "../validations/login.validation";

const useLoginController = () => {
  const router = useRouter();
  const showToast = useToastStore((state) => state.show);
  const [isPending, setIsPending] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInterface>({
    mode: "onChange",
    resolver: zodResolver(loginValidation),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (formData: LoginInterface) => {
    setIsPending(true);
    showToast("loading");
    try {
      await postLoginAction(formData);
      router.push("/dashboard");
    } catch {
      showToast("error");
      setIsPending(false);
    }
  };

  return { control, errors, handleSubmit, onSubmit, isPending };
};

export { useLoginController };
