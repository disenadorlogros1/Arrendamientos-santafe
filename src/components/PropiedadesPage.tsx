'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

/* ── Botón flotante del mapa (círculo → expande texto a la izquierda) ── */
function MapFloatButton({
  children, label, onClick, accent = false,
}: { children: React.ReactNode; label: string; onClick: () => void; accent?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const bg = accent ? 'rgba(243,39,53,0.85)' : 'rgba(0,0,0,0.45)';
  const bgHov = accent ? '#f32735' : 'rgba(0,0,0,0.65)';
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', flexDirection: 'row',
        height: '44px',
        padding: hovered ? '0 14px 0 12px' : '0',
        width: hovered ? 'auto' : '44px',
        borderRadius: '22px',
        background: hovered ? bgHov : bg,
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(255,255,255,0.22)',
        color: '#fff',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1), padding 0.25s cubic-bezier(0.4,0,0.2,1), background 0.15s ease',
        gap: hovered ? '6px' : '0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        whiteSpace: 'nowrap',
        justifyContent: 'center',
      }}
    >
      {/* Texto — aparece a la izquierda del icono */}
      <span style={{
        fontSize: '11px', fontFamily: FONT_BODY, fontWeight: 500, letterSpacing: '0.02em',
        maxWidth: hovered ? '120px' : '0',
        overflow: 'hidden',
        transition: 'max-width 0.25s cubic-bezier(0.4,0,0.2,1)',
        display: 'block',
      }}>
        {label}
      </span>
      {/* Icono — siempre visible */}
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: '20px' }}>
        {children}
      </span>
    </button>
  );
}

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
  const leftPanelRef = useRef<HTMLDivElement>(null);

  const [showMap, setShowMap] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [visibleInMap, setVisibleInMap] = useState<import('@/data/properties').Property[]>([]);
  const [hoveredMapProperty, setHoveredMapProperty] = useState<import('@/data/properties').Property | null>(null);
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

  // Crossfade del panel izquierdo cuando cambia la propiedad hovereada
  useEffect(() => {
    const el = leftPanelRef.current;
    if (!el) return;
    el.style.transition = 'opacity 0.1s ease';
    el.style.opacity = '0';
    const t = setTimeout(() => { if (leftPanelRef.current) leftPanelRef.current.style.opacity = '1'; }, 100);
    return () => clearTimeout(t);
  }, [hoveredMapProperty?.id]);

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

      {/* Map panel — solo desktop */}
      {showMap && (
        <>
        <div className="hidden lg:block" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(16px, 3vw, 52px)' }}>

            {/* ── Modo normal: cards izquierda + mapa derecha ── */}
            {!mapExpanded && (() => {
              const baseCards = (visibleInMap.length > 0 ? visibleInMap : filtered).slice(0, 2);
              const hoveredInLeft = hoveredMapProperty ? baseCards.some(p => p.id === hoveredMapProperty.id) : false;
              const cardsToShow = hoveredMapProperty && !hoveredInLeft
                ? (baseCards.length >= 2 ? [baseCards[0], hoveredMapProperty] : [hoveredMapProperty, ...baseCards].slice(0, 2))
                : baseCards;
              return (
              <div style={{ display: 'flex', height: '420px', gap: '15px' }}>
                {/* Izquierda: cards flotando sobre el fondo */}
                <div ref={leftPanelRef} style={{ flex: 1, position: 'relative' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                    height: '100%',
                  }}>
                    {cardsToShow.map(property => {
                      const isHovered = hoveredMapProperty?.id === property.id;
                      return (
                        <div
                          key={property.id}
                          onClick={() => { window.location.href = `/propiedad/${property.id}`; }}
                          style={{
                            cursor: 'pointer',
                            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                            transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                            transformOrigin: 'center',
                            position: 'relative',
                            zIndex: isHovered ? 50 : 1,
                            overflow: 'hidden',
                            borderRadius: '8px',
                          }}
                        >
                          <PropertyCard property={property} />
                        </div>
                      );
                    })}
                    {filtered.length === 0 && (
                      <div style={{
                        gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: FONT_BODY, fontSize: '13px', color: '#aaa',
                      }}>
                        Sin propiedades
                      </div>
                    )}
                  </div>
                </div>

                {/* Derecha: Mapa con botones flotantes — zIndex:0 contiene los z-indices internos de Leaflet */}
                <div
                  onMouseLeave={() => setHoveredMapProperty(null)}
                  style={{ flex: 1, position: 'relative', overflow: 'hidden', zIndex: 0, boxShadow: '0 10px 48px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.10)' }}
                >
                  <PropiedadesLeafletMap
                    properties={filtered}
                    onBoundsChange={setVisibleInMap}
                    onHoverProperty={setHoveredMapProperty}
                    onClickProperty={p => { window.location.href = `/propiedad/${p.id}`; }}
                  />
                  <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 1000, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapFloatButton label="Ampliar mapa" onClick={() => setMapExpanded(true)}>
                      <span style={{ fontSize: '18px', lineHeight: 1, fontWeight: 300 }}>+</span>
                    </MapFloatButton>
                    <MapFloatButton label="Cerrar mapa" onClick={() => { setShowMap(false); setMapExpanded(false); }} accent>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </MapFloatButton>
                  </div>
                </div>
              </div>
              );
            })()}

            {/* ── Modo expandido: mapa full width + carrusel flotante inferior ── */}
            {mapExpanded && (() => {
              const mapProps = (visibleInMap.length > 0 ? visibleInMap : filtered).slice(0, 4);
              return (
                <div style={{ boxShadow: '0 10px 48px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.10)', overflow: 'hidden', position: 'relative', height: '520px' }}>
                  {/* Mapa — ocupa todo el contenedor */}
                  <PropiedadesLeafletMap
                    properties={filtered}
                    onBoundsChange={setVisibleInMap}
                  />

                  {/* Botones flotantes — superior derecha */}
                  <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 1000, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapFloatButton label="Reducir mapa" onClick={() => setMapExpanded(false)}>
                      <span style={{ fontSize: '16px', lineHeight: 1, fontWeight: 300 }}>−</span>
                    </MapFloatButton>
                    <MapFloatButton label="Cerrar mapa" onClick={() => { setShowMap(false); setMapExpanded(false); }} accent>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </MapFloatButton>
                  </div>

                  {/* Carrusel flotante — inferior, máx 4 cards, idéntico al modo pequeño */}
                  {mapProps.length > 0 && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      zIndex: 500,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)',
                      padding: '32px 16px 14px',
                    }}>
                      <p style={{ fontFamily: FONT_BODY, fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                        {(visibleInMap.length > 0 ? visibleInMap : filtered).length} propiedades en esta zona
                      </p>
                      <div className="red-scrollbar" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                        {mapProps.map(property => (
                          <div key={property.id} style={{ width: '200px', minWidth: '200px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden', cursor: 'pointer' }}
                            onClick={() => { window.location.href = `/propiedad/${property.id}`; }}>
                            <PropertyCard property={property} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

          </div>
        </div>

        {/* CTAs — visibles directamente bajo el mapa, sin animación */}
        <div className="hidden lg:grid" style={{
          maxWidth: '1400px', margin: '0 auto',
          padding: '0 clamp(16px, 3vw, 52px)',
          gridTemplateColumns: appliedFilters.tipo === 'Todos' ? '1fr 1fr' : '1fr',
          gap: '15px',
          marginTop: '15px',
          paddingBottom: '20px',
        }}>
          {(appliedFilters.tipo === 'Todos' || appliedFilters.tipo === 'Arrendar') && (
            <div style={{ background: '#1a1a1a', padding: '24px 28px' }}>
              <h3 style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: '20px', color: '#fff', marginBottom: '6px', lineHeight: 1.2 }}>
                ¿Tienes un inmueble para arrendar o vender?
              </h3>
              <p style={{ fontFamily: FONT_BODY, fontSize: '14px', color: 'rgba(255,255,255,0.55)', marginBottom: '16px', lineHeight: 1.4 }}>
                Consigna tu propiedad con nosotros y accede a nuestra red de clientes.
              </p>
              <button type="button" onClick={() => window.location.href = '/consignacion'}
                style={{ fontFamily: FONT_BODY, fontSize: '13px', fontWeight: 600, color: '#fff', background: RED, border: 'none', cursor: 'pointer', padding: '11px 28px', transition: 'background 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#aa182c')}
                onMouseLeave={e => (e.currentTarget.style.background = RED)}>
                Consigna tu propiedad
              </button>
            </div>
          )}
          {(appliedFilters.tipo === 'Todos' || appliedFilters.tipo === 'Comprar') && (
            <div style={{ background: '#1a1a1a', padding: '24px 28px' }}>
              <h3 style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: '20px', color: '#fff', marginBottom: '6px', lineHeight: 1.2 }}>
                ¿Buscas oportunidades de inversión?
              </h3>
              <p style={{ fontFamily: FONT_BODY, fontSize: '14px', color: 'rgba(255,255,255,0.55)', marginBottom: '16px', lineHeight: 1.4 }}>
                Descubre nuestras propiedades con mayor potencial de retorno en Antioquia.
              </p>
              <button type="button" onClick={() => window.location.href = '/inversionistas'}
                style={{ fontFamily: FONT_BODY, fontSize: '13px', fontWeight: 600, color: '#fff', background: RED, border: 'none', cursor: 'pointer', padding: '11px 28px', transition: 'background 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#aa182c')}
                onMouseLeave={e => (e.currentTarget.style.background = RED)}>
                Ver oportunidades de inversión
              </button>
            </div>
          )}
        </div>
        </>
      )}

      {/* Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: showMap ? '0 clamp(16px, 3vw, 52px)' : '16px clamp(16px, 3vw, 52px)' }}>

        {/* Toolbar — oculto en desktop cuando el mapa está abierto */}
        {!showMap && (
          <div className="flex items-center" style={{ paddingBottom: '20px' }}>
            <p style={{ fontFamily: FONT_BODY, fontSize: '13px', color: '#999', margin: 0 }}>
              {filtered.length} {filtered.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
            </p>
          </div>
        )}
        {showMap && (
          <div className="lg:hidden flex items-center" style={{ padding: '16px 0 8px' }}>
            <p style={{ fontFamily: FONT_BODY, fontSize: '13px', color: '#999', margin: 0 }}>
              {filtered.length} {filtered.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
            </p>
          </div>
        )}

        {/* Mobile Carousel */}
        <div className="lg:hidden mb-8" style={{ padding: '0 clamp(16px, 3vw, 48px)' }}>
          <InfiniteCarousel properties={filtered} />
        </div>

        {/* Desktop layout — se oculta mientras el mapa está abierto */}
        {!showMap && (
          <div className="hidden lg:flex flex-col">
            <div ref={cardsGridRef} className="grid grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((property) => (
                <div key={property.id} className="propiedades-card-item">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          </div>
        )}

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

        {/* Cross-linking CTAs — ocultos en desktop cuando el mapa está abierto (aparecen arriba) */}
        <div className={`mt-6 grid gap-6 ${showMap ? 'lg:hidden' : ''} ${appliedFilters.tipo === 'Todos' ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
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