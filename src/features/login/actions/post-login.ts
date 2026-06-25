import { api } from "@/src/shared/api/index.api";
import type { LoginInterface } from "../validations/login.validation";

const postLoginAction = async (
  body: LoginInterface,
): Promise<{ success: true }> => {
  return api.post<{ success: true }>("/auth/login", body);
};

export { postLoginAction };
