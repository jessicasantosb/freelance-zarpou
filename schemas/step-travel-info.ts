import { z } from "zod";

export const StepTravelSchema = z.object({
  accommodationPreference: z
    .string()
    .min(2, "Campo obrigatório")
    .max(100, "Limite de 100 caracteres excedido"),
  roomType: z
    .string()
    .min(2, "Campo obrigatório")
    .max(100, "Limite de 100 caracteres excedido"),
  mealPlan: z
    .string()
    .min(2, "Campo obrigatório")
    .max(50, "Limite de 50 caracteres excedido"),
  transportation: z
    .string()
    .min(2, "Campo obrigatório")
    .max(50, "Limite de 50 caracteres excedido"),
  internalTransportation: z
    .string()
    .min(2, "Campo obrigatório")
    .max(50, "Limite de 50 caracteres excedido"),
  estimatedBudget: z
    .string()
    .min(1, "Orçamento estimado é obrigatório")
    .refine(
      (val) => {
        const onlyDigits = val.replace(/\D/g, "");
        return Number(onlyDigits) > 0;
      },
      { message: "Insira um valor maior que zero" },
    ),
  dietaryRestrictions: z
    .string()
    .max(300, "O texto não pode ultrapassar 300 caracteres")
    .optional(),
  otherSpecialNeeds: z
    .string()
    .max(300, "O texto não pode ultrapassar 300 caracteres")
    .optional(),
  additionalInfo: z
    .string()
    .max(500, "O texto não pode ultrapassar 500 caracteres")
    .optional(),
});

export type StepTravel = z.infer<typeof StepTravelSchema>;
