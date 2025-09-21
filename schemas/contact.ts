import z from "zod";

export const contactSchema = z.object({
  name: z
    .string("O nome é obrigatório")
    .min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z.email({ message: "O email é obrigatório" }),
  phone: z.string(),
  message: z
    .string("A mensagem é obrigatória")
    .min(1, { message: "A mensagem é obrigatória" }),
});

export type Contact = z.infer<typeof contactSchema>;
