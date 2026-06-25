'use client';

import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import InfiniteCarousel from '@/components/InfiniteCarousel';
import { properties } from '@/data/properties';
import type { PageType } from '@/components/Header';

interface FeaturedSectionProps {
  onNavigate: (page: PageType) => void;
}

const FONT_BODY    = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const FONT_HEADING = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED          = '#f32735';

export default function FeaturedSection({ onNavigate }: FeaturedSectionProps) {
  const featured = properties.filter((p) => p.featured);
  const { ref: titleRef } = useSplitTextAnimation('.featured-title-split', 0, false);

  return (
    <section style={{ background: '#fff' }} className="w-full">

      {/* Header: título + botón — sin línea gris */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 px-4 sm:px-10 lg:px-14"
        style={{ paddingTop: '28px', paddingBottom: '20px' }}
      >
        <h2
          ref={titleRef}
          className="featured-title-split"
          style={{
            fontFamily: FONT_HEADING,
            fontWeight: 300,
            fontSize: 'clamp(26px, 2.6vw, 46px)',
            color: '#555',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Propiedades <span style={{ fontWeight: 700 }}>destacadas</span>
        </h2>

        <button
          type="button"
          onClick={() => {
            onNavigate('propiedades');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center justify-center transition-colors duration-200 w-full sm:w-[340px]"
          style={{
            background: '#888888',
            color: '#fff',
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: 'clamp(15px, 1.2vw, 18px)',
            letterSpacing: '0.02em',
            border: 'none',
            cursor: 'pointer',
            padding: '10px 32px',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = RED)}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#888888')}
        >
          Ver más
        </button>
      </div>

      {/* Carrusel — mismo padding que el header, 10% arriba y abajo */}
      <div
        className="px-6 sm:px-10 lg:px-14"
        style={{ paddingTop: '3%', paddingBottom: '3%' }}
      >
        <InfiniteCarousel properties={featured} />
      </div>

    </section>
  );
}
