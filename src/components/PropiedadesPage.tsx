'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import PropertyCard from './PropertyCard';
import InfiniteCarousel from './InfiniteCarousel';
import { properties } from '@/data/properties';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import PropiedadesSearchBar, { type PropSearchFilters } from './PropiedadesSearchBar';
import ScrollReveal from '@/components/ScrollReveal';
import PropiedadesLeafletMap from './PropiedadesLeafletMap';

const FONT_HEADING = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const FONT_BODY    = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED          = '#f32735';

function hasSecondaryFilters(filters: PropSearchFilters): boolean {
  return (
    !!filters.codigo ||
    !!filters.sector ||
    !!filters.tipoPropiedad ||
    filters.habitaciones !== null ||
    filters.banos !== null ||
    filters.parqueadero !== null ||
    !!filters.areaMin ||
    !!filters.areaMax ||
    filters.estrato.length > 0 ||
    filters.comodidades.length > 0
  );
}

function parsePrice(s: string): number {
  return parseInt(s.replace(/[^0-9]/g, '')) || 0;
}

function parseArea(s: string): number {
  return parseInt(s) || 0;
}

function applyFilters(filters: PropSearchFilters) {
  return properties.filter((p) => {
    if (filters.tipo !== 'Todos' && p.businessType && p.businessType !== filters.tipo) return false;

    if (filters.codigo) {
      const q = filters.codigo.toLowerCase();
      const matchRef = p.reference?.toLowerCase().includes(q);
      const matchId  = String(p.id).includes(q);
      if (!matchRef && !matchId) return false;
    }

    if (filters.tipoPropiedad && p.type.toLowerCase() !== filters.tipoPropiedad.toLowerCase()) return false;
    if (filters.sector && p.location.toLowerCase() !== filters.sector.toLowerCase()) return false;

    const price = parsePrice(p.price);
    if (price > 0 && (price < filters.precioMin || price > filters.precioMax)) return false;

    if (filters.habitaciones !== null) {
      if (filters.habitaciones >= 5) {
        if (p.bedrooms < 5) return false;
      } else {
        if (p.bedrooms !== filters.habitaciones) return false;
      }
    }

    if (filters.banos !== null) {
      if (filters.banos >= 4) {
        if (p.bathrooms < 4) return false;
      } else {
        if (p.bathrooms !== filters.banos) return false;
      }
    }

    if (filters.parqueadero === 'con') {
      if (!p.parking && !p.garage) return false;
    } else if (filters.parqueadero === 'sin') {
      if (p.parking || p.garage) return false;
    }

    const area = parseArea(p.size);
    if (filters.areaMin && area < parseInt(filters.areaMin)) return false;
    if (filters.areaMax && area > parseInt(filters.areaMax)) return false;

    if (filters.estrato.length > 0) {
      if (!p.stratum || !filters.estrato.includes(String(p.stratum))) return false;
    }

    if (filters.comodidades.length > 0) {
      for (const c of filters.comodidades) {
        if (c === 'Amoblado' && !p.furnished) return false;
        if (c === 'Piscina' && !p.pool) return false;
        if (['Balcón', 'Unidad Cerrada', 'Cuarto útil', 'Juegos infantiles', 'Ascensor'].includes(c)) {
          const found = p.characteristics?.some(ch =>
            ch.toLowerCase().includes(c.toLowerCase())
          );
          if (!found) return false;
        }
      }
    }

    return true;
  });
}

export default function PropiedadesPage({ initialFilter = 'Todos' }: { initialFilter?: 'Todos' | 'Arrendar' | 'Comprar' }) {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.propiedades-title-split', 0, false);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  const [showMap, setShowMap] = useState(false);
  const getDefaultPrecioMax = (tipo: string) =>
    tipo === 'Comprar' ? 500_000_000 : tipo === 'Arrendar' ? 15_000_000 : 500_000_000;

  const [appliedFilters, setAppliedFilters] = useState<PropSearchFilters>({
    tipo: initialFilter || 'Todos',
    codigo: '',
    sector: '',
    tipoPropiedad: '',
    precioMin: 0,
    precioMax: getDefaultPrecioMax(initialFilter || 'Todos'),
    habitaciones: null,
    banos: null,
    parqueadero: null,
    areaMin: '',
    areaMax: '',
    estrato: [],
    comodidades: [],
  });

  useEffect(() => {
    setAppliedFilters(prev => ({ ...prev, tipo: initialFilter || 'Todos' }));
  }, [initialFilter]);

  useEffect(() => {
    if (!titleAnimating || !subtitleRef.current) return;
    gsap.fromTo(subtitleRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, [titleAnimating]);

  const filtered = applyFilters(appliedFilters);

  useEffect(() => {
    const el = cardsGridRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.propiedades-card-item');
    gsap.killTweensOf(items);
    gsap.fromTo(items,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.03, ease: 'power2.out' }
    );
  }, [filtered.length, appliedFilters]);

  return (
    <div className="min-h-screen" style={{ background: '#f7f6f4' }}>
      {/* Page Header */}
      <div style={{ background: '#0d0d0d', marginTop: '-86px', paddingTop: 'calc(86px + clamp(32px, 5vw, 56px))', paddingBottom: 'clamp(24px, 3vw, 40px)' }}>
        <div ref={titleRef} style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 60px)' }}>
          <h1
            className="propiedades-title-split"
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 300,
              fontSize: 'clamp(26px, 3.4vw, 48px)',
              color: '#fff',
              lineHeight: 1.18,
              margin: '0 0 14px 0',
            }}
          >
            Ver{' '}
            <span style={{ fontWeight: 700, color: '#f32735' }}>propiedades</span>
          </h1>
          <p
            ref={subtitleRef}
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 300,
              fontSize: 'clamp(13px, 1.1vw, 16px)',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.55,
              margin: 0,
              maxWidth: '560px',
              opacity: 0,
            }}
          >
            Encuentra tu próximo hogar en Medellín y área metropolitana.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'sticky', top: '86px', zIndex: 40 }}>
        <PropiedadesSearchBar
          initialTipo={initialFilter || 'Todos'}
          onApply={setAppliedFilters}
          onShowMap={() => setShowMap(true)}
        />
      </div>

      {/* Map panel — full width, same as search bar, only desktop */}
      {showMap && (
        <div className="hidden lg:block" style={{ borderBottom: '1px solid #e8e8e8' }}>
          <PropiedadesLeafletMap properties={filtered} />
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px clamp(16px, 3vw, 52px)' }}>

        {/* Toolbar */}
        <div
          className="flex items-center justify-between"
          style={{ padding: showMap ? '20px clamp(16px, 2vw, 36px)' : '0 0 20px 0' }}
        >
          <p style={{ fontFamily: FONT_BODY, fontSize: '13px', color: '#999', margin: 0 }}>
            {filtered.length} {filtered.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
          </p>

          <button
            type="button"
            onClick={() => setShowMap(v => !v)}
            className="hidden lg:flex items-center gap-2"
            style={{
              fontFamily: FONT_BODY, fontSize: '13px', fontWeight: 500,
              color: showMap ? '#fff' : '#444',
              background: showMap ? RED : '#fff',
              border: `1px solid ${showMap ? RED : '#ddd'}`,
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
              <line x1="9" y1="3" x2="9" y2="18"/>
              <line x1="15" y1="6" x2="15" y2="21"/>
            </svg>
            {showMap ? 'Ocultar mapa' : 'Ver mapa'}
          </button>
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden mb-8" style={{ padding: '0 clamp(16px, 3vw, 48px)' }}>
          <InfiniteCarousel properties={filtered} />
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:flex flex-col">
          <div ref={cardsGridRef} className="grid grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((property) => (
              <div key={property.id} className="propiedades-card-item">
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p style={{ fontFamily: FONT_BODY, fontSize: '16px', color: '#999', marginBottom: '16px' }}>
              {hasSecondaryFilters(appliedFilters)
                ? 'No se encontraron propiedades con los filtros seleccionados.'
                : `No hay propiedades disponibles para ${appliedFilters.tipo === 'Todos' ? 'mostrar' : appliedFilters.tipo.toLowerCase()} en este momento.`}
            </p>
            {hasSecondaryFilters(appliedFilters) && (
              <button
                type="button"
                onClick={() => setAppliedFilters(prev => ({
                  tipo: prev.tipo,
                  sector: '',
                  precioMin: 0,
                  precioMax: getDefaultPrecioMax(prev.tipo),
                  habitaciones: null,
                  banos: null,
                  parqueadero: null,
                  areaMin: '',
                  areaMax: '',
                  estrato: [],
                  comodidades: [],
                  codigo: '',
                  tipoPropiedad: '',
                }))}
                style={{
                  fontFamily: FONT_BODY, fontSize: '13px', fontWeight: 600,
                  color: '#fff', background: '#f32735', border: 'none',
                  cursor: 'pointer', padding: '11px 24px', borderRadius: '2px',
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Cross-linking CTAs */}
        <div className={`mt-16 grid gap-6 ${appliedFilters.tipo === 'Todos' ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
          {(appliedFilters.tipo === 'Todos' || appliedFilters.tipo === 'Arrendar') && (
            <ScrollReveal y={20}>
              <div style={{ background: '#1a1a1a', borderRadius: 0, padding: '24px 28px' }}>
                <h3 style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: '20px', color: '#fff', marginBottom: '6px', lineHeight: 1.2 }}>
                  ¿Tienes un inmueble para arrendar o vender?
                </h3>
                <p style={{ fontFamily: FONT_BODY, fontSize: '14px', color: 'rgba(255,255,255,0.55)', marginBottom: '16px', lineHeight: 1.4 }}>
                  Consigna tu propiedad con nosotros y accede a nuestra red de clientes.
                </p>
                <button
                  type="button"
                  onClick={() => window.location.href = '/consignacion'}
                  style={{
                    fontFamily: FONT_BODY, fontSize: '13px', fontWeight: 600,
                    color: '#fff', background: RED, border: 'none',
                    cursor: 'pointer', padding: '11px 28px', borderRadius: 0,
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#aa182c')}
                  onMouseLeave={e => (e.currentTarget.style.background = RED)}
                >
                  Consigna tu propiedad
                </button>
              </div>
            </ScrollReveal>
          )}

          {(appliedFilters.tipo === 'Todos' || appliedFilters.tipo === 'Comprar') && (
            <ScrollReveal y={20} delay={appliedFilters.tipo === 'Todos' ? 0.1 : 0}>
              <div style={{ background: '#1a1a1a', borderRadius: 0, padding: '24px 28px' }}>
                <h3 style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: '20px', color: '#fff', marginBottom: '6px', lineHeight: 1.2 }}>
                  ¿Buscas oportunidades de inversión?
                </h3>
                <p style={{ fontFamily: FONT_BODY, fontSize: '14px', color: 'rgba(255,255,255,0.55)', marginBottom: '16px', lineHeight: 1.4 }}>
                  Descubre nuestras propiedades con mayor potencial de retorno en Antioquia.
                </p>
                <button
                  type="button"
                  onClick={() => window.location.href = '/inversionistas'}
                  style={{
                    fontFamily: FONT_BODY, fontSize: '13px', fontWeight: 600,
                    color: '#fff', background: RED, border: 'none',
                    cursor: 'pointer', padding: '11px 28px', borderRadius: 0,
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#aa182c')}
                  onMouseLeave={e => (e.currentTarget.style.background = RED)}
                >
                  Ver oportunidades de inversión
                </button>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </div>
  );
}