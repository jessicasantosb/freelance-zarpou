import * as React from "react";

export function Container({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="w-full max-w-5xl mx-auto px-2 md:px-0">{children}</section>;
}
