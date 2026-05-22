'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import PropertyCard from './PropertyCard';
import type { Property } from '@/data/properties';

interface InfiniteCarouselProps {
  properties: Property[];
}

// Repetir cards para tener suficientes
const buildCards = (properties: Property[]) =>
  Array.from({ length: 5 }, (_, rep) =>
    properties.map((p) => ({ ...p, uid: `${p.id}-${rep}` }))
  ).flat();

export default function InfiniteCarousel({ properties }: InfiniteCarouselProps) {
  const [cards] = useState(() => buildCards(properties));
  const [startIndex, setStartIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1280);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  // Actualizar ancho de ventana
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Valores responsivos
  const VISIBLE = windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : 4; // mobile: 1, tablet: 2, desktop: 4
  const CARD_W = windowWidth < 640 ? 180 : windowWidth < 1024 ? 240 : 312; // mobile: 180, tablet: 240, desktop: 312
  const GAP = windowWidth < 640 ? 8 : 12;

  // Cards actualmente visibles
  const visibleCards = Array.from({ length: VISIBLE }, (_, i) => {
    const idx = (startIndex + i) % cards.length;
    return { ...cards[idx], slotIndex: i };
  });

  const navigate = useCallback((forward: boolean) => {
    if (isAnimating.current || !containerRef.current) return;
    isAnimating.current = true;

    const slots = containerRef.current.querySelectorAll<HTMLElement>('[data-slot]');
    const leavingSlot = forward ? slots[0] : slots[slots.length - 1];

    // Animar la card que sale
    gsap.to(leavingSlot, {
      opacity: 0,
      scale: 0,
      transformOrigin: forward ? 'bottom left' : 'bottom right',
      duration: 0.7,
      ease: 'power2.in',
      onComplete: () => {
        // DESPUÉS de que la card salga, actualizar startIndex
        flushSync(() => {
          setStartIndex((prev) =>
            forward
              ? (prev + 1) % cards.length
              : (prev - 1 + cards.length) % cards.length
          );
        });

        // AHORA animar la card que ENTRA (que ya es diferente porque React actualizó)
        requestAnimationFrame(() => {
          const newSlots = containerRef.current?.querySelectorAll<HTMLElement>('[data-slot]');
          if (!newSlots) return;
          const enteringSlot = forward ? newSlots[newSlots.length - 1] : newSlots[0];

          // Asegurar que esté invisible antes de animar
          gsap.set(enteringSlot, { opacity: 0, scale: 0 });

          gsap.fromTo(
            enteringSlot,
            { opacity: 0, scale: 0 },
            {
              opacity: 1,
              scale: 1,
              transformOrigin: forward ? 'bottom right' : 'bottom left',
              duration: 0.7,
              ease: 'power2.out',
              onComplete: () => {
                isAnimating.current = false;
              },
            }
          );
        });
      },
    });
  }, [cards.length]);

  return (
    <div className="wrapper">
      {/* Contenedor horizontal de cards */}
      <div
        ref={containerRef}
        className="overflow-hidden"
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: `${GAP}px`,
          width: `${VISIBLE * CARD_W + (VISIBLE - 1) * GAP}px`,
          margin: '0 auto',
        }}
      >
        {visibleCards.map((property) => (
          <div
            key={property.uid}
            data-slot={property.slotIndex}
            className="flex-shrink-0"
            style={{ width: `${CARD_W}px`, minWidth: `${CARD_W}px` }}
          >
            <PropertyCard property={property} />
          </div>
        ))}
      </div>

      {/* Botones */}
      <div className="buttons">
        <button
          type="button"
          onClick={() => navigate(false)}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-brand-red hover:text-brand-red hover:bg-brand-red/5 transition-all duration-200"
          aria-label="Anterior"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => navigate(true)}
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
