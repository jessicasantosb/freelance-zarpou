import { CardsContainer } from "@/components/shared/cards-container";
import { Container } from "@/components/shared/container";
import { CustomLink } from "@/components/shared/custom-link";
import { CustomImage } from "@/components/shared/image";
import { Title } from "@/components/shared/title";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { destinations } from "@/data/destinations";

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
            <CardContent className="px-0 md:px-0">
              <div className="relative w-full h-72">
                <CustomImage alt={title} src={image_url} rounded="rounded-xl" />
                <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10 rounded-xl" />
                <div className="absolute bottom-6 left-6 text-white z-20">
                  <CardTitle className="text-3xl tracking-tight">
                    {title}
                  </CardTitle>
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
