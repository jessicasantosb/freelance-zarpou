import { z } from "zod";
import { startOfDay, isValid, parseISO } from "date-fns";

export const StepDestinationSchema = z
  .object({
    destination: z
      .string()
      .min(3, "O destino deve ter no mínimo 3 caracteres")
      .max(100, "Limite de 100 caracteres excedido"),
    startDate: z
      .string()
      .min(1, "Campo obrigatório")
      .refine(
        (val) => {
          const date = parseISO(val);
          if (!isValid(date)) return false;

          return startOfDay(date) >= startOfDay(new Date());
        },
        {
          message: "A data de início deve ser hoje ou uma data futura",
        },
      ),
    endDate: z
      .string()
      .min(1, "Campo obrigatório")
      .refine((val) => isValid(parseISO(val)), {
        message: "Data de término inválida",
      }),
    numberOfAdults: z
      .string()
      .min(1, "Campo obrigatório")
      .regex(/^[1-9]\d*$/, "É necessário pelo menos 1 adulto"),
    numberOfChildren: z
      .string()
      .regex(/^\d*$/, "Apenas números são permitidos")
      .optional(),
    travelType: z.string().min(1, "Campo obrigatório"),
  })
  .refine(
    (data) => {
      const start = parseISO(data.startDate);
      const end = parseISO(data.endDate);

      if (!isValid(start) || !isValid(end)) return true;

      return startOfDay(end) >= startOfDay(start);
    },
    {
      message: "A data de retorno deve ser igual ou posterior à data de ida",
      path: ["endDate"],
    },
  );

export type StepDestination = z.infer<typeof StepDestinationSchema>;
