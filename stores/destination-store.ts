import { create } from "zustand";
import { DestinationItem, DEFAULT_DESTINATIONS } from "@/data/home/destinations";
import { api } from "@/lib/api";

function serializeDestinationPayload(d: DestinationItem) {
  return {
    id: d.id,
    title: d.title,
    country: d.country,
    state: d.state || null,
    flag: d.flag || null,
    category: d.category || "all",
    tag: d.tag || null,
    description: d.description || null,
    best_time_to_visit: d.bestTimeToVisit || null,
    highlights: d.highlights || [],
    starting_price: Number(d.startingPrice) || 0,
    accommodations_count: Number(d.accommodationsCount) || 0,
    link: d.link || null,
    image_url: d.image_url,
    is_active: true,
    display_order: 0,
  };
}

interface DestinationApiResponse {
  id: string;
  title: string;
  country: string;
  state?: string | null;
  flag?: string | null;
  category?: "all" | "national" | "international";
  tag?: string | null;
  description?: string | null;
  best_time_to_visit?: string | null;
  bestTimeToVisit?: string | null;
  highlights?: string[] | null;
  starting_price?: number;
  startingPrice?: number;
  accommodations_count?: number;
  accommodationsCount?: number;
  link?: string | null;
  image_url?: string;
  imageUrl?: string;
}

function serializeDestinationUpdatePayload(updated: Partial<DestinationItem>) {
  const payload: Record<string, unknown> = {};
  if (updated.title !== undefined) payload.title = updated.title;
  if (updated.country !== undefined) payload.country = updated.country;
  if (updated.state !== undefined) payload.state = updated.state;
  if (updated.flag !== undefined) payload.flag = updated.flag;
  if (updated.category !== undefined) payload.category = updated.category;
  if (updated.tag !== undefined) payload.tag = updated.tag;
  if (updated.description !== undefined) payload.description = updated.description;
  if (updated.bestTimeToVisit !== undefined) payload.best_time_to_visit = updated.bestTimeToVisit;
  if (updated.highlights !== undefined) payload.highlights = updated.highlights;
  if (updated.startingPrice !== undefined) payload.starting_price = Number(updated.startingPrice);
  if (updated.accommodationsCount !== undefined) payload.accommodations_count = Number(updated.accommodationsCount);
  if (updated.link !== undefined) payload.link = updated.link;
  if (updated.image_url !== undefined) payload.image_url = updated.image_url;
  return payload;
}

interface DestinationStore {
  destinations: DestinationItem[];
  fetchDestinations: () => Promise<void>;
  addDestination: (destination: DestinationItem) => Promise<void> | void;
  updateDestination: (id: string, destination: Partial<DestinationItem>) => Promise<void> | void;
  deleteDestination: (id: string) => Promise<void> | void;
  resetDestinations: () => void;
}

export const useDestinationStore = create<DestinationStore>()((set, get) => ({
  destinations: DEFAULT_DESTINATIONS,

  fetchDestinations: async () => {
    try {
      const list = await api.get<DestinationApiResponse[]>("/destinations");
      if (Array.isArray(list) && list.length > 0) {
        const mapped: DestinationItem[] = list.map((d) => ({
          id: d.id,
          title: d.title,
          country: d.country,
          flag: d.flag || "✈️",
          category: d.category || "all",
          tag: d.tag || "",
          description: d.description || "",
          startingPrice: Number(d.starting_price ?? d.startingPrice ?? 0),
          accommodationsCount: Number(d.accommodations_count ?? d.accommodationsCount ?? 0),
          link: d.link || `/hospedagens?city=${encodeURIComponent(d.title)}`,
          image_url: d.image_url || d.imageUrl || "https://images.pexels.com/photos/12039523/pexels-photo-12039523.jpeg",
          state: d.state || undefined,
          bestTimeToVisit: d.best_time_to_visit || d.bestTimeToVisit || undefined,
          highlights: Array.isArray(d.highlights) ? d.highlights : undefined,
        }));
        set({ destinations: mapped });
      }
    } catch (err) {
      console.warn("Falha ao buscar destinos da API, mantendo dados locais:", err);
    }
  },

  addDestination: async (destination) => {
    set((state) => ({
      destinations: [destination, ...state.destinations],
    }));

    try {
      await api.post("/destinations", serializeDestinationPayload(destination));
    } catch (err) {
      console.warn("Falha ao salvar destino na API:", err);
    }
  },

  updateDestination: async (id, updated) => {
    set((state) => ({
      destinations: state.destinations.map((d) =>
        d.id === id ? { ...d, ...updated } : d
      ),
    }));

    try {
      await api.put(`/destinations/${id}`, serializeDestinationUpdatePayload(updated));
    } catch (err) {
      console.warn("Falha ao atualizar destino na API:", err);
    }
  },

  deleteDestination: async (id) => {
    set((state) => ({
      destinations: state.destinations.filter((d) => d.id !== id),
    }));

    try {
      await api.delete(`/destinations/${id}`);
    } catch (err) {
      console.warn("Falha ao remover destino na API:", err);
    }
  },

  resetDestinations: () => {
    get().fetchDestinations();
  },
}));
