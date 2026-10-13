"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Target,
  Compass,
  Heart,
  ShieldCheck,
  Sparkles,
  MapPin,
} from "lucide-react";
import { useConfigStore } from "@/stores/config-store";

export function AboutStory() {
  const { config } = useConfigStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const address = mounted ? config.address : "Belo Horizonte - MG, Brasil";
  const cadastur = mounted ? config.cadastur : "34.120.948/0001-90";
  const cnpj = mounted ? config.cnpj : "55.849.201/0001-38";

  return (
    <section className="py-16 md:py-24 max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* COLUNA ESQUERDA: HISTÓRIA & PROPÓSITO (7 colunas) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="size-3.5 text-secondary fill-secondary" />
            <span>Nossa Trajetória</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Nascida em Minas Gerais para conectar você ao mundo
          </h2>

          <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            <p>
              A <strong>Zarpou Viagens e Turismo</strong> nasceu com um propósito claro e inegociável: ser o seu porto seguro, prático e confiável na hora de transformar sonhos de viagem em realidade.
            </p>
            <p>
              Acreditamos que viajar vai muito além de comprar passagens aéreas ou reservar quartos de hotéis. É sobre viver momentos que marcam a vida, descobrir novas culturas com tranquilidade e ter a certeza de que há uma equipe de verdade cuidando de você em todas as etapas — do planejamento ao pós-viagem.
            </p>
            <p>
              Com um modelo de agência digital moderna e atendimento 100% humanizado, combinamos as melhores tarifas negociadas do mercado, parcelamento em até 12x sem juros e suporte ágil 24 horas por dia.
            </p>
          </div>

          {/* PILARES: MISSÃO, VISÃO E VALORES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-primary/40 transition">
              <div className="size-9 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-2.5">
                <Target className="size-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                Missão
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Proporcionar viagens inesquecíveis com transparência, segurança e preços justos.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-secondary/40 transition">
              <div className="size-9 rounded-xl bg-amber-50 text-[#ebb343] flex items-center justify-center mb-2.5">
                <Compass className="size-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                Visão
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Ser a agência online de turismo mais recomendada e confiável do país.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-400/40 transition">
              <div className="size-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
                <Heart className="size-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                Valores
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Calor humano, ética absoluta, respeito e zelo em cada reserva efetuada.
              </p>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: COMPOSIÇÃO VISUAL & BADGES (5 colunas) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card Principal de Imagem */}
          <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
            <Image
              src="/about/do-seu-jeito.png"
              alt="Experiência Zarpou Viagens"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />

            {/* Badge de Localização no topo */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-full px-3.5 py-1.5 shadow-md border border-white/40 flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <MapPin className="size-3.5 text-secondary" />
              <span>{address.split("-")[0].trim()}</span>
            </div>

            {/* Mensagem em destaque na base da foto (totalmente desobstruída) */}
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#ebb343] bg-amber-400/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full inline-block">
                Turismo Sob Medida
              </span>
              <h3 className="text-xl sm:text-2xl font-black leading-snug">
                Cuidamos de tudo para você só se preocupar em aproveitar.
              </h3>
            </div>
          </div>

          {/* Card de Credenciamento Oficial (Cadastur + CNPJ) posicionado com elegância abaixo da foto */}
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200/90 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                  Agência Credenciada
                </span>
                <p className="text-[11px] text-slate-500 font-medium">
                  Cadastur: <strong className="text-slate-700">{cadastur}</strong>
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Certificação
              </span>
              <span className="text-[11px] font-semibold text-slate-600">
                CNPJ: {cnpj}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
