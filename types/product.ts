export interface Room {
  id: string;
  name: string;
  description: string;
  maxAdults: number;
  maxChildren: number;
  beds: string;
  sizeM2: number;
  pricePerNight: number;
  originalPricePerNight?: number;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  availableRooms: number;
  imageUrl?: string;
  amenities: string[];
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  stars: number;
  rating: number; // Ex: 9.1
  reviewCount: number;
  reviewLabel: "Excelente" | "Muito Bom" | "Fabuloso" | "Bom";
  address: string;
  neighborhood: string;
  description: string;
  imageUrl: string;
  gallery: string[];
  amenities: string[];
  basePricePerNight: number;
  originalPricePerNight?: number;
  discountPercent?: number;
  maxInstallments: number; // Ex: 12
  badges?: string[]; // Ex: ["Recomendado", "Mais vendido", "Oferta Zarpou"]
  featured?: boolean;
  rooms: Room[];
}

export interface FlightSegment {
  flightNumber: string;
  airline: string;
  airlineCode: string; // Ex: "G3", "LA", "AD"
  airlineLogo?: string;
  originIata: string;
  originCity: string;
  originAirport: string;
  destinationIata: string;
  destinationCity: string;
  destinationAirport: string;
  departureTime: string; // "08:30"
  arrivalTime: string; // "11:45"
  departureDate: string; // "2026-11-15"
  arrivalDate: string; // "2026-11-15"
  duration: string; // "3h 15m"
  stops: number; // 0 para direto
  stopCity?: string;
  cabinClass: "Econômica" | "Premium Economy" | "Executiva";
  baggageIncluded: boolean;
  handBaggageIncluded: boolean;
}

export interface Flight {
  id: string;
  outbound: FlightSegment;
  returnFlight?: FlightSegment;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  maxInstallments: number;
  isRoundTrip: boolean;
  featured?: boolean;
  country?: string;
  flag?: string;
  region?: "all" | "usa" | "europe" | "south-america" | "other";
  imageUrl?: string;
  highlights?: string[];
}

export interface Package {
  id: string;
  title: string;
  destinationCity: string;
  durationNights: number;
  hotel: Hotel;
  flight: Flight;
  pricePerPerson: number;
  originalPricePerPerson?: number;
  discountPercent?: number;
  maxInstallments: number;
  imageUrl: string;
  highlights: string[];
  featured?: boolean;
}
