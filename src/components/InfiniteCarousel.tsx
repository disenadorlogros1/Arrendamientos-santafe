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
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const directionRef = useRef<'forward' | 'backward'>('forward');
  const [isPaused, setIsPaused] = useState(false);
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());

  const cardWidth = 280; // card width + gap (ajustado para layout vertical)
  const singleSetWidth = properties.length * cardWidth;
  const speedPerCard = 13; // seconds per card
  const visibleCardsCount = 4; // Number of visible cards at once

  // Calcula qué cards deben ser visibles basado en la posición X del track
  const updateVisibleCards = useCallback(() => {
    if (!trackRef.current) return;

    const currentX = gsap.getProperty(trackRef.current, 'x') as number;
    const newVisibleIndices = new Set<number>();

    // Calcular cuál es la primera card visible basado en la posición X
    // Cada card ocupa cardWidth, entonces dividimos currentX por cardWidth
    const firstVisibleIndex = Math.abs(Math.round(currentX / cardWidth)) % properties.length;

    // Agregar los índices de las 4 cards visibles
    for (let i = 0; i < visibleCardsCount; i++) {
      const index = (firstVisibleIndex + i) % properties.length;
      newVisibleIndices.add(index);
    }

    setVisibleIndices(newVisibleIndices);
  }, [properties.length, cardWidth, visibleCardsCount]);

  const startInfiniteScroll = useCallback((fromX: number) => {
    if (!trackRef.current) return;

    // Kill any existing tween
    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }

    // Normalize: keep x within [-singleSetWidth, 0]
    let startX = fromX;
    if (startX > 0) startX -= singleSetWidth;
    if (startX < -singleSetWidth) startX += singleSetWidth;
    gsap.set(trackRef.current, { x: startX });

    // Direction: forward = track moves left (cards scroll left). backward = track moves right (cards scroll right).
    const isForward = directionRef.current === 'forward';
    const endX = isForward ? startX - singleSetWidth : startX + singleSetWidth;

    // Animate one full set width, then repeat (jump back = visually identical due to clone)
    tweenRef.current = gsap.fromTo(
      trackRef.current,
      { x: startX },
      {
        x: endX,
        duration: properties.length * speedPerCard,
        ease: 'none',
        repeat: -1,
        onUpdate: () => {
          updateVisibleCards();
        },
      }
    );
  }, [properties.length, singleSetWidth, speedPerCard, updateVisibleCards]);

  const initCarousel = useCallback(() => {
    if (!trackRef.current || tweenRef.current) return;
    startInfiniteScroll(0);
  }, [startInfiniteScroll]);

  useEffect(() => {
    const timer = setTimeout(() => {
      initCarousel();
      updateVisibleCards();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };
  }, [initCarousel, updateVisibleCards]);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
    tweenRef.current?.pause();
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
    tweenRef.current?.resume();
  }, []);

  // Touch: pause on touch, resume 2.5s after touch ends
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const handleTouchStart = useCallback(() => {
    setIsPaused(true);
    tweenRef.current?.pause();
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    touchTimerRef.current = setTimeout(() => {
      setIsPaused(false);
      tweenRef.current?.resume();
    }, 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    };
  }, []);

  // Flecha izquierda: invierte la dirección del giro hacia la izquierda (cards entran por la izquierda).
  const handlePrev = useCallback(() => {
    if (!tweenRef.current || !trackRef.current) return;

    // Cambia la dirección a "backward" (track se mueve hacia la derecha → cards entran por la izquierda)
    directionRef.current = 'backward';

    tweenRef.current.pause();

    const currentX = gsap.getProperty(trackRef.current, 'x') as number;
    const targetX = currentX + cardWidth;

    gsap.to(trackRef.current, {
      x: targetX,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        // Reanuda el scroll infinito en la nueva dirección (backward)
        startInfiniteScroll(targetX);
      },
    });
  }, [cardWidth, startInfiniteScroll]);

  // Flecha derecha: dirección por defecto (cards entran por la derecha, giran hacia la izquierda).
  const handleNext = useCallback(() => {
    if (!tweenRef.current || !trackRef.current) return;

    // Cambia la dirección a "forward" (track se mueve hacia la izquierda → cards entran por la derecha)
    directionRef.current = 'forward';

    tweenRef.current.pause();

    const currentX = gsap.getProperty(trackRef.current, 'x') as number;
    const targetX = currentX - cardWidth;

    gsap.to(trackRef.current, {
      x: targetX,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        // Reanuda el scroll infinito en la nueva dirección (forward)
        startInfiniteScroll(targetX);
      },
    });
  }, [cardWidth, startInfiniteScroll]);

  return (
    <div>
      <div
        ref={wrapperRef}
        className="w-full overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={trackRef}
          className="flex carousel-container"
          style={{ gap: '16px', willChange: 'transform' }}
        >
          {/* Original set */}
          {properties.map((property, index) => (
            <div
              key={`orig-${property.id}`}
              className={`carousel-item ${!visibleIndices.has(index) ? 'hide' : ''}`}
              style={{ width: `${cardWidth - 16}px`, minWidth: `${cardWidth - 16}px` }}
            >
              <PropertyCard property={property} />
            </div>
          ))}
          {/* Clone set for seamless loop */}
          {properties.map((property, index) => (
            <div
              key={`clone-${property.id}`}
              className={`carousel-item ${!visibleIndices.has(index) ? 'hide' : ''}`}
              style={{ width: `${cardWidth - 16}px`, minWidth: `${cardWidth - 16}px` }}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="flex items-center justify-center gap-4 mt-5">
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

        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isPaused ? 'bg-brand-red' : 'bg-gray-300'}`} />
          <div className={`w-6 h-2 rounded-full transition-colors duration-300 ${isPaused ? 'bg-brand-red/50' : 'bg-gray-200'}`} />
        </div>

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
