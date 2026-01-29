import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neclair Couto | Body Piercing & Furação Humanizada",
  description: "Especialista em Body Piercing e Furação de Orelha Humanizada para bebês. Segurança, higiene e carinho.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${playfair.variable} ${lato.variable} antialiased bg-brand-pink text-brand-dark`}
      >
        {children}
      </body>
    </html>
  );
}
