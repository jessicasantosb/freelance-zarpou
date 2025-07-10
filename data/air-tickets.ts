import { CardProps } from "@/types/hotel";

type AirTicketsProps = CardProps & { departure_from: string }

export const airTickets: AirTicketsProps[] = [
  {
    title: "Miami | Estados Unidos",
    departure_from: "Saindo de São Paulo",
    description: "Uma cidade encantadora com clima tropical e cores vibrantes",
    link: "/",
  },
  {
    title: "Buenos Aires | Argentina",
    departure_from: "Saindo de São Paulo",
    description: "Uma cidade encantadora com clima tropical e cores vibrantes",
    link: "/",
  },
  {
    title: "Madrid | Espanha",
    departure_from: "Saindo de São Paulo",
    description: "Uma cidade encantadora com clima tropical e cores vibrantes",
    link: "/",
  },
];
