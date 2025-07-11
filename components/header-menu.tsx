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

export function HeaderMenu() {
  const [open, setOpen] = useState(false);

  const handleCloseMenu = () => setOpen(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent text-white">
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
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
