"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useInfoStore } from "@/stores/info-store";
import { generateDataLink } from "@/lib/generate-whatsapp-link";

export function StepFinish() {
  const { client, destinationInfo, travelInfo } = useInfoStore(
    (state) => state
  );

  const link = generateDataLink({ client, destinationInfo, travelInfo });

  return (
    <div className="flex flex-col gap-4 text-center">
      <p>
        Quase lá! <strong>{client.name}</strong>!
      </p>
      <p>Envie seus dados e vamos cuidar de todos os detalhes da sua viagem.</p>
      <Button className="bg-[#075e54] text-[#ece5dd] hover:bg-[#128c7e]">
        <Link href={link} target="_blank" className="w-full h-full">
          Enviar para o Whatsapp
        </Link>
      </Button>
    </div>
  );
}
