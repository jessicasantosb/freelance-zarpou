import { create } from "zustand";
import { Promotion } from "@/types/promotion";
import { api } from "@/lib/api";

function serializePromotionPayload(promo: Omit<Promotion, "id"> & { id?: string }) {
  return {
    id: promo.id,
    title: promo.title,
    subtitle: promo.subtitle || null,
    badge: promo.badge || null,
    discount_text: promo.discountText || null,
    image_url: promo.imageUrl,
    link: promo.link,
    button_text: promo.buttonText || "Aproveitar Oferta",
    active: promo.active ?? true,
    display_order: promo.order || 0,
    notification_sent: promo.notificationSent ?? false,
    notification_sent_at: promo.notificationSentAt || null,
  };
}

function serializePromotionUpdatePayload(updated: Partial<Promotion>) {
  const payload: Record<string, any> = {};
  if (updated.title !== undefined) payload.title = updated.title;
  if (updated.subtitle !== undefined) payload.subtitle = updated.subtitle;
  if (updated.badge !== undefined) payload.badge = updated.badge;
  if (updated.discountText !== undefined) payload.discount_text = updated.discountText;
  if (updated.imageUrl !== undefined) payload.image_url = updated.imageUrl;
  if (updated.link !== undefined) payload.link = updated.link;
  if (updated.buttonText !== undefined) payload.button_text = updated.buttonText;
  if (updated.active !== undefined) payload.active = updated.active;
  if (updated.order !== undefined) payload.display_order = updated.order;
  if (updated.notificationSent !== undefined) payload.notification_sent = updated.notificationSent;
  if (updated.notificationSentAt !== undefined) payload.notification_sent_at = updated.notificationSentAt;
  return payload;
}

interface PromotionStore {
  promotions: Promotion[];
  isLoading: boolean;
  fetchPromotions: () => Promise<void>;
  addPromotion: (promo: Omit<Promotion, "id">) => Promise<void> | void;
  updatePromotion: (id: string, promo: Partial<Promotion>) => Promise<void> | void;
  deletePromotion: (id: string) => Promise<void> | void;
  togglePromotionActive: (id: string) => Promise<void> | void;
  markNotificationSent: (id: string) => void;
  resetPromotions: () => void;
}

export const usePromotionStore = create<PromotionStore>()((set, get) => ({
  promotions: [],
  isLoading: false,

      fetchPromotions: async () => {
        set({ isLoading: true });
        try {
          const list = await api.get<any[]>("/promotions");
          if (Array.isArray(list)) {
            const mapped: Promotion[] = list.map((p) => ({
              id: p.id,
              title: p.title,
              subtitle: p.subtitle,
              badge: p.badge,
              discountText: p.discount_text || p.discountText,
              imageUrl: p.image_url || p.imageUrl,
              link: p.link,
              buttonText: p.button_text || p.buttonText,
              active: p.active ?? p.is_active ?? true,
              order: p.order ?? 1,
              notificationSent: p.notification_sent ?? p.notificationSent ?? false,
              notificationSentAt: p.notification_sent_at || p.notificationSentAt,
            }));
            set({ promotions: mapped, isLoading: false });
            return;
          }
        } catch {
          // ignore
        }
        set({ isLoading: false });
      },

      addPromotion: async (promo) => {
        const id = `promo-${Date.now()}`;
        const newPromo: Promotion = { ...promo, id };
        set((state) => ({
          promotions: [newPromo, ...state.promotions],
        }));

        try {
          await api.post("/promotions", serializePromotionPayload(newPromo));
        } catch (err) {
          console.error("Falha ao salvar promoção na API:", err);
          throw err;
        }
      },

      updatePromotion: async (id, updated) => {
        set((state) => ({
          promotions: state.promotions.map((p) =>
            p.id === id ? { ...p, ...updated } : p
          ),
        }));

        try {
          await api.put(`/promotions/${id}`, serializePromotionUpdatePayload(updated));
        } catch (err) {
          console.error("Falha ao atualizar promoção na API:", err);
          throw err;
        }
      },

      deletePromotion: async (id) => {
        set((state) => ({
          promotions: state.promotions.filter((p) => p.id !== id),
        }));

        try {
          await api.delete(`/promotions/${id}`);
        } catch (err) {
          console.error("Falha ao excluir promoção na API:", err);
          throw err;
        }
      },

      togglePromotionActive: async (id) => {
        set((state) => ({
          promotions: state.promotions.map((p) =>
            p.id === id ? { ...p, active: !p.active } : p
          ),
        }));

        try {
          await api.patch(`/promotions/${id}/toggle`);
        } catch (err) {
          console.warn("Falha ao alternar promoção na API:", err);
        }
      },

      markNotificationSent: (id) =>
        set((state) => ({
          promotions: state.promotions.map((p) =>
            p.id === id
              ? {
                  ...p,
                  notificationSent: true,
                  notificationSentAt: new Date().toISOString(),
                }
              : p
          ),
        })),

      resetPromotions: () => {
        get().fetchPromotions();
      },
    })
);
