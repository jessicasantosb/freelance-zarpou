"use client";

import { Award, Users, CreditCard, Headphones } from "lucide-react";

export function AboutStats() {
  const stats = [
    {
      icon: Users,
      value: "+5.000",
      label: "Viajantes Atendidos",
      desc: "Histórias e sonhos realizados pelo Brasil e pelo mundo",
    },
    {
      icon: Award,
      value: "99.4%",
      label: "Índice de Satisfação",
      desc: "Avaliações 5 estrelas e alto índice de recomendação",
    },
    {
      icon: CreditCard,
      value: "12x",
      label: "Sem Juros no Cartão",
      desc: "Ou 5% de desconto imediato à vista via Pix",
    },
    {
      icon: Headphones,
      value: "24/7",
      label: "Plantão no Destino",
      desc: "Suporte em português durante todo o seu roteiro",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-slate-900 via-[#05345b] to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center text-center ${
                  idx > 0 ? "pt-6 sm:pt-0 sm:pl-6" : ""
                }`}
              >
                <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-md text-[#ebb343] flex items-center justify-center mb-3 border border-white/10">
                  <Icon className="size-6" />
                </div>
                <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {stat.value}
                </p>
                <h4 className="text-sm font-bold text-slate-200 mt-1 uppercase tracking-wider">
                  {stat.label}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                  {stat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
