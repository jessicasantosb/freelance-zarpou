import { Hero } from "../../components/shared/hero";
import { Menu } from "./_components/menu";
import { TopDestination } from "./_components/top-destination";
import { TopHotels } from "./_components/top-hotels";
import { TopAirTicket } from "./_components/top-air-ticket";
import { WhatsappLink } from "@/components/shared/whatsapp-link";
import { BookingWidget } from "./_components/widget/booking-widget";

export default function HomePage() {
  return (
    <main>
      <Hero>
        <h1 className="text-2xl md:text-5xl font-bold -mb-3 tracking-tight">
          Seu <span className="text-secondary">sonho</span> de viajar bem,
        </h1>
        <h1 className="text-2xl md:text-5xl font-bold tracking-tight">
          agora é realidade
        </h1>
        <p className="text-lg md:text-xl">
          Pacotes nacionais e internacionais com condições especiais,
          planejamentos seguro e atendimento personalizado.
        </p>
        <WhatsappLink>Entre em contato conosco</WhatsappLink>
      </Hero>

      <BookingWidget />

      <Menu />
      <TopDestination />
      <TopHotels />
      <TopAirTicket />
    </main>
  );
}
