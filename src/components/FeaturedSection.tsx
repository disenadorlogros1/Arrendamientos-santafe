'use client';

import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import InfiniteCarousel from '@/components/InfiniteCarousel';
import { properties } from '@/data/properties';
import type { PageType } from '@/components/Header';

interface FeaturedSectionProps {
  onNavigate: (page: PageType) => void;
}

const FONT_BODY    = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const FONT_HEADING = "'Avenir Next Ultra Light', 'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif";
const RED          = '#f32735';

export default function FeaturedSection({ onNavigate }: FeaturedSectionProps) {
  const featured = properties.filter((p) => p.featured);
  const { ref: titleRef } = useSplitTextAnimation('.featured-title-split', 0, false);

  return (
    <section style={{ background: '#F5F5F5' }} className="w-full overflow-hidden">

      {/* Fila header: celda título + celda botón */}
      <div className="flex flex-col sm:flex-row" style={{ gap: '3px' }}>

        {/* Celda título */}
        <div
          className="flex-1 flex flex-col justify-center px-8 py-5 sm:px-12 sm:py-6 lg:px-16"
          style={{ background: '#fff' }}
        >
          <h2
            ref={titleRef}
            className="featured-title-split"
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 300,
              fontSize: 'clamp(26px, 2.6vw, 46px)',
              color: RED,
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Propiedades <span style={{ fontWeight: 700 }}>destacadas</span>
          </h2>
        </div>

        {/* Celda botón */}
        <button
          type="button"
          onClick={() => {
            onNavigate('propiedades');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center justify-center transition-colors duration-200 py-8 sm:py-0"
          style={{ background: '#888888', flexShrink: 0, minWidth: '280px' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = RED)}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#888888')}
        >
          <span
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: 'clamp(15px, 1.2vw, 18px)',
              color: '#fff',
              letterSpacing: '0.02em',
            }}
          >
            Ver más
          </span>
        </button>
      </div>

      {/* Celda carrusel */}
      <div style={{ marginTop: '3px', background: '#fff', paddingTop: '24px', paddingBottom: '24px' }}>
        <InfiniteCarousel properties={featured} />
      </div>

    </section>
  );
}
