import { CardProps } from "@/types/card";

type AirTicketsProps = CardProps & { departure_from: string };

export const airTickets: AirTicketsProps[] = [
  {
    title: "Visite Miami | EUA",
    departure_from: "Saindo de São Paulo",
    description:
      "Descubra as paisagens icônicas e cultura única nos Estados Unidos.",
    link: "https://app.onertravel.com/zarpouviagens/flight-list?departureDate=2025-09-04T00:00:00.000Z&returnDate=2025-09-11T00:00:00.000Z&isRoundTrip=true&adultsCount=1&infantCount=0&childCount=0&departureIata=SAO&arrivalIata=MIA&isDepartureIataCity=true&departureName=SAO%20Todos%20os%20aeroportos&departureCity=SAO&isArrivalIataCity=false&arrivalName=Miami%20-%20(MIA%20-%20Miami%20International%20Airport)&arrivalCity=Miami&source=f",
    image_url:
      "https://images.pexels.com/photos/3834331/pexels-photo-3834331.jpeg",
  },
  {
    title: "Visite Roma | Itália",
    departure_from: "Saindo de São Paulo",
    description:
      "Das praias da Costa Amalfitana às colinas da Toscana, experiências encantadoras.",
    link: "https://app.onertravel.com/zarpouviagens/flight-list?departureDate=2025-09-04T00:00:00.000Z&returnDate=2025-09-11T00:00:00.000Z&isRoundTrip=true&adultsCount=1&infantCount=0&childCount=0&departureIata=SAO&arrivalIata=FCO&isDepartureIataCity=true&departureName=SAO%20Todos%20os%20aeroportos&departureCity=SAO&isArrivalIataCity=false&arrivalName=Roma%20-%20(FCO%20-%20Leonardo%20da%20Vinci%E2%80%93Fiumicino%20Airport)&arrivalCity=Roma&source=f",
    image_url:
      "https://images.pexels.com/photos/6318793/pexels-photo-6318793.jpeg",
  },
  {
    title: "Visite Madri | Espanha",
    departure_from: "Saindo de São Paulo",
    description: "Um mundo de arte, tradição e alegria esperando por você.",
    link: "https://app.onertravel.com/zarpouviagens/flight-list?departureDate=2025-09-04&returnDate=2025-09-11&isRoundTrip=true&adultsCount=1&infantCount=0&childCount=0&departureIata=SAO&arrivalIata=MAD&isDepartureIataCity=true&departureName=SAO%20Todos%20os%20aeroportos&departureCity=SAO&isArrivalIataCity=false&arrivalName=Madrid%20-%20(MAD%20-%20Adolfo%20Su%C3%A1rez%20Madrid%E2%80%93Barajas%20Airport)&arrivalCity=Madrid&source=f",
    image_url:
      "https://images.pexels.com/photos/32903558/pexels-photo-32903558.jpeg",
  },
  {
    title: "Visite Nova York | EUA",
    departure_from: "Saindo de São Paulo",
    description:
      "A cidade que nunca dorme, repleta de cultura, luzes, arranha-céus e experiências únicas.",
    link: "https://app.onertravel.com/zarpouviagens/flight-list?departureDate=2025-09-04T00:00:00.000Z&returnDate=2025-09-11T00:00:00.000Z&isRoundTrip=true&adultsCount=1&infantCount=0&childCount=0&departureIata=SAO&arrivalIata=NYC&isDepartureIataCity=true&departureName=SAO%20Todos%20os%20aeroportos&departureCity=SAO&isArrivalIataCity=false&arrivalName=NYC%20Todos%20os%20aeroportos&arrivalCity=NYC&source=f",
    image_url:
      "https://images.pexels.com/photos/2408219/pexels-photo-2408219.jpeg",
  },
];
