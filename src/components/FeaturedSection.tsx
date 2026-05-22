'use client';

import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import { Button } from '@/components/ui/button';
import InfiniteCarousel from '@/components/InfiniteCarousel';
import { properties } from '@/data/properties';
import type { PageType } from '@/components/Header';

interface FeaturedSectionProps {
  onNavigate: (page: PageType) => void;
}

export default function FeaturedSection({ onNavigate }: FeaturedSectionProps) {
  const featured = properties.filter((p) => p.featured);
  const titleRef = useSplitTextAnimation('.featured-title-split', 1750);

  return (
    <section className="py-6 md:py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6" ref={titleRef}>
        <div>
          <h2
            className="featured-title-split text-3xl sm:text-4xl lg:text-5xl text-brand-red"
            style={{
              fontFamily: "'Avenir Next Ultra Light', 'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
              lineHeight: '0.35',
            }}
          >
            Propiedades{' '}
            <span
              style={{
                fontWeight: 700,
              }}
            >
              destacadas
            </span>
          </h2>
          <p
            className="mt-1 text-sm sm:text-base max-w-xl"
            style={{
              color: '#808080',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
              lineHeight: '1.45',
            }}
          >
            Inmuebles disponibles ahora. Consulta, agenda o pide asesoría.
          </p>
        </div>
        <Button
          onClick={() => {
            onNavigate('propiedades');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="shrink-0 bg-brand-red hover:bg-brand-red-hover text-white rounded-full px-6 h-12 text-sm font-semibold"
        >
          Ver más
        </Button>
      </div>

      {/* Infinite Carousel */}
      <InfiniteCarousel properties={featured} />
    </section>
  );
}
