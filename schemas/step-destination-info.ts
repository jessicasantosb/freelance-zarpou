import { z } from "zod";

export const StepDestinationSchema = z.object({
  destination: z.string().min(1, "campo obrigatório"),
  startDate: z.string().min(1, "campo obrigatório"),
  endDate: z.string().min(1, "campo obrigatório"),
  numberOfAdults: z.string().min(1, "campo obrigatório"),
  numberOfChildren: z.string().optional(),
  travelType: z.string().min(1, "campo obrigatório"),
});

export type StepDestination = z.infer<typeof StepDestinationSchema>;
