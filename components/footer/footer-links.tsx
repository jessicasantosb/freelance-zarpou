import Link from "next/link";
import Image from "next/image";
import { Logo } from "../shared/logo";

const Icon = ({ icon }: { icon: string }) => {
  return (
    <div className="relative size-8">
      <Image
        alt={icon}
        src={`/footer/${icon}.svg`}
        fill
        className="absolute object-fit"
      />
    </div>
  );
};

export function FooterLinks() {
  return (
    <div className="px-2 pt-4 pb-8 mx-auto flex flex-col md:flex-row justify-between">
      <div className="w-full flex items-center justify-center mb-4">
        <Logo className="size-32" />
      </div>

      <div className="w-full flex flex-col items-center justify-between md:gap-2">
        <h4 className="font-bold text-muted-foreground">Formas de Pagamento</h4>

        <p className="text-muted-foreground">Cartões de Crédito</p>
        <div className="flex gap-4">
          <Icon icon="visa" />
          <Icon icon="mastercard" />
          <Icon icon="elo" />
        </div>

        <p className="pt-4 text-muted-foreground">Transferências | Débito</p>
        <div className="flex gap-2">
          <Icon icon="pix" />
          <Icon icon="boleto" />
        </div>
      </div>

      <div className="w-full flex flex-col items-center gap-2 pt-6 md:pt-0">
        <h4 className="font-bold text-muted-foreground">Links Úteis</h4>
        <Link
          target="_blank"
          href={
            "https://onertravel.com/termos-e-condicoes/?_gl=1%2A1n8zhfm%2A_gcl_au%2AMjg1NjExMDk3LjE3NTIwNjM3MzE.%2A_ga%2AMTg5NzgxNjkyNi4xNzUyMDYzNzMx%2A_ga_PNM2Q8Q1WF%2AczE3NTI0MTMxODgkbzE2JGcwJHQxNzUyNDEzMTg4JGo2MCRsMCRoMA.."
          }
          className="text-muted-foreground hover:underline"
        >
          Termos e Condições
        </Link>
        <Link
          target="_blank"
          href={
            "https://onertravel.com/politica-de-privacidade/?_gl=1%2A1n8zhfm%2A_gcl_au%2AMjg1NjExMDk3LjE3NTIwNjM3MzE.%2A_ga%2AMTg5NzgxNjkyNi4xNzUyMDYzNzMx%2A_ga_PNM2Q8Q1WF%2AczE3NTI0MTMxODgkbzE2JGcwJHQxNzUyNDEzMTg4JGo2MCRsMCRoMA.."
          }
          className="text-muted-foreground hover:underline"
        >
          Política de Privacidade
        </Link>

        <h4 className="pt-4 font-bold text-muted-foreground">Redes Socias</h4>
        <p className="text-muted-foreground">Siga a Zarpou</p>
        <div className="flex gap-4">
          <Link
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            target="_blank"
            className="hover:opacity-90"
          >
            <Icon icon="whatsapp" />
          </Link>
          <Link
            href={`https://www.instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME}`}
            target="_blank"
            className="hover:opacity-90"
          >
            <Icon icon="instagram" />
          </Link>
          <Link
            href={`https://www.linkedin.com/${process.env.NEXT_PUBLIC_LINKEDIN_USERNAME}`}
            target="_blank"
            className="hover:opacity-90"
          >
            <Icon icon="linkedin" />
          </Link>
        </div>
      </div>
    </div>
  );
}
