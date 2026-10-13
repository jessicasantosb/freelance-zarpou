import { create } from "zustand";
import { Flight, FlightSegment, Hotel, Room } from "@/types/product";
import { api } from "@/lib/api";

function mapHotel(h: any): Hotel {
  return {
    id: h.id,
    name: h.name,
    city: h.city,
    state: h.state,
    country: h.country,
    stars: h.stars,
    rating: Number(h.rating),
    reviewCount: h.review_count ?? h.reviewCount ?? 0,
    reviewLabel: h.review_label || h.reviewLabel || "Excelente",
    address: h.address,
    neighborhood: h.neighborhood,
    description: h.description,
    imageUrl: h.image_url || h.imageUrl,
    gallery: h.gallery || [],
    amenities: h.amenities || [],
    basePricePerNight: Number(h.base_price_per_night ?? h.basePricePerNight),
    originalPricePerNight: h.original_price_per_night ? Number(h.original_price_per_night) : undefined,
    discountPercent: h.discount_percent ?? undefined,
    maxInstallments: h.max_installments ?? 12,
    badges: h.badges || [],
    featured: h.featured ?? false,
    rooms: (h.rooms || []).map((r: any): Room => ({
      id: r.id,
      name: r.name,
      description: r.description || "",
      maxAdults: r.capacity || r.maxAdults || 2,
      maxChildren: r.maxChildren || 0,
      beds: r.beds || "1 Cama King",
      sizeM2: r.size_m2 || r.sizeM2 || 35,
      pricePerNight: Number(r.price_per_night ?? r.pricePerNight),
      originalPricePerNight: r.original_price_per_night ? Number(r.original_price_per_night) : undefined,
      freeCancellation: r.free_cancellation ?? r.freeCancellation ?? true,
      breakfastIncluded: r.breakfast_included ?? r.breakfastIncluded ?? true,
      availableRooms: r.available_rooms ?? r.availableRooms ?? 5,
      imageUrl: r.image_url || r.imageUrl,
      amenities: r.amenities || [],
    })),
  };
}

function mapFlight(f: any): Flight {
  const outboundSeg = f.segments?.find((s: any) => s.segment_type === "outbound") || f.segments?.[0] || {};
  const returnSeg = f.segments?.find((s: any) => s.segment_type === "return") || (f.segments?.length > 1 ? f.segments[1] : undefined);

  const mapSegment = (s: any): FlightSegment => ({
    flightNumber: s.flight_number || s.flightNumber || "",
    airline: s.airline || "",
    airlineCode: s.airline_code || s.airlineCode || "",
    airlineLogo: s.airline_logo || s.airlineLogo,
    originIata: s.origin_iata || s.originIata || "",
    originCity: s.origin_city || s.originCity || "",
    originAirport: s.origin_airport || s.originAirport || "",
    destinationIata: s.destination_iata || s.destinationIata || "",
    destinationCity: s.destination_city || s.destinationCity || "",
    destinationAirport: s.destination_airport || s.destinationAirport || "",
    departureDate: String(s.departure_date || s.departureDate || ""),
    departureTime: s.departure_time || s.departureTime || "",
    arrivalDate: String(s.arrival_date || s.arrivalDate || ""),
    arrivalTime: s.arrival_time || s.arrivalTime || "",
    duration: s.duration || "",
    stops: s.stops ?? 0,
    stopCity: s.stop_city || s.stopCity,
    cabinClass: s.cabin_class || s.cabinClass || "Econômica",
    baggageIncluded: s.baggage_included ?? s.baggageIncluded ?? true,
    handBaggageIncluded: s.hand_baggage_included ?? s.handBaggageIncluded ?? true,
  });

  return {
    id: f.id,
    price: Number(f.price),
    originalPrice: f.original_price ? Number(f.original_price) : undefined,
    discountPercent: f.discount_percent ?? undefined,
    maxInstallments: f.max_installments ?? 12,
    isRoundTrip: f.is_round_trip ?? true,
    featured: f.featured ?? false,
    country: f.country,
    flag: f.flag,
    region: f.region || "all",
    imageUrl: f.image_url || f.imageUrl,
    highlights: f.highlights || [],
    outbound: mapSegment(outboundSeg),
    returnFlight: returnSeg ? mapSegment(returnSeg) : undefined,
  };
}

function serializeHotelPayload(hotel: Hotel) {
  return {
    id: hotel.id,
    name: hotel.name,
    city: hotel.city,
    state: hotel.state,
    country: hotel.country || "Brasil",
    stars: hotel.stars || 4,
    rating: hotel.rating || 9.0,
    review_count: hotel.reviewCount || 0,
    review_label: hotel.reviewLabel || "Excelente",
    address: hotel.address || `${hotel.neighborhood || ""}, ${hotel.city}`,
    neighborhood: hotel.neighborhood,
    description: hotel.description || "",
    image_url: hotel.imageUrl,
    gallery: hotel.gallery || [hotel.imageUrl],
    amenities: hotel.amenities || [],
    base_price_per_night: Number(hotel.basePricePerNight),
    original_price_per_night: hotel.originalPricePerNight ? Number(hotel.originalPricePerNight) : null,
    discount_percent: hotel.discountPercent || 0,
    max_installments: hotel.maxInstallments || 12,
    badges: hotel.badges || [],
    featured: Boolean(hotel.featured),
    is_active: true,
    rooms: (hotel.rooms || []).map((r) => ({
      name: r.name,
      description: r.description || "",
      max_adults: r.maxAdults || 2,
      max_children: r.maxChildren || 0,
      beds: r.beds || "1 Cama Queen",
      size_m2: r.sizeM2 || 28,
      price_per_night: Number(r.pricePerNight),
      original_price_per_night: r.originalPricePerNight ? Number(r.originalPricePerNight) : null,
      free_cancellation: Boolean(r.freeCancellation),
      breakfast_included: Boolean(r.breakfastIncluded),
      available_rooms: r.availableRooms || 5,
      image_url: r.imageUrl || hotel.imageUrl,
      amenities: r.amenities || hotel.amenities || [],
    })),
  };
}

function serializeHotelUpdatePayload(updated: Partial<Hotel>) {
  const payload: Record<string, any> = {};
  if (updated.name !== undefined) payload.name = updated.name;
  if (updated.city !== undefined) payload.city = updated.city;
  if (updated.state !== undefined) payload.state = updated.state;
  if (updated.country !== undefined) payload.country = updated.country;
  if (updated.stars !== undefined) payload.stars = updated.stars;
  if (updated.rating !== undefined) payload.rating = updated.rating;
  if (updated.reviewCount !== undefined) payload.review_count = updated.reviewCount;
  if (updated.reviewLabel !== undefined) payload.review_label = updated.reviewLabel;
  if (updated.address !== undefined) payload.address = updated.address;
  if (updated.neighborhood !== undefined) payload.neighborhood = updated.neighborhood;
  if (updated.description !== undefined) payload.description = updated.description;
  if (updated.imageUrl !== undefined) payload.image_url = updated.imageUrl;
  if (updated.gallery !== undefined) payload.gallery = updated.gallery;
  if (updated.amenities !== undefined) payload.amenities = updated.amenities;
  if (updated.basePricePerNight !== undefined) payload.base_price_per_night = updated.basePricePerNight;
  if (updated.originalPricePerNight !== undefined) payload.original_price_per_night = updated.originalPricePerNight;
  if (updated.discountPercent !== undefined) payload.discount_percent = updated.discountPercent;
  if (updated.maxInstallments !== undefined) payload.max_installments = updated.maxInstallments;
  if (updated.badges !== undefined) payload.badges = updated.badges;
  if (updated.featured !== undefined) payload.featured = updated.featured;
  return payload;
}

function serializeFlightPayload(flight: Flight) {
  const mapSeg = (seg: FlightSegment, type: "outbound" | "return") => ({
    segment_type: type,
    flight_number: seg.flightNumber || "ZP-100",
    airline: seg.airline || "Zarpou Air",
    airline_code: seg.airlineCode || "ZP",
    airline_logo: seg.airlineLogo,
    origin_iata: (seg.originIata || "GRU").toUpperCase(),
    origin_city: seg.originCity || "São Paulo",
    origin_airport: seg.originAirport || `Aeroporto de ${seg.originCity || "São Paulo"}`,
    destination_iata: (seg.destinationIata || "MIA").toUpperCase(),
    destination_city: seg.destinationCity || "Miami",
    destination_airport: seg.destinationAirport || `Aeroporto de ${seg.destinationCity || "Miami"}`,
    departure_date: seg.departureDate || "2026-11-20",
    departure_time: seg.departureTime || "10:00",
    arrival_date: seg.arrivalDate || "2026-11-20",
    arrival_time: seg.arrivalTime || "18:00",
    duration: seg.duration || "8h 00m",
    stops: seg.stops || 0,
    stop_city: seg.stopCity,
    cabin_class: seg.cabinClass || "Econômica",
    baggage_included: seg.baggageIncluded ?? true,
    hand_baggage_included: seg.handBaggageIncluded ?? true,
  });

  return {
    id: flight.id,
    price: Number(flight.price),
    original_price: flight.originalPrice ? Number(flight.originalPrice) : null,
    discount_percent: flight.discountPercent || 0,
    max_installments: flight.maxInstallments || 12,
    is_round_trip: flight.isRoundTrip ?? true,
    featured: Boolean(flight.featured),
    country: flight.country || "Internacional",
    flag: flight.flag || "✈️",
    region: flight.region || "all",
    image_url: flight.imageUrl,
    highlights: flight.highlights || [],
    is_active: true,
    outbound: mapSeg(flight.outbound, "outbound"),
    return_flight: flight.returnFlight ? mapSeg(flight.returnFlight, "return") : null,
  };
}

function serializeFlightUpdatePayload(updated: Partial<Flight>) {
  const payload: Record<string, any> = {};
  if (updated.price !== undefined) payload.price = updated.price;
  if (updated.originalPrice !== undefined) payload.original_price = updated.originalPrice;
  if (updated.discountPercent !== undefined) payload.discount_percent = updated.discountPercent;
  if (updated.maxInstallments !== undefined) payload.max_installments = updated.maxInstallments;
  if (updated.isRoundTrip !== undefined) payload.is_round_trip = updated.isRoundTrip;
  if (updated.featured !== undefined) payload.featured = updated.featured;
  if (updated.country !== undefined) payload.country = updated.country;
  if (updated.flag !== undefined) payload.flag = updated.flag;
  if (updated.region !== undefined) payload.region = updated.region;
  if (updated.imageUrl !== undefined) payload.image_url = updated.imageUrl;
  if (updated.highlights !== undefined) payload.highlights = updated.highlights;
  return payload;
}

interface ProductStore {
  hotels: Hotel[];
  flights: Flight[];
  isLoading: boolean;
  fetchHotels: () => Promise<void>;
  fetchFlights: () => Promise<void>;
  fetchCatalog: () => Promise<void>;
  updateHotelPrice: (hotelId: string, basePrice: number, originalPrice?: number) => Promise<void> | void;
  updateHotelImage: (hotelId: string, imageUrl: string) => Promise<void> | void;
  updateHotel: (hotelId: string, hotel: Partial<Hotel>) => Promise<void> | void;
  addHotel: (hotel: Hotel) => Promise<void> | void;
  deleteHotel: (hotelId: string) => Promise<void> | void;
  updateFlightPrice: (flightId: string, price: number, originalPrice?: number) => Promise<void> | void;
  updateFlight: (flightId: string, flight: Partial<Flight>) => Promise<void> | void;
  addFlight: (flight: Flight) => Promise<void> | void;
  deleteFlight: (flightId: string) => Promise<void> | void;
  resetCatalog: () => void;
}

export const useProductStore = create<ProductStore>()((set, get) => ({
  hotels: [],
  flights: [],
  isLoading: false,

      fetchHotels: async () => {
        set({ isLoading: true });
        try {
          const data = await api.get<any[]>("/hotels");
          if (Array.isArray(data)) {
            set({ hotels: data.map(mapHotel), isLoading: false });
            return;
          }
        } catch {
          // ignore
        }
        set({ isLoading: false });
      },

      fetchFlights: async () => {
        set({ isLoading: true });
        try {
          const data = await api.get<any[]>("/flights");
          if (Array.isArray(data)) {
            set({ flights: data.map(mapFlight), isLoading: false });
            return;
          }
        } catch {
          // ignore
        }
        set({ isLoading: false });
      },

      fetchCatalog: async () => {
        await Promise.all([get().fetchHotels(), get().fetchFlights()]);
      },

      updateHotelPrice: async (hotelId, basePrice, originalPrice) => {
        const discount =
          originalPrice && originalPrice > basePrice
            ? Math.round(((originalPrice - basePrice) / originalPrice) * 100)
            : 0;

        set((state) => ({
          hotels: state.hotels.map((h) => {
            if (h.id === hotelId) {
              return {
                ...h,
                basePricePerNight: basePrice,
                originalPricePerNight: originalPrice,
                discountPercent: discount,
                rooms: h.rooms.map((r, i) =>
                  i === 0 ? { ...r, pricePerNight: basePrice } : r
                ),
              };
            }
            return h;
          }),
        }));

        try {
          await api.put(`/hotels/${hotelId}`, {
            base_price_per_night: basePrice,
            original_price_per_night: originalPrice,
            discount_percent: discount,
          });
        } catch (err) {
          console.warn("Falha ao salvar preço na API:", err);
        }
      },

      updateHotelImage: async (hotelId, imageUrl) => {
        set((state) => ({
          hotels: state.hotels.map((h) =>
            h.id === hotelId ? { ...h, imageUrl } : h
          ),
        }));

        try {
          await api.put(`/hotels/${hotelId}`, { image_url: imageUrl });
        } catch (err) {
          console.warn("Falha ao salvar imagem na API:", err);
        }
      },

      updateHotel: async (hotelId, updated) => {
        set((state) => ({
          hotels: state.hotels.map((h) =>
            h.id === hotelId ? { ...h, ...updated } : h
          ),
        }));

        try {
          await api.put(`/hotels/${hotelId}`, serializeHotelUpdatePayload(updated));
        } catch (err) {
          console.warn("Falha ao atualizar hotel na API:", err);
        }
      },

      addHotel: async (hotel) => {
        set((state) => ({
          hotels: [hotel, ...state.hotels.filter((h) => h.id !== hotel.id)],
        }));

        try {
          const payload = serializeHotelPayload(hotel);
          await api.post("/hotels", payload);
        } catch (err) {
          console.warn("Falha ao cadastrar hotel na API (mantido localmente):", err);
        }
      },

      deleteHotel: async (hotelId) => {
        set((state) => ({
          hotels: state.hotels.filter((h) => h.id !== hotelId),
        }));

        try {
          await api.delete(`/hotels/${hotelId}`);
        } catch (err) {
          console.warn("Falha ao remover hotel na API:", err);
        }
      },

      updateFlightPrice: async (flightId, price, originalPrice) => {
        const discount =
          originalPrice && originalPrice > price
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : 0;

        set((state) => ({
          flights: state.flights.map((f) => {
            if (f.id === flightId) {
              return {
                ...f,
                price,
                originalPrice,
                discountPercent: discount,
              };
            }
            return f;
          }),
        }));

        try {
          await api.put(`/flights/${flightId}`, {
            price,
            original_price: originalPrice,
            discount_percent: discount,
          });
        } catch (err) {
          console.warn("Falha ao salvar preço de voo na API:", err);
        }
      },

      updateFlight: async (flightId, updated) => {
        set((state) => ({
          flights: state.flights.map((f) =>
            f.id === flightId ? { ...f, ...updated } : f
          ),
        }));

        try {
          await api.put(`/flights/${flightId}`, serializeFlightUpdatePayload(updated));
        } catch (err) {
          console.warn("Falha ao atualizar voo na API:", err);
        }
      },

      addFlight: async (flight) => {
        set((state) => ({
          flights: [flight, ...state.flights.filter((f) => f.id !== flight.id)],
        }));

        try {
          const payload = serializeFlightPayload(flight);
          await api.post("/flights", payload);
        } catch (err) {
          console.warn("Falha ao cadastrar voo na API (mantido localmente):", err);
        }
      },

      deleteFlight: async (flightId) => {
        set((state) => ({
          flights: state.flights.filter((f) => f.id !== flightId),
        }));

        try {
          await api.delete(`/flights/${flightId}`);
        } catch (err) {
          console.warn("Falha ao remover voo na API:", err);
        }
      },

      resetCatalog: () => {
        get().fetchCatalog();
      },
    })
);
