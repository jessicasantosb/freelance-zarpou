import { Container } from "@/components/shared/container";
import { CustomLink } from "@/components/shared/custom-link";
import { Title } from "@/components/shared/title";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";

export function TopHotels() {
  return (
    <Container>
      <Title
        title="Hospede-se com Estilo"
        subtitle="Onde cada detalhe transforma sua experiência."
      />
      <div className="py-8 flex gap-4">
        {hotels.map(({ title, description, link, image_url }, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="relative w-full h-52 ">
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
      </div>
    </Container>
  );
}
