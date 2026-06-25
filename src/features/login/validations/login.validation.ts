import { z } from "zod";

const loginValidation = z.object({
  username: z.string().min(1, "Ingrese su usuario"),
  password: z.string().min(1, "Ingrese su contraseña"),
});

type LoginInterface = z.infer<typeof loginValidation>;

export { loginValidation };
export type { LoginInterface };
