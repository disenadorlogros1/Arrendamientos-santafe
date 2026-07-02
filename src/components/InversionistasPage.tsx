'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { SECTORS, getZonesBySector, investmentZones, type Sector } from '@/data/investment-zones';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import ScrollReveal from '@/components/ScrollReveal';

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
import InversionistasLeafletMap from '@/components/InversionistasLeafletMap';

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";

const beneficios = [
  { icon: '/icons/icon-home-red.gif',        title: 'Trayectoria comprobada',    description: 'Desde 1966, con más de 2.000 inmuebles en gestión activa entre arrendamiento y venta en Antioquia.' },
  { icon: '/icons/icon-area-red.gif',         title: 'Análisis de mercado',       description: 'Acceso a estudios y reportes detallados del mercado inmobiliario por zona, estrato y tipo de inmueble.' },
  { icon: '/icons/icon-credit-card-red.gif',  title: 'Servicios integrales',      description: 'Arrendamiento, venta, avalúos e hipotecas, todo en un solo lugar con un equipo dedicado.' },
  { icon: '/icons/icon-location-red.gif',     title: 'Ubicaciones estratégicas',  description: 'Propiedades en las mejores zonas del Valle de Aburrá y municipios aledaños con alto potencial.' },
];

const SECTOR_COLORS: Record<Sector, { bg: string; border: string; text: string }> = {
  Norte:     { bg: 'rgba(59,130,246,0.08)',   border: 'rgba(59,130,246,0.25)',   text: '#3b82f6' },
  Sur:       { bg: 'rgba(16,185,129,0.08)',   border: 'rgba(16,185,129,0.25)',   text: '#10b981' },
  Oriente:   { bg: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.25)',   text: '#f59e0b' },
  Occidente: { bg: 'rgba(168,85,247,0.08)',   border: 'rgba(168,85,247,0.25)',   text: '#a855f7' },
};

const SECTOR_SUBTITLES: Record<Sector, string> = {
  Norte:     'Norte del Valle de Aburrá',
  Sur:       'Sur del Valle de Aburrá',
  Oriente:   'Oriente del Valle de Aburrá',
  Occidente: 'Occidente del Valle de Aburrá',
};


const WHATSAPP_URL = 'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consultar%20oportunidades%20de%20inversión%20inmobiliaria.';

export default function InversionistasPage() {
  const router = useRouter();
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.inversionistas-title-split', 0, false);
  const [activeSector,  setActiveSector]  = useState<Sector | null>(null);
  const [hoveredSector, setHoveredSector] = useState<Sector | null>(null);
  const [titleHovered,     setTitleHovered]     = useState(false);
  const [hoveredBeneficio, setHoveredBeneficio] = useState<number | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaBtnRef   = useRef<HTMLDivElement>(null);

  const visibleZones = activeSector ? getZonesBySector(activeSector) : investmentZones;

  const handleSectorHover = (sector: Sector) => {
    setHoveredSector(sector);
    setActiveSector(sector);
  };

  const handleMapHover = (sector: Sector | null) => {
    setHoveredSector(sector);
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
            className="inversionistas-title-split leading-tight text-white text-center"
            style={{ fontFamily: FONT, fontWeight: 300, lineHeight: '1.0', fontSize: 'clamp(28px, 4vw, 52px)' }}
            onMouseEnter={() => setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
          >
            <span style={{ display: 'block', fontWeight: 300 }}>
              Invierte con la experiencia de
            </span>
            <span style={{ display: 'inline-block', fontWeight: 900, color: '#fff', marginTop: '0px', position: 'relative', overflow: 'hidden' }}>
              <span style={{ position: 'relative', zIndex: 2 }}>
                60 años en el mercado inmobiliario
              </span>
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '62%',
                  left: 0,
                  width: '100%',
                  height: '13%',
                  backgroundColor: '#f32735',
                  transform: `translateY(-50%) scaleX(${titleHovered ? 1 : 0})`,
                  transformOrigin: 'left center',
                  zIndex: 1,
                  transition: 'transform 0.234s ease',
                  pointerEvents: 'none',
                }}
              />
            </span>
          </h1>

          <p
            ref={subtitleRef}
            className="mt-5 text-base sm:text-lg text-white/80 max-w-2xl mx-auto text-center"
            style={{ fontFamily: FONT, fontWeight: 300, lineHeight: '1.5', opacity: 0 }}
          >
            Identifica las zonas del Valle de Aburrá y municipios aledaños con<br />
            <span style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 400 }}>mayor potencial de valorización</span>
          </p>

          <div ref={ctaBtnRef} className="mt-8 text-center" style={{ opacity: 0 }}>
            <a
              href="#zonas"
              className="inline-flex items-center h-12 px-8 bg-brand-red hover:bg-white hover:text-brand-red text-white font-semibold rounded-none transition-all duration-300"
              style={{ fontFamily: FONT }}
            >
              Explora el mapa de zonas
            </a>
          </div>
        </div>
      </section>

      {/* Investment Zones Section — 2 columnas: tarjetas + mapa */}
      <section id="zonas" style={{ background: '#f7f6f4', paddingBottom: '48px', isolation: 'isolate', position: 'relative', zIndex: 0 }}>

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

        </div>

        {/* Zone columns grid */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 52px) 40px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${visibleZones.length}, 1fr)`,
            gap: '1px',
            background: '#e0e0e0',
          }}>
            {visibleZones.map((zone) => (
              <div key={zone.id} style={{ background: '#fff', borderTop: '3px solid #f32735', padding: '20px 16px 0', display: 'flex', flexDirection: 'column' }}>

                {/* Nombre zona */}
                <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: '17px', color: '#0d0d0d', margin: '0 0 12px 0', lineHeight: 1.25, textAlign: 'center' }}>
                  {zone.name}
                </h3>

                {/* Métricas en fila */}
                <div style={{ display: 'flex', gap: '0', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', flex: 1 }}>
                  {[
                    { label: 'Rentabilidad', value: zone.rentability, accent: true },
                    { label: 'Estratos',     value: zone.strata      },
                  ].map((m, i) => (
                    <div key={i} style={{ flex: 1, padding: '8px 0', textAlign: 'center' }}>
                      <div style={{ fontFamily: FONT, fontSize: '9px', fontWeight: 600, color: '#aaa', letterSpacing: '0.4px', marginBottom: '2px' }}>
                        {m.label}
                      </div>
                      <div style={{ fontFamily: FONT, fontSize: '15px', fontWeight: 700, color: m.accent ? '#f32735' : '#0d0d0d' }}>
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA full width */}
                <Link
                  href={`/inversionistas/${zone.slug}`}
                  style={{
                    marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '11px 16px', background: '#f32735', color: '#fff',
                    fontFamily: FONT, fontSize: '13px', fontWeight: 600,
                    textDecoration: 'none', transition: 'background 0.18s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#c41e2a')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#f32735')}
                >
                  Ver más
                </Link>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section — mismo estilo que ServiciosBlock del home */}
      <section style={{ background: '#fff' }} className="w-full">
        <div className="px-6 sm:px-10 lg:px-14" style={{ paddingTop: '28px', paddingBottom: '28px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 'clamp(26px, 2.6vw, 46px)', color: '#555', lineHeight: 1.2, margin: 0 }}>
            ¿Por qué <span style={{ fontWeight: 700 }}>invertir con nosotros?</span>
          </h2>
        </div>
        <div className="px-6 sm:px-10 lg:px-14" style={{ paddingBottom: '52px', overflow: 'visible' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '0', overflow: 'visible' }}>
            {beneficios.map((b, idx) => {
              const isRed = idx === 0;
              const isHov = hoveredBeneficio === idx;
              const isAdj = hoveredBeneficio !== null && Math.abs(idx - hoveredBeneficio) === 1;
              return (
                <div
                  key={b.title}
                  className="flex flex-col"
                  style={{
                    gap: '14px', padding: '24px 20px 20px',
                    background: isRed ? '#f32735' : '#fff',
                    cursor: 'default',
                    transform: isHov ? 'scale(1.08)' : isAdj ? 'scale(0.96)' : 'scale(1)',
                    zIndex: isHov ? 10 : 1, position: 'relative',
                    transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease',
                    boxShadow: isHov ? '0 8px 32px rgba(0,0,0,0.18)' : 'none',
                  }}
                  onMouseEnter={() => setHoveredBeneficio(idx)}
                  onMouseLeave={() => setHoveredBeneficio(null)}
                >
                  <img src={b.icon} alt="" width={40} height={40} style={{ flexShrink: 0, display: 'block', filter: isRed ? 'brightness(0) invert(1)' : 'none' }} />
                  <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 'clamp(16px, 1.2vw, 20px)', color: isRed ? '#fff' : '#232222', margin: 0, lineHeight: 1.15 }}>
                    {b.title}
                  </h3>
                  <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 'clamp(12.5px, 0.9vw, 14px)', color: isRed ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.55)', margin: 0, lineHeight: 1.5, flexGrow: 1 }}>
                    {b.description}
                  </p>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={applyInkFill}
                    onMouseLeave={applyInkFill}
                    className="hero-btn-fill inline-flex items-center justify-center rounded-full"
                    style={{
                      fontFamily: FONT, fontWeight: 300, fontSize: 'clamp(13px, 0.95vw, 15px)',
                      textDecoration: 'none', height: '42px', paddingLeft: '20px', paddingRight: '20px',
                      alignSelf: 'flex-start',
                      background: isRed ? '#f32735' : '#232222',
                      border: isRed ? '1px solid rgba(255,255,255,0.7)' : 'none',
                    }}
                  >
                    <span>Hablar con un asesor</span>
                  </a>
                </div>
              );
            })}
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
