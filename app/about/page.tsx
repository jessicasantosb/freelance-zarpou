import { About } from "./_components/about";
import { Services } from "./_components/services";
import { Hero } from "@/components/shared/hero";

export const metadata = {
  title: "Sobre nós",
  description:
    "A Zarpou Viagens é uma agência de viagens de Belo Horizonte focada em roteiros personalizados, suporte confiável e experiências únicas para cada cliente.",
};

export default function AboutPage() {
  return (
    <main>
      <Hero>
        <h1 className="max-w-4xl text-5xl md:text-7xl font-bold tracking-tight leading-14 md:leading-20">
          Muito mais do que uma agência: sua{" "}
          <span className="text-secondary">parceira de viagens</span> com
          segurança, personalização e suporte total.
        </h1>
      </Hero>

      <About />
      <Services />
    </main>
  );
}
