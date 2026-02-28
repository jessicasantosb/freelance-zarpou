import { About } from "./_components/about";
import { Services } from "./_components/services";
import { Hero } from "@/components/shared/hero";
import { baseOpenGraph } from "@/constants/seo";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nós - Nossa História",
  description:
    "Conheça a história da Zarpou Viagens. Somos uma agência de turismo dedicada a transformar seus sonhos de viagem em roteiros inesquecíveis, com total segurança e transparência.",
  openGraph: {
    ...baseOpenGraph,
    title: "Sobre a Zarpou Viagens",
    description:
      "Conheça nossa história. Dedicação total para planejar o seu roteiro perfeito com segurança e transparência.",
    url: "/sobre",
  },
};

export default function AboutPage() {
  return (
    <main>
      <Hero>
        <h1 className="max-w-4xl text-5xl md:text-7xl font-bold tracking-tight leading-14 md:leading-20">
          Muito mais do que uma agência: sua{" "}
          <span className="text-secondary">parceira de viagens</span> com
          segurança, personalização e suporte total
        </h1>
      </Hero>

      <About />
      <Services />
    </main>
  );
}
