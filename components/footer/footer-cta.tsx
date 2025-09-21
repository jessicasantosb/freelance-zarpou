"use client";

import { useInView } from "react-intersection-observer";
import * as motion from "motion/react-client";

import { ContactButton } from "@/components/shared/contact-button";
import { fromBottomVariants } from "@/lib/animation-variants";

export function FooterCta() {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className="h-[40svh] md:h-[60svh] grid grid-cols-1 md:grid-cols-2 mt-12 mb-16 shadow-xl"
    >
      <video
        src="/home/cta.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="hidden md:block w-full h-[60svh] object-cover"
      />
      <div className="flex-1 p-4 flex flex-col items-center justify-center bg-primary text-white text-center overflow-hidden">
        <motion.div
          animate={inView ? "visible" : "hidden"}
          variants={fromBottomVariants}
        >
          <h1 className="text-2xl md:text-4xl font-bold">
            O melhor momento para garantir sua próxima viagem é agora
          </h1>
          <p className="py-4 text-md md:text-lg">
            Chama a Zarpou no WhatsApp e comece a planejar sem pressa (e sem
            peso no bolso).
          </p>
          <ContactButton>Entre em contato conosco</ContactButton>
        </motion.div>
      </div>
    </div>
  );
}
