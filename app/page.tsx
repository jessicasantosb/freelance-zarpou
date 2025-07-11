import { Hero } from "@/app/_components/hero";
import { Menu } from "./_components/menu";
import { TopChoices } from "./_components/top-choices";
import { Cta } from "./_components/cta";

export default function Home() {
  return (
    <main>
      <Hero />
      <Menu />
      <TopChoices />
      <Cta />
    </main>
  );
}
