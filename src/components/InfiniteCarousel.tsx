'use client';

import { useRef, useCallback, useState } from 'react';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import PropertyCard from './PropertyCard';
import type { Property } from '@/data/properties';

gsap.registerPlugin(Flip);

interface InfiniteCarouselProps {
  properties: Property[];
}

// Generar lista inicial con IDs únicos
const buildCards = (properties: Property[]) =>
  properties.map((p, i) => ({ ...p, uid: `${p.id}-${i}` }));

export default function InfiniteCarousel({ properties }: InfiniteCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const [cards, setCards] = useState(() => buildCards(properties));

  const updateCaterpillar = useCallback((forward: boolean) => {
    if (isAnimating.current || !containerRef.current) return;
    isAnimating.current = true;

    // 1. Capturar estado ANTES de que React cambie el DOM
    const cardEls = gsap.utils.toArray<HTMLElement>('[data-card]', containerRef.current);
    const state = Flip.getState(cardEls);

    // 2. Actualizar state de forma síncrona para que el DOM cambie inmediatamente
    flushSync(() => {
      setCards((prev) => {
        const next = [...prev];
        if (forward) {
          const first = next.shift()!;
          next.push({ ...first, uid: `${first.uid}-f${Date.now()}` });
        } else {
          const last = next.pop()!;
          next.unshift({ ...last, uid: `${last.uid}-b${Date.now()}` });
        }
        return next;
      });
    });

    // 3. Ejecutar Flip DESPUÉS de que el DOM esté actualizado
    Flip.from(state, {
      targets: '[data-card]',
      fade: true,
      absoluteOnLeave: true,
      onEnter: (els) => {
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            transformOrigin: forward ? 'bottom right' : 'bottom left',
            duration: 0.5,
            ease: 'power2.out',
          }
        );
      },
      onLeave: (els) => {
        gsap.to(els, {
          opacity: 0,
          scale: 0,
          transformOrigin: forward ? 'bottom left' : 'bottom right',
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => {
            isAnimating.current = false;
          },
        });
      },
    });
  }, []);

  return (
    <div className="wrapper">
      {/* Contenedor de cards */}
      <div
        ref={containerRef}
        className="container w-full overflow-hidden"
        style={{ gap: '16px' }}
      >
        {cards.map((property) => (
          <div
            key={property.uid}
            data-card
            className="flex-shrink-0"
            style={{ width: '264px', minWidth: '264px' }}
          >
            <PropertyCard property={property} />
          </div>
        ))}
      </div>

      {/* Botones */}
      <div className="buttons">
        <button
          type="button"
          id="prev"
          onClick={() => updateCaterpillar(false)}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-brand-red hover:text-brand-red hover:bg-brand-red/5 transition-all duration-200"
          aria-label="Anterior"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          type="button"
          id="next"
          onClick={() => updateCaterpillar(true)}
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
