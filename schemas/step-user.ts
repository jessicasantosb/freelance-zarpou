import { z } from "zod";

export const stepUserSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z.email({ message: "O email é obrigatório" }),
  phone: z.string().min(1, "O número de telefone é obrigatório"),
});
