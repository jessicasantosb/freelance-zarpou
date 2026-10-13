import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/storage";
import { Company, CompanyEmployee, CompanyInvoice, CompanyRegisterData } from "@/types/company";
import { api, ApiError } from "@/lib/api";

interface CompanyStore {
  isCompanyAuthenticated: boolean;
  company: Company | null;
  token: string | null;
  employees: CompanyEmployee[];
  invoices: CompanyInvoice[];
  costCenters: string[];
  isLoading: boolean;

  login: (login: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: CompanyRegisterData) => Promise<{ success: boolean; message?: string }>;
  fetchProfile: () => Promise<void>;
  fetchEmployees: () => Promise<void>;
  addEmployee: (emp: {
    fullName: string;
    cpf: string;
    email: string;
    phone?: string;
    costCenter?: string;
    department?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  fetchInvoices: () => Promise<void>;
  fetchCostCenters: () => Promise<void>;
  logout: () => void;
}

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set, get) => ({
      isCompanyAuthenticated: false,
      company: null,
      token: null,
      employees: [],
      invoices: [],
      costCenters: [],
      isLoading: false,

      login: async (login, pass) => {
        try {
          set({ isLoading: true });
          const res = await api.post<{ access_token: string; company?: Company }>(
            "/companies/login",
            { login: login.trim(), password: pass },
            { skipAuth: true }
          );

          const token = res.access_token;
          if (typeof window !== "undefined") {
            localStorage.setItem("zarpou-company-token", token);
          }

          let companyData = res.company;
          if (!companyData) {
            companyData = await api.get<Company>("/companies/me", { token });
          }

          set({ isCompanyAuthenticated: true, company: companyData, token });

          // Carrega colaboradores e centros de custo em paralelo
          get().fetchEmployees();
          get().fetchCostCenters();
          get().fetchInvoices();

          return { success: true };
        } catch (err: any) {
          const message = err instanceof ApiError ? err.message : "CNPJ/E-mail ou senha incorretos.";
          return { success: false, message };
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (regData) => {
        try {
          set({ isLoading: true });
          await api.post("/companies/register", regData, { skipAuth: true });
          // Auto login após cadastro
          return await get().login(regData.corporateEmail, regData.password);
        } catch (err: any) {
          const message = err instanceof ApiError ? err.message : "Erro ao cadastrar empresa.";
          return { success: false, message };
        } finally {
          set({ isLoading: false });
        }
      },

      fetchProfile: async () => {
        const token = get().token || (typeof window !== "undefined" ? localStorage.getItem("zarpou-company-token") : null);
        if (!token) return;

        try {
          const company = await api.get<Company>("/companies/me", { token });
          set({ company, isCompanyAuthenticated: true });
        } catch {
          get().logout();
        }
      },

      fetchEmployees: async () => {
        const token = get().token || (typeof window !== "undefined" ? localStorage.getItem("zarpou-company-token") : null);
        if (!token) return;

        try {
          const employees = await api.get<CompanyEmployee[]>("/companies/me/employees", { token });
          if (Array.isArray(employees)) {
            set({ employees });
          }
        } catch (err) {
          console.error("Erro ao listar colaboradores:", err);
        }
      },

      addEmployee: async (empData) => {
        const token = get().token || (typeof window !== "undefined" ? localStorage.getItem("zarpou-company-token") : null);
        if (!token) return { success: false, message: "Não autenticado." };

        try {
          const created = await api.post<CompanyEmployee>(
            "/companies/me/employees",
            empData,
            { token }
          );
          set((state) => ({
            employees: [created, ...state.employees],
          }));
          get().fetchCostCenters();
          return { success: true };
        } catch (err: any) {
          const message = err instanceof ApiError ? err.message : "Erro ao cadastrar colaborador.";
          return { success: false, message };
        }
      },

      fetchInvoices: async () => {
        const token = get().token || (typeof window !== "undefined" ? localStorage.getItem("zarpou-company-token") : null);
        if (!token) return;

        try {
          const invoices = await api.get<CompanyInvoice[]>("/companies/invoices", { token });
          if (Array.isArray(invoices)) {
            set({ invoices });
          }
        } catch (err) {
          console.error("Erro ao listar faturas corporativas:", err);
        }
      },

      fetchCostCenters: async () => {
        const token = get().token || (typeof window !== "undefined" ? localStorage.getItem("zarpou-company-token") : null);
        if (!token) return;

        try {
          const centers = await api.get<string[]>("/companies/cost-centers", { token });
          if (Array.isArray(centers)) {
            set({ costCenters: centers });
          }
        } catch (err) {
          console.error("Erro ao listar centros de custo:", err);
        }
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("zarpou-company-token");
        }
        set({
          isCompanyAuthenticated: false,
          company: null,
          token: null,
          employees: [],
          invoices: [],
          costCenters: [],
        });
      },
    }),
    {
      name: "zarpou-company-auth",
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);
