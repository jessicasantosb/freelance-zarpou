"use client";

import Image from "next/image";
import Link from "next/link";

import { whatsappLink } from "@/lib/whatsapp-link";

export function WhatsappLink({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Link href={whatsappLink} target="_blank" className="flex items-center justify-center gap-2 h-10 w-fit rounded-md px-6 bg-whatsapp text-white shadow-md tracking-wider cursor-pointer text-lg hover:opacity-90">
      {children}
      <Image
        alt="whatsapp"
        src={"/icons/whatsapp-white.svg"}
        width={20}
        height={20}
      />
    </Link>
  );
}
