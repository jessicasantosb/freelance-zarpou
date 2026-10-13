"use client";

import { useEffect, useState } from "react";
import { Sparkles, MessageCircle, ArrowDown } from "lucide-react";
import { useConfigStore } from "@/stores/config-store";

export function ContactHeroContent() {
  const { config } = useConfigStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const whatsappNum = mounted
    ? config.whatsapp
    : process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5531984210000";

  const defaultMsg = encodeURIComponent(
    "Olá! Gostaria de conversar com um especialista da Zarpou para tirar dúvidas sobre roteiros e pacotes."
  );

  const scrollToForm = () => {
    const el = document.getElementById("form-contato");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center gap-5 max-w-4xl mx-auto px-4">
      {/* BADGE ELEGANTE */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-secondary shadow-lg">
        <Sparkles className="size-4 text-secondary animate-pulse" />
        <span>Atendimento Especializado & Roteiros Sob Medida</span>
      </div>

      {/* TÍTULO PRINCIPAL */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight sm:leading-tight md:leading-tight">
        Fale com quem entende de{" "}
        <span className="text-secondary drop-shadow-sm">viagens</span> e cuida de
        cada detalhe
      </h1>

      {/* SUBTÍTULO */}
      <p className="max-w-2xl text-sm sm:text-base md:text-lg text-slate-200 font-normal leading-relaxed">
        Consultores dedicados prontos para desenhar suas férias dos sonhos, cotar passagens aéreas e reservar as melhores hospedagens do mundo com até 12x sem juros.
      </p>

      {/* BOTÕES DE AÇÃO HERO */}
      <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-3 w-full sm:w-auto">
        <button
          onClick={scrollToForm}
          className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-secondary hover:bg-[#dba130] text-[#05345b] font-extrabold text-sm sm:text-base shadow-xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Montar Meu Roteiro</span>
          <ArrowDown className="size-4" />
        </button>

        <a
          href={`https://wa.me/${whatsappNum}?text=${defaultMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white font-bold text-sm sm:text-base hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle className="size-5 text-[#25D366] fill-[#25D366]" />
          <span>Falar no WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
