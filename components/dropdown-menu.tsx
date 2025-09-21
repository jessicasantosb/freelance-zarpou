"use client";

import { Menu } from "lucide-react";
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
import { useState } from "react";
import { usePathname } from "next/navigation";

type DropdownMenuProps = {
  scrolled: boolean;
};

export function DropdownMenu({ scrolled }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const aboutPage = pathname === "/sobre";
  const contactPage = pathname === "/contato";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={`border-none text-white ${scrolled && "text-primary"}`}
        >
          <Menu className="size-8" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="bg-secondary h-20">
          <SheetTitle className="sr-only">Menu</SheetTitle>
        </SheetHeader>

        <div className="pt-4 pl-4 text-xl">
          <SheetClose asChild>
            <Link
              href={"/"}
              onClick={() => setOpen(true)}
              className={`flex items-center gap-2 pb-6 ${
                pathname === "/" && "underline"
              }`}
            >
              <Image
                alt="contact"
                src={"/icons/home.svg"}
                width={40}
                height={40}
              />
              Página inicial
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              href={"/contato"}
              onClick={() => setOpen(true)}
              className={`flex items-center gap-2 pb-6 ${
                contactPage && "underline"
              }`}
            >
              <Image
                alt="contact"
                src={"/icons/contact.svg"}
                width={40}
                height={40}
              />
              Contato
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              href={"/sobre"}
              className={`flex items-center gap-2 ${aboutPage && "underline"}`}
            >
              <Image
                alt="info"
                src={"/icons/info.svg"}
                width={40}
                height={40}
                className="p-1"
              />
              Sobre nós
            </Link>
          </SheetClose>
        </div>

        <SheetFooter>
          <Image
            alt="logo"
            src={"/logo/logo.svg"}
            width={150}
            height={150}
            sizes="auto"
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
