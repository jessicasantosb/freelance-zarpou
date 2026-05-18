"use client";

import Link from "next/link";
import { DropdownMenu } from "./dropdown-menu";
import { InlineLogo, InlineLogoLight } from "./shared/logo";
import { usePathname } from "next/navigation";
import { PhoneCall } from "lucide-react";
import VerticalLine from "./shared/vertical-line";
import { useScrollState } from "@/hooks/useScrollState";
import { phoneNumber, whatsappLink } from "@/lib/whatsapp-link";

export function Header() {
  const pathname = usePathname();
  const scrolled = useScrollState();

  const aboutPage = pathname === "/sobre";
  const contactPage = pathname === "/contato";

  return (
    <header
      className={`fixed top-0 w-full z-50 p-4 transition-all duration-300 ease-in-out select-none
        ${
          scrolled
            ? "bg-[#f2dfb5] text-primary shadow-md opacity-95"
            : "bg-transparent text-white"
        }
      `}
    >
      <div className="w-full max-w-5xl mx-auto z-50 flex items-center justify-between gap-4">
        {scrolled ? <InlineLogo /> : <InlineLogoLight />}

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <Link
              href={whatsappLink}
              target="_blank"
              className="flex items-center gap-2"
            >
              <PhoneCall size={18} /> Televendas {phoneNumber}
            </Link>

            <VerticalLine />

            <Link
              href="/contato"
              className={`underline-offset-2 hover:underline hover:opacity-90 ${
                contactPage && "underline"
              }`}
            >
              Contato
            </Link>

            <VerticalLine />

            <Link
              href="/sobre"
              className={`underline-offset-2 hover:underline hover:opacity-90 ${
                aboutPage && "underline"
              }`}
            >
              Sobre Nós
            </Link>
          </div>

          <div className="md:hidden">
            <DropdownMenu scrolled={scrolled} />
          </div>
        </div>
      </div>
    </header>
  );
}
