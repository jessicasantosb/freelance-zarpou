"use client";

import { Container } from "@/components/shared/container";
import { useState } from "react";
import { StepsProps } from "@/types/checkout-steps";
import { StepUser } from "./_form-steps/step-user";
import { StepDestinationInfo } from "./_form-steps/step-destination-info";
import { StepTravelInfo } from "./_form-steps/step-travel-info";
import { StepFinish } from "./_form-steps/step-finish";
import { Progress } from "@/components/ui/progress";

type StepsElementsProps = {
  progressBar: number;
  stepTitle: string;
  stepField: React.JSX.Element;
};

export function ContactForm() {
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
      stepTitle: "Envio de dados",
      stepField: <StepFinish />,
    },
  };

  const { progressBar, stepTitle, stepField } = elements[step];

  return (
    <Container>
      <div className="p-6 border border-primary rounded-md text-primary">
        <h3 className="text-3xl md:text-4xl font-bold">Entre em contato</h3>
        <p className="pt-2 pb-6 text-lg md:text-xl text-muted-foreground">
          Preencha o formulário abaixo e entraremos em contato o mais breve
          possível.
        </p>

        <h2 className="text-center uppercase">{stepTitle}</h2>
        <div className="py-4">
          <Progress value={progressBar} />
        </div>

        <div className="flex flex-col gap-3">{stepField}</div>
      </div>
    </Container>
  );
}
