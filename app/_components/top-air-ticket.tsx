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
import { airTickets } from "@/data/air-tickets";
import { Dot } from "lucide-react";
import Link from "next/link";

export function TopAirTicket() {
  return (
    <Container>
      <Title
        title="Passagens para o Exterior"
        subtitle="Explore novos países com praticidade e ótimos preços."
      />
      <div className="py-8 flex gap-4">
        {airTickets.map(
          ({ title, description, link, departure_from }, index) => (
            <Card key={index}>
              <CardContent>
                <CardTitle>{title}</CardTitle>
                <p className="text-muted-foreground flex pb-2">
                  <Dot /> {departure_from}
                </p>
                <CardDescription>{description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button>
                  <Link href={link}>Ver passagens</Link>
                </Button>
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </Container>
  );
}
