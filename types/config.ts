export type PaymentGatewayProvider =
  | "mercadopago"
  | "asaas"
  | "pagarme"
  | "stripe"
  | "efi";

export type PaymentEnvironment = "sandbox" | "production";

export interface PaymentGatewayConfig {
  provider: PaymentGatewayProvider;
  environment: PaymentEnvironment;
  publicKey: string;
  secretKey: string;
  pixKey: string;
  webhookSecret: string;
  activeMethods: {
    creditCard: boolean;
    pix: boolean;
    boleto: boolean;
  };
}

export type WhatsAppApiProvider =
  | "meta_cloud"
  | "evolution_api"
  | "z_api"
  | "other";

export interface WhatsAppApiConfig {
  provider: WhatsAppApiProvider;
  enabled: boolean;
  apiToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  apiUrl: string;
}

export type AiChatProvider =
  | "openai"
  | "gemini"
  | "groq"
  | "anthropic"
  | "other";

export interface AiChatConfig {
  enabled: boolean;
  provider: AiChatProvider;
  apiKey: string;
  model: string;
  systemPrompt: string;
  welcomeMessage: string;
}

export type StorageBucketProvider =
  | "aws_s3"
  | "supabase"
  | "cloudflare_r2"
  | "local";

export interface StorageBucketConfig {
  provider: StorageBucketProvider;
  enabled: boolean;
  bucketName: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpointUrl?: string;
  publicUrlPrefix?: string;
}

export interface AgencyConfig {
  companyName: string;
  tradingName: string; // Nome fantasia
  cnpj: string;
  cadastur: string;
  whatsapp: string; // Apenas números: ex: 5531999999999 (Exibição e clique wa.me)
  whatsappMessage: string;
  email: string;
  phone: string;
  instagram: string;
  linkedin: string;
  address: string;
  termsAndConditions: string;
  privacyPolicy: string;

  // Integrações com APIs de Mensageria, Pagamento, E-mail, IA e Storage
  whatsappApi: WhatsAppApiConfig;
  paymentGateway: PaymentGatewayConfig;
  resendApiKey: string;
  aiChat: AiChatConfig;
  storageBucket: StorageBucketConfig;
}
