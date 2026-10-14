"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  UserCheck,
  UserX,
  Plus,
  Search,
  RotateCcw,
  Edit2,
  Trash2,
  Lock,
  Mail,
  User as UserIcon,
  Shield,
  Sparkles,
  Info,
  AlertCircle,
  X,
  Crown,
  Layers,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useAdminUsersStore } from "@/stores/admin-users-store";
import { AdminUser, AdminRole, AVAILABLE_ADMIN_SCREENS } from "@/types/user";
import { toast } from "react-toastify";
import { useConfirm } from "@/components/shared/confirm-dialog-provider";

export default function AdministradoresAdminPage() {
  const router = useRouter();
  const { user: currentAdmin } = useAuthStore();
  const { confirm } = useConfirm();
  const {
    admins,
    fetchAdmins,
    toggleAdminStatus,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    resetToDefaults,
  } = useAdminUsersStore();

  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [accessFilter, setAccessFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Estados de Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formConfirmPassword, setFormConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGeneralAdmin, setIsGeneralAdmin] = useState(false);
  const [formAllowedScreens, setFormAllowedScreens] = useState<string[]>([]);
  const [formActive, setFormActive] = useState(true);
  const [formTwoFactorEnabled, setFormTwoFactorEnabled] = useState(false);
  const [formTwoFactorMethod, setFormTwoFactorMethod] = useState<"email" | "authenticator" | "both">("email");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePassword = (pass: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (pass.length < 8) {
      errors.push("Mínimo de 8 caracteres");
    }
    if (!/[A-Z]/.test(pass)) {
      errors.push("Ao menos 1 letra maiúscula");
    }
    if (!/[0-9]/.test(pass)) {
      errors.push("Ao menos 1 número");
    }
    if (!/[^A-Za-z0-9]/.test(pass)) {
      errors.push("Ao menos 1 caractere especial (!@#$%&*)");
    }
    return { valid: errors.length === 0, errors };
  };

  useEffect(() => {
    setMounted(true);
    const userRole = (currentAdmin?.role || "admin").toLowerCase();
    const userAllowedScreens = currentAdmin?.allowedScreens || currentAdmin?.allowed_screens;
    const canAccessAdmins =
      userRole === "admin" ||
      userAllowedScreens?.includes("administradores") ||
      userAllowedScreens?.includes("*");

    if (currentAdmin && !canAccessAdmins) {
      router.push("/admin/dashboard");
      return;
    }
    fetchAdmins();
  }, [fetchAdmins, currentAdmin, router]);

  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const matchesSearch =
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase());

      const isCurrentAdminGeneral =
        admin.role === "admin" ||
        (admin.allowedScreens && admin.allowedScreens.length === AVAILABLE_ADMIN_SCREENS.length);

      const matchesAccess =
        accessFilter === "all" ||
        (accessFilter === "admin" && isCurrentAdminGeneral) ||
        (accessFilter === "personalizado" && !isCurrentAdminGeneral);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && admin.isActive) ||
        (statusFilter === "inactive" && !admin.isActive);

      return matchesSearch && matchesAccess && matchesStatus;
    });
  }, [admins, searchTerm, accessFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = admins.length;
    const active = admins.filter((a) => a.isActive).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [admins]);

  const isSuperAdmin =
    (currentAdmin?.role || "admin") === "admin" ||
    (currentAdmin?.allowedScreens && currentAdmin.allowedScreens.length === AVAILABLE_ADMIN_SCREENS.length);

  const isSelf = (admin: AdminUser) => {
    if (!currentAdmin) return false;
    return (
      admin.id === currentAdmin.id ||
      admin.email.toLowerCase() === currentAdmin.email.toLowerCase()
    );
  };

  const handleOpenCreateModal = () => {
    setEditingAdmin(null);
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsGeneralAdmin(false);
    setFormAllowedScreens([]);
    setFormActive(true);
    setFormTwoFactorEnabled(false);
    setFormTwoFactorMethod("email");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (admin: AdminUser) => {
    const isGeneral = Boolean(
      admin.role === "admin" ||
        (admin.allowedScreens && admin.allowedScreens.length === AVAILABLE_ADMIN_SCREENS.length)
    );

    if (!isSuperAdmin && isGeneral) {
      toast.warn("Apenas um Administrador Geral pode editar contas de Administrador Geral.");
      return;
    }
    setEditingAdmin(admin);
    setFormName(admin.name);
    setFormEmail(admin.email);
    setFormPassword("");
    setFormConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsGeneralAdmin(isGeneral);
    setFormAllowedScreens(
      admin.allowedScreens ||
        admin.allowed_screens ||
        (isGeneral ? AVAILABLE_ADMIN_SCREENS.map((s) => s.id) : [])
    );
    setFormActive(admin.isActive);
    setFormTwoFactorEnabled(Boolean(admin.twoFactorEnabled));
    setFormTwoFactorMethod(admin.twoFactorMethod || "email");
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (admin: AdminUser) => {
    if (isSelf(admin)) {
      toast.warn("Você não pode desativar seu próprio usuário administrador.");
      return;
    }

    const currentId = currentAdmin?.id || "adm-1";
    const result = await toggleAdminStatus(admin.id, currentId);
    if (result.success) {
      toast.success(result.message || "Status do administrador alterado com sucesso!");
    } else {
      toast.error(result.message || "Não foi possível alterar o status.");
    }
  };

  const handleDelete = async (admin: AdminUser) => {
    if (isSelf(admin)) {
      toast.warn("Você não pode excluir sua própria conta de administrador.");
      return;
    }

    const isGeneral = Boolean(
      admin.role === "admin" ||
        (admin.allowedScreens && admin.allowedScreens.length === AVAILABLE_ADMIN_SCREENS.length)
    );

    if (!isSuperAdmin && isGeneral) {
      toast.warn("Apenas um Administrador Geral pode remover contas de Administrador Geral.");
      return;
    }

    const confirmed = await confirm({
      title: "Remover Administrador",
      description: `Tem certeza que deseja remover o administrador "${admin.name}" (${admin.email})? Esta ação não pode ser desfeita.`,
      confirmText: "Sim, remover",
      cancelText: "Cancelar",
      variant: "destructive",
      icon: "trash",
    });

    if (!confirmed) {
      return;
    }

    const currentId = currentAdmin?.id || "adm-1";
    const result = await deleteAdmin(admin.id, currentId);
    if (result.success) {
      toast.success("Administrador removido com sucesso.");
    } else {
      toast.error(result.message || "Erro ao remover administrador.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      toast.error("Por favor, preencha o nome e o e-mail.");
      return;
    }

    // Validação de senha
    const passToValidate = formPassword.trim();

    if (!editingAdmin && !passToValidate) {
      toast.error("Por favor, informe uma senha para o novo administrador.");
      return;
    }

    if (passToValidate) {
      const { valid, errors } = validatePassword(passToValidate);
      if (!valid) {
        toast.error(`A senha não atende aos requisitos: ${errors.join(", ")}.`);
        return;
      }
      if (passToValidate !== formConfirmPassword.trim()) {
        toast.error("A confirmação de senha não confere com a senha digitada.");
        return;
      }
    }

    // Se NÃO for administrador geral, é obrigatório selecionar ao menos uma tela
    if (!isGeneralAdmin && formAllowedScreens.length === 0) {
      toast.error("Selecione ao menos uma tela de acesso ou marque a opção de Administrador Geral.");
      return;
    }

    const assignedRole: AdminRole = isGeneralAdmin ? "admin" : "personalizado";
    const assignedScreens = isGeneralAdmin
      ? AVAILABLE_ADMIN_SCREENS.map((s) => s.id)
      : formAllowedScreens;

    setIsSubmitting(true);
    try {
      if (editingAdmin) {
        const result = await updateAdmin(editingAdmin.id, {
          name: formName,
          email: formEmail,
          role: assignedRole,
          password: passToValidate || undefined,
          allowedScreens: assignedScreens,
          isActive: isSelf(editingAdmin) ? true : formActive,
          twoFactorEnabled: formTwoFactorEnabled,
          twoFactorMethod: formTwoFactorMethod,
          twoFactorSecret: formTwoFactorEnabled ? editingAdmin.twoFactorSecret : undefined,
          backupCodes: formTwoFactorEnabled ? editingAdmin.backupCodes : undefined,
        });

        if (result.success) {
          toast.success("Administrador atualizado com sucesso!");
          setIsModalOpen(false);
        } else {
          toast.error(result.message || "Erro ao atualizar administrador.");
        }
      } else {
        const result = await createAdmin({
          name: formName,
          email: formEmail,
          password: passToValidate,
          role: assignedRole,
          allowedScreens: assignedScreens,
          isActive: formActive,
          twoFactorEnabled: false,
          twoFactorMethod: "email",
        });

        if (result.success) {
          toast.success("Novo administrador cadastrado com sucesso!");
          setIsModalOpen(false);
        } else {
          toast.error(result.message || "Erro ao criar administrador.");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetDefaults = async () => {
    const confirmed = await confirm({
      title: "Restaurar Equipe Inicial",
      description: "Deseja restaurar a equipe de administradores para a configuração padrão inicial da Zarpou?",
      confirmText: "Restaurar",
      cancelText: "Cancelar",
      variant: "warning",
      icon: "warning",
    });

    if (confirmed) {
      resetToDefaults();
      toast.success("Equipe de administradores restaurada para o padrão inicial!");
    }
  };

  if (!mounted) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        Carregando administradores do sistema...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">
              Administradores do Sistema
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-secondary/15 text-primary border border-secondary/30">
              <ShieldCheck className="size-3.5" />
              Gestão de Acessos
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Controle os colaboradores da agência com acesso ao painel. Ative ou desative membros da equipe conforme permissão.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Restaura os administradores iniciais padrão"
          >
            <RotateCcw className="size-3.5" />
            Restaurar Padrão
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="size-4 text-secondary" />
            Novo Administrador
          </button>
        </div>
      </div>

      {/* AVISO DE REGRA DE SEGURANÇA */}
      <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-start gap-3 text-sky-900 shadow-2xs">
        <Info className="size-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold">Regra de Segurança de Acesso Ativa</p>
          <p className="text-sky-800 leading-relaxed">
            Por política de segurança do sistema, o administrador atualmente conectado (sua conta) <strong>não pode ser desativado nem excluído por você mesmo</strong>. Essa restrição previne que o painel administrativo fique trancado sem nenhum gestor ativo.
          </p>
        </div>
      </div>

      {/* CARDS DE ESTATÍSTICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Total de Membros
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.total}</p>
          </div>
          <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
            <Shield className="size-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">
              Contas Ativas
            </p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{stats.active}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <UserCheck className="size-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Contas Inativas
            </p>
            <p className="text-2xl font-black text-slate-500 mt-1">{stats.inactive}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
            <UserX className="size-5" />
          </div>
        </div>
      </div>

      {/* FILTROS E BUSCA */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar administrador por nome ou e-mail..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-secondary focus:border-transparent transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={accessFilter}
            onChange={(e) => setAccessFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-secondary transition cursor-pointer"
          >
            <option value="all">Todos os Acessos</option>
            <option value="admin">Administrador Geral</option>
            <option value="personalizado">Acesso Personalizado</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-secondary transition cursor-pointer"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Apenas Ativos</option>
            <option value="inactive">Apenas Inativos</option>
          </select>
        </div>
      </div>

      {/* TABELA DE ADMINISTRADORES */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Administrador / Colaborador</th>
                <th className="py-3.5 px-4">Nível de Acesso</th>
                <th className="py-3.5 px-4">Telas com Acesso</th>
                <th className="py-3.5 px-4">Segurança 2FA</th>
                <th className="py-3.5 px-4">Status da Conta</th>
                <th className="py-3.5 px-4 text-center">Ativar / Desativar</th>
                <th className="py-3.5 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Nenhum administrador encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => {
                  const selfUser = isSelf(admin);
                  const isGeneral = Boolean(
                    admin.role === "admin" ||
                      (admin.allowedScreens &&
                        admin.allowedScreens.length === AVAILABLE_ADMIN_SCREENS.length)
                  );

                  return (
                    <tr
                      key={admin.id}
                      className={`hover:bg-slate-50/70 transition ${
                        selfUser ? "bg-amber-50/20" : ""
                      }`}
                    >
                      {/* ADMINISTRADOR */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              admin.isActive
                                ? "bg-primary text-white"
                                : "bg-slate-200 text-slate-400"
                            }`}
                          >
                            {admin.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">
                                {admin.name}
                              </span>
                              {selfUser && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                                  <Sparkles className="size-2.5 text-amber-600" />
                                  Você (Sessão Atual)
                                </span>
                              )}
                            </div>
                            <span className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                              <Mail className="size-3 text-slate-400" />
                              {admin.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* NÍVEL DE ACESSO */}
                      <td className="py-4 px-4">
                        {isGeneral ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                            <Crown className="size-3 text-amber-600" />
                            Administrador Geral
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            <Layers className="size-3 text-slate-500" />
                            Personalizado
                          </span>
                        )}
                      </td>

                      {/* TELAS COM ACESSO PERMITIDO */}
                      <td className="py-4 px-4">
                        {isGeneral ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Todas as {AVAILABLE_ADMIN_SCREENS.length} telas liberadas
                          </span>
                        ) : admin.allowedScreens && admin.allowedScreens.length > 0 ? (
                          <div className="flex flex-col gap-1 max-w-[200px]">
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 w-fit"
                              title={admin.allowedScreens.join(", ")}
                            >
                              {admin.allowedScreens.length} de {AVAILABLE_ADMIN_SCREENS.length} telas liberadas
                            </span>
                            <span
                              className="text-[10px] text-slate-400 truncate"
                              title={admin.allowedScreens
                                .map((id) => AVAILABLE_ADMIN_SCREENS.find((s) => s.id === id)?.name || id)
                                .join(", ")}
                            >
                              {admin.allowedScreens
                                .map((id) => AVAILABLE_ADMIN_SCREENS.find((s) => s.id === id)?.name || id)
                                .join(", ")}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-400">
                            Nenhuma tela definida
                          </span>
                        )}
                      </td>

                      {/* SEGURANÇA 2FA */}
                      <td className="py-4 px-4">
                        {admin.twoFactorEnabled ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 w-fit">
                              <ShieldCheck className="size-3 text-emerald-600" />
                              Ativo
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {admin.twoFactorMethod === "authenticator" ? "📱 App Authenticator" : "✉️ Código por E-mail"}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                            Desativado
                          </span>
                        )}
                      </td>

                      {/* STATUS DA CONTA */}
                      <td className="py-4 px-4">
                        {admin.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                            <span className="size-1.5 rounded-full bg-slate-400" />
                            Inativo
                          </span>
                        )}
                      </td>

                      {/* ATIVAR / DESATIVAR COM REGRA DE SEGURANÇA */}
                      <td className="py-4 px-4 text-center">
                        {selfUser ? (
                          <div
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-semibold cursor-not-allowed border border-slate-200"
                            title="Você não pode desativar seu próprio usuário de acesso ao sistema."
                          >
                            <Lock className="size-3 text-slate-400" />
                            Bloqueado (Sua Conta)
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(admin)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                              admin.isActive ? "bg-emerald-600" : "bg-slate-300"
                            }`}
                            title={
                              admin.isActive
                                ? "Clique para desativar este administrador"
                                : "Clique para ativar este administrador"
                            }
                          >
                            <span
                              className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                admin.isActive ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        )}
                      </td>

                      {/* AÇÕES */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isSuperAdmin && isGeneral ? (
                            <span
                              className="p-1.5 text-slate-300 cursor-not-allowed"
                              title="Apenas Administrador Geral pode alterar dados de outro Administrador Geral"
                            >
                              <Lock className="size-4" />
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(admin)}
                              className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition cursor-pointer"
                              title="Editar dados do administrador"
                            >
                              <Edit2 className="size-4" />
                            </button>
                          )}

                          {selfUser || (!isSuperAdmin && isGeneral) ? (
                            <span
                              className="p-1.5 text-slate-300 cursor-not-allowed"
                              title={
                                selfUser
                                  ? "Você não pode excluir sua própria conta"
                                  : "Apenas Administrador Geral pode remover outro Administrador Geral"
                              }
                            >
                              <Trash2 className="size-4" />
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDelete(admin)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                              title="Remover administrador"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CRIAÇÃO / EDIÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 max-h-[92vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {editingAdmin ? "Editar Administrador" : "Novo Administrador"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingAdmin
                      ? "Atualize as permissões ou senha do colaborador"
                      : "Conceda acesso administrativo definindo as telas permitidas"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                title="Fechar"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <UserIcon className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Rafaela Medeiros"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  E-mail Corporativo
                </label>
                <div className="relative">
                  <Mail className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="rafaela@zarpou.com.br"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              {/* SENHA DE ACESSO */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {editingAdmin ? "Nova Senha (opcional)" : "Senha de Acesso"}{" "}
                    {!editingAdmin && <span className="text-red-500">*</span>}
                  </label>
                  {formPassword.length > 0 && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        validatePassword(formPassword).valid
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {validatePassword(formPassword).valid ? "Senha Forte ✓" : "Senha Fraca"}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <Lock className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder={
                      editingAdmin
                        ? "Deixe em branco para manter a senha atual"
                        : "Crie uma senha segura (mín. 8 caracteres)"
                    }
                    className="w-full pl-9 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-secondary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-0.5"
                    title={showPassword ? "Ocultar senha" : "Ver senha"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                {/* CRITÉRIOS DE VALIDAÇÃO DE SENHA */}
                {(!editingAdmin || formPassword.length > 0) && (
                  <div className="mt-2 p-2.5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-600">Requisitos de segurança:</p>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <span
                        className={`flex items-center gap-1.5 font-medium transition-colors ${
                          formPassword.length >= 8 ? "text-emerald-700 font-bold" : "text-slate-400"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full transition-colors ${
                            formPassword.length >= 8 ? "bg-emerald-600" : "bg-slate-300"
                          }`}
                        />
                        Mín. 8 caracteres
                      </span>

                      <span
                        className={`flex items-center gap-1.5 font-medium transition-colors ${
                          /[A-Z]/.test(formPassword) ? "text-emerald-700 font-bold" : "text-slate-400"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full transition-colors ${
                            /[A-Z]/.test(formPassword) ? "bg-emerald-600" : "bg-slate-300"
                          }`}
                        />
                        1 Letra maiúscula (A-Z)
                      </span>

                      <span
                        className={`flex items-center gap-1.5 font-medium transition-colors ${
                          /[0-9]/.test(formPassword) ? "text-emerald-700 font-bold" : "text-slate-400"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full transition-colors ${
                            /[0-9]/.test(formPassword) ? "bg-emerald-600" : "bg-slate-300"
                          }`}
                        />
                        1 Número (0-9)
                      </span>

                      <span
                        className={`flex items-center gap-1.5 font-medium transition-colors ${
                          /[^A-Za-z0-9]/.test(formPassword) ? "text-emerald-700 font-bold" : "text-slate-400"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full transition-colors ${
                            /[^A-Za-z0-9]/.test(formPassword) ? "bg-emerald-600" : "bg-slate-300"
                          }`}
                        />
                        1 Especial (!@#$%&*)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* CONFIRMAÇÃO DE SENHA */}
              {(!editingAdmin || formPassword.length > 0) && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirmar Senha <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formConfirmPassword}
                      onChange={(e) => setFormConfirmPassword(e.target.value)}
                      placeholder="Repita a mesma senha criada acima"
                      className={`w-full pl-9 pr-10 py-2 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-secondary transition ${
                        formConfirmPassword.length > 0
                          ? formPassword === formConfirmPassword
                            ? "border-emerald-400 bg-emerald-50/20"
                            : "border-red-400 bg-red-50/20"
                          : "border-slate-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-0.5"
                      title={showConfirmPassword ? "Ocultar senha" : "Ver senha"}
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {formConfirmPassword.length > 0 && formPassword !== formConfirmPassword && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1">
                      As senhas digitadas não coincidem.
                    </p>
                  )}
                  {formConfirmPassword.length > 0 && formPassword === formConfirmPassword && (
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                      ✓ As senhas conferem.
                    </p>
                  )}
                </div>
              )}

              {/* PERMISSÕES DE ACESSO E TELAS */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Permissões e Telas de Acesso <span className="text-red-500">*</span>
                  </label>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isGeneralAdmin
                        ? "bg-amber-50 text-amber-800 border border-amber-300"
                        : formAllowedScreens.length === 0
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {isGeneralAdmin
                      ? "👑 Administrador Geral (Acesso Total)"
                      : formAllowedScreens.length === 0
                      ? "Nenhuma tela (Obrigatório selecionar)"
                      : `${formAllowedScreens.length} de ${AVAILABLE_ADMIN_SCREENS.length} telas liberadas`}
                  </span>
                </div>

                {/* LISTA DE TELAS COM PRIMEIRO ITEM PERGUNTANDO SE É ADMIN GERAL */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white shadow-2xs">
                  {/* O PRIMEIRO ITEM: PERGUNTANDO SE É ADMIN GERAL */}
                  <div
                    onClick={() => {
                      if (!isSuperAdmin) {
                        toast.warn("Apenas um Administrador Geral pode conceder o nível de Administrador Geral.");
                        return;
                      }
                      const next = !isGeneralAdmin;
                      setIsGeneralAdmin(next);
                      if (next) {
                        setFormAllowedScreens(AVAILABLE_ADMIN_SCREENS.map((s) => s.id));
                      }
                    }}
                    className={`p-3.5 transition flex items-start gap-3 select-none ${
                      isGeneralAdmin
                        ? "bg-amber-500/10"
                        : "bg-slate-50/70 hover:bg-slate-100 cursor-pointer"
                    } ${!isSuperAdmin ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <input
                      type="checkbox"
                      id="isGeneralAdminCheck"
                      checked={isGeneralAdmin}
                      disabled={!isSuperAdmin}
                      onChange={(e) => {
                        if (!isSuperAdmin) return;
                        const checked = e.target.checked;
                        setIsGeneralAdmin(checked);
                        if (checked) {
                          setFormAllowedScreens(AVAILABLE_ADMIN_SCREENS.map((s) => s.id));
                        }
                      }}
                      className="mt-0.5 size-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer disabled:cursor-not-allowed shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <label
                          htmlFor="isGeneralAdminCheck"
                          className="text-xs font-black text-slate-900 cursor-pointer flex items-center gap-1.5"
                        >
                          <Crown className="size-3.5 text-amber-600" />
                          É Administrador Geral? (Acesso Total)
                        </label>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                          Total Irrestrito
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {isGeneralAdmin
                          ? "✓ Usuário com acesso total a todas as áreas. As telas individuais abaixo foram desabilitadas."
                          : "Marque esta opção para liberar todas as telas de uma vez só, ou deixe desmarcado para escolher telas específicas abaixo."}
                      </p>
                      {!isSuperAdmin && (
                        <p className="text-[10px] text-amber-700 font-medium mt-1">
                          * Apenas um Administrador Geral pode conceder este nível.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* DEMAIS ITENS: AS TELAS DO SISTEMA (DESABILITADAS SE FOR ADMIN GERAL) */}
                  <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                    {AVAILABLE_ADMIN_SCREENS.map((screen) => {
                      const isChecked = isGeneralAdmin || formAllowedScreens.includes(screen.id);
                      const isDisabled = isGeneralAdmin;

                      return (
                        <div
                          key={screen.id}
                          onClick={() => {
                            if (isDisabled) return;
                            if (formAllowedScreens.includes(screen.id)) {
                              setFormAllowedScreens(formAllowedScreens.filter((id) => id !== screen.id));
                            } else {
                              setFormAllowedScreens([...formAllowedScreens, screen.id]);
                            }
                          }}
                          className={`p-2.5 px-3.5 text-xs transition flex items-center justify-between gap-3 select-none ${
                            isDisabled
                              ? "bg-slate-50/60 opacity-50 cursor-not-allowed"
                              : isChecked
                              ? "bg-primary/5 hover:bg-primary/10 cursor-pointer"
                              : "bg-white hover:bg-slate-50 cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <input
                              type="checkbox"
                              id={`screen-${screen.id}`}
                              checked={isChecked}
                              disabled={isDisabled}
                              onChange={() => {
                                if (isDisabled) return;
                                if (formAllowedScreens.includes(screen.id)) {
                                  setFormAllowedScreens(formAllowedScreens.filter((id) => id !== screen.id));
                                } else {
                                  setFormAllowedScreens([...formAllowedScreens, screen.id]);
                                }
                              }}
                              className="size-4 rounded text-primary focus:ring-secondary cursor-pointer disabled:cursor-not-allowed shrink-0"
                            />
                            <div className="min-w-0">
                              <label
                                htmlFor={`screen-${screen.id}`}
                                className={`font-bold block truncate text-xs ${
                                  isDisabled
                                    ? "text-slate-400 cursor-not-allowed"
                                    : "text-slate-800 cursor-pointer"
                                }`}
                              >
                                {screen.name}
                              </label>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {screen.description}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                              id: {screen.id}
                            </span>
                            {isDisabled ? (
                              <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                Incluso
                              </span>
                            ) : isChecked ? (
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                Liberada
                              </span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ATALHOS QUANDO NÃO FOR ADMIN GERAL */}
                {!isGeneralAdmin && (
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mt-2 px-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormAllowedScreens(AVAILABLE_ADMIN_SCREENS.map((s) => s.id))}
                        className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                      >
                        + Marcar Todas ({AVAILABLE_ADMIN_SCREENS.length})
                      </button>
                      <span className="text-slate-300">•</span>
                      <button
                        type="button"
                        onClick={() => setFormAllowedScreens(["hospedagens", "passagens", "destinos"])}
                        className="text-[11px] font-medium text-slate-500 hover:text-primary transition cursor-pointer"
                      >
                        Só Catálogo
                      </button>
                      <span className="text-slate-300">•</span>
                      <button
                        type="button"
                        onClick={() => setFormAllowedScreens(["dashboard", "reservas", "usuarios"])}
                        className="text-[11px] font-medium text-slate-500 hover:text-primary transition cursor-pointer"
                      >
                        Operações & Vendas
                      </button>
                    </div>

                    {formAllowedScreens.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setFormAllowedScreens([])}
                        className="text-[11px] font-bold text-slate-400 hover:text-red-600 transition cursor-pointer"
                      >
                        Limpar Seleção
                      </button>
                    )}
                  </div>
                )}

                {/* ALERTA SE NADA FOR SELECIONADO */}
                {!isGeneralAdmin && formAllowedScreens.length === 0 && (
                  <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-800 font-semibold">
                    <AlertCircle className="size-4 text-amber-600 shrink-0" />
                    <span>Selecione ao menos uma tela ou marque a opção de Administrador Geral acima.</span>
                  </div>
                )}
              </div>

              {/* AUTENTICAÇÃO EM 2 FATORES (2FA) */}
              {!editingAdmin ? (
                <div className="p-4 rounded-2xl border border-amber-200/90 bg-amber-50/80 space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 mt-0.5 shrink-0 border border-amber-200/60">
                      <ShieldCheck className="size-5 text-amber-600" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-800">
                          Verificação em Duas Etapas (2FA)
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200 bg-white text-slate-500">
                          Inicia Desativado
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        A verificação em duas etapas é criada como desativada para garantir o primeiro acesso do usuário. <strong>É muito importante orientar o novo administrador a ativar a proteção</strong> (via E-mail ou Aplicativo Autenticador TOTP) logo após seu primeiro login, através do menu de perfil no topo da tela.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-primary/10 text-primary mt-0.5 shrink-0">
                        <ShieldCheck className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor="formTwoFactorEnabled"
                            className="text-xs font-bold text-slate-800 cursor-pointer"
                          >
                            Autenticação em 2 Fatores (2FA)
                          </label>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              formTwoFactorEnabled
                                ? "text-emerald-700 bg-emerald-100/70 border-emerald-300"
                                : "text-slate-500 bg-slate-100 border-slate-200"
                            }`}
                          >
                            {formTwoFactorEnabled ? "Ativado" : "Desativado"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          {formTwoFactorEnabled
                            ? `Proteção ativa via ${
                                formTwoFactorMethod === "authenticator"
                                  ? "App Autenticador (TOTP)"
                                  : "Código por E-mail"
                              }. Você pode desmarcar para resetar caso o administrador tenha perdido o acesso.`
                            : "Desativado no momento. O próprio administrador deve ativar em seu perfil após fazer login."}
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        id="formTwoFactorEnabled"
                        checked={formTwoFactorEnabled}
                        onChange={(e) => setFormTwoFactorEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary cursor-pointer"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* STATUS (SE NÃO FOR ELE MESMO) */}
              {editingAdmin && isSelf(editingAdmin) ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-semibold flex items-center gap-2">
                  <Lock className="size-4 text-amber-700 shrink-0" />
                  Esta é sua própria conta. Ela permanecerá ativa por segurança.
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="formActive"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    className="size-4 rounded text-primary focus:ring-secondary cursor-pointer"
                  />
                  <label htmlFor="formActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Conta ativa para login no painel
                  </label>
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Salvando..." : editingAdmin ? "Salvar Alterações" : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
