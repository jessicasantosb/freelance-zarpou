import { HomeHero } from "./_components/home-hero";
import { SearchEngine } from "@/components/search-engine/search-engine";
import { PromoBannerCarousel } from "@/components/promotions/promo-banner-carousel";
import { Menu } from "./_components/menu";
import { TopDestination } from "./_components/top-destination";
import { TopHotels } from "./_components/top-hotels";
import { TopAirTicket } from "./_components/top-air-ticket";

export default function HomePage() {
  return (
    <main className="relative overflow-visible" style={{ overflow: "visible" }}>
      {/* Hero com texto e imagem/vídeo 100% dinâmico configurável no Admin */}
      <HomeHero />

      {/* Mega Buscador Zarpou */}
      <SearchEngine />

      {/* Carrossel de Ofertas & Promoções Zarpou */}
      <PromoBannerCarousel />

      {/* Ecossistema Zarpou (Tudo em um só lugar) */}
      <Menu />

      {/* Hospedagens Selecionadas com Estilo */}
      <TopHotels />

      {/* Passagens para o Exterior */}
      <TopAirTicket />

      {/* Lugares Imperdíveis */}
      <TopDestination />
    </main>
  );
}
