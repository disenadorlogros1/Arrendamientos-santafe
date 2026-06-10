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

const NAV_W = 40; // px — ancho del botón flecha
const GAP   = 12; // px — gap entre cards y entre flechas/contenedor

export default function InfiniteCarousel({ properties }: InfiniteCarouselProps) {
  const [cards] = useState(() => buildCards(properties));
  const [startIndex, setStartIndex] = useState(0);
  const [windowWidth, setWindowWidth]       = useState(375);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null); // overflow:hidden — medido con ResizeObserver
  const trackRef     = useRef<HTMLDivElement>(null);
  const isAnimating  = useRef(false);

  /* Viewport width — para decidir cuántas cards */
  useEffect(() => {
    setIsMounted(true);
    const onResize = () => setWindowWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* Ancho real del contenedor via ResizeObserver */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setContainerWidth(w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMounted]);

  const VISIBLE = windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : windowWidth < 1280 ? 3 : 4;

  /* CARD_W llena el contenedor exactamente */
  const CARD_W = containerWidth > 0
    ? Math.floor((containerWidth - (VISIBLE - 1) * GAP) / VISIBLE)
    : 0;
  const CARD_H = Math.round(CARD_W * 16 / 9);
  const SLOT   = CARD_W + GAP;

  const visibleCards = Array.from({ length: VISIBLE + 1 }, (_, i) => {
    const idx = (startIndex + i) % cards.length;
    return { ...cards[idx], slotIndex: i };
  });

  const navigate = useCallback((forward: boolean) => {
    if (isAnimating.current || !trackRef.current || !containerRef.current) return;
    if (CARD_W === 0) return;
    isAnimating.current = true;

    if (forward) {
      const slots    = containerRef.current.querySelectorAll<HTMLElement>('[data-slot]');
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
        .to(trackRef.current, { x: -SLOT,  duration: 0.9,  ease: 'power4.out'  }, 0)
        .to(exiting,          { scale: 0.75, opacity: 0, duration: 0.42, ease: 'power2.in'  }, 0)
        .to(entering,         { scale: 1,    opacity: 1, duration: 0.66, ease: 'power3.out' }, 0.2);

    } else {
      flushSync(() => setStartIndex((prev) => (prev - 1 + cards.length) % cards.length));

      const slots    = containerRef.current.querySelectorAll<HTMLElement>('[data-slot]');
      const entering = slots[0];
      const exiting  = slots[slots.length - 1];

      gsap.set(trackRef.current, { x: -SLOT });
      gsap.set(entering,         { scale: 0.75, opacity: 0 });

      gsap.timeline({
        onComplete: () => { isAnimating.current = false; },
      })
        .to(trackRef.current, { x: 0,    duration: 0.9,  ease: 'power4.out'  }, 0)
        .to(exiting,          { scale: 0.75, opacity: 0, duration: 0.42, ease: 'power2.in'  }, 0)
        .to(entering,         { scale: 1,    opacity: 1, duration: 0.66, ease: 'power3.out' }, 0.2);
    }
  }, [cards.length, SLOT, CARD_W]);

  /* Autoplay */
  useEffect(() => {
    if (!isMounted) return;
    const interval = setInterval(() => {
      if (!isAnimating.current) navigate(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [isMounted, navigate]);

  const trackW = CARD_W > 0 ? (VISIBLE + 1) * CARD_W + VISIBLE * GAP : 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: `${GAP}px`, width: '100%' }}>

      {/* Flecha izquierda */}
      <button
        type="button"
        onClick={() => navigate(false)}
        onMouseEnter={applyInkFill}
        onMouseLeave={applyInkFill}
        className="carousel-nav-btn rounded-full flex items-center justify-center"
        style={{ width: `${NAV_W}px`, height: `${NAV_W}px`, flexShrink: 0 }}
        aria-label="Anterior"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Contenedor: clipea la card extra off-screen */}
      <div
        ref={containerRef}
        style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}
      >
        {CARD_W > 0 && (
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
        )}
      </div>

      {/* Flecha derecha */}
      <button
        type="button"
        onClick={() => navigate(true)}
        onMouseEnter={applyInkFill}
        onMouseLeave={applyInkFill}
        className="carousel-nav-btn rounded-full flex items-center justify-center"
        style={{ width: `${NAV_W}px`, height: `${NAV_W}px`, flexShrink: 0 }}
        aria-label="Siguiente"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

    </div>
  );
}
