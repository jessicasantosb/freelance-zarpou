import { create } from "zustand";
import { ServiceTab, HotelSearchParams, FlightSearchParams } from "@/types/search";

interface SearchStore {
  activeTab: ServiceTab;
  hotelSearch: HotelSearchParams;
  flightSearch: FlightSearchParams;
  setActiveTab: (tab: ServiceTab) => void;
  setHotelSearch: (params: Partial<HotelSearchParams>) => void;
  setFlightSearch: (params: Partial<FlightSearchParams>) => void;
}

const defaultHotelSearch: HotelSearchParams = {
  destination: "Rio de Janeiro",
  checkIn: "2026-11-20",
  checkOut: "2026-11-23",
  rooms: 1,
  adults: 2,
  children: 0,
  sortBy: "recommended",
};

const defaultFlightSearch: FlightSearchParams = {
  origin: "Belo Horizonte (CNF)",
  destination: "Miami (MIA)",
  departureDate: "2026-11-20",
  returnDate: "2026-11-27",
  isRoundTrip: true,
  adults: 2,
  children: 0,
  cabinClass: "Econômica",
  sortBy: "recommended",
};

export const useSearchStore = create<SearchStore>((set) => ({
  activeTab: "hospedagens",
  hotelSearch: defaultHotelSearch,
  flightSearch: defaultFlightSearch,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setHotelSearch: (params) =>
    set((state) => ({
      hotelSearch: { ...state.hotelSearch, ...params },
    })),
  setFlightSearch: (params) =>
    set((state) => ({
      flightSearch: { ...state.flightSearch, ...params },
    })),
}));
