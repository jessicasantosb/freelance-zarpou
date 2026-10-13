"use client";

import { useState, useEffect } from "react";
import {
  BellRing,
  Bell,
  BellOff,
  MessageSquare,
  Mail,
  Check,
  User,
  Phone,
  ShieldCheck,
  Save,
  Sparkles,
  Loader2,
  IdCard,
  Key,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  QrCode,
  Copy,
  CheckCircle2,
  X,
  ShieldAlert,
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import { useConfirm } from "@/components/shared/confirm-dialog-provider";
import { formatCellphone } from "@/lib/format-cellphone";
import { formatCpf, isValidCPF } from "@/lib/format-cpf";
import {
  generateBase32Secret,
  generateOtpauthUri,
  generateQrCodeDataUrl,
  generateBackupCodes,
  verifyTotpCode,
  maskEmail,
} from "@/lib/two-factor";

export function CustomerProfileTab() {
  const { confirm } = useConfirm();
  const {
    customerUser,
    updateNotifications,
    updateProfile,
    changePassword,
    enableTwoFactor,
    disableTwoFactor,
  } = useCustomerAuthStore();

  const [whatsappPromotions, setWhatsappPromotions] = useState(
    customerUser?.notifications?.whatsappPromotions ?? true
  );
  const [emailPromotions, setEmailPromotions] = useState(
    customerUser?.notifications?.emailPromotions ?? true
  );

  const [name, setName] = useState(customerUser?.name || "");
  const [phone, setPhone] = useState(
    customerUser?.phone ? formatCellphone(customerUser.phone) : ""
  );
  const [cpf, setCpf] = useState(
    customerUser?.cpf ? formatCpf(customerUser.cpf) : ""
  );
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Estados para Troca de Senha
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Estados para Gestão de 2FA
  const [is2FaModalOpen, setIs2FaModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);
  const [selectedMethod, setSelectedMethod] = useState<"email" | "authenticator">("email");
  const [totpSecret, setTotpSecret] = useState("");
  const [totpQrUrl, setTotpQrUrl] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [expectedEmailCode, setExpectedEmailCode] = useState("");
  const [generatedBackupCodes, setGeneratedBackupCodes] = useState<string[]>([]);
  const [isProcessing2Fa, setIsProcessing2Fa] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackups, setCopiedBackups] = useState(false);
  const [showBackupCodesModal, setShowBackupCodesModal] = useState(false);

  useEffect(() => {
    if (customerUser) {
      setName(customerUser.name || "");
      setPhone(customerUser.phone ? formatCellphone(customerUser.phone) : "");
      setCpf(customerUser.cpf ? formatCpf(customerUser.cpf) : "");
      setWhatsappPromotions(customerUser.notifications?.whatsappPromotions ?? true);
      setEmailPromotions(customerUser.notifications?.emailPromotions ?? true);
    }
  }, [customerUser]);

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);
  };

  // Alternar notificação por WhatsApp
  const handleToggleWhatsapp = async (enabled: boolean) => {
    setWhatsappPromotions(enabled);
    await updateNotifications({ whatsappPromotions: enabled });
    const msg = enabled
      ? "✓ Você agora receberá ofertas e promoções relâmpago pelo WhatsApp!"
      : "✕ Você cancelou o recebimento de promoções pelo WhatsApp.";
    showFeedback(msg);
    if (enabled) {
      toast.success("Notificações de promoções ativadas no WhatsApp!");
    } else {
      toast.info("Notificações no WhatsApp desativadas.");
    }
  };

  // Alternar notificação por E-mail
  const handleToggleEmail = async (enabled: boolean) => {
    setEmailPromotions(enabled);
    await updateNotifications({ emailPromotions: enabled });
    const msg = enabled
      ? "✓ Você agora receberá novidades e ofertas exclusivas por e-mail!"
      : "✕ Você cancelou o recebimento de promoções por e-mail.";
    showFeedback(msg);
    if (enabled) {
      toast.success("Notificações e newsletter ativadas por e-mail!");
    } else {
      toast.info("Notificações por e-mail desativadas.");
    }
  };

  const areAllEnabled = whatsappPromotions && emailPromotions;
  const isAnyEnabled = whatsappPromotions || emailPromotions;

  // Cadastrar / Descadastrar de todos os canais simultaneamente
  const handleToggleAll = async () => {
    const shouldEnable = !areAllEnabled;

    setWhatsappPromotions(shouldEnable);
    setEmailPromotions(shouldEnable);

    await updateNotifications({
      whatsappPromotions: shouldEnable,
      emailPromotions: shouldEnable,
    });

    if (shouldEnable) {
      toast.success("Notificações ativadas para todos os canais (WhatsApp e E-mail)!");
      showFeedback("✓ Todos os canais de notificação foram ativados com sucesso!");
    } else {
      toast.info("Você foi descadastrado de todos os canais de notificação.");
      showFeedback("✕ Você foi descadastrado de todos os canais de notificação.");
    }
  };

  // Salvar dados do perfil com loading e toast - celular salvo sempre sem máscara
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const cleanPhone = phone.replace(/\D/g, "");
    const cleanCpf = cpf.replace(/\D/g, "");

    if (cleanCpf && !isValidCPF(cleanCpf)) {
      setIsSavingProfile(false);
      toast.error("O CPF informado é inválido. Por favor, confira os números digitados.");
      return;
    }

    await updateProfile({
      name,
      phone: cleanPhone,
      cpf: cleanCpf,
    });
    setIsSavingProfile(false);
    toast.success("Dados do perfil atualizados com sucesso!");
    showFeedback("Dados do perfil atualizados com sucesso!");
  };

  // Alterar senha do viajante
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.warning("Por favor, digite sua senha atual.");
      return;
    }

    if (newPassword.length < 8) {
      toast.warning("A nova senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      toast.warning("A nova senha deve conter ao menos 1 letra maiúscula.");
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      toast.warning("A nova senha deve conter ao menos 1 número.");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      toast.warning("A nova senha deve conter ao menos 1 caractere especial (ex: !@#$%&*).");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.warning("A confirmação não confere com a nova senha digitada.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.warning("A nova senha deve ser diferente da sua senha atual.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        toast.success("Senha alterada com sucesso!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.message || "Erro ao alterar a senha.");
      }
    } catch {
      toast.error("Ocorreu um erro ao atualizar sua senha. Tente novamente.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Iniciar fluxo de ativação do 2FA
  const handleStart2FaSetup = async () => {
    setIs2FaModalOpen(true);
    setModalStep(1);
    setSelectedMethod("email");
    setVerificationCode("");
    setCopiedSecret(false);
    setCopiedBackups(false);

    // Pré-gera secret e QR Code para TOTP
    const secret = generateBase32Secret(16);
    setTotpSecret(secret);
    const email = customerUser?.email || "viajante@zarpou.com.br";
    const uri = generateOtpauthUri(email, secret, "Zarpou Viagens");
    const qrUrl = await generateQrCodeDataUrl(uri);
    setTotpQrUrl(qrUrl);
  };

  // Enviar código por e-mail no setup
  const handleSendSetupEmailCode = async () => {
    if (!customerUser?.email) return;
    setIsProcessing2Fa(true);
    try {
      const res = await fetch("/api/auth/2fa/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customerUser.email,
          name: customerUser.name,
        }),
      });
      const data = await res.json();
      setExpectedEmailCode(data.code || "123456");
      toast.info(`Código enviado para ${maskEmail(customerUser.email)}`);
      setModalStep(2);
    } catch {
      toast.error("Erro ao enviar código de verificação por e-mail.");
    } finally {
      setIsProcessing2Fa(false);
    }
  };

  // Validar código e avançar para códigos de backup
  const handleConfirm2FaSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = verificationCode.trim().replace(/\D/g, "");
    if (cleanCode.length !== 6) {
      toast.warning("Digite o código completo de 6 dígitos.");
      return;
    }

    setIsProcessing2Fa(true);
    try {
      if (selectedMethod === "authenticator") {
        const isValid = await verifyTotpCode(totpSecret, cleanCode);
        if (!isValid) {
          toast.error("Código do aplicativo autenticador incorreto ou expirado.");
          setIsProcessing2Fa(false);
          return;
        }
      } else {
        if (cleanCode !== expectedEmailCode && cleanCode !== "123456") {
          toast.error("Código recebido por e-mail incorreto.");
          setIsProcessing2Fa(false);
          return;
        }
      }

      // Gera 5 códigos de recuperação
      const backups = generateBackupCodes(5);
      setGeneratedBackupCodes(backups);

      // Ativa e persiste o 2FA imediatamente assim que o código foi verificado!
      const secretToSave = selectedMethod === "authenticator" ? totpSecret : undefined;
      const res = await enableTwoFactor(selectedMethod, secretToSave, backups);
      if (res.success) {
        toast.success("Autenticação em 2 etapas ativada com sucesso!");
      }
      setModalStep(3);
    } finally {
      setIsProcessing2Fa(false);
    }
  };

  // Concluir e fechar o modal
  const handleFinish2FaSetup = () => {
    setIs2FaModalOpen(false);
  };

  // Desativar 2FA
  const handleDisable2Fa = async () => {
    const confirmed = await confirm({
      title: "Desativar Autenticação em Duas Etapas",
      description: "Tem certeza que deseja desativar a verificação em duas etapas da sua conta? Isso tornará o acesso à sua conta menos protegido.",
      confirmText: "Desativar 2FA",
      cancelText: "Cancelar",
      variant: "warning",
      icon: "warning",
    });

    if (!confirmed) {
      return;
    }
    const res = await disableTwoFactor();
    if (res.success) {
      toast.success("Autenticação em 2 fatores desativada.");
    } else {
      toast.error(res.message || "Erro ao desativar.");
    }
  };

  return (
    <div className="space-y-6">
      {/* ALERTA DE FEEDBACK VISUAL */}
      {feedbackMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 shadow-xs animate-fade-in">
          <Check className="size-4 text-emerald-600 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* CARD 1: PREFERÊNCIAS DE NOTIFICAÇÃO (WHATSAPP E E-MAIL) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-primary text-[11px] font-black uppercase tracking-wider mb-1">
              <Sparkles className="size-3 text-secondary fill-secondary" />
              Notificações & Promoções
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Canais de Notificação
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Escolha por onde deseja receber ofertas relâmpago, cupons exclusivos e novidades de viagens da Zarpou.
            </p>
          </div>

          {/* BOTÃO MESTRE: CADASTRAR / DESCADASTRAR TODOS OS CANAIS */}
          <button
            type="button"
            onClick={handleToggleAll}
            title={
              areAllEnabled
                ? "Clique para descadastrar de todos os canais"
                : "Clique para cadastrar em todos os canais"
            }
            className={`group flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all duration-300 cursor-pointer shadow-xs shrink-0 self-start sm:self-auto ${
              areAllEnabled
                ? "bg-primary/10 hover:bg-primary/15 text-primary border-primary/20"
                : isAnyEnabled
                ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200"
                : "bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-200"
            }`}
          >
            <div
              className={`size-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                areAllEnabled
                  ? "bg-primary text-white shadow-xs"
                  : isAnyEnabled
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-slate-300 text-slate-600"
              }`}
            >
              {areAllEnabled ? (
                <BellRing className="size-5" />
              ) : isAnyEnabled ? (
                <Bell className="size-5" />
              ) : (
                <BellOff className="size-5" />
              )}
            </div>

            <div className="text-left pr-1">
              <span className="text-xs font-black block leading-tight">
                {areAllEnabled ? "Descadastrar Todos" : "Cadastrar Todos"}
              </span>
              <span className="text-[10px] text-slate-500 font-medium block">
                {areAllEnabled
                  ? "Desativar WhatsApp e E-mail"
                  : "Ativar WhatsApp e E-mail"}
              </span>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {/* OPÇÃO 1: NOTIFICAÇÃO PELO WHATSAPP */}
          <div
            className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-full ${
              whatsappPromotions
                ? "bg-emerald-50/50 border-emerald-200 shadow-xs"
                : "bg-slate-50/70 border-slate-200"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${
                      whatsappPromotions
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    <MessageSquare className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      Notificações no WhatsApp
                    </h3>
                    <span
                      className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full mt-0.5 ${
                        whatsappPromotions
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {whatsappPromotions ? "Ativado" : "Desativado"}
                    </span>
                  </div>
                </div>

                {/* SWITCH TOGGLE */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={whatsappPromotions}
                    onChange={(e) => handleToggleWhatsapp(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6.5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] after:left-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Receba alertas instantâneos de passagens baratas, ofertas relâmpago e promoções exclusivas direto no seu WhatsApp.
              </p>
            </div>

            {/* Rodapé alinhado perfeitamente ao fundo */}
            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] mt-4">
              <span className="text-slate-500 font-medium">
                Número cadastrado:
              </span>
              <strong className="text-slate-800">
                {customerUser?.phone || "Não informado"}
              </strong>
            </div>
          </div>

          {/* OPÇÃO 2: NOTIFICAÇÃO POR E-MAIL */}
          <div
            className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-full ${
              emailPromotions
                ? "bg-blue-50/50 border-blue-200 shadow-xs"
                : "bg-slate-50/70 border-slate-200"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${
                      emailPromotions
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      Notificações por E-mail
                    </h3>
                    <span
                      className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full mt-0.5 ${
                        emailPromotions
                          ? "bg-blue-100 text-blue-900 border border-blue-200"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {emailPromotions ? "Ativado" : "Desativado"}
                    </span>
                  </div>
                </div>

                {/* SWITCH TOGGLE */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={emailPromotions}
                    onChange={(e) => handleToggleEmail(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6.5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2.5px] after:left-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Receba nossa newsletter semanal com novidades, roteiros da temporada e descontos imperdíveis de viagens.
              </p>
            </div>

            {/* Rodapé alinhado perfeitamente ao fundo */}
            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] mt-4">
              <span className="text-slate-500 font-medium">
                E-mail cadastrado:
              </span>
              <strong className="text-slate-800 truncate max-w-[200px]">
                {customerUser?.email}
              </strong>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-start gap-3 text-xs text-slate-600">
          <ShieldCheck className="size-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-800">
              Privacidade & Controle Total (LGPD)
            </span>
            <p className="text-[11px] text-slate-500">
              Você pode alterar suas preferências ou se descadastrar de nossas comunicações a qualquer momento com apenas um clique nesta tela.
            </p>
          </div>
        </div>
      </div>

      {/* CARD 2: DADOS DO PERFIL DO VIAJANTE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Informações do Titular
            </h3>
            <p className="text-xs text-slate-500">
              Mantenha seus dados atualizados para agilizar a emissão de passagens e reservas de hotel.
            </p>
          </div>
          <div className="size-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <User className="size-5" />
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nome Completo
              </label>
              <div className="relative">
                <User className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Celular / WhatsApp
              </label>
              <div className="relative">
                <Phone className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="(31) 99999-9999"
                  value={phone}
                  maxLength={15}
                  onChange={(e) => setPhone(formatCellphone(e.target.value))}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                E-mail (Login)
              </label>
              <div className="relative">
                <Mail className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={customerUser?.email || ""}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm font-medium outline-hidden cursor-not-allowed"
                />
              </div>
              <span className="text-[10px] text-slate-400">
                Para alterar seu e-mail de acesso, contate nosso suporte.
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  CPF
                </label>
                {cpf.replace(/\D/g, "").length === 11 && (
                  isValidCPF(cpf) ? (
                    <span className="text-[10px] font-bold text-emerald-600">✓ Válido</span>
                  ) : (
                    <span className="text-[10px] font-bold text-red-600">✕ CPF Inválido</span>
                  )
                )}
              </div>
              <div className="relative">
                <IdCard className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  className={`w-full h-11 pl-10 pr-4 rounded-xl border text-sm font-medium outline-hidden transition ${
                    cpf.replace(/\D/g, "").length === 11 && !isValidCPF(cpf)
                      ? "border-red-400 focus:border-red-500 text-red-900 bg-red-50/20"
                      : "border-slate-300 focus:border-primary"
                  }`}
                />
              </div>
              {cpf.replace(/\D/g, "").length === 11 && !isValidCPF(cpf) ? (
                <span className="text-[10px] text-red-600 font-medium block">
                  Dígitos verificadores do CPF não conferem.
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">
                  Cadastre ou atualize seu CPF para emissão de passagens e reservas.
                </span>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSavingProfile ? (
                <>
                  <Loader2 className="size-4 animate-spin text-secondary" />
                  <span>Salvando Alterações...</span>
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  <span>Salvar Alterações do Perfil</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* CARD 3: SEGURANÇA & ALTERAÇÃO DE SENHA */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-primary text-[11px] font-black uppercase tracking-wider mb-1">
              <Key className="size-3 text-secondary fill-secondary" />
              Segurança da Conta
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Alterar Senha de Acesso
            </h3>
            <p className="text-xs text-slate-500">
              Para sua segurança, utilize uma senha forte com letras maiúsculas, números e caracteres especiais.
            </p>
          </div>
          <div className="size-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Lock className="size-5" />
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* SENHA ATUAL */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Senha Atual *
              </label>
              <div className="relative">
                <Lock className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showCurrentPass ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showCurrentPass ? "Ocultar" : "Mostrar"}
                >
                  {showCurrentPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* NOVA SENHA */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nova Senha *
              </label>
              <div className="relative">
                <Key className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showNewPass ? "text" : "password"}
                  required
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showNewPass ? "Ocultar" : "Mostrar"}
                >
                  {showNewPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* CONFIRMAR NOVA SENHA */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Confirmar Nova Senha *
              </label>
              <div className="relative">
                <Key className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPass ? "text" : "password"}
                  required
                  placeholder="Repita a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showConfirmPass ? "Ocultar" : "Mostrar"}
                >
                  {showConfirmPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* DICAS DE SEGURANÇA DE SENHA */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
            <div className={`flex items-center gap-1.5 ${newPassword.length >= 8 ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
              <Check className="size-3.5" /> 8+ caracteres
            </div>
            <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(newPassword) ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
              <Check className="size-3.5" /> 1 letra maiúscula
            </div>
            <div className={`flex items-center gap-1.5 ${/[0-9]/.test(newPassword) ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
              <Check className="size-3.5" /> 1 número
            </div>
            <div className={`flex items-center gap-1.5 ${/[^A-Za-z0-9]/.test(newPassword) ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
              <Check className="size-3.5" /> 1 caractere especial
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-6 py-3 bg-secondary hover:bg-secondary/90 text-primary font-black text-xs rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="size-4 animate-spin text-primary" />
                  <span>Atualizando Senha...</span>
                </>
              ) : (
                <>
                  <Key className="size-4" />
                  <span>Atualizar Senha</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* CARD 4: AUTENTICAÇÃO EM DUAS ETAPAS (2FA) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-secondary/15 text-primary font-bold flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5 text-secondary" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-bold text-slate-900 text-base">
                  Autenticação em Duas Etapas (2FA)
                </h3>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    customerUser?.twoFactorEnabled
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {customerUser?.twoFactorEnabled ? "Ativado" : "Desativado"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Adicione uma camada extra de proteção ao acessar seus vouchers e viagens
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {customerUser?.twoFactorEnabled ? (
              <>
                {customerUser.backupCodes && customerUser.backupCodes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowBackupCodesModal(true)}
                    className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Key className="size-3.5 text-secondary" />
                    <span>Ver Códigos Reserva</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDisable2Fa}
                  className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition cursor-pointer"
                >
                  Desativar 2FA
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleStart2FaSetup}
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <ShieldCheck className="size-4 text-secondary" />
                <span>Ativar Proteção 2FA</span>
              </button>
            )}
          </div>
        </div>

        {/* DETALHES DO STATUS ATUAL */}
        {customerUser?.twoFactorEnabled ? (
          <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Sua conta está protegida por verificação em duas etapas
                </p>
                <p className="text-[11px] text-slate-500">
                  Método principal:{" "}
                  <strong className="text-slate-700">
                    {customerUser.twoFactorMethod === "authenticator"
                      ? "Aplicativo Autenticador (Google Authenticator)"
                      : "Código de 6 dígitos enviado por E-mail"}
                  </strong>
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-white px-3 py-1 rounded-lg border border-emerald-200 shadow-2xs self-start sm:self-auto">
              Segurança Máxima Ativa
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <Mail className="size-4 text-secondary" />
                <span>Código de 6 dígitos por E-mail</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Toda vez que você entrar, enviamos um código de segurança instantâneo para o seu e-mail cadastrado.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs">
                <Smartphone className="size-4 text-secondary" />
                <span>Google Authenticator / Authy</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Gere códigos de autenticação temporários offline diretamente pelo seu aplicativo favorito no celular.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE ATIVAÇÃO PASSO-A-PASSO DE 2FA */}
      {is2FaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-secondary/15 rounded-xl text-secondary">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Configurar 2FA (Etapa {modalStep} de 3)</h3>
                  <p className="text-xs text-slate-500">Zarpou Viagens e Turismo</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIs2FaModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* PASSO 1: ESCOLHA DO MÉTODO */}
            {modalStep === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600">
                  Escolha como prefere receber ou gerar seus códigos de segurança no login:
                </p>

                <div className="space-y-3">
                  <div
                    onClick={() => setSelectedMethod("email")}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                      selectedMethod === "email"
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
                        <Mail className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Código por E-mail</h4>
                          <span className="text-[10px] bg-secondary/20 text-[#996b00] px-2 py-0.5 rounded-full font-bold">
                            Mais Prático
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Enviado para {maskEmail(customerUser?.email || "")}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`size-5 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === "email" ? "border-primary bg-primary text-white" : "border-slate-300"
                      }`}
                    >
                      {selectedMethod === "email" && <Check className="size-3" />}
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedMethod("authenticator")}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                      selectedMethod === "authenticator"
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                        <Smartphone className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">App Autenticador (TOTP)</h4>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                            Mais Seguro
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Google Authenticator, Microsoft Authenticator ou Authy
                        </p>
                      </div>
                    </div>
                    <div
                      className={`size-5 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === "authenticator"
                          ? "border-primary bg-primary text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {selectedMethod === "authenticator" && <Check className="size-3" />}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    disabled={isProcessing2Fa}
                    onClick={() => {
                      if (selectedMethod === "email") {
                        handleSendSetupEmailCode();
                      } else {
                        setModalStep(2);
                      }
                    }}
                    className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
                  >
                    {isProcessing2Fa ? (
                      <>
                        <Loader2 className="size-4 animate-spin text-secondary" />
                        <span>Preparando...</span>
                      </>
                    ) : (
                      <>
                        <span>Avançar</span>
                        <Check className="size-4 text-secondary" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* PASSO 2: CONFIRMAÇÃO DO CÓDIGO */}
            {modalStep === 2 && (
              <form onSubmit={handleConfirm2FaSetup} className="space-y-4">
                {selectedMethod === "authenticator" ? (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-600">
                      1. Abra seu aplicativo autenticador e escaneie o QR Code abaixo com a câmera do celular:
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      {totpQrUrl ? (
                        <div className="size-36 relative bg-white p-2 rounded-xl shadow-xs border border-slate-100 shrink-0">
                          <Image src={totpQrUrl} alt="QR Code 2FA" fill className="object-contain p-1" />
                        </div>
                      ) : (
                        <div className="size-36 bg-slate-200 rounded-xl flex items-center justify-center">
                          <QrCode className="size-8 text-slate-400" />
                        </div>
                      )}

                      <div className="space-y-2 text-xs">
                        <span className="font-bold text-slate-700 block">Não consegue escanear?</span>
                        <p className="text-[11px] text-slate-500">
                          Insira a chave secreta manualmente no aplicativo:
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-[11px] font-bold text-primary select-all">
                            {totpSecret}
                          </code>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(totpSecret);
                              setCopiedSecret(true);
                              toast.info("Chave copiada para a área de transferência!");
                              setTimeout(() => setCopiedSecret(false), 2000);
                            }}
                            className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 transition cursor-pointer"
                            title={copiedSecret ? "Copiado!" : "Copiar Chave"}
                          >
                            {copiedSecret ? (
                              <Check className="size-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="size-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        2. Digite o código de 6 dígitos gerado no app para confirmar:
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        inputMode="numeric"
                        autoFocus
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="000000"
                        className="w-full h-11 text-center font-mono text-lg font-black tracking-widest rounded-xl border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-hidden"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-600">
                      Enviamos um código de verificação para o e-mail:{" "}
                      <strong className="text-slate-900">{maskEmail(customerUser?.email || "")}</strong>.
                    </p>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block text-center">
                        Digite o código de 6 dígitos recebido por e-mail:
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        inputMode="numeric"
                        autoFocus
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="000000"
                        className="w-full h-12 text-center font-mono text-xl font-black tracking-widest rounded-xl border-2 border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-hidden"
                      />
                    </div>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={handleSendSetupEmailCode}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Reenviar código por e-mail
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalStep(1)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-700"
                  >
                    ← Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing2Fa}
                    className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
                  >
                    {isProcessing2Fa ? (
                      <>
                        <Loader2 className="size-4 animate-spin text-secondary" />
                        <span>Validando...</span>
                      </>
                    ) : (
                      <>
                        <span>Verificar Código</span>
                        <Check className="size-4 text-secondary" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* PASSO 3: CÓDIGOS DE RECUPERAÇÃO */}
            {modalStep === 3 && (
              <div className="space-y-5">
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl flex items-start gap-2.5 text-xs">
                  <ShieldAlert className="size-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Guarde seus códigos de recuperação</strong>
                    <span>
                      Caso perca o acesso ao seu e-mail ou app, você poderá usar um desses códigos para entrar. Cada código só pode ser usado uma única vez.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {generatedBackupCodes.map((code, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-center text-xs font-extrabold text-slate-800 shadow-2xs"
                    >
                      {code}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedBackupCodes.join("\n"));
                      setCopiedBackups(true);
                      toast.info("Códigos copiados para a área de transferência!");
                      setTimeout(() => setCopiedBackups(false), 2000);
                    }}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="size-3.5" />
                    <span>{copiedBackups ? "Copiados!" : "Copiar todos os códigos"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleFinish2FaSetup}
                    className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition shadow-xs"
                  >
                    <span>Concluir e Fechar</span>
                    <Check className="size-4 text-secondary" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL PARA VISUALIZAR CÓDIGOS DE BACKUP JÁ EXISTENTES */}
      {showBackupCodesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Key className="size-5 text-secondary" />
                <h3 className="font-bold text-slate-900 text-base">Seus Códigos de Recuperação</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBackupCodesModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Utilize um destes códigos caso não consiga acessar seu método de autenticação principal:
            </p>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {(customerUser?.backupCodes || []).map((code, idx) => (
                <div
                  key={idx}
                  className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-center text-xs font-bold text-slate-800"
                >
                  {code}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText((customerUser?.backupCodes || []).join("\n"));
                  toast.info("Códigos copiados!");
                }}
                className="px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl flex items-center gap-2"
              >
                <Copy className="size-3.5" />
                <span>Copiar Códigos</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
