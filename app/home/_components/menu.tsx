"use client";

import * as motion from "motion/react-client";
import { useInView } from "react-intersection-observer";

import { CardsContainer } from "@/components/shared/cards-container";
import { Container } from "@/components/shared/container";
import { CustomImage } from "@/components/shared/image";
import { Title } from "@/components/shared/title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInCardVariants } from "@/lib/animation-variants";
import { menuItems } from "@/data/menu-items";

export function Menu() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <Container>
      <Title
        title="Tudo o que você precisa, em um só lugar"
        subtitle="Organize toda a sua viagem com praticidade e confiança."
      />

      <div ref={ref}>
        <CardsContainer>
          {menuItems.map(({ src, text }, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={fadeInCardVariants}
              transition={{ delay: index * 0.2 }}
              className="w-full min-w-[18rem]"
            >
              <Card className="hover:scale-100 shadow-primary hover:border-primary">
                <CardHeader className="relative w-full h-52">
                  <CustomImage alt="city" src={src} rounded="rounded-t-xl" />
                </CardHeader>
                <CardContent className="h-20 pt-2">
                  <CardTitle className="flex items-start justify-center text-center h-full text-xl">
                    {text}
                  </CardTitle>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </CardsContainer>
      </div>
    </Container>
  );
}
