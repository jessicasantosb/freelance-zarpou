import { z } from "zod";

export const stepInfoSchema = z.object({
  destiny: z.string().min(1, "O destino é obrigatório"),
  date: z.string().min(1, "A data é obrigatória"),
  count: z.string().min(1, "A quantidade de pessoas é obrigatória"),
  description: z.string().min(1, "O motivo do contato é obrigatório"),
});
