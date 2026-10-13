"use client";
 
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  ArrowRight,
  Sparkles,
  Hotel,
  Tag,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { DestinationItem } from "@/data/home/destinations";
import { useDestinationStore } from "@/stores/destination-store";

export function TopDestination() {
  const { destinations, fetchDestinations } = useDestinationStore();
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "national" | "international"
  >("all");

  useEffect(() => {
    setMounted(true);
    if (destinations.length === 0) {
      fetchDestinations();
    }
  }, [destinations.length, fetchDestinations]);

  const safeDestinations = mounted ? destinations : [];

  const filteredDestinations =
    selectedCategory === "all"
      ? safeDestinations
      : safeDestinations.filter((d) => d.category === selectedCategory);

  return (
    <section className="py-16 bg-white select-none">
      <Container>
        {/* CABEÇALHO DA SEÇÃO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-primary text-[11px] font-black uppercase tracking-wider mb-2.5">
              <Compass className="size-3 text-secondary fill-secondary" />
              Roteiros Mais Desejados
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Lugares Imperdíveis
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-xl">
              Cidades fascinantes e roteiros inesquecíveis selecionados para inspirar sua próxima aventura pelo Brasil e pelo mundo.
            </p>
          </div>

          <Link
            href="/destinos"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition group self-start md:self-auto pb-1"
          >
            <span>Ver todos os destinos & pacotes</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* CHIPS DE FILTRO RÁPIDO */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Categorias:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === "all"
                ? "bg-primary text-white shadow-xs font-bold"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Todos os Destinos
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("national")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === "national"
                ? "bg-primary text-white shadow-xs font-bold"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Destinos Nacionais 🇧🇷
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("international")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === "international"
                ? "bg-primary text-white shadow-xs font-bold"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Destinos Internacionais 🌎
          </button>
        </div>

        {/* GRADE DE CARDS VERTICAIS DE DESTINO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDestinations.map((dest: DestinationItem) => {
            const destinationLink = `/destinos?cidade=${encodeURIComponent(dest.title)}`;

            return (
              <Link
                key={dest.id}
                href={destinationLink}
                className="group relative h-[420px] rounded-3xl overflow-hidden shadow-xs hover:shadow-2xl transition-all duration-500 border border-slate-200/90 flex flex-col justify-between p-5 cursor-pointer"
              >
              {/* FOTO DO DESTINO COM ZOOM NO HOVER */}
              <Image
                src={dest.image_url || "https://images.pexels.com/photos/12039523/pexels-photo-12039523.jpeg"}
                alt={dest.title}
                fill
                unoptimized={Boolean(dest.image_url?.startsWith("data:"))}
                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />

              {/* GRADIENTE ESCURO MULTICAMADAS */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-black/30 pointer-events-none" />

              {/* SELOS DO TOPO (PAÍS E TAG) */}
              <div className="relative z-10 flex items-start justify-between gap-2">
                <div className="bg-white/95 backdrop-blur-xs text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-xs flex items-center gap-1.5">
                  <span>{dest.flag}</span>
                  <span>{dest.country}</span>
                </div>

                <div className="bg-secondary text-primary text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                  {dest.tag}
                </div>
              </div>

              {/* INFORMAÇÕES DO DESTINO NO RODAPÉ */}
              <div className="relative z-10 space-y-2.5 text-white">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-secondary flex items-center gap-1">
                    <MapPin className="size-3" />
                    {dest.bestTimeToVisit ? `Época: ${dest.bestTimeToVisit}` : "Destino em Destaque"}
                  </span>
                  <h3 className="text-2xl font-black leading-tight drop-shadow-md group-hover:text-secondary transition-colors">
                    {dest.title}{dest.state ? `, ${dest.state}` : ""}
                  </h3>
                </div>

                <p className="text-xs text-slate-200/90 line-clamp-2 leading-relaxed drop-shadow-xs font-normal">
                  {dest.description}
                </p>

                {/* INDICADORES DE ACOMODAÇÕES E PREÇO */}
                <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-[11px] text-white/90 font-medium">
                    <Hotel className="size-3.5 text-secondary" />
                    +{dest.accommodationsCount} opções
                  </span>

                  <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-400">
                    <Tag className="size-3" />
                    A partir de R$ {dest.startingPrice}
                  </span>
                </div>

                {/* BOTÃO DE EXPLORAR */}
                <div className="pt-2">
                  <span className="w-full py-2.5 px-4 bg-white/15 hover:bg-secondary hover:text-primary backdrop-blur-xs text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition border border-white/20 group-hover:bg-secondary group-hover:text-primary group-hover:border-transparent">
                    <span>Explorar {dest.title}</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
        </div>

        {/* BENEFÍCIOS NO RODAPÉ DA SEÇÃO */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-600" />
            Roteiros completos com aéreo e hotel integrados
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-4 text-secondary" />
            Parcelamento de pacotes em até 12x sem juros
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <Compass className="size-4 text-primary" />
            Consultoria humanizada para planejar seu roteiro
          </span>
        </div>
      </Container>
    </section>
  );
}
