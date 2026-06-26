'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { TrendingUp, BarChart3, DollarSign, MapPin, ChevronDown, ArrowRight } from 'lucide-react';
import { SECTORS, getZonesBySector, type Sector } from '@/data/investment-zones';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import ScrollReveal from '@/components/ScrollReveal';
import InversionistasLeafletMap from '@/components/InversionistasLeafletMap';

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";

const beneficios = [
  { icon: TrendingUp, title: 'Rentabilidad comprobada', description: '60 años de experiencia generando retornos consistentes para nuestros inversionistas' },
  { icon: BarChart3, title: 'Análisis de mercado', description: 'Acceso a estudios y reportes detallados del mercado inmobiliario en Antioquia' },
  { icon: DollarSign, title: 'Múltiples opciones', description: 'Desde arrendamiento hasta proyectos de desarrollo inmobiliario' },
  { icon: MapPin, title: 'Ubicaciones estratégicas', description: 'Propiedades en las mejores zonas de Medellín y área metropolitana' },
];

const SECTOR_COLORS: Record<Sector, { bg: string; border: string; text: string }> = {
  Norte:     { bg: 'rgba(59,130,246,0.08)',   border: 'rgba(59,130,246,0.25)',   text: '#3b82f6' },
  Sur:       { bg: 'rgba(16,185,129,0.08)',   border: 'rgba(16,185,129,0.25)',   text: '#10b981' },
  Oriente:   { bg: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.25)',   text: '#f59e0b' },
  Occidente: { bg: 'rgba(168,85,247,0.08)',   border: 'rgba(168,85,247,0.25)',   text: '#a855f7' },
};

const SECTOR_SUBTITLES: Record<Sector, string> = {
  Norte:     'Norte de Antioquia',
  Sur:       'Sur de Antioquia',
  Oriente:   'Oriente antioqueño',
  Occidente: 'Occidente de Medellín',
};


const WHATSAPP_URL = 'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consultar%20oportunidades%20de%20inversión%20inmobiliaria.';

export default function InversionistasPage() {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.inversionistas-title-split', 0, false);
  const [activeSector, setActiveSector] = useState<Sector>('Norte');
  const [hoveredSector, setHoveredSector] = useState<Sector | null>(null);
  const [expandedZone,  setExpandedZone]  = useState<string | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaBtnRef   = useRef<HTMLDivElement>(null);

  const visibleZones = getZonesBySector(activeSector);

  /* Reset expanded zone when switching sector */
  const handleSectorChange = (sector: Sector) => {
    setActiveSector(sector);
    setExpandedZone(null);
  };

  useEffect(() => {
    if (!titleAnimating) return;
    if (subtitleRef.current) {
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
    if (ctaBtnRef.current) {
      gsap.fromTo(ctaBtnRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.1, ease: 'power2.out' }
      );
    }
  }, [titleAnimating]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[550px] md:h-[720px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800" style={{ marginTop: '-86px' }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/banner_inversionistas.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl" ref={titleRef}>
          <h1
            className="inversionistas-title-split text-3xl sm:text-4xl lg:text-5xl leading-tight text-white text-center"
            style={{ fontFamily: FONT, fontWeight: 300, lineHeight: '1.2' }}
          >
            Inversión inmobiliaria en Medellín y el Valle de{' '}
            <span className="text-brand-red inline-block" style={{ fontWeight: 700 }}>
              Aburrá
            </span>
          </h1>

          <p
            ref={subtitleRef}
            className="mt-5 text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed text-center"
            style={{ fontFamily: FONT, fontWeight: 300, lineHeight: '1.45', opacity: 0 }}
          >
            Conoce las zonas con mayor potencial de valorización y rentabilidad inmobiliaria en Antioquia.
          </p>

          <div ref={ctaBtnRef} className="mt-8 text-center" style={{ opacity: 0 }}>
            <a
              href="#zonas"
              className="inline-flex items-center gap-2 h-12 px-8 bg-brand-red hover:bg-white hover:text-brand-red text-white font-semibold rounded-none transition-all duration-300 transform hover:scale-105"
            >
              Ver zonas estratégicas
            </a>
          </div>
        </div>
      </section>

      {/* Investment Zones Section — 2 columnas: tarjetas + mapa */}
      <section id="zonas" style={{ background: '#f7f6f4', paddingBottom: '48px' }}>

        {/* 2-col block */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px clamp(20px, 4vw, 52px) 32px' }}>
          <div style={{ display: 'flex', gap: '0px', alignItems: 'stretch', minHeight: '520px' }}>

            {/* LEFT: 4 sector cards */}
            <div style={{ width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#fff' }}>
              {SECTORS.map(sector => {
                const zone     = getZonesBySector(sector)[0];
                const isActive = activeSector === sector;
                const isHov    = hoveredSector === sector;
                const showData = isHov || isActive;
                return (
                  <div key={sector} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    {/* Card header */}
                    <button
                      onClick={() => handleSectorChange(sector)}
                      onMouseEnter={() => setHoveredSector(sector)}
                      onMouseLeave={() => setHoveredSector(null)}
                      style={{
                        width:      '100%',
                        background: isActive ? '#f32735' : 'transparent',
                        border:     'none',
                        padding:    '20px 22px',
                        textAlign:  'left',
                        cursor:     'pointer',
                        display:    'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.18s ease',
                      }}
                    >
                      <div>
                        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: '20px', color: isActive ? '#fff' : '#0d0d0d', lineHeight: 1.2 }}>
                          Zona {sector}
                        </div>
                        <div style={{ fontFamily: FONT, fontSize: '12px', fontWeight: 400, color: isActive ? 'rgba(255,255,255,0.7)' : '#999', marginTop: '3px' }}>
                          {SECTOR_SUBTITLES[sector]}
                        </div>
                      </div>
                      {/* Flecha tipo PropertyCard */}
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: isActive ? 'rgba(255,255,255,0.2)' : isHov ? '#f32735' : '#f0f0f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'background 0.18s ease',
                      }}>
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                          <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5M11.5 2.5V9" stroke={isActive || isHov ? '#fff' : '#888'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </button>

                    {/* Data panel — se despliega en hover/active */}
                    <div
                      onMouseEnter={() => setHoveredSector(sector)}
                      onMouseLeave={() => setHoveredSector(null)}
                      style={{
                        overflow:   'hidden',
                        maxHeight:  showData ? '260px' : '0',
                        opacity:    showData ? 1 : 0,
                        transition: 'max-height 0.3s ease, opacity 0.25s ease',
                        background: isActive ? '#d91f2d' : '#fafafa',
                        borderTop:  showData ? `1px solid ${isActive ? 'rgba(255,255,255,0.12)' : '#ebebeb'}` : 'none',
                      }}
                    >
                      <div style={{ padding: '14px 22px 18px' }}>
                        {/* Métricas */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                          {[
                            { label: 'Rentabilidad', value: zone.rentability },
                            { label: 'Precio m²',    value: zone.pricePerM2, small: true },
                            { label: 'Estratos',     value: zone.strata },
                          ].map(m => (
                            <div key={m.label} style={{
                              flex: 1, padding: '7px 8px',
                              background: isActive ? 'rgba(255,255,255,0.12)' : '#fff',
                              border: `1px solid ${isActive ? 'rgba(255,255,255,0.2)' : '#e8e8e8'}`,
                            }}>
                              <div style={{ fontFamily: FONT, fontSize: '9px', fontWeight: 500, color: isActive ? 'rgba(255,255,255,0.6)' : '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>{m.label}</div>
                              <div style={{ fontFamily: FONT, fontSize: m.small ? '10px' : '13px', fontWeight: 700, color: isActive ? '#fff' : '#0d0d0d', lineHeight: 1.2 }}>{m.value}</div>
                            </div>
                          ))}
                        </div>
                        {/* 2 ventajas */}
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px 0' }}>
                          {zone.advantages.slice(0, 2).map((adv, i) => (
                            <li key={i} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start', marginBottom: '5px' }}>
                              <span style={{ color: isActive ? 'rgba(255,255,255,0.5)' : '#f32735', fontSize: '8px', marginTop: '4px', flexShrink: 0 }}>■</span>
                              <span style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 300, color: isActive ? 'rgba(255,255,255,0.85)' : '#555', lineHeight: 1.4 }}>{adv}</span>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={`/inversionistas/${zone.slug}`}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            fontFamily: FONT, fontSize: '11px', fontWeight: 600,
                            color: isActive ? '#fff' : '#f32735',
                            textDecoration: 'none',
                          }}
                        >
                          Ver análisis completo
                          <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5M11.5 2.5V9" stroke={isActive ? '#fff' : '#f32735'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT: Leaflet map */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <InversionistasLeafletMap
                activeSector={activeSector}
                hoveredSector={hoveredSector}
              />
            </div>

          </div>
        </div>

        {/* Zone cards for active sector */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 52px)' }}>

          {/* Sector label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: 3, height: 22, borderRadius: 2, background: SECTOR_COLORS[activeSector].text }} />
            <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 17, color: '#111827', margin: 0 }}>
              {activeSector} del Área Metropolitana
            </h3>
            <span style={{
              fontFamily: FONT, fontSize: 12, fontWeight: 400,
              color: SECTOR_COLORS[activeSector].text,
              background: SECTOR_COLORS[activeSector].bg,
              border: `1px solid ${SECTOR_COLORS[activeSector].border}`,
              borderRadius: 20, padding: '2px 10px',
            }}>
              {visibleZones.length} zona{visibleZones.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Zone Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleZones.map((zone, index) => (
              <ScrollReveal key={zone.id} delay={index * 0.08} y={16}>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <button
                    onClick={() => setExpandedZone(expandedZone === zone.id ? null : zone.id)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span style={{
                          fontFamily: FONT, fontSize: 11, fontWeight: 700,
                          color: SECTOR_COLORS[zone.sector].text, background: SECTOR_COLORS[zone.sector].bg,
                          border: `1px solid ${SECTOR_COLORS[zone.sector].border}`, borderRadius: 20, padding: '2px 9px',
                        }}>
                          {zone.sector}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: FONT }}>{zone.name}</h3>
                      </div>
                      <ChevronDown
                        className="w-6 h-6 flex-shrink-0"
                        strokeWidth={expandedZone === zone.id ? 2.5 : 1.8}
                        style={{
                          color: SECTOR_COLORS[zone.sector].text,
                          transform: expandedZone === zone.id ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease',
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div style={{ background: SECTOR_COLORS[zone.sector].bg }} className="p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: FONT }}>Rentabilidad</p>
                        <p className="text-lg font-bold" style={{ color: SECTOR_COLORS[zone.sector].text, fontFamily: FONT }}>{zone.rentability}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: FONT }}>Precio m²</p>
                        <p className="text-sm font-bold text-gray-900" style={{ fontFamily: FONT }}>{zone.pricePerM2}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1" style={{ fontFamily: FONT }}>Estratos</p>
                        <p className="text-lg font-bold text-gray-900" style={{ fontFamily: FONT }}>{zone.strata}</p>
                      </div>
                    </div>
                  </button>
                  {/* Accordion detail */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateRows: expandedZone === zone.id ? '1fr' : '0fr',
                      opacity: expandedZone === zone.id ? 1 : 0,
                      transition: 'grid-template-rows 0.3s ease, opacity 0.3s ease',
                    }}
                    className="border-t border-gray-200"
                  >
                    <div style={{ overflow: 'hidden' }}>
                      <div className="p-6 space-y-4">
                        <p className="text-gray-600 leading-relaxed" style={{ fontFamily: FONT, fontWeight: 300 }}>{zone.description}</p>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3" style={{ fontFamily: FONT }}>Ventajas de inversión:</h4>
                          <ul className="space-y-2">
                            {zone.advantages.map((advantage, i) => (
                              <li key={i} className="flex items-start gap-2 text-gray-700">
                                <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: SECTOR_COLORS[zone.sector].text }} />
                                <span className="text-sm" style={{ fontFamily: FONT, fontWeight: 300 }}>{advantage}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Link
                          href={`/inversionistas/${zone.slug}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            marginTop: 8,
                            padding: '10px 20px',
                            background: '#1a1a1a',
                            color: '#fff',
                            borderRadius: 0,
                            fontFamily: FONT,
                            fontSize: 13,
                            fontWeight: 500,
                            textDecoration: 'none',
                            transition: 'background 0.18s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = SECTOR_COLORS[zone.sector].text)}
                          onMouseLeave={e => (e.currentTarget.style.background = '#1a1a1a')}
                        >
                          Ver análisis completo de {zone.name}
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal y={20} className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl text-gray-900 mb-4"
              style={{ fontFamily: FONT, fontWeight: 700 }}
            >
              ¿Por qué invertir con nosotros?
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {beneficios.map((beneficio, i) => (
              <ScrollReveal key={beneficio.title} delay={i * 0.1} y={20}>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="w-12 h-12 bg-brand-red/10 rounded-lg flex items-center justify-center mb-4">
                    <beneficio.icon className="w-6 h-6 text-brand-red" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: FONT }}>{beneficio.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: FONT, fontWeight: 300 }}>{beneficio.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-brand-red">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal y={20}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8" style={{ fontFamily: FONT }}>
              ¿Listo para comenzar tu inversión?
            </h2>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-12 px-8 bg-white text-brand-red font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              style={{ fontFamily: FONT }}
            >
              <span>Solicitar asesoría</span>
              <img src="/icons/icon-whatsapp-red.gif" alt="WhatsApp" className="w-5 h-5" />
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
