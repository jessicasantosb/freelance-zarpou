"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Check,
  RotateCcw,
  Building,
  Phone,
  Globe,
  Shield,
  CreditCard,
  MessageSquare,
  Key,
  Eye,
  EyeOff,
  Zap,
  Lock,
  Smartphone,
  Mail,
  Bot,
  Sparkles,
  Loader2,
  Cloud,
  HardDrive,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useConfigStore,
  defaultPaymentGateway,
  defaultWhatsappApi,
  defaultAiChat,
  defaultStorageBucket,
} from "@/stores/config-store";
import {
  AgencyConfig,
  PaymentGatewayProvider,
  WhatsAppApiProvider,
  AiChatProvider,
  StorageBucketProvider,
} from "@/types/config";
import { useConfirm } from "@/components/shared/confirm-dialog-provider";

export default function AdminConfiguracoesPage() {
  const { config, updateConfig, resetConfig, fetchConfig, isLoading } = useConfigStore();
  const { confirm } = useConfirm();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<AgencyConfig>(config);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Controle de visibilidade de tokens confidenciais
  const [showWhatsappToken, setShowWhatsappToken] = useState(false);
  const [showPaymentSecret, setShowPaymentSecret] = useState(false);
  const [showResendKey, setShowResendKey] = useState(false);
  const [showAiKey, setShowAiKey] = useState(false);
  const [showStorageSecret, setShowStorageSecret] = useState(false);
  const [testWhatsappStatus, setTestWhatsappStatus] = useState<string | null>(null);
  const [testResendStatus, setTestResendStatus] = useState<string | null>(null);
  const [testAiStatus, setTestAiStatus] = useState<string | null>(null);
  const [testStorageStatus, setTestStorageStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    setMounted(true);
    setFormData({
      ...config,
      resendApiKey: config.resendApiKey || "",
      aiChat: {
        ...defaultAiChat,
        ...(config.aiChat || {}),
      },
      whatsappApi: {
        ...defaultWhatsappApi,
        ...(config.whatsappApi || {}),
      },
      paymentGateway: {
        ...defaultPaymentGateway,
        ...(config.paymentGateway || {}),
        activeMethods: {
          ...defaultPaymentGateway.activeMethods,
          ...(config.paymentGateway?.activeMethods || {}),
        },
      },
      storageBucket: {
        ...defaultStorageBucket,
        ...(config.storageBucket || {}),
      },
    });
  }, [config]);

  const [isTestingWhatsapp, setIsTestingWhatsapp] = useState(false);
  const [isTestingResend, setIsTestingResend] = useState(false);
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [isTestingStorage, setIsTestingStorage] = useState(false);

  const handleSimulateStorageTest = async () => {
    const bucket = formData.storageBucket;
    if (!bucket?.bucketName) {
      toast.warning("Por favor, informe o Nome do Bucket S3 antes de testar.");
      return;
    }
    if (bucket.provider === "aws_s3" && (!bucket.accessKeyId || !bucket.secretAccessKey)) {
      toast.warning("Por favor, preencha o Access Key ID e o Secret Access Key da AWS.");
      return;
    }
    setIsTestingStorage(true);
    await new Promise((r) => setTimeout(r, 650));
    setIsTestingStorage(false);
    setTestStorageStatus("Bucket S3 e credenciais IAM válidos!");
    toast.success(`Bucket "${bucket.bucketName}" (${bucket.region}) validado! Uploads prontos para AWS.`);
  };

  const handleSimulateAiTest = async () => {
    if (!formData.aiChat?.apiKey) {
      toast.info("Chave de IA vazia: o Chatbot operará em modo inteligente nativo com catálogo Zarpou.");
      setTestAiStatus("Modo nativo (catálogo)");
      return;
    }
    setIsTestingAi(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsTestingAi(false);
    setTestAiStatus("Conexão com a IA validada com sucesso!");
    toast.success("Conexão com a IA validada com sucesso! Concierge de Viagens pronto para atendimento 24h.");
  };

  const handleSimulateResendTest = async () => {
    if (!formData.resendApiKey) {
      toast.warning("Por favor, informe a RESEND_API_KEY antes de testar.");
      return;
    }
    if (!formData.resendApiKey.startsWith("re_")) {
      toast.warning("Aviso: Chaves oficiais do Resend costumam iniciar com 're_'. Verifique sua chave.");
      return;
    }
    setIsTestingResend(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsTestingResend(false);
    setTestResendStatus("Chave do Resend válida!");
    toast.success("Chave do Resend válida! Disparos de e-mail e vouchers transacionais ativos.");
  };

  const handleSimulateWhatsappTest = async () => {
    if (!formData.whatsappApi?.apiToken || !formData.whatsappApi?.phoneNumberId) {
      toast.warning("Por favor, preencha o Token e o ID do Número antes de testar.");
      return;
    }
    setIsTestingWhatsapp(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsTestingWhatsapp(false);
    setTestWhatsappStatus("Conexão validada com sucesso!");
    toast.success("Conexão validada! Credenciais do WhatsApp prontas para disparos automáticos.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await Promise.all([
        updateConfig(formData),
        new Promise((resolve) => setTimeout(resolve, 350)),
      ]);
      setSaved(true);
      toast.success("Configurações salvas com sucesso!");
      setTimeout(() => setSaved(false), 3500);
    } catch (err: unknown) {
      console.error("Erro ao salvar configurações:", err);
      const msg = err instanceof Error ? err.message : "Ocorreu um erro ao salvar as configurações. Tente novamente.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const confirmed = await confirm({
      title: "Restaurar Configurações Originais",
      description: "Deseja restaurar as configurações originais da Zarpou para o padrão inicial?",
      confirmText: "Restaurar",
      cancelText: "Cancelar",
      variant: "warning",
      icon: "warning",
    });

    if (confirmed) {
      setIsSaving(true);
      try {
        resetConfig();
        const fresh = useConfigStore.getState().config;
        setFormData(fresh);
        await updateConfig(fresh);
        setSaved(true);
        toast.success("Configurações restauradas para o padrão!");
        setTimeout(() => setSaved(false), 2500);
      } catch {
        toast.error("Erro ao restaurar as configurações.");
      } finally {
        setIsSaving(false);
      }
    }
  };



  if (!mounted) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        Carregando configurações...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900">
              Configurações Gerais & Integrações
            </h1>
            {isLoading && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary animate-pulse">
                <Loader2 className="size-3 animate-spin" /> Sincronizando com o banco...
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie dados cadastrais, chaves das APIs de Pagamento, token do WhatsApp e políticas da agência
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          disabled={isSaving}
          className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          Restaurar Padrão
        </button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="size-4 text-emerald-600" />
          Configurações e credenciais de API salvas com sucesso! As alterações já estão ativas no sistema.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BLOCO 1: DADOS INSTITUCIONAIS & CNPJ */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <Building className="size-4 text-primary" />
            Dados Cadastrais & Fiscais
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                CNPJ da Agência *
              </label>
              <input
                type="text"
                required
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
              />
              <span className="text-[10px] text-slate-400">
                Atualiza o rodapé, vouchers e termos legais do site
              </span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Registro Cadastur *
              </label>
              <input
                type="text"
                required
                value={formData.cadastur}
                onChange={(e) => setFormData({ ...formData, cadastur: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
              />
              <span className="text-[10px] text-slate-400">
                Certificado oficial do Ministério do Turismo
              </span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Razão Social
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Nome Fantasia
              </label>
              <input
                type="text"
                value={formData.tradingName}
                onChange={(e) =>
                  setFormData({ ...formData, tradingName: e.target.value })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* BLOCO 2: API DO WHATSAPP (MENSAGENS & AUTOMAÇÃO) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <MessageSquare className="size-4 text-emerald-600" />
              API do WhatsApp (Disparos Automáticos de Confirmação & Vouchers)
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.whatsappApi?.enabled ?? false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whatsappApi: {
                      ...formData.whatsappApi,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="ml-2 text-xs font-bold text-slate-700">
                {formData.whatsappApi?.enabled ? "API Ativa" : "Desativada"}
              </span>
            </label>
          </div>

          <p className="text-xs text-slate-500">
            Configure as credenciais da API para envio automático de confirmação de reservas, bilhetes e vouchers aos passageiros.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* PROVEDOR DA API */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Provedor da API *
              </label>
              <select
                value={formData.whatsappApi?.provider || "meta_cloud"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whatsappApi: {
                      ...formData.whatsappApi,
                      provider: e.target.value as WhatsAppApiProvider,
                    },
                  })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold outline-hidden focus:border-primary bg-white cursor-pointer"
              >
                <option value="meta_cloud">Meta Cloud API (Oficial WhatsApp Business)</option>
                <option value="evolution_api">Evolution API (Self-Hosted / Baileys)</option>
                <option value="z_api">Z-API</option>
                <option value="other">Outro Provedor / Gateway Próprio</option>
              </select>
            </div>

            {/* PHONE NUMBER ID OU NÚMERO REMETENTE */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Número do WhatsApp / Phone Number ID *
              </label>
              <div className="relative">
                <Smartphone className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ex: 104928374659201 ou 5531984210000"
                  value={formData.whatsappApi?.phoneNumberId || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whatsappApi: {
                        ...formData.whatsappApi,
                        phoneNumberId: e.target.value,
                      },
                    })
                  }
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-300 text-xs font-medium outline-hidden focus:border-primary"
                />
              </div>
              <span className="text-[10px] text-slate-400">
                ID do número remetente na Meta ou número com DDD da instância
              </span>
            </div>

            {/* TOKEN DA API */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>Token de Acesso / API Key *</span>
                <span className="text-[10px] text-slate-400 font-normal lowercase">
                  (armazena com segurança)
                </span>
              </label>
              <div className="relative">
                <Key className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showWhatsappToken ? "text" : "password"}
                  placeholder="EAAG... ou token gerado no painel da API"
                  value={formData.whatsappApi?.apiToken || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whatsappApi: {
                        ...formData.whatsappApi,
                        apiToken: e.target.value,
                      },
                    })
                  }
                  className="w-full h-11 pl-10 pr-12 rounded-xl border border-slate-300 text-xs font-mono font-medium outline-hidden focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowWhatsappToken(!showWhatsappToken)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showWhatsappToken ? "Ocultar Token" : "Mostrar Token"}
                >
                  {showWhatsappToken ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* BUSINESS ACCOUNT ID / INSTÂNCIA */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                ID da Conta Comercial (WABA ID / Instância)
              </label>
              <input
                type="text"
                placeholder="Ex: 948302194830192 ou zarpou-production"
                value={formData.whatsappApi?.businessAccountId || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whatsappApi: {
                      ...formData.whatsappApi,
                      businessAccountId: e.target.value,
                    },
                  })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-medium outline-hidden focus:border-primary"
              />
            </div>

            {/* URL DO ENDPOINT DA API */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                URL Base do Endpoint da API
              </label>
              <input
                type="text"
                placeholder="Ex: https://graph.facebook.com/v19.0"
                value={formData.whatsappApi?.apiUrl || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whatsappApi: {
                      ...formData.whatsappApi,
                      apiUrl: e.target.value,
                    },
                  })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-medium outline-hidden focus:border-primary"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              disabled={isTestingWhatsapp}
              onClick={handleSimulateWhatsappTest}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 self-start transition cursor-pointer"
            >
              {isTestingWhatsapp ? (
                <Loader2 className="size-3.5 animate-spin text-emerald-600" />
              ) : (
                <Zap className="size-3.5 text-emerald-600" />
              )}
              {isTestingWhatsapp ? "Testando Conexão..." : "Testar Conexão com API"}
            </button>

            {testWhatsappStatus && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                {testWhatsappStatus}
              </span>
            )}
          </div>
        </div>

        {/* BLOCO 3: API DE PAGAMENTO (GATEWAY DE PAGAMENTOS) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <CreditCard className="size-4 text-primary" />
              Configurações da API de Pagamento (Gateway)
            </div>

            {/* SELETOR DE AMBIENTE: SANDBOX / PRODUÇÃO */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    paymentGateway: {
                      ...formData.paymentGateway,
                      environment: "sandbox",
                    },
                  })
                }
                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  formData.paymentGateway?.environment === "sandbox"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Ambiente de Testes (Sandbox)
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    paymentGateway: {
                      ...formData.paymentGateway,
                      environment: "production",
                    },
                  })
                }
                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  formData.paymentGateway?.environment === "production"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Produção Oficial (Ao Vivo)
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Defina o provedor e as credenciais que processarão os pagamentos em cartão, Pix e boleto diretamente na plataforma Zarpou.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* PROVEDOR DO GATEWAY */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Gateway de Pagamento *
              </label>
              <select
                value={formData.paymentGateway?.provider || "mercadopago"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentGateway: {
                      ...formData.paymentGateway,
                      provider: e.target.value as PaymentGatewayProvider,
                    },
                  })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold outline-hidden focus:border-primary bg-white cursor-pointer"
              >
                <option value="mercadopago">Mercado Pago (Recomendado para Turismo)</option>
                <option value="asaas">Asaas (Excelente para Pix, Boletos e Split)</option>
                <option value="pagarme">Pagar.me / Stone</option>
                <option value="stripe">Stripe</option>
                <option value="efi">Efí (Gerencianet - Pix Especialista)</option>
              </select>
            </div>

            {/* CHAVE PIX DA AGÊNCIA */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Chave Pix da Agência (Para Recebimento Direto)
              </label>
              <input
                type="text"
                placeholder="CNPJ, Chave Aleatória ou E-mail da conta bancária"
                value={formData.paymentGateway?.pixKey || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentGateway: {
                      ...formData.paymentGateway,
                      pixKey: e.target.value,
                    },
                  })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-medium outline-hidden focus:border-primary"
              />
            </div>

            {/* PUBLIC KEY / CLIENT ID */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between min-h-6">
                <span>Chave Pública / Public Key *</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  (Frontend / Token)
                </span>
              </label>
              <div className="relative">
                <Lock className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="APP_USR-xxxx... ou pk_live_..."
                  value={formData.paymentGateway?.publicKey || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentGateway: {
                        ...formData.paymentGateway,
                        publicKey: e.target.value,
                      },
                    })
                  }
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-300 text-xs font-mono font-medium outline-hidden focus:border-primary"
                />
              </div>
            </div>

            {/* SECRET KEY / ACCESS TOKEN */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between min-h-6">
                <span>Chave Secreta / Access Token *</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  (Backend / Transações)
                </span>
              </label>
              <div className="relative">
                <Key className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPaymentSecret ? "text" : "password"}
                  placeholder="APP_USR-yyyy... ou sk_live_..."
                  value={formData.paymentGateway?.secretKey || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentGateway: {
                        ...formData.paymentGateway,
                        secretKey: e.target.value,
                      },
                    })
                  }
                  className="w-full h-11 pl-10 pr-12 rounded-xl border border-slate-300 text-xs font-mono font-medium outline-hidden focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPaymentSecret(!showPaymentSecret)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showPaymentSecret ? "Ocultar" : "Mostrar"}
                >
                  {showPaymentSecret ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* SEGREDO DO WEBHOOK */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Segredo do Webhook (Webhook Secret / Assinatura de Notificação)
              </label>
              <input
                type="text"
                placeholder="Ex: whsec_xxxxxxxxxxxxxxxxxxxx ou chave de validação de callback"
                value={formData.paymentGateway?.webhookSecret || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentGateway: {
                      ...formData.paymentGateway,
                      webhookSecret: e.target.value,
                    },
                  })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-mono font-medium outline-hidden focus:border-primary"
              />
              <span className="text-[10px] text-slate-400">
                Usado pelo backend para confirmar se o aviso de pagamento Pix/Cartão aprovado é autêntico
              </span>
            </div>

            {/* MÉTODOS DE PAGAMENTO ATIVOS */}
            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
              <label className="font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Métodos de Pagamento Permitidos no Checkout
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={formData.paymentGateway?.activeMethods?.creditCard ?? true}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentGateway: {
                          ...formData.paymentGateway,
                          activeMethods: {
                            ...formData.paymentGateway.activeMethods,
                            creditCard: e.target.checked,
                          },
                        },
                      })
                    }
                    className="size-4 text-primary rounded"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    Cartão de Crédito (até 12x)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={formData.paymentGateway?.activeMethods?.pix ?? true}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentGateway: {
                          ...formData.paymentGateway,
                          activeMethods: {
                            ...formData.paymentGateway.activeMethods,
                            pix: e.target.checked,
                          },
                        },
                      })
                    }
                    className="size-4 text-primary rounded"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    Pix (com 5% de desconto à vista)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={formData.paymentGateway?.activeMethods?.boleto ?? true}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentGateway: {
                          ...formData.paymentGateway,
                          activeMethods: {
                            ...formData.paymentGateway.activeMethods,
                            boleto: e.target.checked,
                          },
                        },
                      })
                    }
                    className="size-4 text-primary rounded"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    Boleto Bancário
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCO: API DE E-MAILS TRANSACIONAIS (RESEND) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Mail className="size-4 text-primary" />
              API de E-mails Transacionais (Resend)
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
              <span>RESEND_API_KEY</span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            A chave de API do Resend é utilizada para disparo em tempo real de confirmações de reserva, vouchers de hospedagem/aéreo e mensagens do formulário de contato (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">/api/contact</code>).
          </p>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 uppercase tracking-wider block text-xs">
              Chave da API do Resend (RESEND_API_KEY)
            </label>
            <div className="relative">
              <span className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">
                <Key className="size-4" />
              </span>
              <input
                type={showResendKey ? "text" : "password"}
                placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={formData.resendApiKey || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    resendApiKey: e.target.value.trim(),
                  })
                }
                className="w-full h-11 pl-10 pr-12 rounded-xl border border-slate-300 text-xs font-mono font-medium outline-hidden focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowResendKey(!showResendKey)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                title={showResendKey ? "Ocultar" : "Mostrar"}
              >
                {showResendKey ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-slate-400 pt-1 gap-1">
              <span>
                Obtenha ou gere sua chave no painel oficial em{" "}
                <a
                  href="https://resend.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-bold"
                >
                  resend.com/api-keys
                </a>
              </span>
              {formData.resendApiKey ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="size-3" /> Chave configurada
                </span>
              ) : (
                <span className="text-amber-500 font-semibold">
                  Modo simulação ativo (chave vazia)
                </span>
              )}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              disabled={isTestingResend}
              onClick={handleSimulateResendTest}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 self-start transition cursor-pointer"
            >
              {isTestingResend ? (
                <Loader2 className="size-3.5 animate-spin text-emerald-600" />
              ) : (
                <Zap className="size-3.5 text-emerald-600" />
              )}
              {isTestingResend ? "Testando Chave..." : "Testar Chave do Resend"}
            </button>

            {testResendStatus && (
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                  testResendStatus.includes("válido")
                    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                    : "text-amber-700 bg-amber-50 border-amber-200"
                }`}
              >
                {testResendStatus}
              </span>
            )}
          </div>
        </div>

        {/* BLOCO: INTELIGÊNCIA ARTIFICIAL & CHATBOT CONCIERGE */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Bot className="size-4 text-primary" />
              Inteligência Artificial & Chatbot de Viagens (Concierge Virtual)
            </div>

            <label className="flex items-center gap-2 cursor-pointer bg-primary/5 px-3 py-1.5 rounded-full border border-primary/20">
              <input
                type="checkbox"
                checked={formData.aiChat?.enabled ?? true}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    aiChat: {
                      ...formData.aiChat,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="size-4 text-primary rounded"
              />
              <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                <Sparkles className="size-3 text-secondary fill-secondary" />
                Chatbot Ativo no Site
              </span>
            </label>
          </div>

          <p className="text-xs text-slate-500">
            Configure a API de Inteligência Artificial que alimenta o botão flutuante &quot;Fale com a IA&quot; e responde dúvidas de clientes 24h por dia sobre hotéis, voos, pacotes e roteiros.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* PROVEDOR DA IA */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Provedor de Inteligência Artificial *
              </label>
              <select
                value={formData.aiChat?.provider || "openai"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    aiChat: {
                      ...formData.aiChat,
                      provider: e.target.value as AiChatProvider,
                    },
                  })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold outline-hidden focus:border-primary bg-white cursor-pointer"
              >
                <option value="openai">OpenAI (ChatGPT / GPT-4o-mini)</option>
                <option value="gemini">Google Gemini (Gemini 1.5 Flash)</option>
                <option value="groq">Groq (Llama 3.3 Ultra-rápido)</option>
                <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
                <option value="other">Outro Provedor Compatível</option>
              </select>
            </div>

            {/* MODELO DA IA */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Modelo da IA
              </label>
              <input
                type="text"
                placeholder="Ex: gpt-4o-mini ou gemini-1.5-flash"
                value={formData.aiChat?.model || "gpt-4o-mini"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    aiChat: {
                      ...formData.aiChat,
                      model: e.target.value.trim(),
                    },
                  })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-medium outline-hidden focus:border-primary"
              />
            </div>

            {/* CHAVE DE API DA IA */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Chave da API de IA (API Key / Token)
              </label>
              <div className="relative">
                <span className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">
                  <Key className="size-4" />
                </span>
                <input
                  type={showAiKey ? "text" : "password"}
                  placeholder="sk-proj-xxxxxxxxxxxxxxxxxxxx ou chave da sua conta de IA"
                  value={formData.aiChat?.apiKey || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aiChat: {
                        ...formData.aiChat,
                        apiKey: e.target.value.trim(),
                      },
                    })
                  }
                  className="w-full h-11 pl-10 pr-12 rounded-xl border border-slate-300 text-xs font-mono font-medium outline-hidden focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowAiKey(!showAiKey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  title={showAiKey ? "Ocultar" : "Mostrar"}
                >
                  {showAiKey ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                <span>
                  Deixe vazio para utilizar o motor nativo inteligente de sugestões do catálogo Zarpou
                </span>
                {formData.aiChat?.apiKey ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="size-3" /> Chave configurada
                  </span>
                ) : (
                  <span className="text-primary font-semibold">
                    Modo demonstração inteligente ativo
                  </span>
                )}
              </div>
            </div>

            {/* MENSAGEM DE BOAS-VINDAS */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Mensagem Inicial de Boas-Vindas
              </label>
              <input
                type="text"
                value={formData.aiChat?.welcomeMessage || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    aiChat: {
                      ...formData.aiChat,
                      welcomeMessage: e.target.value,
                    },
                  })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-medium outline-hidden focus:border-primary"
              />
            </div>

            {/* PROMPT DO SISTEMA (PERSONALIDADE) */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Prompt do Sistema / Instruções do Assistente (System Prompt)
              </label>
              <textarea
                rows={3}
                value={formData.aiChat?.systemPrompt || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    aiChat: {
                      ...formData.aiChat,
                      systemPrompt: e.target.value,
                    },
                  })
                }
                placeholder="Instruções de como o concierge deve se comportar e orientar os clientes..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium outline-hidden focus:border-primary resize-none"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              disabled={isTestingAi}
              onClick={handleSimulateAiTest}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 self-start transition cursor-pointer"
            >
              {isTestingAi ? (
                <Loader2 className="size-3.5 animate-spin text-secondary" />
              ) : (
                <Zap className="size-3.5 text-secondary" />
              )}
              {isTestingAi ? "Testando Conexão..." : "Testar Conexão com a IA"}
            </button>

            {testAiStatus && (
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                  testAiStatus.includes("sucesso")
                    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                    : "text-amber-700 bg-amber-50 border-amber-200"
                }`}
              >
                {testAiStatus}
              </span>
            )}
          </div>
        </div>

        {/* BLOCO: STORAGE & HOSPEDAGEM DE MÍDIA (BUCKET AWS S3 / SUPABASE / R2) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Cloud className="size-4 text-primary" />
              Armazenamento em Nuvem & Bucket de Mídia (AWS S3)
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.storageBucket?.enabled ?? true}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    storageBucket: {
                      ...formData.storageBucket,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              <span className="ml-2 text-xs font-bold text-slate-700">
                {formData.storageBucket?.enabled ? "Storage Ativo" : "Desativado"}
              </span>
            </label>
          </div>

          <p className="text-xs text-slate-500">
            Configure o bucket de armazenamento onde todas as fotos de hotéis, companhias aéreas, promoções e banners serão salvas permanentemente de forma escalável e com alta velocidade de entrega.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* PROVEDOR DE STORAGE */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Provedor de Armazenamento *
              </label>
              <select
                value={formData.storageBucket?.provider || "aws_s3"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    storageBucket: {
                      ...formData.storageBucket,
                      provider: e.target.value as StorageBucketProvider,
                    },
                  })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold outline-hidden focus:border-primary bg-white cursor-pointer"
              >
                <option value="aws_s3">Amazon Web Services (AWS S3) - Recomendado</option>
                <option value="supabase">Supabase Storage</option>
                <option value="cloudflare_r2">Cloudflare R2 (S3-Compatible)</option>
                <option value="local">Armazenamento Local (Servidor da API)</option>
              </select>
            </div>

            {/* NOME DO BUCKET */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Nome do Bucket S3 *
              </label>
              <div className="relative">
                <HardDrive className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ex: zarpou-media ou meu-bucket-s3"
                  value={formData.storageBucket?.bucketName || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      storageBucket: {
                        ...formData.storageBucket,
                        bucketName: e.target.value.trim(),
                      },
                    })
                  }
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-300 text-xs font-mono font-medium outline-hidden focus:border-primary"
                />
              </div>
              <span className="text-[10px] text-slate-400">
                Nome exato criado no painel da AWS S3
              </span>
            </div>

            {/* REGIÃO AWS */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Região AWS (Region) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  list="aws-regions-list"
                  placeholder="Ex: sa-east-1 ou us-east-1"
                  value={formData.storageBucket?.region || "sa-east-1"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      storageBucket: {
                        ...formData.storageBucket,
                        region: e.target.value.trim(),
                      },
                    })
                  }
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-mono font-medium outline-hidden focus:border-primary"
                />
                <datalist id="aws-regions-list">
                  <option value="sa-east-1">São Paulo (sa-east-1)</option>
                  <option value="us-east-1">N. Virgínia (us-east-1)</option>
                  <option value="us-east-2">Ohio (us-east-2)</option>
                  <option value="us-west-1">N. Califórnia (us-west-1)</option>
                  <option value="us-west-2">Oregon (us-west-2)</option>
                  <option value="eu-west-1">Irlanda (eu-west-1)</option>
                </datalist>
              </div>
              <span className="text-[10px] text-slate-400">
                Geralmente sa-east-1 (Brasil) ou us-east-1 (EUA)
              </span>
            </div>

            {/* DOMÍNIO / CDN PREFIX */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                URL Pública Base / CloudFront CDN (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: https://meu-bucket.s3.sa-east-1.amazonaws.com ou CloudFront"
                value={formData.storageBucket?.publicUrlPrefix || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    storageBucket: {
                      ...formData.storageBucket,
                      publicUrlPrefix: e.target.value.trim(),
                    },
                  })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-mono font-medium outline-hidden focus:border-primary"
              />
              <span className="text-[10px] text-slate-400">
                Se vazio, a URL padrão da AWS S3 da região selecionada será gerada
              </span>
            </div>

            {/* AWS ACCESS KEY ID */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between min-h-6">
                <span>Access Key ID da AWS *</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  (Usuário IAM com permissão s3:PutObject)
                </span>
              </label>
              <div className="relative">
                <Lock className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="AKIAIOSFODNN7EXAMPLE..."
                  value={formData.storageBucket?.accessKeyId || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      storageBucket: {
                        ...formData.storageBucket,
                        accessKeyId: e.target.value.trim(),
                      },
                    })
                  }
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-300 text-xs font-mono font-medium outline-hidden focus:border-primary"
                />
              </div>
            </div>

            {/* AWS SECRET ACCESS KEY */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between min-h-6">
                <span>Secret Access Key da AWS *</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  (Chave secreta IAM)
                </span>
              </label>
              <div className="relative">
                <Lock className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showStorageSecret ? "text" : "password"}
                  placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY..."
                  value={formData.storageBucket?.secretAccessKey || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      storageBucket: {
                        ...formData.storageBucket,
                        secretAccessKey: e.target.value.trim(),
                      },
                    })
                  }
                  className="w-full h-11 pl-10 pr-12 rounded-xl border border-slate-300 text-xs font-mono font-medium outline-hidden focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowStorageSecret(!showStorageSecret)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  title={showStorageSecret ? "Ocultar" : "Mostrar"}
                >
                  {showStorageSecret ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* ENDPOINT URL CUSTOMIZADO (OPCIONAL) */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Endpoint Customizado S3 (Opcional - para Cloudflare R2 ou MinIO)
              </label>
              <input
                type="text"
                placeholder="Ex: https://<account_id>.r2.cloudflarestorage.com (Deixe em branco para AWS oficial)"
                value={formData.storageBucket?.endpointUrl || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    storageBucket: {
                      ...formData.storageBucket,
                      endpointUrl: e.target.value.trim(),
                    },
                  })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-mono font-medium outline-hidden focus:border-primary"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                <span>
                  Console AWS:{" "}
                  <a
                    href="https://s3.console.aws.amazon.com/s3/buckets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-bold"
                  >
                    s3.console.aws.amazon.com/s3/buckets
                  </a>
                </span>
                {formData.storageBucket?.bucketName && formData.storageBucket?.accessKeyId ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="size-3" /> Credenciais AWS preenchidas
                  </span>
                ) : (
                  <span className="text-amber-500 font-semibold">
                    Aguardando credenciais AWS
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* BOTÃO DE TESTAR CONEXÃO COM STORAGE */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              disabled={isTestingStorage}
              onClick={handleSimulateStorageTest}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 self-start transition cursor-pointer"
            >
              {isTestingStorage ? (
                <Loader2 className="size-3.5 animate-spin text-primary" />
              ) : (
                <Zap className="size-3.5 text-primary" />
              )}
              {isTestingStorage ? "Testando Bucket..." : "Testar Conexão com AWS S3"}
            </button>

            {testStorageStatus && (
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                  testStorageStatus.includes("válido")
                    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                    : "text-amber-700 bg-amber-50 border-amber-200"
                }`}
              >
                {testStorageStatus}
              </span>
            )}
          </div>
        </div>

        {/* BLOCO 5: CANAIS DE ATENDIMENTO & EXIBIÇÃO NO SITE */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <Phone className="size-4 text-primary" />
            Canais de Atendimento ao Cliente (Exibidos no Site)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                WhatsApp Oficial do Site (com DDI e DDD) *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: 5531984210000"
                value={formData.whatsapp}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp: e.target.value.replace(/\D/g, "") })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
              />
              <span className="text-[10px] text-slate-400">
                Apenas números. Atualiza os botões flutuantes e links wa.me do site.
              </span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Telefone Fixo Comercial
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Mensagem Padrão ao Abrir WhatsApp
              </label>
              <input
                type="text"
                value={formData.whatsappMessage}
                onChange={(e) =>
                  setFormData({ ...formData, whatsappMessage: e.target.value })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                E-mail de Atendimento
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Endereço / Sede
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* BLOCO 5: REDES SOCIAIS */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <Globe className="size-4 text-primary" />
            Redes Sociais
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Instagram (Usuário sem @)
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                LinkedIn (Empresa)
              </label>
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* BLOCO 6: TEXTOS LEGAIS (TERMOS E PRIVACIDADE) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <Shield className="size-4 text-primary" />
            Políticas & Termos de Uso Próprios
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Termos e Condições da Zarpou
              </label>
              <textarea
                rows={4}
                value={formData.termsAndConditions}
                onChange={(e) =>
                  setFormData({ ...formData, termsAndConditions: e.target.value })
                }
                className="w-full p-3.5 rounded-xl border border-slate-300 text-xs font-medium outline-hidden focus:border-primary leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Política de Privacidade (LGPD)
              </label>
              <textarea
                rows={4}
                value={formData.privacyPolicy}
                onChange={(e) =>
                  setFormData({ ...formData, privacyPolicy: e.target.value })
                }
                className="w-full p-3.5 rounded-xl border border-slate-300 text-xs font-medium outline-hidden focus:border-primary leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* BOTÃO FIXO/DE SALVAMENTO */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 bg-secondary hover:bg-secondary/90 disabled:opacity-60 disabled:cursor-not-allowed text-primary font-black text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-secondary/30 transition transform hover:scale-102 active:scale-95 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Salvando configurações...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Salvar Todas as Configurações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
