import { Hero } from "./_components/hero";
import { Questions } from "./_components/questions";

export const metadata = {
  title: "Contato",
  description: "",
};

export default function Contact() {
  return (
    <main>
      <Hero />
      <Questions />
    </main>
  );
}
