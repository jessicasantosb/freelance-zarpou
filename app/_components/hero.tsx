import { CustomLink } from "@/components/shared/custom-link";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <div className="relative w-full h-[100svh] overflow-hidden">
      {/* Vídeo de Naveen G: https://www.pexels.com/pt-br/video/imagens-das-ondas-do-oceano-em-camera-lenta-3834452/ */}
      <video
        src="/waves.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      <div className="absolute top-0 left-0 w-full h-full bg-primary/50 z-10" />

      <div className="relative z-20 flex flex-col items-center justify-center text-center text-white h-full px-4">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Do seu jeito,
        </h1>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          no seu destino
        </h1>
        <p className="text-xl md:text-2xl mt-6 max-w-2xl">
          momentos especiais merecem viagens únicas
        </p>
        <div className="pt-8 flex flex-col md:flex-row gap-4 [&>*]:h-12 [&>*]:w-44">
          <Button variant={"outline"}>
            <Link
              href={"/contact"}
              className="px-4 py-2 h-full rounded-md flex items-center gap-2"
            >
              Converse conosco
            </Link>
          </Button>
          <CustomLink link="https://app.onertravel.com/zarpouviagens/home" text="Nossas ofertas" />
        </div>
      </div>
    </div>
  );
}
