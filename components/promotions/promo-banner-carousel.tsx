"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Tag,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { usePromotionStore } from "@/stores/promotion-store";
import { Container } from "@/components/shared/container";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { Promotion } from "@/types/promotion";

export function PromoBannerCarousel() {
  const { promotions, fetchPromotions } = usePromotionStore();
  const [mounted, setMounted] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    setMounted(true);
    if (promotions.length === 0) {
      fetchPromotions();
    }
  }, [promotions.length, fetchPromotions]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const activePromos = mounted ? promotions.filter((p) => p.active) : [];

  if (!mounted || activePromos.length === 0) return null;

  return (
    <section className="py-14 bg-slate-50/70 select-none overflow-hidden">
      <Container>
        {/* CABEÇALHO DA SEÇÃO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-primary text-[11px] font-black uppercase tracking-wider mb-2.5">
              <Sparkles className="size-3 text-secondary fill-secondary" />
              Oportunidades Imperdíveis
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Ofertas & Promoções Zarpou
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-xl">
              Condições exclusivas com até 35% de desconto e parcelamento em até 12x sem juros para os destinos mais desejados.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* CONTROLES DE NAVEGAÇÃO DO CARROSSEL */}
            {activePromos.length > 3 && (
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollPrev()}
                  disabled={!canScrollPrev}
                  className="size-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  title="Ofertas anteriores"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollNext()}
                  disabled={!canScrollNext}
                  className="size-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  title="Próximas ofertas"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            )}

            <Link
              href="/promocoes"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition group pb-1"
            >
              <span>Ver todas as promoções</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* CARROSSEL / GRADE DE CARDS MODERNOS */}
        {activePromos.length <= 3 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePromos.map((promo) => (
              <PromoCard key={promo.id} promo={promo} />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden -mx-4 px-4" ref={emblaRef}>
            <div className="flex gap-6">
              {activePromos.map((promo) => (
                <div
                  key={promo.id}
                  className="min-w-0 shrink-0 grow-0 basis-full sm:basis-[calc(50%-12px)] lg:basis-[calc(33.333%-16px)]"
                >
                  <PromoCard promo={promo} />
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

function PromoCard({ promo }: { promo: Promotion }) {
  const router = useRouter();
  const [isLoadingOffer, setIsLoadingOffer] = useState(false);

  const handleAproveitarOferta = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoadingOffer(true);
    router.push(promo.link);
  };

  return (
    <>
      <div className="group relative h-[380px] w-full rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-200/80 flex flex-col justify-between p-6">
        {/* IMAGEM DE FUNDO COM ZOOM SUAVE NO HOVER */}
        <Image
          src={promo.imageUrl}
          alt={promo.title}
          fill
          unoptimized={promo.imageUrl?.startsWith("data:")}
          className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* GRADIENTE MULTICAMADAS CINEMATOGRÁFICO PARA MÁXIMA LEGIBILIDADE */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/35 pointer-events-none" />

        {/* TOPO: SELOS FLUTUANTES (BADGE + DESCONTO) */}
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="bg-secondary text-primary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5 backdrop-blur-xs">
            <Zap className="size-3 fill-primary text-primary" />
            <span>{promo.badge}</span>
          </div>

          <div className="bg-emerald-600/95 text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 backdrop-blur-xs border border-emerald-400/30">
            <Tag className="size-3" />
            <span>{promo.discountText}</span>
          </div>
        </div>

        {/* RODAPÉ DO CARD: TÍTULO, SUBTÍTULO E CTA */}
        <div className="relative z-10 space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary flex items-center gap-1">
            ✦ Válido para reserva imediata
          </span>

          <h3 className="font-black text-xl md:text-2xl text-white leading-tight drop-shadow-md group-hover:text-secondary transition-colors line-clamp-2">
            {promo.title}
          </h3>

          <p className="text-xs text-slate-200/90 leading-relaxed line-clamp-2 drop-shadow-xs font-normal">
            {promo.subtitle}
          </p>

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
                  <span>{promo.buttonText}</span>
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </button>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-white/80 font-semibold drop-shadow-xs">
              <ShieldCheck className="size-3.5 text-secondary" />
              Até 12x s/ juros
            </span>
          </div>
        </div>
      </div>

      {/* LOADING PAGE EM TELA CHEIA AO CLICAR EM APROVEITAR OFERTA */}
      {isLoadingOffer && (
        <div className="fixed inset-0 z-50 animate-in fade-in duration-200">
          <LoadingScreen
            title="Aproveitando Oferta Exclusiva..."
            subtitle={`Carregando as melhores condições e detalhes para "${promo.title}"`}
            type="hotel"
            fullScreen={true}
          />
        </div>
      )}
    </>
  );
}
