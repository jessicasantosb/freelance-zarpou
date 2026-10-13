"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { DropdownMenu } from "./dropdown-menu";
import { InlineLogo, InlineLogoLight } from "./shared/logo";
import { usePathname } from "next/navigation";
import { useScrollState } from "@/hooks/useScrollState";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";

export function Header() {
  const pathname = usePathname();
  const scrolled = useScrollState();
  const { isCustomerAuthenticated, customerUser, logout } = useCustomerAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Se estiver no painel administrativo, o admin terá seu próprio layout dedicado
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const isHome = pathname === "/";
  const isHeroPage = isHome || pathname === "/sobre" || pathname === "/contato";

  // Se estiver em páginas de catálogo, checkout ou voucher (sem vídeo hero), usar cabeçalho sólido
  const solidHeader = !isHeroPage || scrolled;

  return (
    <header
      className={`fixed top-0 w-full z-50 px-4 py-3 transition-all duration-300 ease-in-out select-none ${
        solidHeader
            ? "bg-white/95 backdrop-blur-md text-primary shadow-sm border-b border-slate-200"
            : "bg-transparent text-white"
        }`}
      >
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between gap-4">
          {solidHeader ? <InlineLogo /> : <InlineLogoLight />}

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 font-medium text-sm">
              <Link
                href="/destinos"
                prefetch={true}
                className={`transition hover:text-secondary ${
                  pathname.startsWith("/destinos") ? "text-secondary font-semibold" : ""
                }`}
              >
                <span>Destinos & Pacotes</span>
              </Link>
              <Link
                href="/hospedagens"
                prefetch={true}
                className={`transition hover:text-secondary ${
                  pathname.startsWith("/hospedagens") ? "text-secondary font-semibold" : ""
                }`}
              >
                <span>Hospedagens</span>
              </Link>
              <Link
                href="/passagens"
                prefetch={true}
                className={`transition hover:text-secondary ${
                  pathname.startsWith("/passagens") ? "text-secondary font-semibold" : ""
                }`}
              >
                <span>Passagens Aéreas</span>
              </Link>
              <Link
                href="/minhas-viagens"
                prefetch={true}
                className={`transition hover:text-secondary ${
                  pathname === "/minhas-viagens" ? "text-secondary font-semibold" : ""
                }`}
              >
                <span>Minhas Viagens</span>
              </Link>
              <Link
                href="/sobre"
                prefetch={true}
                className={`transition hover:text-secondary ${
                  pathname === "/sobre" ? "text-secondary font-semibold" : ""
                }`}
              >
                <span>Sobre Nós</span>
              </Link>
              <Link
                href="/contato"
                prefetch={true}
                className={`transition hover:text-secondary ${
                  pathname === "/contato" ? "text-secondary font-semibold" : ""
                }`}
              >
                <span>Contato</span>
              </Link>
            </nav>

          {/* BOTÃO DE LOGIN / CONTA DO VIAJANTE */}
          <div className="hidden md:flex items-center gap-3">
            {mounted && isCustomerAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/minhas-viagens"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition border ${
                    solidHeader
                      ? "bg-primary/5 text-primary border-primary/20 hover:bg-primary/10"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }`}
                >
                  <div className="size-5 rounded-full bg-secondary text-primary font-black flex items-center justify-center text-[10px]">
                    {customerUser?.name?.charAt(0) || "U"}
                  </div>
                  <span>Olá, {customerUser?.name?.split(" ")[0]}</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  title="Sair da conta"
                  className={`p-1.5 rounded-full transition cursor-pointer ${
                    solidHeader ? "text-slate-400 hover:text-red-600" : "text-white/70 hover:text-white"
                  }`}
                >
                  <LogOut className="size-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                  solidHeader
                    ? "bg-secondary text-primary hover:bg-secondary/90 shadow-secondary/20"
                    : "bg-white text-primary hover:bg-white/90"
                }`}
              >
                <User className="size-3.5" />
                Entrar
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <DropdownMenu scrolled={solidHeader} />
          </div>
        </div>
      </div>
    </header>
  );
}
