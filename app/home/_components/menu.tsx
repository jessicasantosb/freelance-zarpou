"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useRef, useState, useEffect, useCallback } from "react";

import { Container } from "@/components/shared/container";
import { CustomImage } from "@/components/shared/image";
import { Title } from "@/components/shared/title";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { menuItems } from "@/data/home/menu-items";

export function Menu() {
  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));
  const [emblaRef, embla] = useEmblaCarousel({ loop: true }, [
    autoplay.current,
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
  }, [embla, onSelect]);

  const handleMouseEnter = () => autoplay.current?.stop?.();
  const handleMouseLeave = () => autoplay.current?.play?.();

  const scrollTo = (index: number) => embla?.scrollTo(index);

  return (
    <Container>
      <Title
        title="Tudo o que você precisa, em um só lugar"
        subtitle="Organize toda a sua viagem com praticidade e confiança."
      />

      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div className="overflow-hidden pt-4" ref={emblaRef}>
          <div className="flex -ml-1">
            {menuItems.map(({ src, text }, index) => (
              <div
                key={index}
                className="px-4 md:px-2 pb-2 md:pb-4 pt-4 min-w-full md:min-w-auto md:basis-1/2 lg:basis-1/3 flex-shrink-0"
              >
                <Card className="hover:scale-100 shadow-primary bg-primary/5 hover:border-primary">
                  <CardHeader className="relative w-full h-52">
                    <CustomImage alt="city" src={src} rounded="rounded-t-xl" />
                  </CardHeader>
                  <CardContent className="md:h-11 md:pb-3 pt-2 md:pt-0 text-primary">
                    <CardTitle className="flex items-center justify-center text-center h-full text-xl">
                      {text}
                    </CardTitle>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-4 gap-2">
          {menuItems.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === selectedIndex ? "bg-primary" : "bg-primary/20"
              }`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
