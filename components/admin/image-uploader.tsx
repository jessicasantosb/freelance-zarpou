"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  Link as LinkIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink,
  Sparkles,
  CloudUpload,
} from "lucide-react";
import { toast } from "react-toastify";
import { uploadFile } from "@/lib/api";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  description?: string;
  aspectRatio?: "video" | "wide" | "square" | "banner";
  recommendedResolution?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder = "banners",
  label = "Imagem",
  description,
  aspectRatio = "wide",
  recommendedResolution = "Recomendado 1920x1080 (16:9) ou similar",
}: ImageUploaderProps) {
  // Modo de seleção: "upload" (Supabase Storage) ou "url" (link externo)
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState(value && !value.startsWith("data:") ? value : "");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadSuccessInfo, setUploadSuccessInfo] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincroniza estado de urlInput caso value mude externamente
  useEffect(() => {
    if (value && !value.startsWith("data:")) {
      setUrlInput(value);
    }
  }, [value]);

  const handleFileSelect = async (file: File) => {
    setErrorMsg(null);
    setUploadSuccessInfo(null);

    // Validação de formato
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Formato inválido. Use JPG, PNG, WEBP, GIF ou SVG.");
      return;
    }

    // Validação de tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("O arquivo deve ter no máximo 10MB.");
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadFile(file, folder);
      onChange(res.url);
      setUrlInput(res.url);
      const providerLabel =
        res.provider === "aws_s3"
          ? "AWS S3 Bucket"
          : res.provider === "cloudflare_r2"
          ? "Cloudflare R2"
          : res.provider === "supabase"
          ? "Supabase Storage"
          : "Armazenamento do Servidor";
      setUploadSuccessInfo(`Enviado com sucesso para ${providerLabel}!`);
      toast.success(`Imagem enviada para o ${providerLabel}!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Falha ao enviar imagem.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Limpa o valor do input para permitir selecionar o mesmo arquivo novamente se desejar
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleApplyUrl = () => {
    setErrorMsg(null);
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setErrorMsg("Por favor, informe a URL da imagem.");
      return;
    }

    try {
      new URL(trimmed);
    } catch {
      setErrorMsg("Informe uma URL válida (ex: https://imagens.com/foto.jpg)");
      return;
    }

    onChange(trimmed);
    setUploadSuccessInfo("URL externa configurada com sucesso!");
    toast.success("URL de imagem aplicada!");
  };

  const handleClear = () => {
    onChange("");
    setUrlInput("");
    setErrorMsg(null);
    setUploadSuccessInfo(null);
  };

  const handleCopyUrl = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      toast.info("Link copiado para a área de transferência!");
    }
  };

  // Define proporções para preview
  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square max-h-56"
      : aspectRatio === "video"
      ? "aspect-video max-h-60"
      : aspectRatio === "banner"
      ? "aspect-[21/9] max-h-56"
      : "aspect-[16/9] max-h-64";

  const isSupabaseUrl = value.includes("supabase.co/storage/v1/object/public");
  const isS3Url = value.includes("amazonaws.com") || value.includes(".s3.");
  const isR2Url = value.includes("r2.cloudflarestorage.com");

  return (
    <div className="space-y-3">
      {/* Rótulo do campo */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
            <CloudUpload className="size-3.5 text-primary" />
            {label}
          </label>
          {description && (
            <span className="text-[11px] text-slate-400 font-medium">
              {description}
            </span>
          )}
        </div>
      )}

      {/* Abas: Upload vs URL Externa */}
      <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl gap-1">
        <button
          type="button"
          onClick={() => {
            setActiveTab("upload");
            setErrorMsg(null);
          }}
          className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === "upload"
              ? "bg-white text-primary shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Upload className="size-3.5" />
          <span>Upload do Computador</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("url");
            setErrorMsg(null);
          }}
          className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === "url"
              ? "bg-white text-primary shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <LinkIcon className="size-3.5" />
          <span>Link da Web</span>
        </button>
      </div>

      {/* Conteúdo Aba 1: Upload */}
      {activeTab === "upload" && (
        <div key="image-uploader-tab-upload" className="space-y-2">
          <input
            key="image-uploader-file-input"
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={handleInputChange}
            className="hidden"
            disabled={isUploading}
          />

          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
              isDragging
                ? "border-primary bg-primary/5 scale-[0.99]"
                : "border-slate-300 hover:border-primary hover:bg-slate-50"
            } ${isUploading ? "opacity-70 pointer-events-none" : ""}`}
          >
            {isUploading ? (
              <>
                <Loader2 className="size-8 text-primary animate-spin" />
                <p className="font-bold text-slate-800 text-xs">
                  Enviando arquivo para o servidor de armazenamento...
                </p>
                <p className="text-[10px] text-slate-400">
                  Otimizando e gerando link de alta performance na CDN
                </p>
              </>
            ) : (
              <>
                <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <CloudUpload className="size-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-xs">
                    Arraste ou clique para selecionar uma imagem
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    JPG, PNG, WEBP, GIF ou SVG até 10MB • {recommendedResolution}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: URL Externa */}
      {activeTab === "url" && (
        <div key="image-uploader-tab-url" className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                key="image-uploader-url-input"
                type="url"
                placeholder="https://exemplo.com/fotos/minha-imagem.jpg"
                value={urlInput ?? ""}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyUrl();
                  }
                }}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-medium outline-hidden focus:border-primary text-slate-800 bg-white"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-4 h-11 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover transition cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <CheckCircle2 className="size-3.5" />
              Aplicar URL
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Você pode colar links diretos do Unsplash, Pexels, AWS S3, Cloudinary ou qualquer CDN.
          </p>
        </div>
      )}

      {/* Alertas de Erro ou Sucesso */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {uploadSuccessInfo && !errorMsg && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
          <span>{uploadSuccessInfo}</span>
        </div>
      )}

      {/* PRÉVIA DA IMAGEM SELECIONADA */}
      {value ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="size-3 text-secondary" />
                Prévia Atual
              </span>
              {isS3Url && (
                <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold rounded-full">
                  AWS S3 Bucket
                </span>
              )}
              {isR2Url && (
                <span className="px-2 py-0.5 bg-orange-50 text-orange-800 border border-orange-200 text-[10px] font-bold rounded-full">
                  Cloudflare R2
                </span>
              )}
              {isSupabaseUrl && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                  Supabase CDN
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition cursor-pointer flex items-center gap-1"
                title="Copiar URL direta da imagem"
              >
                <Copy className="size-3" />
                Copiar Link
              </button>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition flex items-center gap-1"
                title="Abrir imagem original"
              >
                <ExternalLink className="size-3" />
                Abrir
              </a>
              <button
                type="button"
                onClick={handleClear}
                className="px-2 py-1 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition cursor-pointer flex items-center gap-1"
                title="Remover imagem"
              >
                <X className="size-3" />
                Remover
              </button>
            </div>
          </div>

          {/* Container da Imagem */}
          <div
            className={`relative w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 ${aspectClass}`}
          >
            <Image
              src={value}
              alt="Prévia de imagem carregada"
              fill
              unoptimized={value.startsWith("data:") || value.includes("supabase.co")}
              className="object-cover"
            />
          </div>

          {/* Exibição da URL compacta */}
          <div className="p-2 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-500 font-mono truncate select-all">
            {value}
          </div>
        </div>
      ) : null}
    </div>
  );
}
