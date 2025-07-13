"use client";

import { useState } from "react";
import Image from "next/image";

import { ContactDialog } from "./contact-dialog/dialog";
import { Button } from "../ui/button";

export function ContactButton({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <Button
        className="shadow-md shadow-secondary tracking-wider cursor-pointer text-lg"
        size={"lg"}
        onClick={() => setCheckoutOpen(true)}
      >
        {children}
        <Image
          alt="whatsapp"
          src={"/icons/whatsapp-black.svg"}
          width={20}
          height={20}
        />
      </Button>
      <ContactDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  );
}
