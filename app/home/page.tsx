import { Hero } from "../../components/shared/hero";
import { Menu } from "./_components/menu";
import { TopDestination } from "./_components/top-destination";
import { TopHotels } from "./_components/top-hotels";
import { TopAirTicket } from "./_components/top-air-ticket";
import { WhatsappLink } from "@/components/shared/whatsapp-link";

export default function HomePage() {
  return (
    <main>
      <Hero>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-14 md:leading-20">
          Seu <span className="text-secondary">sonho</span> de viajar bem, agora
          é realidade
        </h1>
        <p className="text-xl md:text-2xl">
          Pacotes nacionais e internacionais com condições especiais,
          planejamentos seguro e atendimento personalizado.
        </p>
        <WhatsappLink>Entre em contato conosco</WhatsappLink>
      </Hero>

      <Menu />
      <TopDestination />
      <TopHotels />
      <TopAirTicket />
    </main>
  );
}
