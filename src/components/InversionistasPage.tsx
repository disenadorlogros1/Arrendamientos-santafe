'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.inversionistas-title-split', 0, false);
  const [activeSector,  setActiveSector]  = useState<Sector>('Norte');
  const [hoveredSector, setHoveredSector] = useState<Sector | null>(null);
  const [expandedZone,  setExpandedZone]  = useState<string | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaBtnRef   = useRef<HTMLDivElement>(null);

  const visibleZones = getZonesBySector(activeSector);

  const handleSectorHover = (sector: Sector) => {
    setHoveredSector(sector);
    setActiveSector(sector);
  };

  const handleMapHover = (sector: Sector | null) => {
    setHoveredSector(sector);
    if (sector) setActiveSector(sector);
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
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px clamp(20px, 4vw, 52px) 0' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch', minHeight: '520px' }}>

            {/* LEFT: 4 sector cards */}
            <div style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SECTORS.map(sector => {
                const zone     = getZonesBySector(sector)[0];
                const isActive = activeSector === sector;
                const isHov    = hoveredSector === sector;
                return (
                  <button
                    key={sector}
                    onClick={() => router.push(`/inversionistas/${zone.slug}`)}
                    onMouseEnter={() => handleSectorHover(sector)}
                    onMouseLeave={() => setHoveredSector(null)}
                    style={{
                      flex:        1,
                      background:  isActive ? '#f32735' : isHov ? '#fafafa' : '#fff',
                      border:      'none',
                      padding:     '0 20px',
                      textAlign:   'left',
                      cursor:      'pointer',
                      display:     'flex',
                      alignItems:  'center',
                      justifyContent: 'space-between',
                      transition:  'background 0.18s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: '20px', color: isActive ? '#fff' : '#0d0d0d', lineHeight: 1.2 }}>
                        Zona {sector}
                      </div>
                      <div style={{ fontFamily: FONT, fontSize: '12px', fontWeight: 400, color: isActive ? 'rgba(255,255,255,0.65)' : '#999', marginTop: '4px' }}>
                        {SECTOR_SUBTITLES[sector]}
                      </div>
                    </div>
                    {/* Flecha tipo PropertyCard */}
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                      background: isActive ? 'rgba(255,255,255,0.18)' : isHov ? '#f32735' : '#f0f0f0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.18s ease',
                    }}>
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5M11.5 2.5V9"
                          stroke={isActive || isHov ? '#fff' : '#888'}
                          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT: solo mapa */}
            <div style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
              <InversionistasLeafletMap
                activeSector={activeSector}
                hoveredSector={hoveredSector}
                onSectorHover={handleMapHover}
              />
            </div>

          </div>

          {/* Sector label — mismo ancho que el bloque de 2 columnas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0 20px' }}>
            <div style={{ width: '3px', height: '24px', background: '#f32735', flexShrink: 0 }} />
            <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: '17px', color: '#111827', margin: 0 }}>
              {activeSector} del Área Metropolitana
            </h3>
          </div>
        </div>

        {/* Zone cards for active sector */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 52px) 40px' }}>
          {visibleZones.map((zone) => (
            <div key={zone.id} style={{ background: '#fff', borderTop: '2px solid #f32735' }}>

              {/* Header row */}
              <button
                onClick={() => setExpandedZone(expandedZone === zone.id ? null : zone.id)}
                style={{
                  width: '100%', padding: '22px 28px', textAlign: 'left', cursor: 'pointer',
                  background: 'transparent', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                {/* Title + metrics inline */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flex: 1, flexWrap: 'wrap' }}>
                  <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: '22px', color: '#0d0d0d', margin: 0, whiteSpace: 'nowrap' }}>
                    {zone.name}
                  </h3>

                  {/* Separator */}
                  <div style={{ width: '1px', height: '32px', background: '#e8e8e8', flexShrink: 0 }} />

                  {/* Metrics */}
                  {[
                    { label: 'Rentabilidad', value: zone.rentability, accent: true },
                    { label: 'Precio m²',    value: zone.pricePerM2  },
                    { label: 'Estratos',     value: zone.strata      },
                  ].map((m, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ fontFamily: FONT, fontSize: '9px', fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                        {m.label}
                      </span>
                      <span style={{ fontFamily: FONT, fontSize: '15px', fontWeight: 700, color: m.accent ? '#f32735' : '#0d0d0d' }}>
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Chevron */}
                <ChevronDown
                  size={20} strokeWidth={2}
                  style={{
                    color: '#f32735', flexShrink: 0,
                    transform: expandedZone === zone.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </button>

              {/* Accordion body */}
              <div style={{
                display: 'grid',
                gridTemplateRows: expandedZone === zone.id ? '1fr' : '0fr',
                opacity: expandedZone === zone.id ? 1 : 0,
                transition: 'grid-template-rows 0.3s ease, opacity 0.25s ease',
                borderTop: '1px solid #f0f0f0',
              }}>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '24px 28px', display: 'flex', gap: '48px' }}>

                    {/* Description */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 300, color: '#555', lineHeight: 1.7, margin: 0 }}>
                        {zone.description}
                      </p>
                    </div>

                    {/* Advantages */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
                        Ventajas de inversión
                      </p>
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {zone.advantages.map((adv, i) => (
                          <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <span style={{ color: '#f32735', fontSize: '8px', marginTop: '5px', flexShrink: 0 }}>■</span>
                            <span style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 300, color: '#444', lineHeight: 1.5 }}>{adv}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/inversionistas/${zone.slug}`}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          padding: '10px 20px',
                          background: '#f32735', color: '#fff',
                          fontFamily: FONT, fontSize: '13px', fontWeight: 600,
                          textDecoration: 'none', transition: 'background 0.18s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#c41e2a')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#f32735')}
                      >
                        Ver análisis completo
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                          <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5M11.5 2.5V9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          ))}
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
