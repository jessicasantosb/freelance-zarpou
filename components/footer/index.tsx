"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FooterLinks } from "./footer-links";
import { FooterCta } from "./footer-cta";
import { useConfigStore } from "@/stores/config-store";
import { Container } from "../shared/container";

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const { config } = useConfigStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Ocultar rodapé de e-commerce completamente no painel administrativo
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const displayCnpj = mounted
    ? config.cnpj
    : process.env.NEXT_PUBLIC_CNPJ || "55.849.201/0001-38";
  const displayCompany = mounted
    ? config.companyName
    : "Zarpou Viagens e Turismo Ltda";
  const displayCadastur = mounted ? config.cadastur : "34.120.948/0001-90";

  return (
    <>
      {/* SEÇÃO CTA (FORA DO FOOTER E SEM BACKGROUND) */}
      <FooterCta />

      {/* FOOTER */}
      <footer className="w-full bg-slate-950 text-slate-400 select-none">
        {/* LINKS ARQUITETURAIS & CONTATOS */}
        <FooterLinks />

        {/* BARRA INFERIOR DE DIREITOS & LEGAL (RODAPÉ) */}
        <div className="border-t border-slate-900 bg-black/40 py-6 text-xs text-slate-400">
          <Container>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* DADOS FISCAIS & CADASTRAIS */}
              <div className="text-center md:text-left space-y-1">
                <p className="font-semibold text-slate-300">
                  {displayCompany} • CNPJ: {displayCnpj} • Cadastur: {displayCadastur}
                </p>
                <p className="text-[11px] text-slate-400">
                  © {currentYear} Zarpou Viagens. Todos os direitos reservados. Fotos
                  e tarifas sujeitas à disponibilidade.
                </p>
              </div>

              {/* LINKS LEGAIS & DESENVOLVEDOR */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-xs">
                <div className="flex items-center gap-4 text-slate-400">
                  <Link
                    href="/termos"
                    className="hover:text-secondary transition underline underline-offset-4"
                  >
                    Termos de Uso
                  </Link>
                  <span>•</span>
                  <Link
                    href="/privacidade"
                    className="hover:text-secondary transition underline underline-offset-4"
                  >
                    Privacidade (LGPD)
                  </Link>
                  <span>•</span>
                  <Link
                    href="/minhas-viagens"
                    className="hover:text-secondary transition underline underline-offset-4"
                  >
                    Minhas Viagens
                  </Link>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-4">
                  <span>Desenvolvido por</span>
                  <Link
                    href={process.env.NEXT_PUBLIC_PORTFOLIO_LINK || "#"}
                    target="_blank"
                    className="text-secondary font-bold hover:underline"
                  >
                    Jéssica
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </footer>
    </>
  );
}
