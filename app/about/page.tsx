import { Container } from "@/components/shared/container";
import { aboutZarpou } from "@/data/about-zarpou";
import { ZarpouServices } from "./_components/zarpou-services";

export const metadata = {
  title: "Sobre nós",
  description: "",
};

export default function About() {
  return (
    <main>
      <Container>
        <h1 className="pt-24 text-2xl md:text-3xl font-bold">
          Sobre a Zarpou Viagens e Turismo
        </h1>

        <p className="pt-4 text-justify">{aboutZarpou}</p>

        <ZarpouServices />
      </Container>
    </main>
  );
}
