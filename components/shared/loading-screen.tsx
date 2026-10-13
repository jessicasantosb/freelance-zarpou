"use client";

import React from "react";
import Image from "next/image";
import { Plane, Compass, Sparkles, ShieldCheck } from "lucide-react";

interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  theme?: "light" | "dark";
  fullScreen?: boolean;
  type?: "default" | "flight" | "hotel" | "package" | "payment" | "admin";
}

export function LoadingScreen({
  title = "Preparando sua próxima viagem...",
  subtitle = "Buscando as melhores opções e tarifas na Zarpou Viagens",
  theme = "light",
  fullScreen = true,
  type = "default",
}: LoadingScreenProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={`flex flex-col items-center justify-center select-none transition-all duration-300 animate-in fade-in duration-300 ${
        fullScreen
          ? `min-h-screen min-h-[100dvh] h-screen w-full ${isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`
          : `py-12 px-4 w-full min-h-[40vh] ${isDark ? "bg-slate-900/90 text-white" : "bg-transparent text-slate-800"}`
      }`}
    >
      <div className="relative flex flex-col items-center max-w-md mx-auto text-center px-4">
        {/* ELEMENTO CENTRAL ANIMADO COM LOGO / ÍCONE */}
        <div className="relative size-20 sm:size-24 flex items-center justify-center mb-5">
          {/* Anel giratório sutil com degradê Zarpou */}
          <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-primary border-r-secondary animate-spin [animation-duration:1.2s]" />
          <div className="absolute inset-1.5 rounded-full border border-slate-200/50 dark:border-slate-800" />

          {/* Círculo central com logo/ícone */}
          <div
            className={`relative size-14 sm:size-16 rounded-full flex items-center justify-center shadow-lg transition-transform ${
              isDark ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-100"
            }`}
          >
            {type === "admin" ? (
              <Compass className="size-6 text-[#ebb343] animate-pulse" />
            ) : type === "payment" ? (
              <ShieldCheck className="size-6 text-emerald-500 animate-pulse" />
            ) : type === "flight" ? (
              <Plane className="size-6 text-primary -rotate-45 animate-pulse" />
            ) : (
              <div className="relative size-9">
                <Image
                  src="/logo/logo.svg"
                  alt="Zarpou"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>

        {/* TÍTULO PRINCIPAL */}
        <h3
          className={`text-base sm:text-lg font-bold tracking-tight ${
            isDark ? "text-white" : "text-[#05345b]"
          }`}
        >
          {title}
        </h3>

        {/* SUBTÍTULO DESCRITIVO */}
        <p
          className={`text-xs sm:text-[13px] mt-1 leading-relaxed font-normal max-w-sm ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {subtitle}
        </p>

        {/* BARRA DE PROGRESSO COM BRILHO PULSANTE */}
        <div className="w-36 sm:w-44 h-1 bg-slate-200/80 dark:bg-slate-800 rounded-full mt-4 overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#05345b] via-[#ebb343] to-[#05345b] rounded-full w-full animate-[progress_1.6s_ease-in-out_infinite]" />
        </div>

        {/* RODAPÉ DO LOADER */}
        <div className="flex items-center gap-1.5 mt-3 text-[10px] uppercase tracking-wider font-semibold text-slate-400">
          <Sparkles className="size-3 text-[#ebb343]" />
          <span>Zarpou Viagens</span>
        </div>
      </div>
    </div>
  );
}

// SKELETON REUTILIZÁVEL PARA CARDS DE PRODUTOS
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm animate-pulse space-y-4">
      <div className="w-full h-48 bg-slate-200 rounded-2xl" />
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
      </div>
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="h-6 bg-slate-200 rounded w-24" />
        <div className="h-9 bg-slate-200 rounded-xl w-28" />
      </div>
    </div>
  );
}
