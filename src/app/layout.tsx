import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arrendamientos Santa Fé | Arriendos y Ventas en Medellín",
  description:
    "El apartamento que siempre quisiste, en el lugar que siempre quisiste. Arriendos y ventas de propiedades en Medellín y área metropolitana.",
  keywords: [
    "arriendos",
    "ventas",
    "propiedades",
    "Medellín",
    "apartamentos",
    "casas",
    "arrendamientos",
    "Santa Fé",
  ],
  authors: [{ name: "Arrendamientos Santa Fé" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Arrendamientos Santa Fé | Arriendos y Ventas en Medellín",
    description:
      "El apartamento que siempre quisiste, en el lugar que siempre quisiste. Arriendos y ventas de propiedades en Medellín y área metropolitana.",
    siteName: "Arrendamientos Santa Fé",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
