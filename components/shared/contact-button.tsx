"use client";

import { useState } from "react";
import { ContactDialog } from "./contact-dialog/dialog";
import { Button } from "../ui/button";
import { PhoneCall } from "lucide-react";

export function ContactButton({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <Button
        className="shadow-2xl shadow-secondary font-bold tracking-wider cursor-pointer text-lg"
        size={"lg"}
        onClick={() => setCheckoutOpen(true)}
      >
        {children}
        <PhoneCall className="size-6" />
      </Button>
      <ContactDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  );
}
