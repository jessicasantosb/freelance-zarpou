import { z } from "zod";

export const StepUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Limite de 100 caracteres excedido")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "O nome deve conter apenas letras"),
  email: z
    .email("Email inválido")
    .max(150, "Limite de 150 caracteres excedido"),
  phone: z
    .string()
    .trim()
    .min(10, "Número de celular deve ter pelo menos 10 dígitos (inclua o DDD)")
    .max(11, "Número de celular deve ter no máximo 11 dígitos")
    .regex(/^\d+$/, "Número de celular deve conter apenas números"),
});

export type StepUser = z.infer<typeof StepUserSchema>;
