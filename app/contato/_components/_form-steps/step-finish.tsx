"use client";

import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { useInfoStore } from "@/stores/info-store";
import { sendContactEmail } from "@/services/send-contact-email";
import { Contact } from "@/schemas/contact";
import { useState } from "react";

export function StepFinish() {
  const [success, setSuccess] = useState(false);
  const { client, destinationInfo, travelInfo } = useInfoStore(
    (state) => state
  );

  const onSubmit = async () => {
    const values: Contact = {
      ...client,
      ...destinationInfo,
      ...travelInfo,
    };

    try {
      await sendContactEmail(values);
      setSuccess(true);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao enviar a mensagem. Tente novamente.");
    }

    return null;
  };

  return (
    <div className="flex flex-col gap-4 text-center">
      <p>
        Quase lá! <strong>{client.name}</strong>!
      </p>
      <p>Envie seus dados e vamos cuidar de todos os detalhes da sua viagem.</p>
      <Button onClick={onSubmit} disabled={success}>
        {success ? "Mensagem enviada com sucesso" : "Enviar"}
      </Button>
    </div>
  );
}
