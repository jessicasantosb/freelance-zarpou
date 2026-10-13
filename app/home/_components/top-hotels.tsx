"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  MapPin,
  Coffee,
  Waves,
  Wifi,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { useProductStore } from "@/stores/product-store";
import { useBookingStore } from "@/stores/booking-store";
import { calculateHotelRating } from "@/lib/rating-utils";
import { Hotel } from "@/types/product";

export function TopHotels() {
  const { hotels, fetchHotels } = useProductStore();
  const { bookings } = useBookingStore();
  const [mounted, setMounted] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("all");

  useEffect(() => {
    setMounted(true);
    if (hotels.length === 0) {
      fetchHotels();
    }
  }, [hotels.length, fetchHotels]);

  const safeHotels = mounted ? hotels : [];

  // Obter cidades únicas disponíveis para os chips de filtro rápido
  const cities = ["all", ...Array.from(new Set(safeHotels.map((h) => h.city)))];

  const filteredHotels =
    selectedCity === "all"
      ? safeHotels.slice(0, 3)
      : safeHotels.filter((h) => h.city === selectedCity).slice(0, 3);

  return (
    <section className="py-16 bg-white select-none">
      <Container>
        {/* CABEÇALHO DA SEÇÃO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-primary text-[11px] font-black uppercase tracking-wider mb-2.5">
              <Sparkles className="size-3 text-secondary fill-secondary" />
              Curadoria Premium Zarpou
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hospede-se com Estilo
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-xl">
              Acomodações selecionadas a dedo com alto padrão de conforto, localização privilegiada e as melhores avaliações de hóspedes.
            </p>
          </div>

          <Link
            href="/hospedagens"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition group self-start md:self-auto pb-1"
          >
            <span>Ver todas as hospedagens</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* CHIPS DE FILTRO RÁPIDO POR CIDADE */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Destinos:
          </span>
          {cities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setSelectedCity(city)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCity === city
                  ? "bg-primary text-white shadow-xs font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {city === "all" ? "Todos os Destaques" : city}
            </button>
          ))}
        </div>

        {/* GRADE DE CARDS DE HOTÉIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredHotels.map((hotel: Hotel) => {
            const installmentValue = (
              hotel.basePricePerNight / (hotel.maxInstallments || 12)
            ).toFixed(2);

            return (
              <div
                key={hotel.id}
                className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* IMAGEM PRINCIPAL COM BADGES MODERNOS */}
                  <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      fill
                      unoptimized={hotel.imageUrl?.startsWith("data:")}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradiente escuro para contraste de texto */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

                    {/* Selo Promocional ou de Recomendação */}
                    <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start">
                      {hotel.badges && hotel.badges[0] && (
                        <span className="bg-secondary text-primary text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                          {hotel.badges[0]}
                        </span>
                      )}
                    </div>

                    {/* Nota de Avaliação (Só exibe se não for nula e não for muito baixa) */}
                    {(() => {
                      const ratingInfo = calculateHotelRating(hotel, bookings);
                      if (!ratingInfo.shouldShow || !ratingInfo.rating) return null;
                      return (
                        <div className="absolute top-3.5 right-3.5 bg-primary/95 text-white backdrop-blur-xs px-2.5 py-1 rounded-xl shadow-xs flex items-center gap-1.5 text-xs font-black">
                          <Star className="size-3 fill-secondary text-secondary" />
                          <span>{ratingInfo.rating.toFixed(1)}</span>
                        </div>
                      );
                    })()}

                    {/* Localização na parte inferior da foto */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
                      <span className="flex items-center gap-1 font-semibold drop-shadow-xs truncate">
                        <MapPin className="size-3.5 text-secondary shrink-0" />
                        {hotel.neighborhood || hotel.city}, {hotel.state}
                      </span>
                      {(() => {
                        const ratingInfo = calculateHotelRating(hotel, bookings);
                        if (!ratingInfo.shouldShow || ratingInfo.reviewCount <= 0) return null;
                        return (
                          <span className="text-[11px] text-white/90 font-medium shrink-0">
                            {ratingInfo.reviewCount} avaliações
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* CORPO DO CARD */}
                  <div className="p-5 space-y-3">
                    {/* Estrelas do Hotel */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: hotel.stars }).map((_, i) => (
                        <Star
                          key={i}
                          className="size-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                      <span className="text-[11px] font-semibold text-slate-500 ml-1">
                        Hotel {hotel.stars} estrelas
                      </span>
                    </div>

                    {/* Nome do Hotel */}
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-primary transition line-clamp-1">
                      {hotel.name}
                    </h3>

                    {/* Descrição resumida */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {hotel.description}
                    </p>

                    {/* Comodidades em destaque */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        <Coffee className="size-3 text-amber-600" />
                        Café Incluso
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        <Waves className="size-3 text-sky-600" />
                        Piscina
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        <Wifi className="size-3 text-emerald-600" />
                        Wi-Fi
                      </span>
                    </div>
                  </div>
                </div>

                {/* RODAPÉ DO CARD: PREÇO & CTA */}
                <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-end justify-between gap-3">
                  <div>
                    {hotel.originalPricePerNight &&
                      hotel.originalPricePerNight > hotel.basePricePerNight && (
                        <p className="text-[11px] text-slate-400 line-through">
                          De R$ {hotel.originalPricePerNight.toLocaleString("pt-BR")}
                        </p>
                      )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-slate-500">Por</span>
                      <span className="text-xl font-black text-primary">
                        R$ {hotel.basePricePerNight.toLocaleString("pt-BR")}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        / noite
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">
                      ou até {hotel.maxInstallments}x de R${" "}
                      {Number(installmentValue).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      s/ juros
                    </p>
                  </div>

                  <Link
                    href={`/hospedagens/${hotel.id}`}
                    className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition shrink-0 group-hover:bg-primary"
                  >
                    <span>Ver Quartos</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* BENEFÍCIO COMPLEMENTAR NO FINAL DA SEÇÃO */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-emerald-600" />
            Cancelamento Grátis em hotéis selecionados
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-4 text-secondary" />
            Parcelamento facilitado em até 12x sem juros
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <Star className="size-4 text-amber-500 fill-amber-500" />
            Avaliações 100% de hóspedes reais
          </span>
        </div>
      </Container>
    </section>
  );
}
