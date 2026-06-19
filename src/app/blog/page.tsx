import type { Metadata } from 'next';
import BlogShell from '@/components/shells/BlogShell';

export const metadata: Metadata = {
  title: 'Blog inmobiliario | Arrendamientos Santa Fe',
  description: 'Artículos, guías y noticias sobre el mercado inmobiliario en Medellín y Antioquia. Consejos para propietarios, arrendatarios e inversionistas.',
  keywords: ['blog inmobiliario Medellín', 'mercado inmobiliario Antioquia', 'consejos arrendamiento', 'inversión inmobiliaria Colombia'],
  openGraph: {
    title: 'Blog inmobiliario | Arrendamientos Santa Fe',
    description: 'Noticias y consejos sobre el mercado inmobiliario en Medellín y Antioquia.',
    url: 'https://arrendamientossantafe.com/blog',
    siteName: 'Arrendamientos Santa Fe',
    locale: 'es_CO',
    type: 'website',
  },
  alternates: {
    canonical: 'https://arrendamientossantafe.com/blog',
  },
};

export default function Page() {
  return <BlogShell />;
}
