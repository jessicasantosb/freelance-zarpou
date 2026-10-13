"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { InlineLogoLight } from "../shared/logo";
import { useConfigStore } from "@/stores/config-store";
import { Container } from "../shared/container";

const PaymentBadge = ({ icon, label }: { icon: string; label: string }) => {
  return (
    <div
      className="flex items-center gap-2.5 bg-slate-800/90 border border-slate-700/80 px-3.5 py-2.5 rounded-xl text-slate-200 text-xs font-semibold hover:border-slate-600 transition min-w-0"
      title={label}
    >
      <div className="relative w-7 h-5 shrink-0 flex items-center justify-center">
        <Image
          alt={label}
          src={`/footer/${icon}.svg`}
          fill
          className={`object-contain ${icon === "mastercard" ? "p-0.5" : ""}`}
        />
      </div>
      <span className="text-[11px] font-medium text-slate-300 truncate">
        {label}
      </span>
    </div>
  );
};

export function FooterLinks() {
  const { config } = useConfigStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const whatsappNum = mounted
    ? config.whatsapp
    : process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5531984210000";
  const instagramUser = mounted
    ? config.instagram
    : process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || "zarpouviagens";
  const linkedinUser = mounted
    ? config.linkedin
    : process.env.NEXT_PUBLIC_LINKEDIN_USERNAME || "zarpouviagens";

  const companyAddress = mounted
    ? config.address
    : "Belo Horizonte - MG, Brasil";
  const companyPhone = mounted ? config.phone : "(31) 3245-8900";
  const companyEmail = mounted
    ? config.email
    : "contato@zarpouviagens.com.br";

  return (
    <div className="pt-8 pb-12 text-slate-300">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* COLUNA 1: IDENTIDADE, APRESENTAÇÃO & CONTATO (4 colunas) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-block">
              <InlineLogoLight
                imageClassName="size-12 sm:size-14"
                nameClassName="h-7 sm:h-8 w-24 sm:w-28"
                className="hover:opacity-90 transition"
              />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Sua agência de turismo digital completa. Conectamos viajantes aos
              melhores hotéis, resorts e companhias aéreas do mundo com
              pagamento próprio, transparência e suporte humanizado.
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <MapPin className="size-4 text-secondary shrink-0" />
                <span>{companyAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="size-4 text-secondary shrink-0" />
                <span>{companyPhone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 text-secondary shrink-0" />
                <a
                  href={`mailto:${companyEmail}`}
                  className="hover:text-white transition"
                >
                  {companyEmail}
                </a>
              </div>
            </div>

            {/* REDES SOCIAIS COM BOTÕES MODERNOS */}
            <div className="pt-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Conecte-se Conosco:
              </p>
              <div className="flex items-center gap-2.5">
                <Link
                  href={`https://wa.me/${whatsappNum}`}
                  target="_blank"
                  className="size-9 rounded-xl bg-slate-800 hover:bg-emerald-600 border border-slate-700 flex items-center justify-center transition-all p-2"
                  title="WhatsApp Zarpou"
                >
                  <Image
                    alt="WhatsApp"
                    src="/footer/whatsapp.svg"
                    width={20}
                    height={20}
                  />
                </Link>

                <Link
                  href={`https://www.instagram.com/${instagramUser}`}
                  target="_blank"
                  className="size-9 rounded-xl bg-slate-800 hover:bg-pink-600 border border-slate-700 flex items-center justify-center transition-all p-2"
                  title="Instagram Zarpou"
                >
                  <Image
                    alt="Instagram"
                    src="/footer/instagram.svg"
                    width={20}
                    height={20}
                  />
                </Link>

                <Link
                  href={`https://www.linkedin.com/company/${linkedinUser}`}
                  target="_blank"
                  className="size-9 rounded-xl bg-slate-800 hover:bg-sky-600 border border-slate-700 flex items-center justify-center transition-all p-2"
                  title="LinkedIn Zarpou"
                >
                  <Image
                    alt="LinkedIn"
                    src="/footer/linkedin.svg"
                    width={20}
                    height={20}
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* COLUNA 2: PRODUTOS & SERVIÇOS (2 colunas) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">
              Explorar Zarpou
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <Link
                  href="/hospedagens"
                  className="hover:text-secondary transition flex items-center gap-1.5"
                >
                  <ArrowRight className="size-3 text-secondary/60" />
                  Hospedagens & Hotéis
                </Link>
              </li>
              <li>
                <Link
                  href="/passagens"
                  className="hover:text-secondary transition flex items-center gap-1.5"
                >
                  <ArrowRight className="size-3 text-secondary/60" />
                  Passagens Aéreas
                </Link>
              </li>
              <li>
                <Link
                  href="/pacotes"
                  className="hover:text-secondary transition flex items-center gap-1.5"
                >
                  <ArrowRight className="size-3 text-secondary/60" />
                  Pacotes Completos
                </Link>
              </li>
              <li>
                <Link
                  href="/hospedagens?city=Rio%20de%20Janeiro"
                  className="hover:text-secondary transition flex items-center gap-1.5"
                >
                  <ArrowRight className="size-3 text-secondary/60" />
                  Destinos no Brasil
                </Link>
              </li>
              <li>
                <Link
                  href="/passagens?to=MIA"
                  className="hover:text-secondary transition flex items-center gap-1.5"
                >
                  <ArrowRight className="size-3 text-secondary/60" />
                  Destinos Internacionais
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUNA 3: ÁREA DO VIAJANTE & INSTITUCIONAL (2 colunas) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">
              Área do Viajante
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <Link
                  href="/minhas-viagens"
                  className="hover:text-secondary transition flex items-center gap-1.5 font-bold text-slate-200"
                >
                  <ArrowRight className="size-3 text-secondary" />
                  Minhas Viagens & Vouchers
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-secondary transition flex items-center gap-1.5"
                >
                  <ArrowRight className="size-3 text-secondary/60" />
                  Entrar na Conta do Cliente
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="hover:text-secondary transition flex items-center gap-1.5"
                >
                  <ArrowRight className="size-3 text-secondary/60" />
                  Fale Conosco & Suporte
                </Link>
              </li>
              <li>
                <Link
                  href="/termos"
                  className="hover:text-secondary transition flex items-center gap-1.5"
                >
                  <ArrowRight className="size-3 text-secondary/60" />
                  Termos e Condições
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidade"
                  className="hover:text-secondary transition flex items-center gap-1.5"
                >
                  <ArrowRight className="size-3 text-secondary/60" />
                  Política de Privacidade (LGPD)
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUNA 4: FORMAS DE PAGAMENTO & SEGURANÇA (4 colunas) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mb-2">
                Pagamento Facilitado
              </h4>
              <p className="text-[11px] text-slate-400 mb-2.5">
                Cartões em até 12x s/ juros ou Pix c/ 5% OFF:
              </p>
              <div className="grid grid-cols-2 gap-2.5 max-w-sm">
                <PaymentBadge icon="visa" label="Visa" />
                <PaymentBadge icon="mastercard" label="Mastercard" />
                <PaymentBadge icon="elo" label="Elo" />
                <PaymentBadge icon="pix" label="Pix à Vista" />
                <PaymentBadge icon="boleto" label="Boleto" />
              </div>
            </div>

            {/* CERTIFICAÇÕES E SELOS */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Certificações Oficiais:
              </h5>
              <div className="flex items-center gap-3">
                <div
                  className="bg-slate-800/90 border border-slate-700/80 px-3 py-2 rounded-xl shrink-0 flex items-center justify-center hover:border-slate-600 transition"
                  title="Cadastur - Ministério do Turismo"
                >
                  <Image
                    alt="Cadastur - Ministério do Turismo"
                    src="/cadastur.svg"
                    width={110}
                    height={22}
                    className="select-none object-contain h-5 w-auto"
                  />
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  <div className="flex items-center gap-1 text-emerald-400 font-bold">
                    <ShieldCheck className="size-3.5" />
                    Ambiente 100% Seguro
                  </div>
                  <span>SSL 256-bit & LGPD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
