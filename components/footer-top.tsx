import Link from "next/link";
import { Logo } from "./logo";
import Image from "next/image";

const Icon = ({ icon }: { icon: string }) => {
  return (
    <div className="relative size-8">
      <Image alt={icon} src={`/icons/${icon}.svg`} fill className="absolute object-fit" />
    </div>
  )
}

export function FooterTop() {
  return (
    <div className="container px-2 pb-8 mx-auto flex flex-col sm:flex-row justify-between gap-4 items-center">
      <Logo />

      <div className="text-center">
        <h4 className="font-bold text-muted-foreground">Formas de Pagamento</h4>
        <div className="flex flex-col items-center">
          <p className="text-muted-foreground">Cartões de Crédito</p>
          <div className="flex gap-4">
            <Icon icon='visa' />
            <Icon icon='mastercard' />
            <Icon icon='elo' />
          </div>
        </div>

        <div className="pt-4 flex flex-col items-center">
          <p className="text-muted-foreground">Transferências ou Débito</p>
          <Icon icon='pix' />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <h4 className="font-bold text-muted-foreground">Redes Socias</h4>
        <p className="text-muted-foreground">siga a Zarpou</p>
        <div className="flex gap-4">
          <Link
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            target="_blank"
          >
            <Icon icon='whatsapp' />
          </Link>
          <Link
            href={`https://www.instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME}`}
            target="_blank"
          >
            <Icon icon='instagram' />
          </Link>
        </div>
      </div>
    </div>
  );
}
