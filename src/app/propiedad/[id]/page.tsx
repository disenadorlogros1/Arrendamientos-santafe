'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { properties, DEFAULT_INTERIOR_GALLERY } from '@/data/properties';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MapComponent from '@/components/MapComponent';
import PropertyGallery from '@/components/PropertyGallery';
import ScrollReveal from '@/components/ScrollReveal';
import InfiniteCarousel from '@/components/InfiniteCarousel';
import { getInvestmentZoneForLocation } from '@/data/properties';
import { getZoneBySlug } from '@/data/investment-zones';
import type { PageType } from '@/components/Header';
import { Check, ShoppingBag, Wifi, Zap, Droplets, Flame } from 'lucide-react';
const S = (src: string) => <img src={src} style={{ width: 15, height: 15 }} alt="" aria-hidden />;


gsap.registerPlugin(ScrollTrigger);

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";

type SimilarFilter = 'precio' | 'ubicacion' | 'metros';

function getSimilar(current: import('@/data/properties').Property, filter: SimilarFilter) {
  const all = properties.filter(p => p.id !== current.id && p.businessType === current.businessType);
  const priceNum = parseInt(current.price.replace(/[^0-9]/g, '')) || 0;
  const areaNum  = parseInt(current.size) || 0;
  const zone     = current.location.split(',')[0].trim();

  const byPrice = all.filter(p => {
    const n = parseInt(p.price.replace(/[^0-9]/g, '')) || 0;
    return priceNum > 0 && n > priceNum * 0.6 && n < priceNum * 1.4;
  });
  const byArea = all.filter(p => {
    const n = parseInt(p.size) || 0;
    return areaNum > 0 && n > areaNum * 0.6 && n < areaNum * 1.4;
  });
  const byZone  = all.filter(p => p.location.includes(zone));
  const byType  = all.filter(p => p.type === current.type);
  const byBeds  = all.filter(p => p.bedrooms === current.bedrooms && current.bedrooms > 0);

  if (filter === 'precio') {
    const base = [...byPrice];
    if (base.length < 4) { byType.forEach(p => !base.some(b => b.id === p.id) && base.push(p)); }
    if (base.length < 4) { byBeds.forEach(p => !base.some(b => b.id === p.id) && base.push(p)); }
    if (base.length < 4) { all.forEach(p => !base.some(b => b.id === p.id) && base.push(p)); }
    return base.slice(0, 12);
  }
  if (filter === 'ubicacion') {
    const base = [...byZone];
    if (base.length < 4) { byPrice.forEach(p => !base.some(b => b.id === p.id) && base.push(p)); }
    if (base.length < 4) { all.forEach(p => !base.some(b => b.id === p.id) && base.push(p)); }
    return base.slice(0, 12);
  }
  // metros
  const base = [...byArea];
  if (base.length < 4) { byType.forEach(p => !base.some(b => b.id === p.id) && base.push(p)); }
  if (base.length < 4) { all.forEach(p => !base.some(b => b.id === p.id) && base.push(p)); }
  return base.slice(0, 12);
}

const DIR_TRANSFORMS: Record<string, string> = {
  top:    'translateY(-100%)',
  bottom: 'translateY(100%)',
  left:   'translateX(-100%)',
  right:  'translateX(100%)',
};

function getMouseEntryDir(e: React.MouseEvent<HTMLButtonElement>): string {
  const r = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  const dists: Record<string, number> = { top: y, bottom: r.height - y, left: x, right: r.width - x };
  return Object.entries(dists).sort(([, a], [, b]) => a - b)[0][0];
}

function FillButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  const fillRef = useRef<HTMLSpanElement>(null);

  const handleEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const fill = fillRef.current;
    if (!fill) return;
    fill.style.transition = 'none';
    fill.style.transform = DIR_TRANSFORMS[getMouseEntryDir(e)];
    fill.getBoundingClientRect(); // force reflow
    fill.style.transition = 'transform 0.28s ease';
    fill.style.transform = 'translate(0,0)';
  };

  const handleLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const fill = fillRef.current;
    if (!fill) return;
    fill.style.transition = 'transform 0.28s ease';
    fill.style.transform = DIR_TRANSFORMS[getMouseEntryDir(e)];
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position: 'relative', overflow: 'hidden',
        fontFamily: FONT, fontSize: 12, fontWeight: 700,
        padding: '6px 10px',
        border: `1px solid ${active ? '#f32735' : 'rgba(255,255,255,0.6)'}`,
        background: active ? '#f32735' : '#1a1a1a',
        color: '#fff',
        borderRadius: 0, cursor: 'pointer', textAlign: 'left',
      }}
    >
      <span
        ref={fillRef}
        style={{
          position: 'absolute', inset: 0,
          background: '#f32735',
          transform: 'translateX(-100%)',
          pointerEvents: 'none',
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  );
}

function SimilarSection({ current }: { current: import('@/data/properties').Property }) {
  const [filter, setFilter] = useState<SimilarFilter>('precio');
  const [isMobile, setIsMobile] = useState(false);
  const similar = useMemo(() => getSimilar(current, filter), [current, filter]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const FILTERS: { key: SimilarFilter; label: string }[] = [
    { key: 'precio',    label: 'Precio'    },
    { key: 'ubicacion', label: 'Ubicación' },
  ];

  if (similar.length === 0) return null;

  if (isMobile) {
    return (
      <div style={{ marginTop: 32 }}>
        {/* Bloque negro — cabecera superior ancho completo */}
        <div style={{
          background: '#1a1a1a',
          padding: '16px 20px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <h2 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.25 }}>
            Propiedades similares
          </h2>
          <div style={{ display: 'flex', gap: 6 }}>
            {FILTERS.map(f => (
              <FillButton key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
                {f.label}
              </FillButton>
            ))}
          </div>
        </div>
        {/* Carrusel horizontal */}
        <InfiniteCarousel properties={similar} maxVisible={3} />
      </div>
    );
  }

  return (
    <div style={{ marginTop: 32, display: 'flex', alignItems: 'stretch' }}>
      {/* Card negra estática — lateral en desktop */}
      <div style={{
        flexShrink: 0, width: 'clamp(140px, 16%, 200px)',
        background: '#1a1a1a',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '28px 20px', gap: 16,
        paddingTop: 'clamp(12px,3vw,32px)', paddingBottom: 'clamp(12px,3vw,32px)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <h2 style={{ fontFamily: FONT, fontSize: 'clamp(14px, 1.2vw, 18px)', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.25 }}>
          Propiedades similares
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {FILTERS.map(f => (
            <FillButton key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
              {f.label}
            </FillButton>
          ))}
        </div>
      </div>
      {/* Carrusel */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <InfiniteCarousel properties={similar} maxVisible={3} />
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value, isRight, spanFull }: { icon: string; label: string; value: string; isRight: boolean; spanFull?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'baseline', gap: 8,
        padding: '10px 0',
        gridColumn: spanFull ? 'span 2' : undefined,
        minWidth: 0, overflow: 'hidden',
      }}
    >
      <img
        src={icon} width="15" height="15"
        style={{
          flexShrink: 0, alignSelf: 'center',
          filter: hov
            ? 'invert(16%) sepia(100%) saturate(6000%) hue-rotate(340deg) brightness(85%)'
            : 'grayscale(1) opacity(0.35)',
          transition: 'filter 0.18s',
        }}
      />
      <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: '#333', whiteSpace: 'nowrap' }}>{label}</span>
      {/* Leader line */}
      <span style={{
        flex: 1, height: 0, minWidth: 12,
        borderBottom: `1px solid ${hov ? '#f32735' : '#1a1a1a'}`,
        marginBottom: 3,
        transition: 'border-color 0.18s',
      }} />
      <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 400, color: '#555', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  );
}

function ZoneSection({ zone, zoneLabel }: { zone: NonNullable<ReturnType<typeof getZoneBySlug>>; zoneLabel: string }) {
  const [hovCta, setHovCta] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
      {/* Bloque info */}
      <div style={{
        flex: 1,
        background: '#fff',
        padding: '28px 24px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        textAlign: 'center', gap: 18,
      }}>
        <h3 style={{ fontFamily: FONT, fontSize: 'clamp(22px, 2.8vw, 30px)', fontWeight: 900, color: '#555', margin: 0, lineHeight: 1.2 }}>
          ¿Por qué invertir<br />en esta zona?
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
            <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, color: '#bbb', letterSpacing: '0.04em' }}>Rentabilidad</span>
            <span style={{ fontFamily: FONT, fontSize: 'clamp(18px, 2.2vw, 24px)', fontWeight: 900, color: '#555', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{zone.rentability}</span>
          </div>
          <div style={{ width: 1, height: 34, background: '#e8e8e8', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
            <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, color: '#bbb', letterSpacing: '0.04em' }}>Estratos</span>
            <span style={{ fontFamily: FONT, fontSize: 'clamp(18px, 2.2vw, 24px)', fontWeight: 900, color: '#555', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{zone.strata}</span>
          </div>
        </div>
      </div>

      {/* Bloque CTA — rojo, ancho completo en mobile */}
      <Link
        href={`/inversionistas/${zone.slug}`}
        style={{
          flexShrink: 0,
          width: isMobile ? '100%' : 'clamp(160px, 32%, 240px)',
          background: hovCta ? '#aa182c' : '#f32735',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 8, padding: isMobile ? '18px 24px' : '28px 20px',
          textDecoration: 'none',
          transition: 'background 0.2s',
        }}
        onMouseEnter={() => setHovCta(true)}
        onMouseLeave={() => setHovCta(false)}
      >
        <span style={{
          fontFamily: FONT, fontSize: isMobile ? '20px' : 'clamp(24px, 3vw, 32px)',
          fontWeight: 900, color: '#fff', lineHeight: 1,
        }}>
          Ver zona
        </span>
      </Link>
    </div>
  );
}

const CHAR_ICONS: Array<{ keys: string[]; icon: React.ReactNode }> = [
  { keys: ['patio', 'jardín', 'jardin', 'terraza', 'zona verde'], icon: S('/icons/icon-trees-red.svg')        },
  { keys: ['parqueo', 'parqueadero', 'garage', 'garaje'],         icon: S('/icons/icon-parking-red.svg')      },
  { keys: ['zona de servicios', 'servicios', 'lavadero'],         icon: S('/icons/icon-wrench-red.svg')       },
  { keys: ['familiar', 'familia', 'salón comunal', 'salon comunal'], icon: S('/icons/icon-communityhall-red.svg') },
  { keys: ['acceso', 'entrada'],                                  icon: S('/icons/icon-dooropen-red.svg')     },
  { keys: ['comercial'],                                          icon: <ShoppingBag size={15} className="text-brand-red" /> },
  { keys: ['piscina', 'jacuzzi'],                                 icon: S('/icons/icon-pool-red.svg')         },
  { keys: ['seguridad', 'vigilancia', 'portería', 'porteria'],    icon: S('/icons/icon-shield-red.svg')       },
  { keys: ['aire', 'ventilación', 'ventilacion'],                 icon: S('/icons/icon-wind-red.svg')         },
  { keys: ['cocina'],                                             icon: S('/icons/icon-kitchen-red.svg')      },
  { keys: ['balcón', 'balcon'],                                   icon: S('/icons/icon-balcony-red.svg')      },
  { keys: ['gimnasio', 'gym'],                                    icon: S('/icons/icon-gym-red.svg')          },
  { keys: ['mascotas'],                                           icon: S('/icons/icon-pet-friendly-red.svg') },
  { keys: ['disponible', 'disponibilidad'],                       icon: S('/icons/icon-calendar-red.svg')     },
  { keys: ['wifi', 'internet'],                                   icon: <Wifi      size={15} className="text-brand-red" /> },
  { keys: ['energía', 'energia', 'eléctrica', 'electrica', 'luz'], icon: <Zap      size={15} className="text-brand-red" /> },
  { keys: ['agua', 'acueducto'],                                  icon: <Droplets  size={15} className="text-brand-red" /> },
  { keys: ['gas', 'gas natural', 'gas domiciliario'],             icon: <Flame     size={15} className="text-brand-red" /> },
];

function getCharIcon(char: string): React.ReactNode {
  const lower = char.toLowerCase();
  const match = CHAR_ICONS.find(m => m.keys.some(k => lower.includes(k)));
  return match?.icon ?? <Check size={15} className="text-brand-red" />;
}

export default function PropertyDetailPage() {
  const params    = useParams();
  const router    = useRouter();
  const [currentPage, setCurrentPage] = useState<PageType>('propiedades');
  const propertyId = parseInt(params.id as string);
  const property   = properties.find((p) => p.id === propertyId);

  // Entrance animation refs
  const galleryRef     = useRef<HTMLDivElement>(null);
  const titleBlockRef  = useRef<HTMLDivElement>(null);
  const formRef        = useRef<HTMLDivElement>(null);
  const detailsRef     = useRef<HTMLDivElement>(null);
  const charsRef       = useRef<HTMLDivElement>(null);


  const handleNavigate = (page: PageType) => {
    const routes: Partial<Record<PageType, string>> = {
      home:           '/',
      propiedades:    '/propiedades',
      consignacion:   '/consignacion',
      inversionistas: '/inversionistas',
      blog:           '/blog',
    };
    window.location.href = routes[page] ?? '/';
  };

  // Staged entrance
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Stage 1: gallery fade (0ms)
      tl.from(galleryRef.current, { opacity: 0, duration: 0.4 }, 0.05);

      // Stage 3: title + price block (120ms) — the key info
      tl.from(titleBlockRef.current, { opacity: 0, y: 16, duration: 0.4 }, 0.12);

      // Stage 4: sticky form panel (200ms)
      tl.from(formRef.current, { opacity: 0, y: 20, duration: 0.45 }, 0.20);

      // Detail rows stagger
      if (detailsRef.current) {
        const rows = detailsRef.current.querySelectorAll('div[style]');
        gsap.from(rows, {
          opacity: 0,
          y: 8,
          duration: 0.25,
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: { trigger: detailsRef.current, start: 'top 88%', once: true },
        });
      }

      // Characteristics pills cascade
      if (charsRef.current) {
        const pills = charsRef.current.querySelectorAll('.char-pill');
        gsap.from(pills, {
          opacity: 0,
          scale: 0.85,
          duration: 0.25,
          stagger: 0.04,
          ease: 'back.out(1.7)',
          scrollTrigger: { trigger: charsRef.current, start: 'top 88%', once: true },
        });
      }

    });

    return () => ctx.revert();
  }, []);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header currentPage={currentPage} onNavigate={handleNavigate} isHeroPage={false} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Propiedad no encontrada</h1>
            <Link href="/propiedades" className="text-brand-red hover:underline">
              Volver al listado
            </Link>
          </div>
        </main>
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  const galleryImages = property.images?.length
    ? property.images
    : [property.image, ...DEFAULT_INTERIOR_GALLERY.filter(img => img !== property.image)];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header currentPage={currentPage} onNavigate={handleNavigate} isHeroPage={false} />
      <main className="flex-1 pt-[86px] relative">
        <div>
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Columna izquierda */}
              <div className="lg:col-span-2">

                {/* Galería con botón volver */}
                <div ref={galleryRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => router.back()}
                    style={{
                      position: 'absolute', top: 12, left: 12, zIndex: 20,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 38, height: 38, borderRadius: '50%',
                      backgroundColor: '#f32735', border: 'none', cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#aa182c')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f32735')}
                    aria-label="Volver"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </button>
                  <PropertyGallery
                    images={galleryImages}
                    title={property.title}
                    stats={{
                      bedrooms:  property.bedrooms,
                      bathrooms: property.bathrooms,
                      area:      property.size,
                      parking:   property.parking,
                      price:     property.price,
                      zone:      getInvestmentZoneForLocation(property.location),
                      reference: property.reference.replace('Ref. ', ''),
                    }}
                  />
                </div>

                {/* Título, precio, stats */}
                <div ref={titleBlockRef} style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '10px 20px', margin: '0 0 5px 0' }}>
                    <h1 style={{ fontFamily: FONT, fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1, letterSpacing: '-0.3px', margin: 0 }}>{property.title}</h1>
                    <p style={{ fontFamily: FONT, fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 900, color: '#f32735', lineHeight: 1.05, letterSpacing: '-0.5px', margin: 0 }}>{property.price}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                    <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: '#888' }}>
                      {property.businessType === 'Comprar' ? 'Venta' : 'Arriendo'}
                    </span>
                    <span style={{ color: '#ccc' }}>·</span>
                    <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: '#888' }}>{property.type}</span>
                    <span style={{ color: '#ccc' }}>·</span>
                    <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: '#888' }}>
                      Código inmueble {property.reference.replace('Ref. ', '')}
                    </span>
                  </div>

                  {/* Descripción */}
                  {property.description && (
                    <ScrollReveal y={12} delay={0}>
                      <div style={{ marginTop: 24 }}>
                        <h2 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 10 }}>Descripción</h2>
                        <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 300, color: '#888', lineHeight: 1.4 }}>{property.description}</p>
                      </div>
                    </ScrollReveal>
                  )}

                  {/* Detalles del inmueble */}
                  <div style={{ marginTop: 24 }}>
                    <ScrollReveal y={10}>
                      <h2 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Detalles del inmueble</h2>
                    </ScrollReveal>
                    <div ref={detailsRef} className="grid grid-cols-1 sm:grid-cols-2" style={{ columnGap: 24, rowGap: 0 }}>
                      {[
                        { icon: '/icons/icon-home-red.svg',      label: 'Tipo de inmueble',  value: property.type,                     show: !!property.type },
                        { icon: '/icons/icon-area-gray.svg',     label: 'Área construida',   value: property.size,                     show: !!property.size },
                        { icon: '/icons/icon-bed-gray.svg',      label: 'Habitaciones',      value: String(property.bedrooms),         show: property.bedrooms > 0 },
                        { icon: '/icons/icon-bathroom-gray.svg', label: 'Baños',             value: String(property.bathrooms),        show: property.bathrooms > 0 },
                        { icon: '/icons/icon-home-red.svg',      label: 'Estrato',           value: `Estrato ${property.stratum}`,     show: !!property.stratum },
                        { icon: '/icons/icon-parking-red.svg',   label: 'Parqueaderos',      value: String(property.parking ?? property.garage), show: (property.parking ?? 0) > 0 || (property.garage ?? 0) > 0 },
                        { icon: '/icons/icon-home-red.svg',      label: 'Estado',            value: property.estado ?? '',             show: !!property.estado },
                        { icon: '/icons/icon-schedule-red.svg',  label: 'Antigüedad',        value: property.antiguedad ?? '',         show: !!property.antiguedad },
                        { icon: '/icons/icon-home-red.svg',      label: 'Piso N°',           value: String(property.pisoNumero),       show: property.pisoNumero !== undefined },
                        { icon: '/icons/icon-dollar-red.svg',    label: 'Administración',    value: property.administracion ?? '',     show: !!property.administracion },
                        { icon: '/icons/icon-home-red.svg',      label: 'Acepta mascotas',   value: property.petFriendly ? 'Sí' : 'No', show: property.petFriendly !== undefined },
                        { icon: '/icons/icon-FileText-red.svg',  label: 'Contrato mínimo',   value: property.contratoMinimo ?? '',     show: !!property.contratoMinimo },
                        { icon: '/icons/icon-sofa-red.svg',      label: 'Amoblado',          value: property.furnished ? 'Sí' : 'No', show: property.furnished !== undefined },
                      ].filter(r => r.show).map((row, i, arr) => (
                        <DetailRow key={row.label} icon={row.icon} label={row.label} value={row.value} isRight={i % 2 === 1} spanFull={i === arr.length - 1 && arr.length % 2 === 1} />
                      ))}
                    </div>
                  </div>

                  {/* Mapa — solo en propiedades de arriendo */}
                  {property.businessType !== 'Comprar' && property.latitude && property.longitude && (
                    <ScrollReveal y={16} className="mt-6">
                      <h2 className="text-lg font-bold text-gray-900 mb-2">Ubicación</h2>
                      <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 500, color: '#888', display: 'flex', alignItems: 'center', gap: 5, margin: '0 0 12px 0' }}>
                        <img src="/icons/icon-location-red.svg" alt="" width="14" height="14" style={{ flexShrink: 0, objectFit: 'contain' }} />
                        {property.address || property.location}
                      </p>
                      <MapComponent
                        latitude={property.latitude}
                        longitude={property.longitude}
                        title={property.title}
                        businessType={property.businessType || 'Arrendar'}
                      />
                    </ScrollReveal>
                  )}

                  {/* Características — pill cascade */}
                  {property.characteristics && property.characteristics.length > 0 && (
                    <div className="mt-6">
                      <ScrollReveal y={10}>
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Características incluidas</h2>
                      </ScrollReveal>
                      <div ref={charsRef} className="flex flex-wrap gap-3">
                        {property.characteristics.map((char, idx) => (
                          <div
                            key={idx}
                            className="char-pill flex items-center gap-2 px-3 py-2 bg-white border border-gray-200"
                          >
                            {getCharIcon(char)}
                            <span style={{ fontFamily: FONT, fontSize: 13, color: '#555' }}>{char}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Zona — aparece para arriendo y compra */}
                  {(() => {
                    const investmentZoneSlug = getInvestmentZoneForLocation(property.location);
                    const investmentZone = investmentZoneSlug ? getZoneBySlug(investmentZoneSlug) : null;
                    if (!investmentZone || property.businessType !== 'Comprar') return null;
                    const zoneLabel = '¿Por qué invertir en esta zona?';
                    return (
                      <ScrollReveal y={16} className="mt-6">
                        <ZoneSection zone={investmentZone} zoneLabel={zoneLabel} />
                      </ScrollReveal>
                    );
                  })()}
                </div>
              </div>

              {/* Columna derecha — Formulario sticky */}
              <div className="lg:col-span-1">
                <div ref={formRef} style={{
                  background: '#fff',
                  border: '1px solid #f5f5f5',
                  borderRadius: 0,
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  position: 'sticky',
                  top: '102px',
                  transformOrigin: 'center',
                }}>
                  <div>
                    <h3 style={{ fontFamily: FONT, fontSize: 'clamp(18px, 2.2vw, 26px)', fontWeight: 900, color: '#1a1a1a', textAlign: 'center', margin: 0, lineHeight: 1.15 }}>
                      ¿Te interesa esta propiedad?
                    </h3>
                    <p style={{ fontFamily: FONT, fontSize: '13px', color: '#888', textAlign: 'center', margin: '5px 0 0' }}>
                      Te responderemos de inmediato.
                    </p>
                  </div>

                  {/* WhatsApp CTA */}
                  <a
                    href={`https://wa.me/573006557529?text=${encodeURIComponent(
                      `Hola, quisiera consultar disponibilidad del inmueble ${property.reference} (${property.title}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      backgroundColor: '#f32735', color: '#fff', fontWeight: 600, fontSize: '15px',
                      padding: '13px 16px', borderRadius: 0, textDecoration: 'none',
                      transition: 'background-color 0.2s', width: '100%',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#aa182c')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f32735')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L.057 23.982l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.371l-.36-.214-3.733.979 1.001-3.646-.235-.374A9.818 9.818 0 1112 21.818z"/>
                    </svg>
                    Escribir por WhatsApp
                  </a>

                  {/* Compartir */}
                  <div style={{ borderTop: '1px solid #eee', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 400, color: '#888' }}>
                      Compartir propiedad
                    </span>
                    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                          backgroundColor: '#f5f5f5', color: '#555', fontSize: '13px', fontWeight: 600,
                          padding: '9px 14px', borderRadius: '999px', border: '1px solid #f5f5f5', cursor: 'pointer',
                          flex: 1, transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                        Copiar enlace
                      </button>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`${property.title} - ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                          backgroundColor: '#f32735', color: '#fff', fontSize: '13px', fontWeight: 600,
                          padding: '9px 14px', borderRadius: '999px', textDecoration: 'none', flex: 1,
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#aa182c')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f32735')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="white">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L.057 23.982l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.371l-.36-.214-3.733.979 1.001-3.646-.235-.374A9.818 9.818 0 1112 21.818z"/>
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          {/* Propiedades similares */}
          <div className="max-w-7xl mx-auto px-6" style={{ paddingBottom: 64 }}>
            <SimilarSection current={property} />
          </div>
        </div>
      {/* JSON-LD Schema.org — RealEstateListing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'RealEstateListing',
          name: property.title,
          description: property.description ?? '',
          url: typeof window !== 'undefined' ? window.location.href : '',
          image: galleryImages[0] ?? property.image,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'COP',
            price: property.price.replace(/[^0-9]/g, ''),
            availability: 'https://schema.org/InStock',
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: property.address ?? property.location,
            addressLocality: 'Medellín',
            addressRegion: 'Antioquia',
            addressCountry: 'CO',
          },
          ...(property.latitude && property.longitude ? {
            geo: { '@type': 'GeoCoordinates', latitude: property.latitude, longitude: property.longitude },
          } : {}),
          numberOfRooms: property.bedrooms,
          numberOfBathroomsTotal: property.bathrooms,
          floorSize: { '@type': 'QuantitativeValue', value: parseInt(property.size), unitCode: 'MTK' },
          petsAllowed: property.petFriendly ?? false,
          ...(property.antiguedad ? { yearBuilt: property.antiguedad } : {}),
          amenityFeature: (property.characteristics ?? []).map(c => ({
            '@type': 'LocationFeatureSpecification', name: c, value: true,
          })),
        })}}
      />
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}