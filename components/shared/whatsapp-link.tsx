"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useConfigStore } from "@/stores/config-store";

export function WhatsappLink({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { config } = useConfigStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const number = mounted ? config.whatsapp : (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5531984210000");
  const message = mounted ? encodeURIComponent(config.whatsappMessage || "Olá! Gostaria de mais informações sobre viagens.") : "";
  const link = `https://wa.me/${number}${message ? `?text=${message}` : ""}`;

  return (
    <Link
      href={link}
      target="_blank"
      className="flex items-center justify-center gap-2 h-12 w-fit rounded-md px-4 md:px-6 bg-whatsapp text-white shadow-md md:tracking-wider cursor-pointer text-lg hover:opacity-90 transition font-medium"
    >
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
