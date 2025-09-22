import z from "zod";
import { StepUserSchema } from "./step-user";
import { StepDestinationSchema } from "./step-destination-info";
import { StepTravelSchema } from "./step-travel-info";

export const contactSchema = z.object({
  ...StepUserSchema.shape,
  ...StepDestinationSchema.shape,
  ...StepTravelSchema.shape,
});

export type Contact = z.infer<typeof contactSchema>;
