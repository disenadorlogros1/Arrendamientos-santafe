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
  title: "Arrendamientos Santa Fe | 60 años guiando decisiones inmobiliarias en Antioquia",
  description:
    "Respaldo y experiencia inmobiliaria en Antioquia desde 1966. Arrendamientos, ventas, consignación, administración y asesoría con procesos claros y acompañamiento en cada etapa.",
  keywords: [
    "arrendamientos",
    "ventas",
    "propiedades",
    "inmobiliaria Antioquia",
    "Medellín",
    "Envigado",
    "Rionegro",
    "apartamentos",
    "casas",
    "consignación",
    "Arrendamientos Santa Fe",
  ],
  authors: [{ name: "Arrendamientos Santa Fe" }],
  icons: {
    icon: [
      { url: "/favicon-rojo.gif", media: "(prefers-color-scheme: light)", type: "image/gif" },
      { url: "/favicon-blanco.gif", media: "(prefers-color-scheme: dark)", type: "image/gif" },
    ],
  },
  openGraph: {
    title: "Arrendamientos Santa Fe | 60 años de experiencia inmobiliaria",
    description:
      "Respaldo y experiencia en Antioquia para encontrar o gestionar tu propiedad ideal. Sedes en Medellín, Envigado y Rionegro.",
    siteName: "Arrendamientos Santa Fe",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arrendamientos Santa Fe | 60 años de experiencia inmobiliaria",
    description:
      "Respaldo y experiencia en Antioquia para encontrar o gestionar tu propiedad ideal.",
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
