"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  Send,
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  MessageCircle,
  ExternalLink,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useInfoStore } from "@/stores/info-store";
import { useConfigStore } from "@/stores/config-store";
import { sendContactEmail } from "@/services/send-contact-email";

export function StepFinish() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const { config } = useConfigStore();

  const { client, destinationInfo, travelInfo, resetInfo } = useInfoStore(
    (state) => state
  );

  const whatsappNum =
    config?.whatsapp ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    "5531984210000";

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
      toast.success("Solicitação enviada com sucesso!");
    } catch (error) {
      setStatus("idle");
      console.error(error);
      toast.error("Erro ao enviar a mensagem. Tente novamente.");
    }
  };

  const isPending = status === "loading";
  const isSuccess = status === "success";

  const whatsappText = encodeURIComponent(
    `Olá! Acabei de enviar uma solicitação de roteiro para *${
      destinationInfo.destination || "um destino dos sonhos"
    }* pelo site da Zarpou (Nome: ${client.name || "Cliente"}). Gostaria de agilizar meu atendimento!`
  );

  if (isSuccess) {
    return (
      <div className="py-6 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
        <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="size-9" />
        </div>

        <div>
          <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Solicitação Recebida com Sucesso!
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
            Obrigado, <strong>{client.name}</strong>! Nossos consultores especialistas já receberam seus dados e estão montando opções exclusivas para o seu destino.
          </p>
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl max-w-md mx-auto text-xs text-emerald-800 space-y-1">
          <p className="font-bold">Tempo estimado de retorno:</p>
          <p>Em até 2 horas úteis entraremos em contato via e-mail e WhatsApp.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={`https://wa.me/${whatsappNum}?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
          >
            <MessageCircle className="size-4 fill-white" />
            <span>Agilizar no WhatsApp Agora</span>
            <ExternalLink className="size-3.5" />
          </a>

          <button
            type="button"
            onClick={() => {
              resetInfo();
              setStatus("idle");
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>Fazer Outra Solicitação</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-[#084574] text-white font-bold text-xs flex items-center justify-center transition"
          >
            Página Inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* CARD DE RESUMO DOS DADOS */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs space-y-3">
        <h5 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] pb-2 border-b border-slate-200">
          Resumo da sua Solicitação:
        </h5>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-2.5">
            <User className="size-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                Viajante:
              </span>
              <p className="font-bold text-slate-800">
                {client.name || "Não informado"}
              </p>
              <p className="text-slate-500 text-[11px]">
                {client.email} {client.phone ? `• ${client.phone}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="size-4 text-secondary shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                Destino Desejado:
              </span>
              <p className="font-bold text-slate-800">
                {destinationInfo.destination || "A definir com consultor"}
              </p>
              <p className="text-slate-500 text-[11px]">
                {destinationInfo.travelType ? `Tipo: ${destinationInfo.travelType}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 sm:col-span-2">
            <Calendar className="size-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                Período & Passageiros:
              </span>
              <p className="text-slate-700">
                {destinationInfo.startDate && destinationInfo.endDate
                  ? `${destinationInfo.startDate} até ${destinationInfo.endDate}`
                  : "Datas flexíveis"}{" "}
                • {destinationInfo.numberOfAdults || "Adultos a definir"}
                {destinationInfo.numberOfChildren
                  ? `, ${destinationInfo.numberOfChildren}`
                  : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500">
        <p>
          Ao enviar, seus dados são protegidos por criptografia e usados exclusivamente para a formulação da sua cotação.
        </p>
      </div>

      {/* BOTÃO DE CONFIRMAR E ENVIAR */}
      <div className="pt-2">
        <Button
          onClick={onSubmit}
          disabled={isPending}
          className="w-full h-12 bg-primary hover:bg-[#084574] text-white font-bold rounded-xl flex items-center justify-center gap-2.5 transition shadow-lg shadow-primary/20 text-sm cursor-pointer disabled:opacity-50"
        >
          {isPending ? (
            <>
              <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Enviando sua Solicitação...</span>
            </>
          ) : (
            <>
              <Send className="size-4 text-secondary" />
              <span>Confirmar & Enviar Solicitação para a Zarpou</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
