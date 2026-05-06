'use client';

import { useEffect, useRef, useCallback } from 'react';
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

  const cardWidth = 288; // card width + gap

  const singleSetWidth = properties.length * cardWidth;

  const initCarousel = useCallback(() => {
    if (!trackRef.current || tweenRef.current) return;

    const track = trackRef.current;

    // Animate from 0 to -singleSetWidth
    // When it completes and repeats, the visual is identical (clone = original)
    const tween = gsap.fromTo(
      track,
      { x: 0 },
      {
        x: -singleSetWidth,
        duration: properties.length * 8,
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
    tweenRef.current?.pause();
  }, []);

  const handleMouseLeave = useCallback(() => {
    tweenRef.current?.resume();
  }, []);

  // Touch: pause on touch, resume 2.5s after touch ends
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const handleTouchStart = useCallback(() => {
    tweenRef.current?.pause();
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    touchTimerRef.current = setTimeout(() => {
      tweenRef.current?.resume();
    }, 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    };
  }, []);

  return (
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
  );
}
