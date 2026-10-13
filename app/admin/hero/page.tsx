"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  RotateCcw,
  Check,
  Video,
  ImageIcon,
  Sparkles,
  MessageCircle,
  Eye,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useHeroStore, HeroConfig } from "@/stores/hero-store";
import { ImageUploader } from "@/components/admin/image-uploader";
import { useConfirm } from "@/components/shared/confirm-dialog-provider";

export default function AdminHeroPage() {
  const { hero, updateHero, resetHero, fetchHero } = useHeroStore();
  const { confirm } = useConfirm();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<HeroConfig>(hero);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchHero();
  }, [fetchHero]);

  useEffect(() => {
    setMounted(true);
    setFormData(hero);
  }, [hero]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await Promise.all([
        updateHero(formData),
        new Promise((resolve) => setTimeout(resolve, 350)),
      ]);
      setSaved(true);
      toast.success("Alterações do Hero salvas com sucesso!");
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      console.error("Erro ao salvar Hero:", err);
      const msg = err instanceof Error ? err.message : "Ocorreu um erro ao salvar o Hero.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const confirmed = await confirm({
      title: "Restaurar Hero Original",
      description: "Deseja restaurar as configurações originais do Hero da página inicial?",
      confirmText: "Restaurar",
      cancelText: "Cancelar",
      variant: "warning",
      icon: "warning",
    });

    if (confirmed) {
      setIsSaving(true);
      try {
        resetHero();
        const fresh = useHeroStore.getState().hero;
        setFormData(fresh);
        await updateHero(fresh);
        setSaved(true);
        toast.success("Hero restaurado para o padrão original!");
        setTimeout(() => setSaved(false), 2500);
      } catch {
        toast.error("Erro ao restaurar o Hero.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleClearTexts = () => {
    setFormData((prev) => ({
      ...prev,
      titlePrefix: "",
      titleHighlight: "",
      titleSuffix: "",
      subtitle: "",
    }));
    toast.info("Campos de texto limpos. Clique em Salvar para aplicar.");
  };

  if (!mounted) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        Carregando configurações do Hero...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Gestão do Hero Principal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Personalize os títulos, textos de destaque, imagem de fundo ou vídeo e botões da primeira dobra do site
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
          Hero atualizado com sucesso! As alterações já estão visíveis na página inicial.
        </div>
      )}

      {/* PRÉVIA AO VIVO DO HERO */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-md text-white space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="size-4 text-secondary" />
            Prévia em Tempo Real na Home
          </span>
          <span className="text-[10px] text-slate-400">
            Fundo atual: {formData.bgType === "image" ? "Imagem" : "Vídeo"}
          </span>
        </div>

        {(() => {
          const hasPreviewTitle = Boolean(
            (formData.titlePrefix || "").trim() ||
            (formData.titleHighlight || "").trim() ||
            (formData.titleSuffix || "").trim()
          );
          const hasPreviewSubtitle = Boolean((formData.subtitle || "").trim());
          const hasPreviewText = hasPreviewTitle || hasPreviewSubtitle;

          return (
            <div
              className={`relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden flex flex-col items-center text-center p-6 border border-white/10 shadow-inner ${
                hasPreviewText ? "justify-center" : "justify-end pb-6"
              }`}
            >
              {formData.bgType === "image" && formData.bgImageUrl ? (
                <Image
                  src={formData.bgImageUrl}
                  alt="Prévia Hero"
                  fill
                  unoptimized={formData.bgImageUrl.startsWith("data:")}
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                  <span className="text-slate-400 text-xs">
                    🎥 Vídeo de Fundo ({formData.bgVideoUrl || "/hero.mp4"})
                  </span>
                </div>
              )}

              {/* Overlay escuro */}
              <div className="absolute inset-0 bg-slate-950/65 pointer-events-none" />

              {!hasPreviewText && (
                <div className="absolute top-3 left-3 z-20">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-xs text-[10px] font-semibold text-secondary rounded-full border border-white/10">
                    Modo Fundo Limpo • Botão na parte inferior
                  </span>
                </div>
              )}

              {/* Conteúdo sobreposto */}
              <div className={`relative z-10 max-w-lg ${hasPreviewText ? "space-y-3" : ""}`}>
                {hasPreviewTitle && (
                  <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                    {formData.titlePrefix && `${formData.titlePrefix} `}
                    {formData.titleHighlight && (
                      <span className="text-secondary underline decoration-secondary/50">
                        {formData.titleHighlight}
                      </span>
                    )}
                    {formData.titleSuffix && ` ${formData.titleSuffix}`}
                  </h2>
                )}

                {hasPreviewSubtitle && (
                  <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed">
                    {formData.subtitle}
                  </p>
                )}

                <div className={hasPreviewText ? "pt-2" : ""}>
                  <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary text-primary font-black text-xs rounded-xl shadow-lg shadow-secondary/30">
                    <MessageCircle className="size-3.5" />
                    {formData.ctaText || "Falar com um Especialista"}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* BLOCO 1: TEXTOS & TÍTULOS */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Sparkles className="size-4 text-primary" />
              Títulos e Chamada Principal (Opcional)
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                Deixe vazio para fundo limpo com botão na parte inferior da dobra
              </span>
              <button
                type="button"
                onClick={handleClearTexts}
                className="text-[11px] font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-lg border border-slate-200 transition cursor-pointer"
                title="Limpar todos os campos de texto do Hero"
              >
                Limpar Textos
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase">
                Início do Título (Prefixo - Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Seu (ou deixe vazio)"
                value={formData.titlePrefix}
                onChange={(e) =>
                  setFormData({ ...formData, titlePrefix: e.target.value })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase flex items-center justify-between">
                <span>Palavra em Destaque (Opcional)</span>
              </label>
              <input
                type="text"
                placeholder="Ex: sonho (ou deixe vazio)"
                value={formData.titleHighlight}
                onChange={(e) =>
                  setFormData({ ...formData, titleHighlight: e.target.value })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-secondary/70 bg-secondary/5 text-sm font-bold text-slate-900 outline-hidden focus:border-secondary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase">
                Final do Título (Sufixo - Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: de viajar bem... (ou deixe vazio)"
                value={formData.titleSuffix}
                onChange={(e) =>
                  setFormData({ ...formData, titleSuffix: e.target.value })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 uppercase">
              Subtítulo / Descrição Explicativa (Opcional)
            </label>
            <textarea
              rows={3}
              placeholder="Digite a descrição da agência ou deixe em branco para manter a imagem limpa..."
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              className="w-full p-3.5 rounded-xl border border-slate-300 text-xs font-medium outline-hidden focus:border-primary leading-relaxed"
            />
          </div>
        </div>

        {/* BLOCO 2: FUNDO (IMAGEM OU VÍDEO) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <ImageIcon className="size-4 text-primary" />
              Mídia de Fundo do Hero (Imagem ou Vídeo)
            </div>

            {/* SELETOR IMAGEM VS VÍDEO */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, bgType: "image" })
                }
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  formData.bgType === "image"
                    ? "bg-white text-primary shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ImageIcon className="size-3.5" />
                Imagem de Fundo
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, bgType: "video" })
                }
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  formData.bgType === "video"
                    ? "bg-white text-primary shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Video className="size-3.5" />
                Vídeo de Fundo
              </button>
            </div>
          </div>

          {/* CONFIGURAÇÃO SE FOR IMAGEM */}
          {formData.bgType === "image" && (
            <ImageUploader
              value={formData.bgImageUrl}
              onChange={(url) => setFormData({ ...formData, bgImageUrl: url, bgType: "image" })}
              folder="hero"
              label="Imagem de Fundo do Hero"
              description="A imagem será exibida em alta resolução na primeira dobra da página inicial."
              aspectRatio="wide"
              recommendedResolution="Recomendado 1920x1080 (16:9)"
            />
          )}

          {/* CONFIGURAÇÃO SE FOR VÍDEO */}
          {formData.bgType === "video" && (
            <div className="space-y-2">
              <label className="font-bold text-slate-700 uppercase">
                Caminho ou URL do Vídeo de Fundo
              </label>
              <input
                type="text"
                placeholder="/hero.mp4 ou URL de vídeo MP4"
                value={formData.bgVideoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, bgVideoUrl: e.target.value })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
              />
              <p className="text-[10px] text-slate-400">
                Padrão: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">/hero.mp4</code>. O vídeo roda em loop silencioso de fundo.
              </p>
            </div>
          )}
        </div>

        {/* BLOCO 3: BOTÃO DE AÇÃO (CTA) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <MessageCircle className="size-4 text-primary" />
            Botão de Chamada para Ação (CTA)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase">
                Texto do Botão
              </label>
              <input
                type="text"
                value={formData.ctaText}
                onChange={(e) =>
                  setFormData({ ...formData, ctaText: e.target.value })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-medium outline-hidden focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase">
                Destino do Botão
              </label>
              <select
                value={formData.ctaLink}
                onChange={(e) =>
                  setFormData({ ...formData, ctaLink: e.target.value })
                }
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold outline-hidden focus:border-primary bg-white cursor-pointer"
              >
                <option value="whatsapp">Abrir WhatsApp Oficial da Agência</option>
                <option value="/hospedagens">Abrir Catálogo de Hospedagens</option>
                <option value="/passagens">Abrir Busca de Passagens</option>
                <option value="/pacotes">Abrir Pacotes de Viagem</option>
                <option value="/contato">Abrir Formulário de Contato</option>
              </select>
            </div>
          </div>
        </div>

        {/* BOTÃO FIXO DE SALVAMENTO */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 bg-secondary hover:bg-secondary/90 disabled:opacity-60 disabled:cursor-not-allowed text-primary font-black text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-secondary/30 transition transform hover:scale-102 active:scale-95 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Salvando alterações...
              </>
            ) : (
              <>
                <Save className="size-4" />
                Salvar Alterações do Hero
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
