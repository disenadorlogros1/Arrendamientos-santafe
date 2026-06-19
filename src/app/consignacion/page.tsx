import type { Metadata } from 'next';
import ConsignacionShell from '@/components/shells/ConsignacionShell';

export const metadata: Metadata = {
  title: 'Consigna tu propiedad en Medellín | Arrendamientos Santa Fe',
  description: 'Consigna tu apartamento, casa o local con Arrendamientos Santa Fe. Gestión profesional de arrendamiento y venta en Medellín y Antioquia. Más de 60 años de experiencia.',
  keywords: ['consignar propiedad Medellín', 'arrendar inmueble Antioquia', 'administración de propiedades Medellín', 'consignación inmobiliaria'],
  openGraph: {
    title: 'Consigna tu propiedad | Arrendamientos Santa Fe',
    description: 'Confía tu inmueble a los especialistas. 60 años gestionando propiedades en Medellín y Antioquia.',
    url: 'https://arrendamientossantafe.com/consignacion',
    siteName: 'Arrendamientos Santa Fe',
    locale: 'es_CO',
    type: 'website',
  },
  alternates: {
    canonical: 'https://arrendamientossantafe.com/consignacion',
  },
};

export default function Page() {
  return <ConsignacionShell />;
}
