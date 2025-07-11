"use client";

import React, { useState } from "react";

import { StepFinish } from "@/components/shared/contact-dialog/step-finish";
import { StepInfo } from "@/components/shared/contact-dialog/step-info";
import { StepUser } from "@/components/shared/contact-dialog/step-user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { StepsProps } from "@/types/checkout-steps";

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
      progressBar: 30,
      stepTitle: "Dados Pessoais",
      stepField: <StepUser setStep={setStep} />,
    },
    info: {
      progressBar: 70,
      stepTitle: "Informações",
      stepField: <StepInfo setStep={setStep} />,
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
