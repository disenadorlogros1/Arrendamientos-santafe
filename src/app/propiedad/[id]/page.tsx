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

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";

type SimilarFilter = 'precio' | 'ubicacion' | 'metros';

function SimilarSection({ current }: { current: import('@/data/properties').Property }) {
  const [filter, setFilter] = useState<SimilarFilter>('precio');

  const similar = useMemo(() => {
    const all = properties.filter(p => p.id !== current.id && p.businessType === current.businessType);
    const priceNum = parseInt(current.price.replace(/[^0-9]/g, '')) || 0;

    if (filter === 'precio') {
      return all.filter(p => {
        const n = parseInt(p.price.replace(/[^0-9]/g, '')) || 0;
        return priceNum > 0 && n > priceNum * 0.6 && n < priceNum * 1.4;
      }).slice(0, 12);
    }
    if (filter === 'ubicacion') {
      const zone = current.location.split(',')[0].trim();
      return all.filter(p => p.location.includes(zone)).slice(0, 12);
    }
    // metros
    const areaNum = parseInt(current.size) || 0;
    return all.filter(p => {
      const n = parseInt(p.size) || 0;
      return areaNum > 0 && n > areaNum * 0.6 && n < areaNum * 1.4;
    }).slice(0, 12);
  }, [current, filter]);

  const FILTERS: { key: SimilarFilter; label: string }[] = [
    { key: 'precio',    label: 'Precio'    },
    { key: 'ubicacion', label: 'Ubicación' },
    { key: 'metros',    label: 'M²'        },
  ];

  if (similar.length === 0) return null;

  return (
    <div style={{ marginTop: 40, borderTop: '1px solid #f0f0f0', paddingTop: 32 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 4, paddingLeft: 16, paddingRight: 16 }}>
        <h2 style={{ fontFamily: FONT, fontSize: 'clamp(20px, 2.4vw, 32px)', fontWeight: 900, color: '#1a1a1a', margin: 0 }}>
          Propiedades <span style={{ fontWeight: 300 }}>similares</span>
        </h2>
        <div style={{ display: 'flex', gap: 6 }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                fontFamily: FONT, fontSize: 13, fontWeight: filter === f.key ? 700 : 400,
                padding: '6px 16px', border: '1px solid',
                borderColor: filter === f.key ? '#f32735' : '#ddd',
                backgroundColor: filter === f.key ? '#f32735' : '#fff',
                color: filter === f.key ? '#fff' : '#555',
                borderRadius: 0, cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ paddingTop: '1.5%', paddingBottom: '1.5%' }}>
        <InfiniteCarousel properties={similar} />
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value, isLast }: { icon: string; label: string; value: string; isLast: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 16px',
        borderBottom: isLast ? 'none' : '1px solid #f0f0f0',
        background: hov ? '#fafafa' : '#fff',
        transition: 'background 0.15s',
      }}
    >
      <img
        src={icon}
        width="20" height="20"
        style={{ flexShrink: 0, filter: hov ? 'none' : 'grayscale(1) opacity(0.45)', transition: 'filter 0.2s' }}
      />
      <span style={{ fontFamily: FONT, fontSize: 13, color: '#888', flex: 1 }}>{label}</span>
      <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{value}</span>
    </div>
  );
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
  const whatsappBtnRef = useRef<HTMLAnchorElement>(null);

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

      // WhatsApp button attention pulse — fires once after 800ms
      if (whatsappBtnRef.current) {
        gsap.timeline({ delay: 0.8 })
          .to(whatsappBtnRef.current, { scale: 1.03, duration: 0.18, ease: 'power2.out' })
          .to(whatsappBtnRef.current, { scale: 1,    duration: 0.22, ease: 'power2.inOut' });
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
                      backgroundColor: '#e53935', border: 'none', cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#c62828')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e53935')}
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
                  <h1 style={{ fontFamily: FONT, fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1, letterSpacing: '-0.3px', margin: '0 0 4px 0' }}>{property.title}</h1>

                  <p style={{ fontFamily: FONT, fontSize: 'clamp(22px, 3.2vw, 36px)', fontWeight: 900, color: '#f32735', lineHeight: 1.05, letterSpacing: '-0.5px', margin: '0 0 5px 0' }}>{property.price}</p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                    <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: '#909090' }}>
                      {property.businessType === 'Comprar' ? 'Venta' : 'Arriendo'}
                    </span>
                    <span style={{ color: '#ccc' }}>·</span>
                    <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: '#909090' }}>{property.type}</span>
                    <span style={{ color: '#ccc' }}>·</span>
                    <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: '#909090' }}>
                      Código inmueble {property.reference.replace('Ref. ', '')}
                    </span>
                  </div>

                  {/* Descripción */}
                  {property.description && (
                    <ScrollReveal y={12} delay={0}>
                      <div style={{ marginTop: 24 }}>
                        <h2 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 10 }}>Descripción</h2>
                        <p style={{ fontFamily: FONT, fontSize: 14, color: '#909090', lineHeight: 1.7 }}>{property.description}</p>
                      </div>
                    </ScrollReveal>
                  )}

                  {/* Detalles del inmueble */}
                  <div style={{ marginTop: 24 }}>
                    <ScrollReveal y={10}>
                      <h2 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Detalles del inmueble</h2>
                    </ScrollReveal>
                    <div ref={detailsRef} style={{ border: '1px solid #e8e8e8' }}>
                      {[
                        { icon: '/icons/icon-home-red.gif',      label: 'Tipo de inmueble',  value: property.type,                              show: true },
                        { icon: '/icons/icon-area-gray.gif',     label: 'Área construida',   value: property.size,                              show: true },
                        { icon: '/icons/icon-bed-gray.gif',      label: 'Habitaciones',      value: String(property.bedrooms),                  show: property.bedrooms > 0 },
                        { icon: '/icons/icon-bathroom-gray.gif', label: 'Baños',             value: String(property.bathrooms),                 show: property.bathrooms > 0 },
                        { icon: '/icons/icon-home-red.gif',      label: 'Estrato',           value: `Estrato ${property.stratum}`,              show: !!property.stratum },
                        { icon: '/icons/icon-home-red.gif',      label: 'Parqueaderos',      value: String(property.parking),                   show: (property.parking ?? 0) > 0 },
                        { icon: '/icons/icon-home-red.gif',      label: 'Garajes',           value: String(property.garage),                    show: (property.garage ?? 0) > 0 },
                        { icon: '/icons/icon-home-red.gif',      label: 'Estado',            value: property.estado ?? '',                      show: !!property.estado },
                        { icon: '/icons/icon-home-red.gif',      label: 'Antigüedad',        value: property.antiguedad ?? '',                  show: !!property.antiguedad },
                        { icon: '/icons/icon-home-red.gif',      label: 'Piso N°',           value: String(property.pisoNumero),                show: property.pisoNumero !== undefined },
                        { icon: '/icons/icon-home-red.gif',      label: 'Administración',    value: property.administracion ?? '',              show: !!property.administracion },
                        { icon: '/icons/icon-home-red.gif',      label: 'Acepta mascotas',   value: property.petFriendly ? 'Sí' : 'No',         show: property.petFriendly !== undefined },
                        { icon: '/icons/icon-home-red.gif',      label: 'Contrato mínimo',   value: property.contratoMinimo ?? '',              show: !!property.contratoMinimo },
                        { icon: '/icons/icon-home-red.gif',      label: 'Amoblado',          value: property.furnished ? 'Sí' : 'No',           show: property.furnished !== undefined },
                      ].filter(r => r.show).map((row, i, arr) => (
                        <DetailRow key={row.label} icon={row.icon} label={row.label} value={row.value} isLast={i === arr.length - 1} />
                      ))}
                    </div>
                  </div>

                  {/* Mapa */}
                  {property.latitude && property.longitude && (
                    <ScrollReveal y={16} className="mt-6">
                      <h2 className="text-lg font-bold text-gray-900 mb-2">Ubicación</h2>
                      <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 500, color: '#808080', display: 'flex', alignItems: 'center', gap: 5, margin: '0 0 12px 0' }}>
                        <img src="/icons/icon-location-red.gif" alt="" width="14" height="14" style={{ flexShrink: 0, objectFit: 'contain' }} />
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
                            <span className="text-red-600">✓</span>
                            <span style={{ fontFamily: FONT, fontSize: 13, color: '#444' }}>{char}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Zona — aparece para arriendo y compra */}
                  {(() => {
                    const investmentZoneSlug = getInvestmentZoneForLocation(property.location);
                    const investmentZone = investmentZoneSlug ? getZoneBySlug(investmentZoneSlug) : null;
                    if (!investmentZone) return null;
                    const isCompra = property.businessType === 'Comprar';
                    const zoneLabel = isCompra ? '¿Por qué invertir en esta zona?' : '¿Por qué arrendar en esta zona?';
                    return (
                      <ScrollReveal y={16} className="mt-6">
                        <div style={{ borderLeft: '4px solid #f32735', padding: '20px 20px 20px 20px', background: 'rgba(243,39,53,0.03)', borderTop: '1px solid #f5e0e0', borderBottom: '1px solid #f5e0e0', borderRight: '1px solid #f5e0e0' }}>
                          <h2 style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>
                            {isCompra ? 'Zona de inversión' : 'Por qué vivir aquí'}
                          </h2>
                          <p style={{ fontFamily: FONT, fontSize: 13, color: '#666', marginBottom: 16, lineHeight: 1.6 }}>
                            Esta propiedad se encuentra en{' '}
                            <strong style={{ color: '#f32735' }}>{investmentZone.name}</strong>,
                            {isCompra ? ' una zona con alta demanda y potencial de rentabilidad.' : ' una zona con buena conectividad y calidad de vida.'}
                          </p>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                            <div style={{ textAlign: 'center' }}>
                              <p style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>Rentabilidad</p>
                              <p style={{ fontFamily: FONT, fontWeight: 700, color: '#f32735', fontSize: 16 }}>{investmentZone.rentability}</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <p style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>Precio m²</p>
                              <p style={{ fontFamily: FONT, fontWeight: 700, color: '#1a1a1a', fontSize: 13 }}>{investmentZone.pricePerM2}</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <p style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>Estratos</p>
                              <p style={{ fontFamily: FONT, fontWeight: 700, color: '#1a1a1a', fontSize: 15 }}>{investmentZone.strata}</p>
                            </div>
                          </div>
                          <Link
                            href={`/inversionistas/${investmentZone.slug}`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 40, padding: '0 20px', backgroundColor: '#f32735', color: '#fff', fontFamily: FONT, fontWeight: 600, fontSize: 13, textDecoration: 'none', transition: 'background-color 0.2s', borderRadius: 0 }}
                            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.backgroundColor = '#c62828')}
                            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.backgroundColor = '#f32735')}
                          >
                            {zoneLabel}
                          </Link>
                        </div>
                      </ScrollReveal>
                    );
                  })()}
                </div>
              </div>

              {/* Columna derecha — Formulario sticky */}
              <div className="lg:col-span-1">
                <div ref={formRef} style={{
                  background: '#fff',
                  border: '1px solid #e0e0e0',
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
                    <p style={{ fontFamily: FONT, fontSize: '13px', color: '#909090', textAlign: 'center', margin: '5px 0 0' }}>
                      Te responderemos de inmediato.
                    </p>
                  </div>

                  {/* WhatsApp CTA */}
                  <a
                    ref={whatsappBtnRef}
                    href={`https://wa.me/573006557529?text=${encodeURIComponent(
                      `Hola, quisiera consultar disponibilidad del inmueble ${property.reference} (${property.title}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      backgroundColor: '#e53935', color: '#fff', fontWeight: 600, fontSize: '15px',
                      padding: '13px 16px', borderRadius: 0, textDecoration: 'none',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#c62828')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e53935')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L.057 23.982l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.371l-.36-.214-3.733.979 1.001-3.646-.235-.374A9.818 9.818 0 1112 21.818z"/>
                    </svg>
                    Escribir por WhatsApp
                  </a>

                  <span style={{ textAlign: 'center', fontSize: '13px', color: '#909090', display: 'block' }}>
                    o envía un mensaje
                  </span>

                  <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                    onSubmit={e => e.preventDefault()}
                  >
                    {[
                      { label: 'Tu nombre', type: 'text', placeholder: 'Nombre completo' },
                      { label: 'Teléfono', type: 'tel', placeholder: '300 000 0000' },
                    ].map(({ label, type, placeholder }) => (
                      <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>{label}</label>
                        <input
                          type={type}
                          placeholder={placeholder}
                          style={{
                            border: '1px solid #ccc', borderRadius: 0, padding: '10px 12px',
                            fontSize: '14px', color: '#333', outline: 'none',
                            transition: 'border-color 0.2s', fontFamily: 'inherit', background: '#fff',
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = '#e53935')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#ccc')}
                        />
                      </div>
                    ))}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>
                        Mensaje <span style={{ fontWeight: 400, color: '#888' }}>(opcional)</span>
                      </label>
                      <textarea
                        placeholder="¿Está disponible para visitar esta semana?"
                        style={{
                          border: '1px solid #ccc', borderRadius: 0, padding: '10px 12px',
                          fontSize: '14px', color: '#333', outline: 'none',
                          transition: 'border-color 0.2s', fontFamily: 'inherit', background: '#fff',
                          minHeight: '80px', resize: 'vertical',
                        }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#e53935')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#ccc')}
                      />
                    </div>
                    <button
                      type="submit"
                      style={{
                        backgroundColor: '#e53935', color: '#fff', fontWeight: 700, fontSize: '15px',
                        padding: '13px', border: 'none', borderRadius: 0, cursor: 'pointer',
                        width: '100%', transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#c62828')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e53935')}
                    >
                      Enviar consulta
                    </button>
                  </form>

                  {/* Compartir */}
                  <div style={{ borderTop: '1px solid #eee', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#888', letterSpacing: '0.02em' }}>
                      Compartir propiedad
                    </span>
                    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                          backgroundColor: '#f5f5f5', color: '#444', fontSize: '13px', fontWeight: 600,
                          padding: '9px 14px', borderRadius: 0, border: '1px solid #e0e0e0', cursor: 'pointer',
                          flex: 1, transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e8e8e8')}
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
                          backgroundColor: '#e53935', color: '#fff', fontSize: '13px', fontWeight: 600,
                          padding: '9px 14px', borderRadius: '999px', textDecoration: 'none', flex: 1,
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#c62828')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e53935')}
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
          <div className="max-w-7xl mx-auto px-6">
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