import Image from "next/image";

import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";

type MenuIconProps = {
  src: string;
  text: string;
};

export function Menu() {
  return (
    <Container>
      <Title
        title="Tudo o que você precisa, em um só lugar"
        subtitle="Organize toda a sua viagem com praticidade e confiança"
      />
      <div className="pb-8 flex flex-col md:flex-row text-center md:text-left items-center justify-between gap-8 lg:min-h-[60svh]">
        <ul className="pt-12 text-xl md:text-2xl text-left text-[#393838] flex flex-col leading-14">
          <MenuIcon src="/icons/plane.svg" text="Passagem de avião" />
          <MenuIcon src="/icons/building.svg" text="Hospedagem" />
          <MenuIcon src="/icons/luggage.svg" text="Pacote de viagem completo" />
          <MenuIcon src="/icons/ticket.svg" text="Ingresso para shows" />
          <MenuIcon src="/icons/car.svg" text="Aluguel de carros" />
        </ul>

        <div className="hidden lg:flex flex-col">
          <div className="relative size-[30rem] flex flex-col">
            <Image
              alt="aircraft"
              src={"/Trip-pana.svg"}
              fill
              className="absolute object-cover"
            />
          </div>

          <a
            href="https://storyset.com/travel"
            target="_blank"
            className="-mt-6 text-center text-sm text-muted-foreground italic"
          >
            ilustração por Storyset
          </a>
        </div>
      </div>
    </Container>
  );
}

const MenuIcon = ({ src, text }: MenuIconProps) => {
  return (
    <li className="flex items-center gap-4 py-2">
      <div className="relative size-14 flex flex-col">
        <Image alt={text} src={src} fill className="absolute object-cover" />
      </div>
      <p className="text-black/80">{text}</p>
    </li>
  );
};
