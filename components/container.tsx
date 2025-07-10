import * as React from "react";

export function Container(children: React.ReactNode) {
  return <main className="container mx-auto px-2 md:px-4">{children}</main>
}
