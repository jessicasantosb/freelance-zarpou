import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Suspense } from "react";
import "./globals.css";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AiConciergeChat } from "@/components/chat/ai-concierge-chat";
import { NavigationProgressBar } from "@/components/shared/navigation-progress-bar";
import { ConfirmDialogProvider } from "@/components/shared/confirm-dialog-provider";
import {
  defaultKeywords,
  defaultIcons,
  defaultRobots,
  baseOpenGraph,
} from "@/constants/seo";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Zarpou Viagens e Turismo",
    template: "%s | Zarpou Viagens",
  },
  description:
    "Descubra a Zarpou Viagens: agência online com pacotes personalizados, preços justos e uma plataforma segura para planejar sua próxima viagem.",
  metadataBase: new URL("https://www.zarpouviagens.com.br"),
  keywords: defaultKeywords,
  icons: defaultIcons,
  robots: defaultRobots,
  openGraph: {
    ...baseOpenGraph,
    title: "Zarpou Viagens e Turismo",
    description:
      "Descubra a Zarpou Viagens: agência online com pacotes personalizados, preços justos e uma plataforma segura para planejar sua próxima viagem.",
    url: "/",
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
        <ConfirmDialogProvider>
          <Suspense fallback={null}>
            <NavigationProgressBar />
          </Suspense>
          <ToastContainer position="bottom-center" />
          <Header />
          {children}
          <Footer />
          <AiConciergeChat />
        </ConfirmDialogProvider>
      </body>
    </html>
  );
}
