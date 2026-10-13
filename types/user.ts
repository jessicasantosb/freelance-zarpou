export interface NotificationPreferences {
  whatsappPromotions: boolean;
  emailPromotions: boolean;
  updatedAt?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  createdAt: string;
  isActive?: boolean;
  is_active?: boolean;
  notifications?: NotificationPreferences;
  totalBookings?: number;
  total_bookings?: number;
  twoFactorEnabled?: boolean;
  twoFactorMethod?: "email" | "authenticator" | "both";
  twoFactorSecret?: string;
  backupCodes?: string[];
  twoFactorConfirmedAt?: string;
}

export type AdminRole = "admin" | "gestor" | "atendente" | "personalizado" | string;

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole | string;
  allowedScreens?: string[];
  allowed_screens?: string[];
  isActive: boolean;
  is_active?: boolean;
  twoFactorEnabled?: boolean;
  twoFactorMethod?: "email" | "authenticator" | "both";
  twoFactorSecret?: string;
  backupCodes?: string[];
  twoFactorConfirmedAt?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface AdminScreenOption {
  id: string;
  name: string;
  category: string;
  description: string;
}

export const AVAILABLE_ADMIN_SCREENS: AdminScreenOption[] = [
  { id: "dashboard", name: "Dashboard / Visão Geral", category: "Geral", description: "Métricas gerais e faturamento" },
  { id: "hero", name: "Hero & Banner Principal", category: "Conteúdo", description: "Banners de destaque da página inicial" },
  { id: "promocoes", name: "Promoções & Banners", category: "Marketing", description: "Ofertas e cupons promocionais" },
  { id: "hospedagens", name: "Hospedagens (Hotéis)", category: "Catálogo", description: "Catálogo de hotéis, pousadas e quartos" },
  { id: "passagens", name: "Passagens Aéreas", category: "Catálogo", description: "Voos nacionais e internacionais" },
  { id: "destinos", name: "Destinos & Roteiros", category: "Catálogo", description: "Cidades turísticas e pacotes" },
  { id: "reservas", name: "Reservas & Pedidos", category: "Vendas", description: "Acompanhamento e confirmação de pedidos" },
  { id: "usuarios", name: "Clientes Cadastrados", category: "Clientes", description: "Base de usuários cadastrados e fidelidade" },
  { id: "administradores", name: "Administradores & Equipe", category: "Segurança", description: "Gestão de equipe e acessos administrativos" },
  { id: "configuracoes", name: "Configurações Gerais", category: "Sistema", description: "Parâmetros do sistema e dados da agência" },
];
