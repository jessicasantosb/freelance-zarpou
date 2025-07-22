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
  title: {
    default: "Zarpou Viagens e Turismo",
    template: "Zarpou | %s",
  },
  description:
    "Descubra a Zarpou Viagens: agência online com pacotes personalizados, preços justos e uma plataforma segura para planejar sua próxima viagem.",
  icons: {
    icon: "/logo/logo-image-light.svg",
  },
  openGraph: {
    title: "Zarpou Viagens e Turismo",
    description:
      "Descubra a Zarpou Viagens: agência online com pacotes personalizados, preços justos e uma plataforma segura para planejar sua próxima viagem.",
    url: "/logo/logo.svg",
    siteName: "Zarpou",
    images: [
      {
        url: "/logo/logo.svg",
        width: 1200,
        height: 630,
        alt: "Logo da Zarpou Viagens",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zarpou Viagens e Turismo",
    description:
      "Descubra a Zarpou Viagens: agência online com pacotes personalizados e seguros.",
    images: ["/logo/logo.svg"],
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
