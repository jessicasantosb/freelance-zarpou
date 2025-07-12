import { CardsContainer } from "@/components/shared/cards-container";
import { Container } from "@/components/shared/container";
import { CustomLink } from "@/components/shared/custom-link";
import { Title } from "@/components/shared/title";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { hotels } from "@/data/hotels";
import Image from "next/image";

export function TopHotels() {
  return (
    <Container>
      <Title
        title="Hospede-se com Estilo"
        subtitle="Onde cada detalhe transforma sua experiência."
      />
        <CardsContainer>
          {hotels.map(({ title, description, link, image_url }, index) => (
            <Card key={index} className="w-full min-w-[15rem]">
              <CardHeader>
                <div className="relative w-full h-52">
                  <Image
                    alt="city"
                    src={image_url}
                    fill
                    className="absolute object-cover rounded-t-xl"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardContent>
              <CardFooter>
                <CustomLink link={link} text="Faça sua reserva" />
              </CardFooter>
            </Card>
          ))}
        </CardsContainer>
    </Container>
  );
}
