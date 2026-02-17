"use client";

import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { useInfoStore } from "@/stores/info-store";
import { sendContactEmail } from "@/services/send-contact-email";

export function StepFinish() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const { client, destinationInfo, travelInfo } = useInfoStore(
    (state) => state,
  );

  const onSubmit = async () => {
    setStatus("loading");

    const values = {
      ...client,
      ...destinationInfo,
      ...travelInfo,
    };

    try {
      await sendContactEmail(values);
      setStatus("success");
      toast.success("Mensagem enviada com sucesso!");
    } catch (error) {
      setStatus("idle");
      toast.error("Erro ao enviar a mensagem. Tente novamente.");
    }
  };

  const isPending = status === "loading";
  const isSuccess = status === "success";

  return (
    <div className="flex flex-col gap-4 text-center">
      <p>
        Quase lá! <strong>{client.name}</strong>!
      </p>
      <p>Envie seus dados e vamos cuidar de todos os detalhes da sua viagem.</p>

      <Button onClick={onSubmit} disabled={isPending || isSuccess}>
        {isPending && "Enviando..."}
        {isSuccess && "Mensagem enviada com sucesso"}
        {!isPending && !isSuccess && "Enviar"}
      </Button>
    </div>
  );
}
