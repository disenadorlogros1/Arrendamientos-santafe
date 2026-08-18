'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import PropertyCard from './PropertyCard';
import { properties } from '@/data/properties';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import PropiedadesSearchBar, { type PropSearchFilters } from './PropiedadesSearchBar';
import ScrollReveal from '@/components/ScrollReveal';
import PropiedadesLeafletMap from './PropiedadesLeafletMap';

const FONT_HEADING = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const FONT_BODY    = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED          = '#f32735';

const DESKTOP_PAGE_SIZE = 12;
const MOBILE_LOAD_SIZE  = 6;



function applyInkFill(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const size = Math.max(Math.hypot(x,y),Math.hypot(rect.width-x,y),Math.hypot(x,rect.height-y),Math.hypot(rect.width-x,rect.height-y)) * 2;
  el.style.setProperty('--x', `${x}px`);
  el.style.setProperty('--y', `${y}px`);
  el.style.setProperty('--size', `${size}px`);
}

/* ── Carrusel de mapa ampliado ──────────────────────────────────────── */
function MapCarousel({
  properties, hoveredId, onHover, onCardClick,
}: {
  properties: import('@/data/properties').Property[];
  hoveredId: number | null;
  onHover: (p: import('@/data/properties').Property | null) => void;
  onCardClick: (p: import('@/data/properties').Property) => void;
}) {
  const [startIdx, setStartIdx] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1280);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);
  const isAnimating  = useRef(false);

  const GAP_RATIO = 0.15;
  const VISIBLE   = windowWidth < 1024 ? 3 : windowWidth < 1536 ? 4 : 5;
  const CARD_W    = containerWidth > 0
    ? Math.floor(containerWidth / (VISIBLE + (VISIBLE - 1) * GAP_RATIO))
    : 0;
  const GAP       = CARD_W > 0 ? Math.round(CARD_W * GAP_RATIO) : 12;
  const CARD_H    = Math.round(CARD_W * 16 / 9);
  const SLOT      = CARD_W + GAP;
  const INFO_H    = 90;
  const arrowTopPx = CARD_H > 0 ? Math.round((CARD_H - INFO_H) / 2) : 0;

  const canGoBack    = startIdx > 0;
  const canGoForward = startIdx + VISIBLE < properties.length;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => { const w = el.getBoundingClientRect().width; if (w > 0) setContainerWidth(w); };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const check = () => setWindowWidth(window.innerWidth);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    setStartIdx(0);
    if (trackRef.current) gsap.set(trackRef.current, { x: 0 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.length]);

  const visibleCards = Array.from(
    { length: Math.min(VISIBLE + 1, properties.length - startIdx) },
    (_, i) => ({ ...properties[startIdx + i], _slot: i })
  );

  const navigate = useCallback((forward: boolean) => {
    if (isAnimating.current || !trackRef.current || !containerRef.current) return;
    if (CARD_W === 0) return;
    if (forward && !canGoForward) return;
    if (!forward && !canGoBack) return;
    isAnimating.current = true;

    const slots = containerRef.current.querySelectorAll<HTMLElement>('[data-mc-slot]');

    if (forward) {
      const exiting  = slots[0];
      const entering = slots[slots.length - 1];
      if (entering) gsap.set(entering, { scale: 0.75, opacity: 0 });
      gsap.timeline({
        onComplete: () => {
          flushSync(() => setStartIdx(p => p + 1));
          gsap.set(trackRef.current, { x: 0 });
          isAnimating.current = false;
        },
      })
        .to(trackRef.current, { x: -SLOT,  duration: 0.9,  ease: 'power4.out'  }, 0)
        .to(exiting,          { scale: 0.75, opacity: 0, duration: 0.42, ease: 'power2.in'  }, 0)
        .to(entering,         { scale: 1,    opacity: 1, duration: 0.66, ease: 'power3.out' }, 0.2);
    } else {
      flushSync(() => setStartIdx(p => p - 1));
      const slots2   = containerRef.current.querySelectorAll<HTMLElement>('[data-mc-slot]');
      const entering = slots2[0];
      const exiting  = slots2[slots2.length - 1];
      gsap.set(trackRef.current, { x: -SLOT });
      if (entering) gsap.set(entering, { scale: 0.75, opacity: 0 });
      gsap.timeline({
        onComplete: () => { isAnimating.current = false; },
      })
        .to(trackRef.current, { x: 0,    duration: 0.9,  ease: 'power4.out'  }, 0)
        .to(exiting,          { scale: 0.75, opacity: 0, duration: 0.42, ease: 'power2.in'  }, 0)
        .to(entering,         { scale: 1,    opacity: 1, duration: 0.66, ease: 'power3.out' }, 0.2);
    }
  }, [CARD_W, SLOT, canGoForward, canGoBack]);

  const trackW = CARD_W > 0 ? visibleCards.length * CARD_W + (visibleCards.length - 1) * GAP : 0;
  const NAV_OFF = 8;

  return (
    <div style={{ position: 'relative', width: '100%', marginTop: '12px' }}>
      <div ref={containerRef} style={{ overflow: 'hidden', width: '100%', paddingTop: '12px', marginTop: '-12px', paddingBottom: '12px', marginBottom: '-12px' }}>
        {CARD_W > 0 && visibleCards.length > 0 && (
          <div ref={trackRef} style={{ display: 'flex', gap: `${GAP}px`, width: `${trackW}px`, willChange: 'transform' }}>
            {visibleCards.map(property => {
              const isHov = hoveredId === property.id;
              return (
                <div
                  key={property.id}
                  data-mc-slot={property._slot}
                  onClick={() => onCardClick(property)}
                  onMouseEnter={() => onHover(property)}
                  onMouseLeave={() => onHover(null)}
                  style={{
                    width: `${CARD_W}px`, minWidth: `${CARD_W}px`,
                    height: `${CARD_H}px`, flexShrink: 0,
                    willChange: 'transform, opacity',
                    transform: isHov ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                    borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
                  }}
                >
                  <PropertyCard property={property} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Flechas — solo si hay más propiedades de las que caben */}
      {arrowTopPx > 0 && (canGoBack || canGoForward) && (
        <>
          {canGoBack && (
            <button type="button" onClick={() => navigate(false)}
              onMouseEnter={applyInkFill} onMouseLeave={applyInkFill}
              className="carousel-nav-btn rounded-full flex items-center justify-center"
              style={{ position: 'absolute', left: `${NAV_OFF}px`, top: `${arrowTopPx + 12}px`, transform: 'translateY(-50%)', width: '40px', height: '40px', zIndex: 10 }}
              aria-label="Anterior"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
          )}
          {canGoForward && (
            <button type="button" onClick={() => navigate(true)}
              onMouseEnter={applyInkFill} onMouseLeave={applyInkFill}
              className="carousel-nav-btn rounded-full flex items-center justify-center"
              style={{ position: 'absolute', right: `${NAV_OFF}px`, top: `${arrowTopPx + 12}px`, transform: 'translateY(-50%)', width: '40px', height: '40px', zIndex: 10 }}
              aria-label="Siguiente"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          )}
        </>
      )}
    </div>
  );
}

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
    !!filters.textoBusqueda ||
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

    if (filters.textoBusqueda) {
      const q = filters.textoBusqueda.toLowerCase();
      const haystack = [
        p.title, p.location, p.address, p.type, p.description, p.reference,
        ...(p.characteristics ?? []),
      ].filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }

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

export default function PropiedadesPage({ initialFilter = 'Todos', initialQueString = '' }: { initialFilter?: 'Todos' | 'Arrendar' | 'Comprar'; initialQueString?: string }) {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.propiedades-title-split', 0, false);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);

  const [showMap, setShowMap] = useState(false);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [visibleInMap, setVisibleInMap] = useState<import('@/data/properties').Property[]>([]);
  const [hoveredMapProperty, setHoveredMapProperty] = useState<import('@/data/properties').Property | null>(null);
  const [selectedPinProperty, setSelectedPinProperty] = useState<{ property: import('@/data/properties').Property; x: number; y: number } | null>(null);
  const mobileMapRef = useRef<HTMLDivElement>(null);

  // Animación de entrada por slot — alterna qué card se reemplaza
  const [replacedSlot, setReplacedSlot] = useState<0 | 1>(1);
  const nextSlot      = useRef<0 | 1>(0);
  const prevHovId     = useRef<number | null>(null);
  const animSlot      = useRef<0 | 1>(0);
  const shouldAnimate = useRef(false);
  const cardSlotRefs  = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  const getDefaultPrecioMax = (tipo: string) =>
    tipo === 'Comprar' ? 500_000_000 : tipo === 'Arrendar' ? 15_000_000 : 500_000_000;

  const [appliedFilters, setAppliedFilters] = useState<PropSearchFilters>({
    tipo: initialFilter || 'Todos',
    textoBusqueda: initialQueString,
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

  const filtered = useMemo(() => applyFilters(appliedFilters), [appliedFilters]);

  const [desktopPage,    setDesktopPage]    = useState(1);
  const [mobileVisible,  setMobileVisible]  = useState(MOBILE_LOAD_SIZE);

  useEffect(() => {
    setDesktopPage(1);
    setMobileVisible(MOBILE_LOAD_SIZE);
  }, [appliedFilters]);

  const totalDesktopPages = Math.ceil(filtered.length / DESKTOP_PAGE_SIZE);
  const desktopPaged = useMemo(
    () => filtered.slice((desktopPage - 1) * DESKTOP_PAGE_SIZE, desktopPage * DESKTOP_PAGE_SIZE),
    [filtered, desktopPage],
  );
  const mobilePaged = filtered.slice(0, mobileVisible);

  // Efecto 1: detecta nueva propiedad hovereada → decide qué slot reemplazar (alterna)
  useEffect(() => {
    if (!hoveredMapProperty) { prevHovId.current = null; return; }
    if (hoveredMapProperty.id === prevHovId.current) return;
    const base = (visibleInMap.length > 0 ? visibleInMap : filtered).slice(0, 2);
    if (base.some(p => p.id === hoveredMapProperty.id)) return;
    prevHovId.current = hoveredMapProperty.id;
    const slot = nextSlot.current;
    nextSlot.current = slot === 0 ? 1 : 0;
    animSlot.current = slot;
    shouldAnimate.current = true;
    setReplacedSlot(slot);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredMapProperty]);

  // Efecto 2: tras commit del slot en el DOM, lanza animación GSAP en esa card
  useEffect(() => {
    if (!shouldAnimate.current) return;
    shouldAnimate.current = false;
    const el = cardSlotRefs[animSlot.current].current;
    if (el) {
      gsap.fromTo(el,
        { scale: 0.75, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.66, ease: 'power3.out' }
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replacedSlot]);

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
    <>
    <div className="min-h-screen" style={{ background: '#f7f6f4' }}>
      {/* Page Header */}
      <div style={{ background: '#1a1a1a', marginTop: '-86px', paddingTop: 'calc(86px + clamp(32px, 5vw, 56px))', paddingBottom: 'clamp(24px, 3vw, 40px)' }}>
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
            <span style={{ fontWeight: 700, color: '#fff' }}>propiedades</span>
          </h1>
          <p
            ref={subtitleRef}
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 300,
              fontSize: 'clamp(13px, 1.1vw, 16px)',
              color: '#fff',
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
      <div style={{ backgroundColor: '#f7f6f4' }}>
        <PropiedadesSearchBar
          initialTipo={initialFilter || 'Todos'}
          initialTextoBusqueda={initialQueString}
          onApply={setAppliedFilters}
          onShowMap={() => {
            if (typeof window !== 'undefined' && window.innerWidth < 1024) {
              setShowMobileMap(true);
            } else {
              setShowMap(true);
            }
          }}
          onShowList={() => setShowMobileMap(false)}
          mapActive={showMobileMap}
          collapsed={showMap}
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
              const hoveredInBase = hoveredMapProperty ? baseCards.some(p => p.id === hoveredMapProperty.id) : false;
              const slotCards: Array<import('@/data/properties').Property | undefined> = [baseCards[0], baseCards[1]];
              if (hoveredMapProperty && !hoveredInBase) slotCards[replacedSlot] = hoveredMapProperty;
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
                    {slotCards.map((property, slotIdx) => {
                      if (!property) return null;
                      const isHovered = hoveredMapProperty?.id === property.id;
                      return (
                        <div
                          key={slotIdx}
                          ref={cardSlotRefs[slotIdx]}
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
                        fontFamily: FONT_BODY, fontSize: '13px', color: '#ccc',
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

            {/* ── Modo expandido: mapa full width + carrusel debajo ── */}
            {mapExpanded && (() => {
              const mapProps = visibleInMap.length > 0 ? visibleInMap : filtered;
              return (
                <>
                  {/* Mapa full width */}
                  <div
                    onMouseLeave={() => setHoveredMapProperty(null)}
                    style={{ boxShadow: '0 10px 48px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.10)', overflow: 'hidden', position: 'relative', height: '520px', zIndex: 0 }}
                  >
                    <PropiedadesLeafletMap
                      properties={filtered}
                      onBoundsChange={setVisibleInMap}
                      onHoverProperty={setHoveredMapProperty}
                      onClickProperty={p => { window.location.href = `/propiedad/${p.id}`; }}
                    />
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
                  </div>

                  {/* Carrusel debajo del mapa */}
                  {mapProps.length > 0 && (
                    <MapCarousel
                      properties={mapProps}
                      hoveredId={hoveredMapProperty?.id ?? null}
                      onHover={setHoveredMapProperty}
                      onCardClick={p => { window.location.href = `/propiedad/${p.id}`; }}
                    />
                  )}
                </>
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
          <div className="flex items-center justify-center lg:justify-start" style={{ padding: '4px 0 20px' }}>
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

        {/* Mobile: Carousel ↔ Mapa */}
        <div className="lg:hidden mb-8">
          {showMobileMap ? (
            <>
              {/* Mapa — isolation contiene z-indices internos de Leaflet */}
              <div ref={mobileMapRef} style={{ height: '62dvh', position: 'relative', overflow: 'hidden', isolation: 'isolate' } as React.CSSProperties}>
                <PropiedadesLeafletMap
                  properties={filtered}
                  onBoundsChange={setVisibleInMap}
                  onHoverProperty={setHoveredMapProperty}
                  onClickProperty={(p, pos) => setSelectedPinProperty({ property: p, x: pos.x, y: pos.y })}
                />
                {/* Chip flotante junto al pin seleccionado */}
                {selectedPinProperty && (() => {
                  const CARD_W = 200;
                  const CARD_H = 220; // foto 140 + info ~80
                  const PAD = 10;
                  const mapW = mobileMapRef.current?.offsetWidth ?? 375;
                  const mapH = mobileMapRef.current?.offsetHeight ?? 400;
                  const { x: pinX, y: pinY } = selectedPinProperty;

                  // Horizontal: derecha del pin; si se sale, a la izquierda
                  let left = pinX + 22;
                  if (left + CARD_W > mapW - PAD) left = pinX - CARD_W - 22;
                  left = Math.max(PAD, Math.min(left, mapW - CARD_W - PAD));

                  // Vertical: arriba del pin; si no cabe, debajo
                  let top = pinY - 50 - CARD_H - 8;
                  if (top < PAD) top = pinY + 8;
                  top = Math.min(top, mapH - CARD_H - PAD);

                  const prop = selectedPinProperty.property;
                  return (
                    <div
                      style={{ position: 'absolute', left, top, width: CARD_W, zIndex: 1000, borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.28)', cursor: 'pointer', background: '#fff' }}
                      onClick={() => { window.location.href = `/propiedad/${prop.id}`; }}
                    >
                      {/* Foto */}
                      <div style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
                        <img src={prop.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 70%', display: 'block' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.22) 100%)', pointerEvents: 'none' }} />
                        {/* Botón rojo — igual al de PropertyCard */}
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); window.location.href = `/propiedad/${prop.id}`; }}
                          style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: '50%', background: '#f32735', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5M11.5 2.5V9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        {/* × cerrar */}
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); setSelectedPinProperty(null); }}
                          style={{ position: 'absolute', top: 8, left: 8, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.45)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                      {/* Info — idéntico a PropertyCard */}
                      <div style={{ padding: '10px 12px 12px', background: '#fff' }}>
                        <p style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 15, color: '#1a1a1a', margin: '0 0 4px', lineHeight: 1.15, letterSpacing: '-0.3px' }}>
                          {prop.price}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
                          <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: '#888', fontWeight: 500 }}>
                            {prop.location.split(',')[0]}
                          </span>
                          <span style={{ fontFamily: FONT_BODY, fontSize: 11, color: '#888', fontWeight: 500, flexShrink: 0 }}>
                            {prop.type}
                          </span>
                        </div>
                        <div style={{ height: 2, background: '#f32735', margin: '4px 0' }} />
                        <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: '#888', margin: 0 }}>
                          Código inmueble {prop.reference.replace('Ref. ', '')}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          ) : (
            <div style={{ padding: '0 clamp(16px, 3vw, 48px)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mobilePaged.map((property) => (
                  <div key={property.id} className="propiedades-card-item">
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
              {mobileVisible < filtered.length && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                  <button
                    type="button"
                    onClick={() => setMobileVisible(v => v + MOBILE_LOAD_SIZE)}
                    style={{
                      fontFamily: FONT_BODY, fontSize: '14px', fontWeight: 600,
                      color: '#fff', background: RED, border: 'none',
                      cursor: 'pointer', padding: '12px 32px',
                      display: 'flex', alignItems: 'center', gap: '8px',
                    }}
                  >
                    Ver más
                    <span style={{ fontSize: '12px', opacity: 0.75 }}>
                      ({mobileVisible} de {filtered.length})
                    </span>
                  </button>
                </div>
              )}
              {filtered.length > 0 && mobileVisible >= filtered.length && (
                <p style={{
                  textAlign: 'center', fontFamily: FONT_BODY,
                  fontSize: '13px', color: '#999', marginTop: '20px',
                }}>
                  Has visto todas las propiedades disponibles
                </p>
              )}
            </div>
          )}
        </div>

        {/* Desktop layout — se oculta mientras el mapa está abierto */}
        {!showMap && (
          <div className="hidden lg:flex flex-col">
            <div ref={cardsGridRef} className="grid grid-cols-3 xl:grid-cols-4 gap-5">
              {desktopPaged.map((property) => (
                <div key={property.id} className="propiedades-card-item">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>

            {/* Paginación desktop */}
            {totalDesktopPages > 1 && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', marginTop: '40px',
              }}>
                <button
                  type="button"
                  disabled={desktopPage === 1}
                  onClick={() => { setDesktopPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{
                    fontFamily: FONT_BODY, fontSize: '13px', fontWeight: 600,
                    color: desktopPage === 1 ? '#ccc' : '#fff',
                    background: desktopPage === 1 ? '#f0f0f0' : RED,
                    border: 'none', cursor: desktopPage === 1 ? 'default' : 'pointer',
                    padding: '9px 20px', transition: 'all 0.15s',
                  }}
                >
                  ← Anterior
                </button>

                <span style={{
                  fontFamily: FONT_BODY, fontSize: '13px', color: '#555',
                  padding: '0 12px',
                }}>
                  Página {desktopPage} de {totalDesktopPages}
                </span>

                <button
                  type="button"
                  disabled={desktopPage === totalDesktopPages}
                  onClick={() => { setDesktopPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{
                    fontFamily: FONT_BODY, fontSize: '13px', fontWeight: 600,
                    color: desktopPage === totalDesktopPages ? '#ccc' : '#fff',
                    background: desktopPage === totalDesktopPages ? '#f0f0f0' : RED,
                    border: 'none', cursor: desktopPage === totalDesktopPages ? 'default' : 'pointer',
                    padding: '9px 20px', transition: 'all 0.15s',
                  }}
                >
                  Siguiente →
                </button>
              </div>
            )}
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
                  textoBusqueda: '',
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
        <div className={`mt-6 grid gap-4 ${showMap ? 'lg:hidden' : ''} ${appliedFilters.tipo === 'Todos' ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {(appliedFilters.tipo === 'Todos' || appliedFilters.tipo === 'Arrendar') && (
            <ScrollReveal y={20}>
              <div style={{ background: '#1a1a1a', borderRadius: 0, padding: '24px 28px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
                <h3 style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: '20px', color: '#fff', margin: 0, lineHeight: 1.2 }}>
                  <span className="lg:hidden">¿Quieres consignar tu inmueble?</span>
                  <span className="hidden lg:inline">¿Tienes un inmueble para arrendar o vender?</span>
                </h3>
                <p className="hidden lg:block" style={{ fontFamily: FONT_BODY, fontSize: '14px', color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.4 }}>
                  Consigna tu propiedad con nosotros y accede a nuestra red de clientes.
                </p>
                <button
                  type="button"
                  onClick={() => window.location.href = '/consignacion'}
                  style={{
                    fontFamily: FONT_BODY, fontSize: '13px', fontWeight: 600,
                    color: '#fff', background: RED, border: 'none',
                    cursor: 'pointer', padding: '11px 16px', borderRadius: 0,
                    transition: 'background 0.2s ease', whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#aa182c')}
                  onMouseLeave={e => (e.currentTarget.style.background = RED)}
                >
                  <span className="hidden lg:inline">Consigna tu propiedad</span>
                  <span className="lg:hidden">Consignar</span>
                </button>
              </div>
            </ScrollReveal>
          )}

          {(appliedFilters.tipo === 'Todos' || appliedFilters.tipo === 'Comprar') && (
            <ScrollReveal y={20} delay={appliedFilters.tipo === 'Todos' ? 0.1 : 0}>
              <div style={{ background: '#1a1a1a', borderRadius: 0, padding: '24px 28px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
                <h3 style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: '20px', color: '#fff', margin: 0, lineHeight: 1.2 }}>
                  ¿Buscas oportunidades de inversión?
                </h3>
                <p className="hidden lg:block" style={{ fontFamily: FONT_BODY, fontSize: '14px', color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.4 }}>
                  Descubre nuestras propiedades con mayor potencial de retorno en Antioquia.
                </p>
                <button
                  type="button"
                  onClick={() => window.location.href = '/inversionistas'}
                  style={{
                    fontFamily: FONT_BODY, fontSize: '13px', fontWeight: 600,
                    color: '#fff', background: RED, border: 'none',
                    cursor: 'pointer', padding: '11px 16px', borderRadius: 0,
                    transition: 'background 0.2s ease', whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#aa182c')}
                  onMouseLeave={e => (e.currentTarget.style.background = RED)}
                >
                  <span className="hidden lg:inline">Ver oportunidades de inversión</span>
                  <span className="lg:hidden">Ver inversión</span>
                </button>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </div>

    </>
  );
}