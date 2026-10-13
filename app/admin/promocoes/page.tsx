"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Tag,
  Image as ImageIcon,
  Pencil,
  X,
  RotateCcw,
  Zap,
  Bell,
  BellRing,
  MessageSquare,
  Mail,
  CheckCheck,
  Building,
  Sparkles,
  Plane,
  MapPin,
} from "lucide-react";
import { toast } from "react-toastify";
import { usePromotionStore } from "@/stores/promotion-store";
import { useProductStore } from "@/stores/product-store";
import { useDestinationStore } from "@/stores/destination-store";
import { Promotion } from "@/types/promotion";
import { api } from "@/lib/api";
import { ImageUploader } from "@/components/admin/image-uploader";
import { useConfirm } from "@/components/shared/confirm-dialog-provider";

export default function AdminPromocoesPage() {
  const { confirm } = useConfirm();
  const {
    promotions,
    fetchPromotions,
    addPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotionActive,
    markNotificationSent,
    resetPromotions,
  } = usePromotionStore();

  const { hotels, flights, fetchHotels, fetchFlights } = useProductStore();
  const { destinations, fetchDestinations } = useDestinationStore();

  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);

  // Campos do formulário
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [badge, setBadge] = useState("OFERTA EXCLUSIVA");
  const [discountText, setDiscountText] = useState("Até 30% OFF");
  const [associationType, setAssociationType] = useState<"" | "hotel" | "flight" | "destination">("");
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");
  const [selectedFlightId, setSelectedFlightId] = useState<string>("");
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>("");
  const [link, setLink] = useState("/hospedagens");
  const [buttonText, setButtonText] = useState("Aproveitar Oferta");
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    setMounted(true);
    fetchPromotions();
    if (hotels.length === 0) fetchHotels();
    if (flights.length === 0) fetchFlights();
    if (destinations.length === 0) fetchDestinations();
  }, [fetchPromotions, fetchHotels, fetchFlights, fetchDestinations, hotels.length, flights.length, destinations.length]);

  const handleSelectHotel = (hotelId: string) => {
    setSelectedHotelId(hotelId);
    if (!hotelId) return;

    const hotel = hotels.find((h) => h.id === hotelId);
    if (hotel) {
      setLink(`/hospedagens/${hotel.id}`);
      if (!imageUrl && hotel.imageUrl) {
        setImageUrl(hotel.imageUrl);
      }
      if (!title || title.trim() === "") {
        setTitle(`${hotel.name} - ${hotel.city}`);
      }
      if (!subtitle || subtitle.trim() === "") {
        setSubtitle(`Hospedagem em ${hotel.city}, ${hotel.state} com diárias a partir de R$ ${hotel.basePricePerNight}.`);
      }
    }
  };

  const handleSelectFlight = (flightId: string) => {
    setSelectedFlightId(flightId);
    if (!flightId) return;

    const flight = flights.find((f) => f.id === flightId);
    if (flight) {
      setLink(`/passagens?destination=${encodeURIComponent(flight.outbound.destinationCity)}`);
      if (!imageUrl && flight.imageUrl) {
        setImageUrl(flight.imageUrl);
      }
      if (!title || title.trim() === "") {
        setTitle(`Voo para ${flight.outbound.destinationCity} (${flight.outbound.destinationIata})`);
      }
      if (!subtitle || subtitle.trim() === "") {
        setSubtitle(`Passagem ${flight.outbound.airline} saindo de ${flight.outbound.originCity} a partir de R$ ${flight.price.toLocaleString("pt-BR")}.`);
      }
      if (flight.discountPercent && flight.discountPercent > 0) {
        setDiscountText(`${flight.discountPercent}% OFF`);
      }
    }
  };

  const handleSelectDestination = (destId: string) => {
    setSelectedDestinationId(destId);
    if (!destId) return;

    const dest = destinations.find((d) => d.id === destId);
    if (dest) {
      setLink(`/destinos?cidade=${encodeURIComponent(dest.title)}`);
      if (!imageUrl && dest.image_url) {
        setImageUrl(dest.image_url);
      }
      if (!title || title.trim() === "") {
        setTitle(`Descubra ${dest.title} - ${dest.country}`);
      }
      if (!subtitle || subtitle.trim() === "") {
        setSubtitle(dest.description || `Pacotes completos e roteiros selecionados em ${dest.title}.`);
      }
    }
  };

  // Abrir modal para criar nova promoção
  const handleOpenCreateModal = () => {
    setEditingPromoId(null);
    setTitle("");
    setSubtitle("");
    setBadge("OFERTA EXCLUSIVA");
    setDiscountText("Até 30% OFF");
    setAssociationType("");
    setSelectedHotelId("");
    setSelectedFlightId("");
    setSelectedDestinationId("");
    setLink("");
    setButtonText("Aproveitar Oferta");
    setImageUrl("");
    setNotifySubscribers(true);
    setShowModal(true);
  };

  // Abrir modal para editar promoção existente
  const handleOpenEditModal = (promo: Promotion) => {
    setEditingPromoId(promo.id);
    setTitle(promo.title || "");
    setSubtitle(promo.subtitle || "");
    setBadge(promo.badge || "OFERTA EXCLUSIVA");
    setDiscountText(promo.discountText || "");
    const currentLink = promo.link || "/hospedagens";
    setLink(currentLink);
    setButtonText(promo.buttonText || "Aproveitar Oferta");
    setImageUrl(promo.imageUrl || "");
    setNotifySubscribers(false);

    // Detecta tipo de associação existente a partir do link salvo
    if (currentLink.includes("/passagens")) {
      setAssociationType("flight");
      const matchedFlight = flights.find((f) => currentLink.toLowerCase().includes(f.outbound.destinationCity.toLowerCase()));
      setSelectedFlightId(matchedFlight ? matchedFlight.id : "");
      setSelectedHotelId("");
      setSelectedDestinationId("");
    } else if (currentLink.includes("/destinos")) {
      setAssociationType("destination");
      const matchedDest = destinations.find((d) => currentLink.toLowerCase().includes(encodeURIComponent(d.title).toLowerCase()) || currentLink.toLowerCase().includes(d.title.toLowerCase()));
      setSelectedDestinationId(matchedDest ? matchedDest.id : "");
      setSelectedHotelId("");
      setSelectedFlightId("");
    } else {
      setAssociationType("hotel");
      const matchedHotel = hotels.find((h) => currentLink.includes(h.id));
      setSelectedHotelId(matchedHotel ? matchedHotel.id : "");
      setSelectedFlightId("");
      setSelectedDestinationId("");
    }

    setShowModal(true);
  };

  // Salvar (criar ou editar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.warning("Informe o título da promoção.");
      return;
    }

    if (!associationType) {
      toast.warning("Por favor, selecione o tipo de oferta (Hospedagem, Passagem ou Destino).");
      return;
    }

    if (associationType === "hotel" && !selectedHotelId && (!link || link === "/hospedagens")) {
      toast.warning("Por favor, selecione uma hospedagem cadastrada para vincular a esta promoção.");
      return;
    }

    if (associationType === "flight" && !selectedFlightId && (!link || link === "/passagens")) {
      toast.warning("Por favor, selecione uma passagem aérea cadastrada para vincular a esta promoção.");
      return;
    }

    if (associationType === "destination" && !selectedDestinationId && (!link || link === "/destinos")) {
      toast.warning("Por favor, selecione um destino turístico para vincular a esta promoção.");
      return;
    }

    if (!imageUrl.trim()) {
      toast.error("Por favor, selecione ou envie a imagem do banner da promoção.");
      return;
    }

    try {
      if (editingPromoId) {
        // Atualizar existente
        const existingPromo = promotions.find((p) => p.id === editingPromoId);
        const isAlreadySent = existingPromo?.notificationSent;
        const shouldTriggerNow = notifySubscribers && !isAlreadySent;

        await updatePromotion(editingPromoId, {
          title: title.trim(),
          subtitle: subtitle.trim(),
          badge: badge.trim(),
          discountText: discountText.trim(),
          imageUrl: imageUrl.trim(),
          link: link.trim(),
          buttonText: buttonText.trim(),
          ...(shouldTriggerNow
            ? {
                notificationSent: true,
                notificationSentAt: new Date().toISOString(),
              }
            : {}),
        });

        if (shouldTriggerNow) {
          api.post(`/promotions/${editingPromoId}/notify`).catch(() => {});
          toast.success("Promoção atualizada e notificações disparadas aos clientes (WhatsApp e E-mail)!");
        } else {
          toast.success("Promoção atualizada com sucesso!");
        }
      } else {
        // Criar nova
        await addPromotion({
          title: title.trim(),
          subtitle: subtitle.trim(),
          badge: badge.trim(),
          discountText: discountText.trim(),
          imageUrl: imageUrl.trim(),
          link: link.trim(),
          buttonText: buttonText.trim(),
          active: true,
          order: promotions.length + 1,
          notificationSent: notifySubscribers,
          notificationSentAt: notifySubscribers ? new Date().toISOString() : undefined,
        });

        if (notifySubscribers) {
          toast.success("Promoção criada com sucesso! Notificações enviadas aos viajantes inscritos.");
        } else {
          toast.success("Promoção criada com sucesso!");
        }
      }

      setShowModal(false);
    } catch (err: unknown) {
      console.error("Erro ao salvar promoção:", err);
      const msg = err instanceof Error ? err.message : "Erro ao salvar promoção no servidor.";
      toast.error(msg);
    }
  };

  const handleNotifySubscribers = async (promo: Promotion) => {
    if (promo.notificationSent) {
      toast.warn("A notificação desta promoção já foi disparada anteriormente e só pode ser enviada uma única vez.");
      return;
    }

    markNotificationSent(promo.id);

    try {
      await api.post(`/promotions/${promo.id}/notify`);
    } catch {
      // Ignora erro se backend estiver offline
    }

    toast.success(`Notificação da promoção "${promo.title}" disparada para viajantes cadastrados (WhatsApp e E-mail)!`);
  };

  if (!mounted) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        Carregando promoções...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Promoções & Banners da Home
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Adicione e controle as ofertas em destaque exibidas para os clientes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetPromotions}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            Restaurar Padrão
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Plus className="size-4 text-secondary" />
            Nova Promoção
          </button>
        </div>
      </div>

      {/* LISTAGEM DE PROMOÇÕES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className={`group bg-white rounded-3xl border overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between ${
              promo.active
                ? "border-slate-200"
                : "border-slate-200 opacity-60 bg-slate-50/60"
            }`}
          >
            <div>
              <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                {promo.imageUrl ? (
                  <Image
                    src={promo.imageUrl}
                    alt={promo.title}
                    fill
                    unoptimized={promo.imageUrl.startsWith("data:")}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ImageIcon className="size-8" />
                  </div>
                )}

                {/* Gradiente escuro para legibilidade */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/25 pointer-events-none" />

                {/* Selos flutuantes */}
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
                  <div className="bg-secondary text-primary text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-xs flex items-center gap-1">
                    <Zap className="size-3 fill-primary text-primary" />
                    <span>{promo.badge}</span>
                  </div>

                  <div className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1 border border-emerald-400/30">
                    <Tag className="size-3" />
                    <span>{promo.discountText}</span>
                  </div>
                </div>

                {/* Título sobre a foto no rodapé do banner */}
                <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                  <h3 className="font-extrabold text-base leading-snug text-white drop-shadow-md line-clamp-1">
                    {promo.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {promo.subtitle}
                </p>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                  <span className="text-slate-400 font-medium">Destino:</span>
                  <span className="text-primary font-bold truncate max-w-[200px]">
                    {promo.link}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2 pt-3 bg-slate-50/50">
              <button
                type="button"
                onClick={async () => await togglePromotionActive(promo.id)}
                className={`text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                  promo.active ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                {promo.active ? (
                  <>
                    <CheckCircle2 className="size-4" />
                    Ativa no Site
                  </>
                ) : (
                  <>
                    <XCircle className="size-4" />
                    Pausada
                  </>
                )}
              </button>

              <div className="flex items-center gap-1">
                {promo.notificationSent ? (
                  <span
                    className="p-2 text-emerald-700 bg-emerald-100/70 rounded-lg cursor-not-allowed flex items-center"
                    title={`Notificação já enviada anteriormente${promo.notificationSentAt ? ` (${new Date(promo.notificationSentAt).toLocaleDateString("pt-BR")})` : ""}`}
                  >
                    <CheckCheck className="size-4 text-emerald-600" />
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNotifySubscribers(promo)}
                    className="p-2 text-slate-400 hover:text-emerald-600 transition rounded-lg hover:bg-emerald-50 cursor-pointer"
                    title="Disparar Notificações (WhatsApp e E-mail) - Válido 1 única vez"
                  >
                    <Bell className="size-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleOpenEditModal(promo)}
                  className="p-2 text-slate-500 hover:text-primary transition rounded-lg hover:bg-slate-100 cursor-pointer"
                  title="Editar Promoção"
                >
                  <Pencil className="size-4" />
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    const confirmed = await confirm({
                      title: "Excluir Promoção",
                      description: `Tem certeza que deseja excluir a promoção "${promo.title}"? Esta ação não pode ser desfeita.`,
                      confirmText: "Excluir",
                      cancelText: "Cancelar",
                      variant: "destructive",
                      icon: "trash",
                    });
                    if (confirmed) {
                      await deletePromotion(promo.id);
                      toast.success("Promoção excluída com sucesso!");
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-red-50 cursor-pointer"
                  title="Excluir Promoção"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL PARA ADICIONAR / EDITAR PROMOÇÃO */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* TOPO DO MODAL - FIXO */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 shrink-0 bg-white">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Tag className="size-5 text-primary" />
                {editingPromoId ? "Editar Promoção" : "Adicionar Nova Promoção"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* FORMULÁRIO COM ROLAGEM INTERNA ALINHADA À BORDA DO MODAL */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
                {/* SELEÇÃO DO TIPO DE OFERTA E SEGUNDO SELECT COM AS OPÇÕES NO TOPO */}
                <div className="space-y-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200">
                  {/* 1º SELECT: TIPO DE OFERTA */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800 uppercase flex items-center gap-1.5 text-xs">
                        <Tag className="size-4 text-primary" />
                        Tipo de Oferta (Vincular Promoção a) *
                      </label>
                      {(selectedHotelId || selectedFlightId || selectedDestinationId) && (
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          ✓ Item Vinculado com Sucesso
                        </span>
                      )}
                    </div>

                    <select
                      value={associationType}
                      onChange={(e) => {
                        const newType = e.target.value as "" | "hotel" | "flight" | "destination";
                        setAssociationType(newType);
                        setSelectedHotelId("");
                        setSelectedFlightId("");
                        setSelectedDestinationId("");
                        if (newType === "hotel") setLink("/hospedagens");
                        else if (newType === "flight") setLink("/passagens");
                        else if (newType === "destination") setLink("/destinos");
                        else setLink("");
                      }}
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold outline-hidden focus:border-primary bg-white cursor-pointer"
                    >
                      <option value="">Selecione o tipo de oferta...</option>
                      <option value="hotel">🏨 Hospedagem (Hotel / Resort)</option>
                      <option value="flight">✈️ Passagem Aérea (Voo Internacional)</option>
                      <option value="destination">📍 Destino Turístico (Cidade / Pacotes)</option>
                    </select>
                  </div>

                  {/* 2º SELECT: LISTA DE OPÇÕES CONFORME O TIPO SELECIONADO */}
                  {associationType === "hotel" && (
                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                      <label className="font-bold text-slate-700 uppercase text-[11px] flex items-center gap-1">
                        <Building className="size-3.5 text-primary" />
                        Selecione o Hotel *
                      </label>
                      <select
                        value={selectedHotelId}
                        onChange={(e) => handleSelectHotel(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold outline-hidden focus:border-primary bg-white cursor-pointer"
                      >
                        <option value="">Selecione um hotel cadastrado...</option>
                        {hotels.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.name} — {h.city}, {h.state} (R$ {h.basePricePerNight}/noite)
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Encaminhará para a página detalhada do hotel selecionado.</span>
                        {selectedHotelId && (
                          <button
                            type="button"
                            onClick={() => {
                              const h = hotels.find((hotel) => hotel.id === selectedHotelId);
                              if (h) {
                                if (h.imageUrl) setImageUrl(h.imageUrl);
                                setTitle(`${h.name} - ${h.city}`);
                                setSubtitle(`Hospedagem em ${h.city}, ${h.state} a partir de R$ ${h.basePricePerNight}/noite.`);
                                toast.info("Dados e foto do hotel preenchidos no formulário!");
                              }
                            }}
                            className="text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="size-3 text-secondary fill-secondary" />
                            Usar foto e título do hotel
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {associationType === "flight" && (
                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                      <label className="font-bold text-slate-700 uppercase text-[11px] flex items-center gap-1">
                        <Plane className="size-3.5 text-primary" />
                        Selecione a Passagem Aérea *
                      </label>
                      <select
                        value={selectedFlightId}
                        onChange={(e) => handleSelectFlight(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold outline-hidden focus:border-primary bg-white cursor-pointer"
                      >
                        <option value="">Selecione um voo internacional cadastrado...</option>
                        {flights.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.outbound.originIata} → {f.outbound.destinationIata} ({f.outbound.destinationCity}) — R$ {f.price.toLocaleString("pt-BR")} ({f.outbound.airline})
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Encaminhará para o catálogo de passagens aéreas.</span>
                        {selectedFlightId && (
                          <button
                            type="button"
                            onClick={() => {
                              const f = flights.find((flight) => flight.id === selectedFlightId);
                              if (f) {
                                if (f.imageUrl) setImageUrl(f.imageUrl);
                                setTitle(`Voo para ${f.outbound.destinationCity} (${f.outbound.destinationIata})`);
                                setSubtitle(`Passagem ${f.outbound.airline} saindo de ${f.outbound.originCity} a partir de R$ ${f.price.toLocaleString("pt-BR")}.`);
                                if (f.discountPercent) setDiscountText(`${f.discountPercent}% OFF`);
                                toast.info("Dados e foto do voo preenchidos no formulário!");
                              }
                            }}
                            className="text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="size-3 text-secondary fill-secondary" />
                            Usar foto e título do voo
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {associationType === "destination" && (
                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                      <label className="font-bold text-slate-700 uppercase text-[11px] flex items-center gap-1">
                        <MapPin className="size-3.5 text-primary" />
                        Selecione o Destino Turístico *
                      </label>
                      <select
                        value={selectedDestinationId}
                        onChange={(e) => handleSelectDestination(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold outline-hidden focus:border-primary bg-white cursor-pointer"
                      >
                        <option value="">Selecione um destino ou cidade cadastrada...</option>
                        {destinations.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.flag} {d.title} — {d.country} (A partir de R$ {d.startingPrice})
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Encaminhará para os pacotes e roteiros do destino selecionado.</span>
                        {selectedDestinationId && (
                          <button
                            type="button"
                            onClick={() => {
                              const d = destinations.find((dest) => dest.id === selectedDestinationId);
                              if (d) {
                                if (d.image_url) setImageUrl(d.image_url);
                                setTitle(`Descubra ${d.title} - ${d.country}`);
                                setSubtitle(d.description || `Pacotes completos e roteiros selecionados em ${d.title}.`);
                                toast.info("Dados e foto do destino preenchidos no formulário!");
                              }
                            }}
                            className="text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="size-3 text-secondary fill-secondary" />
                            Usar foto e título do destino
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* TÍTULO */}
                <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">
                  Título da Promoção *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Semana Santa em Porto Seguro"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
                />
              </div>

              {/* SUBTÍTULO */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">
                  Subtítulo / Descrição Curta
                </label>
                <input
                  type="text"
                  placeholder="Ex: Resorts com pensão completa e cancelamento grátis"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
                />
              </div>

              {/* BADGE E DESCONTO */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">
                    Badge de Destaque
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">
                    Texto de Desconto
                  </label>
                  <input
                    type="text"
                    value={discountText}
                    onChange={(e) => setDiscountText(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
                  />
                </div>
              </div>

              {/* IMAGEM DO BANNER COM SUPABASE STORAGE OU URL */}
              <div className="pt-2 border-t border-slate-100">
                <ImageUploader
                  value={imageUrl}
                  onChange={(url) => setImageUrl(url)}
                  folder="promocoes"
                  label="Imagem do Banner da Promoção *"
                  description="Upload para o AWS S3 / Nuvem ou URL direta externa"
                  aspectRatio="banner"
                  recommendedResolution="Recomendado 1200x600 ou 1920x1080"
                />
              </div>

              {/* PRÉVIA AO VIVO DO CARD DE BANNER */}
              {imageUrl && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="font-bold text-slate-700 uppercase text-[10px]">
                    Prévia ao vivo no site (Padrão Home):
                  </label>
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden shadow-md border border-slate-200 p-4 flex flex-col justify-between">
                    <Image
                      src={imageUrl}
                      alt="Prévia do banner"
                      fill
                      unoptimized={imageUrl.startsWith("data:")}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/30 pointer-events-none" />

                    <div className="relative z-10 flex items-start justify-between gap-2">
                      <div className="bg-secondary text-primary text-[9px] font-black px-2.5 py-1 rounded-full uppercase shadow-xs flex items-center gap-1">
                        <Zap className="size-2.5 fill-primary text-primary" />
                        <span>{badge || "OFERTA EXCLUSIVA"}</span>
                      </div>
                      <div className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                        <Tag className="size-2.5" />
                        <span>{discountText || "Até 30% OFF"}</span>
                      </div>
                    </div>

                    <div className="relative z-10 text-white space-y-1">
                      <h4 className="font-black text-base leading-snug drop-shadow-md line-clamp-1">
                        {title || "Título da sua promoção"}
                      </h4>
                      {subtitle && (
                        <p className="text-[10px] text-slate-200 line-clamp-1">
                          {subtitle}
                        </p>
                      )}
                      <div className="pt-1.5 flex items-center justify-between">
                        <span className="inline-block px-3 py-1 bg-secondary text-primary text-[10px] font-black rounded-lg shadow-xs">
                          {buttonText || "Aproveitar Oferta"} →
                        </span>
                        <span className="text-[9px] text-slate-300">
                          ✦ Em até 12x s/ juros
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LINK GERADO E TEXTO DO BOTÃO */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">
                    Link de Destino
                  </label>
                  <input
                    type="text"
                    required
                    value={link}
                    onChange={(e) => {
                      setLink(e.target.value);
                      const matched = hotels.find((h) => e.target.value.includes(h.id));
                      setSelectedHotelId(matched ? matched.id : "");
                    }}
                    placeholder="/hospedagens/hotel-..."
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-mono font-medium outline-hidden focus:border-primary bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">
                    Texto do Botão
                  </label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
                  />
                </div>
              </div>

              {/* TRIGGER DE NOTIFICAÇÃO (WHATSAPP & E-MAIL) */}
              {editingPromoId && promotions.find((p) => p.id === editingPromoId)?.notificationSent ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCheck className="size-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">
                        Notificação já enviada anteriormente aos viajantes
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Esta promoção já teve seu disparo único realizado e não pode ser reenviada.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <BellRing className="size-4.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                          Disparar notificação aos clientes cadastrados
                        </h4>
                        <p className="text-[11px] text-slate-600">
                          Envia alerta no WhatsApp e e-mail automático aos viajantes (permitido apenas 1 disparo).
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={notifySubscribers}
                        onChange={(e) => setNotifySubscribers(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1.5 border-t border-emerald-200/60">
                    <span className="flex items-center gap-1 font-semibold text-emerald-800">
                      <MessageSquare className="size-3 text-emerald-600" />
                      WhatsApp Opt-in
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-blue-800">
                      <Mail className="size-3 text-blue-600" />
                      E-mail Promocional
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* BOTÕES DE AÇÃO - FIXOS NA BASE */}
            <div className="p-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 bg-white">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition shadow-sm cursor-pointer"
                >
                  {editingPromoId ? "Salvar Alterações" : "Publicar Promoção"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
