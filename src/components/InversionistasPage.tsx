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
const RED  = '#f32735';

function CountMetric({ value, accent, active = false }: { value: string; accent?: boolean; active?: boolean }) {
  const [displayed, setDisplayed] = useState(value.match(/\d/)?.[0] ?? '0');
  const started = useRef(false);
  const divRef  = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = divRef.current;
    if (!el) return;
    const nums = value.match(/\d+/g) ?? [];
    const max  = parseInt(nums[nums.length - 1] ?? '0', 10);
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        let cur = 0;
        const tick = setInterval(() => {
          cur += Math.max(1, Math.ceil(max / 25));
          if (cur >= max) { setDisplayed(value); clearInterval(tick); }
          else            { setDisplayed(String(cur)); }
        }, 40);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);
  return (
    <div ref={divRef} style={{ fontSize: 40, fontWeight: 900, color: active ? (accent ? RED : '#1a1a1a') : '#ccc', lineHeight: 1, transition: 'color 0.2s ease' }}>
      {displayed}
    </div>
  );
}

const beneficios = [
  { icon: '/icons/icon-home-red.svg',        title: 'Trayectoria comprobada',    description: 'Desde 1966, con más de 2.000 inmuebles en gestión activa entre arrendamiento y venta en Antioquia.' },
  { icon: '/icons/icon-area-red.svg',         title: 'Análisis de mercado',       description: 'Acceso a estudios y reportes detallados del mercado inmobiliario por zona, estrato y tipo de inmueble.' },
  { icon: '/icons/icon-credit-card-red.svg',  title: 'Servicios integrales',      description: 'Arrendamiento, venta, avalúos e hipotecas, todo en un solo lugar con un equipo dedicado.' },
  { icon: '/icons/icon-location-red.svg',     title: 'Ubicaciones estratégicas',  description: 'Propiedades en las mejores zonas del Valle de Aburrá y municipios aledaños con alto potencial.' },
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
  const [redIdx] = useState(() => Math.floor(Math.random() * beneficios.length));
  const [hoveredZoneCard,  setHoveredZoneCard]  = useState<string | null>(null);
  const [ctaHovered,       setCtaHovered]       = useState(false);
  const subtitleRef      = useRef<HTMLParagraphElement>(null);
  const ctaBtnRef        = useRef<HTMLDivElement>(null);
  const benTrackRef      = useRef<HTMLDivElement>(null);
  const benPosRef        = useRef(0);
  const benRafRef        = useRef<number>(0);
  const benPausedRef     = useRef(false);
  const benDirectionRef  = useRef<1 | -1>(-1); // -1 = forward (left), 1 = backward (right)

  useEffect(() => {
    const track = benTrackRef.current;
    if (!track) return;
    const SPEED = 0.15;
    const step = () => {
      if (!benPausedRef.current) {
        benPosRef.current += SPEED * benDirectionRef.current;
        const card = track.firstElementChild as HTMLElement;
        const pitch = card ? card.offsetWidth + 10 : 1;
        const halfWidth = pitch * beneficios.length;
        if (benPosRef.current <= -halfWidth) benPosRef.current += halfWidth;
        if (benPosRef.current > 0)           benPosRef.current -= halfWidth;
        track.style.transform = `translateX(${benPosRef.current}px)`;
      }
      benRafRef.current = requestAnimationFrame(step);
    };
    benRafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(benRafRef.current);
  }, []);

  const benScrollBy = (dir: 'prev' | 'next') => {
    const track = benTrackRef.current;
    if (!track) return;
    // Cambiar dirección del auto-scroll y avanzar una card
    benDirectionRef.current = dir === 'prev' ? 1 : -1;
    const card = track.firstElementChild as HTMLElement;
    const pitch = card ? card.offsetWidth + 10 : window.innerWidth / 2;
    const halfWidth = pitch * beneficios.length;
    if (dir === 'prev') {
      if (benPosRef.current > -(pitch + 1)) {
        benPosRef.current -= halfWidth;
        track.style.transition = 'none';
        track.style.transform = `translateX(${benPosRef.current}px)`;
        track.getBoundingClientRect();
      }
      benPosRef.current += pitch;
    } else {
      benPosRef.current -= pitch;
    }
    track.style.transition = 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)';
    track.style.transform = `translateX(${benPosRef.current}px)`;
    setTimeout(() => {
      if (track) {
        track.style.transition = '';
        if (benPosRef.current <= -halfWidth) benPosRef.current += halfWidth;
        if (benPosRef.current > 0)           benPosRef.current -= halfWidth;
      }
    }, 360);
  };

  const visibleZones = activeSector ? getZonesBySector(activeSector) : investmentZones;

  const handleSectorHover = (sector: Sector) => {
    setHoveredSector(sector);
    setActiveSector(sector);
  };

  const handleSectorClick = (sector: Sector) => {
    setActiveSector(sector);
  };

  const handleMapHover = (sector: Sector | null) => {
    setHoveredSector(sector);
  };

  const handleZoneNavigate = (sector: Sector) => {
    router.push('/inversionistas/' + sector.toLowerCase());
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
            style={{ fontFamily: FONT, fontWeight: 300, lineHeight: '1.05', fontSize: 'clamp(28px, 4vw, 52px)' }}
            onMouseEnter={() => setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
          >
            <span style={{ display: 'block', fontWeight: 300 }}>
              Invierte con la experiencia
            </span>
            <span style={{ display: 'inline-block', fontWeight: 900, color: '#fff', marginTop: '0px', position: 'relative', overflow: 'hidden' }}>
              <span style={{ position: 'relative', zIndex: 2 }}>
                de 60 años en el mercado inmobiliario
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
              onClick={e => { e.preventDefault(); document.getElementById('zonas')?.scrollIntoView({ behavior: 'smooth' }); }}
              onMouseEnter={applyInkFill}
              onMouseLeave={applyInkFill}
              className="hero-btn-fill inline-flex items-center justify-center h-12 px-8 rounded-full"
              style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, textDecoration: 'none', cursor: 'pointer' }}
            >
              <span>Explora el mapa</span>
            </a>
          </div>
        </div>
      </section>

      {/* Investment Zones Section — 2 columnas: tarjetas + mapa */}
      <section id="zonas" style={{ background: '#f7f6f4', paddingBottom: '48px', isolation: 'isolate', position: 'relative', zIndex: 0 }}>

        {/* ── MOBILE: mapa full-width + grid 2×2 + panel de detalle ── */}
        <div className="lg:hidden">
          {/* Espacio entre hero banner y mapa */}
          <div style={{ height: '16px', background: '#f7f6f4' }} />
          {/* Mapa full width — misma altura que "ver mapa" en Propiedades */}
          <div style={{ height: '62dvh', width: '100%', overflow: 'hidden', position: 'relative' }}>
            <InversionistasLeafletMap
              activeSector={activeSector}
              hoveredSector={hoveredSector}
              onSectorHover={handleMapHover}
              onSectorClick={setActiveSector}
              onZoneNavigate={handleZoneNavigate}
            />
          </div>

          {/* Grid 2×2 de sectores */}
          <div style={{ padding: '14px 12px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' }}>
              {SECTORS.map(sector => {
                const isActive = activeSector === sector;
                const sectorZones = getZonesBySector(sector);
                return (
                  <button
                    key={sector}
                    onClick={() => setActiveSector(isActive ? null : sector)}
                    style={{
                      background: isActive ? '#fff' : '#ebebeb',
                      borderRadius: '12px',
                      padding: '11px 12px',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      boxShadow: isActive ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
                      transition: 'background 0.18s, box-shadow 0.18s',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>
                        {sector}
                      </span>
                      {isActive && (
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f32735', display: 'block', marginTop: 3, flexShrink: 0 }} />
                      )}
                    </div>
                    <span style={{ fontFamily: FONT, fontSize: '10px', color: '#999', display: 'block', marginTop: 2 }}>
                      {SECTOR_SUBTITLES[sector]}
                    </span>
                    {/* Datos de rentabilidad y estratos */}
                    {sectorZones[0] && (
                      <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                        <div>
                          <div style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 800, color: '#f32735', lineHeight: 1 }}>{sectorZones[0].rentability}</div>
                          <div style={{ fontFamily: FONT, fontSize: '9px', color: '#999', marginTop: 1 }}>Rentabilidad</div>
                        </div>
                        <div style={{ width: 1, background: '#ddd', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 800, color: '#1a1a1a', lineHeight: 1 }}>{sectorZones[0].strata}</div>
                          <div style={{ fontFamily: FONT, fontSize: '9px', color: '#999', marginTop: 1 }}>Estratos</div>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel de detalle — solo cuando hay sector activo */}
          {activeSector && (() => {
            const sectorZones = getZonesBySector(activeSector);
            const firstZone   = sectorZones[0];
            const allSubzones = sectorZones.flatMap(z => z.subzones).slice(0, 6);
            return (
              <div style={{ margin: '10px 12px 16px', background: '#ebebeb', borderRadius: '14px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontFamily: FONT, fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>Zona {activeSector}</div>
                    <div style={{ fontFamily: FONT, fontSize: '11px', color: '#999', marginTop: 2 }}>{SECTOR_SUBTITLES[activeSector]}</div>
                  </div>
                  <span style={{ background: '#f32735', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '99px', flexShrink: 0, marginLeft: 8, marginTop: 2 }}>
                    {sectorZones.length} zona{sectorZones.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginBottom: '12px' }}>
                  <div style={{ background: '#fff', borderRadius: '10px', padding: '10px 12px' }}>
                    <div style={{ fontFamily: FONT, fontSize: '22px', fontWeight: 800, color: '#f32735', lineHeight: 1 }}>{firstZone.rentability}</div>
                    <div style={{ fontFamily: FONT, fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', marginTop: 4 }}>Rentabilidad</div>
                  </div>
                  <div style={{ background: '#fff', borderRadius: '10px', padding: '10px 12px' }}>
                    <div style={{ fontFamily: FONT, fontSize: '22px', fontWeight: 800, color: '#f32735', lineHeight: 1 }}>{firstZone.strata}</div>
                    <div style={{ fontFamily: FONT, fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', marginTop: 4 }}>Estratos</div>
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontFamily: FONT, fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999', marginBottom: 6 }}>Barrios y sectores</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {allSubzones.map(b => (
                      <span key={b} style={{ background: '#fff', borderRadius: '99px', padding: '3px 9px', fontSize: '11px', fontWeight: 500, color: '#1a1a1a' }}>{b}</span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/inversionistas/${firstZone.slug}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    width: '100%', background: '#f32735', color: '#fff',
                    borderRadius: '10px', padding: '12px',
                    fontFamily: FONT, fontSize: '13px', fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Ver propiedades
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            );
          })()}
        </div>

        {/* 2-col block */}
        <div className="hidden lg:block" style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px clamp(20px, 4vw, 52px) 0' }}>
          <div style={{ display: 'flex', gap: '0', alignItems: 'stretch', minHeight: '520px' }}>

            {/* LEFT: 4 sector cards */}
            <div style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0' }}>
              {SECTORS.map(sector => {
                const zone         = getZonesBySector(sector)[0];
                const effectiveSec = hoveredSector ?? activeSector;
                const isHighlighted = effectiveSec === sector;
                return (
                  <button
                    key={sector}
                    onClick={() => router.push(`/inversionistas/${zone.slug}`)}
                    onMouseEnter={() => handleSectorHover(sector)}
                    onMouseLeave={() => setHoveredSector(null)}
                    style={{
                      flex:        1,
                      background:  isHighlighted ? '#e8e8e8' : '#fff',
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
                      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: '20px', color: '#1a1a1a', lineHeight: 1.2 }}>
                        Zona {sector}
                      </div>
                      <div style={{ fontFamily: FONT, fontSize: '12px', fontWeight: 400, color: isHighlighted ? '#555' : '#999', marginTop: '4px' }}>
                        {SECTOR_SUBTITLES[sector]}
                      </div>
                    </div>
                    {/* Flecha tipo PropertyCard */}
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                      background: isHighlighted ? '#f32735' : '#f5f5f5',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.18s ease',
                    }}>
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5M11.5 2.5V9"
                          stroke={isHighlighted ? '#fff' : '#888'}
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
                onSectorClick={setActiveSector}
                onZoneNavigate={handleZoneNavigate}
              />
            </div>

          </div>

        </div>

        {/* Zone columns grid — desktop only */}
        <div className="hidden lg:block" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 52px) 40px' }}>
          <div style={{ display: 'flex', gap: '1px', background: '#f5f5f5', overflow: 'hidden' }}>
            {visibleZones.map((zone) => {
              const isCardHov  = hoveredZoneCard === zone.id;
              const isMapHov   = hoveredSector !== null && zone.slug === hoveredSector.toLowerCase();
              const isActive   = zone.sector === activeSector;
              const isHov      = isCardHov || isMapHov || isActive;
              const anyExpanded = hoveredZoneCard !== null || hoveredSector !== null || activeSector !== null;
              return (
                <div
                  key={zone.id}
                  onMouseEnter={() => setHoveredZoneCard(zone.id)}
                  onMouseLeave={() => setHoveredZoneCard(null)}
                  style={{
                    flex: anyExpanded ? (isHov ? 1 : 0) : 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    opacity: anyExpanded && !isHov ? 0 : 1,
                    background: '#fff',
                    borderTop: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'flex 0.35s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.25s ease, background 0.2s ease',
                  }}
                >
                  {/* Nombre + métricas */}
                  <div style={{ padding: '20px 16px 16px', flexGrow: 1, minWidth: '180px' }}>
                    <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: '17px', color: '#1a1a1a', margin: '0 0 14px 0', lineHeight: 1.25, textAlign: 'center', whiteSpace: 'nowrap' }}>
                      {zone.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '0', alignItems: 'flex-start' }}>
                      {[
                        { label: 'Rentabilidad', value: zone.rentability, accent: true },
                        { label: 'Estratos',     value: zone.strata      },
                      ].map((m, i) => (
                        <div key={i} style={{ flex: 1, padding: '8px 0', textAlign: 'center' }}>
                          <div style={{ fontFamily: FONT, fontSize: '12px', fontWeight: 300, color: 'rgba(0,0,0,0.55)', marginBottom: '6px', whiteSpace: 'nowrap' }}>
                            {m.label}
                          </div>
                          <CountMetric value={m.value} accent={m.accent} active={isHov || zone.sector === activeSector} />
                        </div>
                      ))}
                      {/* Tercera columna: barrios y municipios — solo visible cuando la tarjeta está expandida */}
                      {isHov && (
                        <div style={{
                          flex: 1.4, padding: '8px 0 8px 14px', borderLeft: '1px solid #f0f0f0',
                          overflow: 'hidden', minWidth: 0,
                        }}>
                          <div style={{ fontFamily: FONT, fontSize: '12px', fontWeight: 700, color: 'rgba(0,0,0,0.55)', marginBottom: '4px' }}>
                            Barrios y sectores
                          </div>
                          <div style={{ fontFamily: FONT, fontSize: '11px', color: '#555', lineHeight: 1.1 }}>
                            {zone.subzones.join(' · ')}
                            {zone.subzones.length > 4 && (
                              <> · <Link href={`/inversionistas/${zone.slug}`} style={{ fontFamily: FONT, fontSize: '11px', color: '#555', fontWeight: 700, textDecoration: 'none' }}>+ ver todos</Link></>
                            )}
                          </div>
                          <div style={{ fontFamily: FONT, fontSize: '12px', fontWeight: 700, color: 'rgba(0,0,0,0.55)', margin: '8px 0 4px' }}>
                            Municipios
                          </div>
                          <div style={{ fontFamily: FONT, fontSize: '11px', color: '#555', lineHeight: 1.1 }}>
                            {zone.municipiosNames.join(' · ')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA edge-to-edge */}
                  <Link
                    href={`/inversionistas/${zone.slug}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '11px 16px', background: RED, color: '#fff',
                      fontFamily: FONT, fontSize: '13px', fontWeight: 600,
                      textDecoration: 'none', transition: 'background 0.18s', flexShrink: 0,
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#aa182c')}
                    onMouseLeave={e => (e.currentTarget.style.background = RED)}
                  >
                    Ver más
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ background: '#fff' }} className="w-full">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '28px clamp(20px, 4vw, 52px)', textAlign: 'center' }}>
          <h2 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 'clamp(26px, 2.6vw, 46px)', color: '#555', lineHeight: 1.1, margin: 0 }}>
            ¿Por qué <span style={{ fontWeight: 700 }}>invertir</span>
            <br />
            <span style={{ fontWeight: 700 }}>con nosotros?</span>
          </h2>
        </div>

        {/* ── CARRUSEL mobile/tablet ── */}
        <style>{`
          .beneficio-card {
            width: calc(50vw - 10px);
            flex-shrink: 0;
            margin-right: 10px;
          }
          @media (min-width: 640px) {
            .beneficio-card { width: calc(33.333vw - 10px); }
          }
        `}</style>

        <div className="lg:hidden" style={{ paddingBottom: '24px' }}>
          <div
            className="relative overflow-hidden"
            onMouseEnter={() => { benPausedRef.current = true; }}
            onMouseLeave={() => { benPausedRef.current = false; }}
          >
            {/* Flecha izquierda */}
            <button
              onClick={() => benScrollBy('prev')}
              aria-label="Anterior"
              style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 10,
                width: 44,
                background: 'linear-gradient(to right, rgba(255,255,255,1) 45%, transparent)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Track */}
            <div ref={benTrackRef} className="flex" style={{ width: 'max-content' }}>
              {[...beneficios, ...beneficios].map((b, idx) => (
                <a
                  key={idx}
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="beneficio-card"
                  style={{
                    background: '#f5f5f5',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '10px',
                    padding: '20px 12px 16px',
                    textDecoration: 'none',
                  }}
                >
                  <img src={b.icon} alt="" width={36} height={36} />
                  <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: '14px', color: '#1a1a1a', lineHeight: 1.2 }}>
                    {b.title}
                  </span>
                  <span style={{ fontFamily: FONT, fontWeight: 300, fontSize: '11px', color: 'rgba(0,0,0,0.55)', lineHeight: 1.45, flexGrow: 1 }}>
                    {b.description}
                  </span>
                  <span style={{
                    fontFamily: FONT, fontWeight: 500, fontSize: '12px',
                    color: '#fff', background: '#1a1a1a', borderRadius: '99px',
                    padding: '6px 10px', lineHeight: 1.3,
                  }}>
                    Hablar con un asesor
                  </span>
                </a>
              ))}
            </div>

            {/* Flecha derecha */}
            <button
              onClick={() => benScrollBy('next')}
              aria-label="Siguiente"
              style={{
                position: 'absolute', right: 0, top: 0, bottom: 0, zIndex: 10,
                width: 44,
                background: 'linear-gradient(to left, rgba(255,255,255,1) 45%, transparent)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── DESKTOP (lg+): grid ── */}
        <div className="hidden lg:block" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 52px) 52px' }}>
          <div className="grid lg:grid-cols-4" style={{ gap: '0', overflow: 'visible' }}>
            {beneficios.map((b, idx) => {
              const isRed = idx === redIdx;
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
                  <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 'clamp(16px, 1.2vw, 20px)', color: isRed ? '#fff' : '#1a1a1a', margin: 0, lineHeight: 1.15 }}>
                    {b.title}
                  </h3>
                  <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 'clamp(12.5px, 0.9vw, 14px)', color: isRed ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.55)', margin: 0, lineHeight: 1.5, flexGrow: 1 }}>
                    {b.description}
                  </p>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={isRed ? undefined : applyInkFill}
                    onMouseLeave={isRed ? undefined : applyInkFill}
                    className={`${isRed ? '' : 'cta-btn-outline-red'} inline-flex items-center justify-center`}
                    style={{
                      fontFamily: FONT, fontWeight: 300, fontSize: 'clamp(13px, 0.95vw, 15px)',
                      textDecoration: 'none', height: '44px',
                      marginLeft: '-20px', marginRight: '-20px', marginBottom: '-20px',
                      background: isRed ? '#f32735' : '#ffffff',
                      color: isRed ? '#ffffff' : undefined,
                      borderRadius: 0,
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
      <section className="py-16 md:py-20" style={{ background: '#f7f6f4' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal y={20}>
            <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ fontFamily: FONT, color: '#555' }}>
              ¿Listo para invertir?
            </h2>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                height: 48, padding: '0 32px',
                background: ctaHovered ? RED : '#f7f6f4',
                color: ctaHovered ? '#fff' : RED,
                border: `1.5px solid ${RED}`,
                borderRadius: 999,
                fontFamily: FONT, fontWeight: 600, fontSize: 14,
                textDecoration: 'none', cursor: 'pointer',
                transition: 'background 0.22s ease, color 0.22s ease',
              }}
            >
              <span>Solicitar asesoría</span>
              <img
                src={ctaHovered ? '/icons/icon-whatsapp-white.svg' : '/icons/icon-whatsapp-red.svg'}
                alt="WhatsApp" width={20} height={20}
              />
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
