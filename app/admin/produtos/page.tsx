"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Hotel, Plane, Save, RotateCcw, Check } from "lucide-react";
import { useProductStore } from "@/stores/product-store";

export default function AdminProdutosPage() {
  const {
    hotels,
    flights,
    fetchCatalog,
    updateHotelPrice,
    updateFlightPrice,
    resetCatalog,
  } = useProductStore();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"hospedagens" | "passagens">("hospedagens");
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (hotels.length === 0 || flights.length === 0) {
      fetchCatalog();
    }
  }, [hotels.length, flights.length, fetchCatalog]);

  // Estados locais para edição rápida de preços de hotéis
  const [hotelPrices, setHotelPrices] = useState<
    Record<string, { basePrice: number; originalPrice?: number }>
  >({});

  // Estados locais para voos
  const [flightPrices, setFlightPrices] = useState<
    Record<string, { price: number; originalPrice?: number }>
  >({});

  const handleSaveHotelPrice = (hotelId: string) => {
    const data = hotelPrices[hotelId];
    if (!data) return;
    updateHotelPrice(hotelId, data.basePrice, data.originalPrice);
    setSavedId(hotelId);
    setTimeout(() => setSavedId(null), 2500);
  };

  const handleSaveFlightPrice = (flightId: string) => {
    const data = flightPrices[flightId];
    if (!data) return;
    updateFlightPrice(flightId, data.price, data.originalPrice);
    setSavedId(flightId);
    setTimeout(() => setSavedId(null), 2500);
  };

  if (!mounted) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        Carregando produtos...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Gestão de Preços & Catálogo
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ajuste os valores de diárias e tarifas aéreas com reflexo instantâneo no site
          </p>
        </div>

        <button
          type="button"
          onClick={resetCatalog}
          className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          Restaurar Preços Originais
        </button>
      </div>

      {/* ABAS: HOSPEDAGENS / VOOS */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("hospedagens")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            activeTab === "hospedagens"
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Hotel className="size-4" />
          Preços de Hospedagens ({hotels.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("passagens")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            activeTab === "passagens"
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Plane className="size-4" />
          Preços de Voos ({flights.length})
        </button>
      </div>

      {/* TABELA DE HOSPEDAGENS */}
      {activeTab === "hospedagens" && (
        <div className="space-y-4">
          {hotels.map((hotel) => {
            const currentBase =
              hotelPrices[hotel.id]?.basePrice ?? hotel.basePricePerNight;
            const currentOriginal =
              hotelPrices[hotel.id]?.originalPrice ?? hotel.originalPricePerNight ?? 0;

            const isSaved = savedId === hotel.id;

            return (
              <div
                key={hotel.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="flex items-center gap-4">
                  <div className="relative size-20 rounded-2xl overflow-hidden shrink-0 shadow-xs">
                    <Image
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-md">
                      {hotel.city} - {hotel.state}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {hotel.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {hotel.stars} estrelas • Nota {hotel.rating} • {hotel.rooms.length} tipos de quarto
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Preço &quot;De&quot; (Riscado)
                    </label>
                    <div className="relative">
                      <span className="text-xs text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 font-semibold">
                        R$
                      </span>
                      <input
                        type="number"
                        value={currentOriginal}
                        onChange={(e) =>
                          setHotelPrices({
                            ...hotelPrices,
                            [hotel.id]: {
                              basePrice: currentBase,
                              originalPrice: Number(e.target.value),
                            },
                          })
                        }
                        className="w-28 h-10 pl-8 pr-2 text-xs font-semibold rounded-xl border border-slate-300 outline-hidden focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                      Preço &quot;Por&quot; (Diária) *
                    </label>
                    <div className="relative">
                      <span className="text-xs text-primary font-bold absolute left-3 top-1/2 -translate-y-1/2">
                        R$
                      </span>
                      <input
                        type="number"
                        value={currentBase}
                        onChange={(e) =>
                          setHotelPrices({
                            ...hotelPrices,
                            [hotel.id]: {
                              basePrice: Number(e.target.value),
                              originalPrice: currentOriginal,
                            },
                          })
                        }
                        className="w-32 h-10 pl-8 pr-2 text-sm font-bold text-primary rounded-xl border border-primary/50 outline-hidden focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveHotelPrice(hotel.id)}
                    className={`h-10 px-5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition self-end cursor-pointer shadow-xs ${
                      isSaved
                        ? "bg-emerald-600 text-white"
                        : "bg-secondary hover:bg-secondary/90 text-primary"
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <Check className="size-4" />
                        Salvo!
                      </>
                    ) : (
                      <>
                        <Save className="size-4" />
                        Salvar Preço
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABELA DE PASSAGENS AÉREAS */}
      {activeTab === "passagens" && (
        <div className="space-y-4">
          {flights.map((flight) => {
            const currentPrice =
              flightPrices[flight.id]?.price ?? flight.price;
            const currentOriginal =
              flightPrices[flight.id]?.originalPrice ?? flight.originalPrice ?? 0;

            const isSaved = savedId === flight.id;

            return (
              <div
                key={flight.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Plane className="size-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-md">
                      {flight.outbound.airline} • {flight.outbound.flightNumber}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {flight.outbound.originCity} ({flight.outbound.originIata}) → {flight.outbound.destinationCity} ({flight.outbound.destinationIata})
                    </h3>
                    <p className="text-xs text-slate-500">
                      {flight.isRoundTrip ? "Ida e Volta" : "Somente Ida"} • Duração: {flight.outbound.duration}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Preço &quot;De&quot; (Riscado)
                    </label>
                    <div className="relative">
                      <span className="text-xs text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 font-semibold">
                        R$
                      </span>
                      <input
                        type="number"
                        value={currentOriginal}
                        onChange={(e) =>
                          setFlightPrices({
                            ...flightPrices,
                            [flight.id]: {
                              price: currentPrice,
                              originalPrice: Number(e.target.value),
                            },
                          })
                        }
                        className="w-28 h-10 pl-8 pr-2 text-xs font-semibold rounded-xl border border-slate-300 outline-hidden focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                      Preço do Voo *
                    </label>
                    <div className="relative">
                      <span className="text-xs text-primary font-bold absolute left-3 top-1/2 -translate-y-1/2">
                        R$
                      </span>
                      <input
                        type="number"
                        value={currentPrice}
                        onChange={(e) =>
                          setFlightPrices({
                            ...flightPrices,
                            [flight.id]: {
                              price: Number(e.target.value),
                              originalPrice: currentOriginal,
                            },
                          })
                        }
                        className="w-32 h-10 pl-8 pr-2 text-sm font-bold text-primary rounded-xl border border-primary/50 outline-hidden focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveFlightPrice(flight.id)}
                    className={`h-10 px-5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition self-end cursor-pointer shadow-xs ${
                      isSaved
                        ? "bg-emerald-600 text-white"
                        : "bg-secondary hover:bg-secondary/90 text-primary"
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <Check className="size-4" />
                        Salvo!
                      </>
                    ) : (
                      <>
                        <Save className="size-4" />
                        Salvar Preço
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
