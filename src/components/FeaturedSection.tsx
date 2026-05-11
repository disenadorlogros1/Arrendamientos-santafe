'use client';

import { Button } from '@/components/ui/button';
import InfiniteCarousel from '@/components/InfiniteCarousel';
import { properties } from '@/data/properties';
import type { PageType } from '@/components/Header';

interface FeaturedSectionProps {
  onNavigate: (page: PageType) => void;
}

export default function FeaturedSection({ onNavigate }: FeaturedSectionProps) {
  const featured = properties.filter((p) => p.featured);

  return (
    <section className="py-6 md:py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl text-brand-red"
            style={{
              fontFamily: "'Avenir LT Pro 35 Light', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
            }}
          >
            Propiedades destacadas
          </h2>
          <p
            className="mt-1 text-sm sm:text-base max-w-xl"
            style={{
              color: '#808080',
              fontFamily: "'Avenir LT Pro 35 Light', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
              lineHeight: '1.45',
            }}
          >
            Inmuebles seleccionados por ubicación, características y
            oportunidad. Consulta disponibilidad, agenda una visita o recibe
            asesoría de nuestro equipo.
          </p>
        </div>
        <Button
          onClick={() => {
            onNavigate('propiedades');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="shrink-0 bg-brand-red hover:bg-brand-red-hover text-white rounded-md px-6 h-11 text-sm font-semibold"
        >
          Ver más
        </Button>
      </div>

      {/* Infinite Carousel */}
      <InfiniteCarousel properties={featured} />
    </section>
  );
}
