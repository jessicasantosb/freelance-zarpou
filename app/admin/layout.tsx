"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Sparkles,
  Tag,
  Hotel,
  Plane,
  Compass,
  CalendarCheck,
  Settings,
  LogOut,
  Globe,
  Menu,
  X,
  Users,
  ShieldCheck,
  ShieldAlert,
  Key,
  Lock,
  Eye,
  EyeOff,
  Check,
  Loader2,
  Smartphone,
  Mail,
  Copy,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuthStore } from "@/stores/auth-store";
import { LoadingScreen } from "@/components/shared/loading-screen";
import {
  generateBase32Secret,
  generateOtpauthUri,
  generateQrCodeDataUrl,
  generateBackupCodes,
  verifyTotpCode,
} from "@/lib/two-factor";

const ADMIN_MENU_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "gestor", "atendente"],
  },
  {
    id: "hero",
    label: "Hero & Banner Principal",
    href: "/admin/hero",
    icon: Sparkles,
    roles: ["admin", "gestor"],
  },
  {
    id: "promocoes",
    label: "Promoções & Banners",
    href: "/admin/promocoes",
    icon: Tag,
    roles: ["admin", "gestor"],
  },
  {
    id: "hospedagens",
    label: "Hospede-se com Estilo",
    href: "/admin/hospedagens",
    icon: Hotel,
    roles: ["admin", "gestor", "atendente"],
  },
  {
    id: "passagens",
    label: "Passagens para o Exterior",
    href: "/admin/passagens",
    icon: Plane,
    roles: ["admin", "gestor", "atendente"],
  },
  {
    id: "destinos",
    label: "Destinos",
    href: "/admin/destinos",
    icon: Compass,
    roles: ["admin", "gestor", "atendente"],
  },
  {
    id: "reservas",
    label: "Reservas & Pedidos",
    href: "/admin/reservas",
    icon: CalendarCheck,
    roles: ["admin", "gestor", "atendente"],
  },
  {
    id: "usuarios",
    label: "Clientes",
    href: "/admin/usuarios",
    icon: Users,
    roles: ["admin", "gestor", "atendente"],
  },
  {
    id: "administradores",
    label: "Administradores",
    href: "/admin/administradores",
    icon: ShieldCheck,
    roles: ["admin"],
  },
  {
    id: "configuracoes",
    label: "Configurações Gerais",
    href: "/admin/configuracoes",
    icon: Settings,
    roles: ["admin"],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    isAuthenticated,
    user,
    logout,
    changePassword,
    enableTwoFactor,
    disableTwoFactor,
  } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Estados do Modal de Segurança (Senha e 2FA)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [securityTab, setSecurityTab] = useState<"password" | "2fa">("password");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Estados de 2FA Admin
  const [admin2FaMethod, setAdmin2FaMethod] = useState<"email" | "authenticator">("email");
  const [adminTotpSecret, setAdminTotpSecret] = useState("");
  const [adminTotpQrUrl, setAdminTotpQrUrl] = useState("");
  const [adminBackupCodes, setAdminBackupCodes] = useState<string[]>([]);
  const [copiedAdminSecret, setCopiedAdminSecret] = useState(false);
  const [copiedAdminBackups, setCopiedAdminBackups] = useState(false);
  const [adminOtpCode, setAdminOtpCode] = useState("");
  const [isVerifyingTotp, setIsVerifyingTotp] = useState(false);
  const [adminEmailOtpCode, setAdminEmailOtpCode] = useState("");
  const [adminEmailExpectedCode, setAdminEmailExpectedCode] = useState("");
  const [adminEmailSent, setAdminEmailSent] = useState(false);
  const [adminEmailCooldown, setAdminEmailCooldown] = useState(0);
  const [isSendingEmailCode, setIsSendingEmailCode] = useState(false);
  const [isSaving2Fa, setIsSaving2Fa] = useState(false);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  const userRole = (user?.role || "admin").toLowerCase();
  const userAllowedScreens = user?.allowedScreens || user?.allowed_screens;
  const isSuperAdmin = userRole === "admin";
  const isLoginPage = pathname === "/admin/login";

  const checkScreenAccess = useCallback(
    (screenId: string): boolean => {
      if (isSuperAdmin) return true;
      if (userAllowedScreens && Array.isArray(userAllowedScreens) && userAllowedScreens.length > 0) {
        return userAllowedScreens.includes(screenId) || userAllowedScreens.includes("*");
      }
      const item = ADMIN_MENU_ITEMS.find((m) => m.id === screenId);
      return item ? item.roles.includes(userRole) : false;
    },
    [isSuperAdmin, userAllowedScreens, userRole]
  );

  const filteredMenuItems = useMemo(() => {
    return ADMIN_MENU_ITEMS.filter((item) => checkScreenAccess(item.id));
  }, [checkScreenAccess]);

  const defaultAllowedHref = useMemo(() => {
    const firstAllowed = filteredMenuItems[0];
    return firstAllowed ? firstAllowed.href : "/admin/dashboard";
  }, [filteredMenuItems]);

  const isCurrentRouteAllowed = useMemo(() => {
    if (isLoginPage) return true;
    if (!isAuthenticated) return false;

    // Se estiver na raiz /admin ou /admin/, redirecionar para a primeira tela com permissão
    if (pathname === "/admin" || pathname === "/admin/") {
      return false;
    }

    const currentItem = ADMIN_MENU_ITEMS.find((item) => pathname.startsWith(item.href));
    if (currentItem) {
      return checkScreenAccess(currentItem.id);
    }

    // Rota auxiliar de produtos / ajuste de catálogo (requer hospedagens ou passagens)
    if (pathname.startsWith("/admin/produtos")) {
      return checkScreenAccess("hospedagens") || checkScreenAccess("passagens");
    }

    return isSuperAdmin;
  }, [isLoginPage, isAuthenticated, pathname, checkScreenAccess, isSuperAdmin]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Quando o pathname mudar (rota concluída), desativa o overlay de carregamento
  useEffect(() => {
    setIsPageTransitioning(false);
  }, [pathname]);

  const handleNavClick = (href: string) => {
    if (href !== pathname) {
      setIsPageTransitioning(true);
    }
  };

  useEffect(() => {
    if (mounted && !isAuthenticated && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [mounted, isAuthenticated, isLoginPage, router]);

  useEffect(() => {
    if (mounted && isAuthenticated && !isLoginPage && !isCurrentRouteAllowed) {
      if (pathname !== "/admin" && pathname !== "/admin/") {
        toast.warning("Você não possui permissão para acessar esta tela.");
      }
      router.replace(defaultAllowedHref);
    }
  }, [mounted, isAuthenticated, isLoginPage, isCurrentRouteAllowed, pathname, defaultAllowedHref, router]);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.warning("Por favor, informe sua senha atual.");
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

    setIsSubmittingPassword(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        toast.success("Sua senha administrativa foi alterada com sucesso!");
        setIsPasswordModalOpen(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.message || "Erro ao alterar a senha.");
      }
    } catch {
      toast.error("Ocorreu um erro ao atualizar a senha. Tente novamente.");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  useEffect(() => {
    if (isPasswordModalOpen && user) {
      setAdmin2FaMethod(
        user.twoFactorMethod === "authenticator" ? "authenticator" : "email"
      );
      const secret = user.twoFactorSecret || generateBase32Secret(16);
      setAdminTotpSecret(secret);
      const backups =
        user.backupCodes && user.backupCodes.length > 0 ? user.backupCodes : generateBackupCodes(5);
      setAdminBackupCodes(backups);
      setAdminOtpCode("");

      const email = user.email || "admin@zarpou.com.br";
      const uri = generateOtpauthUri(email, secret, "Zarpou Admin");
      generateQrCodeDataUrl(uri).then(setAdminTotpQrUrl);
    }
  }, [isPasswordModalOpen, user]);

  const handleGenerateNewSecret = () => {
    const newSecret = generateBase32Secret(16);
    setAdminTotpSecret(newSecret);
    const email = user?.email || "admin@zarpou.com.br";
    const uri = generateOtpauthUri(email, newSecret, "Zarpou Admin");
    generateQrCodeDataUrl(uri).then(setAdminTotpQrUrl);
    setAdminOtpCode("");
    toast.info("Novo QR Code gerado! Escaneie-o no aplicativo.");
  };

  const handleVerifyAndEnableAuthenticator = async () => {
    const cleanCode = adminOtpCode.trim().replace(/\D/g, "");
    if (cleanCode.length !== 6) {
      toast.warning("Por favor, digite o código de 6 dígitos gerado pelo seu app autenticador.");
      return;
    }

    setIsVerifyingTotp(true);
    try {
      const isValid = await verifyTotpCode(adminTotpSecret, cleanCode);
      if (!isValid) {
        toast.error("Código incorreto ou expirado. Verifique os 6 dígitos gerados no seu aplicativo autenticador e tente novamente.");
        return;
      }

      const res = await enableTwoFactor("authenticator", adminTotpSecret, adminBackupCodes);
      if (res.success) {
        toast.success("Autenticação em 2 etapas com App Autenticador ativada com sucesso!");
        setAdminOtpCode("");
      } else {
        toast.error(res.message || "Erro ao ativar 2FA.");
      }
    } catch (err) {
      console.error("Erro ao validar OTP:", err);
      toast.error("Erro ao validar código. Tente novamente.");
    } finally {
      setIsVerifyingTotp(false);
    }
  };

  useEffect(() => {
    if (adminEmailCooldown <= 0) return;
    const interval = setInterval(() => {
      setAdminEmailCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [adminEmailCooldown]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSendAdminEmailCode = async () => {
    if (adminEmailCooldown > 0 || isSendingEmailCode) return;
    setIsSendingEmailCode(true);
    try {
      const email = user?.email || "admin@zarpou.com.br";
      const res = await fetch("/api/auth/2fa/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: user?.name || "Administrador" }),
      });
      const data = await res.json();
      const code = data.code || Math.floor(100000 + Math.random() * 900000).toString();
      setAdminEmailExpectedCode(code);
      setAdminEmailSent(true);
      setAdminEmailCooldown(60);
      toast.success(`Código de verificação enviado para ${email}!`);
    } catch {
      toast.error("Erro ao enviar código de verificação por e-mail.");
    } finally {
      setIsSendingEmailCode(false);
    }
  };

  const handleConfirmEmail2Fa = async () => {
    const cleanCode = adminEmailOtpCode.trim().replace(/\D/g, "");
    if (cleanCode.length !== 6) {
      toast.warning("Por favor, digite o código de 6 dígitos recebido por e-mail.");
      return;
    }
    if (adminEmailExpectedCode && cleanCode !== adminEmailExpectedCode) {
      toast.error("Código incorreto. Verifique os dígitos recebidos no seu e-mail.");
      return;
    }

    setIsSaving2Fa(true);
    try {
      const res = await enableTwoFactor("email", undefined, adminBackupCodes);
      if (res.success) {
        toast.success("Autenticação em 2 etapas por E-mail ativada com sucesso!");
        setAdminEmailOtpCode("");
        setAdminEmailSent(false);
      } else {
        toast.error(res.message || "Erro ao ativar 2FA por e-mail.");
      }
    } finally {
      setIsSaving2Fa(false);
    }
  };

  const handleEnableEmail2Fa = async () => {
    setIsSaving2Fa(true);
    try {
      const res = await enableTwoFactor("email", undefined, adminBackupCodes);
      if (res.success) {
        toast.success("Autenticação em 2 etapas por E-mail ativada com sucesso!");
      } else {
        toast.error(res.message || "Erro ao ativar 2FA por e-mail.");
      }
    } finally {
      setIsSaving2Fa(false);
    }
  };

  const handleDisableAdmin2Fa = async () => {
    setIsSaving2Fa(true);
    try {
      const res = await disableTwoFactor();
      if (res.success) {
        toast.success("Autenticação em 2 etapas desativada com sucesso.");
      } else {
        toast.error(res.message || "Erro ao desativar 2FA.");
      }
    } finally {
      setIsSaving2Fa(false);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!mounted) {
    return (
      <div className="fixed inset-0 z-50 min-h-screen min-h-[100dvh] h-screen w-full bg-slate-950 flex flex-col items-center justify-center">
        <LoadingScreen
          title="Carregando Painel Zarpou..."
          subtitle="Validando credenciais administrativas..."
          theme="dark"
          type="admin"
          fullScreen={true}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 min-h-screen min-h-[100dvh] h-screen w-full bg-slate-950 flex flex-col items-center justify-center">
        <LoadingScreen
          title="Redirecionando para Login..."
          subtitle="Acesso restrito à equipe Zarpou"
          theme="dark"
          type="admin"
          fullScreen={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-slate-100 flex flex-col md:flex-row">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex w-64 h-screen bg-slate-900 text-white flex-col justify-between shrink-0 border-r border-slate-800 select-none">
        <div className="flex flex-col min-h-0 flex-1">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3 shrink-0">
            <div className="relative size-9">
              <Image
                src="/logo/logo.svg"
                alt="Zarpou"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Zarpou Admin</h2>
              <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider">
                Painel da Agência
              </span>
            </div>
          </div>

          <nav className="p-4 space-y-1.5 overflow-y-auto flex-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                    active
                      ? "bg-secondary text-primary shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
          >
            <Globe className="size-4 text-secondary" />
            Visualizar Site
          </Link>

          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
          >
            <ShieldCheck className="size-4 text-secondary" />
            Segurança
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/40 transition cursor-pointer"
          >
            <LogOut className="size-4" />
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* HEADER MOBILE */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative size-8">
            <Image
              src="/logo/logo.svg"
              alt="Zarpou"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-sm">Zarpou Admin</span>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-white"
        >
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </header>

      {/* MENU MOBILE EXPANSÍVEL */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-white p-4 border-b border-slate-800 space-y-2 animate-in slide-in-from-top">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  handleNavClick(item.href);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                  active
                    ? "bg-secondary text-primary"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-secondary font-bold flex items-center gap-1.5 p-2"
            >
              <Globe className="size-4" /> Ver Site
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsPasswordModalOpen(true);
              }}
              className="text-xs text-slate-300 font-bold flex items-center gap-1.5 p-2"
            >
              <ShieldCheck className="size-4 text-secondary" /> Segurança
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-red-400 font-bold flex items-center gap-1.5 p-2"
            >
              <LogOut className="size-4" /> Sair
            </button>
          </div>
        </div>
      )}

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 md:h-screen md:overflow-hidden">
        {/* TOPBAR */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 hidden md:flex items-center justify-between shrink-0">
          <div className="text-xs font-semibold text-slate-500">
            Painel de Gestão da Agência
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="text-xs font-bold text-slate-600 hover:text-primary hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 transition cursor-pointer mr-2"
              title="Configurações de segurança e acesso"
            >
              <ShieldCheck className="size-3.5 text-secondary" />
              <span>Segurança</span>
            </button>

            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800">
              {user?.name || "Administrador"}
            </span>
            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                userRole === "admin"
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  : userRole === "personalizado"
                  ? "bg-sky-50 text-sky-700 border border-sky-200"
                  : userRole === "gestor"
                  ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              {userRole === "admin"
                ? "Admin Geral"
                : userRole === "personalizado"
                ? "Personalizado"
                : userRole === "gestor"
                ? "Gestor"
                : "Atendente"}
            </span>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1 overflow-y-auto relative">
          {!isCurrentRouteAllowed ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-150 select-none">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center max-w-sm">
                <div className="size-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4">
                  <ShieldAlert className="size-7" />
                </div>
                <h3 className="text-base font-black text-slate-800">
                  Acesso Restrito
                </h3>
                <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed">
                  Você não possui permissão para acessar esta tela. Redirecionando...
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <Loader2 className="size-4 animate-spin" />
                  <span>Redirecionando...</span>
                </div>
              </div>
            </div>
          ) : (
            children
          )}

          {/* OVERLAY DE TRANSIÇÃO SUAVE AO TROCAR DE TELA NO ADMIN (BACKGROUND FOSCO SÓ NA ÁREA DE CONTEÚDO) */}
          {isPageTransitioning && (
            <div className="absolute inset-0 z-30 bg-slate-100/75 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in duration-150 select-none">
              <div className="bg-white/95 border border-slate-200/80 shadow-xl px-7 py-5 rounded-2xl flex flex-col items-center gap-3 backdrop-blur-lg">
                <div className="relative size-10 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                  <Loader2 className="size-5 text-primary animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-800">
                    Carregando painel...
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Atualizando conteúdo da tela
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL DE SEGURANÇA (SENHA E 2FA) */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-secondary/15 rounded-xl text-secondary">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Segurança da Conta</h3>
                  <p className="text-xs text-slate-500">Credenciais e autenticação em duas etapas</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isSubmittingPassword && !isSaving2Fa) {
                    setIsPasswordModalOpen(false);
                  }
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* SELEÇÃO DE ABAS: ALTERAR SENHA vs 2FA */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 my-4">
              <button
                type="button"
                onClick={() => setSecurityTab("password")}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  securityTab === "password" ? "bg-white text-primary shadow-xs" : "hover:text-slate-900"
                }`}
              >
                <Key className="size-3.5" />
                <span>Alterar Senha</span>
              </button>
              <button
                type="button"
                onClick={() => setSecurityTab("2fa")}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  securityTab === "2fa" ? "bg-white text-primary shadow-xs" : "hover:text-slate-900"
                }`}
              >
                <ShieldCheck className="size-3.5 text-secondary" />
                <span>Autenticação 2FA</span>
              </button>
            </div>

            {securityTab === "password" ? (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Senha Atual
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Digite sua senha atual"
                      required
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-primary pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 8 dígitos com maiúscula, número e símbolo"
                      required
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-primary pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a nova senha"
                      required
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-primary pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* REQUISITOS DE SENHA */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] space-y-1.5">
                  <span className="font-bold text-slate-700 block mb-1">Requisitos de segurança:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <span
                      className={`flex items-center gap-1.5 ${
                        newPassword.length >= 8 ? "text-emerald-600 font-semibold" : "text-slate-400"
                      }`}
                    >
                      <Check className="size-3" /> 8+ caracteres
                    </span>
                    <span
                      className={`flex items-center gap-1.5 ${
                        /[A-Z]/.test(newPassword) ? "text-emerald-600 font-semibold" : "text-slate-400"
                      }`}
                    >
                      <Check className="size-3" /> Letra maiúscula
                    </span>
                    <span
                      className={`flex items-center gap-1.5 ${
                        /[0-9]/.test(newPassword) ? "text-emerald-600 font-semibold" : "text-slate-400"
                      }`}
                    >
                      <Check className="size-3" /> Número
                    </span>
                    <span
                      className={`flex items-center gap-1.5 ${
                        /[^A-Za-z0-9]/.test(newPassword) ? "text-emerald-600 font-semibold" : "text-slate-400"
                      }`}
                    >
                      <Check className="size-3" /> Caractere especial
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    disabled={isSubmittingPassword}
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingPassword}
                    className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    {isSubmittingPassword ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Lock className="size-4" />
                        Atualizar Senha
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* ABA 2: GERENCIAMENTO DE 2FA ADMIN */
              <div className="space-y-4">
                {/* STATUS ATUAL DO 2FA */}
                {user?.twoFactorEnabled ? (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="size-5 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold block">Autenticação em 2 Etapas Ativa</span>
                        <span className="text-[11px] text-emerald-700">
                          {user.twoFactorMethod === "authenticator"
                            ? "Protegido via App Autenticador (TOTP)"
                            : "Protegido via E-mail"}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={isSaving2Fa}
                      onClick={handleDisableAdmin2Fa}
                      className="px-3 py-1.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-bold rounded-lg transition shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {isSaving2Fa ? "Desativando..." : "Desativar 2FA"}
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs flex items-center gap-2.5">
                    <ShieldCheck className="size-4 text-slate-500 shrink-0" />
                    <span>
                      A autenticação em 2 etapas adiciona uma camada extra de proteção ao seu login.
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Escolha o Método de Autenticação
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAdmin2FaMethod("authenticator")}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                        admin2FaMethod === "authenticator"
                          ? "border-primary bg-primary/5 text-primary shadow-xs"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <Smartphone className="size-4 shrink-0" />
                      <div>
                        <span className="font-bold text-xs block">App Autenticador</span>
                        <span className="text-[10px] text-slate-500">Google Auth, Authy</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAdmin2FaMethod("email")}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                        admin2FaMethod === "email"
                          ? "border-primary bg-primary/5 text-primary shadow-xs"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <Mail className="size-4 shrink-0" />
                      <div>
                        <span className="font-bold text-xs block">Por E-mail</span>
                        <span className="text-[10px] text-slate-500">Código de 6 dígitos</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* PAREAMENTO E VALIDAÇÃO TOTP (APP AUTENTICADOR) */}
                {admin2FaMethod === "authenticator" && (
                  <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {/* PASSO 1: QR CODE */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="size-5 rounded-full bg-primary text-white text-[11px] font-bold inline-flex items-center justify-center">1</span>
                          Escaneie o QR Code no seu aplicativo
                        </span>
                        <button
                          type="button"
                          onClick={handleGenerateNewSecret}
                          className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
                        >
                          Gerar novo QR
                        </button>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-3.5 bg-white p-3 rounded-xl border border-slate-200">
                        {adminTotpQrUrl ? (
                          <div className="size-28 relative bg-white p-1 rounded-lg border border-slate-200 shrink-0">
                            <Image src={adminTotpQrUrl} alt="QR 2FA" fill className="object-contain p-1" />
                          </div>
                        ) : (
                          <div className="size-28 flex items-center justify-center bg-slate-100 rounded-lg text-slate-400 text-xs">
                            Gerando QR...
                          </div>
                        )}
                        <div className="space-y-2 text-xs flex-1">
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            Abra o <strong>Google Authenticator</strong> ou <strong>Authy</strong>, toque em <strong>+</strong> e escaneie a imagem.
                          </p>
                          <div>
                            <span className="text-[10px] text-slate-400 block mb-0.5">Ou digite a chave manual:</span>
                            <div className="flex items-center gap-1.5">
                              <code className="bg-slate-50 px-2 py-1 rounded border border-slate-300 font-mono text-[11px] font-bold text-primary select-all break-all">
                                {adminTotpSecret}
                              </code>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(adminTotpSecret);
                                  setCopiedAdminSecret(true);
                                  toast.info("Chave copiada!");
                                  setTimeout(() => setCopiedAdminSecret(false), 2000);
                                }}
                                className="p-1.5 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                title="Copiar chave"
                              >
                                {copiedAdminSecret ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PASSO 2: DIGITAR O CÓDIGO OTP GERADO NO APP */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="size-5 rounded-full bg-primary text-white text-[11px] font-bold inline-flex items-center justify-center">2</span>
                        Digite o código de 6 dígitos gerado pelo app
                      </span>
                      <div className="flex flex-col sm:flex-row items-center gap-2.5">
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          placeholder="000000"
                          value={adminOtpCode}
                          onChange={(e) => setAdminOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          className="w-full sm:w-44 text-center font-mono text-lg tracking-[0.3em] font-bold py-2 px-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 placeholder:text-slate-300"
                        />
                        <button
                          type="button"
                          disabled={adminOtpCode.length !== 6 || isVerifyingTotp}
                          onClick={handleVerifyAndEnableAuthenticator}
                          className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 transition"
                        >
                          {isVerifyingTotp ? (
                            <>
                              <Loader2 className="size-4 animate-spin text-secondary" />
                              <span>Validando código...</span>
                            </>
                          ) : (
                            <>
                              <Check className="size-4 text-secondary" />
                              <span>Confirmar e Ativar 2FA</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Insira os 6 números gerados no seu aplicativo para confirmar o pareamento e ativar a proteção.
                      </p>
                    </div>
                  </div>
                )}

                {/* AUTENTICAÇÃO POR E-MAIL */}
                {admin2FaMethod === "email" && (
                  <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-800 block">
                        Autenticação via Código por E-mail
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Ao utilizar este método, um código numérico de 6 dígitos será enviado para <strong>{user?.email}</strong> a cada tentativa de login no painel.
                      </p>
                    </div>

                    {/* ENVIAR / REENVIAR CÓDIGO DE TESTE COM TIMER DE 1 MINUTO */}
                    <div className="pt-2 border-t border-slate-200 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-700">
                          {adminEmailSent ? "Código de verificação enviado" : "Validar recebimento no seu e-mail:"}
                        </span>
                        <button
                          type="button"
                          disabled={adminEmailCooldown > 0 || isSendingEmailCode}
                          onClick={handleSendAdminEmailCode}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-2xs ${
                            adminEmailCooldown > 0
                              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                              : "bg-white hover:bg-slate-100 text-primary border border-slate-200 cursor-pointer"
                          }`}
                        >
                          <RefreshCw className={`size-3 ${isSendingEmailCode ? "animate-spin" : ""}`} />
                          <span>
                            {isSendingEmailCode
                              ? "Enviando..."
                              : adminEmailCooldown > 0
                              ? `Reenviar código (${formatTimer(adminEmailCooldown)})`
                              : adminEmailSent
                              ? "Reenviar código por e-mail"
                              : "Enviar código de teste"}
                          </span>
                        </button>
                      </div>

                      {adminEmailCooldown > 0 && (
                        <p className="text-[10px] text-slate-400">
                          Aguarde {adminEmailCooldown}s para poder reenviar um novo código para seu e-mail.
                        </p>
                      )}

                      {/* DIGITAR O CÓDIGO RECEBIDO */}
                      {adminEmailSent && (
                        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                          <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            placeholder="000000"
                            value={adminEmailOtpCode}
                            onChange={(e) => setAdminEmailOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            className="w-full sm:w-40 text-center font-mono text-base tracking-[0.3em] font-bold py-2 px-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-800 placeholder:text-slate-300"
                          />
                          <button
                            type="button"
                            disabled={adminEmailOtpCode.length !== 6 || isSaving2Fa}
                            onClick={handleConfirmEmail2Fa}
                            className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 transition"
                          >
                            {isSaving2Fa ? (
                              <>
                                <Loader2 className="size-4 animate-spin text-secondary" />
                                <span>Ativando...</span>
                              </>
                            ) : (
                              <>
                                <Check className="size-4 text-secondary" />
                                <span>Confirmar e Ativar 2FA</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {!adminEmailSent && (
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            disabled={isSaving2Fa || (user?.twoFactorEnabled && user?.twoFactorMethod === "email")}
                            onClick={handleEnableEmail2Fa}
                            className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 transition"
                          >
                            {isSaving2Fa ? (
                              <>
                                <Loader2 className="size-4 animate-spin text-secondary" />
                                <span>Salvando...</span>
                              </>
                            ) : user?.twoFactorEnabled && user?.twoFactorMethod === "email" ? (
                              <>
                                <Check className="size-4 text-secondary" />
                                <span>E-mail já Configurado</span>
                              </>
                            ) : (
                              <>
                                <Check className="size-4 text-secondary" />
                                <span>Ativar 2FA por E-mail</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* CÓDIGOS DE BACKUP */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Códigos de Recuperação</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(adminBackupCodes.join("\n"));
                        setCopiedAdminBackups(true);
                        toast.info("Códigos copiados!");
                        setTimeout(() => setCopiedAdminBackups(false), 2000);
                      }}
                      className="text-[11px] text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="size-3" />
                      <span>{copiedAdminBackups ? "Copiados!" : "Copiar códigos"}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Guarde estes códigos em local seguro. Você pode usar qualquer um deles caso perca acesso ao seu app ou e-mail.
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-center text-[11px] font-bold text-slate-700">
                    {adminBackupCodes.slice(0, 3).map((c, i) => (
                      <span key={i} className="bg-white py-1 rounded border border-slate-100">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
