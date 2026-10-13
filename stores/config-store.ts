import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/storage";
import {
  AgencyConfig,
  PaymentGatewayConfig,
  WhatsAppApiConfig,
  AiChatConfig,
  StorageBucketConfig,
} from "@/types/config";
import { api } from "@/lib/api";

export const defaultWhatsappApi: WhatsAppApiConfig = {
  provider: "meta_cloud",
  enabled: false,
  apiToken: "",
  phoneNumberId: "",
  businessAccountId: "",
  apiUrl: "https://graph.facebook.com/v19.0",
};

export const defaultPaymentGateway: PaymentGatewayConfig = {
  provider: "mercadopago",
  environment: "sandbox",
  publicKey: "",
  secretKey: "",
  pixKey: "",
  webhookSecret: "",
  activeMethods: {
    creditCard: true,
    pix: true,
    boleto: true,
  },
};

export const defaultAiChat: AiChatConfig = {
  enabled: true,
  provider: "gemini",
  apiKey: process.env.NEXT_PUBLIC_AI_API_KEY || "",
  model: "flash",
  systemPrompt:
    "Você é o Concierge Virtual da Zarpou Viagens e Turismo. Seja atencioso, caloroso, conhecedor das melhores rotas, resorts, passagens aéreas e pacotes. Responda em português com dicas práticas e ofereça opções de viagens personalizadas.",
  welcomeMessage:
    "Olá! 👋 Sou o Concierge Virtual da Zarpou Viagens. Como posso ajudar com sua próxima viagem hoje?",
};

export const defaultStorageBucket: StorageBucketConfig = {
  provider: "aws_s3",
  enabled: true,
  bucketName: "",
  region: "sa-east-1",
  accessKeyId: "",
  secretAccessKey: "",
  endpointUrl: "",
  publicUrlPrefix: "",
};

const defaultConfig: AgencyConfig = {
  companyName: "Zarpou Viagens e Turismo Ltda",
  tradingName: "Zarpou Viagens",
  cnpj: process.env.NEXT_PUBLIC_CNPJ || "55.849.201/0001-38",
  cadastur: "34.120.948/0001-90",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5531984210000",
  whatsappMessage: "Olá! Gostaria de planejar minha próxima viagem com a Zarpou.",
  email: process.env.NEXT_PUBLIC_EMAIL || "contato@zarpouviagens.com.br",
  phone: "(31) 3245-8900",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || "zarpouviagens",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_USERNAME || "zarpouviagens",
  address: "Belo Horizonte - MG, Brasil",
  termsAndConditions: `Bem-vindo à Zarpou Viagens e Turismo. Ao utilizar nossos serviços e realizar reservas em nossa plataforma, você concorda com nossos termos.
Todas as reservas estão sujeitas à confirmação de disponibilidade e aprovação de pagamento. Cancelamentos e alterações seguem as políticas específicas de cada hotel ou companhia aérea contratada.`,
  privacyPolicy: `A Zarpou Viagens respeita sua privacidade e protege seus dados em conformidade com a LGPD (Lei Geral de Proteção de Dados - Lei nº 13.709/2018).
Seus dados cadastrais e de pagamento são utilizados estritamente para o processamento de suas reservas e emissão de vouchers, protegidos por criptografia de ponta a ponta.`,
  resendApiKey: "",
  whatsappApi: defaultWhatsappApi,
  paymentGateway: defaultPaymentGateway,
  aiChat: defaultAiChat,
  storageBucket: defaultStorageBucket,
};

interface ConfigStore {
  config: AgencyConfig;
  isLoading: boolean;
  fetchConfig: () => Promise<void>;
  updateConfig: (newConfig: Partial<AgencyConfig>) => Promise<void>;
  resetConfig: () => void;
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      isLoading: false,

      fetchConfig: async () => {
        try {
          set({ isLoading: true });
          const remoteConfig = await api.get<AgencyConfig>("/agency/settings");
          if (remoteConfig) {
            set((state) => ({
              config: {
                ...state.config,
                ...remoteConfig,
                whatsappApi: {
                  ...defaultWhatsappApi,
                  ...(remoteConfig.whatsappApi || {}),
                },
                paymentGateway: {
                  ...defaultPaymentGateway,
                  ...(remoteConfig.paymentGateway || {}),
                  activeMethods: {
                    ...defaultPaymentGateway.activeMethods,
                    ...(remoteConfig.paymentGateway?.activeMethods || {}),
                  },
                },
                aiChat: {
                  ...defaultAiChat,
                  ...(remoteConfig.aiChat || {}),
                },
                storageBucket: {
                  ...defaultStorageBucket,
                  ...(remoteConfig.storageBucket || {}),
                },
              },
            }));
          }
        } catch (err) {
          console.warn("Falha ao sincronizar configurações do servidor, mantendo dados em cache:", err);
        } finally {
          set({ isLoading: false });
        }
      },

      updateConfig: async (newConfig) => {
        const current = get().config;
        const merged: AgencyConfig = {
          ...current,
          ...newConfig,
          whatsappApi: {
            ...(current.whatsappApi || defaultWhatsappApi),
            ...(newConfig.whatsappApi || {}),
          },
          paymentGateway: {
            ...(current.paymentGateway || defaultPaymentGateway),
            ...(newConfig.paymentGateway || {}),
            activeMethods: {
              ...(current.paymentGateway?.activeMethods || defaultPaymentGateway.activeMethods),
              ...(newConfig.paymentGateway?.activeMethods || {}),
            },
          },
          aiChat: {
            ...(current.aiChat || defaultAiChat),
            ...(newConfig.aiChat || {}),
          },
          storageBucket: {
            ...(current.storageBucket || defaultStorageBucket),
            ...(newConfig.storageBucket || {}),
          },
        };

        // Atualiza o estado da UI instantaneamente e persiste via zustand persist
        set({ config: merged });

        // Persiste as alterações no banco de dados da API FastAPI
        try {
          await api.put("/agency/settings", merged);
        } catch (err) {
          console.error("Erro ao sincronizar configurações no backend:", err);
          throw err;
        }
      },

      resetConfig: () => set({ config: defaultConfig }),
    }),
    {
      name: "zarpou-agency-config",
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ config: state.config }),
    }
  )
);


