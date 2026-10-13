"use client";

import { Sparkles, ShieldCheck, HeartHandshake, Plane, Star } from "lucide-react";

export function AboutHeroContent() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-6 max-w-4xl mx-auto px-4">
      {/* BADGE ELEGANTE */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-secondary shadow-lg">
        <Sparkles className="size-4 text-secondary animate-pulse" />
        <span>Quem Somos • Zarpou Viagens e Turismo</span>
      </div>

      {/* TÍTULO PRINCIPAL */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight sm:leading-tight md:leading-tight">
        Muito mais do que uma agência: sua{" "}
        <span className="text-secondary drop-shadow-sm">parceira de viagens</span>
      </h1>

      {/* SUBTÍTULO */}
      <p className="max-w-2xl text-sm sm:text-base md:text-lg text-slate-200 font-normal leading-relaxed">
        Conectamos pessoas a experiências reais e inesquecíveis pelo Brasil e pelo mundo, combinando curadoria humana especializada, tecnologia ágil e total segurança.
      </p>

      {/* STAT PILLS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 w-full max-w-3xl">
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-secondary text-xs font-bold mb-1">
            <Plane className="size-3.5" />
            <span>Viagens</span>
          </div>
          <p className="text-lg sm:text-xl font-black text-white">+5.000</p>
          <span className="text-[10px] text-slate-300">Roteiros Realizados</span>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-secondary text-xs font-bold mb-1">
            <Star className="size-3.5 fill-secondary" />
            <span>Avaliação</span>
          </div>
          <p className="text-lg sm:text-xl font-black text-white">4.9 / 5.0</p>
          <span className="text-[10px] text-slate-300">Satisfação de Clientes</span>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-secondary text-xs font-bold mb-1">
            <ShieldCheck className="size-3.5" />
            <span>Oficial</span>
          </div>
          <p className="text-lg sm:text-xl font-black text-white">Cadastur</p>
          <span className="text-[10px] text-slate-300">Certificação Oficial</span>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-secondary text-xs font-bold mb-1">
            <HeartHandshake className="size-3.5" />
            <span>Suporte</span>
          </div>
          <p className="text-lg sm:text-xl font-black text-white">24h / 7d</p>
          <span className="text-[10px] text-slate-300">Assistência no Destino</span>
        </div>
      </div>
    </div>
  );
}
