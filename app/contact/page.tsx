import { Hero } from "./_components/hero";
import { Questions } from "./_components/questions";

export const metadata = {
  title: "Contato",
  description: "Fale com a Zarpou Viagens. Uma agência de viagens pronta para ajudar você a montar o roteiro ideal com atendimento ágil e suporte especializado.",
};

export default function Contact() {
  return (
    <main>
      <Hero />
      <Questions />
    </main>
  );
}
