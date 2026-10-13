import { Metadata } from "next";
import { Hero } from "@/components/shared/hero";
import { baseOpenGraph } from "@/constants/seo";
import { ContactHeroContent } from "./_components/contact-hero-content";
import { ContactChannels } from "./_components/contact-channels";
import { ContactForm } from "./_components/form";
import { ContactAdvisory } from "./_components/contact-advisory";
import { ContactFaq } from "./_components/contact-faq";

export const metadata: Metadata = {
  title: "Contato & Orçamentos Personalizados",
  description:
    "Fale com os consultores especialistas da Zarpou Viagens. Agência de turismo em BH pronta para desenhar seu roteiro sob medida com parcelamento em até 12x sem juros e atendimento humanizado.",
  openGraph: {
    ...baseOpenGraph,
    title: "Fale com a Zarpou Viagens - Atendimento & Cotações",
    description:
      "Agência de turismo especializada em roteiros sob medida, pacotes e passagens aéreas. Solicite seu orçamento com resposta rápida!",
    url: "/contato",
  },
};

export default function ContactPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      {/* 1. HERO COM VÍDEO/IMAGEM E APRESENTAÇÃO */}
      <Hero>
        <ContactHeroContent />
      </Hero>

      {/* 2. BARRA DE CANAIS RÁPIDOS DE CONTATO (WHATSAPP, FONE, EMAIL, SEDE) */}
      <ContactChannels />

      {/* 3. SEÇÃO PRINCIPAL EM 2 COLUNAS: FORMULÁRIO SOB MEDIDA + CONSULTORIA ZARPOU */}
      <section className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* COLUNA ESQUERDA (7 COLS): FORMULÁRIO MULTI-STEP INTELIGENTE */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* COLUNA DIREITA (5 COLS): POR QUE A ZARPOU + WHATSAPP EXPRESS + HORÁRIOS */}
          <div className="lg:col-span-5">
            <ContactAdvisory />
          </div>
        </div>
      </section>

      {/* 4. PERGUNTAS FREQUENTES (FAQ) INTERATIVO */}
      <ContactFaq />
    </main>
  );
}
