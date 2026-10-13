"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hotel, Plane, Luggage, Search } from "lucide-react";
import { CitySelector } from "./city-selector";
import { DateRangeInput } from "./date-range-input";
import { GuestsPopover } from "./guests-popover";
import { useSearchStore } from "@/stores/search-store";

export function SearchEngine() {
  const router = useRouter();
  const { activeTab, setActiveTab } = useSearchStore();

  // Estados locais da busca de hotéis
  const [hotelDestination, setHotelDestination] = useState("Rio de Janeiro");
  const [hotelCheckIn, setHotelCheckIn] = useState("2026-11-20");
  const [hotelCheckOut, setHotelCheckOut] = useState("2026-11-23");
  const [hotelAdults, setHotelAdults] = useState(2);
  const [hotelChildren, setHotelChildren] = useState(0);
  const [hotelRooms, setHotelRooms] = useState(1);

  // Estados locais da busca de voos
  const [flightOrigin, setFlightOrigin] = useState("Belo Horizonte (CNF)");
  const [flightDestination, setFlightDestination] = useState("Miami (MIA)");
  const [flightDeparture, setFlightDeparture] = useState("2026-11-20");
  const [flightReturn, setFlightReturn] = useState("2026-11-27");
  const [flightAdults, setFlightAdults] = useState(2);
  const [flightChildren, setFlightChildren] = useState(0);
  const [isRoundTrip, setIsRoundTrip] = useState(true);

  // Estados locais da busca de pacotes
  const [packageOrigin, setPackageOrigin] = useState("Belo Horizonte (CNF)");
  const [packageDestination, setPackageDestination] = useState("Búzios");
  const [packageDeparture, setPackageDeparture] = useState("2026-11-20");
  const [packageReturn, setPackageReturn] = useState("2026-11-25");
  const [packageAdults, setPackageAdults] = useState(2);
  const [packageChildren, setPackageChildren] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchHotels = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    const params = new URLSearchParams({
      city: hotelDestination,
      checkIn: hotelCheckIn,
      checkOut: hotelCheckOut,
      adults: hotelAdults.toString(),
      children: hotelChildren.toString(),
      rooms: hotelRooms.toString(),
    });
    router.push(`/hospedagens?${params.toString()}`);
  };

  const handleSearchFlights = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    const params = new URLSearchParams({
      from: flightOrigin,
      to: flightDestination,
      departureDate: flightDeparture,
      returnDate: isRoundTrip ? flightReturn : "",
      roundTrip: isRoundTrip.toString(),
      adults: flightAdults.toString(),
      children: flightChildren.toString(),
    });
    router.push(`/passagens?${params.toString()}`);
  };

  const handleSearchPackages = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    const params = new URLSearchParams({
      from: packageOrigin,
      to: packageDestination,
      departureDate: packageDeparture,
      returnDate: packageReturn,
      adults: packageAdults.toString(),
      children: packageChildren.toString(),
    });
    router.push(`/pacotes?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto -mt-16 md:-mt-20 relative z-40 px-4 overflow-visible" style={{ overflow: "visible" }}>
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 relative overflow-visible" style={{ overflow: "visible" }}>
        {/* Abas Superiores de Pesquisa */}
        <div className="flex border-b border-slate-100 overflow-x-auto bg-slate-50/70 p-2 gap-2 scrollbar-none rounded-t-3xl">
          <button
            type="button"
            onClick={() => setActiveTab("hospedagens")}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-semibold text-sm transition whitespace-nowrap cursor-pointer ${
              activeTab === "hospedagens"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-slate-600 hover:text-primary hover:bg-white"
            }`}
          >
            <Hotel className="size-4" />
            Hospedagens
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("passagens")}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-semibold text-sm transition whitespace-nowrap cursor-pointer ${
              activeTab === "passagens"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-slate-600 hover:text-primary hover:bg-white"
            }`}
          >
            <Plane className="size-4" />
            Passagens Aéreas
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pacotes")}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-semibold text-sm transition whitespace-nowrap cursor-pointer ${
              activeTab === "pacotes"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-slate-600 hover:text-primary hover:bg-white"
            }`}
          >
            <Luggage className="size-4" />
            Pacotes (Voo + Hotel)
            <span className="hidden sm:inline-block bg-secondary text-primary text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full">
              Economize
            </span>
          </button>
        </div>

        {/* Conteúdo do Formulário por Aba */}
        <div className="p-5 md:p-6 overflow-visible">
          {/* 1. ABA HOSPEDAGENS */}
          {activeTab === "hospedagens" && (
            <form onSubmit={handleSearchHotels} className="space-y-4 overflow-visible">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center overflow-visible">
                <div className="md:col-span-4">
                  <CitySelector
                    label="Destino ou Hotel"
                    placeholder="Para onde você quer ir?"
                    value={hotelDestination}
                    onChange={setHotelDestination}
                  />
                </div>

                <div className="md:col-span-5">
                  <DateRangeInput
                    startDate={hotelCheckIn}
                    endDate={hotelCheckOut}
                    startLabel="Check-in"
                    endLabel="Check-out"
                    onStartChange={setHotelCheckIn}
                    onEndChange={setHotelCheckOut}
                  />
                </div>

                <div className="md:col-span-3 overflow-visible relative z-30" style={{ overflow: "visible" }}>
                  <GuestsPopover
                    adults={hotelAdults}
                    childrenCount={hotelChildren}
                    rooms={hotelRooms}
                    showRooms={true}
                    onChange={({ adults, children, rooms }) => {
                      setHotelAdults(adults);
                      setHotelChildren(children);
                      setHotelRooms(rooms);
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    ✓ Cancelamento grátis em hotéis selecionados
                  </span>
                  <span className="hidden md:inline text-slate-300">•</span>
                  <span className="hidden md:inline">
                    Pague em até 12x sem juros
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full sm:w-auto h-12 px-8 bg-secondary hover:bg-secondary/90 disabled:opacity-75 text-primary font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-secondary/30 transition transform hover:-translate-y-0.5 cursor-pointer text-base disabled:pointer-events-none"
                >
                  {isSearching ? (
                    <>
                      <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Buscando Hospedagens...</span>
                    </>
                  ) : (
                    <>
                      <Search className="size-5" />
                      <span>Buscar Hospedagens</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* 2. ABA PASSAGENS AÉREAS */}
          {activeTab === "passagens" && (
            <form onSubmit={handleSearchFlights} className="space-y-4 overflow-visible">
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="flightType"
                    checked={isRoundTrip}
                    onChange={() => setIsRoundTrip(true)}
                    className="accent-primary"
                  />
                  Ida e Volta
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="flightType"
                    checked={!isRoundTrip}
                    onChange={() => setIsRoundTrip(false)}
                    className="accent-primary"
                  />
                  Somente Ida
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center overflow-visible">
                <div className="lg:col-span-3">
                  <CitySelector
                    label="Origem"
                    placeholder="De onde você parte?"
                    value={flightOrigin}
                    onChange={setFlightOrigin}
                    airportsOnly
                  />
                </div>

                <div className="lg:col-span-3">
                  <CitySelector
                    label="Destino"
                    placeholder="Para onde quer voar?"
                    value={flightDestination}
                    onChange={setFlightDestination}
                    airportsOnly
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-4">
                  <DateRangeInput
                    startDate={flightDeparture}
                    endDate={flightReturn}
                    startLabel="Ida"
                    endLabel="Volta"
                    singleDate={!isRoundTrip}
                    onStartChange={setFlightDeparture}
                    onEndChange={setFlightReturn}
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-2 overflow-visible relative z-30" style={{ overflow: "visible" }}>
                  <GuestsPopover
                    adults={flightAdults}
                    childrenCount={flightChildren}
                    showRooms={false}
                    onChange={({ adults, children }) => {
                      setFlightAdults(adults);
                      setFlightChildren(children);
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                <div className="text-xs text-slate-500 font-medium">
                  Companhias parceiras: LATAM, Gol, Azul, TAP, Air France, American Airlines.
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full sm:w-auto h-12 px-8 bg-secondary hover:bg-secondary/90 disabled:opacity-75 text-primary font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-secondary/30 transition transform hover:-translate-y-0.5 cursor-pointer text-base disabled:pointer-events-none"
                >
                  {isSearching ? (
                    <>
                      <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Buscando Voos...</span>
                    </>
                  ) : (
                    <>
                      <Search className="size-5" />
                      <span>Buscar Voos</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* 3. ABA PACOTES */}
          {activeTab === "pacotes" && (
            <form onSubmit={handleSearchPackages} className="space-y-4 overflow-visible">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center overflow-visible">
                <div className="lg:col-span-3">
                  <CitySelector
                    label="Origem do Voo"
                    placeholder="Sua cidade"
                    value={packageOrigin}
                    onChange={setPackageOrigin}
                    airportsOnly
                  />
                </div>

                <div className="lg:col-span-3">
                  <CitySelector
                    label="Destino do Pacote"
                    placeholder="Cidade de destino"
                    value={packageDestination}
                    onChange={setPackageDestination}
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-4">
                  <DateRangeInput
                    startDate={packageDeparture}
                    endDate={packageReturn}
                    startLabel="Ida"
                    endLabel="Volta"
                    onStartChange={setPackageDeparture}
                    onEndChange={setPackageReturn}
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-2 overflow-visible relative z-30" style={{ overflow: "visible" }}>
                  <GuestsPopover
                    adults={packageAdults}
                    childrenCount={packageChildren}
                    showRooms={true}
                    onChange={({ adults, children }) => {
                      setPackageAdults(adults);
                      setPackageChildren(children);
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                  🔥 Economize até 30% reservando voo + hotel juntos no mesmo pacote.
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full sm:w-auto h-12 px-8 bg-secondary hover:bg-secondary/90 disabled:opacity-75 text-primary font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-secondary/30 transition transform hover:-translate-y-0.5 cursor-pointer text-base disabled:pointer-events-none"
                >
                  {isSearching ? (
                    <>
                      <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Buscando Pacotes...</span>
                    </>
                  ) : (
                    <>
                      <Search className="size-5" />
                      <span>Buscar Pacotes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
