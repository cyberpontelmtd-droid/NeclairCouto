import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neclair Couto | Body Piercing & Perfuração Humanizada",
  description: "Especialista em Body Piercing e Perfuração de Orelha Humanizada para bebês. Segurança, higiene e carinho.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased bg-brand-dark text-brand-dark font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
