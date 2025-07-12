"use client";

import { SquareUser, MessageSquareMore, Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useScrollState } from "@/hooks/useScrollState";

export function HeaderMenu() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrollState();

  const handleCloseMenu = () => setOpen(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          className={`bg-transparent text-white ${scrolled && "text-black"}`}
        >
          <Menu className="size-8" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`
        min-w-[50dvw] h-[20dvh] mt-5 py-8 flex flex-col items-center justify-center gap-4 bg-white shadow-md shadow-primary text-md
        ${!scrolled && "bg-white/50"}
        `}
      >
        <DropdownMenuItem onClick={handleCloseMenu}>
          <MessageSquareMore />
          <Link href={"/contact"}>Contato</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCloseMenu}>
          <SquareUser />
          <Link href={"/about"}>Sobre nós</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
