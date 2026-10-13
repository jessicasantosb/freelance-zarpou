"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  X,
  Check,
  Hotel,
  Tag,
  Loader2,
  ExternalLink,
  MapPin,
  Globe,
  Sparkles,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { useDestinationStore } from "@/stores/destination-store";
import { DestinationItem } from "@/data/home/destinations";
import { ImageUploader } from "@/components/admin/image-uploader";
import { useConfirm } from "@/components/shared/confirm-dialog-provider";

const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/12039523/pexels-photo-12039523.jpeg";

const COMMON_FLAGS = [
  { flag: "🇧🇷", country: "Brasil", category: "national" as const },
  { flag: "🇦🇪", country: "Emirados Árabes", category: "international" as const },
  { flag: "🇺🇸", country: "Estados Unidos", category: "international" as const },
  { flag: "🇨🇱", country: "Chile", category: "international" as const },
  { flag: "🇦🇷", country: "Argentina", category: "international" as const },
  { flag: "🇵🇹", country: "Portugal", category: "international" as const },
  { flag: "🇮🇹", country: "Itália", category: "international" as const },
  { flag: "🇫🇷", country: "França", category: "international" as const },
  { flag: "🇯🇵", country: "Japão", category: "international" as const },
  { flag: "🇬🇧", country: "Reino Unido", category: "international" as const },
  { flag: "🇪🇸", country: "Espanha", category: "international" as const },
  { flag: "🇬🇷", country: "Grécia", category: "international" as const },
];

const SUGGESTED_TAGS = [
  "Praias Paradisíacas",
  "Ecoturismo & Natureza",
  "Luxo & Sofisticação",
  "História & Cultura",
  "Montanhas & Vinhedos",
  "Diversão em Família",
  "Romântico a Dois",
  "Aventura & Trilhas",
  "Gastronomia Exclusiva",
  "Compras & Noite",
];

const SUGGESTED_HIGHLIGHTS = [
  "Praias de Águas Cristalinas",
  "Passeios de Barco & Escuna",
  "Centro Histórico Preservado",
  "Trilhas & Mirantes Panorâmicos",
  "Mergulho com Vida Marinha",
  "Gastronomia Premiada",
  "Pôr do Sol Famoso",
  "Vida Noturna Agitada",
  "Vinícolas Renomadas",
  "Parques & Natureza Intocada",
];

const SUGGESTED_SEASONS = [
  "Ano Todo (Clima Agradável)",
  "Verão (Dez a Mar - Alta Temporada)",
  "Outono / Primavera (Clima Suave)",
  "Inverno (Para Neve, Vinhos e Fondue)",
  "Maio a Outubro (Período Seco)",
];

export default function AdminDestinosPage() {
  const { confirm } = useConfirm();
  const {
    destinations,
    fetchDestinations,
    addDestination,
    updateDestination,
    deleteDestination,
    resetDestinations,
  } = useDestinationStore();

  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"location" | "details" | "pricing" | "media">("location");

  // Formulário Completo
  const [formTitle, setFormTitle] = useState("");
  const [formCountry, setFormCountry] = useState("Brasil");
  const [formState, setFormState] = useState("");
  const [formFlag, setFormFlag] = useState("🇧🇷");
  const [formCategory, setFormCategory] = useState<"national" | "international">("national");
  const [formTag, setFormTag] = useState("Praias Paradisíacas");
  const [formDescription, setFormDescription] = useState("");
  const [formStartingPrice, setFormStartingPrice] = useState(490);
  const [formAccommodationsCount, setFormAccommodationsCount] = useState(65);
  const [formLink, setFormLink] = useState("/hospedagens");
  const [formBestTimeToVisit, setFormBestTimeToVisit] = useState("Ano Todo (Clima Agradável)");
  const [formHighlights, setFormHighlights] = useState<string[]>([
    "Praias de Águas Cristalinas",
    "Passeios de Barco & Escuna",
  ]);
  const [customHighlight, setCustomHighlight] = useState("");
  const [formImageUrl, setFormImageUrl] = useState(DEFAULT_IMAGE);

  useEffect(() => {
    setMounted(true);
    fetchDestinations();
  }, [fetchDestinations]);

  // Atualiza automaticamente o link sugerido caso o usuário altere o título e não tenha customizado
  const handleTitleChange = (newTitle: string) => {
    setFormTitle(newTitle);
    if (!editingId && (!formLink || formLink.startsWith("/hospedagens"))) {
      setFormLink(`/hospedagens?city=${encodeURIComponent(newTitle.trim())}`);
    }
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setActiveTab("location");
    setFormTitle("");
    setFormCountry("Brasil");
    setFormState("");
    setFormFlag("🇧🇷");
    setFormCategory("national");
    setFormTag("Praias Paradisíacas");
    setFormDescription(
      "Descubra paisagens deslumbrantes, gastronomia local autêntica e experiências inesquecíveis para toda a família."
    );
    setFormStartingPrice(490);
    setFormAccommodationsCount(50);
    setFormLink("/hospedagens");
    setFormBestTimeToVisit("Ano Todo (Clima Agradável)");
    setFormHighlights(["Praias de Águas Cristalinas", "Passeios de Barco & Escuna"]);
    setCustomHighlight("");
    setFormImageUrl(DEFAULT_IMAGE);
    setModalOpen(true);
  };

  const handleOpenEdit = (dest: DestinationItem) => {
    setEditingId(dest.id);
    setActiveTab("location");
    setFormTitle(dest.title);
    setFormCountry(dest.country);
    setFormState(dest.state || "");
    setFormFlag(dest.flag || "✈️");
    setFormCategory(dest.category === "international" ? "international" : "national");
    setFormTag(dest.tag || "Destaque Zarpou");
    setFormDescription(dest.description || "");
    setFormStartingPrice(dest.startingPrice || 490);
    setFormAccommodationsCount(dest.accommodationsCount || 50);
    setFormLink(dest.link || `/hospedagens?city=${encodeURIComponent(dest.title)}`);
    setFormBestTimeToVisit(dest.bestTimeToVisit || "Ano Todo (Clima Agradável)");
    setFormHighlights(
      dest.highlights && dest.highlights.length > 0
        ? dest.highlights
        : ["Roteiro Exclusivo", "Melhor Época para Visitar"]
    );
    setCustomHighlight("");
    setFormImageUrl(dest.image_url || DEFAULT_IMAGE);
    setModalOpen(true);
  };

  const toggleHighlight = (item: string) => {
    setFormHighlights((prev) =>
      prev.includes(item) ? prev.filter((h) => h !== item) : [...prev, item]
    );
  };

  const handleAddCustomHighlight = () => {
    const trimmed = customHighlight.trim();
    if (!trimmed) return;
    if (!formHighlights.includes(trimmed)) {
      setFormHighlights((prev) => [...prev, trimmed]);
    }
    setCustomHighlight("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.warning("Informe o nome da cidade ou destino turístico.");
      setActiveTab("location");
      return;
    }

    const payload: DestinationItem = {
      id: editingId || `dest-${Date.now()}`,
      title: formTitle.trim(),
      country: formCountry.trim() || "Brasil",
      state: formState.trim() || undefined,
      flag: formFlag || "✈️",
      category: formCategory,
      tag: formTag.trim() || "Destaque Zarpou",
      description: formDescription.trim(),
      startingPrice: Number(formStartingPrice) || 0,
      accommodationsCount: Number(formAccommodationsCount) || 0,
      link: formLink.trim() || `/hospedagens?city=${encodeURIComponent(formTitle.trim())}`,
      image_url: formImageUrl || DEFAULT_IMAGE,
      bestTimeToVisit: formBestTimeToVisit.trim() || undefined,
      highlights: formHighlights.filter(Boolean),
    };

    setIsSaving(true);
    try {
      if (editingId) {
        await updateDestination(editingId, payload);
        toast.success("Destino atualizado com sucesso!");
      } else {
        await addDestination(payload);
        toast.success("Novo destino cadastrado com sucesso!");
      }
      setModalOpen(false);
    } catch {
      toast.error("Erro ao salvar o destino. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        Carregando destinos...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DA PÁGINA ADMIN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-primary text-[11px] font-black uppercase tracking-wider mb-2">
            <Compass className="size-3 text-secondary fill-secondary" />
            Lugares Imperdíveis
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Destinos Turísticos
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie todas as cidades, roteiros e atrações exibidas no catálogo /destinos e na página inicial
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={async () => {
              const confirmed = await confirm({
                title: "Restaurar Destinos Padrão",
                description: "Deseja restaurar a lista original de destinos turísticos da Zarpou?",
                confirmText: "Restaurar",
                cancelText: "Cancelar",
                variant: "warning",
                icon: "warning",
              });
              if (confirmed) {
                resetDestinations();
                toast.info("Destinos padrão restaurados com sucesso!");
              }
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="size-3.5" />
            Restaurar Padrões
          </button>

          <button
            type="button"
            onClick={handleOpenNew}
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Plus className="size-4" />
            Adicionar Novo Destino
          </button>
        </div>
      </div>

      {/* LISTA DE CARDS DE DESTINOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* MINIATURA DA IMAGEM COM BADGES */}
              <div className="relative h-44 w-full bg-slate-100">
                <Image
                  src={dest.image_url}
                  alt={dest.title}
                  fill
                  unoptimized={dest.image_url.startsWith("data:")}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

                <div className="absolute top-3 left-3 bg-white/95 text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <span>{dest.flag}</span>
                  <span>{dest.country}</span>
                </div>

                <div className="absolute top-3 right-3 bg-secondary text-primary text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                  {dest.tag}
                </div>

                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="text-lg font-black leading-tight drop-shadow-xs">
                    {dest.title}
                  </h3>
                  {dest.state && (
                    <p className="text-[10px] text-white/80 font-medium">{dest.state}</p>
                  )}
                </div>
              </div>

              {/* DADOS E INFORMAÇÕES */}
              <div className="p-4 space-y-2.5">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>

                {dest.bestTimeToVisit && (
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                    <Calendar className="size-3 text-primary shrink-0" />
                    <span>{dest.bestTimeToVisit}</span>
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                    <Hotel className="size-3 text-secondary" />
                    +{dest.accommodationsCount} opções
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <Tag className="size-3" />
                    A partir de R$ {dest.startingPrice}
                  </span>
                </div>

                <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {dest.category === "national" ? "Nacional 🇧🇷" : "Internacional 🌎"}
                  </span>
                  {dest.highlights && dest.highlights.slice(0, 2).map((h) => (
                    <span
                      key={h}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AÇÕES DE RODAPÉ DO CARD */}
            <div className="p-4 pt-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
              <Link
                href={`/destinos?cidade=${encodeURIComponent(dest.title)}`}
                target="_blank"
                className="text-[11px] font-bold text-slate-500 hover:text-primary flex items-center gap-1 transition"
                title="Visualizar este destino e seus pacotes no site do cliente"
              >
                <ExternalLink className="size-3" />
                <span>Ver no site</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(dest)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-primary text-primary text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <Edit2 className="size-3.5" />
                  Editar
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    const confirmed = await confirm({
                      title: "Excluir Destino",
                      description: `Tem certeza que deseja excluir o destino "${dest.title}"? Esta ação não pode ser desfeita.`,
                      confirmText: "Excluir",
                      cancelText: "Cancelar",
                      variant: "destructive",
                      icon: "trash",
                    });
                    if (confirmed) {
                      await deleteDestination(dest.id);
                      toast.success("Destino excluído com sucesso!");
                    }
                  }}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE CRIAÇÃO / EDIÇÃO COMPLETO EM ABAS */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-hidden">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 border border-slate-200">
            {/* CABEÇALHO DO MODAL */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70 shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-primary text-secondary flex items-center justify-center shadow-xs">
                  <Compass className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    {editingId ? "Editar Destino Turístico" : "Cadastrar Novo Destino"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Configure cidades, atrativos, melhor época para viajar, preços e fotos em alta definição
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="size-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* NAVEGAÇÃO ENTRE ABAS */}
            <div className="flex border-b border-slate-200 bg-white px-5 pt-2 gap-2 overflow-x-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("location")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === "location"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <MapPin className="size-3.5" />
                1. Localização & Identificação
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === "details"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <Sparkles className="size-3.5" />
                2. Roteiro, Descrição & Atrativos
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("pricing")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === "pricing"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <Tag className="size-3.5" />
                3. Tarifas, Hospedagens & Link
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("media")}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                  activeTab === "media"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <Globe className="size-3.5" />
                4. Imagem & Prévia ao Vivo
              </button>
            </div>

            {/* FORMULÁRIO COM ROLAGEM */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* ABA 1: LOCALIZAÇÃO & IDENTIFICAÇÃO */}
              {activeTab === "location" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="p-3 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between text-xs">
                    <span className="font-bold text-primary flex items-center gap-1.5">
                      <MapPin className="size-4 text-secondary" />
                      Dados Geográficos do Destino
                    </span>
                    <span className="text-slate-500 font-medium">Campos com * são obrigatórios</span>
                  </div>

                  {/* Nome da Cidade e Estado */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Nome da Cidade / Destino *
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Ex: Armação dos Búzios, Fernando de Noronha, Paris..."
                        className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-bold text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Estado / Província
                      </label>
                      <input
                        type="text"
                        value={formState}
                        onChange={(e) => setFormState(e.target.value)}
                        placeholder="Ex: Rio de Janeiro, Île-de-France..."
                        className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-medium"
                      />
                    </div>
                  </div>

                  {/* País, Bandeira e Categoria */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        País *
                      </label>
                      <input
                        type="text"
                        required
                        value={formCountry}
                        onChange={(e) => setFormCountry(e.target.value)}
                        placeholder="Ex: Brasil"
                        className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Bandeira (Emoji)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={formFlag}
                          onChange={(e) => setFormFlag(e.target.value)}
                          className="w-14 h-10 text-center text-lg rounded-xl border border-slate-200 outline-hidden focus:border-primary"
                        />
                        <div className="flex flex-wrap gap-1">
                          {COMMON_FLAGS.slice(0, 5).map((f) => (
                            <button
                              key={f.flag}
                              type="button"
                              onClick={() => {
                                setFormFlag(f.flag);
                                setFormCountry(f.country);
                                setFormCategory(f.category);
                              }}
                              className="size-8 rounded-lg border border-slate-200 text-sm hover:bg-slate-100 transition cursor-pointer flex items-center justify-center"
                              title={f.country}
                            >
                              {f.flag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Categoria do Destino *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormCategory("national")}
                          className={`h-10 text-xs font-bold rounded-xl border transition cursor-pointer flex items-center justify-center gap-1 ${
                            formCategory === "national"
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <span>🇧🇷</span> Nacional
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormCategory("international")}
                          className={`h-10 text-xs font-bold rounded-xl border transition cursor-pointer flex items-center justify-center gap-1 ${
                            formCategory === "international"
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <span>🌎</span> Exterior
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tag Principal / Selo de Destaque */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Tag Principal / Selo do Card *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTag}
                      onChange={(e) => setFormTag(e.target.value)}
                      placeholder="Ex: Praias Paradisíacas"
                      className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-bold text-primary"
                    />

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] font-semibold text-slate-400 py-1">Sugestões:</span>
                      {SUGGESTED_TAGS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormTag(t)}
                          className={`text-[10px] px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                            formTag === t
                              ? "bg-secondary text-primary font-bold"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 2: ROTEIRO, DESCRIÇÃO & ATRATIVOS */}
              {activeTab === "details" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Descrição do Destino */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Descrição Completa do Destino *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Conte sobre os encantos da cidade, a culinária, as belezas naturais e por que o turista deve visitar..."
                      className="w-full p-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary resize-none font-medium leading-relaxed"
                    />
                  </div>

                  {/* Melhor Época para Visitar */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-primary" />
                      Melhor Época para Visitar (Temporada)
                    </label>
                    <input
                      type="text"
                      value={formBestTimeToVisit}
                      onChange={(e) => setFormBestTimeToVisit(e.target.value)}
                      placeholder="Ex: Dezembro a Março (Verão) ou Ano Todo"
                      className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-medium"
                    />

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {SUGGESTED_SEASONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setFormBestTimeToVisit(s)}
                          className={`text-[10px] px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                            formBestTimeToVisit === s
                              ? "bg-primary text-white font-bold"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Atrativos e Pontos Turísticos (Highlights) */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-secondary" />
                      Pontos Turísticos & Experiências Imperdíveis
                    </label>

                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_HIGHLIGHTS.map((item) => {
                        const active = formHighlights.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleHighlight(item)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                              active
                                ? "bg-primary text-white shadow-2xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {active && <Check className="size-3" />}
                            {item}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customHighlight}
                        onChange={(e) => setCustomHighlight(e.target.value)}
                        placeholder="Adicionar atração específica (ex: Praia da Ferradura, Teleférico)..."
                        className="flex-1 h-10 px-3 text-xs rounded-xl border border-slate-200"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustomHighlight();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomHighlight}
                        className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 3: TARIFAS, HOSPEDAGENS & LINK */}
              {activeTab === "pricing" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                        <Tag className="size-3 text-emerald-600" />
                        Preço a partir de (R$) *
                      </label>
                      <input
                        type="number"
                        required
                        value={formStartingPrice}
                        onChange={(e) => setFormStartingPrice(Number(e.target.value))}
                        placeholder="Ex: 520"
                        className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-bold text-emerald-600"
                      />
                      <p className="text-[10px] text-slate-400">
                        Valor de referência para diárias ou pacotes promocionais deste destino.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                        <Hotel className="size-3 text-primary" />
                        Acomodações Disponíveis *
                      </label>
                      <input
                        type="number"
                        required
                        value={formAccommodationsCount}
                        onChange={(e) => setFormAccommodationsCount(Number(e.target.value))}
                        placeholder="Ex: 85"
                        className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-primary font-semibold"
                      />
                      <p className="text-[10px] text-slate-400">
                        Exibido nos cards como &quot;+{formAccommodationsCount} opções de hospedagens&quot;.
                      </p>
                    </div>
                  </div>

                  {/* Configuração de Link e Redirecionamento */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
                        <LinkIcon className="size-3.5 text-primary" />
                        Link de Redirecionamento ao Clicar
                      </label>
                      <span className="text-[11px] text-slate-400">Para onde o cliente vai</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFormLink(
                            `/hospedagens?city=${encodeURIComponent(formTitle.trim() || "Brasil")}`
                          )
                        }
                        className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-xl transition cursor-pointer"
                      >
                        🏨 Filtrar Hospedagens da Cidade
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setFormLink(
                            `/destinos?cidade=${encodeURIComponent(formTitle.trim() || "Brasil")}`
                          )
                        }
                        className="text-xs font-bold text-secondary bg-secondary/20 hover:bg-secondary/30 px-3 py-1.5 rounded-xl transition cursor-pointer text-slate-800"
                      >
                        🧭 Ver Pacotes em /destinos
                      </button>
                    </div>

                    <input
                      type="text"
                      required
                      value={formLink}
                      onChange={(e) => setFormLink(e.target.value)}
                      placeholder="/hospedagens?city=NomeDaCidade"
                      className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-white font-mono text-slate-700"
                    />
                  </div>
                </div>
              )}

              {/* ABA 4: FOTO & PRÉVIA AO VIVO */}
              {activeTab === "media" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <ImageUploader
                    value={formImageUrl}
                    onChange={(url) => setFormImageUrl(url)}
                    folder="destinos"
                    label="Foto Principal do Destino *"
                    description="Upload direto para o Supabase Storage ou link web em alta definição"
                    aspectRatio="video"
                    recommendedResolution="Recomendado 1200x800 ou 800x600 em alta resolução"
                  />

                  {/* PRÉVIA AO VIVO DO CARD */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-secondary" />
                      Prévia ao Vivo do Card (Como aparecerá para o viajante)
                    </p>

                    <div className="max-w-sm mx-auto bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md">
                      <div className="relative h-44 w-full bg-slate-100">
                        <Image
                          src={formImageUrl || DEFAULT_IMAGE}
                          alt={formTitle || "Prévia"}
                          fill
                          unoptimized={formImageUrl.startsWith("data:")}
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

                        <div className="absolute top-3 left-3 bg-white/95 text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <span>{formFlag}</span>
                          <span>{formCountry || "País"}</span>
                        </div>

                        <div className="absolute top-3 right-3 bg-secondary text-primary text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                          {formTag || "Destaque"}
                        </div>

                        <div className="absolute bottom-3 left-3 text-white">
                          <h3 className="text-lg font-black leading-tight drop-shadow-xs">
                            {formTitle || "Nome da Cidade"}
                          </h3>
                          {formState && (
                            <p className="text-[10px] text-white/80 font-medium">{formState}</p>
                          )}
                        </div>
                      </div>

                      <div className="p-4 space-y-2.5">
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {formDescription || "Descrição curta do destino..."}
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                            <Hotel className="size-3 text-secondary" />
                            +{formAccommodationsCount} opções
                          </span>
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                            <Tag className="size-3" />
                            A partir de R$ {formStartingPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BOTÕES DE AÇÃO NA BASE DO MODAL */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 shrink-0">
                <div className="flex items-center gap-2">
                  {activeTab !== "location" && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === "details") setActiveTab("location");
                        if (activeTab === "pricing") setActiveTab("details");
                        if (activeTab === "media") setActiveTab("pricing");
                      }}
                      className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                    >
                      ← Aba Anterior
                    </button>
                  )}
                  {activeTab !== "media" && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === "location") setActiveTab("details");
                        if (activeTab === "details") setActiveTab("pricing");
                        if (activeTab === "pricing") setActiveTab("media");
                      }}
                      className="px-4 py-2 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition cursor-pointer"
                    >
                      Próxima Aba →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer"
                  >
                    {isSaving ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Check className="size-4" />
                    )}
                    {isSaving
                      ? "Salvando..."
                      : editingId
                      ? "Salvar Alterações"
                      : "Cadastrar Destino Completo"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
