"use client";

import { useInView } from "react-intersection-observer";
import * as motion from "motion/react-client";
import { Copy } from "lucide-react";
import Image from "next/image";
import { MouseEvent } from "react";

import { ContactButton } from "@/components/shared/contact-button";
import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { textToClipboard } from "@/lib/text-to-clipboard";
import { fromBottomVariants } from "@/lib/animation-variants";

export function Questions() {
  const handleCopy = async (e: MouseEvent<HTMLButtonElement>) => {
    await textToClipboard(e.currentTarget.textContent || "");
  };

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <Container>
      <div ref={ref} className="w-full pb-12 flex flex-col items-center gap-6">
        <Title
          title="Mande uma mensagem pra gente"
          subtitle="Estaremos disponíveis para te ajudar com sua reserva. Vamos responder o mais rápido possível!"
        />

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fromBottomVariants}
          className="mt-4 text-center flex justify-center items-center flex-col md:flex-row gap-6 md:gap-12"
        >
          <div className="w-full">
            <p className="text-muted-foreground">Prefere email?</p>
            <Button variant={"link"} className="text-lg" onClick={handleCopy}>
              {process.env.NEXT_PUBLIC_EMAIL}
              <Copy />
            </Button>
          </div>
          <ContactButton>Entrar em contato</ContactButton>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fromBottomVariants}
          transition={{ delay: 0.8 }}
          className="relative size-96 md:size-[40rem] flex flex-col"
        >
          <Image
            alt="aircraft"
            src={"/question.svg"}
            fill
            className="absolute object-cover"
          />
        </motion.div>
        <a
          href="https://storyset.com/woman"
          target="_blank"
          className="-mt-12 text-center text-sm text-muted-foreground italic"
        >
          Ilustração por Storyset
        </a>
      </div>
    </Container>
  );
}
