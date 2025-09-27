"use client";

import { useInView } from "react-intersection-observer";
import * as motion from "motion/react-client";

import { WhatsappLink } from "@/components/shared/whatsapp-link";
import { fromBottomVariants } from "@/lib/animation-variants";

export function FooterCta() {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className="p-6 mb-6 shadow-md shadow-black/30 flex-1 bg-primary text-white text-center overflow-hidden"
    >
      <motion.div
        animate={inView ? "visible" : "hidden"}
        variants={fromBottomVariants}
        className="h-full max-w-5xl mx-auto flex flex-col items-center justify-center"
      >
        <h1 className="text-2xl md:text-4xl font-bold">
          O melhor momento para garantir sua próxima viagem é agora
        </h1>
        <p className="py-4 text-md md:text-lg">
          Chama a Zarpou no WhatsApp e comece a planejar sem pressa (e sem peso
          no bolso).
        </p>
        <WhatsappLink>Entre em contato conosco</WhatsappLink>
      </motion.div>
    </div>
  );
}
