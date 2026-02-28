import { Hero } from "@/components/shared/hero";
import { ContactForm } from "./_components/form";
import { baseOpenGraph } from "@/constants/seo";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato - Orçamento e Roteiros Personalizados",
  description:
    "Fale com a Zarpou Viagens. Agência de turismo pronta para ajudar você a montar o roteiro ideal com atendimento ágil, pacotes personalizados e suporte especializado.",
  openGraph: {
    ...baseOpenGraph,
    title: "Fale com a Zarpou Viagens em BH",
    description:
      "Agência de turismo pronta para ajudar você a montar o roteiro ideal. Solicite seu orçamento!",
    url: "/contato",
  },
};

export default function ContactPage() {
  return (
    <main>
      <Hero>
        <h1 className="max-w-4xl text-5xl md:text-7xl font-bold tracking-tight leading-14 md:leading-20">
          Fale com quem entende de
          <span className="text-secondary"> viagens </span>e cuida de cada
          detalhe
        </h1>
      </Hero>

      <ContactForm />
    </main>
  );
}
