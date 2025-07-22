import { z } from "zod";

export const stepInfoSchema = z.object({
  destination: z.string().min(1, "campo obrigatório"),
  startDate: z.string().min(1, "campo obrigatório"),
  endDate: z.string().min(1, "campo obrigatório"),
  numberOfAdults: z.string().min(1, "campo obrigatório"),
  numberOfChildren: z.string(),
  travelType: z.string().min(1, "campo obrigatório"),
});
