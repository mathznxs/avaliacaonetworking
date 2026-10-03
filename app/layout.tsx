import type React from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voz da Feira | Avaliação das empresas",
  description:
    "Avalie as empresas da Feira de Empreendedorismo e Networking 2026 da E.E. Professora Zuleika de Barros Martins Ferreira.",
  authors: [{ name: "Mathias Fernando" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Voz da Feira | Avaliação das empresas",
    description: "Notas e reações do público para as empresas da feira de 2026.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            {children}
            <Toaster />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
