import Link from "next/link";
import { FooterTop } from "./footer-top";

export function Footer() {

  return (
    <footer>
      <FooterTop />

      <div className="w-full bg-primary text-white text-sm">
        <div className="container p-2 mx-auto flex flex-col sm:flex-row justify-between gap-4 items-center">
          <div className="flex flex-col items-center md:flex-row md:gap-4">
            <p>
              Zarpou Viagens. {' '}

              <span>
                Todos os direitos reservados.
              </span>
            </p>
            <p>
              CNPJ: 000000000 | Brasil
            </p>
          </div>

          <p>
            DESENVOLVIDO POR &copy;
            {" "}
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
