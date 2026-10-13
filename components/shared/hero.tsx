"use client";

import { useInView } from "react-intersection-observer";
import * as motion from "motion/react-client";
import Image from "next/image";
import { useEffect, useState, ReactNode } from "react";
import { fromBottomVariants } from "@/lib/animation-variants";
import { useHeroStore } from "@/stores/hero-store";

export function Hero({
  children,
  className = "",
  contentClassName = "",
}: {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const { hero } = useHeroStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const bgType = mounted ? hero.bgType : "video";
  const bgImageUrl = mounted ? hero.bgImageUrl : "";
  const bgVideoUrl = mounted ? hero.bgVideoUrl : "/hero.mp4";

  return (
    <div
      ref={ref}
      className={`relative w-full h-[100svh] overflow-hidden select-none bg-slate-900 ${className}`}
    >
      {/* FUNDO: IMAGEM OU VÍDEO DINÂMICO CONFIGURADO NO ADMIN */}
      {bgType === "image" && bgImageUrl ? (
        <Image
          src={bgImageUrl}
          alt="Hero Background"
          fill
          priority
          unoptimized={bgImageUrl.startsWith("data:")}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      ) : (
        <video
          src={bgVideoUrl || "/hero.mp4"}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      )}

      {/* OVERLAY ESCURO PARA MÁXIMA LEGIBILIDADE */}
      <div className="absolute top-0 left-0 w-full h-full bg-slate-950/60 z-10 backdrop-blur-[1px]" />

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fromBottomVariants}
        className={`relative z-20 max-w-5xl mx-auto flex flex-col items-center gap-8 text-center text-white h-full px-4 ${
          contentClassName || "justify-center"
        }`}
      >
        {children}
      </motion.div>
    </div>
  );
}
