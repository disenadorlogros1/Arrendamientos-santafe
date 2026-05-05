import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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
    icon: "/logo-rojo.png",
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
        className={`${outfit.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "'Avenir LT Pro', 'Avenir', 'Outfit', var(--font-outfit), system-ui, -apple-system, sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
