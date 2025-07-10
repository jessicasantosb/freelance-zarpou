import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { hotels } from "@/data/hotels";
import Link from "next/link";

export function TopHotels() {
  return (
    <Container>
      <Title
        title="Hospede-se com Estilo"
        subtitle="Onde cada detalhe transforma sua experiência."
      />
      <div className="py-8 flex gap-4">
        {hotels.map(({ title, description, link }, index) => (
          <Card key={index}>
            <CardContent>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button>
                <Link href={link}>Faça sua reserva</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Container>
  );
}
