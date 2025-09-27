import { generateHotelLink } from "@/lib/generate-hotel-link";
import { CardProps } from "@/types/card";

export const destinations: CardProps[] = [
  {
    title: "Dubai",
    description:
      "Destino perfeito para quem quer vivenciar uma mistura de cultura árabe com um estilo de vida cosmopolita e luxuoso.",
    link: generateHotelLink("Dubai", "97509"),
    image_url: "https://images.pexels.com/photos/3769312/pexels-photo-3769312.jpeg",
  },
  {
    title: "Búzios",
    description:
      "Procurados por unir belezas naturais, infraestrutura de alto nível e um ambiente sofisticado.",
    link: generateHotelLink("Armação dos Búzios", "3607"),
    image_url: "https://images.pexels.com/photos/12039523/pexels-photo-12039523.jpeg",
  },
  {
    title: "Santiago",
    description:
      "Procurada por quem deseja explorar a cidade e por quem busca aventuras nos Andes e roteiros de vinhos.",
    link: generateHotelLink("Santiago", "88056"),
    image_url: "https://images.pexels.com/photos/2017747/pexels-photo-2017747.jpeg",
  },
];
