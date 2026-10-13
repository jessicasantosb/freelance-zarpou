"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  Check,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { useProductStore } from "@/stores/product-store";
import { useBookingStore } from "@/stores/booking-store";
import { Container } from "@/components/shared/container";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { calculateHotelRating } from "@/lib/rating-utils";
import { formatDateBR } from "@/lib/formateDate";

function HospedagensContent() {
  const searchParams = useSearchParams();
  const { hotels, fetchHotels } = useProductStore();
  const { bookings } = useBookingStore();

  useEffect(() => {
    if (hotels.length === 0) {
      fetchHotels();
    }
  }, [hotels.length, fetchHotels]);

  const initialCity = searchParams.get("city") || "";
  const initialCheckIn = searchParams.get("checkIn") || "2026-11-20";
  const initialCheckOut = searchParams.get("checkOut") || "2026-11-23";
  const initialAdults = Math.max(1, Number(searchParams.get("adults") || 2));
  const initialRooms = Math.min(initialAdults, Math.max(1, Number(searchParams.get("rooms") || 1)));

  // Estados dos filtros editáveis
  const [searchTerm, setSearchTerm] = useState(initialCity);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [adults, setAdults] = useState(initialAdults);
  const [rooms, setRooms] = useState(initialRooms);

  // Garantir que quartos nunca excedam o número de hóspedes
  useEffect(() => {
    if (rooms > adults) {
      setRooms(adults);
    }
  }, [adults, rooms]);

  // Data de hoje formatada (YYYY-MM-DD)
  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // Calcular número de noites dinamicamente
  const nights = useMemo(() => {
    try {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const diff = Math.ceil(
        Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diff > 0 ? diff : 1;
    } catch {
      return 1;
    }
  }, [checkIn, checkOut]);

  // Outros filtros
  const [priceMax, setPriceMax] = useState<number>(5000);
  const [freeCancellation, setFreeCancellation] = useState<boolean>(false);
  const [breakfastOnly, setBreakfastOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<
    "recommended" | "price_asc" | "price_desc" | "rating_desc"
  >("recommended");

  const toggleStar = (star: number) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  };

  // Filtragem dos hotéis
  const filteredHotels = useMemo(() => {
    return hotels
      .filter((h) => {
        // Busca textual por cidade ou nome
        if (
          searchTerm &&
          !h.city.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !h.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }

        // Preço máximo
        if (h.basePricePerNight > priceMax) return false;

        // Avaliação mínima (respeitando se deve mostrar ou não)
        if (minRating > 0) {
          const ratingInfo = calculateHotelRating(h, bookings);
          if (!ratingInfo.shouldShow || (ratingInfo.rating ?? 0) < minRating) return false;
        }

        // Estrelas
        if (selectedStars.length > 0 && !selectedStars.includes(h.stars)) {
          return false;
        }

        // Café da manhã
        if (
          breakfastOnly &&
          !h.amenities.some((a) => a.toLowerCase().includes("café"))
        ) {
          return false;
        }

        // Cancelamento grátis
        if (
          freeCancellation &&
          !h.rooms.some((r) => r.freeCancellation)
        ) {
          return false;
        }

        // Capacidade por hóspedes e quartos (se o hotel tiver quartos configurados)
        if (adults > 0 && h.rooms && h.rooms.length > 0) {
          const requiredCapacityPerRoom = Math.ceil(adults / rooms);
          const hasCapacity = h.rooms.some((r) => (r.maxAdults || 2) >= requiredCapacityPerRoom);
          if (!hasCapacity) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.basePricePerNight - b.basePricePerNight;
        if (sortBy === "price_desc") return b.basePricePerNight - a.basePricePerNight;
        if (sortBy === "rating_desc") {
          const rA = calculateHotelRating(a, bookings).rating ?? 0;
          const rB = calculateHotelRating(b, bookings).rating ?? 0;
          return rB - rA;
        }
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    hotels,
    bookings,
    searchTerm,
    priceMax,
    minRating,
    selectedStars,
    breakfastOnly,
    freeCancellation,
    adults,
    rooms,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-slate-50 pt-[65px] pb-16">
      {/* Barra Superior de Resumo da Busca */}
      <div className="bg-primary text-white py-4 shadow-md border-b border-primary/20 mb-8">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                <MapPin className="size-5 text-secondary" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">
                  {searchTerm ? `Hospedagens em ${searchTerm}` : "Todas as Hospedagens"}
                </h1>
                <p className="text-xs text-white/80">
                  {formatDateBR(checkIn)} até {formatDateBR(checkOut)} • {nights} {nights === 1 ? "noite" : "noites"} • {adults} {adults === 1 ? "hóspede" : "hóspedes"}, {rooms} {rooms === 1 ? "quarto" : "quartos"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Mudar destino ou hotel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 text-white placeholder:text-white/60 text-xs rounded-xl pl-9 pr-3 py-2 border border-white/20 focus:outline-hidden focus:bg-white/20"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setPriceMax(5000);
                  setFreeCancellation(false);
                  setBreakfastOnly(false);
                  setMinRating(0);
                  setSelectedStars([]);
                  setCheckIn(initialCheckIn);
                  setCheckOut(initialCheckOut);
                  setAdults(initialAdults);
                  setRooms(initialRooms);
                  if (typeof window !== "undefined") {
                    window.history.replaceState(null, "", "/hospedagens");
                  }
                }}
                className="whitespace-nowrap px-4 py-2 bg-secondary text-primary font-bold text-xs rounded-xl hover:bg-secondary/90 transition shadow-sm cursor-pointer"
                title="Limpar pesquisa e filtros para ver todas as hospedagens"
              >
                Limpar Busca
              </button>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* BARRA LATERAL DE FILTROS */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-6 sticky top-24">
              <div className="pb-3 border-b border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-2 font-bold text-primary text-base">
                  <SlidersHorizontal className="size-4 text-secondary shrink-0" />
                  <span>Filtros de Busca</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPriceMax(5000);
                    setFreeCancellation(false);
                    setBreakfastOnly(false);
                    setMinRating(0);
                    setSelectedStars([]);
                    setCheckIn(initialCheckIn);
                    setCheckOut(initialCheckOut);
                    setAdults(initialAdults);
                    setRooms(initialRooms);
                  }}
                  className="w-full text-xs font-semibold py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-primary transition cursor-pointer text-center"
                >
                  Limpar
                </button>
              </div>

              {/* Período da Estadia & Hóspedes */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-primary" />
                  Datas & Hóspedes
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Check-in
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={checkIn}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCheckIn(val);
                        if (val && checkOut && val > checkOut) {
                          setCheckOut(val);
                        }
                      }}
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-hidden focus:border-primary text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Check-out
                    </label>
                    <input
                      type="date"
                      min={checkIn || todayStr}
                      value={checkOut}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (checkIn && val < checkIn) {
                          setCheckOut(checkIn);
                        } else {
                          setCheckOut(val);
                        }
                      }}
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-hidden focus:border-primary text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                  <span>Duração:</span>
                  <span className="font-bold text-primary">{nights} {nights === 1 ? "noite" : "noites"}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">Hóspedes</span>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        disabled={adults <= 1}
                        onClick={() => {
                          setAdults((prev) => {
                            const next = Math.max(1, prev - 1);
                            if (rooms > next) {
                              setRooms(next);
                            }
                            return next;
                          });
                        }}
                        className="size-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs cursor-pointer shadow-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-slate-800">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => Math.min(10, prev + 1))}
                        className="size-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 text-xs cursor-pointer shadow-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">Quartos</span>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        disabled={rooms <= 1}
                        onClick={() => setRooms((prev) => Math.max(1, prev - 1))}
                        className="size-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs cursor-pointer shadow-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-slate-800">{rooms}</span>
                      <button
                        type="button"
                        disabled={rooms >= adults || rooms >= 5}
                        onClick={() => setRooms((prev) => Math.min(adults, prev + 1))}
                        className="size-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs cursor-pointer shadow-xs"
                        title={rooms >= adults ? "O número de quartos não pode ser maior que o de hóspedes" : ""}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preço Máximo por Noite */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Preço por noite
                  </label>
                  <span className="text-xs font-semibold text-primary">
                    Até R$ {priceMax}
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="8000"
                  step="50"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>R$ 200</span>
                  <span>R$ 8.000+</span>
                </div>
              </div>

              {/* Vantagens Mais Procuradas */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Vantagens Mais Buscadas
                </p>
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-primary">
                  <input
                    type="checkbox"
                    checked={freeCancellation}
                    onChange={(e) => setFreeCancellation(e.target.checked)}
                    className="size-4 rounded-md accent-primary"
                  />
                  <span>Cancelamento Grátis</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-primary">
                  <input
                    type="checkbox"
                    checked={breakfastOnly}
                    onChange={(e) => setBreakfastOnly(e.target.checked)}
                    className="size-4 rounded-md accent-primary"
                  />
                  <span>Café da Manhã Incluso</span>
                </label>
              </div>

              {/* Avaliação dos Viajantes */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Avaliação dos Hóspedes
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: "Todas", val: 0 },
                    { label: "8.5+", val: 8.5 },
                    { label: "9.0+", val: 9.0 },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setMinRating(item.val)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                        minRating === item.val
                          ? "bg-primary text-white border-primary"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categoria / Estrelas */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Classificação por Estrelas
                </p>
                <div className="flex flex-col gap-2">
                  {[5, 4, 3].map((star) => (
                    <label
                      key={star}
                      className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-primary"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStars.includes(star)}
                        onChange={() => toggleStar(star)}
                        className="size-4 rounded-md accent-primary"
                      />
                      <span className="flex items-center gap-1 font-medium">
                        {Array.from({ length: star }).map((_, i) => (
                          <Star
                            key={i}
                            className="size-3.5 fill-amber-400 text-amber-400"
                          />
                        ))}
                        <span className="ml-1 text-slate-500">
                          ({star} estrelas)
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* LISTAGEM DE RESULTADOS */}
          <main className="lg:col-span-9 space-y-5">
            {/* Barra de Ordenação e Contador */}
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs font-medium text-slate-600">
                Mostrando <strong className="text-slate-900">{filteredHotels.length}</strong> acomodações disponíveis
              </span>

              <div className="flex items-center gap-2 text-xs">
                <ArrowUpDown className="size-3.5 text-slate-400" />
                <span className="text-slate-500 font-medium">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | "recommended"
                        | "price_asc"
                        | "price_desc"
                        | "rating_desc"
                    )
                  }
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-semibold text-slate-700 text-xs focus:ring-1 focus:ring-primary focus:outline-hidden cursor-pointer"
                >
                  <option value="recommended">Mais recomendados</option>
                  <option value="price_asc">Menor preço primeiro</option>
                  <option value="price_desc">Maior preço primeiro</option>
                  <option value="rating_desc">Melhor avaliação</option>
                </select>
              </div>
            </div>

            {/* Lista de Hotéis */}
            {filteredHotels.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
                <p className="text-lg font-bold text-slate-800">
                  Nenhuma acomodação encontrada para estes filtros
                </p>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Tente aumentar o limite de preço ou limpar os filtros de cancelamento e comodidades para ver mais opções.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setPriceMax(5000);
                    setFreeCancellation(false);
                    setBreakfastOnly(false);
                    setMinRating(0);
                    setSelectedStars([]);
                  }}
                  className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition shadow-sm"
                >
                  Ver Todas as Hospedagens
                </button>
              </div>
            ) : (
              filteredHotels.map((hotel) => {
                const totalPrice = hotel.basePricePerNight * nights * rooms;
                const installmentValue = (totalPrice / hotel.maxInstallments).toFixed(2);

                return (
                  <article
                    key={hotel.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 grid grid-cols-1 md:grid-cols-12 group"
                  >
                    {/* Foto Principal do Hotel com Badge */}
                    <div className="relative md:col-span-5 h-56 md:h-full min-h-[220px] overflow-hidden">
                      <Image
                        src={hotel.imageUrl}
                        alt={hotel.name}
                        fill
                        unoptimized={hotel.imageUrl?.startsWith("data:")}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {hotel.badges && hotel.badges.length > 0 && (
                        <div className="absolute top-3 left-3 bg-secondary text-primary text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                          {hotel.badges[0]}
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-medium">
                        {hotel.gallery.length} fotos
                      </div>
                    </div>

                    {/* Informações e Detalhes do Hotel */}
                    <div className="p-5 md:col-span-7 flex flex-col justify-between">
                      <div>
                        {/* Estrelas e Avaliação */}
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              {Array.from({ length: hotel.stars }).map((_, i) => (
                                <Star
                                  key={i}
                                  className="size-3.5 fill-amber-400 text-amber-400"
                                />
                              ))}
                              <span className="text-[11px] text-slate-500 font-medium ml-1">
                                Hotel {hotel.stars} estrelas
                              </span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 group-hover:text-primary transition leading-snug">
                              {hotel.name}
                            </h2>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="size-3.5 text-primary shrink-0" />
                              {hotel.neighborhood}, {hotel.city} - {hotel.state}
                            </p>
                          </div>

                          {/* Nota dos Hóspedes (Só exibe se não for nula e não for muito baixa) */}
                          {(() => {
                            const ratingInfo = calculateHotelRating(hotel, bookings);
                            if (!ratingInfo.shouldShow || !ratingInfo.rating) return null;
                            return (
                              <div className="flex flex-col items-end shrink-0">
                                <span className="bg-primary text-white text-sm font-extrabold px-2.5 py-1 rounded-lg shadow-xs">
                                  {ratingInfo.rating.toFixed(1)}
                                </span>
                                <span className="text-[11px] font-bold text-primary mt-0.5">
                                  {ratingInfo.label}
                                </span>
                                {ratingInfo.reviewCount > 0 && (
                                  <span className="text-[10px] text-slate-400">
                                    {ratingInfo.reviewCount} {ratingInfo.reviewCount === 1 ? "avaliação" : "avaliações"}
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </div>

                        {/* Comodidades Principais */}
                        <div className="flex flex-wrap gap-1.5 my-3">
                          {hotel.amenities.slice(0, 4).map((amenity) => (
                            <span
                              key={amenity}
                              className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium flex items-center gap-1"
                            >
                              <Check className="size-3 text-emerald-600" />
                              {amenity}
                            </span>
                          ))}
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2">
                          {hotel.description}
                        </p>
                      </div>

                      {/* Bloco de Preço e CTA */}
                      <div className="pt-4 mt-3 border-t border-slate-100 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3">
                        <div className="text-right sm:text-left">
                          {hotel.originalPricePerNight && (
                            <span className="text-xs text-slate-400 line-through mr-1.5">
                              R$ {hotel.originalPricePerNight}
                            </span>
                          )}
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs font-semibold text-slate-500">
                              Diária a partir de
                            </span>
                            <span className="text-2xl font-extrabold text-primary">
                              R$ {hotel.basePricePerNight}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Total de <strong>R$ {totalPrice}</strong> para {nights} {nights === 1 ? "noite" : "noites"}{rooms > 1 ? ` (${rooms} quartos)` : ""}
                          </p>
                          <p className="text-xs font-bold text-emerald-600 mt-0.5">
                            Em até {hotel.maxInstallments}x de R$ {installmentValue} sem juros
                          </p>
                        </div>

                        <Link
                          href={`/hospedagens/${hotel.id}?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&rooms=${rooms}`}
                          className="w-full sm:w-auto px-6 py-3 bg-secondary hover:bg-secondary/90 text-primary font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-secondary/20 transition transform group-hover:scale-102"
                        >
                          Ver quartos
                          <ArrowRight className="size-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}

export default function HospedagensPage() {
  return (
    <Suspense
      fallback={
        <LoadingScreen
          title="Buscando Hotéis e Resorts..."
          subtitle="Filtrando acomodações exclusivas, cancelamento grátis e café da manhã incluso"
          type="hotel"
          fullScreen={true}
        />
      }
    >
      <HospedagensContent />
    </Suspense>
  );
}
