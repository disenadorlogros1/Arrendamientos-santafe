'use client';

import { motion } from 'framer-motion';
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
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.featured-title-split', 0, false);

  return (
    <section className="py-6 md:py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h2
            ref={titleRef}
            className="featured-title-split text-3xl sm:text-4xl lg:text-5xl text-brand-red"
            style={{
              fontFamily: "'Avenir Next Ultra Light', 'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
              lineHeight: '1.2',
            }}
          >
            Propiedades <span style={{ fontWeight: 700 }}>destacadas</span>
          </h2>
          {/* Subtítulo: se activa cuando titleAnimating=true (COMIENZA la animación) */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleAnimating ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mt-5 text-sm sm:text-base max-w-xl"
            style={{
              color: '#808080',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
              lineHeight: '1.45',
            }}
          >
            Inmuebles disponibles ahora. Consulta, agenda o pide asesoría.
          </motion.p>
        </div>
        <button
          type="button"
          onClick={() => {
            onNavigate('propiedades');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="shrink-0 bg-brand-red hover:bg-white text-white hover:text-brand-red px-6 h-12 text-sm font-semibold transition-all duration-300 hover:scale-105"
          style={{ lineHeight: '1.2' }}
        >
          Ver más
        </button>
      </div>

      {/* Infinite Carousel */}
      <InfiniteCarousel properties={featured} />
    </section>
  );
}
