import { z } from "zod";

export const StepTravelSchema = z.object({
  accommodationPreference: z.string().min(1, "campo obrigatório"),
  roomType: z.string().min(1, "campo obrigatório"),
  mealPlan: z.string().min(1, "campo obrigatório"),
  transportation: z.string().min(1, "campo obrigatório"),
  internalTransportation: z.string().min(1, "campo obrigatório"),
  estimatedBudget: z.string().min(1, "campo obrigatório"),
  dietaryRestrictions: z.string().optional(),
  otherSpecialNeeds: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export type StepTravel = z.infer<typeof StepTravelSchema>;
