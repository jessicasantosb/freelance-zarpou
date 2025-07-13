"use client";

import { ContactButton } from "@/components/shared/contact-button";
import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { textToClipboard } from "@/lib/text-to-clipboard";
import { Copy } from "lucide-react";
import Image from "next/image";
import { MouseEvent } from "react";

export function Questions() {
  const handleCopy = async (e: MouseEvent<HTMLButtonElement>) => {
    await textToClipboard(e.currentTarget.textContent || '')
  };

  return (
    <Container>
      <div className="w-full pb-12 flex flex-col items-center gap-6">
        <Title
          title="Mande uma mensagem pra gente"
          subtitle="Estaremos disponíveis para te ajudar com sua reserva. Vamos responder o mais rápido possível!"
        />

        <div className="pt-4 text-center flex items-end flex-col md:flex-row gap-6 md:gap-12">
          <div>
            <p className="text-muted-foreground">Prefere email?</p>
            <Button variant={"link"} className="text-lg" onClick={handleCopy}>
              email@email.com
              <Copy />
            </Button>
          </div>
          <ContactButton>entrar em contato</ContactButton>
        </div>

        <div className="relative size-96 md:size-[40rem] flex flex-col">
          <Image
            alt="aircraft"
            src={"/question.svg"}
            fill
            className="absolute object-cover"
          />
        </div>
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
