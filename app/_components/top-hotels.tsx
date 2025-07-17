"use client";

import * as motion from "motion/react-client";
import { useInView } from "react-intersection-observer";

import { CardsContainer } from "@/components/shared/cards-container";
import { Container } from "@/components/shared/container";
import { CustomLink } from "@/components/shared/custom-link";
import { CustomImage } from "@/components/shared/image";
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
import { fadeInCardVariants } from "@/lib/animation-variants";

export function TopHotels() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <Container>
      <Title
        title="Hospede-se com Estilo"
        subtitle="Onde cada detalhe transforma sua experiência."
      />

      <div ref={ref}>
        <CardsContainer>
          {hotels.map(({ title, description, link, image_url }, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={fadeInCardVariants}
              transition={{ delay: index * 0.2 }}
              className="w-full min-w-[15rem]"
            >
              <Card>
                <CardHeader>
                  <div className="relative w-full h-52">
                    <CustomImage
                      alt="city"
                      src={image_url}
                      rounded="rounded-t-xl"
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
            </motion.div>
          ))}
        </CardsContainer>
      </div>
    </Container>
  );
}
