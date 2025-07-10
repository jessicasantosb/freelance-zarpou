"use client";

import { MessageSquareMore, SquareUser } from "lucide-react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { HeaderMenu } from "./header-menu";
import { Logo } from "./shared/logo";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full p-4 flex items-center bg-transparent justify-between gap-4">
      <Logo />
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6">
          <Link
            href={"/contact"}
            className={`flex items-center gap-1 underline-offset-2 hover:underline hover:opacity-90 ${pathname === "/contact" && "underline"
              }`}
          >
            <MessageSquareMore />
            Contato
          </Link>
          <Link
            href={"/about"}
            className={`flex items-center gap-1 underline-offset-2 hover:underline hover:opacity-90 ${pathname === "/about" && "underline"
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
