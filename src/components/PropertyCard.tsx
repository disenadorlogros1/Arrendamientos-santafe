'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Property } from '@/data/properties';

interface PropertyCardProps {
  property: Property;
}

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';

export default function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleViewMore = useCallback(() => {
    router.push(`/propiedad/${property.id}`);
  }, [router, property.id]);

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
      {/* Imagen */}
      <div
        className="relative flex-1 overflow-hidden cursor-pointer"
        onClick={handleViewMore}
      >
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
          style={{
            objectPosition: 'center 70%',
            transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
          }}
          loading="lazy"
        />
        {/* Gradiente sutil para anclar visualmente la imagen con el área blanca */}
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
      </div>

      {/* Información de la propiedad */}
      <div onClick={handleViewMore} style={{ padding: '11px 13px 13px', background: '#fff', flexShrink: 0, cursor: 'pointer' }}>
        {/* Precio */}
        <p style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 'clamp(18px, 2.2vw, 26px)',
          lineHeight: 1.15,
          color: '#232222',
          margin: '0 0 4px 0',
          letterSpacing: '-0.3px',
        }}>
          {property.price}
        </p>

        {/* Ubicación y Tipo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontFamily: FONT, fontSize: '12px', color: '#808080', fontWeight: 500, lineHeight: 1.3 }}>
            {property.location}
          </span>
          <span style={{ fontFamily: FONT, fontSize: '12px', color: '#808080', fontWeight: 500, lineHeight: 1.3, flexShrink: 0 }}>
            {property.type}
          </span>
        </div>

        {/* Línea roja separadora */}
        <div style={{ height: '2px', background: RED, margin: '3px 0 3px' }} />

        {/* Código de referencia */}
        <p style={{ fontFamily: FONT, fontSize: '12px', color: '#909090', fontWeight: 400, margin: 0 }}>
          Código inmueble: {property.reference}
        </p>
      </div>
    </div>
  );
}
