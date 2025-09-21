import { Hero } from "@/components/shared/hero";
import { ContactForm } from "./_components/form";

export const metadata = {
  title: "Contato",
  description:
    "Fale com a Zarpou Viagens. Uma agência de viagens pronta para ajudar você a montar o roteiro ideal com atendimento ágil e suporte especializado.",
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
