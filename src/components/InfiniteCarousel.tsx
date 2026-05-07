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
  const [isPaused, setIsPaused] = useState(false);

  const cardWidth = 288; // card width + gap
  const singleSetWidth = properties.length * cardWidth;

  const initCarousel = useCallback(() => {
    if (!trackRef.current || tweenRef.current) return;

    const track = trackRef.current;

    const tween = gsap.fromTo(
      track,
      { x: 0 },
      {
        x: -singleSetWidth,
        duration: properties.length * 12,
        ease: 'none',
        repeat: -1,
      }
    );

    tweenRef.current = tween;
  }, [properties.length, singleSetWidth]);

  useEffect(() => {
    const timer = setTimeout(() => {
      initCarousel();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };
  }, [initCarousel]);

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

  const handlePrev = useCallback(() => {
    if (!tweenRef.current || !trackRef.current) return;
    const currentX = gsap.getProperty(trackRef.current, 'x') as number;
    gsap.to(trackRef.current, {
      x: currentX + cardWidth,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        if (tweenRef.current) {
          tweenRef.current.kill();
          tweenRef.current = null;
          initCarousel();
        }
      },
    });
  }, [cardWidth, initCarousel]);

  const handleNext = useCallback(() => {
    if (!tweenRef.current || !trackRef.current) return;
    const currentX = gsap.getProperty(trackRef.current, 'x') as number;
    gsap.to(trackRef.current, {
      x: currentX - cardWidth,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        if (tweenRef.current) {
          tweenRef.current.kill();
          tweenRef.current = null;
          initCarousel();
        }
      },
    });
  }, [cardWidth, initCarousel]);

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
          className="flex"
          style={{ gap: '16px', willChange: 'transform' }}
        >
          {/* Original set */}
          {properties.map((property) => (
            <div
              key={`orig-${property.id}`}
              className="flex-shrink-0"
              style={{ width: `${cardWidth - 16}px`, minWidth: `${cardWidth - 16}px` }}
            >
              <PropertyCard property={property} />
            </div>
          ))}
          {/* Clone set for seamless loop */}
          {properties.map((property) => (
            <div
              key={`clone-${property.id}`}
              className="flex-shrink-0"
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
