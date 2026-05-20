'use client';

import { useState, useCallback } from 'react';
import type { Property } from '@/data/properties';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Construir mensaje de comodidades para Favorito/WhatsApp
  const buildAmenitiesMessage = () => {
    const amenities: string[] = [];

    if (property.bedrooms) {
      amenities.push(`${property.bedrooms} habitación${property.bedrooms > 1 ? 'es' : ''}`);
    }
    if (property.bathrooms) {
      amenities.push(`${property.bathrooms} baño${property.bathrooms > 1 ? 's' : ''}`);
    }
    if (property.parking) {
      amenities.push(`${property.parking} parqueader${property.parking > 1 ? 'os' : 'o'}`);
    }
    if (property.pool) {
      amenities.push('piscina');
    }

    return amenities.join(', ');
  };

  const favoriteMessage = `Mira esta propiedad en ${property.location}
Comodidades: ${buildAmenitiesMessage()}

es una de mis favoritas en arrendamiento Santa Fe`;

  const whatsappFavoriteLink = `https://wa.me/?text=${encodeURIComponent(favoriteMessage)}`;
  const whatsappConsultLink = `https://wa.me/573006557529?text=${encodeURIComponent(
    `Hola, quisiera consultar disponibilidad del inmueble ${property.reference} (${property.location}).`
  )}`;

  return (
    <>
      <div
        className="group bg-white rounded-lg overflow-hidden border border-gray-100 flex flex-col h-full"
        style={{
          boxShadow: isHovered
            ? '0 8px 25px -5px rgba(0,0,0,0.12), 0 4px 10px -6px rgba(0,0,0,0.06)'
            : '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)',
          transition: 'box-shadow 0.3s ease',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image Container — Vertical Layout */}
        <div className="relative overflow-hidden w-full" style={{ aspectRatio: '1/1' }}>
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

          {/* 4 Iconos en esquina superior derecha */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* Ver Más */}
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center"
              aria-label="Ver más"
              title="Ver más"
              style={{
                width: isHovered ? '44px' : '24px',
                height: isHovered ? '44px' : '24px',
                backgroundColor: '#f32735',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width={isHovered ? '20' : '12'}
                height={isHovered ? '20' : '12'}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: 'all 0.3s ease' }}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Consultar (WhatsApp) */}
            <a
              href={whatsappConsultLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center"
              aria-label="Consultar"
              title="Consultar"
              style={{
                width: isHovered ? '44px' : '24px',
                height: isHovered ? '44px' : '24px',
                backgroundColor: '#f32735',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width={isHovered ? '20' : '12'}
                height={isHovered ? '20' : '12'}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: 'all 0.3s ease' }}
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </a>

            {/* Agendar */}
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center"
              aria-label="Agendar"
              title="Agendar"
              style={{
                width: isHovered ? '44px' : '24px',
                height: isHovered ? '44px' : '24px',
                backgroundColor: '#f32735',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width={isHovered ? '20' : '12'}
                height={isHovered ? '20' : '12'}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: 'all 0.3s ease' }}
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </button>

            {/* Favorito */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowLoginModal(true);
              }}
              className="flex items-center justify-center"
              aria-label="Favorito"
              title="Favorito"
              style={{
                width: isHovered ? '44px' : '24px',
                height: isHovered ? '44px' : '24px',
                backgroundColor: '#f32735',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width={isHovered ? '20' : '12'}
                height={isHovered ? '20' : '12'}
                viewBox="0 0 24 24"
                fill={isHovered ? 'white' : 'none'}
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: 'all 0.3s ease' }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content — Flex-grow para llenar espacio */}
        <div className="flex-grow flex flex-col justify-between p-4">
          {/* Información Principal */}
          <div>
            {/* Precio */}
            <p
              style={{
                fontFamily: "'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                fontWeight: 900,
                fontSize: '30px',
                lineHeight: '1.2',
                color: '#232222',
                margin: '0 0 8px 0',
                letterSpacing: '-0.5px',
              }}
            >
              {property.price}
            </p>

            {/* Ubicación y Tipo (misma línea) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '8px',
              }}
            >
              <p
                style={{
                  fontFamily: "'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: '13px',
                  lineHeight: '1.4',
                  color: '#808080',
                  margin: '0',
                }}
              >
                {property.location}
              </p>

              <p
                style={{
                  fontFamily: "'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                  fontWeight: 900,
                  fontSize: '15px',
                  lineHeight: '1.4',
                  color: '#808080',
                  margin: '0',
                }}
              >
                {property.type}
              </p>
            </div>
          </div>

          {/* Comodidades con Iconos */}
          <div className="flex pt-3 border-t-2 border-brand-red">
            {/* Área */}
            <div className="flex-1 flex flex-col items-center gap-1 border-r border-brand-red pr-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f32735" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 21H3V3h18v18zM9 3v18M3 9h18" />
              </svg>
              <span style={{ fontSize: '11px', color: '#232222', fontWeight: 500, textAlign: 'center' }}>
                {property.size}
              </span>
            </div>

            {/* Habitaciones */}
            <div className="flex-1 flex flex-col items-center gap-1 border-r border-brand-red px-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f32735" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span style={{ fontSize: '11px', color: '#232222', fontWeight: 500 }}>
                {property.bedrooms}
              </span>
            </div>

            {/* Baños */}
            <div className="flex-1 flex flex-col items-center gap-1 border-r border-brand-red px-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f32735" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9h18V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3zm0 0v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9" />
                <circle cx="8" cy="15" r="1" />
                <circle cx="16" cy="15" r="1" />
              </svg>
              <span style={{ fontSize: '11px', color: '#232222', fontWeight: 500 }}>
                {property.bathrooms}
              </span>
            </div>

            {/* Parqueadero o Piscina */}
            <div className="flex-1 flex flex-col items-center gap-1 pl-2">
              {property.parking ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f32735" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" />
                    <path d="M5 8h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" />
                  </svg>
                  <span style={{ fontSize: '11px', color: '#232222', fontWeight: 500 }}>
                    {property.parking}
                  </span>
                </>
              ) : property.pool ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f32735" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M2 12h20" />
                  </svg>
                  <span style={{ fontSize: '11px', color: '#232222', fontWeight: 500 }}>
                    ✓
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '11px', color: '#b0b0b0' }}>-</span>
              )}
            </div>
          </div>

          {/* Reference */}
          <p
            style={{
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: '11px',
              lineHeight: '1.4',
              color: '#b0b0b0',
              margin: '8px 0 0 0',
            }}
          >
            {property.reference}
          </p>
        </div>
      </div>

      {/* Modal para Favorito */}
      {showLoginModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
          onClick={() => setShowLoginModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#232222' }}>
              Guardar propiedad
            </h3>

            {/* Opción 1: Login */}
            <button
              type="button"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#f32735',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '12px',
                fontWeight: 600,
                fontSize: '14px',
              }}
              onClick={() => setShowLoginModal(false)}
            >
              Iniciar sesión con Google
            </button>

            <button
              type="button"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#1877F2',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '16px',
                fontWeight: 600,
                fontSize: '14px',
              }}
              onClick={() => setShowLoginModal(false)}
            >
              Iniciar sesión con Facebook
            </button>

            <div style={{ textAlign: 'center', color: '#808080', marginBottom: '16px', fontSize: '14px' }}>
              O comparte por WhatsApp
            </div>

            {/* Opción 2: Compartir por WhatsApp */}
            <a
              href={whatsappFavoriteLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#25D366',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                textAlign: 'center',
                textDecoration: 'none',
              }}
              onClick={() => setShowLoginModal(false)}
            >
              Compartir en WhatsApp
            </a>

            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                color: '#808080',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '12px',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
