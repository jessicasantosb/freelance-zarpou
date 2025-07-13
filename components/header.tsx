"use client";

import { MessageSquareMore, SquareUser } from "lucide-react";
import Link from "next/link";
import { HeaderMenu } from "./header-menu";
import { InlineLogo, InlineLogoLight } from "./shared/logo";
import { usePathname } from "next/navigation";
import { useScrollState } from "@/hooks/useScrollState";

export function Header() {
  const pathname = usePathname();
  const scrolled = useScrollState();
  
  const aboutPage = pathname === "/about";
  const contactPage = pathname === "/contact";

  return (
    <header
      className={`fixed top-0 w-full z-50 px-8 py-4 flex items-center justify-between gap-4 transition-all duration-300 ease-in-out
        ${
          scrolled || aboutPage
            ? "bg-[#f2dfb5] text-primary shadow-md opacity-90"
            : "bg-transparent text-white"
        }
      `}
    >
      {scrolled || aboutPage ? <InlineLogo /> : <InlineLogoLight />}

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/contact"
            className={`flex items-center gap-1 underline-offset-2 hover:underline hover:opacity-90 ${
              contactPage && "underline"
            }`}
          >
            <MessageSquareMore />
            Contato
          </Link>
          <Link
            href="/about"
            className={`flex items-center gap-1 underline-offset-2 hover:underline hover:opacity-90 ${
              aboutPage && "underline"
            }`}
          >
            <SquareUser />
            Sobre nós
          </Link>
        </div>

        <div className="md:hidden">
          <HeaderMenu />
        </div>
      </div>
    </header>
  );
}
