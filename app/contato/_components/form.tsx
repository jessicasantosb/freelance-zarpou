"use client";

import { useState, useRef, useEffect } from "react";
import { User, MapPin, Compass, CheckCircle2, Sparkles } from "lucide-react";
import { StepsProps } from "@/types/checkout-steps";
import { Progress } from "@/components/ui/progress";

import { StepUser } from "./_form-steps/step-user";
import { StepDestinationInfo } from "./_form-steps/step-destination-info";
import { StepTravelInfo } from "./_form-steps/step-travel-info";
import { StepFinish } from "./_form-steps/step-finish";

type StepsElementsProps = {
  stepIndex: number;
  progressBar: number;
  stepTitle: string;
  stepSubtitle: string;
  stepField: React.JSX.Element;
};

const STEPS_NAV = [
  { id: "user", label: "Identificação", icon: User },
  { id: "destinationInfo", label: "Destino", icon: MapPin },
  { id: "travelInfo", label: "Preferências", icon: Compass },
  { id: "finish", label: "Revisão", icon: CheckCircle2 },
];

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
      stepIndex: 1,
      progressBar: 25,
      stepTitle: "Dados do Viajante",
      stepSubtitle: "Como podemos chamar você e enviar seu itinerário?",
      stepField: <StepUser setStep={setStep} />,
    },
    destinationInfo: {
      stepIndex: 2,
      progressBar: 50,
      stepTitle: "Destino & Datas Desejadas",
      stepSubtitle: "Conte-nos para onde você deseja embarcar e o período previsto.",
      stepField: <StepDestinationInfo setStep={setStep} />,
    },
    travelInfo: {
      stepIndex: 3,
      progressBar: 75,
      stepTitle: "Preferências de Viagem",
      stepSubtitle: "Personalize sua experiência: hospedagem, aéreo e orçamentos.",
      stepField: <StepTravelInfo setStep={setStep} />,
    },
    finish: {
      stepIndex: 4,
      progressBar: 100,
      stepTitle: "Revisão e Envio",
      stepSubtitle: "Confirme seus dados e receba sua cotação sem compromisso.",
      stepField: <StepFinish />,
    },
  };

  const { stepIndex, progressBar, stepTitle, stepSubtitle, stepField } = elements[step];

  return (
    <div
      id="form-contato"
      ref={stepContainerRef}
      className="w-full scroll-mt-24"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-slate-200/80">
        {/* HEADER DO FORMULÁRIO */}
        <div className="border-b border-slate-100 pb-6 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-[#05345b] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="size-3 text-[#ebb343] fill-[#ebb343]" />
            <span>Cotação & Consultoria Grátis</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Monte seu Roteiro com Nossos Especialistas
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Preencha os dados em 4 passos rápidos. Nossos consultores retornarão com tarifas promocionais e opções personalizadas.
          </p>
        </div>

        {/* STEPPER VISUAL MODERNO */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2 mb-3">
            {STEPS_NAV.map((nav, idx) => {
              const Icon = nav.icon;
              const isCurrent = step === nav.id;
              const isDone = idx + 1 < stepIndex;

              return (
                <div
                  key={nav.id}
                  className={`flex flex-col items-center sm:items-start p-2.5 rounded-xl transition-all ${
                    isCurrent
                      ? "bg-primary/5 text-primary border border-primary/20"
                      : isDone
                      ? "text-slate-700"
                      : "text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCurrent
                          ? "bg-primary text-white shadow-xs"
                          : isDone
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isDone ? "✓" : idx + 1}
                    </span>
                    <Icon className="size-4 hidden sm:block" />
                  </div>
                  <span className="text-[11px] font-bold mt-1.5 hidden sm:block truncate">
                    {nav.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* PROGRESS BAR */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-500">
              <span className="text-primary font-bold">Passo {stepIndex} de 4: {stepTitle}</span>
              <span>{progressBar}% concluído</span>
            </div>
            <Progress value={progressBar} className="h-2 rounded-full" />
          </div>
        </div>

        {/* SUBTÍTULO DO PASSO ATUAL */}
        <div className="mb-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm">{stepTitle}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{stepSubtitle}</p>
          </div>
          <span className="text-xs font-bold text-[#05345b] bg-[#ebb343]/20 px-2.5 py-1 rounded-lg">
            Etapa {stepIndex}/4
          </span>
        </div>

        {/* CONTEÚDO DO PASSO */}
        <div className="transition-all duration-300">
          {stepField}
        </div>
      </div>
    </div>
  );
}
