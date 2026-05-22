'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import PropertyCard from './PropertyCard';
import type { Property } from '@/data/properties';

interface InfiniteCarouselProps {
  properties: Property[];
}

export default function InfiniteCarousel({ properties }: InfiniteCarouselProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const cardWidth = 280;
  const repeticiones = 3;
  const cardsExtendidas = Array.from({ length: repeticiones }, (_, i) =>
    properties.map((prop) => ({ ...prop, id: `${prop.id}-${i}` }))
  ).flat();

  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % cardsExtendidas.length;
    setCurrentIndex(nextIndex);

    if (trackRef.current) {
      gsap.to(trackRef.current, {
        x: -nextIndex * cardWidth,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }, [currentIndex, cardsExtendidas.length, cardWidth]);

  const handlePrev = useCallback(() => {
    const prevIndex = currentIndex === 0 ? cardsExtendidas.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);

    if (trackRef.current) {
      gsap.to(trackRef.current, {
        x: -prevIndex * cardWidth,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }, [currentIndex, cardsExtendidas.length, cardWidth]);

  useEffect(() => {
    if (trackRef.current) {
      gsap.set(trackRef.current, { x: 0 });
    }
  }, []);

  return (
    <div className="wrapper">
      <div
        ref={wrapperRef}
        className="w-full overflow-hidden"
      >
        <div
          ref={trackRef}
          className="flex"
          style={{ gap: '16px', willChange: 'transform' }}
        >
          {cardsExtendidas.map((property) => (
            <div
              key={property.id}
              className="flex-shrink-0"
              style={{ width: `${cardWidth - 16}px`, minWidth: `${cardWidth - 16}px` }}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
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
