import { generateHotelLink } from "@/lib/generate-links";
import { CardProps } from "@/types/card";

export const hotels: CardProps[] = [
  {
    title: "Rio de Janeiro",
    description:
      "Viva a alegria do samba, da cultura carioca e das belezas naturais únicas do Brasil.",
    link: generateHotelLink("Rio De Janeiro", "3671"),
    image_url:
      "https://images.pexels.com/photos/720300/pexels-photo-720300.jpeg",
  },
  {
    title: "Porto Alegre",
    description:
      "Conheça os sabores do churrasco gaúcho e sinta o charme do sul do Brasil em cada esquina.",
    link: generateHotelLink("Porto Alegre", "4188"),
    image_url:
      "https://images.pexels.com/photos/1933645/pexels-photo-1933645.jpeg",
  },
  {
    title: "Recife",
    description:
      "Do frevo ao maracatu, a cidade pulsa arte e alegria, tornando cada visita inesquecível.",
    link: generateHotelLink("Recife", "3326"),
    image_url:
      "https://images.pexels.com/photos/20502520/pexels-photo-20502520.png",
  },
];
