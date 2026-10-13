"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Plane,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  X,
  Check,
  ArrowRight,
  Luggage,
  Clock,
  Loader2,
  MapPin,
  ArrowLeftRight,
  Coins,
} from "lucide-react";
import { toast } from "react-toastify";
import { useProductStore } from "@/stores/product-store";
import { Flight } from "@/types/product";
import { ImageUploader } from "@/components/admin/image-uploader";
import { useConfirm } from "@/components/shared/confirm-dialog-provider";

const DEFAULT_FLIGHT_IMG =
  "https://images.pexels.com/photos/3834331/pexels-photo-3834331.jpeg";

const COMMON_FLAGS = [
  { flag: "🇺🇸", country: "Estados Unidos", region: "usa" as const },
  { flag: "🇮🇹", country: "Itália", region: "europe" as const },
  { flag: "🇪🇸", country: "Espanha", region: "europe" as const },
  { flag: "🇵🇹", country: "Portugal", region: "europe" as const },
  { flag: "🇫🇷", country: "França", region: "europe" as const },
  { flag: "🇦🇷", country: "Argentina", region: "south-america" as const },
  { flag: "🇨🇱", country: "Chile", region: "south-america" as const },
  { flag: "🇦🇪", country: "Emirados Árabes", region: "other" as const },
  { flag: "🇬🇧", country: "Reino Unido", region: "europe" as const },
  { flag: "🇯🇵", country: "Japão", region: "other" as const },
];

const SUGGESTED_HIGHLIGHTS = [
  "Voo Noturno",
  "Voo Direto",
  "Bagagem Despachada",
  "Wi-Fi a Bordo",
  "Refeição Inclusa",
  "Poltrona Conforto",
  "Entretenimento a Bordo",
  "Tomada USB",
  "Tarifa Promocional",
  "Melhor Custo-Benefício",
];

const POPULAR_AIRLINES = [
  { name: "LATAM Airlines", code: "LA" },
  { name: "Azul Linhas Aéreas", code: "AD" },
  { name: "Gol Linhas Aéreas", code: "G3" },
  { name: "TAP Air Portugal", code: "TP" },
  { name: "American Airlines", code: "AA" },
  { name: "Air France", code: "AF" },
  { name: "United Airlines", code: "UA" },
  { name: "Iberia", code: "IB" },
  { name: "Copa Airlines", code: "CM" },
  { name: "Emirates", code: "EK" },
];

export default function AdminPassagensPage() {
  const { confirm } = useConfirm();
  const { flights, fetchFlights, addFlight, updateFlight, deleteFlight, resetCatalog } =
    useProductStore();

  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"outbound" | "return" | "details" | "pricing">("outbound");

  // --- TRECHO DE IDA (OUTBOUND) ---
  const [formOriginCity, setFormOriginCity] = useState("São Paulo");
  const [formOriginIata, setFormOriginIata] = useState("GRU");
  const [formOriginAirport, setFormOriginAirport] = useState("Aeroporto Internacional de Guarulhos");
  const [formDestCity, setFormDestCity] = useState("Miami");
  const [formDestIata, setFormDestIata] = useState("MIA");
  const [formDestAirport, setFormDestAirport] = useState("Miami International Airport");
  const [formAirline, setFormAirline] = useState("LATAM Airlines");
  const [formAirlineCode, setFormAirlineCode] = useState("LA");
  const [formFlightNumber, setFormFlightNumber] = useState("LA-8012");
  const [formDepartureDate, setFormDepartureDate] = useState("2026-11-20");
  const [formDepartureTime, setFormDepartureTime] = useState("08:30");
  const [formArrivalDate, setFormArrivalDate] = useState("2026-11-20");
  const [formArrivalTime, setFormArrivalTime] = useState("16:45");
  const [formDuration, setFormDuration] = useState("8h 15m");
  const [formStops, setFormStops] = useState(0);
  const [formStopCity, setFormStopCity] = useState("");

  // --- TRECHO DE VOLTA (RETURN) ---
  const [formIsRoundTrip, setFormIsRoundTrip] = useState(true);
  const [formReturnOriginCity, setFormReturnOriginCity] = useState("Miami");
  const [formReturnOriginIata, setFormReturnOriginIata] = useState("MIA");
  const [formReturnOriginAirport, setFormReturnOriginAirport] = useState("Miami International Airport");
  const [formReturnDestCity, setFormReturnDestCity] = useState("São Paulo");
  const [formReturnDestIata, setFormReturnDestIata] = useState("GRU");
  const [formReturnDestAirport, setFormReturnDestAirport] = useState("Aeroporto Internacional de Guarulhos");
  const [formReturnAirline, setFormReturnAirline] = useState("LATAM Airlines");
  const [formReturnAirlineCode, setFormReturnAirlineCode] = useState("LA");
  const [formReturnFlightNumber, setFormReturnFlightNumber] = useState("LA-8013");
  const [formReturnDepartureDate, setFormReturnDepartureDate] = useState("2026-11-27");
  const [formReturnDepartureTime, setFormReturnDepartureTime] = useState("20:15");
  const [formReturnArrivalDate, setFormReturnArrivalDate] = useState("2026-11-28");
  const [formReturnArrivalTime, setFormReturnArrivalTime] = useState("06:30");
  const [formReturnDuration, setFormReturnDuration] = useState("8h 15m");
  const [formReturnStops, setFormReturnStops] = useState(0);
  const [formReturnStopCity, setFormReturnStopCity] = useState("");

  // --- CABINE, BAGAGEM & DETALHES ---
  const [formCabinClass, setFormCabinClass] = useState<"Econômica" | "Premium Economy" | "Executiva">("Econômica");
  const [formBaggageIncluded, setFormBaggageIncluded] = useState(true);
  const [formHandBaggageIncluded, setFormHandBaggageIncluded] = useState(true);
  const [formCountry, setFormCountry] = useState("Estados Unidos");
  const [formFlag, setFormFlag] = useState("🇺🇸");
  const [formRegion, setFormRegion] = useState<"all" | "usa" | "europe" | "south-america" | "other">("usa");
  const [formHighlights, setFormHighlights] = useState<string[]>([
    "Voo Direto",
    "Bagagem Despachada",
  ]);
  const [customHighlight, setCustomHighlight] = useState("");

  // --- TARIFAS & FOTO ---
  const [formPrice, setFormPrice] = useState(3290);
  const [formOriginalPrice, setFormOriginalPrice] = useState(3990);
  const [formMaxInstallments, setFormMaxInstallments] = useState(12);
  const [formFeatured, setFormFeatured] = useState(true);
  const [formImageUrl, setFormImageUrl] = useState(DEFAULT_FLIGHT_IMG);

  useEffect(() => {
    setMounted(true);
    if (flights.length === 0) {
      fetchFlights();
    }
  }, [flights.length, fetchFlights]);

  const discountCalculated = useMemo(() => {
    if (formOriginalPrice > formPrice && formOriginalPrice > 0) {
      return Math.round(((formOriginalPrice - formPrice) / formOriginalPrice) * 100);
    }
    return 0;
  }, [formOriginalPrice, formPrice]);

  const installmentValue = useMemo(() => {
    const installments = Math.max(1, formMaxInstallments || 12);
    return (formPrice / installments).toFixed(2);
  }, [formPrice, formMaxInstallments]);

  if (!mounted) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        Carregando passagens...
      </div>
    );
  }

  const handleOpenNew = () => {
    setEditingId(null);
    setActiveTab("outbound");
    setFormOriginCity("São Paulo");
    setFormOriginIata("GRU");
    setFormOriginAirport("Aeroporto Internacional de Guarulhos");
    setFormDestCity("Miami");
    setFormDestIata("MIA");
    setFormDestAirport("Miami International Airport");
    setFormAirline("LATAM Airlines");
    setFormAirlineCode("LA");
    setFormFlightNumber("LA-8012");
    setFormDepartureDate("2026-11-20");
    setFormDepartureTime("08:30");
    setFormArrivalDate("2026-11-20");
    setFormArrivalTime("16:45");
    setFormDuration("8h 15m");
    setFormStops(0);
    setFormStopCity("");

    setFormIsRoundTrip(true);
    setFormReturnOriginCity("Miami");
    setFormReturnOriginIata("MIA");
    setFormReturnOriginAirport("Miami International Airport");
    setFormReturnDestCity("São Paulo");
    setFormReturnDestIata("GRU");
    setFormReturnDestAirport("Aeroporto Internacional de Guarulhos");
    setFormReturnAirline("LATAM Airlines");
    setFormReturnAirlineCode("LA");
    setFormReturnFlightNumber("LA-8013");
    setFormReturnDepartureDate("2026-11-27");
    setFormReturnDepartureTime("20:15");
    setFormReturnArrivalDate("2026-11-28");
    setFormReturnArrivalTime("06:30");
    setFormReturnDuration("8h 15m");
    setFormReturnStops(0);
    setFormReturnStopCity("");

    setFormCabinClass("Econômica");
    setFormBaggageIncluded(true);
    setFormHandBaggageIncluded(true);
    setFormCountry("Estados Unidos");
    setFormFlag("🇺🇸");
    setFormRegion("usa");
    setFormHighlights(["Voo Direto", "Bagagem Despachada"]);
    setCustomHighlight("");

    setFormPrice(3290);
    setFormOriginalPrice(3990);
    setFormMaxInstallments(12);
    setFormFeatured(true);
    setFormImageUrl(DEFAULT_FLIGHT_IMG);
    setModalOpen(true);
  };

  const handleOpenEdit = (flight: Flight) => {
    setEditingId(flight.id);
    setActiveTab("outbound");

    // Outbound
    setFormOriginCity(flight.outbound.originCity);
    setFormOriginIata(flight.outbound.originIata);
    setFormOriginAirport(flight.outbound.originAirport || `Aeroporto de ${flight.outbound.originCity}`);
    setFormDestCity(flight.outbound.destinationCity);
    setFormDestIata(flight.outbound.destinationIata);
    setFormDestAirport(flight.outbound.destinationAirport || `Aeroporto de ${flight.outbound.destinationCity}`);
    setFormAirline(flight.outbound.airline);
    setFormAirlineCode(flight.outbound.airlineCode || "ZP");
    setFormFlightNumber(flight.outbound.flightNumber);
    setFormDepartureDate(flight.outbound.departureDate || "2026-11-20");
    setFormDepartureTime(flight.outbound.departureTime || "10:00");
    setFormArrivalDate(flight.outbound.arrivalDate || "2026-11-20");
    setFormArrivalTime(flight.outbound.arrivalTime || "18:00");
    setFormDuration(flight.outbound.duration || "8h 00m");
    setFormStops(flight.outbound.stops || 0);
    setFormStopCity(flight.outbound.stopCity || "");

    // Return
    if (flight.returnFlight) {
      setFormIsRoundTrip(true);
      setFormReturnOriginCity(flight.returnFlight.originCity);
      setFormReturnOriginIata(flight.returnFlight.originIata);
      setFormReturnOriginAirport(flight.returnFlight.originAirport || `Aeroporto de ${flight.returnFlight.originCity}`);
      setFormReturnDestCity(flight.returnFlight.destinationCity);
      setFormReturnDestIata(flight.returnFlight.destinationIata);
      setFormReturnDestAirport(flight.returnFlight.destinationAirport || `Aeroporto de ${flight.returnFlight.destinationCity}`);
      setFormReturnAirline(flight.returnFlight.airline);
      setFormReturnAirlineCode(flight.returnFlight.airlineCode || "ZP");
      setFormReturnFlightNumber(flight.returnFlight.flightNumber);
      setFormReturnDepartureDate(flight.returnFlight.departureDate || "2026-11-27");
      setFormReturnDepartureTime(flight.returnFlight.departureTime || "20:00");
      setFormReturnArrivalDate(flight.returnFlight.arrivalDate || "2026-11-28");
      setFormReturnArrivalTime(flight.returnFlight.arrivalTime || "06:00");
      setFormReturnDuration(flight.returnFlight.duration || "8h 00m");
      setFormReturnStops(flight.returnFlight.stops || 0);
      setFormReturnStopCity(flight.returnFlight.stopCity || "");
    } else {
      setFormIsRoundTrip(false);
      setFormReturnOriginCity(flight.outbound.destinationCity);
      setFormReturnOriginIata(flight.outbound.destinationIata);
      setFormReturnOriginAirport(`Aeroporto de ${flight.outbound.destinationCity}`);
      setFormReturnDestCity(flight.outbound.originCity);
      setFormReturnDestIata(flight.outbound.originIata);
      setFormReturnDestAirport(`Aeroporto de ${flight.outbound.originCity}`);
      setFormReturnAirline(flight.outbound.airline);
      setFormReturnAirlineCode(flight.outbound.airlineCode || "ZP");
      setFormReturnFlightNumber("ZP-102");
      setFormReturnDepartureDate("2026-11-27");
      setFormReturnDepartureTime("20:00");
      setFormReturnArrivalDate("2026-11-28");
      setFormReturnArrivalTime("06:00");
      setFormReturnDuration(flight.outbound.duration || "8h 00m");
      setFormReturnStops(0);
      setFormReturnStopCity("");
    }

    // Cabine, Bagagens e Detalhes
    setFormCabinClass(flight.outbound.cabinClass || "Econômica");
    setFormBaggageIncluded(flight.outbound.baggageIncluded ?? true);
    setFormHandBaggageIncluded(flight.outbound.handBaggageIncluded ?? true);
    setFormCountry(flight.country || "Internacional");
    setFormFlag(flight.flag || "✈️");
    setFormRegion(flight.region || "all");
    setFormHighlights(flight.highlights || ["Voo Direto", "Bagagem Despachada"]);
    setCustomHighlight("");

    // Tarifas
    setFormPrice(flight.price);
    setFormOriginalPrice(flight.originalPrice || 0);
    setFormMaxInstallments(flight.maxInstallments || 12);
    setFormFeatured(flight.featured ?? true);
    setFormImageUrl(flight.imageUrl || DEFAULT_FLIGHT_IMG);

    setModalOpen(true);
  };

  const handleInvertReturnFromOutbound = () => {
    setFormReturnOriginCity(formDestCity);
    setFormReturnOriginIata(formDestIata);
    setFormReturnOriginAirport(formDestAirport || `Aeroporto de ${formDestCity}`);
    setFormReturnDestCity(formOriginCity);
    setFormReturnDestIata(formOriginIata);
    setFormReturnDestAirport(formOriginAirport || `Aeroporto de ${formOriginCity}`);
    setFormReturnAirline(formAirline);
    setFormReturnAirlineCode(formAirlineCode);
    toast.info("Rota de volta invertida com sucesso!");
  };

  const toggleHighlight = (item: string) => {
    setFormHighlights((prev) =>
      prev.includes(item) ? prev.filter((h) => h !== item) : [...prev, item]
    );
  };

  const handleAddCustomHighlight = () => {
    const trimmed = customHighlight.trim();
    if (!trimmed) return;
    if (!formHighlights.includes(trimmed)) {
      setFormHighlights((prev) => [...prev, trimmed]);
    }
    setCustomHighlight("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDestCity.trim() || !formOriginCity.trim()) {
      toast.warning("Informe a cidade de origem e a cidade de destino.");
      setActiveTab("outbound");
      return;
    }

    if (formIsRoundTrip && (!formReturnOriginCity.trim() || !formReturnDestCity.trim())) {
      toast.warning("Informe as cidades do trecho de volta.");
      setActiveTab("return");
      return;
    }

    const flightData: Flight = {
      id: editingId || `flight-${Date.now()}`,
      price: Number(formPrice),
      originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
      discountPercent: discountCalculated,
      maxInstallments: Number(formMaxInstallments) || 12,
      isRoundTrip: formIsRoundTrip,
      featured: formFeatured,
      country: formCountry,
      flag: formFlag,
      region: formRegion,
      imageUrl: formImageUrl,
      highlights: formHighlights.filter(Boolean),
      outbound: {
        flightNumber: formFlightNumber,
        airline: formAirline,
        airlineCode: formAirlineCode,
        originIata: formOriginIata.toUpperCase(),
        originCity: formOriginCity,
        originAirport: formOriginAirport || `Aeroporto de ${formOriginCity}`,
        destinationIata: formDestIata.toUpperCase(),
        destinationCity: formDestCity,
        destinationAirport: formDestAirport || `Aeroporto de ${formDestCity}`,
        departureDate: formDepartureDate,
        departureTime: formDepartureTime,
        arrivalDate: formArrivalDate,
        arrivalTime: formArrivalTime,
        duration: formDuration,
        stops: Number(formStops),
        stopCity: Number(formStops) > 0 ? formStopCity : undefined,
        cabinClass: formCabinClass,
        baggageIncluded: formBaggageIncluded,
        handBaggageIncluded: formHandBaggageIncluded,
      },
      returnFlight: formIsRoundTrip
        ? {
            flightNumber: formReturnFlightNumber || `${formReturnAirlineCode}-102`,
            airline: formReturnAirline || formAirline,
            airlineCode: formReturnAirlineCode || formAirlineCode,
            originIata: (formReturnOriginIata || formDestIata).toUpperCase(),
            originCity: formReturnOriginCity || formDestCity,
            originAirport: formReturnOriginAirport || `Aeroporto de ${formReturnOriginCity || formDestCity}`,
            destinationIata: (formReturnDestIata || formOriginIata).toUpperCase(),
            destinationCity: formReturnDestCity || formOriginCity,
            destinationAirport: formReturnDestAirport || `Aeroporto de ${formReturnDestCity || formOriginCity}`,
            departureDate: formReturnDepartureDate,
            departureTime: formReturnDepartureTime,
            arrivalDate: formReturnArrivalDate,
            arrivalTime: formReturnArrivalTime,
            duration: formReturnDuration || formDuration,
            stops: Number(formReturnStops),
            stopCity: Number(formReturnStops) > 0 ? formReturnStopCity : undefined,
            cabinClass: formCabinClass,
            baggageIncluded: formBaggageIncluded,
            handBaggageIncluded: formHandBaggageIncluded,
          }
        : undefined,
    };

    setIsSaving(true);
    try {
      if (editingId) {
        await updateFlight(editingId, flightData);
        toast.success("Voo atualizado com sucesso!");
      } else {
        await addFlight(flightData);
        toast.success("Novo voo cadastrado com sucesso!");
      }
      setModalOpen(false);
    } catch {
      toast.error("Erro ao salvar o voo. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DA PÁGINA ADMIN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-primary text-[11px] font-black uppercase tracking-wider mb-2">
            <Plane className="size-3 text-secondary fill-secondary" />
            Catálogo & Ofertas
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Passagens Aéreas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre rotas completas de ida e volta, configure companhias, franquias de bagagem, horários e tarifas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={async () => {
              const confirmed = await confirm({
                title: "Restaurar Passagens Padrão",
                description: "Deseja restaurar a lista original de passagens aéreas da Zarpou?",
                confirmText: "Restaurar",
                cancelText: "Cancelar",
                variant: "warning",
                icon: "warning",
              });
              if (confirmed) {
                resetCatalog();
                toast.info("Catálogo de passagens aéreas restaurado com sucesso!");
              }
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="size-3.5" />
            Restaurar Padrões
          </button>

          <button
            type="button"
            onClick={handleOpenNew}
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Plus className="size-4" />
            Adicionar Novo Voo
          </button>
        </div>
      </div>

      {/* LISTA DE CARDS DE VOOS CADASTRADOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {flights.map((flight) => {
          const installment = (flight.price / (flight.maxInstallments || 12)).toFixed(2);
          const img = flight.imageUrl || DEFAULT_FLIGHT_IMG;

          return (
            <div
              key={flight.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col sm:flex-row items-stretch"
            >
              {/* FOTO DO DESTINO */}
              <div className="relative w-full sm:w-52 h-48 sm:h-auto shrink-0 bg-slate-100 self-stretch">
                <Image
                  src={img}
                  alt={flight.outbound.destinationCity}
                  fill
                  unoptimized={img.startsWith("data:")}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                <div className="absolute top-2.5 left-2.5 bg-white/95 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <span>{flight.flag || "✈️"}</span>
                  <span>{flight.country || "Exterior"}</span>
                </div>

                {flight.discountPercent && flight.discountPercent > 0 && (
                  <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                    {flight.discountPercent}% OFF
                  </div>
                )}

                <div className="absolute bottom-2.5 left-2.5 text-white">
                  <span className="text-[9px] uppercase font-bold text-secondary">
                    {flight.isRoundTrip ? "Ida & Volta" : "Somente Ida"}
                  </span>
                  <h3 className="text-base font-black leading-tight drop-shadow-xs">
                    {flight.outbound.destinationCity}
                  </h3>
                </div>
              </div>

              {/* CONTEÚDO À DIREITA (DETALHES + AÇÕES) */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <p className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <span>{flight.outbound.originIata}</span>
                        <ArrowRight className="size-3 text-slate-400" />
                        <span className="text-primary">{flight.outbound.destinationIata}</span>
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {flight.outbound.originCity} → {flight.outbound.destinationCity}
                      </p>
                    </div>

                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      {flight.outbound.airline}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="size-3 text-slate-400" />
                      {flight.outbound.duration} • {flight.outbound.stops === 0 ? "Voo Direto" : `${flight.outbound.stops} parada`}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                      <Luggage className="size-3" />
                      {flight.outbound.baggageIncluded ? "Bagagem Inclusa" : "Mão 10kg"}
                    </span>
                  </div>

                  {flight.returnFlight && (
                    <div className="bg-slate-50 p-2 rounded-xl text-[11px] text-slate-600 flex items-center justify-between border border-slate-100">
                      <span className="font-semibold text-primary flex items-center gap-1">
                        <RotateCcw className="size-3 text-secondary" />
                        Volta: {flight.returnFlight.originIata} → {flight.returnFlight.destinationIata}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {flight.returnFlight.stops === 0 ? "Direto" : `${flight.returnFlight.stops} parada`}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      {flight.originalPrice && flight.originalPrice > flight.price && (
                        <p className="text-[10px] text-slate-400 line-through">
                          De R$ {flight.originalPrice.toLocaleString("pt-BR")}
                        </p>
                      )}
                      <p className="text-base font-black text-primary">
                        R$ {flight.price.toLocaleString("pt-BR")}
                        <span className="text-[10px] font-medium text-slate-500 ml-1">
                          (ou {flight.maxInstallments || 12}x R$ {installment})
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* AÇÕES */}
                <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(flight)}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:border-primary text-primary text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <Edit2 className="size-3.5" />
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      const confirmed = await confirm({
                        title: "Excluir Passagem Aérea",
                        description: `Tem certeza que deseja excluir o voo para "${flight.outbound.destinationCity}"? Esta ação não pode ser desfeita.`,
                        confirmText: "Excluir",
                        cancelText: "Cancelar",
                        variant: "destructive",
                        icon: "trash",
                      });
                      if (confirmed) {
                        await deleteFlight(flight.id);
                        toast.success("Voo excluído com sucesso!");
                      }
                    }}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DE CRIAÇÃO / EDIÇÃO COMPLETO EM ABAS */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-hidden">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 border border-slate-200">
            {/* TOPO DO MODAL */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70 shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-primary text-secondary flex items-center justify-center shadow-xs">
                  <Plane className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    {editingId ? "Editar Voo Cadastrado" : "Cadastrar Nova Passagem Aérea"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Configure trechos de ida e volta, companhias, regras de bagagem e valores
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="size-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* BARRA DE NAVEGAÇÃO POR ABAS */}
            <div className="flex border-b border-slate-200 bg-white px-5 pt-2 gap-2 overflow-x-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("outbound")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === "outbound"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <Plane className="size-3.5" />
                1. Trecho de Ida (Origem & Destino)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("return")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === "return"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <RotateCcw className="size-3.5" />
                2. Trecho de Volta ({formIsRoundTrip ? "Ida & Volta" : "Só Ida"})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === "details"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <Luggage className="size-3.5" />
                3. Cabine, Bagagens & Destino
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("pricing")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === "pricing"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <Coins className="size-3.5" />
                4. Tarifas & Foto
              </button>
            </div>

            {/* CORPO DO FORMULÁRIO */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* ABA 1: TRECHO DE IDA */}
              {activeTab === "outbound" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="p-3 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between text-xs">
                    <span className="font-bold text-primary flex items-center gap-1.5">
                      <Plane className="size-4 text-secondary" />
                      Trecho de Ida Principal
                    </span>
                    <span className="text-slate-500 font-medium">Campos com * são obrigatórios</span>
                  </div>

                  {/* Origem e Destino */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bloco Origem */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <p className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-primary" />
                        Cidade de Origem
                      </p>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 space-y-1">
                          <label className="text-[11px] font-semibold text-slate-600 block">
                            Cidade *
                          </label>
                          <input
                            type="text"
                            required
                            value={formOriginCity}
                            onChange={(e) => setFormOriginCity(e.target.value)}
                            placeholder="Ex: São Paulo"
                            className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white outline-hidden focus:border-primary font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-600 block">
                            IATA (3 letras) *
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={3}
                            value={formOriginIata}
                            onChange={(e) => setFormOriginIata(e.target.value.toUpperCase())}
                            placeholder="GRU"
                            className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white outline-hidden focus:border-primary font-black uppercase text-primary text-center"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600 block">
                          Nome do Aeroporto de Origem
                        </label>
                        <input
                          type="text"
                          value={formOriginAirport}
                          onChange={(e) => setFormOriginAirport(e.target.value)}
                          placeholder="Ex: Aeroporto Internacional de Guarulhos"
                          className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white outline-hidden focus:border-primary text-slate-700"
                        />
                      </div>
                    </div>

                    {/* Bloco Destino */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <p className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-secondary" />
                        Cidade de Destino
                      </p>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 space-y-1">
                          <label className="text-[11px] font-semibold text-slate-600 block">
                            Cidade *
                          </label>
                          <input
                            type="text"
                            required
                            value={formDestCity}
                            onChange={(e) => setFormDestCity(e.target.value)}
                            placeholder="Ex: Miami"
                            className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white outline-hidden focus:border-primary font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-600 block">
                            IATA (3 letras) *
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={3}
                            value={formDestIata}
                            onChange={(e) => setFormDestIata(e.target.value.toUpperCase())}
                            placeholder="MIA"
                            className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white outline-hidden focus:border-primary font-black uppercase text-secondary text-center"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600 block">
                          Nome do Aeroporto de Destino
                        </label>
                        <input
                          type="text"
                          value={formDestAirport}
                          onChange={(e) => setFormDestAirport(e.target.value)}
                          placeholder="Ex: Miami International Airport"
                          className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white outline-hidden focus:border-primary text-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Companhia Aérea, Código e Voo */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Companhia Aérea *
                      </label>
                      <input
                        type="text"
                        required
                        value={formAirline}
                        onChange={(e) => setFormAirline(e.target.value)}
                        placeholder="Ex: LATAM Airlines"
                        className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-semibold"
                      />
                      <div className="flex flex-wrap gap-1 mt-1">
                        {POPULAR_AIRLINES.slice(0, 4).map((air) => (
                          <button
                            key={air.code}
                            type="button"
                            onClick={() => {
                              setFormAirline(air.name);
                              setFormAirlineCode(air.code);
                            }}
                            className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded cursor-pointer transition"
                          >
                            {air.name.split(" ")[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Cód. IATA da Cia
                      </label>
                      <input
                        type="text"
                        maxLength={2}
                        value={formAirlineCode}
                        onChange={(e) => setFormAirlineCode(e.target.value.toUpperCase())}
                        placeholder="Ex: LA"
                        className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-bold uppercase text-center"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Número do Voo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formFlightNumber}
                        onChange={(e) => setFormFlightNumber(e.target.value)}
                        placeholder="Ex: LA-8012"
                        className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-semibold"
                      />
                    </div>
                  </div>

                  {/* Datas e Horários da Ida */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Data Partida
                      </label>
                      <input
                        type="date"
                        value={formDepartureDate}
                        onChange={(e) => setFormDepartureDate(e.target.value)}
                        className="w-full h-10 px-2.5 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Hora Partida
                      </label>
                      <input
                        type="time"
                        value={formDepartureTime}
                        onChange={(e) => setFormDepartureTime(e.target.value)}
                        className="w-full h-10 px-2.5 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-medium text-center"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Data Chegada
                      </label>
                      <input
                        type="date"
                        value={formArrivalDate}
                        onChange={(e) => setFormArrivalDate(e.target.value)}
                        className="w-full h-10 px-2.5 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Hora Chegada
                      </label>
                      <input
                        type="time"
                        value={formArrivalTime}
                        onChange={(e) => setFormArrivalTime(e.target.value)}
                        className="w-full h-10 px-2.5 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-medium text-center"
                      />
                    </div>

                    <div className="space-y-1 col-span-2 sm:col-span-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Duração
                      </label>
                      <input
                        type="text"
                        value={formDuration}
                        onChange={(e) => setFormDuration(e.target.value)}
                        placeholder="Ex: 8h 15m"
                        className="w-full h-10 px-2.5 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-medium"
                      />
                    </div>
                  </div>

                  {/* Escalas e Paradas da Ida */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Paradas / Escalas
                      </label>
                      <select
                        value={formStops}
                        onChange={(e) => setFormStops(Number(e.target.value))}
                        className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-semibold"
                      >
                        <option value={0}>0 - Voo Direto (Sem escalas)</option>
                        <option value={1}>1 escala</option>
                        <option value={2}>2 escalas</option>
                      </select>
                    </div>

                    {formStops > 0 && (
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                          Cidade da Escala
                        </label>
                        <input
                          type="text"
                          value={formStopCity}
                          onChange={(e) => setFormStopCity(e.target.value)}
                          placeholder="Ex: Brasília (BSB) ou Cidade do Panamá (PTY)"
                          className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-medium"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ABA 2: TRECHO DE VOLTA */}
              {activeTab === "return" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Tipo de Viagem</p>
                      <p className="text-xs text-slate-500">
                        {formIsRoundTrip
                          ? "Viagem de Ida e Volta (Com voo de regresso incluso)"
                          : "Somente Ida (One-Way)"}
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsRoundTrip}
                        onChange={(e) => setFormIsRoundTrip(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                    </label>
                  </div>

                  {formIsRoundTrip ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                          Configuração do Voo de Volta
                        </span>
                        <button
                          type="button"
                          onClick={handleInvertReturnFromOutbound}
                          className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <ArrowLeftRight className="size-3.5" />
                          Inverter Cidades da Ida
                        </button>
                      </div>

                      {/* Origem e Destino da Volta */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                          <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Origem da Volta
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              required={formIsRoundTrip}
                              value={formReturnOriginCity}
                              onChange={(e) => setFormReturnOriginCity(e.target.value)}
                              placeholder="Cidade (ex: Miami)"
                              className="col-span-2 h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white"
                            />
                            <input
                              type="text"
                              required={formIsRoundTrip}
                              maxLength={3}
                              value={formReturnOriginIata}
                              onChange={(e) => setFormReturnOriginIata(e.target.value.toUpperCase())}
                              placeholder="IATA"
                              className="h-10 px-2 text-xs rounded-xl border border-slate-200 bg-white font-black text-center uppercase"
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                          <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Destino da Volta
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              required={formIsRoundTrip}
                              value={formReturnDestCity}
                              onChange={(e) => setFormReturnDestCity(e.target.value)}
                              placeholder="Cidade (ex: São Paulo)"
                              className="col-span-2 h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white"
                            />
                            <input
                              type="text"
                              required={formIsRoundTrip}
                              maxLength={3}
                              value={formReturnDestIata}
                              onChange={(e) => setFormReturnDestIata(e.target.value.toUpperCase())}
                              placeholder="IATA"
                              className="h-10 px-2 text-xs rounded-xl border border-slate-200 bg-white font-black text-center uppercase"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Cia e Voo da Volta */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                            Cia Aérea da Volta
                          </label>
                          <input
                            type="text"
                            value={formReturnAirline}
                            onChange={(e) => setFormReturnAirline(e.target.value)}
                            placeholder="LATAM Airlines"
                            className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                            Cód. IATA
                          </label>
                          <input
                            type="text"
                            maxLength={2}
                            value={formReturnAirlineCode}
                            onChange={(e) => setFormReturnAirlineCode(e.target.value.toUpperCase())}
                            placeholder="LA"
                            className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 uppercase text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                            Nº Voo Volta
                          </label>
                          <input
                            type="text"
                            value={formReturnFlightNumber}
                            onChange={(e) => setFormReturnFlightNumber(e.target.value)}
                            placeholder="LA-8013"
                            className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200"
                          />
                        </div>
                      </div>

                      {/* Horários e Datas da Volta */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                            Data Partida
                          </label>
                          <input
                            type="date"
                            value={formReturnDepartureDate}
                            onChange={(e) => setFormReturnDepartureDate(e.target.value)}
                            className="w-full h-10 px-2 text-xs rounded-xl border border-slate-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                            Hora Partida
                          </label>
                          <input
                            type="time"
                            value={formReturnDepartureTime}
                            onChange={(e) => setFormReturnDepartureTime(e.target.value)}
                            className="w-full h-10 px-2 text-xs rounded-xl border border-slate-200 text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                            Data Chegada
                          </label>
                          <input
                            type="date"
                            value={formReturnArrivalDate}
                            onChange={(e) => setFormReturnArrivalDate(e.target.value)}
                            className="w-full h-10 px-2 text-xs rounded-xl border border-slate-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                            Hora Chegada
                          </label>
                          <input
                            type="time"
                            value={formReturnArrivalTime}
                            onChange={(e) => setFormReturnArrivalTime(e.target.value)}
                            className="w-full h-10 px-2 text-xs rounded-xl border border-slate-200 text-center"
                          />
                        </div>
                        <div className="space-y-1 col-span-2 sm:col-span-1">
                          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                            Duração Volta
                          </label>
                          <input
                            type="text"
                            value={formReturnDuration}
                            onChange={(e) => setFormReturnDuration(e.target.value)}
                            placeholder="8h 15m"
                            className="w-full h-10 px-2 text-xs rounded-xl border border-slate-200"
                          />
                        </div>
                      </div>

                      {/* Paradas da Volta */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                            Paradas na Volta
                          </label>
                          <select
                            value={formReturnStops}
                            onChange={(e) => setFormReturnStops(Number(e.target.value))}
                            className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200"
                          >
                            <option value={0}>0 - Voo Direto</option>
                            <option value={1}>1 escala</option>
                            <option value={2}>2 escalas</option>
                          </select>
                        </div>
                        {formReturnStops > 0 && (
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              Cidade da Escala (Volta)
                            </label>
                            <input
                              type="text"
                              value={formReturnStopCity}
                              onChange={(e) => setFormReturnStopCity(e.target.value)}
                              placeholder="Ex: Manaus (MAO)"
                              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                      <Plane className="size-8 text-slate-300 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">Voo configurado como Somente Ida</p>
                      <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                        O cliente adquirirá apenas a rota de partida. Ative o botão acima se desejar incluir voo de regresso.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ABA 3: CABINE, BAGAGEM & DESTAQUES */}
              {activeTab === "details" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Classe de Cabine & Franquia de Bagagens */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                        Classe da Cabine
                      </label>
                      <select
                        value={formCabinClass}
                        onChange={(e) =>
                          setFormCabinClass(
                            e.target.value as "Econômica" | "Premium Economy" | "Executiva"
                          )
                        }
                        className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                      >
                        <option value="Econômica">Econômica (Standard)</option>
                        <option value="Premium Economy">Premium Economy</option>
                        <option value="Executiva">Executiva (Business Class)</option>
                      </select>
                      <p className="text-[11px] text-slate-500">
                        Informa o conforto e serviço de bordo para os passageiros.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                        Franquia de Bagagens
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formHandBaggageIncluded}
                            onChange={(e) => setFormHandBaggageIncluded(e.target.checked)}
                            className="size-4 text-primary rounded-sm"
                          />
                          <span>Bagagem de mão (10kg) inclusa</span>
                        </label>
                        <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formBaggageIncluded}
                            onChange={(e) => setFormBaggageIncluded(e.target.checked)}
                            className="size-4 text-primary rounded-sm"
                          />
                          <span>Bagagem despachada (23kg) inclusa</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* País, Bandeira e Região do Destino */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        País de Destino
                      </label>
                      <input
                        type="text"
                        value={formCountry}
                        onChange={(e) => setFormCountry(e.target.value)}
                        placeholder="Ex: Estados Unidos"
                        className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Bandeira (Emoji)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={formFlag}
                          onChange={(e) => setFormFlag(e.target.value)}
                          className="w-14 h-10 text-center text-lg rounded-xl border border-slate-200"
                        />
                        <div className="flex flex-wrap gap-1">
                          {COMMON_FLAGS.slice(0, 5).map((f) => (
                            <button
                              key={f.flag}
                              type="button"
                              onClick={() => {
                                setFormFlag(f.flag);
                                setFormCountry(f.country);
                                setFormRegion(f.region);
                              }}
                              className="size-8 rounded-lg border border-slate-200 text-sm hover:bg-slate-100 transition cursor-pointer flex items-center justify-center"
                              title={f.country}
                            >
                              {f.flag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Região (Filtro)
                      </label>
                      <select
                        value={formRegion}
                        onChange={(e) =>
                          setFormRegion(
                            e.target.value as "all" | "usa" | "europe" | "south-america" | "other"
                          )
                        }
                        className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 font-semibold"
                      >
                        <option value="all">Todas as Regiões</option>
                        <option value="usa">Estados Unidos 🇺🇸</option>
                        <option value="europe">Europa 🇪🇺</option>
                        <option value="south-america">América do Sul 🌎</option>
                        <option value="other">Outros / Ásia / Oriente</option>
                      </select>
                    </div>
                  </div>

                  {/* Destaques / Tags Promocionais */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                      Destaques & Diferenciais do Voo
                    </label>

                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_HIGHLIGHTS.map((item) => {
                        const active = formHighlights.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleHighlight(item)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                              active
                                ? "bg-primary text-white shadow-2xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {active && <Check className="size-3" />}
                            {item}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customHighlight}
                        onChange={(e) => setCustomHighlight(e.target.value)}
                        placeholder="Adicionar outro diferencial (ex: Poltrona reclinável 180°)..."
                        className="flex-1 h-10 px-3 text-xs rounded-xl border border-slate-200"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustomHighlight();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomHighlight}
                        className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 4: TARIFAS & FOTO */}
              {activeTab === "pricing" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Preços e Parcelamento */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Preço Original (De) R$
                      </label>
                      <input
                        type="number"
                        value={formOriginalPrice}
                        onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                        placeholder="Ex: 4200"
                        className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-semibold text-slate-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                        Preço Promocional (Por) R$ *
                      </label>
                      <input
                        type="number"
                        required
                        value={formPrice}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        placeholder="Ex: 3290"
                        className="w-full h-10 px-3 text-xs rounded-xl border border-primary/50 outline-hidden focus:border-primary font-black text-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Parcelas Sem Juros
                      </label>
                      <select
                        value={formMaxInstallments}
                        onChange={(e) => setFormMaxInstallments(Number(e.target.value))}
                        className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 font-semibold"
                      >
                        {[1, 2, 3, 4, 6, 8, 10, 12, 18, 24].map((n) => (
                          <option key={n} value={n}>
                            Até {n}x sem juros
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Resumo do Preço e Destaque */}
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-emerald-800 font-bold">
                        Valor final por passageiro: R$ {formPrice.toLocaleString("pt-BR")}
                        {discountCalculated > 0 && (
                          <span className="ml-2 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                            {discountCalculated}% OFF
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        {formMaxInstallments}x de R$ {installmentValue} sem juros no cartão
                      </p>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
                      <input
                        type="checkbox"
                        checked={formFeatured}
                        onChange={(e) => setFormFeatured(e.target.checked)}
                        className="size-4 text-primary rounded-sm"
                      />
                      <span>Exibir na Home (Destaque)</span>
                    </label>
                  </div>

                  {/* Upload ou URL da Imagem de Capa do Destino */}
                  <div className="pt-2 border-t border-slate-100">
                    <ImageUploader
                      value={formImageUrl}
                      onChange={(url) => setFormImageUrl(url)}
                      folder="passagens"
                      label="Foto Panorâmica do Destino *"
                      description="Upload para o Storage do Supabase ou link direto da web"
                      aspectRatio="video"
                      recommendedResolution="Recomendado 1200x800 ou 800x600 em alta qualidade"
                    />
                  </div>
                </div>
              )}

              {/* BOTÕES DE AÇÃO - FIXOS NA BASE DO MODAL */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 shrink-0">
                <div className="flex items-center gap-2">
                  {activeTab !== "outbound" && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === "return") setActiveTab("outbound");
                        if (activeTab === "details") setActiveTab("return");
                        if (activeTab === "pricing") setActiveTab("details");
                      }}
                      className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                    >
                      ← Aba Anterior
                    </button>
                  )}
                  {activeTab !== "pricing" && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === "outbound") setActiveTab("return");
                        if (activeTab === "return") setActiveTab("details");
                        if (activeTab === "details") setActiveTab("pricing");
                      }}
                      className="px-4 py-2 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition cursor-pointer"
                    >
                      Próxima Aba →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer"
                  >
                    {isSaving ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Check className="size-4" />
                    )}
                    {isSaving
                      ? "Salvando..."
                      : editingId
                      ? "Salvar Alterações"
                      : "Cadastrar Voo Completo"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
