"use client";

import { useState, useRef, useEffect } from "react";

import { StepsProps } from "@/types/checkout-steps";
import { Progress } from "@/components/ui/progress";

import { StepUser } from "./_form-steps/step-user";
import { StepDestinationInfo } from "./_form-steps/step-destination-info";
import { StepTravelInfo } from "./_form-steps/step-travel-info";
import { StepFinish } from "./_form-steps/step-finish";

type StepsElementsProps = {
  progressBar: number;
  stepTitle: string;
  stepField: React.JSX.Element;
};

export function ContactForm() {
  const [step, setStep] = useState<StepsProps>("user");
  const stepContainerRef = useRef<HTMLDivElement>(null);
  const prevStep = useRef<StepsProps>(step);

  useEffect(() => {
    if (prevStep.current !== step) {
      prevStep.current = step;

      if (stepContainerRef.current) {
        stepContainerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [step]);

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
    <div
      ref={stepContainerRef}
      className="w-full scroll-mt-6 max-w-5xl mx-auto py-12"
    >
      <div className="p-6 border border-primary rounded-md text-primary">
        <h3 className="text-3xl md:text-4xl font-bold">Entre em contato</h3>
        <p className="pt-2 pb-6 text-lg md:text-xl text-muted-foreground">
          Preencha o formulário abaixo e entraremos em contato o mais breve
          possível.
        </p>

        <div className="">
          <h2 className="text-center uppercase">{stepTitle}</h2>
          <div className="py-4">
            <Progress value={progressBar} />
          </div>

          <div className="flex flex-col gap-3">{stepField}</div>
        </div>
      </div>
    </div>
  );
}
