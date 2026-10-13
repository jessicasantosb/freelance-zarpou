export interface TravelerInfo {
  id: string;
  fullName: string;
  documentType: "CPF" | "Passaporte";
  documentNumber: string;
  birthDate: string;
  gender: "M" | "F" | "Outro";
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface AddonItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: "seguro" | "bagagem" | "traslado" | "outro";
  selected: boolean;
}

export type PaymentMethod = "credit_card" | "pix" | "boleto" | "corporate_invoice";

export interface CreditCardData {
  cardNumber: string;
  holderName: string;
  expirationDate: string; // MM/AA
  cvv: string;
  installments: number;
}

export interface InstallmentOption {
  installments: number;
  installmentAmount: number;
  totalAmount: number;
  hasInterest: boolean;
  interestRate?: number;
}

export interface PriceSummary {
  baseAmount: number;
  taxesAndFees: number;
  addonsAmount: number;
  discountAmount: number;
  finalAmount: number;
}
