import z from "zod";

export const contactSchema = z.object({
  name: z
    .string("Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.email({ message: "E-mail é obrigatório" }),
  phone: z.string().optional(),
  message: z
    .string("Mensagem é obrigatória")
    .min(15, "Mensagem deve ter no mínimo 15 caracteres"),
});

export type Contact = z.infer<typeof contactSchema>;
