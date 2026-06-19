import type { Metadata } from 'next';
import PropiedadesShell from '@/components/shells/PropiedadesShell';

export const metadata: Metadata = {
  title: 'Propiedades en arriendo y venta en Medellín | Arrendamientos Santa Fe',
  description: 'Encuentra apartamentos, casas, oficinas y locales en arriendo y venta en Medellín y el área metropolitana. Más de 1.000 inmuebles disponibles con Arrendamientos Santa Fe.',
  keywords: ['propiedades en arriendo Medellín', 'apartamentos en venta Medellín', 'inmuebles Antioquia', 'arrendamientos Santa Fe'],
  openGraph: {
    title: 'Propiedades en Medellín | Arrendamientos Santa Fe',
    description: 'Más de 1.000 inmuebles en arriendo y venta en Medellín y Antioquia. 60 años de experiencia.',
    url: 'https://arrendamientossantafe.com/propiedades',
    siteName: 'Arrendamientos Santa Fe',
    locale: 'es_CO',
    type: 'website',
  },
  alternates: {
    canonical: 'https://arrendamientossantafe.com/propiedades',
  },
};

export default function Page() {
  return <PropiedadesShell />;
}
