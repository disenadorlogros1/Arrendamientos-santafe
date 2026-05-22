'use client';

import { useState, useCallback } from 'react';
import PropertyCard from './PropertyCard';
import type { Property } from '@/data/properties';

interface InfiniteCarouselProps {
  properties: Property[];
}

export default function InfiniteCarousel({ properties }: InfiniteCarouselProps) {
  const repeticiones = 3;
  const cardsExtendidas = Array.from({ length: repeticiones }, (_, i) =>
    properties.map((prop) => ({ ...prop, id: `${prop.id}-${i}` }))
  ).flat();

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % cardsExtendidas.length);
  }, [cardsExtendidas.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? cardsExtendidas.length - 1 : prev - 1
    );
  }, [cardsExtendidas.length]);

  return (
    <div className="wrapper">
      {/* Contenedor de cards — solo la activa es visible */}
      <div className="w-full" style={{ minHeight: 420 }}>
        {cardsExtendidas.map((property, index) => (
          <div
            key={property.id}
            className={index !== currentIndex ? 'hide' : ''}
          >
            <PropertyCard property={property} />
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <div className="buttons">
        <button
          type="button"
          onClick={handlePrev}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-brand-red hover:text-brand-red hover:bg-brand-red/5 transition-all duration-200"
          aria-label="Anterior"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Indicador */}
        <span className="text-sm text-gray-400 self-center">
          {currentIndex + 1} / {cardsExtendidas.length}
        </span>

        <button
          type="button"
          onClick={handleNext}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-brand-red hover:text-brand-red hover:bg-brand-red/5 transition-all duration-200"
          aria-label="Siguiente"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
