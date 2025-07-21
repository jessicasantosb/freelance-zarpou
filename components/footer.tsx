import Link from "next/link";
import { FooterTop } from "./footer-top";
import Image from "next/image";

export function Footer() {
  return (
    <footer>
      <FooterTop />

      <div className="w-full bg-primary text-white text-[.8rem]">
        <div className="container p-2 mx-auto flex flex-col sm:flex-row items-center md:items-start justify-between gap-4">
          <div className="flex flex-col items-center">
            <p className="flex flex-col items-center md:flex-row md:gap-4">
              Zarpou Viagens e Turismo. Todos os direitos reservados.
              <span>CNPJ: {process.env.NEXT_PUBLIC_CNPJ} | Brasil</span>
              <span className="flex gap-2 px-1">
                <Image
                  alt="cadastur"
                  src={"/cadastur.svg"}
                  height={20}
                  width={100}
                />{" "}
                {process.env.NEXT_PUBLIC_CNPJ}
              </span>
            </p>
            <div className="w-full pt-2 md:pt-0 flex justify-center md:justify-start gap-2 [&>*]:underline">
              <Link
                target="_blank"
                href={
                  "https://onertravel.com/termos-e-condicoes/?_gl=1%2A1n8zhfm%2A_gcl_au%2AMjg1NjExMDk3LjE3NTIwNjM3MzE.%2A_ga%2AMTg5NzgxNjkyNi4xNzUyMDYzNzMx%2A_ga_PNM2Q8Q1WF%2AczE3NTI0MTMxODgkbzE2JGcwJHQxNzUyNDEzMTg4JGo2MCRsMCRoMA.."
                }
              >
                Termos e condições
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

          <p>
            DESENVOLVIDO POR &copy;{" "}
            <Link
              href={`${process.env.NEXT_PUBLIC_PORTFOLIO_LINK}`}
              target="_blank"
              className="hover:opacity-90 "
            >
              Jessica
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
