'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Property } from '@/data/properties';

interface PropertyCardProps {
  property: Property;
}

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';

export default function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered]   = useState(false);
  const [imgIndex,  setImgIndex]    = useState(0);
  const touchStartX                  = useRef<number | null>(null);

  // Build image list — use images[] if available, else fall back to image
  const images = property.images?.length ? property.images : [property.image];
  const total  = images.length;

  const handleViewMore = useCallback(() => {
    router.push(`/propiedad/${property.id}`);
  }, [router, property.id]);

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex(i => (i - 1 + total) % total);
  };
  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex(i => (i + 1) % total);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      setImgIndex(i => dx < 0 ? (i + 1) % total : (i - 1 + total) % total);
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="flex flex-col h-full rounded-lg overflow-hidden"
      style={{
        boxShadow: isHovered
          ? '0 0 28px rgba(0,0,0,0.40)'
          : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Zona de imagen */}
      <div
        className="relative flex-1 overflow-hidden cursor-pointer"
        onClick={handleViewMore}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={images[imgIndex]}
          alt={property.title}
          className="w-full h-full object-cover"
          style={{
            objectPosition: 'center 70%',
            transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
          }}
          loading="lazy"
        />

        {/* Gradiente sutil */}
        <div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.22) 100%)',
          }}
        />

        {/* Botón rojo — flecha superior derecha */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleViewMore(); }}
          aria-label="Ver propiedad"
          style={{
            position: 'absolute', top: '10px', right: '10px',
            width: '36px', height: '36px',
            borderRadius: '50%',
            background: RED,
            border: 'none',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            transition: 'background 0.18s ease, transform 0.18s ease',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#aa182c')}
          onMouseLeave={e => (e.currentTarget.style.background = RED)}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5M11.5 2.5V9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Flechas prev/next — solo mobile, solo si hay más de 1 foto */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Foto anterior"
              className="lg:hidden"
              style={{
                position: 'absolute', left: '8px', top: '50%',
                transform: 'translateY(-50%)',
                width: '30px', height: '30px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.45)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M6.5 1.5L3 5l3.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Siguiente foto"
              className="lg:hidden"
              style={{
                position: 'absolute', right: '8px', top: '50%',
                transform: 'translateY(-50%)',
                width: '30px', height: '30px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.45)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M3.5 1.5L7 5l-3.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Dots — solo mobile */}
            <div
              className="lg:hidden"
              style={{
                position: 'absolute', bottom: '8px', left: 0, right: 0,
                display: 'flex', justifyContent: 'center', gap: '5px',
                pointerEvents: 'none',
              }}
            >
              {images.map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: i === imgIndex ? '16px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background: i === imgIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                    transition: 'width 0.2s ease, background 0.2s ease',
                    display: 'inline-block',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Información de la propiedad */}
      <div onClick={handleViewMore} style={{ padding: '11px 13px 13px', background: '#fff', flexShrink: 0, cursor: 'pointer' }}>
        <p style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 'clamp(18px, 2.2vw, 26px)',
          lineHeight: 1.15,
          color: '#1a1a1a',
          margin: '0 0 4px 0',
          letterSpacing: '-0.3px',
        }}>
          {property.price}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontFamily: FONT, fontSize: '12px', color: '#888', fontWeight: 500, lineHeight: 1.3 }}>
            {property.location}
          </span>
          <span style={{ fontFamily: FONT, fontSize: '12px', color: '#888', fontWeight: 500, lineHeight: 1.3, flexShrink: 0 }}>
            {property.type}
          </span>
        </div>

        <div style={{ height: '2px', background: RED, margin: '3px 0 3px' }} />

        <p style={{ fontFamily: FONT, fontSize: '12px', color: '#888', fontWeight: 400, margin: 0 }}>
          Código inmueble {property.reference.replace('Ref. ', '')}
        </p>
      </div>
    </div>
  );
}
