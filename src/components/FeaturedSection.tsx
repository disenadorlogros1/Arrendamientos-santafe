'use client';

import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import InfiniteCarousel from '@/components/InfiniteCarousel';
import { properties } from '@/data/properties';
import type { PageType } from '@/components/Header';

interface FeaturedSectionProps {
  onNavigate: (page: PageType) => void;
}

const FONT_HEADING = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";

function applyInkFill(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const size = Math.max(
    Math.hypot(x, y), Math.hypot(rect.width - x, y),
    Math.hypot(x, rect.height - y), Math.hypot(rect.width - x, rect.height - y),
  ) * 2;
  el.style.setProperty('--x', `${x}px`);
  el.style.setProperty('--y', `${y}px`);
  el.style.setProperty('--size', `${size}px`);
}

export default function FeaturedSection({ onNavigate }: FeaturedSectionProps) {
  const featured = properties.filter((p) => p.featured);
  const { ref: titleRef } = useSplitTextAnimation('.featured-title-split', 0, false);

  return (
    <section style={{ background: '#fff' }} className="w-full">

      {/* Header: título + botón — sin línea gris */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 px-4 sm:px-10 lg:px-14"
        style={{ paddingTop: '16px', paddingBottom: '12px' }}
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
          onMouseEnter={applyInkFill}
          onMouseLeave={applyInkFill}
          className="btn-red-outline inline-flex items-center justify-center w-full sm:w-[240px] h-[42px] px-8"
          style={{
            fontSize: 'clamp(14px, 1vw, 16px)',
            flexShrink: 0,
          }}
        >
          <span>Ver más</span>
        </button>
      </div>

      {/* Carrusel — mismo padding que el header, 10% arriba y abajo */}
      <div
        className="px-6 sm:px-10 lg:px-14"
        style={{ paddingTop: '1.5%', paddingBottom: '1.5%' }}
      >
        <InfiniteCarousel properties={featured} />
      </div>

    </section>
  );
}
