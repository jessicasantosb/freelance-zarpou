"use client";

import Link from "next/link";
import { DropdownMenu } from "./dropdown-menu";
import { InlineLogo, InlineLogoLight } from "./shared/logo";
import { usePathname } from "next/navigation";
import { useScrollState } from "@/hooks/useScrollState";

export function Header() {
  const pathname = usePathname();
  const scrolled = useScrollState();

  const aboutPage = pathname === "/about";
  const contactPage = pathname === "/contact";
  const bgTransparent = contactPage || pathname === "/";

  return (
    <header
      className={`fixed top-0 w-full z-50 px-8 py-4 flex items-center justify-between gap-4 transition-all duration-300 ease-in-out
        ${
          scrolled || !bgTransparent
            ? "bg-[#f2dfb5] text-primary shadow-md opacity-90"
            : "bg-transparent text-white"
        }
      `}
    >
      {scrolled || !bgTransparent ? <InlineLogo /> : <InlineLogoLight />}

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/contact"
            className={`underline-offset-2 hover:underline hover:opacity-90 ${
              contactPage && "underline"
            }`}
          >
            Contato
          </Link>
          <Link
            href="/about"
            className={`underline-offset-2 hover:underline hover:opacity-90 ${
              aboutPage && "underline"
            }`}
          >
            Sobre nós
          </Link>
        </div>

        <div className="md:hidden">
          <DropdownMenu scrolled={scrolled} />
        </div>
      </div>
    </header>
  );
}
