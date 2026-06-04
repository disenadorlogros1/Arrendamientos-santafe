'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Property } from '@/data/properties';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleViewMore = useCallback(() => {
    router.push(`/propiedad/${property.id}`);
  }, [router, property.id]);

  const handleImageClick = useCallback(() => {
    router.push(`/propiedad/${property.id}`);
  }, [router, property.id]);

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
  const whatsappScheduleLink = `https://wa.me/573006557529?text=${encodeURIComponent(
    `Hola, quisiera agendar una visita al inmueble ${property.reference} ubicado en ${property.location}.`
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
        <div
          className="relative overflow-hidden w-full cursor-pointer"
          style={{ aspectRatio: '4/5' }}
          onClick={handleImageClick}
        >
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

          {/* 4 Botones en esquina superior derecha */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* Ver Más */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleViewMore();
              }}
              onMouseEnter={() => setHoveredButton('more')}
              onMouseLeave={() => setHoveredButton(null)}
              className="flex items-center justify-center"
              aria-label="Ver más"
              title="Ver más"
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: '#f32735',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: hoveredButton === 'more' ? 'scale(1.5)' : 'scale(1)',
              }}
            >
              <img
                src="/icons/icon-more-white.gif"
                alt="Ver más"
                width={16}
                height={16}
                style={{
                  transition: 'all 0.3s ease',
                  objectFit: 'contain',
                }}
              />
            </button>

            {/* Consultar (WhatsApp) */}
            <a
              href={whatsappConsultLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={() => setHoveredButton('consult')}
              onMouseLeave={() => setHoveredButton(null)}
              className="flex items-center justify-center"
              aria-label="Consultar"
              title="Consultar"
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: '#f32735',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: hoveredButton === 'consult' ? 'scale(1.5)' : 'scale(1)',
              }}
            >
              <img
                src="/icons/icon-consult-white.gif"
                alt="Consultar"
                width={hoveredButton === 'consult' ? '20' : '12'}
                height={hoveredButton === 'consult' ? '20' : '12'}
                style={{
                  transition: 'all 0.3s ease',
                  objectFit: 'contain',
                }}
              />
            </a>

            {/* Agendar */}
            <a
              href={whatsappScheduleLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={() => setHoveredButton('schedule')}
              onMouseLeave={() => setHoveredButton(null)}
              className="flex items-center justify-center"
              aria-label="Agendar"
              title="Agendar"
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: '#f32735',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: hoveredButton === 'schedule' ? 'scale(1.5)' : 'scale(1)',
              }}
            >
              <img
                src="/icons/icon-schedule-white.gif"
                alt="Agendar"
                width={16}
                height={16}
                style={{
                  transition: 'all 0.3s ease',
                  objectFit: 'contain',
                }}
              />
            </a>

            {/* Favorito */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowLoginModal(true);
              }}
              onMouseEnter={() => setHoveredButton('favorite')}
              onMouseLeave={() => setHoveredButton(null)}
              className="flex items-center justify-center"
              aria-label="Favorito"
              title="Favorito"
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: '#f32735',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: hoveredButton === 'favorite' ? 'scale(1.5)' : 'scale(1)',
              }}
            >
              <img
                src="/icons/icon-favorite-white.gif"
                alt="Favorito"
                width={16}
                height={16}
                style={{
                  transition: 'all 0.3s ease',
                  objectFit: 'contain',
                }}
              />
            </button>
          </div>
        </div>

        {/* Content — Flex-grow solo en desktop/tablet */}
        <div className="flex-grow-0 sm:flex-grow flex flex-col justify-between p-1 sm:p-2">
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
                margin: '0 0 4px 0',
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
                marginBottom: '2px',
              }}
            >
              <p
                style={{
                  fontFamily: "'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: '12px',
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
                  fontWeight: 700,
                  fontSize: '12px',
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
          <div className="flex border-t-2 border-brand-red" style={{ gap: 0 }}>
            {/* Área */}
            <div
              className="flex-1 flex flex-row items-center justify-center border-r-2 border-brand-red"
              style={{ gap: '3px', padding: '3px 2px', whiteSpace: 'nowrap' }}
            >
              <img
                src="/icons/icon-area-gray.gif"
                alt="Área"
                width={17}
                height={17}
                style={{ objectFit: 'contain', flexShrink: 0 }}
              />
              <span style={{ fontSize: '16px', color: '#232222', fontWeight: 700 }}>
                {property.size}
              </span>
            </div>

            {/* Habitaciones */}
            <div
              className="flex-1 flex flex-row items-center justify-center border-r-2 border-brand-red"
              style={{ gap: '3px', padding: '3px 2px', whiteSpace: 'nowrap' }}
            >
              <img
                src="/icons/icon-bed-gray.gif"
                alt="Habitaciones"
                width={17}
                height={17}
                style={{ objectFit: 'contain', flexShrink: 0 }}
              />
              <span style={{ fontSize: '16px', color: '#232222', fontWeight: 700 }}>
                {property.bedrooms}
              </span>
            </div>

            {/* Baños */}
            <div
              className="flex-1 flex flex-row items-center justify-center border-r-2 border-brand-red"
              style={{ gap: '3px', padding: '3px 2px', whiteSpace: 'nowrap' }}
            >
              <img
                src="/icons/icon-bathroom-gray.gif"
                alt="Baños"
                width={17}
                height={17}
                style={{ objectFit: 'contain', flexShrink: 0 }}
              />
              <span style={{ fontSize: '16px', color: '#232222', fontWeight: 700 }}>
                {property.bathrooms}
              </span>
            </div>

            {/* Referencia */}
            <div
              className="flex-1 flex flex-row items-center justify-center"
              style={{ gap: '3px', padding: '3px 2px', whiteSpace: 'nowrap' }}
            >
              <img
                src="/icons/icon-code-Gray.gif"
                alt="Referencia"
                width={17}
                height={17}
                style={{ objectFit: 'contain', flexShrink: 0 }}
              />
              <span style={{ fontSize: '16px', color: '#232222', fontWeight: 700 }}>
                {property.reference.replace('Ref. ', '')}
              </span>
            </div>
          </div>

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
