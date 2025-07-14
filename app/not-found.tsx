import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <main className="h-[100svh] px-2 pt-32 pb-0 md:pb-14 flex flex-col items-center justify-center text-center">
      <div className="flex text-[8rem] md:text-[15rem] text-primary font-bold">
        <span>4</span>
        <span className="relative size-[7rem] md:size-[14rem] my-auto">
          <Image
            alt="logo"
            src={"/logo/logo-image-light.svg"}
            fill
            className="absolute object-cover"
          />
        </span>
        <span>4</span>
      </div>
      <p className="pb-2 text-3xl -mt-8">Desculpe, essa página não existe!</p>

      <Link href={"/"} className="underline">
        Voltar a página inicial
      </Link>
    </main>
  );
}
