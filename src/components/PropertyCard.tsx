'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Property } from '@/data/properties';

interface PropertyCardProps {
  property: Property;
}

const FONT = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';

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
          ? '0 12px 32px -6px rgba(0,0,0,0.18)'
          : '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen: ocupa todo el espacio disponible */}
      <div
        className="relative flex-1 overflow-hidden cursor-pointer"
        onClick={handleViewMore}
      >
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
          style={{
            transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
          }}
          loading="lazy"
        />

        {/* Botón único — flecha superior derecha, ink-fill animation */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleViewMore(); }}
          onMouseEnter={applyInkFill}
          onMouseLeave={applyInkFill}
          className="hero-btn-fill absolute top-3 right-3 flex items-center justify-center rounded-full"
          aria-label="Ver propiedad"
          style={{ width: '36px', height: '36px' }}
        >
          <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/icons/icon-more-white.gif" alt="" width={16} height={16} style={{ objectFit: 'contain' }} />
          </span>
        </button>
      </div>

      {/* Información de la propiedad */}
      <div style={{ padding: '11px 13px 13px', background: '#fff', flexShrink: 0 }}>
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
        <div style={{ height: '2px', background: RED, margin: '7px 0 6px' }} />

        {/* Código de referencia */}
        <p style={{ fontFamily: FONT, fontSize: '12px', color: '#909090', fontWeight: 400, margin: 0 }}>
          {property.reference}
        </p>
      </div>
    </div>
  );
}
