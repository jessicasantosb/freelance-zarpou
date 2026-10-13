import { AddonItem, PaymentMethod, PriceSummary, TravelerInfo } from "./checkout";
import { Flight, Hotel, Package, Room } from "./product";

export type BookingStatus =
  | "confirmada"
  | "pendente_pagamento"
  | "cancelada"
  | "concluida";

export interface BookingReview {
  rating: number; // 1 a 5 estrelas
  comment?: string;
  ratedAt: string;
}

export interface Booking {
  id: string;
  locatorCode: string; // Ex: "ZRP-849201"
  createdAt: string;
  status: BookingStatus;
  productType: "hotel" | "flight" | "package";
  hotel?: Hotel;
  selectedRoom?: Room;
  flight?: Flight;
  packageItem?: Package;
  checkInDate?: string;
  checkOutDate?: string;
  nights?: number;
  travelers: TravelerInfo[];
  addons: AddonItem[];
  paymentMethod: PaymentMethod;
  installments?: number;
  pricing: PriceSummary;
  pixCode?: string;
  pixQrCodeUrl?: string;
  pixExpiresAt?: string;
  boletoBarcode?: string;
  voucherUrl?: string;
  review?: BookingReview;
}
