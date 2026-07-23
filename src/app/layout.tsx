import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import ScrollTracker from "@/components/ScrollTracker";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://arrendamientos-santafe.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Arrendamientos Santa Fe | 60 años guiando decisiones inmobiliarias en Antioquia",
  description:
    "Respaldo y experiencia inmobiliaria en Antioquia desde 1966. Arrendamientos, ventas, consignación, administración y asesoría con procesos claros y acompañamiento en cada etapa.",
  alternates: {
    canonical: "/",
  },
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
      { url: "/icons/icon-favicon-red.svg", media: "(prefers-color-scheme: light)", type: "image/svg+xml" },
      { url: "/icons/icon-favicon-white.svg", media: "(prefers-color-scheme: dark)", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Arrendamientos Santa Fe | 60 años de experiencia inmobiliaria",
    description:
      "Respaldo y experiencia en Antioquia para encontrar o gestionar tu propiedad ideal. Sedes en Medellín, Envigado y Rionegro.",
    siteName: "Arrendamientos Santa Fe",
    url: SITE_URL,
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

const realEstateAgentJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Arrendamientos Santa Fe",
  description:
    "Empresa inmobiliaria en Antioquia con 60 años de experiencia en arrendamientos, ventas, consignación, administración y asesoría hipotecaria.",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-rojo.png`,
  image: `${SITE_URL}/logo-rojo.png`,
  telephone: "+576044484015",
  email: "santafe@arrendamientossantafe.com",
  foundingDate: "1966",
  areaServed: [
    { "@type": "AdministrativeArea", name: "Valle de Aburrá" },
    { "@type": "AdministrativeArea", name: "Oriente Antioqueño" },
    { "@type": "AdministrativeArea", name: "Antioquia, Colombia" },
  ],
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "Calle 44 San Juan #71-34",
      addressLocality: "Medellín",
      addressRegion: "Antioquia",
      addressCountry: "CO",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "Centro Comercial Metrosur",
      addressLocality: "Envigado",
      addressRegion: "Antioquia",
      addressCountry: "CO",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "Parque Comercial Río del Este",
      addressLocality: "Rionegro",
      addressRegion: "Antioquia",
      addressCountry: "CO",
    },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "12:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "13:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "13:00",
    },
  ],
  sameAs: [
    "https://www.facebook.com/arrendamientossantafe",
    "https://www.instagram.com/arrendamientossantafe",
    "https://www.tiktok.com/@arrendamientossantafe",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+573006557529",
    contactType: "customer service",
    contactOption: "TollFree",
    areaServed: "CO",
    availableLanguage: "Spanish",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={SITE_URL} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(realEstateAgentJsonLd),
          }}
        />
      </head>
      <body
        className={`${outfit.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "'Avenir LT Std', 'Outfit', var(--font-outfit), system-ui, -apple-system, sans-serif" }}
      >
        <ScrollTracker />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <Toaster />
      </body>
    </html>
  );
}
