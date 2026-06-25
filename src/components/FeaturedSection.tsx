'use client';

import { useState } from 'react';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import InfiniteCarousel from '@/components/InfiniteCarousel';
import { properties } from '@/data/properties';
import type { PageType } from '@/components/Header';

interface FeaturedSectionProps {
  onNavigate: (page: PageType) => void;
}

const FONT_HEADING = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const H_PAD = 32; // debe coincidir con H_PAD en InfiniteCarousel

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
  const [cardWidth, setCardWidth] = useState(0);

  return (
    <section style={{ background: '#fff' }} className="w-full">
      {/* Wrapper exterior compartido — igual que el div del carrusel */}
      <div className="px-6 sm:px-10 lg:px-14">

        {/* Header — H_PAD a cada lado para alinearse con el borde de las cards */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6"
          style={{ paddingTop: '16px', paddingBottom: '12px', paddingLeft: H_PAD, paddingRight: H_PAD }}
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
            className="btn-red-outline inline-flex items-center justify-center h-[42px] px-4 shrink-0"
            style={{
              fontSize: 'clamp(14px, 1vw, 16px)',
              width: cardWidth > 0 ? `${cardWidth}px` : '200px',
            }}
          >
            <span>Ver más</span>
          </button>
        </div>

        {/* Carrusel */}
        <div style={{ paddingTop: '1.5%', paddingBottom: '1.5%' }}>
          <InfiniteCarousel properties={featured} onCardWidthChange={setCardWidth} />
        </div>

      </div>
    </section>
  );
}
