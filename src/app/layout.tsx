import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
    icon: [
      { url: "/favicon-rojo.gif", media: "(prefers-color-scheme: light)", type: "image/gif" },
      { url: "/favicon-blanco.gif", media: "(prefers-color-scheme: dark)", type: "image/gif" },
    ],
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
        className="antialiased bg-background text-foreground"
        style={{ fontFamily: "'Avenir LT Pro', 'Avenir', 'Outfit', var(--font-outfit), system-ui, -apple-system, sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
