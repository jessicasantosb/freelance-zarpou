"use client";

import { use, useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  Check,
  ShieldCheck,
  Coffee,
  Users,
  Maximize2,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { useProductStore } from "@/stores/product-store";
import { useBookingStore } from "@/stores/booking-store";
import { Container } from "@/components/shared/container";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { Room } from "@/types/product";
import { calculateHotelRating } from "@/lib/rating-utils";
import { formatDateBR } from "@/lib/formateDate";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function HotelDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const hotelId = resolvedParams.id;

  const searchParams = useSearchParams();
  const { hotels, fetchHotels } = useProductStore();
  const { startHotelBooking, bookings } = useBookingStore();

  useEffect(() => {
    if (hotels.length === 0) {
      fetchHotels();
    }
  }, [hotels.length, fetchHotels]);

  const hotel = useMemo(
    () => hotels.find((h) => h.id === hotelId) || (hotels.length > 0 ? hotels[0] : null),
    [hotels, hotelId]
  );

  const checkIn = searchParams.get("checkIn") || "2026-11-20";
  const checkOut = searchParams.get("checkOut") || "2026-11-23";
  const adults = Number(searchParams.get("adults") || 2);
  const children = Number(searchParams.get("children") || 0);

  // Calcular número de noites
  const nights = useMemo(() => {
    try {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const diff = Math.ceil(
        Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diff > 0 ? diff : 3;
    } catch {
      return 3;
    }
  }, [checkIn, checkOut]);

  const [activePhoto, setActivePhoto] = useState<string>("");

  useEffect(() => {
    if (hotel?.imageUrl) {
      setActivePhoto(hotel.imageUrl);
    }
  }, [hotel?.imageUrl]);

  const handleSelectRoom = (room: Room) => {
    if (!hotel) return;
    startHotelBooking(hotel, room, checkIn, checkOut, adults, children);
    router.push("/checkout");
  };

  if (!hotel) {
    return (
      <LoadingScreen
        title="Carregando Detalhes da Hospedagem..."
        subtitle="Sincronizando acomodações e valores promocionais da Zarpou"
        type="hotel"
        fullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <Container>
        {/* Navegação Breadcrumb */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/hospedagens"
            className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
          >
            <ArrowLeft className="size-4" />
            Voltar para a lista de hospedagens
          </Link>

          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: hotel.name,
                  text: `Confira ${hotel.name} na Zarpou Viagens!`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copiado para a área de transferência!");
              }
            }}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-primary transition font-medium"
          >
            <Share2 className="size-4" />
            Compartilhar
          </button>
        </div>

        {/* CABEÇALHO DO HOTEL */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-amber-400 text-amber-400"
                  />
                ))}
                <span className="text-xs text-slate-500 font-semibold ml-1">
                  Hotel {hotel.stars} estrelas
                </span>
                {hotel.badges && hotel.badges.length > 0 && (
                  <span className="ml-2 bg-secondary text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {hotel.badges[0]}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                {hotel.name}
              </h1>

              <p className="text-xs md:text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                <MapPin className="size-4 text-primary shrink-0" />
                {hotel.address} • {hotel.neighborhood}, {hotel.city} - {hotel.state}
              </p>
            </div>

            {/* NOTA E AVALIAÇÃO (Só exibe se não for nula e não for muito baixa) */}
            {(() => {
              const ratingInfo = calculateHotelRating(hotel, bookings);
              if (!ratingInfo.shouldShow || !ratingInfo.rating) return null;
              return (
                <div className="flex items-center md:flex-col md:items-end gap-3 md:gap-0 shrink-0 bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-primary leading-tight">
                        {ratingInfo.label}
                      </p>
                      <p className="text-xs text-slate-500">
                        {ratingInfo.reviewCount > 0
                          ? `${ratingInfo.reviewCount} ${ratingInfo.reviewCount === 1 ? "avaliação verificada" : "avaliações verificadas"}`
                          : "Avaliação Zarpou"}
                      </p>
                    </div>
                    <span className="bg-primary text-white text-lg font-black px-3 py-1.5 rounded-xl shadow-xs">
                      {ratingInfo.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* GALERIA DE FOTOS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-6">
            <div className="relative md:col-span-8 h-80 md:h-[420px] rounded-2xl overflow-hidden shadow-xs">
              <Image
                src={activePhoto}
                alt={hotel.name}
                fill
                priority
                unoptimized={activePhoto?.startsWith("data:")}
                className="object-cover"
              />
            </div>
            <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-3">
              {hotel.gallery.slice(0, 3).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePhoto(img)}
                  className={`relative h-24 md:h-[132px] rounded-xl overflow-hidden cursor-pointer transition border-2 ${
                    activePhoto === img
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Foto ${idx + 1}`}
                    fill
                    unoptimized={img?.startsWith("data:")}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DETALHES, COMODIDADES E SELEÇÃO DE QUARTOS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* COLUNA PRINCIPAL */}
          <div className="lg:col-span-8 space-y-8">
            {/* Sobre a Acomodação */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900">
                Sobre a Acomodação
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {hotel.description}
              </p>

              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pt-3">
                Comodidades do Hotel
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                {hotel.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100"
                  >
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SELEÇÃO DE QUARTOS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  Opções de Quartos Disponíveis
                </h2>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  Tarifas garantidas Zarpou
                </span>
              </div>

              {hotel.rooms.map((room) => {
                const roomTotalPrice = room.pricePerNight * nights;
                const installment = (roomTotalPrice / hotel.maxInstallments).toFixed(2);

                return (
                  <div
                    key={room.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-primary/50 transition-all duration-300 space-y-5"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {room.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {room.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-3">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Users className="size-4 text-primary" />
                            Até {room.maxAdults} adultos
                            {room.maxChildren > 0 && `, ${room.maxChildren} crianças`}
                          </span>
                          <span className="flex items-center gap-1.5 font-medium">
                            <Maximize2 className="size-4 text-primary" />
                            {room.sizeM2} m²
                          </span>
                          <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {room.beds}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {room.originalPricePerNight && (
                          <span className="text-xs text-slate-400 line-through">
                            R$ {room.originalPricePerNight}
                          </span>
                        )}
                        <p className="text-2xl font-black text-primary">
                          R$ {room.pricePerNight}
                          <span className="text-xs font-normal text-slate-500"> / noite</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          Total para {nights} noites: <strong>R$ {roomTotalPrice}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Vantagens do quarto */}
                      <div className="space-y-1.5 text-xs">
                        {room.breakfastIncluded && (
                          <p className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                            <Coffee className="size-4 text-emerald-600" />
                            Café da manhã buffet incluso
                          </p>
                        )}
                        {room.freeCancellation && (
                          <p className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                            <ShieldCheck className="size-4 text-emerald-600" />
                            Cancelamento grátis até 48h antes do check-in
                          </p>
                        )}
                        <p className="text-slate-500">
                          Disponibilidade: <strong>{room.availableRooms} quartos restantes</strong>
                        </p>
                      </div>

                      {/* Botão de Reserva Imediata */}
                      <div className="w-full sm:w-auto text-right">
                        <p className="text-[11px] font-bold text-emerald-600 mb-1.5">
                          Em até {hotel.maxInstallments}x de R$ {installment} sem juros
                        </p>
                        <button
                          type="button"
                          onClick={() => handleSelectRoom(room)}
                          className="w-full sm:w-auto px-8 py-3 bg-secondary hover:bg-secondary/90 text-primary font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-secondary/30 transition transform hover:scale-102 cursor-pointer"
                        >
                          Reservar este quarto
                          <ArrowRight className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIDEBAR DE RESUMO DA VIAGEM */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs sticky top-24 space-y-6">
              <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                Resumo da Estadia
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Check-in:</span>
                  <span className="font-bold text-slate-800">{formatDateBR(checkIn)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Check-out:</span>
                  <span className="font-bold text-slate-800">{formatDateBR(checkOut)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Duração:</span>
                  <span className="font-bold text-slate-800">{nights} {nights === 1 ? "noite" : "noites"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Hóspedes:</span>
                  <span className="font-bold text-slate-800">{adults} adultos{children > 0 && `, ${children} crianças`}</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-1.5">
                <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  Garantia de Melhor Preço Zarpou
                </p>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Sem taxas ocultas. Pagamento seguro pelo próprio app em até 12x ou Pix com 5% de desconto.
                </p>
              </div>

              <div className="pt-2">
                <p className="text-xs text-slate-400 text-center">
                  Dúvidas sobre o hotel? Fale com a equipe Zarpou pelo WhatsApp.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
