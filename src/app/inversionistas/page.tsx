import type { Metadata } from 'next';
import InversionistasShell from '@/components/shells/InversionistasShell';

export const metadata: Metadata = {
  title: 'Inversión inmobiliaria en Medellín | Arrendamientos Santa Fe',
  description: 'Descubre las mejores zonas para invertir en finca raíz en Medellín y el Valle de Medellín. Análisis de rentabilidad, precios y oportunidades inmobiliarias en Antioquia.',
  keywords: ['inversión inmobiliaria Medellín', 'finca raíz Antioquia', 'rentabilidad inmuebles Medellín', 'invertir en propiedad Colombia'],
  openGraph: {
    title: 'Inversión inmobiliaria en Medellín | Arrendamientos Santa Fe',
    description: 'Las mejores zonas para invertir en finca raíz en Medellín y Antioquia. Análisis y asesoría con 60 años de experiencia.',
    url: 'https://arrendamientossantafe.com/inversionistas',
    siteName: 'Arrendamientos Santa Fe',
    locale: 'es_CO',
    type: 'website',
  },
  alternates: {
    canonical: 'https://arrendamientossantafe.com/inversionistas',
  },
};

export default function Page() {
  return <InversionistasShell />;
}
