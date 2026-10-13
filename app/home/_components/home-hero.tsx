"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Hero } from "@/components/shared/hero";
import { WhatsappLink } from "@/components/shared/whatsapp-link";
import { useHeroStore } from "@/stores/hero-store";

export function HomeHero() {
  const { hero } = useHeroStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const titlePrefix = mounted ? (hero.titlePrefix ?? "") : "Seu";
  const titleHighlight = mounted ? (hero.titleHighlight ?? "") : "sonho";
  const titleSuffix = mounted
    ? (hero.titleSuffix ?? "")
    : "de viajar bem, agora é realidade";
  const subtitle = mounted
    ? (hero.subtitle ?? "")
    : "Reserve hotéis, passagens aéreas e pacotes com pagamento em até 12x sem juros e atendimento humano especializado.";
  const ctaText = mounted
    ? (hero.ctaText || "Falar com um Especialista")
    : "Falar com um Especialista";
  const ctaLink = mounted ? (hero.ctaLink || "whatsapp") : "whatsapp";

  const hasTitle = Boolean(
    titlePrefix.trim() || titleHighlight.trim() || titleSuffix.trim()
  );
  const hasSubtitle = Boolean(subtitle.trim());
  const hasText = hasTitle || hasSubtitle;

  const ctaButton =
    ctaLink === "whatsapp" ? (
      <WhatsappLink>{ctaText}</WhatsappLink>
    ) : (
      <Link
        href={ctaLink}
        className="px-8 py-4 bg-secondary hover:bg-secondary/90 text-primary font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-secondary/30 transition transform hover:scale-102"
      >
        {ctaText}
      </Link>
    );

  return (
    <Hero
      contentClassName={
        hasText
          ? "justify-center"
          : "justify-end pb-24 sm:pb-28 md:pb-32"
      }
    >
      {hasTitle && (
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-14 md:leading-20">
          {titlePrefix && <span>{titlePrefix} </span>}
          {titleHighlight && (
            <span className="text-secondary">{titleHighlight}</span>
          )}
          {titleSuffix && <span> {titleSuffix}</span>}
        </h1>
      )}

      {hasSubtitle && (
        <p className="text-xl md:text-2xl max-w-3xl">
          {subtitle}
        </p>
      )}

      {ctaButton}
    </Hero>
  );
}
