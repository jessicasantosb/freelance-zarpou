import * as React from "react";

export function Container({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="container mx-auto px-2 md:px-4">{children}</section>
}
