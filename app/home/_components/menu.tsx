"use client";

import {
  Hotel,
  Plane,
  Luggage,
  Ticket,
  Car,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
  MessageCircle,
  Award,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";

const services = [
  {
    icon: Hotel,
    badge: "Cancelamento Grátis",
    title: "Hospedagens & Resorts",
    description:
      "De pousadas charmosas a resorts all-inclusive pé na areia. Quartos selecionados com fotos reais e café da manhã incluso.",
    highlights: ["Hotéis de 3 a 5 estrelas", "Condições flexíveis de reserva"],
    accentColor: "text-amber-600 bg-amber-500/10 border-amber-500/20",
    badgeColor: "bg-amber-100 text-amber-800",
  },
  {
    icon: Plane,
    badge: "Nacionais & Globais",
    title: "Passagens Aéreas",
    description:
      "Pesquisa inteligente com as principais companhias aéreas do mundo, comparando conexões, bagagens e tarifas em tempo real.",
    highlights: ["Sem taxas ocultas", "Parcelamento em até 12x"],
    accentColor: "text-sky-600 bg-sky-500/10 border-sky-500/20",
    badgeColor: "bg-sky-100 text-sky-800",
  },
  {
    icon: Luggage,
    badge: "Economia de até 30%",
    title: "Pacotes Completos",
    description:
      "A combinação perfeita de voo e hospedagem em uma só compra. Economize tempo e dinheiro com descontos combinados exclusivos.",
    highlights: ["Voo + Hotel na mesma reserva", "Roteiros personalizados"],
    accentColor: "text-primary bg-primary/10 border-primary/20",
    badgeColor: "bg-secondary/20 text-primary font-bold",
  },
  {
    icon: Ticket,
    badge: "Parceiros Oficiais",
    title: "Passeios & Experiências",
    description:
      "Ingressos antecipados para parques temáticos, transfers privativos e passeios guiados para aproveitar ao máximo seu destino.",
    highlights: ["Evite filas no destino", "Guias credenciados Cadastur"],
    accentColor: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    badgeColor: "bg-emerald-100 text-emerald-800",
  },
  {
    icon: Car,
    badge: "Mobilidade Livre",
    title: "Aluguel de Veículos",
    description:
      "Liberdade total para criar seu próprio roteiro com as locadoras líderes de mercado e retirada prática direto nos aeroportos.",
    highlights: ["Quilometragem livre", "Veículos revisados e segurados"],
    accentColor: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
    badgeColor: "bg-indigo-100 text-indigo-800",
  },
  {
    icon: ShieldCheck,
    badge: "Proteção Total",
    title: "Seguro & Assistência 24/7",
    description:
      "Viaje com tranquilidade absoluta. Cobertura médica hospitalar, auxílio com bagagens e suporte humanizado antes e durante sua viagem.",
    highlights: ["Cobertura nacional e global", "Atendimento humano via WhatsApp"],
    accentColor: "text-rose-600 bg-rose-500/10 border-rose-500/20",
    badgeColor: "bg-rose-100 text-rose-800",
  },
];

const trustPillars = [
  {
    icon: Lock,
    title: "Pagamento 100% Protegido",
    desc: "Criptografia de ponta a ponta e processamento seguro",
  },
  {
    icon: Zap,
    title: "Confirmação Imediata",
    desc: "Voucher e localizador emitidos na hora da compra",
  },
  {
    icon: MessageCircle,
    title: "Suporte Humano Dedicado",
    desc: "Especialistas prontos para tirar dúvidas a qualquer momento",
  },
  {
    icon: Award,
    title: "Agência Certificada Cadastur",
    desc: "Regularizada junto ao Ministério do Turismo do Brasil",
  },
];

export function Menu() {
  return (
    <section className="py-14 bg-gradient-to-b from-white via-slate-50/60 to-white select-none">
      <Container>
        {/* TÍTULO E SUBTÍTULO */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-primary text-[11px] font-black uppercase tracking-wider mb-3">
            ✦ Plataforma Integrada de Viagens
          </span>
          <Title
            title="Tudo o que você precisa, em um só lugar"
            subtitle="Uma experiência completa de ponta a ponta para planejar, reservar e viver sua viagem dos sonhos."
          />
        </div>

        {/* GRADE DE RECURSOS / SERVIÇOS (ESTÁTICA, MODERNA, SEM SENSAÇÃO DE CLIQUE) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between cursor-default"
              >
                <div>
                  {/* TOPO DO CARD: ÍCONE MODERNO E BADGE */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div
                      className={`size-12 rounded-2xl flex items-center justify-center border ${item.accentColor}`}
                    >
                      <Icon className="size-6" />
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  {/* TÍTULO E DESCRIÇÃO INFORMATIVA */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-5">
                    {item.description}
                  </p>
                </div>

                {/* LISTA DE DESTAQUES COM CHECKMARK SUAVE */}
                <div className="pt-4 border-t border-slate-100 space-y-1.5">
                  {item.highlights.map((highlight, hIndex) => (
                    <div
                      key={hIndex}
                      className="flex items-center gap-2 text-xs font-medium text-slate-700"
                    >
                      <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAIXA INFORMATIVA DE CONFIANÇA & BENEFÍCIOS */}
        <div className="mt-10 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPillars.map((pillar, pIndex) => {
              const PillarIcon = pillar.icon;
              return (
                <div key={pIndex} className="flex items-start gap-3.5">
                  <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-secondary">
                    <PillarIcon className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug">
                      {pillar.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
