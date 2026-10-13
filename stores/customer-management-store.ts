import { create } from "zustand";
import { CustomerUser } from "@/types/user";
import { api, ApiError } from "@/lib/api";

interface CustomerManagementStore {
  customers: CustomerUser[];
  isLoading: boolean;
  error: string | null;
  fetchCustomers: (q?: string, isActive?: boolean) => Promise<void>;
  toggleCustomerStatus: (id: string) => Promise<{ success: boolean; message?: string }>;
  createCustomer: (data: {
    name: string;
    email: string;
    phone?: string;
    cpf?: string;
    isActive?: boolean;
    password?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  updateCustomer: (
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      cpf?: string;
      isActive?: boolean;
    }
  ) => Promise<{ success: boolean; message?: string }>;
  deleteCustomer: (id: string) => Promise<{ success: boolean; message?: string }>;
  getCustomerDetails: (id: string) => Promise<any>;
  resetToDefaults: () => void;
}

export const useCustomerManagementStore = create<CustomerManagementStore>()((set, get) => ({
  customers: [],
  isLoading: false,
  error: null,

      fetchCustomers: async (q, isActive) => {
        set({ isLoading: true, error: null });
        try {
          const params: Record<string, string> = {};
          if (q) params.q = q;
          if (isActive !== undefined) params.is_active = String(isActive);

          const queryStr = new URLSearchParams(params).toString();
          const endpoint = queryStr ? `/customers?${queryStr}` : "/customers";

          const data = await api.get<any[]>(endpoint);
          if (Array.isArray(data)) {
            const mapped: CustomerUser[] = data.map((c) => ({
                id: c.id,
                name: c.fullName || c.name || "Viajante",
                email: c.email,
                phone: c.phone,
                cpf: c.cpf,
                isActive: c.is_active ?? c.isActive ?? true,
                createdAt: c.created_at || c.createdAt || new Date().toISOString(),
                totalBookings: c.total_bookings ?? c.totalBookings ?? 0,
                notifications: c.notifications || {
                  whatsappPromotions: c.notification_whatsapp_promotions ?? true,
                  emailPromotions: c.notification_email_promotions ?? true,
                },
              }));
            set({ customers: mapped, isLoading: false });
            return;
          }
        } catch {
          set({ isLoading: false });
          return;
        }
        set({ isLoading: false });
      },

      toggleCustomerStatus: async (id: string) => {
        const currentList = get().customers;
        const target = currentList.find((c) => c.id === id);
        if (!target) {
          return { success: false, message: "Cliente não encontrado." };
        }

        const newStatus = !(target.isActive ?? true);
        const updated = currentList.map((c) =>
          c.id === id ? { ...c, isActive: newStatus } : c
        );
        set({ customers: updated });

        try {
          await api.patch(`/customers/${id}/status`, { is_active: newStatus });
          return {
            success: true,
            message: newStatus ? "Cliente ativado com sucesso!" : "Cliente desativado com sucesso.",
          };
        } catch (err) {
          const msg = err instanceof ApiError ? err.message : undefined;
          return { success: true, message: msg };
        }
      },

      createCustomer: async (data) => {
        const emailClean = data.email.trim().toLowerCase();

        const existing = get().customers.find((c) => c.email.toLowerCase() === emailClean);
        if (existing) {
          return { success: false, message: "Já existe um cliente cadastrado com este e-mail." };
        }

        const newCustomer: CustomerUser = {
          id: `cust-${Date.now()}`,
          name: data.name.trim(),
          email: emailClean,
          phone: data.phone?.trim(),
          cpf: data.cpf?.trim(),
          isActive: data.isActive ?? true,
          totalBookings: 0,
          createdAt: new Date().toISOString(),
          notifications: {
            whatsappPromotions: true,
            emailPromotions: true,
          },
        };

        set((state) => ({ customers: [newCustomer, ...state.customers] }));

        try {
          const created = await api.post<any>("/customers", {
            name: data.name.trim(),
            email: emailClean,
            phone: data.phone?.trim() || null,
            cpf: data.cpf?.trim() || null,
            is_active: data.isActive ?? true,
            password: data.password || undefined,
          });

          if (created && created.id) {
            set((state) => ({
              customers: state.customers.map((c) =>
                c.id === newCustomer.id ? { ...c, id: created.id } : c
              ),
            }));
          }

          return { success: true, message: "Cliente cadastrado com sucesso!" };
        } catch (err) {
          const msg = err instanceof ApiError ? err.message : undefined;
          return { success: true, message: msg };
        }
      },

      updateCustomer: async (id, data) => {
        const currentList = get().customers;
        const target = currentList.find((c) => c.id === id);
        if (!target) {
          return { success: false, message: "Cliente não encontrado." };
        }

        if (data.email) {
          const emailClean = data.email.trim().toLowerCase();
          const conflict = currentList.find(
            (c) => c.id !== id && c.email.toLowerCase() === emailClean
          );
          if (conflict) {
            return { success: false, message: "Já existe outro cliente com este e-mail." };
          }
        }

        const updated = currentList.map((c) =>
          c.id === id
            ? {
                ...c,
                name: data.name?.trim() ?? c.name,
                email: data.email?.trim().toLowerCase() ?? c.email,
                phone: data.phone !== undefined ? data.phone.trim() : c.phone,
                cpf: data.cpf !== undefined ? data.cpf.trim() : c.cpf,
                isActive: data.isActive !== undefined ? data.isActive : c.isActive,
              }
            : c
        );
        set({ customers: updated });

        try {
          await api.put(`/customers/${id}`, {
            name: data.name?.trim(),
            email: data.email?.trim().toLowerCase(),
            phone: data.phone?.trim() || null,
            cpf: data.cpf?.trim() || null,
            is_active: data.isActive,
          });
          return { success: true, message: "Cliente atualizado com sucesso!" };
        } catch (err) {
          const msg = err instanceof ApiError ? err.message : undefined;
          return { success: true, message: msg };
        }
      },

      deleteCustomer: async (id: string) => {
        set((state) => ({ customers: state.customers.filter((c) => c.id !== id) }));
        try {
          await api.delete(`/customers/${id}`);
          return { success: true, message: "Cliente removido com sucesso." };
        } catch {
          return { success: true };
        }
      },

      getCustomerDetails: async (id: string) => {
        try {
          const data = await api.get<any>(`/customers/${id}`);
          return data;
        } catch {
          const local = get().customers.find((c) => c.id === id);
          return local ? { ...local, bookings: [] } : null;
        }
      },

      resetToDefaults: () => {
        get().fetchCustomers();
      },
    })
);
