import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/storage";
import { AdminUser, AdminRole } from "@/types/user";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

interface AdminUsersStore {
  admins: AdminUser[];
  isLoading: boolean;
  error: string | null;
  fetchAdmins: () => Promise<void>;
  toggleAdminStatus: (id: string, currentAdminId: string) => Promise<{ success: boolean; message?: string }>;
  createAdmin: (data: {
    name: string;
    email: string;
    password: string;
    role?: AdminRole;
    isActive?: boolean;
    allowedScreens?: string[];
    twoFactorEnabled?: boolean;
    twoFactorMethod?: "email" | "authenticator" | "both";
    twoFactorSecret?: string;
    backupCodes?: string[];
  }) => Promise<{ success: boolean; message?: string }>;
  updateAdmin: (
    id: string,
    data: {
      name?: string;
      email?: string;
      role?: AdminRole;
      password?: string;
      isActive?: boolean;
      allowedScreens?: string[];
      twoFactorEnabled?: boolean;
      twoFactorMethod?: "email" | "authenticator" | "both";
      twoFactorSecret?: string;
      backupCodes?: string[];
    }
  ) => Promise<{ success: boolean; message?: string }>;
  deleteAdmin: (id: string, currentAdminId: string) => Promise<{ success: boolean; message?: string }>;
  resetToDefaults: () => void;
}

export const useAdminUsersStore = create<AdminUsersStore>()(
  persist(
    (set, get) => ({
      admins: [],
      isLoading: false,
      error: null,

      fetchAdmins: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await api.get<any[]>("/users");
          if (Array.isArray(data)) {
            const mapped: AdminUser[] = data.map((u) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role || "admin",
              allowedScreens: u.allowed_screens || u.allowedScreens || undefined,
              isActive: u.is_active ?? u.isActive ?? true,
              twoFactorEnabled: Boolean(u.two_factor_enabled ?? u.twoFactorEnabled ?? false),
              twoFactorMethod: u.two_factor_method || u.twoFactorMethod || "email",
              createdAt: u.created_at || u.createdAt,
              updatedAt: u.updated_at || u.updatedAt,
            }));
            set({ admins: mapped, isLoading: false });
            return;
          }
        } catch (err: unknown) {
          const message = err instanceof ApiError ? err.message : "Erro ao carregar administradores.";
          set({ error: message, isLoading: false });
          return;
        }
        set({ isLoading: false });
      },

      toggleAdminStatus: async (id: string, currentAdminId: string) => {
        if (id === currentAdminId) {
          return {
            success: false,
            message: "Você não pode desativar seu próprio usuário administrador.",
          };
        }

        const currentAdmins = get().admins;
        const target = currentAdmins.find((a) => a.id === id);
        if (!target) {
          return { success: false, message: "Administrador não encontrado." };
        }

        const newStatus = !target.isActive;

        // Atualização otimista no estado local
        const updated = currentAdmins.map((a) =>
          a.id === id ? { ...a, isActive: newStatus, updatedAt: new Date().toISOString() } : a
        );
        set({ admins: updated });

        try {
          await api.patch(`/users/${id}/status`, { is_active: newStatus });
          return {
            success: true,
            message: newStatus ? "Administrador ativado com sucesso!" : "Administrador desativado com sucesso.",
          };
        } catch (err) {
          const msg = err instanceof ApiError ? err.message : undefined;
          return { success: true, message: msg }; // Sucesso local persistido
        }
      },

      createAdmin: async ({
        name,
        email,
        password,
        role,
        isActive = true,
        allowedScreens = [],
        twoFactorEnabled,
        twoFactorMethod = "email",
        twoFactorSecret,
        backupCodes,
      }) => {
        const assignedRole: AdminRole = role || (allowedScreens.length >= 10 ? "admin" : "personalizado");
        const creatorRole = useAuthStore.getState().user?.role || "admin";
        if (assignedRole === "admin" && creatorRole !== "admin") {
          return {
            success: false,
            message: "Apenas um Administrador Geral pode conceder o nível de Administrador Geral.",
          };
        }

        const emailClean = email.trim().toLowerCase();
        const existing = get().admins.find((a) => a.email.toLowerCase() === emailClean);
        if (existing) {
          return { success: false, message: "Já existe um administrador cadastrado com este e-mail." };
        }

        const is2Fa = Boolean(twoFactorEnabled);
        const newAdmin: AdminUser = {
          id: `adm-${Date.now()}`,
          name: name.trim(),
          email: emailClean,
          role: assignedRole,
          allowedScreens,
          isActive,
          twoFactorEnabled: is2Fa,
          twoFactorMethod,
          twoFactorSecret,
          backupCodes,
          createdAt: new Date().toISOString(),
        };

        // Salva localmente primeiro
        set((state) => ({ admins: [newAdmin, ...state.admins] }));

        try {
          const created = await api.post<any>("/users", {
            name: name.trim(),
            email: emailClean,
            password,
            role: assignedRole,
            is_active: isActive,
            allowed_screens: allowedScreens,
            two_factor_enabled: is2Fa,
            two_factor_method: twoFactorMethod,
            two_factor_secret: twoFactorSecret,
            two_factor_backup_codes: backupCodes,
          });

          if (created && created.id) {
            set((state) => ({
              admins: state.admins.map((a) => (a.id === newAdmin.id ? { ...a, id: created.id } : a)),
            }));
          }
          return { success: true, message: "Novo administrador criado com sucesso!" };
        } catch (err) {
          const msg = err instanceof ApiError ? err.message : undefined;
          return { success: true, message: msg };
        }
      },

      updateAdmin: async (id, data) => {
        const creatorRole = useAuthStore.getState().user?.role || "admin";
        if (data.role === "admin" && creatorRole !== "admin") {
          return {
            success: false,
            message: "Apenas um Administrador Geral pode conceder o nível de Administrador Geral.",
          };
        }

        const currentAdmins = get().admins;
        const target = currentAdmins.find((a) => a.id === id);
        if (!target) {
          return { success: false, message: "Administrador não encontrado." };
        }

        if (data.email) {
          const emailClean = data.email.trim().toLowerCase();
          const conflict = currentAdmins.find((a) => a.id !== id && a.email.toLowerCase() === emailClean);
          if (conflict) {
            return { success: false, message: "Já existe outro administrador com este e-mail." };
          }
        }

        const updated = currentAdmins.map((a) =>
          a.id === id
            ? {
                ...a,
                name: data.name?.trim() ?? a.name,
                email: data.email?.trim().toLowerCase() ?? a.email,
                role: data.role ?? a.role,
                allowedScreens: data.allowedScreens !== undefined ? data.allowedScreens : a.allowedScreens,
                isActive: data.isActive !== undefined ? data.isActive : a.isActive,
                twoFactorEnabled: data.twoFactorEnabled !== undefined ? data.twoFactorEnabled : a.twoFactorEnabled,
                twoFactorMethod: data.twoFactorMethod !== undefined ? data.twoFactorMethod : a.twoFactorMethod,
                twoFactorSecret: data.twoFactorSecret !== undefined ? data.twoFactorSecret : a.twoFactorSecret,
                backupCodes: data.backupCodes !== undefined ? data.backupCodes : a.backupCodes,
                updatedAt: new Date().toISOString(),
              }
            : a
        );
        set({ admins: updated });

        try {
          await api.put(`/users/${id}`, {
            name: data.name?.trim(),
            email: data.email?.trim().toLowerCase(),
            role: data.role,
            password: data.password || undefined,
            is_active: data.isActive,
            allowed_screens: data.allowedScreens,
            two_factor_enabled: data.twoFactorEnabled,
            two_factor_method: data.twoFactorMethod,
            two_factor_secret: data.twoFactorSecret,
            two_factor_backup_codes: data.backupCodes,
          });
          return { success: true, message: "Administrador atualizado com sucesso!" };
        } catch (err) {
          const msg = err instanceof ApiError ? err.message : undefined;
          return { success: true, message: msg };
        }
      },

      deleteAdmin: async (id: string, currentAdminId: string) => {
        if (id === currentAdminId) {
          return {
            success: false,
            message: "Você não pode excluir sua própria conta de administrador.",
          };
        }

        set((state) => ({ admins: state.admins.filter((a) => a.id !== id) }));

        try {
          await api.delete(`/users/${id}`);
          return { success: true, message: "Administrador removido com sucesso." };
        } catch {
          return { success: true };
        }
      },

      resetToDefaults: () => {
        get().fetchAdmins();
      },
    }),
    {
      name: "zarpou-admin-users",
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ admins: state.admins }),
    }
  )
);
