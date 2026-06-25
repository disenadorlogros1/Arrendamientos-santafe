'use client';

import { useState, useEffect, useRef } from 'react';
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
import { getInvestmentZoneForLocation } from '@/data/properties';
import { getZoneBySlug } from '@/data/investment-zones';
import type { PageType } from '@/components/Header';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";

export default function PropertyDetailPage() {
  const params    = useParams();
  const router    = useRouter();
  const [currentPage, setCurrentPage] = useState<PageType>('propiedades');
  const propertyId = parseInt(params.id as string);
  const property   = properties.find((p) => p.id === propertyId);

  // Entrance animation refs
  const breadcrumbRef  = useRef<HTMLDivElement>(null);
  const galleryRef     = useRef<HTMLDivElement>(null);
  const titleBlockRef  = useRef<HTMLDivElement>(null);
  const formRef        = useRef<HTMLDivElement>(null);
  const statsRef       = useRef<HTMLDivElement>(null);
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

      // Stage 1: breadcrumb (0ms)
      tl.from(breadcrumbRef.current, { opacity: 0, y: -8, duration: 0.3 }, 0);

      // Stage 2: gallery fade (50ms)
      tl.from(galleryRef.current, { opacity: 0, duration: 0.4 }, 0.05);

      // Stage 3: title + price block (120ms) — the key info
      tl.from(titleBlockRef.current, { opacity: 0, y: 16, duration: 0.4 }, 0.12);

      // Stage 4: sticky form panel (200ms)
      tl.from(formRef.current, { opacity: 0, y: 20, duration: 0.45 }, 0.20);

      // Stats grid stagger (scroll-triggered count-up feel)
      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll('.stat-item');
        gsap.from(statItems, {
          opacity: 0,
          y: 12,
          scale: 0.95,
          duration: 0.35,
          stagger: 0.06,
          ease: 'back.out(1.4)',
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%', once: true },
        });
      }

      // Detail cards stagger
      if (detailsRef.current) {
        const cards = detailsRef.current.querySelectorAll('.detail-card');
        gsap.from(cards, {
          opacity: 0,
          y: 10,
          duration: 0.3,
          stagger: 0.05,
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header currentPage={currentPage} onNavigate={handleNavigate} isHeroPage={false} />
      <main className="flex-1 pt-[86px] relative">
        <div>
          {/* Breadcrumb */}
          <div ref={breadcrumbRef} className="bg-white border-b border-gray-200 py-4 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <button
                  onClick={() => router.push('/propiedades')}
                  className="text-brand-red hover:underline font-semibold"
                  title="Volver"
                >
                  ← Atrás
                </button>
                <span>/</span>
                <span className="text-gray-900">{property.title}</span>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Columna izquierda */}
              <div className="lg:col-span-2">

                {/* Galería */}
                <div ref={galleryRef}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: '#f32735', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {property.businessType === 'Comprar' ? 'Venta' : 'Arriendo'}
                    </span>
                    <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 500, color: '#909090', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{property.type}</span>
                    <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 500, color: '#909090', letterSpacing: '0.06em' }}>
                      Ref. {property.reference.replace('Ref. ', '')}
                    </span>
                  </div>

                  <h1 style={{ fontFamily: FONT, fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.15, letterSpacing: '-0.3px', margin: '0 0 8px 0' }}>{property.title}</h1>
                  <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 500, color: '#808080', display: 'flex', alignItems: 'center', gap: 5, margin: '0 0 16px 0' }}>
                    <img src="/icons/icon-location-red.gif" alt="" width="14" height="14" style={{ flexShrink: 0, objectFit: 'contain' }} />
                    {property.address || property.location}
                  </p>

                  <p style={{ fontFamily: FONT, fontSize: 'clamp(22px, 3.2vw, 36px)', fontWeight: 900, color: '#f32735', lineHeight: 1.1, letterSpacing: '-0.5px', margin: '0 0 24px 0' }}>{property.price}</p>

                  {/* Stats grid */}
                  <div
                    ref={statsRef}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: '16px 0', borderTop: '1px solid #e8e8e8', borderBottom: '1px solid #e8e8e8' }}
                  >
                    {property.bedrooms > 0 && (
                      <div className="stat-item" style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1 }}>{property.bedrooms}</div>
                        <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: '#909090', letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 2 }}>
                          Habitación{property.bedrooms > 1 ? 'es' : ''}
                        </div>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="stat-item" style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1 }}>{property.bathrooms}</div>
                        <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: '#909090', letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 2 }}>Baños</div>
                      </div>
                    )}
                    <div className="stat-item" style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1 }}>{property.size}</div>
                      <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: '#909090', letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 2 }}>Área</div>
                    </div>
                    {property.stratum && (
                      <div className="stat-item" style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1 }}>Est. {property.stratum}</div>
                        <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: '#909090', letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 2 }}>Estrato</div>
                      </div>
                    )}
                    {property.parking && (
                      <div className="stat-item" style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1 }}>{property.parking}</div>
                        <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: '#909090', letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 2 }}>Parqueaderos</div>
                      </div>
                    )}
                    {property.garage && (
                      <div className="stat-item" style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1 }}>{property.garage}</div>
                        <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: '#909090', letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 2 }}>Garajes</div>
                      </div>
                    )}
                  </div>

                  {/* Descripción */}
                  {property.description && (
                    <ScrollReveal y={12} delay={0}>
                      <div style={{ marginTop: 24 }}>
                        <h2 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 10 }}>Descripción</h2>
                        <p style={{ fontFamily: FONT, fontSize: 14, color: '#555', lineHeight: 1.7 }}>{property.description}</p>
                      </div>
                    </ScrollReveal>
                  )}

                  {/* Detalles del inmueble */}
                  <div style={{ marginTop: 24 }}>
                    <ScrollReveal y={10}>
                      <h2 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Detalles del inmueble</h2>
                    </ScrollReveal>
                    <div ref={detailsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="detail-card flex items-center gap-3 p-3 bg-gray-50 rounded">
                        <img src="/icons/icon-home-red.gif" alt="Tipo" width="24" height="24" />
                        <div>
                          <div className="text-xs text-gray-600">Tipo de inmueble</div>
                          <div className="font-semibold text-gray-900">{property.type}</div>
                        </div>
                      </div>
                      <div className="detail-card flex items-center gap-3 p-3 bg-gray-50 rounded">
                        <img src="/icons/icon-area-gray.gif" alt="Área" width="24" height="24" />
                        <div>
                          <div className="text-xs text-gray-600">Área construida</div>
                          <div className="font-semibold text-gray-900">{property.size}</div>
                        </div>
                      </div>
                      {property.stratum && (
                        <div className="detail-card flex items-center gap-3 p-3 bg-gray-50 rounded">
                          <img src="/icons/icon-home-red.gif" alt="Estrato" width="24" height="24" />
                          <div>
                            <div className="text-xs text-gray-600">Estrato</div>
                            <div className="font-semibold text-gray-900">Est. {property.stratum}</div>
                          </div>
                        </div>
                      )}
                      {property.bedrooms > 0 && (
                        <div className="detail-card flex items-center gap-3 p-3 bg-gray-50 rounded">
                          <img src="/icons/icon-bed-gray.gif" alt="Habitaciones" width="24" height="24" />
                          <div>
                            <div className="text-xs text-gray-600">Habitaciones</div>
                            <div className="font-semibold text-gray-900">{property.bedrooms}</div>
                          </div>
                        </div>
                      )}
                      {property.bathrooms > 0 && (
                        <div className="detail-card flex items-center gap-3 p-3 bg-gray-50 rounded">
                          <img src="/icons/icon-bathroom-gray.gif" alt="Baños" width="24" height="24" />
                          <div>
                            <div className="text-xs text-gray-600">Baños</div>
                            <div className="font-semibold text-gray-900">{property.bathrooms}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mapa */}
                  {property.latitude && property.longitude && (
                    <ScrollReveal y={16} className="mt-6">
                      <h2 className="text-lg font-bold text-gray-900 mb-4">Ubicación</h2>
                      <MapComponent
                        latitude={property.latitude}
                        longitude={property.longitude}
                        title={property.title}
                        businessType={property.businessType || 'Arrendar'}
                      />
                      <p className="text-xs text-gray-500 mt-2">© OpenStreetMap contributors © CARTO</p>
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
                            className="char-pill flex items-center gap-2 px-3 py-2 bg-red-50 rounded-full border border-red-200"
                          >
                            <span className="text-red-600">✓</span>
                            <span className="text-red-600 font-medium text-sm">{char}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Investment Zone */}
                  {(() => {
                    const investmentZoneSlug = getInvestmentZoneForLocation(property.location);
                    const investmentZone = investmentZoneSlug ? getZoneBySlug(investmentZoneSlug) : null;
                    return investmentZone && property.businessType === 'Comprar' ? (
                      <ScrollReveal y={16} className="mt-6">
                        <div className="bg-gradient-to-br from-brand-red/5 to-transparent rounded-xl p-6 border-l-4 border-brand-red">
                          <h2 className="text-lg font-bold text-gray-900 mb-3">Zona de inversión</h2>
                          <p className="text-gray-600 mb-4">
                            Esta propiedad se encuentra en{' '}
                            <span className="font-semibold text-brand-red">{investmentZone.name}</span>, una zona
                            con alta demanda y potencial de rentabilidad.
                          </p>
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="text-center">
                              <p className="text-xs text-gray-600 mb-1">Rentabilidad</p>
                              <p className="font-bold text-brand-red text-lg">{investmentZone.rentability}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-600 mb-1">Precio m²</p>
                              <p className="font-bold text-gray-900 text-sm">{investmentZone.pricePerM2}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-600 mb-1">Estratos</p>
                              <p className="font-bold text-gray-900">{investmentZone.strata}</p>
                            </div>
                          </div>
                          <Link
                            href={`/inversionistas/${investmentZone.slug}`}
                            className="inline-flex items-center gap-2 h-10 px-6 bg-brand-red hover:bg-brand-red-hover text-white font-semibold rounded-lg transition-all duration-300"
                          >
                            ¿Por qué invertir en esta zona?
                          </Link>
                        </div>
                      </ScrollReveal>
                    ) : null;
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
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a1a', textAlign: 'center', margin: 0 }}>
                      ¿Te interesa esta propiedad?
                    </h3>
                    <p style={{ fontSize: '13px', color: '#555', textAlign: 'center', margin: '4px 0 0' }}>
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

                  <span style={{ textAlign: 'center', fontSize: '12px', color: '#888', display: 'block' }}>
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
                  <div style={{ borderTop: '1px solid #eee', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#888', letterSpacing: '0.05em' }}>
                      COMPARTIR PROPIEDAD
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`${property.title} - ${window?.location?.href ?? ''}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                          backgroundColor: '#e53935', color: '#fff', fontSize: '13px', fontWeight: 600,
                          padding: '9px 14px', borderRadius: 0, textDecoration: 'none', flex: 1,
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#c62828')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e53935')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L.057 23.982l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.371l-.36-.214-3.733.979 1.001-3.646-.235-.374A9.818 9.818 0 1112 21.818z"/>
                        </svg>
                        WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                          backgroundColor: '#f0f0f0', color: '#333', fontSize: '13px', fontWeight: 600,
                          padding: '9px 14px', borderRadius: 0, border: '1px solid #ddd', cursor: 'pointer',
                          flex: 1, transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                        Copiar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}