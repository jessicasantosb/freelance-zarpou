import { Container } from "@/components/shared/container";
import { Building, Car, Luggage, Plane, Ticket } from "lucide-react";

export function Menu() {
  return (
    <Container>
      <div className="py-8 flex flex-col md:flex-row text-center md:text-left items-center justify-between gap-8 min-h-[60dvh]">
        <div>
          <h2 className="text-4xl">Tudo o que você precisa, em um só lugar</h2>
          <p className="text-lg pt-4">
            Organize toda a sua viagem com praticidade e confiança
          </p>
        </div>

        <div className="bg-primary text-white p-4 md:px-24 md:py-8 rounded-lg shadow-xl flex flex-col leading-12 [&>*]:flex [&>*]:items-center [&>*]:gap-2">
          <p>
            <Plane />
            Passagens de avião
          </p>
          <p>
            <Building />
            Hospedagem
          </p>
          <p>
            <Luggage />
            Pacotes de viagens completo
          </p>
          <p>
            <Ticket />
            Ingresso para shows
          </p>
          <p>
            <Car />
            Aluguel de carros
          </p>
        </div>
      </div>
    </Container>
  );
}
