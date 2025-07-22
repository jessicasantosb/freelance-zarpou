import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";

import "./globals.css";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.zarpouviagens.com.br"),
  title: {
    default: "Zarpou Viagens e Turismo",
    template: "Zarpou | %s",
  },
  description:
    "Descubra a Zarpou Viagens: agência online com pacotes personalizados, preços justos e uma plataforma segura para planejar sua próxima viagem.",
  icons: {
    icon: "/logo/logo-image-light.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" data-scroll="0" className="group">
      <body className={`${poppins.variable} antialiased`}>
        <ToastContainer position="bottom-center" />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
