"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plane,
  ArrowRight,
  Luggage,
  Clock,
  SlidersHorizontal,
  ArrowUpDown,
  Calendar,
} from "lucide-react";
import { useProductStore } from "@/stores/product-store";
import { useBookingStore } from "@/stores/booking-store";
import { Container } from "@/components/shared/container";
import { Flight } from "@/types/product";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { formatDateBR } from "@/lib/formateDate";

function PassagensContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { flights, fetchFlights } = useProductStore();
  const { startFlightBooking } = useBookingStore();

  useEffect(() => {
    if (flights.length === 0) {
      fetchFlights();
    }
  }, [flights.length, fetchFlights]);

  const originParam = searchParams.get("from") || "";
  const destParam = searchParams.get("to") || "";
  const initialDepartureDate = searchParams.get("departureDate") || "2026-11-20";
  const initialReturnDate = searchParams.get("returnDate") || "2026-11-27";
  const initialAdults = Number(searchParams.get("adults") || 2);
  const initialChildren = Number(searchParams.get("children") || 0);

  // Filtros interativos de datas e passageiros
  const [departureDate, setDepartureDate] = useState(initialDepartureDate);
  const [returnDate, setReturnDate] = useState(initialReturnDate);
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);
  const totalTravelers = adults + children;

  // Data de hoje formatada (YYYY-MM-DD)
  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // Filtros
  const [directOnly, setDirectOnly] = useState(false);
  const [baggageOnly, setBaggageOnly] = useState(false);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState<number>(15000);
  const [sortBy, setSortBy] = useState<"recommended" | "price_asc" | "price_desc">("recommended");

  // Companhias únicas
  const availableAirlines = useMemo(() => {
    const set = new Set<string>();
    flights.forEach((f) => set.add(f.outbound.airline));
    return Array.from(set);
  }, [flights]);

  const toggleAirline = (airline: string) => {
    setSelectedAirlines((prev) =>
      prev.includes(airline)
        ? prev.filter((a) => a !== airline)
        : [...prev, airline]
    );
  };

  const filteredFlights = useMemo(() => {
    return flights
      .filter((f) => {
        // Filtro por origem/destino se fornecido
        if (
          originParam &&
          !f.outbound.originCity.toLowerCase().includes(originParam.toLowerCase()) &&
          !f.outbound.originIata.toLowerCase().includes(originParam.toLowerCase())
        ) {
          // Permite passar se não houver match estrito na simulação
        }

        if (
          destParam &&
          !f.outbound.destinationCity.toLowerCase().includes(destParam.toLowerCase()) &&
          !f.outbound.destinationIata.toLowerCase().includes(destParam.toLowerCase())
        ) {
          // Permite passar na busca genérica
        }

        if (f.price > priceMax) return false;
        if (directOnly && f.outbound.stops > 0) return false;
        if (baggageOnly && !f.outbound.baggageIncluded) return false;
        if (
          selectedAirlines.length > 0 &&
          !selectedAirlines.includes(f.outbound.airline)
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    flights,
    originParam,
    destParam,
    priceMax,
    directOnly,
    baggageOnly,
    selectedAirlines,
    sortBy,
  ]);

  const handleSelectFlight = (flight: Flight) => {
    startFlightBooking(flight, departureDate, returnDate, adults, children);
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-[65px] pb-16">
      {/* Header Resumo da Rota */}
      <div className="bg-primary text-white py-4 shadow-md border-b border-primary/20 mb-8">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Plane className="size-5 text-secondary" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">
                  Voos Selecionados Zarpou
                </h1>
                <p className="text-xs text-white/80">
                  Ida {formatDateBR(departureDate)} • Volta {formatDateBR(returnDate)} • {totalTravelers} {totalTravelers === 1 ? "passageiro" : "passageiros"}
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="px-4 py-2 bg-secondary text-primary font-bold text-xs rounded-xl hover:bg-secondary/90 transition shadow-sm"
            >
              Modificar Pesquisa
            </Link>
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
                  <span>Filtros de Voos</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPriceMax(15000);
                    setDirectOnly(false);
                    setBaggageOnly(false);
                    setSelectedAirlines([]);
                    setDepartureDate(initialDepartureDate);
                    setReturnDate(initialReturnDate);
                    setAdults(initialAdults);
                    setChildren(initialChildren);
                  }}
                  className="w-full text-xs font-semibold py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-primary transition cursor-pointer text-center"
                >
                  Limpar
                </button>
              </div>

              {/* Período da Viagem & Passageiros */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-primary" />
                  Datas & Passageiros
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Ida
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={departureDate}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDepartureDate(val);
                        if (val && returnDate && val > returnDate) {
                          setReturnDate(val);
                        }
                      }}
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-hidden focus:border-primary text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Volta
                    </label>
                    <input
                      type="date"
                      min={departureDate || todayStr}
                      value={returnDate}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (departureDate && val < departureDate) {
                          setReturnDate(departureDate);
                        } else {
                          setReturnDate(val);
                        }
                      }}
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-hidden focus:border-primary text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">Adultos</span>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                        className="size-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 text-xs cursor-pointer shadow-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-slate-800">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => Math.min(9, prev + 1))}
                        className="size-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 text-xs cursor-pointer shadow-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">Crianças</span>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                        className="size-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 text-xs cursor-pointer shadow-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-slate-800">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => Math.min(8, prev + 1))}
                        className="size-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 text-xs cursor-pointer shadow-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                  <span>Total de viajantes:</span>
                  <span className="font-bold text-primary">{totalTravelers} {totalTravelers === 1 ? "passageiro" : "passageiros"}</span>
                </div>
              </div>

              {/* Preço Máximo */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Preço por passageiro
                  </label>
                  <span className="text-xs font-semibold text-primary">
                    Até R$ {priceMax}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="100"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* Escalas */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Paradas e Escalas
                </p>
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-primary">
                  <input
                    type="checkbox"
                    checked={directOnly}
                    onChange={(e) => setDirectOnly(e.target.checked)}
                    className="size-4 rounded-md accent-primary"
                  />
                  <span>Somente Voos Diretos</span>
                </label>
              </div>

              {/* Bagagem */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Bagagem
                </p>
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-primary">
                  <input
                    type="checkbox"
                    checked={baggageOnly}
                    onChange={(e) => setBaggageOnly(e.target.checked)}
                    className="size-4 rounded-md accent-primary"
                  />
                  <span>Com bagagem despachada 23kg</span>
                </label>
              </div>

              {/* Companhias Aéreas */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Companhias Aéreas
                </p>
                <div className="flex flex-col gap-2">
                  {availableAirlines.map((airline) => (
                    <label
                      key={airline}
                      className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-primary"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAirlines.includes(airline)}
                        onChange={() => toggleAirline(airline)}
                        className="size-4 rounded-md accent-primary"
                      />
                      <span>{airline}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* LISTAGEM DE RESULTADOS (CARDS DE VOOS) */}
          <main className="lg:col-span-9 space-y-5">
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">
                <strong>{filteredFlights.length}</strong> opções de voos encontrados
              </span>

              <div className="flex items-center gap-2 text-xs">
                <ArrowUpDown className="size-3.5 text-slate-400" />
                <span className="text-slate-500 font-medium">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | "recommended"
                        | "price_asc"
                        | "price_desc"
                    )
                  }
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-semibold text-slate-700 text-xs focus:outline-hidden cursor-pointer"
                >
                  <option value="recommended">Melhor combinação</option>
                  <option value="price_asc">Menor preço</option>
                  <option value="price_desc">Maior preço</option>
                </select>
              </div>
            </div>

            {filteredFlights.map((flight) => {
              const totalPrice = flight.price * totalTravelers;
              const installmentValue = (totalPrice / flight.maxInstallments).toFixed(2);

              return (
                <div
                  key={flight.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* ITINERÁRIOS DE VOO (IDA E VOLTA) */}
                    <div className="lg:col-span-8 space-y-4">
                      {/* Cabeçalho do Voo com Destino, Bandeira e Classe da Cabine */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          {flight.flag && <span className="text-base">{flight.flag}</span>}
                          <span className="text-xs font-bold text-slate-800">
                            {flight.outbound.destinationCity}
                            {flight.country ? ` • ${flight.country}` : ""}
                          </span>
                        </div>
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {flight.outbound.cabinClass || "Classe Econômica"}
                        </span>
                      </div>

                      {/* Trecho de Ida */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                            Ida
                          </span>
                          <span>
                            {formatDateBR(departureDate || flight.outbound.departureDate)}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500 font-medium">
                            {flight.outbound.airline} ({flight.outbound.flightNumber})
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <div className="text-left">
                            <p className="text-xl font-bold text-slate-900">
                              {flight.outbound.departureTime}
                            </p>
                            <p className="text-xs font-bold text-primary">
                              {flight.outbound.originIata}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate max-w-[120px]">
                              {flight.outbound.originCity}
                            </p>
                          </div>

                          <div className="flex-1 flex flex-col items-center px-4">
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mb-1">
                              <Clock className="size-3" />
                              {flight.outbound.duration}
                            </span>
                            <div className="w-full relative flex items-center justify-center">
                              <div className="w-full h-0.5 bg-slate-200" />
                              <Plane className="size-3.5 text-primary absolute rotate-90" />
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-600 mt-1">
                              {flight.outbound.stops === 0
                                ? "Voo Direto"
                                : `1 escala (${flight.outbound.stopCity})`}
                            </span>
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-bold text-slate-900">
                              {flight.outbound.arrivalTime}
                            </p>
                            <p className="text-xs font-bold text-primary">
                              {flight.outbound.destinationIata}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate max-w-[120px]">
                              {flight.outbound.destinationCity}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Trecho de Volta (se houver) */}
                      {flight.returnFlight && (
                        <div className="space-y-1 pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1">
                            <span className="bg-secondary/20 text-primary px-2 py-0.5 rounded-md">
                              Volta
                            </span>
                            <span>
                              {formatDateBR(returnDate || flight.returnFlight.departureDate)}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500 font-medium">
                              {flight.returnFlight.airline} ({flight.returnFlight.flightNumber})
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-4">
                            <div className="text-left">
                              <p className="text-xl font-bold text-slate-900">
                                {flight.returnFlight.departureTime}
                              </p>
                              <p className="text-xs font-bold text-primary">
                                {flight.returnFlight.originIata}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate max-w-[120px]">
                                {flight.returnFlight.originCity}
                              </p>
                            </div>

                            <div className="flex-1 flex flex-col items-center px-4">
                              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mb-1">
                                <Clock className="size-3" />
                                {flight.returnFlight.duration}
                              </span>
                              <div className="w-full relative flex items-center justify-center">
                                <div className="w-full h-0.5 bg-slate-200" />
                                <Plane className="size-3.5 text-secondary absolute rotate-90" />
                              </div>
                              <span className="text-[10px] font-semibold text-emerald-600 mt-1">
                                {flight.returnFlight.stops === 0
                                  ? "Voo Direto"
                                  : `1 escala (${flight.returnFlight.stopCity})`}
                              </span>
                            </div>

                            <div className="text-right">
                              <p className="text-xl font-bold text-slate-900">
                                {flight.returnFlight.arrivalTime}
                              </p>
                              <p className="text-xs font-bold text-primary">
                                {flight.returnFlight.destinationIata}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate max-w-[120px]">
                                {flight.returnFlight.destinationCity}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tag de Bagagem e Destaques do Voo */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 border-t border-slate-50">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Luggage className="size-3.5 text-emerald-600" />
                          <span className="font-medium">
                            {flight.outbound.baggageIncluded
                              ? "Inclui bagagem de mão (10kg) + despachada (23kg)"
                              : flight.outbound.handBaggageIncluded
                              ? "Inclui bagagem de mão (10kg)"
                              : "Sem bagagem inclusa"}
                          </span>
                        </div>

                        {flight.highlights && flight.highlights.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {flight.highlights.map((hl) => (
                              <span
                                key={hl}
                                className="text-[10px] font-semibold bg-primary/5 text-primary border border-primary/15 px-2 py-0.5 rounded-md"
                              >
                                {hl}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BLOCO DE PREÇO E BOTÃO COMPRAR */}
                    <div className="lg:col-span-4 lg:border-l lg:border-slate-100 lg:pl-6 flex flex-col justify-between h-full pt-4 lg:pt-0 border-t border-slate-100 lg:border-t-0">
                      <div>
                        {flight.originalPrice && (
                          <p className="text-xs text-slate-400 line-through">
                            R$ {flight.originalPrice}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 font-medium">
                          Preço por passageiro
                        </p>
                        <p className="text-2xl font-extrabold text-primary">
                          R$ {flight.price}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Total para {totalTravelers} {totalTravelers === 1 ? "pessoa" : "pessoas"}:{" "}
                          <strong>R$ {totalPrice}</strong>
                        </p>
                        <p className="text-xs font-bold text-emerald-600 mt-1">
                          Em até {flight.maxInstallments}x de R$ {installmentValue} sem juros
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectFlight(flight)}
                        className="mt-4 w-full py-3 bg-secondary hover:bg-secondary/90 text-primary font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-secondary/20 transition transform hover:scale-102 cursor-pointer"
                      >
                        Comprar Voo
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </main>
        </div>
      </Container>
    </div>
  );
}

export default function PassagensPage() {
  return (
    <Suspense
      fallback={
        <LoadingScreen
          title="Pesquisando Tarifas Aéreas..."
          subtitle="Conectando com companhias aéreas nacionais e internacionais com taxas inclusas"
          type="flight"
          fullScreen={true}
        />
      }
    >
      <PassagensContent />
    </Suspense>
  );
}
