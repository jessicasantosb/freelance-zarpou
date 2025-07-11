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
import { destinations } from "@/data/destinations";
import Image from "next/image";

export function TopDestination() {
  return (
    <Container>
      <Title
        title="Lugares Imperdíveis"
        subtitle="Altamente procurados, e prontos para te surpreender."
      />
      <CardsContainer>
        {destinations.map(({ title, description, link, image_url }, index) => (
          <Card key={index} className="min-w-[15rem]">
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
              <CustomLink link={link} text="Ver mais" />
            </CardFooter>
          </Card>
        ))}
      </CardsContainer>
    </Container>
  );
}
