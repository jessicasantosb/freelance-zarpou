import Link from "next/link";
import Image from "next/image";

import { FooterLinks } from "./footer-links";
import { FooterCta } from "./footer-cta";
import { CopyIcon, CopyrightIcon } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full">
      <FooterCta />
      <FooterLinks />

      <div className="w-full bg-primary md:rounded-t text-white text-[.8rem]">
        <div className="max-w-5xl mx-auto py-2 mx-auto flex flex-col sm:flex-row items-center md:items-start justify-between gap-4">
          <div className="flex flex-col items-center">
            <p className="flex flex-col items-center text-center md:flex-row gap-1 md:gap-4 select-all selection:bg-white selection:text-primary">
              Zarpou Viagens e Turismo. Todos os direitos reservados.
              <span>CNPJ: {process.env.NEXT_PUBLIC_CNPJ} | Brasil</span>
              <Image
                alt="cadastur"
                src={"/cadastur.svg"}
                height={20}
                width={100}
                className="px-1 select-none"
              />
            </p>
            <div className="w-full pt-1 md:pt-0 flex justify-center md:justify-start gap-2 [&>*]:underline">
              <Link
                target="_blank"
                href={
                  "https://onertravel.com/termos-e-condicoes/?_gl=1%2A1n8zhfm%2A_gcl_au%2AMjg1NjExMDk3LjE3NTIwNjM3MzE.%2A_ga%2AMTg5NzgxNjkyNi4xNzUyMDYzNzMx%2A_ga_PNM2Q8Q1WF%2AczE3NTI0MTMxODgkbzE2JGcwJHQxNzUyNDEzMTg4JGo2MCRsMCRoMA.."
                }
              >
                Termos e Condições
              </Link>
              <Link
                target="_blank"
                href={
                  "https://onertravel.com/politica-de-privacidade/?_gl=1%2A1n8zhfm%2A_gcl_au%2AMjg1NjExMDk3LjE3NTIwNjM3MzE.%2A_ga%2AMTg5NzgxNjkyNi4xNzUyMDYzNzMx%2A_ga_PNM2Q8Q1WF%2AczE3NTI0MTMxODgkbzE2JGcwJHQxNzUyNDEzMTg4JGo2MCRsMCRoMA.."
                }
              >
                Política de Privacidade
              </Link>
            </div>
          </div>

          <p className="flex items-center gap-1">
            DESENVOLVIDO POR
            <Link
              href={`${process.env.NEXT_PUBLIC_PORTFOLIO_LINK}`}
              target="_blank"
              className="hover:opacity-90 "
            >
              {" "}
              Jéssica
            </Link>{" "}
            <CopyrightIcon size={12} /> {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
}
