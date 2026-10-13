"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Como funciona a solicitação de orçamento e montagem de roteiro?",
    answer:
      "Você pode preencher o formulário acima ou chamar nossa equipe no WhatsApp. Analisamos suas preferências de data, orçamento e perfil de viagem para apresentar uma proposta sob medida com as melhores opções de voos, hotéis e passeios sem custos de consultoria.",
  },
  {
    question: "Qual é o tempo médio para receber a cotação?",
    answer:
      "Para contatos via WhatsApp, a primeira resposta e levantamento de dados ocorrem em poucos minutos. Para roteiros completos e cotações personalizadas enviadas por formulário ou e-mail, nosso time retorna em até 2 horas em dias úteis.",
  },
  {
    question: "Como funciona o parcelamento e as formas de pagamento?",
    answer:
      "Trabalhamos com parcelamento facilitado em até 12x sem juros em todos os cartões de crédito (Visa, Mastercard, Elo, etc.), além de 5% de desconto para pagamentos à vista via Pix. O processamento é 100% digital e com recibo imediato.",
  },
  {
    question: "Como recebo meus vouchers e bilhetes aéreos após a reserva?",
    answer:
      "Assim que o pagamento for aprovado, os vouchers com localizador oficial da companhia aérea e comprovante do hotel são enviados diretamente para seu e-mail e WhatsApp, além de ficarem salvos na sua área de cliente em 'Minhas Viagens'.",
  },
  {
    question: "A Zarpou oferece suporte durante a viagem caso ocorra algum imprevisto?",
    answer:
      "Sim! Todos os nossos clientes contam com suporte humano 24 horas por dia durante o período da viagem. Se o seu voo for alterado ou você precisar de assistência no check-in do hotel, nossa equipe em Belo Horizonte estará a postos para resolver.",
  },
];

export function ContactFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
          <HelpCircle className="size-3.5" />
          <span>Tire Suas Dúvidas</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Perguntas Frequentes sobre Atendimento
        </h3>
        <p className="text-slate-500 text-sm mt-2">
          Respostas rápidas para você planejar suas próximas férias com segurança e total clareza.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "bg-white border-primary/40 shadow-md"
                  : "bg-white/80 border-slate-200 hover:border-slate-300"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-800 text-sm sm:text-base cursor-pointer"
              >
                <span>{item.question}</span>
                <div
                  className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen
                      ? "bg-primary text-white rotate-180"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <ChevronDown className="size-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
