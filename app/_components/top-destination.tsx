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
import { destinations } from "@/data/destinations";
import Link from "next/link";

export function TopDestination() {
  return (
    <Container>
      <Title
        title="Lugares Imperdíveis"
        subtitle="Altamente procurados, e prontos para te surpreender."
      />
      <div className="py-8 flex gap-4">
        {destinations.map(({ title, description, link }, index) => (
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
