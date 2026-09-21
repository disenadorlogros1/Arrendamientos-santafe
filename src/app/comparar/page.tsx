import type { Metadata } from 'next';
import CompareShell from '@/components/shells/CompareShell';

export const metadata: Metadata = {
  title: 'Comparar propiedades | Arrendamientos Santa Fe',
  description: 'Compara lado a lado las propiedades que guardaste en Arrendamientos Santa Fe.',
  robots: { index: false, follow: true },
};

export default function Page() {
  return <CompareShell />;
}
