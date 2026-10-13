export interface Company {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  corporateEmail: string;
  phone: string;
  managerName: string;
  managerCpf: string;
  status: "pendente" | "aprovada" | "bloqueada";
  corporateDiscountPercent: number;
  creditLimit: number;
  creditUsed: number;
  creditAvailable: number;
  paymentTerms: "faturado_15d" | "faturado_30d" | "cartao_corporativo";
  createdAt: string;
}

export interface CompanyEmployee {
  id: string;
  companyId: string;
  fullName: string;
  cpf: string;
  email: string;
  phone?: string;
  costCenter?: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CompanyInvoice {
  id: string;
  companyId: string;
  invoiceNumber: string;
  periodStart: string;
  periodEnd: string;
  totalAmount: number;
  dueDate: string;
  status: "aberta" | "fechada" | "paga" | "vencida";
  boletoUrl?: string;
  createdAt: string;
}

export interface CompanyRegisterData {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  corporateEmail: string;
  phone: string;
  managerName: string;
  managerCpf: string;
  password: string;
  estimatedMonthlySpend?: number;
}
