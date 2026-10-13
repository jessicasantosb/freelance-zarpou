export interface DestinationItem {
  id: string;
  title: string;
  country: string;
  state?: string;
  flag: string;
  category: "all" | "national" | "international";
  tag: string;
  description: string;
  startingPrice: number;
  accommodationsCount: number;
  link: string;
  image_url: string;
  bestTimeToVisit?: string;
  highlights?: string[];
}

export const DEFAULT_DESTINATIONS: DestinationItem[] = [
  {
    id: "dest-dubai",
    title: "Dubai",
    country: "Emirados Árabes",
    flag: "🇦🇪",
    category: "international",
    tag: "Luxo & Futurismo",
    description:
      "Arranha-céus icônicos, safáris no deserto, ilhas artificiais e o auge da sofisticação mundial.",
    startingPrice: 1650,
    accommodationsCount: 140,
    link: "/hospedagens?city=Dubai",
    image_url:
      "https://images.pexels.com/photos/3769312/pexels-photo-3769312.jpeg",
  },
  {
    id: "dest-buzios",
    title: "Armação dos Búzios",
    country: "Brasil",
    flag: "🇧🇷",
    category: "national",
    tag: "Praias Paradisíacas",
    description:
      "Mais de 20 praias de águas cristalinas, alta gastronomia na Rua das Pedras e pousadas de charme.",
    startingPrice: 520,
    accommodationsCount: 95,
    link: "/hospedagens?city=Armação%20dos%20Búzios",
    image_url:
      "https://images.pexels.com/photos/12039523/pexels-photo-12039523.jpeg",
  },
  {
    id: "dest-santiago",
    title: "Santiago",
    country: "Chile",
    flag: "🇨🇱",
    category: "international",
    tag: "Andes & Vinhedos",
    description:
      "A imponência da Cordilheira dos Andes, vinícolas renomadas mundialmente e rica herança cultural.",
    startingPrice: 720,
    accommodationsCount: 115,
    link: "/hospedagens?city=Santiago",
    image_url:
      "https://images.pexels.com/photos/2017747/pexels-photo-2017747.jpeg",
  },
  {
    id: "dest-rio",
    title: "Rio de Janeiro",
    country: "Brasil",
    flag: "🇧🇷",
    category: "national",
    tag: "Cidade Maravilhosa",
    description:
      "Copacabana, Ipanema, Cristo Redentor e uma atmosfera vibrante que encanta viajantes de todo o planeta.",
    startingPrice: 850,
    accommodationsCount: 260,
    link: "/hospedagens?city=Rio%20de%20Janeiro",
    image_url:
      "https://images.pexels.com/photos/720300/pexels-photo-720300.jpeg",
  },
];

export const destinations: DestinationItem[] = DEFAULT_DESTINATIONS;
