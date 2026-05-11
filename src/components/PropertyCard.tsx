'use client';

import { useState, useCallback, useRef } from 'react';
import { Eye, MessageCircle, CalendarDays } from 'lucide-react';
import type { Property } from '@/data/properties';

interface PropertyCardProps {
  property: Property;
}

function whatsappLink(message: string) {
  return `https://wa.me/573006557529?text=${encodeURIComponent(message)}`;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number>(0);

  const handleMouseEnter = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Circle circumference for stroke animation
  const radius = 17;
  const circumference = 2 * Math.PI * radius; // ≈ 106.81

  // Arrow path length for draw animation
  const arrowLength = 28;

  return (
    <div
      className="group bg-white rounded-lg overflow-hidden border border-gray-100"
      style={{
        boxShadow: isHovered
          ? '0 8px 25px -5px rgba(0,0,0,0.12), 0 4px 10px -6px rgba(0,0,0,0.06)'
          : '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)',
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
          style={{
            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
          loading="lazy"
        />

        {/* Arrow Button — Always visible, animates on hover */}
        <div
          className="absolute top-3 right-3"
          style={{ cursor: 'pointer' }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: isHovered
                ? 'drop-shadow(0 2px 8px rgba(207,10,44,0.5))'
                : 'drop-shadow(0 1px 3px rgba(0,0,0,0.15))',
              transition: 'filter 0.3s ease',
            }}
          >
            {/* Background fill circle — fills from 0% to 100% on hover */}
            <circle
              cx="20"
              cy="20"
              r={radius}
              fill="#CF0A2C"
              style={{
                clipPath: isHovered ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
                transition: 'clip-path 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transformOrigin: 'center',
              }}
            />

            {/* Circle border — always visible as stroke outline */}
            <circle
              cx="20"
              cy="20"
              r={radius}
              stroke="#CF0A2C"
              strokeWidth="2"
              fill="none"
              style={{
                stroke: isHovered ? '#CF0A2C' : 'rgba(207,10,44,0.7)',
                transition: 'stroke 0.3s ease',
              }}
            />

            {/* Arrow — builds from zero on hover */}
            <path
              d="M15 20L20 15M20 15L25 20M20 15V26"
              stroke={isHovered ? '#ffffff' : '#CF0A2C'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                strokeDasharray: isHovered ? `${arrowLength}` : `0 ${arrowLength}`,
                transition: isHovered
                  ? 'stroke-dasharray 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s, stroke 0s 0.15s'
                  : 'stroke-dasharray 0.35s ease 0.05s, stroke 0.2s ease 0.3s',
              }}
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px 16px' }}>
        {/* Price — Largest, boldest */}
        <p
          style={{
            fontFamily: "'Avenir LT Pro 85 Heavy', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: '20px',
            lineHeight: '1.3',
            color: '#232222',
            margin: '0 0 4px 0',
          }}
        >
          {property.price}
        </p>

        {/* Location — Medium */}
        <p
          style={{
            fontFamily: "'Avenir LT Pro 55 Roman', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '1.4',
            color: '#232222',
            margin: '0 0 4px 0',
          }}
        >
          {property.location}
        </p>

        {/* Size + Type — Small, gray */}
        <p
          style={{
            fontFamily: "'Avenir LT Pro 35 Light', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '13px',
            lineHeight: '1.4',
            color: '#808080',
            margin: '0 0 2px 0',
          }}
        >
          {property.size} · {property.type}
        </p>

        {/* Reference — Smallest, lighter */}
        <p
          style={{
            fontFamily: "'Avenir LT Pro 35 Light', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: '12px',
            lineHeight: '1.4',
            color: '#b0b0b0',
            margin: '2px 0 0 0',
          }}
        >
          {property.reference}
        </p>

        {/* CTAs operativos en iconos */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-around gap-2">
          {/* Ver inmueble */}
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-1 px-2 py-1 text-gray-500 hover:text-brand-red transition-colors group/cta"
            aria-label="Ver inmueble"
            title="Ver inmueble"
          >
            <Eye className="w-5 h-5" />
            <span className="text-[10px] leading-none group-hover/cta:text-brand-red">Ver</span>
          </button>

          {/* Consultar disponibilidad (WhatsApp) */}
          <a
            href={whatsappLink(
              `Hola, quisiera consultar disponibilidad del inmueble ${property.reference} (${property.location}).`
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-1 px-2 py-1 text-gray-500 hover:text-brand-red transition-colors group/cta"
            aria-label="Consultar disponibilidad"
            title="Consultar disponibilidad"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] leading-none group-hover/cta:text-brand-red">Consultar</span>
          </a>

          {/* Agendar visita */}
          <a
            href={whatsappLink(
              `Hola, me gustaría agendar una visita al inmueble ${property.reference} (${property.location}).`
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-1 px-2 py-1 text-gray-500 hover:text-brand-red transition-colors group/cta"
            aria-label="Agendar visita"
            title="Agendar visita"
          >
            <CalendarDays className="w-5 h-5" />
            <span className="text-[10px] leading-none group-hover/cta:text-brand-red">Agendar</span>
          </a>
        </div>
      </div>
    </div>
  );
}
