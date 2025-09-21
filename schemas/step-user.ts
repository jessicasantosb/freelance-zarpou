import { z } from "zod";

export const stepUserSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .min(10, "Número de celular deve ter pelo menos 10 dígitos")
    .max(11, "Número de celular deve ter no máximo 11 dígitos")
    .regex(/^\d+$/, "Número de celular deve conter apenas números"),
});
