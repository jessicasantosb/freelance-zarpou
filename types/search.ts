export type ServiceTab = "hospedagens" | "passagens" | "pacotes" | "passeios" | "carros";

export interface HotelSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  minPrice?: number;
  maxPrice?: number;
  stars?: number[];
  ratingMin?: number;
  breakfastOnly?: boolean;
  freeCancellationOnly?: boolean;
  sortBy?: "recommended" | "price_asc" | "price_desc" | "rating_desc";
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  isRoundTrip: boolean;
  adults: number;
  children: number;
  cabinClass: "Econômica" | "Premium Economy" | "Executiva";
  directFlightsOnly?: boolean;
  maxStops?: number;
  airline?: string[];
  sortBy?: "recommended" | "price_asc" | "duration_asc";
}

export interface PackageSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  rooms: number;
  sortBy?: "recommended" | "price_asc" | "rating_desc";
}
