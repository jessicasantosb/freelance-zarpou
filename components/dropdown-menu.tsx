"use client";

import {
  Menu,
  Hotel,
  Plane,
  CalendarCheck,
  Home,
  Phone,
  Info,
  User,
  LogOut,
  Compass,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCustomerAuthStore } from "@/stores/customer-auth-store";

type DropdownMenuProps = {
  scrolled: boolean;
};

export function DropdownMenu({ scrolled }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { isCustomerAuthenticated, customerUser, logout } = useCustomerAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={`border-none p-2 ${scrolled ? "text-primary hover:bg-slate-100" : "text-white hover:bg-white/10"}`}
        >
          <Menu className="size-7" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col justify-between">
        <div>
          <SheetHeader className="bg-primary text-white p-4 rounded-xl mb-4">
            <SheetTitle className="text-white text-lg font-bold">Menu Zarpou</SheetTitle>
          </SheetHeader>

          {/* ÁREA DO VIAJANTE MOBILE */}
          {mounted && (
            <div className="mb-3">
              {isCustomerAuthenticated && customerUser ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-xl bg-secondary text-primary font-black flex items-center justify-center text-xs shrink-0">
                      {customerUser.name?.charAt(0) || "U"}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {customerUser.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {customerUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-xs font-semibold">
                    <SheetClose asChild>
                      <Link
                        href="/minhas-viagens"
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:text-primary flex items-center gap-1.5 justify-center"
                      >
                        <User className="size-3 text-primary shrink-0" />
                        Minha Conta
                      </Link>
                    </SheetClose>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-1.5 justify-center cursor-pointer"
                    >
                      <LogOut className="size-3 shrink-0" />
                      Sair
                    </button>
                  </div>
                </div>
              ) : (
                <SheetClose asChild>
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 p-3 bg-secondary text-primary font-bold text-xs rounded-xl shadow-xs"
                  >
                    <User className="size-4" />
                    Entrar ou Cadastrar
                  </Link>
                </SheetClose>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2 pt-1 text-base">
            <SheetClose asChild>
              <Link
                href={"/"}
                prefetch={true}
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition ${
                  pathname === "/" ? "bg-primary/10 text-primary font-semibold" : "text-slate-700"
                }`}
              >
                <Home className="size-5 text-primary" />
                Página Inicial
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link
                href={"/destinos"}
                prefetch={true}
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition ${
                  pathname.startsWith("/destinos") ? "bg-primary/10 text-primary font-semibold" : "text-slate-700"
                }`}
              >
                <Compass className="size-5 text-primary" />
                Lugares Imperdíveis & Pacotes
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link
                href={"/hospedagens"}
                prefetch={true}
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition ${
                  pathname.startsWith("/hospedagens") ? "bg-primary/10 text-primary font-semibold" : "text-slate-700"
                }`}
              >
                <Hotel className="size-5 text-primary" />
                Hospedagens e Hotéis
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link
                href={"/passagens"}
                prefetch={true}
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition ${
                  pathname.startsWith("/passagens") ? "bg-primary/10 text-primary font-semibold" : "text-slate-700"
                }`}
              >
                <Plane className="size-5 text-primary" />
                Passagens Aéreas
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link
                href={"/minhas-viagens"}
                prefetch={true}
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition ${
                  pathname === "/minhas-viagens" ? "bg-primary/10 text-primary font-semibold" : "text-slate-700"
                }`}
              >
                <CalendarCheck className="size-5 text-primary" />
                Minhas Viagens
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link
                href={"/sobre"}
                prefetch={true}
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition ${
                  pathname === "/sobre" ? "bg-primary/10 text-primary font-semibold" : "text-slate-700"
                }`}
              >
                <Info className="size-5 text-primary" />
                Sobre Nós
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link
                href={"/contato"}
                prefetch={true}
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 transition ${
                  pathname === "/contato" ? "bg-primary/10 text-primary font-semibold" : "text-slate-700"
                }`}
              >
                <Phone className="size-5 text-primary" />
                Fale Conosco
              </Link>
            </SheetClose>
          </div>
        </div>

        <SheetFooter className="border-t border-slate-100 pt-4 flex flex-col items-center">
          <Image
            alt="logo"
            src={"/logo/logo.svg"}
            width={120}
            height={120}
            className="mx-auto"
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
