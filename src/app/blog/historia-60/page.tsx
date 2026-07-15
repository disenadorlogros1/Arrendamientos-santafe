import type { Metadata } from 'next';
import Historia60Shell from '@/components/shells/Historia60Shell';

export const metadata: Metadata = {
  title: '60 años en el corazón de Antioquia | Arrendamientos Santa Fe',
  description: 'De una oficina en Medellín a tres sedes en Antioquia. La historia de cómo construimos confianza durante seis décadas.',
};

export default function Page() {
  return <Historia60Shell />;
}
