import { generateFlightLink } from "@/lib/generate-flight-link";
import { CardProps } from "@/types/card";

type AirTicketsProps = CardProps & { departure_from: string };

export const airTickets: AirTicketsProps[] = [
  {
    title: "Visite Miami | EUA",
    departure_from: "Saindo de São Paulo",
    description: "Descubra as paisagens icônicas e cultura única nos Estados Unidos.",
    link: generateFlightLink(
      "MIA",
      "Miami - (MIA - Miami International Airport)",
      "Miami"
    ),
    image_url: "https://images.pexels.com/photos/3834331/pexels-photo-3834331.jpeg",
  },
  {
    title: "Visite Roma | Itália",
    departure_from: "Saindo de São Paulo",
    description: "Das praias da Costa Amalfitana às colinas da Toscana, experiências encantadoras.",
    link: generateFlightLink(
      "FCO",
      "Roma - (FCO - Leonardo da Vinci–Fiumicino Airport)",
      "Roma"
    ),
    image_url: "https://images.pexels.com/photos/6318793/pexels-photo-6318793.jpeg",
  },
  {
    title: "Visite Madri | Espanha",
    departure_from: "Saindo de São Paulo",
    description: "Um mundo de arte, tradição e alegria esperando por você.",
    link: generateFlightLink(
      "MAD",
      "Madrid - (MAD - Adolfo Suárez Madrid–Barajas Airport)",
      "Madrid"
    ),
    image_url: "https://images.pexels.com/photos/32903558/pexels-photo-32903558.jpeg",
  },
  {
    title: "Visite Nova York | EUA",
    departure_from: "Saindo de São Paulo",
    description: "A cidade que nunca dorme, repleta de cultura, luzes e experiências únicas.",
    link: generateFlightLink(
      "NYC",
      "NYC Todos os aeroportos",
      "NYC"
    ),
    image_url: "https://images.pexels.com/photos/2408219/pexels-photo-2408219.jpeg",
  },
];
