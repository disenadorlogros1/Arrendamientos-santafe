'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import ScrollReveal from '@/components/ScrollReveal';
import { investmentZones, getZoneBySlug } from '@/data/investment-zones';
import { properties } from '@/data/properties';
import type { PageType } from '@/components/Header';
import { navigate } from '@/lib/navigate';
import NeighborhoodMap from '@/components/NeighborhoodMap';

const FONT  = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED   = '#f32735';
const DARK  = '#fff';
const DARK2 = '#f7f6f4';
const DARK3 = '#f5f5f5';
const WHATSAPP_URL = 'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consultar%20oportunidades%20de%20inversión%20inmobiliaria.';

function applyInkFill(e: React.MouseEvent<HTMLElement>) {
  const el   = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x    = e.clientX - rect.left;
  const y    = e.clientY - rect.top;
  const size = Math.max(
    Math.hypot(x, y), Math.hypot(rect.width - x, y),
    Math.hypot(x, rect.height - y), Math.hypot(rect.width - x, rect.height - y),
  ) * 2;
  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position:absolute; border-radius:50%; pointer-events:none;
    width:${size}px; height:${size}px;
    left:${x}px; top:${y}px;
    transform:translate(-50%,-50%) scale(0);
    background:rgba(255,255,255,0.2);
    animation:zone-ink 0.6s ease-out forwards;
  `;
  el.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);
}

const ZONE_INK_CSS = `
  @keyframes zone-ink {
    from { opacity:1; transform:translate(-50%,-50%) scale(0); }
    to   { opacity:0; transform:translate(-50%,-50%) scale(1); }
  }
  .zone-btn { position:relative; overflow:hidden; }
`;

/* ── Animated stat value — cuenta desde 0 al entrar en viewport ── */
function AnimatedStatValue({ value, style }: { value: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value);
  const startedRef = useRef(false);

  const animate = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    let startTime: number | null = null;
    const duration = 1600;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      if (p >= 1) { setDisplay(value); return; }
      const animated = value.replace(/\d[\d,]*/g, match => {
        const num = parseInt(match.replace(/,/g, ''), 10);
        const cur = Math.floor(num * eased);
        return match.includes(',') ? cur.toLocaleString('en-US') : String(cur);
      });
      setDisplay(animated);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) animate(); },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [animate]);

  return <div ref={ref} style={style}>{display}</div>;
}

const STATS_META = [
  { key: 'rentability' as const, label: 'Rentabilidad anual',  icon: '/icons/icon-rent-white.gif' },
  { key: 'pricePerM2'  as const, label: 'Precio por m²',       icon: '/icons/icon-price-white.gif' },
  { key: 'strata'      as const, label: 'Estratos',             icon: '/icons/icon-location-white.gif' },
];

export default function InversionZonePage() {
  const params = useParams();
  const slug   = params.slug as string;
  const [currentPage, setCurrentPage] = useState<PageType>('inversionistas');
  const [ctaHovered, setCtaHovered]   = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const zone = getZoneBySlug(slug);

  const relatedProperties = useMemo(() => {
    if (!zone) return [];
    return properties.filter(
      (p) => p.investmentZone === zone.slug && p.businessType === 'Comprar'
    );
  }, [zone]);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.style.opacity   = '0';
    el.style.transform = 'translateY(18px)';
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        el.style.opacity    = '1';
        el.style.transform  = 'translateY(0)';
      })
    );
  }, []);

  const handleNavigate = (page: PageType, filter?: string) => navigate(page, filter);

  if (!zone) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
        <Header currentPage={currentPage} onNavigate={handleNavigate} isHeroPage={false} darkHeader />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 120 }}>
          <div style={{ textAlign: 'center', fontFamily: FONT }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', marginBottom: 16 }}>Zona no encontrada</h1>
            <Link href="/inversionistas" style={{ color: RED, textDecoration: 'none', fontSize: 14 }}>
              ← Volver a zonas de inversión
            </Link>
          </div>
        </main>
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  const otherZones = investmentZones.filter((z) => z.id !== zone.id);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff', fontFamily: FONT }}>
      <style>{ZONE_INK_CSS}</style>
      <Header currentPage={currentPage} onNavigate={handleNavigate} isHeroPage={false} darkHeader />

      <main style={{ flex: 1 }}>

        {/* ── Hero ──────────────────────────────────────────── */}
        <section style={{ position: 'relative', overflow: 'hidden', background: '#1a1a1a', paddingTop: 120, paddingBottom: 64 }}>
          {/* Imagen de fondo con opacidad baja */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/images/banner_inversionistas.png)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.18,
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
            <div ref={heroRef}>
              {/* Badge de sector */}
              <div style={{ display: 'inline-block', padding: '4px 12px', background: RED, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 12 }}>
                {zone.sector}
              </div>

              <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, color: '#fff', lineHeight: 1.05, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
                Invertir en{' '}
                <span style={{ fontWeight: 700 }}>{zone.h1Title.replace('Invertir en ', '')}</span>
              </h1>
              <p style={{ fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, margin: 0 }}>
                {zone.description}
              </p>
            </div>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────── */}
        <section style={{ background: '#1a1a1a', padding: '0', borderBottom: '1px solid #1e1e1e' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 2 }}>
              {STATS_META.map((meta) => (
                <div key={meta.key} style={{ background: '#161616', padding: '32px 28px 28px', boxSizing: 'border-box' as const }}>
                  <div style={{ fontSize: 10, fontWeight: 400, letterSpacing: '0.04em', color: RED, marginBottom: 10 }}>
                    {meta.label}
                  </div>
                  <AnimatedStatValue
                    value={zone[meta.key]}
                    style={{ fontSize: 39, fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.02em' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Ventajas ──────────────────────────────────────── */}
        <section style={{ background: '#fff', padding: '72px 0', borderBottom: '1px solid #f5f5f5' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
            <ScrollReveal y={16}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 900, color: '#1a1a1a', margin: 0, letterSpacing: '-0.01em' }}>
                  <span style={{ fontWeight: 300, color: '#888' }}>Ventajas del </span><span style={{ color: '#888' }}>{zone.name}</span>
                </h2>
              </div>
            </ScrollReveal>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
              {zone.advantages.map((adv, i) => (
                <ScrollReveal key={i} delay={i * 0.07} y={14}>
                  <div style={{ background: DARK3, padding: '24px 24px 24px 22px', boxSizing: 'border-box' as const, height: '100%', display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                    <div style={{ fontSize: 36, fontWeight: 900, color: RED, lineHeight: 1, letterSpacing: '-0.02em', flexShrink: 0, paddingTop: 2 }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <p style={{ fontSize: 14, color: '#555', lineHeight: 1.4, margin: 0 }}>{adv}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mapa de barrios ───────────────────────────────── */}
        <section style={{ borderBottom: '1px solid #f5f5f5', isolation: 'isolate' as any }}>
          <NeighborhoodMap zone={zone} />
        </section>

        {/* ── Propiedades relacionadas ──────────────────────── */}
        {relatedProperties.length > 0 && (
          <section style={{ background: '#fff', padding: '72px 0', borderBottom: '1px solid #f5f5f5' }}>
            <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
              <ScrollReveal y={16}>
                <div style={{ marginBottom: 40 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: RED, marginBottom: 12 }}>
                    Portafolio
                  </div>
                  <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, color: '#1a1a1a', margin: 0 }}>
                    Propiedades para inversión en {zone.name}
                  </h2>
                </div>
              </ScrollReveal>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                {relatedProperties.map((property, i) => (
                  <ScrollReveal key={property.id} delay={i * 0.07} y={14}>
                    <PropertyCard property={property} />
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal y={14}>
                <div style={{ marginTop: 48, textAlign: 'center' as const }}>
                  <Link
                    href={`/propiedades?location=${zone.name}&businessType=Comprar`}
                    className="zone-btn"
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      padding: '13px 40px',
                      background: RED, color: '#fff',
                      fontSize: 13, fontWeight: 700, letterSpacing: '0.04em',
                      textDecoration: 'none', fontFamily: FONT,
                      position: 'relative', overflow: 'hidden',
                    }}
                    onMouseEnter={applyInkFill}
                    onMouseLeave={applyInkFill}
                  >
                    Ver todas las propiedades en {zone.name}
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* ── Otras zonas ───────────────────────────────────── */}
        <section style={{ background: '#fff', padding: '32px 0 72px', borderBottom: '1px solid #f5f5f5' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${otherZones.length}, 1fr)`, gap: 1, background: '#e8e8e8' }}>
              {otherZones.map((z) => (
                <OtherZoneCard key={z.id} zone={z} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA final ─────────────────────────────────────── */}
        <section style={{ background: '#f7f6f4', padding: '80px 24px' }}>
          <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center' as const }}>
            <ScrollReveal y={16}>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#555', margin: '0 0 12px', lineHeight: 1.05, letterSpacing: '-0.01em' }}>
                <span style={{ fontWeight: 300 }}>¿Listo para </span>invertir en {zone.name}?
              </h2>
              <p style={{ fontSize: 15, color: '#555', margin: '0 0 40px', lineHeight: 1.65 }}>
                Nuestros asesores te acompañan desde la búsqueda hasta la gestión del arrendamiento.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '14px 36px',
                  background: ctaHovered ? RED : '#f7f6f4',
                  color: ctaHovered ? '#fff' : RED,
                  border: `1.5px solid ${RED}`,
                  fontSize: 14, fontWeight: 800, letterSpacing: '0.02em',
                  textDecoration: 'none', fontFamily: FONT,
                  borderRadius: 999,
                  transition: 'background 0.22s ease, color 0.22s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setCtaHovered(true)}
                onMouseLeave={() => setCtaHovered(false)}
              >
                <img
                  src={ctaHovered ? '/icons/icon-whatsapp-white.gif' : '/icons/icon-whatsapp-red.gif'}
                  width={18} height={18} alt=""
                />
                Solicitar asesoría
              </a>
            </ScrollReveal>
          </div>
        </section>

      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

/* ── Tarjeta de otra zona ─────────────────────────────────── */
function OtherZoneCard({ zone }: { zone: typeof investmentZones[0] }) {
  const [hovered,    setHovered]    = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column',
        background: '#ffffff',
        height: '100%', fontFamily: FONT,
        cursor: 'default', position: 'relative',
        transform: hovered ? 'scale(1.06)' : 'scale(1)',
        zIndex: hovered ? 10 : 1,
        transition: 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.3s ease',
        boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.18)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ padding: '28px 24px 24px', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8 }}>
        <div style={{ fontSize: 'clamp(16px, 1.2vw, 20px)', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.15 }}>
          {zone.name}
        </div>
        <div style={{ fontSize: 'clamp(12px, 0.9vw, 14px)', fontWeight: 400, color: '#555', lineHeight: 1.6 }}>
          <div>{zone.rentability} rentabilidad</div>
          <div>{zone.pricePerM2} / m²</div>
        </div>
      </div>
      <Link
        href={`/inversionistas/${zone.slug}`}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '11px 16px',
          background: btnHovered ? RED : '#ffffff',
          color: btnHovered ? '#fff' : RED,
          border: `1.5px solid ${RED}`,
          fontFamily: FONT, fontSize: 13, fontWeight: 600,
          textDecoration: 'none', flexShrink: 0,
          transition: 'background 0.22s ease, color 0.22s ease',
        }}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
      >
        Ver análisis
      </Link>
    </div>
  );
}
