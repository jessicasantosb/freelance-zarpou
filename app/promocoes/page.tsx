"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Zap,
  Tag,
  ArrowRight,
  ShieldCheck,
  Percent,
  Loader2,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { usePromotionStore } from "@/stores/promotion-store";
import { Promotion } from "@/types/promotion";

export default function PromocoesPage() {
  const { promotions, fetchPromotions } = usePromotionStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchPromotions();
  }, [fetchPromotions]);

  const activePromos = mounted ? promotions.filter((p) => p.active) : [];

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      {/* HEADER HERO DA PÁGINA */}
      <div className="bg-primary text-white py-12 mb-10 shadow-inner">
        <Container>
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-primary text-xs font-black uppercase tracking-wider">
              <Sparkles className="size-3.5 fill-primary" />
              Ofertas Especiais & Parcerias
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Promoções Imperdíveis Zarpou
            </h1>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed">
              Explore condições promocionais exclusivas, tarifas negociadas para os destinos mais cobiçados do Brasil e do mundo, com parcelamento facilitado em até 12x sem juros.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        {/* CONTAGEM E INTRO */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <span className="text-sm font-bold text-slate-800">
              {activePromos.length} campanhas ativas no momento
            </span>
            <p className="text-xs text-slate-500">
              Descontos válidos por tempo limitado ou até esgotarem as vagas
            </p>
          </div>

          <Link
            href="/"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Voltar para o início
          </Link>
        </div>

        {/* GRADE DE PROMOÇÕES */}
        {activePromos.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm max-w-lg mx-auto space-y-4">
            <div className="size-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-500">
              <Percent className="size-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Novas promoções em breve!
            </h3>
            <p className="text-sm text-slate-500">
              Nossa equipe está preparando novos pacotes e tarifas promocionais. Volte em alguns instantes ou entre em contato com nossos especialistas.
            </p>
            <Link
              href="/contato"
              className="inline-block px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition shadow-sm"
            >
              Falar com Especialista
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activePromos.map((promo) => (
              <PromoCardItem key={promo.id} promo={promo} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

function PromoCardItem({ promo }: { promo: Promotion }) {
  const router = useRouter();
  const [isLoadingOffer, setIsLoadingOffer] = useState(false);

  const handleAproveitarOferta = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoadingOffer(true);
    router.push(promo.link);
  };

  return (
    <>
      <article className="group relative h-[420px] w-full rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-200 flex flex-col justify-between p-7 bg-slate-900">
        {/* IMAGEM DE FUNDO */}
        <Image
          src={promo.imageUrl}
          alt={promo.title}
          fill
          unoptimized={promo.imageUrl?.startsWith("data:")}
          className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* GRADIENTE */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-black/30 pointer-events-none" />

        {/* TOPO: SELOS */}
        <div className="relative z-10 flex items-start justify-between gap-3">
          {promo.badge && (
            <div className="bg-secondary text-primary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5 backdrop-blur-xs">
              <Zap className="size-3 fill-primary text-primary" />
              <span>{promo.badge}</span>
            </div>
          )}

          {promo.discountText && (
            <div className="bg-emerald-600/95 text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 backdrop-blur-xs border border-emerald-400/30">
              <Tag className="size-3" />
              <span>{promo.discountText}</span>
            </div>
          )}
        </div>

        {/* RODAPÉ DO CARD */}
        <div className="relative z-10 space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary flex items-center gap-1">
            ✦ Válido para reserva imediata
          </span>

          <h2 className="font-black text-2xl text-white leading-tight drop-shadow-md group-hover:text-secondary transition-colors line-clamp-2">
            {promo.title}
          </h2>

          {promo.subtitle && (
            <p className="text-xs text-slate-200/90 leading-relaxed line-clamp-2 drop-shadow-xs">
              {promo.subtitle}
            </p>
          )}

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleAproveitarOferta}
              disabled={isLoadingOffer}
              className="w-full sm:w-auto px-5 py-3 bg-secondary hover:bg-secondary/90 text-primary font-black text-xs rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-secondary/30 transition-transform group-hover:translate-x-1 cursor-pointer disabled:opacity-80"
            >
              {isLoadingOffer ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Carregando Oferta...</span>
                </>
              ) : (
                <>
                  <span>{promo.buttonText || "Aproveitar Oferta"}</span>
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </button>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-white/80 font-semibold">
              <ShieldCheck className="size-3.5 text-secondary" />
              Até 12x s/ juros
            </span>
          </div>
        </div>
      </article>

      {/* LOADING PAGE EM TELA CHEIA AO CLICAR EM APROVEITAR OFERTA */}
      {isLoadingOffer && (
        <div className="fixed inset-0 z-50 animate-in fade-in duration-200">
          <LoadingScreen
            title="Aproveitando Oferta Exclusiva..."
            subtitle={`Carregando as melhores condições e tarifas para "${promo.title}"`}
            type="hotel"
            fullScreen={true}
          />
        </div>
      )}
    </>
  );
}
