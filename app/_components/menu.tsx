import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { Building, Car, Luggage, Plane, Ticket } from "lucide-react";
import Image from "next/image";

export function Menu() {
  return (
    <Container>
      <Title
        title="Tudo o que você precisa, em um só lugar"
        subtitle="Organize toda a sua viagem com praticidade e confiança"
      />
      <div className="pb-8 flex flex-col md:flex-row text-center md:text-left items-center justify-between gap-8 lg:min-h-[60dvh]">
        <div className="pt-12 text-xl md:text-2xl text-left text-[#393838] flex flex-col leading-14 [&>*]:flex [&>*]:items-center [&>*]:gap-2 [&_svg]:text-secondary [&_svg]:size-10">
          <p>
            <Plane /> Passagem de avião
          </p>
          <p>
            <Building /> Hospedagem
          </p>
          <p>
            <Luggage /> Pacote de viagem completo
          </p>
          <p>
            <Ticket /> Ingresso para shows
          </p>
          <p>
            <Car /> Aluguel de carros
          </p>
        </div>

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
            className="text-center text-sm text-muted-foreground italic"
          >
            ilustração por Storyset
          </a>
        </div>
      </div>
    </Container>
  );
}
