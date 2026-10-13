import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/storage";
import { CustomerUser, NotificationPreferences } from "@/types/user";
import { api } from "@/lib/api";
import { maskEmail } from "@/lib/two-factor";

export interface PendingTwoFactorCustomerAuth {
  user: CustomerUser;
  token?: string;
  email: string;
  availableMethods: ("email" | "authenticator")[];
  currentMethod: "email" | "authenticator";
  maskedEmail: string;
  expectedEmailCode?: string;
  expiresAt: number;
}

interface CustomerApiData {
  id: string;
  name?: string;
  fullName?: string;
  email: string;
  phone?: string;
  cpf?: string;
  createdAt?: string;
  created_at?: string;
  notifications?: NotificationPreferences;
  twoFactorEnabled?: boolean;
  twoFactorMethod?: "email" | "authenticator" | "both";
  twoFactorSecret?: string;
  backupCodes?: string[];
  twoFactorConfirmedAt?: string;
}

interface CustomerAuthStore {
  isCustomerAuthenticated: boolean;
  customerUser: CustomerUser | null;
  token: string | null;
  pendingTwoFactor: PendingTwoFactorCustomerAuth | null;
  login: (email: string, password?: string) => Promise<{
    success: boolean;
    requiresTwoFactor?: boolean;
    message?: string;
  }>;
  verifyTwoFactor: (code: string) => Promise<{ success: boolean; message?: string }>;
  cancelTwoFactor: () => void;
  sendTwoFactorEmailCode: () => Promise<{ success: boolean; message?: string }>;
  switchTwoFactorMethod: (method: "email" | "authenticator") => void;
  enableTwoFactor: (
    method: "email" | "authenticator" | "both",
    secret?: string,
    backupCodes?: string[]
  ) => Promise<{ success: boolean; message?: string }>;
  disableTwoFactor: () => Promise<{ success: boolean; message?: string }>;
  register: (data: {
    name: string;
    email: string;
    phone?: string;
    cpf?: string;
    password?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  updateNotifications: (preferences: Partial<NotificationPreferences>) => Promise<{ success: boolean }>;
  updateProfile: (data: Partial<CustomerUser>) => Promise<{ success: boolean }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const defaultNotifications: NotificationPreferences = {
  whatsappPromotions: true,
  emailPromotions: true,
};

export const useCustomerAuthStore = create<CustomerAuthStore>()(
  persist(
    (set, get) => ({
      isCustomerAuthenticated: false,
      customerUser: null,
      token: null,
      pendingTwoFactor: null,

      login: async (email, password = "clienteSenha123") => {
        const cleanEmail = email.trim().toLowerCase();

        try {
          const res = await api.post<{
            access_token: string;
            token_type: string;
            user: CustomerApiData;
          }>(
            "/auth/customer/login",
            {
              email: cleanEmail,
              password,
            },
            { skipAuth: true }
          );

          const authToken = res.access_token;
          let customerData = res.user;
          if (!customerData) {
            customerData = await api.get<CustomerApiData>("/auth/customer/me", { token: authToken });
          }

          const targetUser: CustomerUser = {
            id: customerData.id,
            name: customerData.fullName || customerData.name || "Viajante",
            email: customerData.email,
            phone: customerData.phone,
            cpf: customerData.cpf,
            createdAt: customerData.created_at || customerData.createdAt || new Date().toISOString(),
            notifications: customerData.notifications || defaultNotifications,
            twoFactorEnabled: customerData.twoFactorEnabled,
            twoFactorMethod: customerData.twoFactorMethod,
            twoFactorSecret: customerData.twoFactorSecret,
            backupCodes: customerData.backupCodes,
            twoFactorConfirmedAt: customerData.twoFactorConfirmedAt,
          };

          // Se 2FA estiver ativado no perfil do cliente
          if (targetUser.twoFactorEnabled) {
            const availableMethods: ("email" | "authenticator")[] = [];
            if (targetUser.twoFactorSecret) {
              availableMethods.push("authenticator");
            }
            availableMethods.push("email");

            const defaultMethod =
              targetUser.twoFactorMethod === "authenticator" && targetUser.twoFactorSecret
                ? "authenticator"
                : "email";

            let generatedCode = "";
            if (defaultMethod === "email") {
              try {
                const sendRes = await api.post<{ code?: string }>(
                  "/auth/customer/2fa/send-code",
                  { email: targetUser.email, name: targetUser.name },
                  { skipAuth: true }
                );
                if (sendRes?.code) generatedCode = sendRes.code;
              } catch {
                // Backend despacha o e-mail no servidor
              }
            }

            set({
              pendingTwoFactor: {
                user: targetUser,
                token: authToken,
                email: targetUser.email,
                availableMethods,
                currentMethod: defaultMethod,
                maskedEmail: maskEmail(targetUser.email),
                expectedEmailCode: generatedCode,
                expiresAt: Date.now() + 10 * 60 * 1000,
              },
            });

            return {
              success: true,
              requiresTwoFactor: true,
              message: `Código de verificação enviado para ${maskEmail(targetUser.email)}.`,
            };
          }

          // Sem 2FA: autentica imediatamente
          if (typeof window !== "undefined") {
            localStorage.setItem("zarpou-customer-token", authToken);
          }
          set({ isCustomerAuthenticated: true, customerUser: targetUser, token: authToken, pendingTwoFactor: null });
          return { success: true };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "E-mail ou senha incorretos.";
          return { success: false, message };
        }
      },

      verifyTwoFactor: async (code: string) => {
        const pending = get().pendingTwoFactor;
        if (!pending) {
          return { success: false, message: "Nenhuma sessão de verificação pendente." };
        }

        const cleanCode = code.trim().toUpperCase().replace(/\s/g, "");

        try {
          const apiRes = await api.post<{ access_token: string; user?: CustomerApiData }>(
            "/auth/customer/2fa/verify",
            { code: cleanCode, email: pending.email },
            { skipAuth: true }
          );

          if (!apiRes || !apiRes.access_token) {
            return { success: false, message: "Não foi possível validar o código 2FA." };
          }

          const customerData = apiRes.user;
          const finalUser: CustomerUser = customerData
            ? {
                id: customerData.id,
                name: customerData.fullName || customerData.name || pending.user.name,
                email: customerData.email,
                phone: customerData.phone,
                cpf: customerData.cpf,
                createdAt: customerData.created_at || customerData.createdAt || pending.user.createdAt,
                notifications: customerData.notifications || pending.user.notifications,
                twoFactorEnabled: customerData.twoFactorEnabled ?? true,
                twoFactorMethod: customerData.twoFactorMethod ?? pending.user.twoFactorMethod,
                twoFactorSecret: customerData.twoFactorSecret ?? pending.user.twoFactorSecret,
                backupCodes: customerData.backupCodes ?? pending.user.backupCodes,
                twoFactorConfirmedAt: customerData.twoFactorConfirmedAt ?? pending.user.twoFactorConfirmedAt,
              }
            : pending.user;

          if (typeof window !== "undefined") {
            localStorage.setItem("zarpou-customer-token", apiRes.access_token);
          }
          set({
            isCustomerAuthenticated: true,
            customerUser: finalUser,
            token: apiRes.access_token,
            pendingTwoFactor: null,
          });
          return { success: true };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Código de verificação incorreto ou expirado.";
          return { success: false, message };
        }
      },

      cancelTwoFactor: () => {
        set({ pendingTwoFactor: null });
      },

      sendTwoFactorEmailCode: async () => {
        const pending = get().pendingTwoFactor;
        if (!pending) return { success: false, message: "Nenhuma sessão ativa." };

        try {
          await api.post(
            "/auth/customer/2fa/send-code",
            { email: pending.user.email, name: pending.user.name },
            { skipAuth: true }
          );

          set({
            pendingTwoFactor: {
              ...pending,
              expiresAt: Date.now() + 10 * 60 * 1000,
            },
          });
          return { success: true, message: `Novo código enviado para ${pending.maskedEmail}.` };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Falha ao reenviar código.";
          return { success: false, message: msg };
        }
      },

      switchTwoFactorMethod: (method) => {
        const pending = get().pendingTwoFactor;
        if (!pending) return;
        set({ pendingTwoFactor: { ...pending, currentMethod: method } });
      },

      enableTwoFactor: async (method, secret, backupCodes) => {
        const current = get().customerUser;
        const token = get().token;
        if (!current || !token) return { success: false, message: "Usuário não autenticado." };

        try {
          await api.patch(
            "/auth/customer/2fa",
            {
              enabled: true,
              method,
              secret,
              backupCodes,
            },
            { token }
          );

          const updatedUser: CustomerUser = {
            ...current,
            twoFactorEnabled: true,
            twoFactorMethod: method,
            twoFactorSecret: secret || current.twoFactorSecret,
            backupCodes: backupCodes || current.backupCodes,
            twoFactorConfirmedAt: new Date().toISOString(),
          };

          set({ customerUser: updatedUser });
          return { success: true, message: "Autenticação em 2 fatores ativada com sucesso!" };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Erro ao ativar 2FA no servidor.";
          return { success: false, message: msg };
        }
      },

      disableTwoFactor: async () => {
        const current = get().customerUser;
        const token = get().token;
        if (!current || !token) return { success: false, message: "Usuário não autenticado." };

        try {
          await api.patch("/auth/customer/2fa", { enabled: false }, { token });

          const updatedUser: CustomerUser = {
            ...current,
            twoFactorEnabled: false,
            twoFactorConfirmedAt: undefined,
          };

          set({ customerUser: updatedUser });
          return { success: true, message: "Autenticação em 2 fatores desativada com sucesso." };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Erro ao desativar 2FA no servidor.";
          return { success: false, message: msg };
        }
      },

      register: async ({ name, email, phone, cpf, password = "clienteSenha123" }) => {
        const cleanPhone = phone ? phone.replace(/\D/g, "") : "";
        const cleanCpf = cpf ? cpf.replace(/\D/g, "") : "";

        try {
          await api.post(
            "/auth/customer/register",
            {
              name,
              email: email.trim().toLowerCase(),
              phone: cleanPhone,
              cpf: cleanCpf,
              password,
            },
            { skipAuth: true }
          );

          // Realiza login automático logo após cadastro bem-sucedido
          return await get().login(email, password);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Erro ao criar conta no servidor.";
          return { success: false, message: msg };
        }
      },

      updateNotifications: async (preferences: Partial<NotificationPreferences>) => {
        const current = get().customerUser;
        const token = get().token;
        if (!current || !token) return { success: false };

        const updatedNotifications: NotificationPreferences = {
          ...defaultNotifications,
          ...(current.notifications || {}),
          ...preferences,
          updatedAt: new Date().toISOString(),
        };

        const updatedUser: CustomerUser = {
          ...current,
          notifications: updatedNotifications,
        };

        set({ customerUser: updatedUser });

        try {
          await api.patch("/auth/customer/notifications", updatedNotifications, { token });
        } catch {
          // ignore
        }

        return { success: true };
      },

      updateProfile: async (data: Partial<CustomerUser>) => {
        const current = get().customerUser;
        const token = get().token;
        if (!current || !token) return { success: false };

        // Garante que o telefone seja sempre salvo limpo, sem caracteres de máscara
        const cleanData = {
          ...data,
          phone: data.phone !== undefined ? (data.phone ? data.phone.replace(/\D/g, "") : "") : current.phone,
          cpf: data.cpf !== undefined ? (data.cpf ? data.cpf.replace(/\D/g, "") : "") : current.cpf,
        };

        const updatedUser: CustomerUser = {
          ...current,
          ...cleanData,
        };

        set({ customerUser: updatedUser });

        try {
          await api.put("/auth/customer/me", cleanData, { token });
        } catch {
          // ignore
        }

        return { success: true };
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        const current = get().customerUser;
        const token = get().token;
        if (!current || !token) return { success: false, message: "Usuário não autenticado." };

        try {
          await api.post("/auth/customer/change-password", {
            currentPassword,
            newPassword,
          }, { token });
          return { success: true, message: "Senha alterada com sucesso!" };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Erro ao alterar senha. Verifique sua senha atual.";
          return { success: false, message: msg };
        }
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("zarpou-customer-token");
        }
        set({ isCustomerAuthenticated: false, customerUser: null, token: null });
      },

      checkAuth: async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("zarpou-customer-token") : null;
        if (!token || token === "local-fallback") return;

        try {
          const customerData = await api.get<CustomerApiData>("/auth/customer/me", { token });
          const user: CustomerUser = {
            id: customerData.id,
            name: customerData.fullName || customerData.name || "Viajante",
            email: customerData.email,
            phone: customerData.phone,
            cpf: customerData.cpf,
            createdAt:
              customerData.created_at ||
              customerData.createdAt ||
              new Date().toISOString(),
            notifications: customerData.notifications || defaultNotifications,
            twoFactorEnabled: customerData.twoFactorEnabled,
            twoFactorMethod: customerData.twoFactorMethod,
            twoFactorSecret: customerData.twoFactorSecret,
            backupCodes: customerData.backupCodes,
          };
          set({ isCustomerAuthenticated: true, customerUser: user, token });
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: "zarpou-customer-auth",
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);
