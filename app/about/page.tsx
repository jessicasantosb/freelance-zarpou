import { Container } from "@/components/shared/container";
import { aboutZarpou } from "@/data/about-zarpou";
import { ZarpouServices } from "./_components/zarpou-services";

export const metadata = {
  title: "Sobre nós",
  description: "A Zarpou Viagens é uma agência de viagens de Belo Horizonte focada em roteiros personalizados, suporte confiável e experiências únicas para cada cliente.",
};

export default function About() {
  return (
    <main>
      <Container>
        <h1 className="pt-22 text-2xl md:text-3xl font-bold">
          Sobre a Zarpou Viagens e Turismo
        </h1>

        <p className="pt-4 text-justify leading-7">{aboutZarpou}</p>

        <ZarpouServices />
      </Container>
    </main>
  );
}
