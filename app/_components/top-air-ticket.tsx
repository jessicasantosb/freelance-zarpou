import { Container } from "@/components/shared/container";
import { CustomLink } from "@/components/shared/custom-link";
import { Title } from "@/components/shared/title";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { airTickets } from "@/data/air-tickets";
import { Dot } from "lucide-react";
import Image from "next/image";

export function TopAirTicket() {
  return (
    <>
      <div className="block relative h-44 md:h-60 lg:h-96 w-full -mb-20 sm:-mb-14 lg:-mb-24 -ml-[10rem] md:-ml-[25rem] lg:-ml-[30rem]">
        <Image
          alt="aircraft"
          src={"/airplane.png"}
          fill
          className="absolute object-cover"
        />
      </div>

      <Container>
        <Title
          title="Passagens para o Exterior"
          subtitle="Explore novos países com praticidade e ótimos preços."
        />
        <div className="py-8 flex flex-col gap-6">
          {airTickets.map(
            (
              { title, description, link, departure_from, image_url },
              index
            ) => (
              <Card key={index} className="flex-row">
                <div className="relative w-96 h-52">
                  <Image
                    alt="city"
                    src={image_url}
                    fill
                    className="absolute object-cover rounded-l-xl"
                  />
                </div>
                <CardContent>
                  <CardTitle>{title}</CardTitle>
                  <p className="text-muted-foreground flex pb-2">
                    <Dot /> {departure_from}
                  </p>
                  <CardDescription>{description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <CustomLink link={link} text="Ver passagens" />
                </CardFooter>
              </Card>
            )
          )}
        </div>
      </Container>
    </>
  );
}
