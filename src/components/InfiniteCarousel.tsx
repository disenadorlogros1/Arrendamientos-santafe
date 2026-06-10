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

function applyInkFill(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const size = Math.max(
    Math.hypot(x, y),
    Math.hypot(rect.width - x, y),
    Math.hypot(x, rect.height - y),
    Math.hypot(rect.width - x, rect.height - y),
  ) * 2;
  el.style.setProperty('--x', `${x}px`);
  el.style.setProperty('--y', `${y}px`);
  el.style.setProperty('--size', `${size}px`);
}

export default function InfiniteCarousel({ properties }: InfiniteCarouselProps) {
  const [cards] = useState(() => buildCards(properties));
  const [startIndex, setStartIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(375);
  const [isMounted, setIsMounted] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive: 1 → 2 → 3 → 4 → 5 → 6 cards según viewport
  const VISIBLE =
    windowWidth < 640  ? 1 :
    windowWidth < 1024 ? 2 :
    windowWidth < 1280 ? 3 :
    windowWidth < 1536 ? 4 :
    windowWidth < 1920 ? 5 : 6;
  const GAP = windowWidth < 640 ? 10 : 18;
  // Cards llenan el ancho disponible (viewport - arrows 2×44 - outer gaps 2×12)
  const CARD_W = Math.max(180, Math.floor((windowWidth - 112 - (VISIBLE - 1) * GAP) / VISIBLE));
  // Proporción 9/16 (1080×1920)
  const CARD_H  = Math.round(CARD_W * 16 / 9);
  const SLOT    = CARD_W + GAP;

  const visibleCards = Array.from({ length: VISIBLE + 1 }, (_, i) => {
    const idx = (startIndex + i) % cards.length;
    return { ...cards[idx], slotIndex: i };
  });

  const navigate = useCallback((forward: boolean) => {
    if (isAnimating.current || !trackRef.current || !containerRef.current) return;
    isAnimating.current = true;

    if (forward) {
      const slots = containerRef.current.querySelectorAll<HTMLElement>('[data-slot]');
      const exiting  = slots[0];
      const entering = slots[slots.length - 1];

      gsap.set(entering, { scale: 0.75, opacity: 0 });

      gsap.timeline({
        onComplete: () => {
          flushSync(() => setStartIndex((prev) => (prev + 1) % cards.length));
          gsap.set(trackRef.current, { x: 0 });
          isAnimating.current = false;
        },
      })
        // 20% más lento: 0.75 → 0.9, 0.35 → 0.42, 0.55 → 0.66
        .to(trackRef.current, { x: -SLOT, duration: 0.9, ease: 'power4.out' }, 0)
        .to(exiting,  { scale: 0.75, opacity: 0, duration: 0.42, ease: 'power2.in' }, 0)
        .to(entering, { scale: 1, opacity: 1, duration: 0.66, ease: 'power3.out' }, 0.2);

    } else {
      flushSync(() => setStartIndex((prev) => (prev - 1 + cards.length) % cards.length));

      const slots = containerRef.current.querySelectorAll<HTMLElement>('[data-slot]');
      const entering = slots[0];
      const exiting  = slots[slots.length - 1];

      gsap.set(trackRef.current, { x: -SLOT });
      gsap.set(entering, { scale: 0.75, opacity: 0 });

      gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
        },
      })
        .to(trackRef.current, { x: 0, duration: 0.9, ease: 'power4.out' }, 0)
        .to(exiting,  { scale: 0.75, opacity: 0, duration: 0.42, ease: 'power2.in' }, 0)
        .to(entering, { scale: 1, opacity: 1, duration: 0.66, ease: 'power3.out' }, 0.2);
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
      style={{ display: 'grid', gridTemplateColumns: '44px 1fr 44px', alignItems: 'center', gap: '12px', width: '100%' }}
    >
      {/* Botón Anterior */}
      <button
        type="button"
        onClick={() => navigate(false)}
        onMouseEnter={applyInkFill}
        onMouseLeave={applyInkFill}
        className="carousel-nav-btn w-10 h-10 rounded-full flex items-center justify-center"
        aria-label="Anterior"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Contenedor — recorta la card off-screen */}
      <div
        ref={containerRef}
        style={{ overflow: 'hidden', width: `${containerW}px`, margin: '0 auto' }}
      >
        {/* Track — se mueve horizontalmente */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: `${GAP}px`,
            width: `${trackW}px`,
            willChange: 'transform',
          }}
        >
          {visibleCards.map((property) => (
            <div
              key={property.uid}
              data-slot={property.slotIndex}
              style={{
                width: `${CARD_W}px`,
                minWidth: `${CARD_W}px`,
                height: `${CARD_H}px`,
                flexShrink: 0,
                willChange: 'transform, opacity',
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
        onMouseEnter={applyInkFill}
        onMouseLeave={applyInkFill}
        className="carousel-nav-btn w-10 h-10 rounded-full flex items-center justify-center"
        aria-label="Siguiente"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
