import { Dispatch, SetStateAction } from "react";

export type StepsProps = "user" | "destinationInfo" | "travelInfo" | "finish";

export type SetStepProps = { setStep: Dispatch<SetStateAction<StepsProps>> };
