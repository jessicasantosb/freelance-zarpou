"use client";

import React, { useState } from "react";

import { StepFinish } from "@/components/shared/contact-dialog/step-finish";
import { StepDestinationInfo } from "@/components/shared/contact-dialog/step-destination-info";
import { StepUser } from "@/components/shared/contact-dialog/step-user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { StepsProps } from "@/types/checkout-steps";
import { StepTravelInfo } from "./step-travel-info";

type ContactDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type StepsElementsProps = {
  progressBar: number;
  stepTitle: string;
  stepField: React.JSX.Element;
};

export function ContactDialog({ open, onOpenChange }: ContactDialogProps) {
  const [step, setStep] = useState<StepsProps>("user");

  const elements: Record<StepsProps, StepsElementsProps> = {
    user: {
      progressBar: 25,
      stepTitle: "Dados Pessoais",
      stepField: <StepUser setStep={setStep} />,
    },
    destinationInfo: {
      progressBar: 50,
      stepTitle: "Informações do destino",
      stepField: <StepDestinationInfo setStep={setStep} />,
    },
    travelInfo: {
      progressBar: 75,
      stepTitle: "Informações da viagem",
      stepField: <StepTravelInfo setStep={setStep} />,
    },
    finish: {
      progressBar: 100,
      stepTitle: "Envio para o Whatsapp",
      stepField: <StepFinish />,
    },
  };

  const { progressBar, stepTitle, stepField } = elements[step];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{stepTitle}</DialogTitle>
        </DialogHeader>

        <Progress value={progressBar} />

        <div className="flex flex-col gap-3">{stepField}</div>
      </DialogContent>
    </Dialog>
  );
}
