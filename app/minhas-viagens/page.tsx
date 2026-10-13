"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Hotel,
  Plane,
  Printer,
  Calendar,
  MapPin,
  Clock,
  Lock,
  LogOut,
  User,
  ArrowRight,
  BellRing,
  Star,
  Copy,
  Check,
  MessageCircle,
  X,
  Sparkles,
  Loader2,
  Compass,
  CalendarCheck2,
  BadgeCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import { useBookingStore } from "@/stores/booking-store";
import { useProductStore } from "@/stores/product-store";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";
import { Container } from "@/components/shared/container";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { CustomerProfileTab } from "./_components/customer-profile-tab";
import { Booking } from "@/types/booking";

function MinhasViagensContent() {
  const { bookings, fetchUserBookings, addBookingReview } = useBookingStore();
  const { isCustomerAuthenticated, customerUser, logout } = useCustomerAuthStore();
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<"reservas" | "perfil">(
    searchParams.get("tab") === "perfil" || searchParams.get("tab") === "notificacoes"
      ? "perfil"
      : "reservas"
  );

  // Filtro de status: "todas" | "proximas" | "concluidas" | "pendentes"
  const [statusFilter, setStatusFilter] = useState<"todas" | "proximas" | "concluidas" | "pendentes">("todas");

  // Feedback de cópia do PNR
  const [copiedPnr, setCopiedPnr] = useState<string | null>(null);

  // Modal de Avaliação de Viagem
  const [ratingModalBooking, setRatingModalBooking] = useState<Booking | null>(null);
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [hoverStars, setHoverStars] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  // Consulta por PNR rápida sem login
  const [pnrSearch, setPnrSearch] = useState("");
  const [pnrEmail, setPnrEmail] = useState("");
  const [pnrError, setPnrError] = useState("");
  const [foundBookingId, setFoundBookingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchUserBookings();
  }, [fetchUserBookings]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "perfil" || tabParam === "notificacoes") {
      setActiveTab("perfil");
    } else if (tabParam === "reservas") {
      setActiveTab("reservas");
    }
  }, [searchParams]);

  const handleCopyPnr = (locator: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(locator);
      setCopiedPnr(locator);
      toast.success(`Código localizador ${locator} copiado!`);
      setTimeout(() => {
        setCopiedPnr((prev) => (prev === locator ? null : prev));
      }, 2500);
    }
  };

  const handleOpenReviewModal = (booking: Booking) => {
    setRatingModalBooking(booking);
    setRatingStars(booking.review?.rating || 5);
    setHoverStars(0);
    setReviewComment(booking.review?.comment || "");
  };

  const handleCloseReviewModal = () => {
    if (isSubmittingReview) return;
    setRatingModalBooking(null);
    setReviewComment("");
    setHoverStars(0);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingModalBooking) return;
    setIsSubmittingReview(true);
    try {
      await addBookingReview(ratingModalBooking.id, ratingStars, reviewComment.trim() || undefined);

      // Sincronizar com a nota do hotel se houver hotel associado
      if (ratingModalBooking.hotel?.id) {
        const hotelId = ratingModalBooking.hotel.id;
        const hotel = useProductStore.getState().hotels.find((h) => h.id === hotelId);
        if (hotel) {
          const clientNote = ratingStars * 2; // escala 0 a 10
          const currentCount = hotel.reviewCount || 0;
          const currentRating = hotel.rating && hotel.rating > 0 ? hotel.rating : clientNote;
          const newRating = Number((((currentRating * currentCount) + clientNote) / (currentCount + 1)).toFixed(1));
          useProductStore.getState().updateHotel(hotelId, {
            rating: newRating,
            reviewCount: currentCount + 1,
            reviewLabel: newRating >= 9 ? "Excelente" : newRating >= 8 ? "Fabuloso" : "Bom",
          });
        }
      }

      toast.success("Avaliação registrada com sucesso! Muito obrigado pelo feedback!");
      setRatingModalBooking(null);
      setReviewComment("");
      setHoverStars(0);
    } catch {
      toast.error("Não foi possível salvar a avaliação. Tente novamente.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleSearchByPnr = (e: React.FormEvent) => {
    e.preventDefault();
    setPnrError("");

    const target = bookings.find(
      (b) =>
        b.locatorCode.trim().toLowerCase() === pnrSearch.trim().toLowerCase() &&
        (!pnrEmail || b.travelers.some((t) => t.email.toLowerCase() === pnrEmail.toLowerCase()))
    );

    if (target) {
      setFoundBookingId(target.id);
    } else {
      setPnrError("Reserva não localizada. Verifique o código localizador e o e-mail informado.");
    }
  };

  const todayStr = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split("T")[0];
  }, []);

  const isUpcoming = (b: Booking) => {
    if (b.status !== "confirmada") return false;
    if (!b.checkInDate) return true;
    return b.checkInDate >= todayStr;
  };

  const isCompleted = (b: Booking) => {
    if (b.status === "concluida") return true;
    if (b.review) return true;
    if (b.checkOutDate && b.checkOutDate < todayStr && b.status === "confirmada") return true;
    return false;
  };

  const isPending = (b: Booking) => {
    return b.status === "pendente_pagamento";
  };

  if (!mounted) {
    return (
      <LoadingScreen
        title="Acessando Área do Viajante..."
        subtitle="Buscando suas reservas e vouchers de viagem..."
        fullScreen={true}
      />
    );
  }

  // Se o cliente NÃO estiver logado:
  if (!isCustomerAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-20">
        <Container>
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                <Lock className="size-8" />
              </div>
              <h1 className="text-3xl font-black text-slate-900">
                Acesse suas Viagens
              </h1>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Para sua segurança e privacidade, faça login na sua conta Zarpou ou consulte diretamente pelo código da sua reserva.
              </p>
            </div>

            {/* OPÇÃO 1: FAZER LOGIN */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Já possui conta Zarpou?
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Fazer Login / Criar Conta
                </h2>
                <p className="text-xs text-slate-500">
                  Acesse o painel com todas as suas viagens, passagens e vouchers salvos.
                </p>
              </div>

              <Link
                href="/login?redirect=/minhas-viagens"
                className="w-full sm:w-auto px-6 py-3.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition whitespace-nowrap"
              >
                <User className="size-4" />
                Acessar com E-mail
                <ArrowRight className="size-4 text-secondary" />
              </Link>
            </div>

            {/* OPÇÃO 2: CONSULTAR POR LOCALIZADOR (PNR) */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Consulta Rápida sem Login
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  Localizar Reserva pelo Código (PNR)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Informe o código localizador recebido na confirmação da compra.
                </p>
              </div>

              {pnrError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center">
                  {pnrError}
                </div>
              )}

              <form onSubmit={handleSearchByPnr} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 uppercase">
                      Código Localizador (ex: ZRP-849201) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ZRP-XXXXXX"
                      value={pnrSearch}
                      onChange={(e) => setPnrSearch(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 font-mono uppercase text-sm font-bold outline-hidden focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 uppercase">
                      E-mail do Titular da Compra
                    </label>
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={pnrEmail}
                      onChange={(e) => setPnrEmail(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-secondary hover:bg-secondary/90 text-primary font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <Search className="size-4" />
                    Localizar Reserva
                  </button>
                </div>
              </form>

              {foundBookingId && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-emerald-800">
                      ✓ Reserva Localizada com Sucesso!
                    </p>
                    <p className="text-[11px] text-emerald-700">
                      Clique no botão para abrir e imprimir seu voucher oficial.
                    </p>
                  </div>
                  <Link
                    href={`/reserva/confirmada/${foundBookingId}`}
                    className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="size-3.5" />
                    Acessar Voucher
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Se o cliente ESTIVER logado:
  const userBookings = bookings.filter((b) => {
    if (!customerUser?.email) return true;
    return b.travelers.some(
      (t) => t.email.toLowerCase() === customerUser.email.toLowerCase()
    );
  });

  // Se o usuário não tiver compras com o e-mail dele mas houver compras no store, exibir para conveniência
  const displayBookings = userBookings.length > 0 ? userBookings : bookings;

  // Próxima Viagem mais próxima (Contagem Regressiva)
  const upcomingConfirmedBookings = displayBookings
    .filter((b) => isUpcoming(b) && b.checkInDate)
    .map((b) => {
      const [year, month, day] = (b.checkInDate || "").split("-").map(Number);
      const tripDate = new Date(year, month - 1, day);
      tripDate.setHours(0, 0, 0, 0);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const diffMs = tripDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return { booking: b, diffDays };
    })
    .filter((item) => item.diffDays >= 0)
    .sort((a, b) => a.diffDays - b.diffDays);

  const nextTrip = upcomingConfirmedBookings[0] || null;

  // Contagens para os filtros
  const proximasCount = displayBookings.filter(isUpcoming).length;
  const concluidasCount = displayBookings.filter(isCompleted).length;
  const pendentesCount = displayBookings.filter(isPending).length;

  // Filtragem ativa
  const filteredBookings = displayBookings.filter((b) => {
    if (statusFilter === "proximas") return isUpcoming(b);
    if (statusFilter === "concluidas") return isCompleted(b);
    if (statusFilter === "pendentes") return isPending(b);
    return true;
  });

  const ratingDescriptions: Record<number, string> = {
    1: "Péssimo 😞 - Deixou muito a desejar",
    2: "Ruim 😕 - Vários aspectos a melhorar",
    3: "Razoável 😐 - Atendeu ao básico prometido",
    4: "Muito Bom 😊 - Excelente experiência de viagem",
    5: "Incrível / Excelente 🤩 - Superou todas as expectativas!",
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* HEADER DO CLIENTE LOGADO */}
      <div className="bg-primary text-white py-6 shadow-md border-b border-primary/20 mb-8">
        <Container>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary font-black text-lg">
                {customerUser?.name?.charAt(0) || "U"}
              </div>
              <div>
                <h1 className="text-2xl font-bold leading-tight">
                  Olá, {customerUser?.name}!
                </h1>
                <p className="text-xs text-white/80">
                  {customerUser?.email} • Gerencie suas viagens, perfil e preferências
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition self-end sm:self-auto cursor-pointer"
            >
              <LogOut className="size-3.5" />
              Sair da Conta
            </button>
          </div>
        </Container>
      </div>

      <Container>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* NAVEGAÇÃO PRINCIPAL POR ABAS: MINHAS RESERVAS vs MEU PERFIL */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="inline-flex p-1 bg-slate-200/80 rounded-2xl gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("reservas")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activeTab === "reservas"
                    ? "bg-white text-primary shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Calendar className="size-4 text-primary" />
                <span>Minhas Viagens</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    activeTab === "reservas"
                      ? "bg-secondary text-primary"
                      : "bg-slate-300 text-slate-700"
                  }`}
                >
                  {displayBookings.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("perfil")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activeTab === "perfil"
                    ? "bg-white text-primary shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BellRing className="size-4 text-primary" />
                <span>Meu Perfil & Notificações</span>
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            </div>

            {activeTab === "reservas" && (
              <Link
                href="/hospedagens"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Planejar Nova Viagem
                <ArrowRight className="size-3.5 text-secondary" />
              </Link>
            )}
          </div>

          {activeTab === "perfil" ? (
            <CustomerProfileTab />
          ) : (
            <div className="space-y-6">
              {/* BANNER DINÂMICO: CONTAGEM REGRESSIVA PARA A PRÓXIMA VIAGEM */}
              {nextTrip && (
                <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-primary to-slate-950 text-white p-6 md:p-7 shadow-lg border border-slate-700/50">
                  {/* Efeito decorativo de fundo */}
                  <div className="absolute -top-16 -right-16 size-48 rounded-full bg-secondary/10 blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-primary/30 blur-2xl pointer-events-none" />

                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary border border-secondary/30 text-[11px] font-black uppercase tracking-wider">
                        <Sparkles className="size-3.5 text-secondary animate-spin" />
                        <span>Próxima Viagem Confirmada</span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                        {nextTrip.diffDays === 0 ? (
                          "🎉 Sua viagem é HOJE! Prepare as malas e boa viagem!"
                        ) : nextTrip.diffDays === 1 ? (
                          "✈️ Falta apenas 1 dia para o seu embarque!"
                        ) : (
                          <>Faltam apenas <span className="text-secondary">{nextTrip.diffDays} dias</span> para sua viagem!</>
                        )}
                      </h3>

                      <p className="text-xs md:text-sm text-slate-300 flex items-center gap-2">
                        <Compass className="size-4 text-secondary shrink-0" />
                        <span>
                          {nextTrip.booking.productType === "hotel"
                            ? `${nextTrip.booking.hotel?.name} • ${nextTrip.booking.hotel?.city}, ${nextTrip.booking.hotel?.state}`
                            : `${nextTrip.booking.flight?.outbound.originCity} → ${nextTrip.booking.flight?.outbound.destinationCity}`}
                        </span>
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
                        <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
                          <Calendar className="size-3.5 text-secondary" />
                          Check-in: <strong>{nextTrip.booking.checkInDate}</strong>
                        </span>
                        <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs font-mono">
                          Localizador: <strong>{nextTrip.booking.locatorCode}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                      <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center sm:text-right">
                        <div className="text-2xl md:text-3xl font-black text-secondary leading-none">
                          {nextTrip.diffDays}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                          {nextTrip.diffDays === 1 ? "dia restante" : "dias restantes"}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/reserva/confirmada/${nextTrip.booking.id}`}
                          className="px-4 py-2 bg-secondary hover:bg-secondary/90 text-primary font-black text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition whitespace-nowrap cursor-pointer"
                        >
                          <Printer className="size-3.5" />
                          Ver Voucher
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FILTROS POR STATUS */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("todas")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      statusFilter === "todas"
                        ? "bg-primary text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>Todas</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      statusFilter === "todas" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      {displayBookings.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilter("proximas")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      statusFilter === "proximas"
                        ? "bg-primary text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>🌴 Próximas</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      statusFilter === "proximas" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      {proximasCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilter("concluidas")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      statusFilter === "concluidas"
                        ? "bg-primary text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>⭐ Concluídas & Avaliações</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      statusFilter === "concluidas" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      {concluidasCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilter("pendentes")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      statusFilter === "pendentes"
                        ? "bg-primary text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>⏳ Aguardando Pagamento</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      statusFilter === "pendentes" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      {pendentesCount}
                    </span>
                  </button>
                </div>
              </div>

              {/* LISTA DE RESERVAS */}
              {filteredBookings.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
                  <div className="size-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <CalendarCheck2 className="size-8" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Nenhuma viagem encontrada nesta categoria
                  </h2>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {statusFilter !== "todas"
                      ? "Você não possui reservas correspondentes ao filtro selecionado. Mude o filtro para ver todas as suas viagens."
                      : "Suas futuras viagens, passagens aéreas e vouchers aparecerão aqui assim que você concluir uma compra."}
                  </p>
                  {statusFilter !== "todas" ? (
                    <button
                      type="button"
                      onClick={() => setStatusFilter("todas")}
                      className="px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary/90 transition shadow-sm cursor-pointer"
                    >
                      Ver Todas as Viagens
                    </button>
                  ) : (
                    <Link
                      href="/hospedagens"
                      className="inline-block px-6 py-3 bg-secondary text-primary font-bold text-xs rounded-xl hover:bg-secondary/90 transition shadow-sm"
                    >
                      Explorar Hotéis e Pacotes
                    </Link>
                  )}
                </div>
              ) : (
                filteredBookings.map((b) => {
                  const isHotel = b.productType === "hotel";
                  const title = isHotel
                    ? b.hotel?.name || "Hospedagem Zarpou"
                    : b.flight?.outbound.originCity + " → " + b.flight?.outbound.destinationCity;

                  const whatsappMessage = encodeURIComponent(
                    `Olá, equipe Zarpou! Preciso de suporte para a minha reserva com código localizador ${b.locatorCode} (${title}).`
                  );
                  const whatsappUrl = `https://wa.me/5511999999999?text=${whatsappMessage}`;

                  const isTripCompleted = isCompleted(b);

                  return (
                    <div
                      key={b.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 space-y-4"
                    >
                      {/* TOPO DO CARD: PNR, COPIAR E STATUS */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            {isHotel ? <Hotel className="size-5" /> : <Plane className="size-5" />}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Código Localizador (PNR)
                            </span>
                            <div className="flex items-center gap-2">
                              <p className="text-base font-black text-primary font-mono tracking-tight">
                                {b.locatorCode}
                              </p>
                              {/* BOTÃO COPIAR LOCALIZADOR (PNR) COM 1 CLIQUE */}
                              <button
                                type="button"
                                onClick={() => handleCopyPnr(b.locatorCode)}
                                title="Copiar código localizador"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold transition cursor-pointer"
                              >
                                {copiedPnr === b.locatorCode ? (
                                  <>
                                    <Check className="size-3 text-emerald-600 stroke-[3]" />
                                    <span className="text-emerald-700 font-bold">Copiado!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="size-3" />
                                    <span>Copiar</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {b.status === "confirmada" && isTripCompleted && (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                              <BadgeCheck className="size-3.5 text-primary" />
                              Viagem Concluída
                            </span>
                          )}

                          {b.status === "confirmada" && !isTripCompleted && (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ✓ Confirmada
                            </span>
                          )}

                          {b.status === "pendente_pagamento" && (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                              <Clock className="size-3 text-amber-600" />
                              Aguardando Pagamento
                            </span>
                          )}

                          {b.status === "concluida" && (
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                              <BadgeCheck className="size-3.5 text-primary" />
                              Viagem Concluída
                            </span>
                          )}
                        </div>
                      </div>

                      {/* CORPO DO CARD */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <div className="sm:col-span-8 space-y-1.5">
                          <h3 className="font-bold text-slate-900 text-lg leading-snug">
                            {title}
                          </h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1.5">
                            <MapPin className="size-3.5 text-primary shrink-0" />
                            {isHotel
                              ? `${b.hotel?.neighborhood || "Centro"}, ${b.hotel?.city} - ${b.hotel?.state}`
                              : `Voo ${b.flight?.outbound.airline} (${b.flight?.outbound.originIata} - ${b.flight?.outbound.destinationIata})`}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                            <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                              <Calendar className="size-3.5 text-primary" />
                              {b.checkInDate} até {b.checkOutDate}
                            </span>
                            {b.nights && (
                              <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                                <Clock className="size-3.5 text-primary" />
                                {b.nights} {b.nights === 1 ? "noite" : "noites"}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="sm:col-span-4 sm:text-right space-y-2">
                          <div>
                            <span className="text-[11px] text-slate-400">Total pago:</span>
                            <p className="text-xl font-black text-primary">
                              R$ {b.pricing.finalAmount.toFixed(2)}
                            </p>
                          </div>

                          <div className="flex flex-wrap sm:justify-end gap-2">
                            {/* BOTÃO SUPORTE WHATSAPP DEDICADO */}
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Falar com especialista sobre esta reserva"
                              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition"
                            >
                              <MessageCircle className="size-3.5 text-emerald-600" />
                              <span>Ajuda WhatsApp</span>
                            </a>

                            {/* ACESSAR VOUCHER */}
                            <Link
                              href={`/reserva/confirmada/${b.id}`}
                              className="px-3.5 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition"
                            >
                              <Printer className="size-3.5" />
                              <span>Voucher</span>
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* SEÇÃO DE AVALIAÇÃO DE ESTRELAS (PÓS-VIAGEM) */}
                      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        {b.review ? (
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="text-xs font-bold text-slate-700">
                              Sua avaliação da viagem:
                            </span>
                            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`size-3.5 ${
                                      star <= b.review!.rating
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-slate-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-black text-amber-800 ml-1">
                                {b.review.rating}.0
                              </span>
                            </div>
                            {b.review.comment && (
                              <span className="text-xs text-slate-500 italic max-w-md truncate">
                                &ldquo;{b.review.comment}&rdquo;
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenReviewModal(b)}
                              className="text-[11px] font-bold text-primary hover:underline cursor-pointer ml-1"
                            >
                              Editar Avaliação
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
                            <div className="text-xs text-slate-500 flex items-center gap-1.5">
                              <Star className="size-3.5 text-amber-500 fill-amber-400" />
                              <span>
                                {isTripCompleted
                                  ? "Como foi sua viagem? Avalie a experiência com estrelas e comente."
                                  : "Já viajou ou utilizou o serviço? Compartilhe sua avaliação."}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenReviewModal(b)}
                              className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shadow-xs"
                            >
                              <Star className="size-3.5 fill-amber-400 text-amber-400" />
                              <span>Avaliar Viagem</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </Container>

      {/* MODAL INTERATIVO DE AVALIAÇÃO COM 5 ESTRELAS */}
      {ratingModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-100 space-y-6 relative animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={handleCloseReviewModal}
              disabled={isSubmittingReview}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
            >
              <X className="size-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Feedback do Viajante
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Avaliar Experiência de Viagem
              </h3>
              <p className="text-xs text-slate-500">
                {ratingModalBooking.productType === "hotel"
                  ? ratingModalBooking.hotel?.name
                  : `${ratingModalBooking.flight?.outbound.originCity} → ${ratingModalBooking.flight?.outbound.destinationCity}`}
                {" • "}
                {ratingModalBooking.checkInDate}
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-5">
              {/* ESTRELAS INTERATIVAS (1 a 5) COM EFEITO HOVER */}
              <div className="space-y-2 text-center bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-700 block">
                  Quantas estrelas você daria para esta experiência?
                </span>

                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeScore = hoverStars || ratingStars;
                    const isFilled = star <= activeScore;

                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingStars(star)}
                        onMouseEnter={() => setHoverStars(star)}
                        onMouseLeave={() => setHoverStars(0)}
                        className="p-1 hover:scale-115 transition-transform duration-150 cursor-pointer focus:outline-hidden"
                      >
                        <Star
                          className={`size-8 transition-colors ${
                            isFilled
                              ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                              : "text-slate-300 hover:text-amber-200"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs font-bold text-primary transition-all">
                  {ratingDescriptions[hoverStars || ratingStars]}
                </p>
              </div>

              {/* COMENTÁRIO OPCIONAL */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700 block">
                  Comentário ou Dica para outros viajantes (opcional)
                </label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Conte o que mais gostou (café da manhã, conforto do quarto, atendimento da recepção, pontualidade do voo)..."
                  className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/20 transition resize-none"
                />
              </div>

              {/* BOTÕES DE AÇÃO */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseReviewModal}
                  disabled={isSubmittingReview}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition cursor-pointer disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingReview ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-white" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Star className="size-4 fill-amber-400 text-amber-400" />
                      <span>Enviar Avaliação</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MinhasViagensPage() {
  return (
    <Suspense
      fallback={
        <LoadingScreen
          title="Acessando Área do Viajante..."
          subtitle="Buscando suas reservas e vouchers de viagem..."
          fullScreen={true}
        />
      }
    >
      <MinhasViagensContent />
    </Suspense>
  );
}
