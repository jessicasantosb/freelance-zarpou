"use client";

import { Suspense, useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Luggage,
  Hotel,
  Plane,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Search,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { useDestinationStore } from "@/stores/destination-store";
import { useProductStore } from "@/stores/product-store";
import { useBookingStore } from "@/stores/booking-store";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { DestinationItem } from "@/data/home/destinations";
import { Hotel as HotelType, Flight as FlightType } from "@/types/product";

interface CityPackageItem {
  id: string;
  title: string;
  nights: number;
  hotel?: HotelType;
  flight?: FlightType;
  price: number;
  originalPrice: number;
  discountPercent: number;
  installments: number;
  highlights: string[];
}

function DestinosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCityParam = searchParams.get("cidade") || "";

  const { destinations, fetchDestinations } = useDestinationStore();
  const { hotels, flights, fetchCatalog } = useProductStore();
  const { startHotelBooking } = useBookingStore();

  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"all" | "national" | "international">("all");
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>(selectedCityParam);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    fetchDestinations();
    if (hotels.length === 0 || flights.length === 0) {
      fetchCatalog();
    }
  }, [fetchDestinations, hotels.length, flights.length, fetchCatalog]);

  // Sincroniza se o parâmetro de busca na URL mudar
  useEffect(() => {
    if (selectedCityParam) {
      setSelectedCityFilter(selectedCityParam);
    }
  }, [selectedCityParam]);

  // Gera pacotes dinâmicos para um destino específico APENAS se houver hotel e voo reais no catálogo
  const getPackagesForDestination = useCallback((dest: DestinationItem): CityPackageItem[] => {
    if (!hotels.length || !flights.length) return [];

    const destName = dest.title.toLowerCase().trim();

    // Procura hotel REAL que pertença à cidade do destino
    const matchedHotel = hotels.find((h) => {
      const city = h.city.toLowerCase().trim();
      return city === destName || city.includes(destName) || destName.includes(city);
    });

    // Procura voo REAL cujo destino seja a cidade do destino
    const matchedFlight = flights.find((f) => {
      const destCity = f.outbound?.destinationCity?.toLowerCase().trim() || "";
      return destCity === destName || destCity.includes(destName) || destName.includes(destCity);
    });

    // Se NÃO houver hotel E voo reais cadastrados para este destino, NÃO gera pacotes!
    if (!matchedHotel || !matchedFlight) {
      return [];
    }

    const hotelNightPrice = matchedHotel.basePricePerNight || 0;
    const flightPrice = matchedFlight.price || 0;

    const basePkgPrice4Nights = Math.round(flightPrice + (hotelNightPrice * 4 * 0.85));
    const originalPkgPrice4Nights = Math.round(flightPrice + (hotelNightPrice * 4));
    const discount4 = Math.round(((originalPkgPrice4Nights - basePkgPrice4Nights) / originalPkgPrice4Nights) * 100);

    const basePkgPrice6Nights = Math.round(flightPrice + (hotelNightPrice * 6 * 0.80));
    const originalPkgPrice6Nights = Math.round(flightPrice + (hotelNightPrice * 6));
    const discount6 = Math.round(((originalPkgPrice6Nights - basePkgPrice6Nights) / originalPkgPrice6Nights) * 100);

    return [
      {
        id: `pkg-${dest.id}-standard`,
        title: `Pacote Completo: ${dest.title} Essencial`,
        nights: 4,
        hotel: matchedHotel,
        flight: matchedFlight,
        price: basePkgPrice4Nights,
        originalPrice: originalPkgPrice4Nights,
        discountPercent: discount4 > 0 ? discount4 : 15,
        installments: 12,
        highlights: [
          `Passagem Aérea ${matchedFlight.outbound?.airline || "inclusa"} (Ida e Volta)`,
          `Hospedagem no ${matchedHotel.name} (4 diárias)`,
          "Café da manhã incluso",
          "Assistência Zarpou 24h durante toda a estadia",
        ],
      },
      {
        id: `pkg-${dest.id}-premium`,
        title: `Experiência Premium: ${dest.title} dos Sonhos`,
        nights: 6,
        hotel: matchedHotel,
        flight: matchedFlight,
        price: basePkgPrice6Nights,
        originalPrice: originalPkgPrice6Nights,
        discountPercent: discount6 > 0 ? discount6 : 20,
        installments: 12,
        highlights: [
          `Passagem Aérea ${matchedFlight.outbound?.airline || "inclusa"} com bagagem`,
          `Hospedagem no ${matchedHotel.name} (6 diárias)`,
          "Café da manhã e benefícios exclusivos",
          "Transfer e assistência Zarpou 24h",
        ],
      },
    ];
  }, [hotels, flights]);

  // Cidades que realmente possuem pacotes disponíveis (com voo e hotel no catálogo)
  const destinationsWithPackages = useMemo(() => {
    return destinations.filter((dest) => getPackagesForDestination(dest).length > 0);
  }, [destinations, getPackagesForDestination]);

  // Filtragem de destinos: só exibe destinos que possuem pacotes reais disponíveis
  const filteredDestinations = useMemo(() => {
    return destinationsWithPackages.filter((dest) => {
      const matchesCategory =
        activeCategory === "all" || dest.category === activeCategory;
      const matchesCity =
        !selectedCityFilter ||
        dest.title.toLowerCase().includes(selectedCityFilter.toLowerCase());
      const matchesSearch =
        !searchQuery ||
        dest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesCity && matchesSearch;
    });
  }, [destinationsWithPackages, activeCategory, selectedCityFilter, searchQuery]);

  const handleBookPackage = (pkg: CityPackageItem) => {
    if (pkg.hotel) {
      const room = pkg.hotel.rooms?.[0] || {
        id: `room-${Date.now()}`,
        name: "Apartamento Luxo com Vista",
        description: "Acomodação completa com ar condicionado, frigobar e Wi-Fi.",
        maxAdults: 2,
        maxChildren: 1,
        beds: "1 Cama Queen",
        sizeM2: 32,
        pricePerNight: Math.round(pkg.price / pkg.nights),
        originalPricePerNight: Math.round(pkg.originalPrice / pkg.nights),
        freeCancellation: true,
        breakfastIncluded: true,
        availableRooms: 3,
        amenities: ["Café da Manhã Incluso", "Wi-Fi Grátis", "Ar-condicionado"],
      };
      startHotelBooking(
        pkg.hotel,
        room,
        "2026-11-20",
        "2026-11-24",
        2,
        0
      );
      router.push("/checkout");
    } else {
      router.push("/hospedagens");
    }
  };

  if (!mounted) {
    return (
      <LoadingScreen
        title="Carregando Lugares Imperdíveis..."
        subtitle="Buscando as cidades mais desejadas e seus pacotes de viagem"
        type="package"
        fullScreen={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-[65px] pb-20 select-none">
      {/* HERO BANNER DA PÁGINA */}
      <div className="bg-primary text-white py-12 mb-8 shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-transparent pointer-events-none" />
        <Container>
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-primary text-xs font-black uppercase tracking-wider">
              <Compass className="size-3.5 fill-primary" />
              Roteiros & Cidades Selecionadas
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Lugares Imperdíveis & Pacotes de Viagem
            </h1>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed font-medium">
              Explore cada cidade em detalhes e economize até 30% reservando pacotes completos com passagens aéreas, hospedagens de charme e experiências inesquecíveis.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        {/* BARRA DE FILTROS E PESQUISA */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs mb-10 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Campo de Busca Rápida */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por cidade, país ou atrativo..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-hidden focus:border-primary focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filtros de Categoria */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                  activeCategory === "all"
                    ? "bg-primary text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Todas as Regiões
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("national")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                  activeCategory === "national"
                    ? "bg-primary text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Destinos Nacionais 🇧🇷
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("international")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                  activeCategory === "international"
                    ? "bg-primary text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Internacionais 🌎
              </button>
            </div>
          </div>

          {/* CHIPS DE CIDADES CADASTRADAS COM PACOTES */}
          {destinationsWithPackages.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                  Filtrar Cidade:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCityFilter("")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                    !selectedCityFilter
                      ? "bg-secondary text-primary shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Todas as Cidades ({destinationsWithPackages.length})
                </button>

                {destinationsWithPackages.map((dest) => {
                  const isSelected =
                    selectedCityFilter.toLowerCase() === dest.title.toLowerCase();

                  return (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() =>
                        setSelectedCityFilter(isSelected ? "" : dest.title)
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        isSelected
                          ? "bg-secondary text-primary shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <span>{dest.flag}</span>
                      <span>{dest.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* LISTAGEM DE CIDADES E SEUS PACOTES */}
        {filteredDestinations.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm max-w-md mx-auto space-y-4">
            <div className="size-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
              <MapPin className="size-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {destinationsWithPackages.length === 0
                ? "Nenhum pacote disponível"
                : "Nenhum destino encontrado"}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {destinationsWithPackages.length === 0
                ? "Ainda não há pacotes de viagem com voos e hospedagens combinados no catálogo. Novos pacotes serão exibidos assim que os itens forem cadastrados."
                : "Tente selecionar outra categoria ou limpe o campo de busca para visualizar todas as opções disponíveis."}
            </p>
            {destinationsWithPackages.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("all");
                  setSelectedCityFilter("");
                  setSearchQuery("");
                }}
                className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition cursor-pointer"
              >
                Ver Todas as Cidades
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-14">
            {filteredDestinations.map((dest) => {
              const cityPackages = getPackagesForDestination(dest);

              return (
                <section
                  key={dest.id}
                  id={`cidade-${dest.id}`}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  {/* CABEÇALHO PANORÂMICO DA CIDADE */}
                  <div className="relative min-h-[290px] md:min-h-[310px] w-full overflow-hidden p-6 md:p-8 flex flex-col justify-between">
                    <Image
                      src={
                        dest.image_url ||
                        "https://images.pexels.com/photos/12039523/pexels-photo-12039523.jpeg"
                      }
                      alt={dest.title}
                      fill
                      unoptimized={Boolean(dest.image_url?.startsWith("data:"))}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/30 pointer-events-none" />

                    {/* TOPO: SELOS */}
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-black px-3 py-1.5 rounded-full uppercase shadow-md flex items-center gap-1.5">
                          <span>{dest.flag}</span>
                          <span>{dest.country}</span>
                        </div>
                        {dest.bestTimeToVisit && (
                          <div className="bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/25 flex items-center gap-1">
                            <Sparkles className="size-3 text-secondary" />
                            <span>Melhor época: {dest.bestTimeToVisit}</span>
                          </div>
                        )}
                      </div>

                      <div className="bg-secondary text-primary text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider shadow-md">
                        {dest.tag || "Destino Recomendado"}
                      </div>
                    </div>

                    {/* BASE: TÍTULO, DESCRIÇÃO E BOTÕES DE ATALHO */}
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
                      <div className="space-y-1 max-w-xl">
                        <span className="text-[11px] font-bold text-secondary uppercase tracking-widest flex items-center gap-1">
                          <MapPin className="size-3.5" />
                          Lugar Imperdível Zarpou
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black drop-shadow-md">
                          {dest.title}{dest.state ? `, ${dest.state}` : ""}
                        </h2>
                        <p className="text-xs text-slate-200/90 leading-relaxed drop-shadow-xs line-clamp-2">
                          {dest.description}
                        </p>
                        {dest.highlights && dest.highlights.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1.5">
                            {dest.highlights.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] bg-white/20 backdrop-blur-xs text-white px-2 py-0.5 rounded-md font-medium border border-white/20"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/hospedagens?city=${encodeURIComponent(dest.title)}`}
                          className="px-3.5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 border border-white/20"
                        >
                          <Hotel className="size-3.5 text-secondary" />
                          <span>+{dest.accommodationsCount} Hotéis</span>
                        </Link>
                        <Link
                          href={`/passagens?destination=${encodeURIComponent(dest.title)}`}
                          className="px-3.5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 border border-white/20"
                        >
                          <Plane className="size-3.5 text-secondary" />
                          <span>Voos para {dest.title}</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* SUBSEÇÃO: PACOTES DISPONÍVEIS PARA ESSA CIDADE */}
                  <div className="p-6 md:p-8 bg-slate-50/60 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                          <Luggage className="size-4.5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm md:text-base">
                            Pacotes de Viagem para {dest.title} (Voo + Hotel)
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Compre o pacote completo e garanta os maiores descontos da agência
                          </p>
                        </div>
                      </div>

                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <ShieldCheck className="size-3.5" />
                        Até 12x s/ juros no cartão
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {cityPackages.map((pkg) => {
                        const installmentVal = (pkg.price / pkg.installments).toFixed(2);

                        return (
                          <div
                            key={pkg.id}
                            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group space-y-5"
                          >
                            <div className="space-y-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <span className="text-[10px] font-black uppercase tracking-wider text-secondary bg-secondary/15 px-2 py-0.5 rounded-md inline-block mb-1">
                                    {pkg.nights} Noites de Viagem
                                  </span>
                                  <h4 className="font-bold text-slate-900 text-base group-hover:text-primary transition leading-snug">
                                    {pkg.title}
                                  </h4>
                                </div>

                                <div className="bg-emerald-600 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-2xs flex items-center gap-1 shrink-0">
                                  <Sparkles className="size-2.5" />
                                  <span>{pkg.discountPercent}% OFF</span>
                                </div>
                              </div>

                              {/* LISTA DE ITENS INCLUSOS NO PACOTE */}
                              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                  O que está incluso:
                                </span>
                                {pkg.highlights.map((h, i) => (
                                  <div
                                    key={i}
                                    className="flex items-start gap-2 text-xs text-slate-700 font-medium"
                                  >
                                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{h}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* VALORES E CTA */}
                            <div className="pt-4 border-t border-slate-100 flex items-end justify-between gap-4">
                              <div>
                                <span className="text-[11px] text-slate-400 line-through block">
                                  De R$ {pkg.originalPrice}
                                </span>
                                <div className="flex items-baseline gap-1">
                                  <span className="text-[11px] font-semibold text-slate-500">Por</span>
                                  <span className="text-2xl font-black text-primary">
                                    R$ {pkg.price}
                                  </span>
                                  <span className="text-[10px] text-slate-400">/pessoa</span>
                                </div>
                                <span className="text-[11px] font-bold text-emerald-600 block mt-0.5">
                                  12x de R$ {installmentVal} sem juros
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleBookPackage(pkg)}
                                className="px-5 py-3 bg-secondary hover:bg-secondary/90 text-primary font-black text-xs rounded-xl flex items-center gap-2 shadow-md shadow-secondary/20 transition-transform group-hover:scale-102 cursor-pointer shrink-0"
                              >
                                <span>Reservar Pacote</span>
                                <ArrowRight className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* BENEFÍCIOS DO ROTEIRO ZARPOU */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Luggage className="size-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Economia Combinada</h4>
            <p className="text-xs text-slate-500">
              Passagens aéreas e hotéis contratados em bloco com desconto de até 30% em relação a compras avulsas.
            </p>
          </div>

          <div className="space-y-2">
            <div className="size-12 rounded-2xl bg-secondary/20 text-secondary flex items-center justify-center mx-auto">
              <ShieldCheck className="size-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Garantia Zarpou</h4>
            <p className="text-xs text-slate-500">
              Vouchers emitidos no mesmo instante com todas as políticas de cancelamento e suporte 24 horas.
            </p>
          </div>

          <div className="space-y-2">
            <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Users className="size-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Consultoria Especializada</h4>
            <p className="text-xs text-slate-500">
              Precisa de ajuda com passeios, ingressos ou datas flexíveis? Fale diretamente com nossa equipe via WhatsApp.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function DestinosPage() {
  return (
    <Suspense
      fallback={
        <LoadingScreen
          title="Carregando Lugares Imperdíveis..."
          subtitle="Sincronizando destinos e pacotes da Zarpou"
          type="package"
          fullScreen={true}
        />
      }
    >
      <DestinosContent />
    </Suspense>
  );
}
