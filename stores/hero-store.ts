import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/storage";
import { api } from "@/lib/api";

export interface HeroConfig {
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  subtitle: string;
  bgType: "image" | "video";
  bgImageUrl: string;
  bgVideoUrl: string;
  ctaText: string;
  ctaLink: string;
}

const defaultHeroConfig: HeroConfig = {
  titlePrefix: "Seu",
  titleHighlight: "sonho",
  titleSuffix: "de viajar bem, agora é realidade",
  subtitle:
    "Reserve hotéis, passagens aéreas e pacotes com pagamento em até 12x sem juros e atendimento humano especializado.",
  bgType: "video",
  bgImageUrl:
    "https://images.pexels.com/photos/12039523/pexels-photo-12039523.jpeg",
  bgVideoUrl: "/hero.mp4",
  ctaText: "Falar com um Especialista",
  ctaLink: "whatsapp",
};

interface HeroStore {
  hero: HeroConfig;
  isLoading: boolean;
  fetchHero: () => Promise<void>;
  updateHero: (updated: Partial<HeroConfig>) => Promise<void>;
  resetHero: () => void;
}

export const useHeroStore = create<HeroStore>()(
  persist(
    (set, get) => ({
      hero: defaultHeroConfig,
      isLoading: false,

      fetchHero: async () => {
        try {
          set({ isLoading: true });
          const remote = await api.get<HeroConfig>("/agency/hero");
          if (remote) {
            set({ hero: remote });
          }
        } catch (err) {
          console.warn("Falha ao buscar Hero do backend, mantendo dados locais:", err);
        } finally {
          set({ isLoading: false });
        }
      },

      updateHero: async (updated) => {
        const current = get().hero;
        const merged = { ...current, ...updated };
        set({ hero: merged });

        try {
          await api.put("/agency/hero", merged);
        } catch (err) {
          console.error("Erro ao sincronizar hero no backend:", err);
          throw err;
        }
      },

      resetHero: () => set({ hero: defaultHeroConfig }),
    }),
    {
      name: "zarpou-hero-config",
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ hero: state.hero }),
    }
  )
);
