import { CardsContainer } from "@/components/shared/cards-container";
import { Container } from "@/components/shared/container";
import { CustomLink } from "@/components/shared/custom-link";
import { Title } from "@/components/shared/title";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
        {destinations.map(({ title, link, image_url }, index) => (
          <Card key={index} className="w-full min-w-[15rem]">
            <CardContent className="p-0">
              <div className="relative w-full h-72">
                <Image
                  alt="city"
                  src={image_url}
                  fill
                  className="absolute object-cover rounded-xl"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10 rounded-xl" />
                <div className="absolute w-full bottom-6 left-6 text-white z-20">
                  <CardTitle className="text-3xl tracking-tight">{title}</CardTitle>
                  <CustomLink link={link} text="Ver mais" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardsContainer>
    </Container>
  );
}
