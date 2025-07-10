import { Hero } from "@/app/_components/hero";
import { Menu } from "./_components/menu";
import { TopChoices } from "./_components/top-choices";

export default function Home() {
  return (
    <main className="min-h-dvh">
      <Hero />
      <Menu />
      <TopChoices />
    </main>
  );
}
