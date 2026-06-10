'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import PropertyCard from './PropertyCard';
import type { Property } from '@/data/properties';

interface InfiniteCarouselProps {
  properties: Property[];
}

const buildCards = (properties: Property[]) =>
  Array.from({ length: 5 }, (_, rep) =>
    properties.map((p) => ({ ...p, uid: `${p.id}-${rep}` }))
  ).flat();

export default function InfiniteCarousel({ properties }: InfiniteCarouselProps) {
  const [cards] = useState(() => buildCards(properties));
  const [startIndex, setStartIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(375);
  const [isMounted, setIsMounted] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const VISIBLE  = windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : 4;
  const CARD_W   = windowWidth < 640 ? 280 : windowWidth < 1024 ? 240 : 312;
  const CARD_H   = windowWidth < 640 ? 497 : 'auto';
  const GAP      = windowWidth < 640 ? 8 : 12;
  const SLOT     = CARD_W + GAP;

  // Renderizar VISIBLE + 1 cards (una extra fuera de pantalla)
  const visibleCards = Array.from({ length: VISIBLE + 1 }, (_, i) => {
    const idx = (startIndex + i) % cards.length;
    return { ...cards[idx], slotIndex: i };
  });

  const navigate = useCallback((forward: boolean) => {
    if (isAnimating.current || !trackRef.current) return;
    isAnimating.current = true;

    if (forward) {
      // Deslizar todo el track a la izquierda, luego actualizar estado
      gsap.to(trackRef.current, {
        x: -SLOT,
        duration: 0.65,
        ease: 'power4.out',
        onComplete: () => {
          flushSync(() => setStartIndex((prev) => (prev + 1) % cards.length));
          gsap.set(trackRef.current, { x: 0 });
          isAnimating.current = false;
        },
      });
    } else {
      // Actualizar estado primero (nuevo card queda en posición 0)
      // Reposicionar el track off-screen izquierda, luego animar a 0
      flushSync(() => setStartIndex((prev) => (prev - 1 + cards.length) % cards.length));
      gsap.set(trackRef.current, { x: -SLOT });
      gsap.to(trackRef.current, {
        x: 0,
        duration: 0.65,
        ease: 'power4.out',
        onComplete: () => {
          isAnimating.current = false;
        },
      });
    }
  }, [cards.length, SLOT]);

  // Autoplay
  useEffect(() => {
    if (!isMounted) return;
    const interval = setInterval(() => {
      if (!isAnimating.current) navigate(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [isMounted, navigate]);

  const containerW = VISIBLE * CARD_W + (VISIBLE - 1) * GAP;
  const trackW     = (VISIBLE + 1) * CARD_W + VISIBLE * GAP;

  return (
    <div
      className="wrapper"
      style={{ display: 'grid', gridTemplateColumns: '44px 1fr 44px', alignItems: 'center', gap: '12px', width: '100%' }}
    >
      {/* Botón Anterior */}
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

      {/* Contenedor — recorta el card extra */}
      <div
        style={{
          overflow: 'hidden',
          width: `${containerW}px`,
          margin: '0 auto',
        }}
      >
        {/* Track — este elemento es el que se mueve */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: `${GAP}px`,
            width: `${trackW}px`,
            willChange: 'transform',
          }}
        >
          {visibleCards.map((property) => (
            <div
              key={property.uid}
              data-slot={property.slotIndex}
              className="flex-shrink-0"
              style={{
                width: `${CARD_W}px`,
                minWidth: `${CARD_W}px`,
                height: CARD_H,
              }}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>

      {/* Botón Siguiente */}
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
  );
}
