"use client";

import { Suspense, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Luggage, Hotel, Plane, ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/container";
import { useProductStore } from "@/stores/product-store";
import { LoadingScreen } from "@/components/shared/loading-screen";

function PacotesContent() {
  const { hotels, flights, fetchCatalog } = useProductStore();

  useEffect(() => {
    if (hotels.length === 0 || flights.length === 0) {
      fetchCatalog();
    }
  }, [hotels.length, flights.length, fetchCatalog]);

  const packages = [
    {
      id: "pkg-rio",
      title: "Pacote Rio de Janeiro Inesquecível",
      destination: "Rio de Janeiro, RJ",
      hotel: hotels[0], // Copacabana Palace
      flight: flights[0],
      nights: 4,
      originalPrice: 4800,
      price: 3690,
      discountPercent: 23,
      installments: 12,
      imageUrl: "https://images.pexels.com/photos/720300/pexels-photo-720300.jpeg",
      highlights: ["Voo Ida e Volta incluso", "Hotel 5 estrelas em Copacabana", "Café da manhã buffet"],
    },
    {
      id: "pkg-buzios",
      title: "Pacote Búzios Relax & Praias",
      destination: "Armação dos Búzios, RJ",
      hotel: hotels[1], // Búzios Resort
      flight: flights[0],
      nights: 5,
      originalPrice: 3500,
      price: 2790,
      discountPercent: 20,
      installments: 12,
      imageUrl: "https://images.pexels.com/photos/12039523/pexels-photo-12039523.jpeg",
      highlights: ["Voo Ida e Volta incluso", "Resort com Spa e piscina", "Café da manhã"],
    },
    {
      id: "pkg-santiago",
      title: "Pacote Santiago dos Andes & Vinhedos",
      destination: "Santiago, Chile",
      hotel: hotels[5] || hotels[0], // Santiago
      flight: flights[1],
      nights: 6,
      originalPrice: 5900,
      price: 4590,
      discountPercent: 22,
      installments: 12,
      imageUrl: "https://images.pexels.com/photos/2017747/pexels-photo-2017747.jpeg",
      highlights: ["Voo Internacional incluso", "Hotel com vista para os Andes", "Wine Tour"],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-[65px] pb-16">
      <div className="bg-primary text-white py-6 shadow-md border-b border-primary/20 mb-8">
        <Container>
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
              <Luggage className="size-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-secondary">
                Combinação Econômica Zarpou
              </span>
              <h1 className="text-2xl font-bold">Pacotes de Viagem (Voo + Hotel)</h1>
              <p className="text-xs text-white/80">
                Reserve voo e hospedagem juntos e economize até 30% em relação a compras separadas
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => {
            const installmentVal = (pkg.price / pkg.installments).toFixed(2);

            return (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={pkg.imageUrl}
                      alt={pkg.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-secondary text-primary text-xs font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="size-3" />
                      Economize {pkg.discountPercent}%
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-semibold">
                      {pkg.nights} noites de viagem
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                        {pkg.destination}
                      </p>
                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-primary transition leading-tight mt-0.5">
                        {pkg.title}
                      </h2>
                    </div>

                    <div className="space-y-2 border-y border-slate-100 py-3 text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <Plane className="size-4 text-primary shrink-0" />
                        <span>Passagens Aéreas de ida e volta inclusas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hotel className="size-4 text-primary shrink-0" />
                        <span>Hospedagem com café da manhã</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-slate-400 line-through">
                        R$ {pkg.originalPrice}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-medium text-slate-500">Por apenas</span>
                        <span className="text-2xl font-black text-primary">
                          R$ {pkg.price}
                        </span>
                        <span className="text-xs text-slate-500">/ pessoa</span>
                      </div>
                      <p className="text-xs font-bold text-emerald-600">
                        Em até {pkg.installments}x de R$ {installmentVal} sem juros
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={pkg.hotel?.id ? `/hospedagens/${pkg.hotel.id}` : "/hospedagens"}
                    className="w-full py-3 bg-secondary hover:bg-secondary/90 text-primary font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-secondary/20 transition transform group-hover:scale-102"
                  >
                    Ver Pacote Completo
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}

export default function PacotesPage() {
  return (
    <Suspense
      fallback={
        <LoadingScreen
          title="Carregando Pacotes Promocionais..."
          subtitle="Combinando voos e hospedagens com até 25% de economia em 12x sem juros"
          type="package"
          fullScreen={true}
        />
      }
    >
      <PacotesContent />
    </Suspense>
  );
}
