import { Container } from "@/components/shared/container";
import { CustomLink } from "@/components/shared/custom-link";
import { CustomImage } from "@/components/shared/image";
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
      <div className="block relative w-dvw lg:w-[80dvw] h-72 2xl:h-96 -mb-32 -mt-8 -ml-28 sm:-mb-24 sm:-mt-0 md:-mb-16 md:-ml-72">
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
              <Card
                key={index}
                className="h-72 lg:h-44 flex-row md:gap-0 shadow-primary hover:border-primary"
              >
                <div className="relative h-full w-32 md:w-96">
                  <CustomImage alt={title} src={image_url} rounded="rounded-l-xl" />
                </div>

                <CardContent className="flex-1 flex flex-col justify-center">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <CardTitle>{title}</CardTitle>
                    <p className="text-muted-foreground flex">
                      <Dot /> {departure_from}
                    </p>
                  </div>

                  <CardDescription>
                    <p className="pt-4 lg:p-0">{description}</p>
                  </CardDescription>

                  <CardFooter className="p-0 pt-6">
                    <CustomLink link={link} text="Ver passagens" />
                  </CardFooter>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </Container>
    </>
  );
}
