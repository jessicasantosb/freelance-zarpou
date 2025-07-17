"use client";

import * as motion from "motion/react-client";
import { useInView } from "react-intersection-observer";

import { CardsContainer } from "@/components/shared/cards-container";
import { Container } from "@/components/shared/container";
import { CustomLink } from "@/components/shared/custom-link";
import { CustomImage } from "@/components/shared/image";
import { Title } from "@/components/shared/title";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { destinations } from "@/data/destinations";
import { fadeInCardVariants } from "@/lib/animation-variants";

export function TopDestination() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <Container>
      <Title
        title="Lugares Imperdíveis"
        subtitle="Altamente procurados, e prontos para te surpreender."
      />
      <div ref={ref}>
        <CardsContainer>
          {destinations.map(({ title, link, image_url }, index) => (
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
                <CardContent className="relative w-full h-72 px-0 md:px-0">
                  <div className="">
                    <CustomImage
                      alt={title}
                      src={image_url}
                      rounded="rounded-xl"
                    />
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
            </motion.div>
          ))}
        </CardsContainer>
      </div>
    </Container>
  );
}
