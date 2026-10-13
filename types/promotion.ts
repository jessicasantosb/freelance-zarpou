export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  badge: string; // Ex: "OFERTA RELÂMPAGO", "VERÃO 2027", "BLACK FRIDAY"
  discountText: string; // Ex: "Até 35% OFF"
  imageUrl: string;
  link: string; // Ex: "/hospedagens?city=Rio%20de%20Janeiro" ou "/pacotes/nordeste"
  buttonText: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
  order: number;
  notificationSent?: boolean;
  notificationSentAt?: string;
}
