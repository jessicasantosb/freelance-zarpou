"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  CreditCard,
  Headphones,
  Award,
  Sparkles,
  MessageCircle,
  ExternalLink,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useConfigStore } from "@/stores/config-store";

export function ContactAdvisory() {
  const { config } = useConfigStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const whatsappNum = mounted
    ? config.whatsapp
    : process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5531984210000";

  const defaultMsg = encodeURIComponent(
    "Olá! Estou na página de contato e gostaria de atendimento imediato para cotar uma viagem."
  );

  return (
    <div className="space-y-6">
      {/* CARD 1: ATENDIMENTO EXPRESS WHATSAPP */}
      <div className="bg-gradient-to-br from-[#05345b] via-[#094677] to-[#05345b] rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 size-40 rounded-full bg-[#ebb343]/20 blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-3">
          <span className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md text-[#ebb343]">
            <Sparkles className="size-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#ebb343]">
            Atendimento Prioritário
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
          Quer planejar sua viagem sem esperar?
        </h3>
        <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
          Nossos consultores especialistas estão conectados em tempo real no WhatsApp para buscar disponibilidade, comparar companhias aéreas e aplicar condições de até 12x sem juros.
        </p>

        <a
          href={`https://wa.me/${whatsappNum}?text=${defaultMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 w-full bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white font-bold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-[#25D366]/30 transition-all duration-200 text-sm group"
        >
          <MessageCircle className="size-5 fill-white" />
          <span>Falar Agora no WhatsApp</span>
          <ExternalLink className="size-4 group-hover:translate-x-0.5 transition-transform" />
        </a>

        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            Resposta média: menos de 5 min
          </span>
          <span>Sem taxas de cotação</span>
        </div>
      </div>

      {/* CARD 2: VANTAGENS ZARPOU */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md space-y-4">
        <h4 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Award className="size-5 text-secondary" />
          Por que planejar com a Zarpou?
        </h4>

        <div className="space-y-3.5 pt-1 text-xs">
          <div className="flex items-start gap-3">
            <div className="size-8 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="size-4" />
            </div>
            <div>
              <h5 className="font-bold text-slate-800">
                Roteiros 100% Sob Medida
              </h5>
              <p className="text-slate-500 mt-0.5 leading-relaxed">
                Cada viagem é desenhada com curadoria personalizada de acordo com seu estilo, época e orçamento.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <CreditCard className="size-4" />
            </div>
            <div>
              <h5 className="font-bold text-slate-800">
                Pagamento em até 12x Sem Juros
              </h5>
              <p className="text-slate-500 mt-0.5 leading-relaxed">
                Parcele suas férias no cartão de crédito em até 12 vezes sem juros ou aproveite 5% OFF à vista no Pix.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
              <Headphones className="size-4" />
            </div>
            <div>
              <h5 className="font-bold text-slate-800">
                Suporte em Português no Destino
              </h5>
              <p className="text-slate-500 mt-0.5 leading-relaxed">
                Embarque com tranquilidade: nossa equipe dá suporte em tempo real durante todo o período da sua estadia.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <h5 className="font-bold text-slate-800">
                Agência Credenciada Cadastur
              </h5>
              <p className="text-slate-500 mt-0.5 leading-relaxed">
                Segurança jurídica e total conformidade com o Ministério do Turismo e LGPD.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 3: HORÁRIOS DE ATENDIMENTO */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs space-y-2.5">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Clock className="size-4 text-primary" />
          <span>Horários de Operação da Agência</span>
        </div>
        <div className="space-y-1.5 text-slate-600">
          <div className="flex justify-between">
            <span>Segunda a Sexta-feira:</span>
            <span className="font-semibold text-slate-900">08:00 às 20:00</span>
          </div>
          <div className="flex justify-between">
            <span>Sábados e Feriados:</span>
            <span className="font-semibold text-slate-900">09:00 às 15:00</span>
          </div>
          <div className="flex justify-between">
            <span>Plantão para Passageiros em Trânsito:</span>
            <span className="font-bold text-emerald-600">24 horas via WhatsApp</span>
          </div>
        </div>
      </div>
    </div>
  );
}
