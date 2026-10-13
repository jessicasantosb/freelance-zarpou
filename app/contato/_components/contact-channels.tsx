"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone, Mail, MapPin, ExternalLink, Clock } from "lucide-react";
import { useConfigStore } from "@/stores/config-store";

export function ContactChannels() {
  const { config } = useConfigStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const whatsappNum = mounted
    ? config.whatsapp
    : process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5531984210000";
  const phone = mounted ? config.phone : "(31) 3245-8900";
  const email = mounted ? config.email : "contato@zarpouviagens.com.br";
  const address = mounted ? config.address : "Belo Horizonte - MG, Brasil";

  const defaultMsg = encodeURIComponent(
    "Olá! Gostaria de conversar com um especialista da Zarpou sobre um roteiro ou cotação de viagem."
  );

  return (
    <section className="w-full max-w-6xl mx-auto px-4 -mt-16 relative z-30 mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: WHATSAPP OFICIAL */}
        <a
          href={`https://wa.me/${whatsappNum}?text=${defaultMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="size-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <MessageCircle className="size-5" />
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/70 text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online agora
              </span>
            </div>
            <h4 className="font-bold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">
              WhatsApp Oficial
            </h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              Atendimento ágil com consultores
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
            <span>Iniciar Conversa</span>
            <ExternalLink className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </a>

        {/* CARD 2: CENTRAL TELEFÔNICA */}
        <a
          href={`tel:${phone.replace(/\D/g, "")}`}
          className="group bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <Phone className="size-5" />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                <Clock className="size-3 text-slate-400" />
                08h às 20h
              </span>
            </div>
            <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">
              Central Telefônica
            </h4>
            <p className="text-xs font-semibold text-slate-600 mt-1">
              {phone}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primary">
            <span>Ligar para a Agência</span>
            <ExternalLink className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </a>

        {/* CARD 3: E-MAIL */}
        <a
          href={`mailto:${email}`}
          className="group bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100 hover:border-secondary/70 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="size-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-[#ebb343] group-hover:text-primary transition-colors duration-300">
                <Mail className="size-5" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400">
                Orçamentos & Pós
              </span>
            </div>
            <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">
              E-mail da Equipe
            </h4>
            <p className="text-xs text-slate-500 mt-1 truncate">
              {email}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-primary">
            <span>Enviar Mensagem</span>
            <ExternalLink className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </a>

        {/* CARD 4: SEDE & ATENDIMENTO */}
        <div className="group bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="size-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <MapPin className="size-5" />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Sede Oficial
              </span>
            </div>
            <h4 className="font-bold text-slate-800 text-sm">
              Localização
            </h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              {address}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Cadastur: {mounted ? config.cadastur : "34.120.948/0001-90"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
