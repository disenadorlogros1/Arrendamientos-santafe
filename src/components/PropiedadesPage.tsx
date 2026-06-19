'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import PropertyCard from './PropertyCard';
import InfiniteCarousel from './InfiniteCarousel';
import { properties } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import PropiedadesSearchBar, { type PropSearchFilters } from './PropiedadesSearchBar';
import ScrollReveal from '@/components/ScrollReveal';

const FONT_HEADING = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const FONT_BODY    = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED          = '#f32735';

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
  const [appliedFilters, setAppliedFilters] = useState<PropSearchFilters>({
    tipo: initialFilter || 'Todos',
    codigo: '',
    sector: '',
    tipoPropiedad: '',
    precioMin: 0,
    precioMax: 15_000_000,
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
    gsap.from(items, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      stagger: 0.03,
      ease: 'power2.out',
    });
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
      <div style={{ position: 'sticky', top: '86px', zIndex: 40, background: 'rgba(247,246,244,0.92)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
        <PropiedadesSearchBar
          initialTipo={initialFilter || 'Todos'}
          onApply={setAppliedFilters}
        />
      </div>

      {/* Content */}
      <div style={{ maxWidth: showMap ? '100%' : '1400px', margin: '0 auto', padding: showMap ? '0' : '32px clamp(16px, 3vw, 48px)', transition: 'all 0.4s ease' }}>

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
        <div className={`hidden lg:flex ${showMap ? 'flex-row items-start' : 'flex-col'}`}>

          <div
            style={{
              flex: showMap ? '0 0 55%' : '1',
              maxHeight: showMap ? 'calc(100vh - 180px)' : 'none',
              overflowY: showMap ? 'auto' : 'visible',
              padding: showMap ? '0 clamp(16px, 2vw, 36px) 32px' : '0',
              scrollbarWidth: 'thin',
              scrollbarColor: '#ddd transparent',
            }}
          >
            <div
              ref={cardsGridRef}
              className={showMap ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-3 xl:grid-cols-4 gap-5'}
            >
              {filtered.map((property) => (
                <div key={property.id} className="propiedades-card-item">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          </div>

          {showMap && (
            <div
              style={{
                flex: '0 0 45%',
                position: 'sticky',
                top: '180px',
                height: 'calc(100vh - 180px)',
                borderLeft: '1px solid #e8e8e8',
                overflow: 'hidden',
              }}
            >
              <iframe
                title="Mapa de propiedades"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-75.6700%2C6.1500%2C-75.4800%2C6.3400&layer=mapnik"
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                loading="lazy"
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '11px',
                  fontFamily: FONT_BODY,
                  color: '#666',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                }}
              >
                Medellín y Área Metropolitana
              </div>
            </div>
          )}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p style={{ fontFamily: FONT_BODY, fontSize: '16px', color: '#999', marginBottom: '16px' }}>
              No se encontraron propiedades con los filtros seleccionados.
            </p>
            <button
              type="button"
              onClick={() => setAppliedFilters(prev => ({
                tipo: prev.tipo,
                sector: '',
                precioMin: 0,
                precioMax: prev.tipo === 'Comprar' ? 500_000_000 : 15_000_000,
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
          </div>
        )}

        {/* Cross-linking CTAs */}
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <ScrollReveal y={20}>
            <div
              style={{
                background: 'rgba(243,39,53,0.04)',
                border: '1px solid rgba(243,39,53,0.15)',
                borderRadius: '8px',
                padding: '32px',
              }}
            >
              <h3 style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: '20px', color: '#1a1a1a', marginBottom: '10px' }}>
                ¿Tienes un inmueble para arrendar o vender?
              </h3>
              <p style={{ fontFamily: FONT_BODY, fontSize: '14px', color: '#666', marginBottom: '20px', lineHeight: 1.55 }}>
                Consigna tu propiedad con nosotros y accede a nuestra red de clientes.
              </p>
              <Button
                onClick={() => window.location.href = '/consignacion'}
                className="bg-brand-red hover:bg-brand-red-hover text-white rounded-full"
              >
                Consigna tu propiedad
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal y={20} delay={0.1}>
            <div
              style={{
                background: 'rgb(239,246,255)',
                border: '1px solid rgb(191,219,254)',
                borderRadius: '8px',
                padding: '32px',
              }}
            >
              <h3 style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: '20px', color: '#1a1a1a', marginBottom: '10px' }}>
                ¿Buscas oportunidades de inversión?
              </h3>
              <p style={{ fontFamily: FONT_BODY, fontSize: '14px', color: '#666', marginBottom: '20px', lineHeight: 1.55 }}>
                Descubre nuestras propiedades con mayor potencial de retorno en Antioquia.
              </p>
              <Button
                onClick={() => window.location.href = '/inversionistas'}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              >
                Ver oportunidades de inversión
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}