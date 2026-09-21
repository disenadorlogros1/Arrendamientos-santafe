import type { Metadata } from 'next';
import FavoritosShell from '@/components/shells/FavoritosShell';

export const metadata: Metadata = {
  title: 'Mis Favoritos | Arrendamientos Santa Fe',
  description: 'Propiedades que guardaste en Arrendamientos Santa Fe.',
  robots: { index: false, follow: true },
};

export default function Page() {
  return <FavoritosShell />;
}
