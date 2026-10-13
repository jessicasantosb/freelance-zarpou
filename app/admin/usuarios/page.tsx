"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Users,
  UserCheck,
  Search,
  Plus,
  RotateCcw,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  XCircle,
  Edit2,
  Trash2,
  Eye,
  X,
  Bell,
  Plane,
} from "lucide-react";
import { useCustomerManagementStore } from "@/stores/customer-management-store";
import { useAdminUsersStore } from "@/stores/admin-users-store";
import { CustomerUser } from "@/types/user";
import { toast } from "react-toastify";
import { formatCPF, isValidCPF } from "@/lib/format-cpf";
import { formatCellphone } from "@/lib/format-cellphone";
import { useConfirm } from "@/components/shared/confirm-dialog-provider";

interface CustomerBookingItem {
  id: string;
  locator_code?: string;
  booking_type?: string;
  created_at?: string;
  total_amount?: number;
  status?: string;
}

interface CustomerDetailData extends CustomerUser {
  bookings?: CustomerBookingItem[];
}

export default function UsuariosAdminPage() {
  const { confirm } = useConfirm();
  const {
    customers,
    fetchCustomers,
    toggleCustomerStatus,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerDetails,
    resetToDefaults,
  } = useCustomerManagementStore();
  const { admins } = useAdminUsersStore();

  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");

  // Modal de Criação / Edição
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerUser | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCpf, setFormCpf] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal de Detalhes / Histórico de Viagens
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState<CustomerDetailData | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchCustomers();
  }, [fetchCustomers]);

  // Conjunto de e-mails de administradores para nunca exibi-los como clientes
  const adminEmailSet = useMemo(() => {
    const emailSet = new Set(["admin@zarpou.com.br", "admin"]);
    admins.forEach((a) => emailSet.add(a.email.trim().toLowerCase()));
    return emailSet;
  }, [admins]);

  const validCustomers = useMemo(() => {
    return customers.filter((c) => !adminEmailSet.has(c.email.trim().toLowerCase()));
  }, [customers, adminEmailSet]);

  const filteredCustomers = useMemo(() => {
    return validCustomers.filter((cust) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        cust.name.toLowerCase().includes(term) ||
        cust.email.toLowerCase().includes(term) ||
        (cust.cpf && cust.cpf.toLowerCase().includes(term)) ||
        (cust.phone && cust.phone.toLowerCase().includes(term));

      const isActive = cust.isActive ?? true;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && isActive) ||
        (statusFilter === "inactive" && !isActive);

      const hasWhatsapp = cust.notifications?.whatsappPromotions ?? true;
      const hasEmail = cust.notifications?.emailPromotions ?? true;

      const matchesChannel =
        channelFilter === "all" ||
        (channelFilter === "whatsapp" && hasWhatsapp) ||
        (channelFilter === "email" && hasEmail);

      return matchesSearch && matchesStatus && matchesChannel;
    });
  }, [validCustomers, searchTerm, statusFilter, channelFilter]);

  const stats = useMemo(() => {
    const total = validCustomers.length;
    const active = validCustomers.filter((c) => c.isActive ?? true).length;
    const whatsapp = validCustomers.filter((c) => c.notifications?.whatsappPromotions ?? true).length;
    const email = validCustomers.filter((c) => c.notifications?.emailPromotions ?? true).length;
    return { total, active, whatsapp, email };
  }, [validCustomers]);

  const handleOpenCreateModal = () => {
    setEditingCustomer(null);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormCpf("");
    setFormActive(true);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (cust: CustomerUser) => {
    setEditingCustomer(cust);
    setFormName(cust.name);
    setFormEmail(cust.email);
    setFormPhone(cust.phone ? formatCellphone(cust.phone) : "");
    setFormCpf(cust.cpf ? formatCPF(cust.cpf) : "");
    setFormActive(cust.isActive ?? true);
    setIsFormModalOpen(true);
  };

  const handleOpenDetailsModal = async (cust: CustomerUser) => {
    setIsLoadingDetails(true);
    setSelectedCustomerDetails(cust);
    const full = await getCustomerDetails(cust.id);
    setSelectedCustomerDetails(full || cust);
    setIsLoadingDetails(false);
  };

  const handleToggleStatus = async (cust: CustomerUser) => {
    const res = await toggleCustomerStatus(cust.id);
    if (res.success) {
      toast.success(res.message || "Status do cliente alterado com sucesso!");
    } else {
      toast.error(res.message || "Não foi possível alterar o status.");
    }
  };

  const handleDelete = async (cust: CustomerUser) => {
    const confirmed = await confirm({
      title: "Remover Cliente",
      description: `Tem certeza que deseja remover o cliente "${cust.name}" (${cust.email})? Esta ação não pode ser desfeita.`,
      confirmText: "Sim, remover",
      cancelText: "Cancelar",
      variant: "destructive",
      icon: "trash",
    });

    if (!confirmed) {
      return;
    }

    const res = await deleteCustomer(cust.id);
    if (res.success) {
      toast.success("Cliente removido com sucesso.");
    } else {
      toast.error(res.message || "Erro ao remover cliente.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      toast.error("Por favor, preencha o nome e o e-mail.");
      return;
    }

    const cleanPhone = formPhone.replace(/\D/g, "");
    const cleanCpf = formCpf.replace(/\D/g, "");

    if (cleanCpf && !isValidCPF(cleanCpf)) {
      toast.error("O CPF informado é inválido. Por favor, confira os números digitados.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCustomer) {
        const res = await updateCustomer(editingCustomer.id, {
          name: formName,
          email: formEmail,
          phone: cleanPhone,
          cpf: cleanCpf,
          isActive: formActive,
        });

        if (res.success) {
          toast.success("Dados do cliente atualizados com sucesso!");
          setIsFormModalOpen(false);
        } else {
          toast.error(res.message || "Erro ao atualizar cliente.");
        }
      } else {
        const res = await createCustomer({
          name: formName,
          email: formEmail,
          phone: cleanPhone,
          cpf: cleanCpf,
          isActive: formActive,
        });

        if (res.success) {
          toast.success("Novo cliente cadastrado com sucesso!");
          setIsFormModalOpen(false);
        } else {
          toast.error(res.message || "Erro ao cadastrar cliente.");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetDefaults = async () => {
    const confirmed = await confirm({
      title: "Restaurar Clientes Padrão",
      description: "Deseja restaurar a base de clientes para os registros padrão iniciais da Zarpou?",
      confirmText: "Restaurar",
      cancelText: "Cancelar",
      variant: "warning",
      icon: "warning",
    });

    if (confirmed) {
      resetToDefaults();
      toast.success("Lista de clientes restaurada para o padrão inicial!");
    }
  };

  if (!mounted) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        Carregando base de clientes...
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
              Clientes
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-secondary/15 text-primary border border-secondary/30">
              <Users className="size-3.5" />
              Viajantes B2C
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gerencie os clientes cadastrados na Zarpou, suas preferências de notificação (WhatsApp/E-mail) e histórico de reservas.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Restaura a lista inicial de clientes padrão"
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
            Novo Cliente
          </button>
        </div>
      </div>

      {/* CARDS DE ESTATÍSTICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Total de Clientes
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.total}</p>
          </div>
          <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
            <Users className="size-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">
              Clientes Ativos
            </p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{stats.active}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <UserCheck className="size-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">
              Inscritos no WhatsApp
            </p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{stats.whatsapp}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <MessageCircle className="size-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">
              Inscritos no E-mail
            </p>
            <p className="text-2xl font-black text-indigo-700 mt-1">{stats.email}</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <Mail className="size-5" />
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
            placeholder="Buscar por nome, e-mail, CPF ou telefone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-secondary focus:border-transparent transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-secondary transition cursor-pointer"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Apenas Ativos</option>
            <option value="inactive">Apenas Inativos</option>
          </select>

          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-secondary transition cursor-pointer"
          >
            <option value="all">Todos os Canais</option>
            <option value="whatsapp">Inscrito no WhatsApp</option>
            <option value="email">Inscrito no E-mail</option>
          </select>
        </div>
      </div>

      {/* TABELA DE CLIENTES */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Cliente / Viajante</th>
                <th className="py-3.5 px-4">CPF & Telefone</th>
                <th className="py-3.5 px-4">Canais Notificação</th>
                <th className="py-3.5 px-4 text-center">Viagens / Reservas</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Ativar / Desativar</th>
                <th className="py-3.5 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Nenhum cliente encontrado com os critérios de busca.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const isActive = cust.isActive ?? true;
                  const hasWhatsapp = cust.notifications?.whatsappPromotions ?? true;
                  const hasEmail = cust.notifications?.emailPromotions ?? true;
                  const cleanPhone = cust.phone ? cust.phone.replace(/\D/g, "") : "";

                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/70 transition">
                      {/* CLIENTE */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isActive ? "bg-secondary text-primary" : "bg-slate-200 text-slate-400"
                            }`}
                          >
                            {cust.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-sm block">
                              {cust.name}
                            </span>
                            <span className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                              <Mail className="size-3 text-slate-400 shrink-0" />
                              {cust.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* CPF & TELEFONE */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-700 font-mono text-[11px]">
                            <FileText className="size-3 text-slate-400 shrink-0" />
                            {cust.cpf ? formatCPF(cust.cpf) : <span className="text-slate-400 italic font-sans">Sem CPF</span>}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Phone className="size-3 text-slate-400 shrink-0" />
                            {cust.phone ? (
                              <a
                                href={`https://wa.me/55${cleanPhone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                                title="Abrir conversa no WhatsApp"
                              >
                                {formatCellphone(cust.phone)}
                                <MessageCircle className="size-2.5 text-emerald-600" />
                              </a>
                            ) : (
                              <span className="text-slate-400 italic">Sem telefone</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* NOTIFICAÇÕES */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          {hasWhatsapp ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <MessageCircle className="size-2.5" /> WhatsApp Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-400">
                              <XCircle className="size-2.5" /> WhatsApp Inativo
                            </span>
                          )}

                          {hasEmail ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                              <Mail className="size-2.5" /> E-mail Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-400">
                              <XCircle className="size-2.5" /> E-mail Inativo
                            </span>
                          )}
                        </div>
                      </td>

                      {/* RESERVAS */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenDetailsModal(cust)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black bg-slate-100 hover:bg-secondary/20 hover:text-primary transition text-slate-700 cursor-pointer"
                          title="Clique para ver o histórico de viagens"
                        >
                          <Plane className="size-3 text-secondary" />
                          <span>{cust.totalBookings || 0}</span>
                        </button>
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-4">
                        {isActive ? (
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

                      {/* SWITCH ATIVAR / DESATIVAR */}
                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(cust)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                            isActive ? "bg-emerald-600" : "bg-slate-300"
                          }`}
                          title={
                            isActive
                              ? "Clique para desativar este cliente"
                              : "Clique para ativar este cliente"
                          }
                        >
                          <span
                            className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              isActive ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>

                      {/* AÇÕES */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenDetailsModal(cust)}
                            className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Ver detalhes e reservas"
                          >
                            <Eye className="size-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(cust)}
                            className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Editar dados cadastrais"
                          >
                            <Edit2 className="size-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(cust)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Remover cliente"
                          >
                            <Trash2 className="size-4" />
                          </button>
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
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <Users className="size-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {editingCustomer ? "Editar Dados do Cliente" : "Novo Cliente Viajante"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingCustomer
                      ? "Atualize as informações do viajante"
                      : "Cadastre um novo viajante no sistema Zarpou"}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Amanda Silva"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  E-mail do Cliente
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="amanda.silva@exemplo.com"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telefone / Celular
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(formatCellphone(e.target.value))}
                    placeholder="(11) 98765-4321"
                    maxLength={15}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      CPF
                    </label>
                    {formCpf.replace(/\D/g, "").length === 11 && (
                      isValidCPF(formCpf) ? (
                        <span className="text-[10px] font-bold text-emerald-600">✓ Válido</span>
                      ) : (
                        <span className="text-[10px] font-bold text-red-600">✕ Inválido</span>
                      )
                    )}
                  </div>
                  <input
                    type="text"
                    value={formCpf}
                    onChange={(e) => setFormCpf(formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 ${
                      formCpf.replace(/\D/g, "").length === 11 && !isValidCPF(formCpf)
                        ? "border-red-300 focus:ring-red-200 text-red-900"
                        : "border-slate-200 focus:ring-secondary"
                    }`}
                  />
                  {formCpf.replace(/\D/g, "").length === 11 && !isValidCPF(formCpf) && (
                    <p className="text-[10px] text-red-600 font-medium mt-1">
                      Dígitos verificadores do CPF não conferem.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="formActiveCustomer"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="size-4 rounded text-primary focus:ring-secondary cursor-pointer"
                />
                <label htmlFor="formActiveCustomer" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Conta de cliente ativa no portal Minhas Viagens
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Salvando..." : editingCustomer ? "Salvar Alterações" : "Cadastrar Cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE DETALHES DO CLIENTE & RESERVAS */}
      {selectedCustomerDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-secondary/20 text-primary font-bold flex items-center justify-center text-sm">
                  {selectedCustomerDetails.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">
                    {selectedCustomerDetails.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedCustomerDetails.email} • ID: {selectedCustomerDetails.id}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomerDetails(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* DADOS CADASTRAIS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    CPF
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-800 mt-0.5 block">
                    {selectedCustomerDetails.cpf ? formatCPF(selectedCustomerDetails.cpf) : "Não informado"}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Telefone
                  </span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                    {selectedCustomerDetails.phone || "Não informado"}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Data de Cadastro
                  </span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                    {selectedCustomerDetails.createdAt
                      ? new Date(selectedCustomerDetails.createdAt).toLocaleDateString("pt-BR")
                      : "Recente"}
                  </span>
                </div>
              </div>

              {/* PREFERÊNCIAS DE NOTIFICAÇÃO */}
              <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <Bell className="size-4 text-sky-600" />
                  Canais de Notificação de Promoções
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${
                      selectedCustomerDetails.notifications?.whatsappPromotions ?? true
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <MessageCircle className="size-3.5 text-emerald-600" />
                    WhatsApp: {selectedCustomerDetails.notifications?.whatsappPromotions ?? true ? "Habilitado" : "Desabilitado"}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${
                      selectedCustomerDetails.notifications?.emailPromotions ?? true
                        ? "bg-sky-100 text-sky-800 border border-sky-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Mail className="size-3.5 text-sky-600" />
                    E-mail: {selectedCustomerDetails.notifications?.emailPromotions ?? true ? "Habilitado" : "Desabilitado"}
                  </span>
                </div>
              </div>

              {/* HISTÓRICO DE RESERVAS / VIAGENS */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Plane className="size-4 text-secondary" />
                    Histórico de Viagens & Reservas ({selectedCustomerDetails.bookings?.length || selectedCustomerDetails.totalBookings || 0})
                  </h4>
                </div>

                {isLoadingDetails ? (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    Carregando reservas do cliente...
                  </p>
                ) : !selectedCustomerDetails.bookings || selectedCustomerDetails.bookings.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 text-xs">
                    Este cliente ainda não realizou reservas no sistema Zarpou.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedCustomerDetails.bookings.map((booking: CustomerBookingItem) => (
                      <div
                        key={booking.id}
                        className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/70 transition flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-primary">
                              #{booking.locator_code || booking.id}
                            </span>
                            <span className="font-bold text-slate-800">
                              {booking.booking_type === "hotel" ? "Hospedagem" : booking.booking_type === "flight" ? "Passagem Aérea" : "Pacote"}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {booking.created_at ? new Date(booking.created_at).toLocaleDateString("pt-BR") : "Data recente"}
                          </span>
                        </div>

                        <div className="text-right space-y-1">
                          <span className="font-black text-slate-900 block">
                            {booking.total_amount?.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              booking.status === "confirmed"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {booking.status === "confirmed" ? "Confirmada" : "Pendente"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCustomerDetails(null)}
                className="px-5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
