"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Search, Sparkles, Shield, Clock } from "lucide-react";
import { Container } from "@/components/shared/container";
import { useConfigStore } from "@/stores/config-store";

export function FooterCta() {
  const { config } = useConfigStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const whatsappNum = mounted
    ? config.whatsapp
    : process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5531984210000";

  const defaultMsg = encodeURIComponent(
    config?.whatsappMessage ||
      "Olá! Gostaria de planejar minha próxima viagem com a Zarpou."
  );

  return (
    <section aria-label="Chamada para Ação" className="py-14 sm:py-20 select-none">
      <Container>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* BADGE SUPERIOR */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/15 border border-secondary/30 text-primary text-xs font-black uppercase tracking-wider">
            <Sparkles className="size-3.5 fill-secondary text-secondary" />
            <span>Consultoria Personalizada sem Custo</span>
          </div>

          {/* TÍTULO PRINCIPAL */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-900">
            Pronto para viver sua{" "}
            <span className="text-primary underline decoration-secondary decoration-4 underline-offset-8">
              próxima grande viagem
            </span>
            ?
          </h2>

          {/* SUBTÍTULO */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Chame nossos consultores no WhatsApp para um roteiro sob medida ou
            explore nossas acomodações e voos com parcelamento em até 12x sem
            juros.
          </p>

          {/* BOTÕES DE AÇÃO DUPLOS */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`https://wa.me/${whatsappNum}?text=${defaultMsg}`}
              target="_blank"
              className="w-full sm:w-auto px-8 py-4 bg-secondary hover:bg-secondary/90 text-primary font-black text-sm rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-secondary/25 transition transform hover:scale-102 cursor-pointer"
            >
              <MessageCircle className="size-5" />
              <span>Falar com Especialista no WhatsApp</span>
            </Link>

            <Link
              href="/hospedagens"
              className="w-full sm:w-auto px-7 py-4 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm transition transform hover:scale-102 cursor-pointer"
            >
              <Search className="size-4 text-secondary" />
              <span>Explorar Hospedagens</span>
            </Link>
          </div>

          {/* MICRO PROVAS SOCIAIS */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium border-t border-slate-200/80">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-primary" />
              Resposta rápida no WhatsApp
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Shield className="size-3.5 text-emerald-600" />
              Orçamento 100% sem compromisso
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-secondary fill-secondary" />
              Parcelamento em até 12x sem juros
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
