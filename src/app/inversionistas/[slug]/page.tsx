'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
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

const STATS_META = [
  { key: 'rentability' as const, label: 'Rentabilidad anual',  icon: '/icons/icon-rent-white.gif' },
  { key: 'pricePerM2'  as const, label: 'Precio por m²',       icon: '/icons/icon-price-white.gif' },
  { key: 'strata'      as const, label: 'Estratos',             icon: '/icons/icon-location-white.gif' },
];

export default function InversionZonePage() {
  const params = useParams();
  const slug   = params.slug as string;
  const [currentPage, setCurrentPage] = useState<PageType>('inversionistas');
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
              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
                <img src="/icons/icon-favicon-white.gif" width={13} height={13} style={{ opacity: 0.4 }} alt="" />
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)' }}>
                  Arrendamientos Santa Fe
                </span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>·</span>
                <Link href="/inversionistas" style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
                  Zonas de inversión
                </Link>
              </div>

              {/* Badge de sector */}
              <div style={{ display: 'inline-block', padding: '4px 12px', background: RED, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 20 }}>
                {zone.sector}
              </div>

              <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, color: '#fff', lineHeight: 1.05, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
                {zone.h1Title}
              </h1>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.58)', lineHeight: 1.75, maxWidth: 640, margin: 0 }}>
                {zone.description}
              </p>
            </div>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────── */}
        <section style={{ background: '#1a1a1a', padding: '0', borderBottom: '1px solid #1e1e1e' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              {STATS_META.map((meta) => (
                <div key={meta.key} style={{ background: '#161616', borderTop: `3px solid ${RED}`, padding: '32px 28px 28px', boxSizing: 'border-box' as const }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: RED, marginBottom: 10 }}>
                    {meta.label}
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
                    {zone[meta.key]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Ventajas ──────────────────────────────────────── */}
        <section style={{ background: '#fff', padding: '72px 0', borderBottom: '1px solid #f5f5f5' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
            <ScrollReveal y={16}>
              <div style={{ marginBottom: 48 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: RED, marginBottom: 12 }}>
                  Por qué invertir aquí
                </div>
                <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 900, color: '#1a1a1a', margin: 0, letterSpacing: '-0.01em' }}>
                  Ventajas de {zone.name}
                </h2>
              </div>
            </ScrollReveal>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
              {zone.advantages.map((adv, i) => (
                <ScrollReveal key={i} delay={i * 0.07} y={14}>
                  <div style={{ background: DARK3, borderLeft: `3px solid ${RED}`, padding: '24px 24px 24px 22px', boxSizing: 'border-box' as const, height: '100%' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: RED, marginBottom: 10, letterSpacing: '0.04em' }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <p style={{ fontSize: 14, color: '#555', lineHeight: 1.65, margin: 0 }}>{adv}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mapa de barrios ───────────────────────────────── */}
        <section style={{ background: DARK2, borderBottom: '1px solid #f5f5f5' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
            <ScrollReveal y={16}>
              <div style={{ paddingTop: 64, paddingBottom: 36 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: RED, marginBottom: 12 }}>
                  Cobertura
                </div>
                <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, color: '#1a1a1a', margin: 0 }}>
                  Sectores y barrios de {zone.name}
                </h2>
              </div>
            </ScrollReveal>
          </div>
          <NeighborhoodMap zone={zone} />
          <div style={{ height: 64 }} />
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
        <section style={{ background: DARK2, padding: '72px 0', borderBottom: '1px solid #f5f5f5' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
            <ScrollReveal y={16}>
              <div style={{ marginBottom: 48 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: RED, marginBottom: 12 }}>
                  Explorar
                </div>
                <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, color: '#1a1a1a', margin: 0 }}>
                  Otras zonas de inversión
                </h2>
              </div>
            </ScrollReveal>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 2 }}>
              {otherZones.map((z, i) => (
                <ScrollReveal key={z.id} delay={i * 0.08} y={14}>
                  <OtherZoneCard zone={z} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA final ─────────────────────────────────────── */}
        <section style={{ background: RED, padding: '80px 24px' }}>
          <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center' as const }}>
            <ScrollReveal y={16}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
                <img src="/icons/icon-favicon-white.gif" width={14} height={14} style={{ opacity: 0.7 }} alt="" />
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.55)' }}>
                  Arrendamientos Santa Fe
                </span>
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#fff', margin: '0 0 12px', lineHeight: 1.05, letterSpacing: '-0.01em' }}>
                ¿Listo para invertir en {zone.name}?
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', margin: '0 0 40px', lineHeight: 1.65 }}>
                Nuestros asesores te acompañan desde la búsqueda hasta la gestión del arrendamiento.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="zone-btn"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '14px 36px',
                  background: '#fff', color: RED,
                  fontSize: 14, fontWeight: 800, letterSpacing: '0.02em',
                  textDecoration: 'none', fontFamily: FONT,
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={applyInkFill}
                onMouseLeave={applyInkFill}
              >
                <img src="/icons/icon-whatsapp-red.gif" width={18} height={18} alt="" />
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
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/inversionistas/${zone.slug}`}
      style={{
        display: 'block',
        background: hovered ? '#ececec' : DARK3,
        borderTop: `3px solid ${hovered ? RED : '#f5f5f5'}`,
        padding: '24px 22px 22px',
        textDecoration: 'none',
        transition: 'background 0.18s, border-color 0.18s',
        boxSizing: 'border-box' as const,
        height: '100%',
        fontFamily: FONT,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: hovered ? RED : '#ccc', marginBottom: 10, transition: 'color 0.18s' }}>
        {zone.sector}
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a', marginBottom: 14, lineHeight: 1.15 }}>
        {zone.name}
      </div>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>
        <span style={{ color: RED, fontWeight: 700 }}>{zone.rentability}</span> rentabilidad
      </div>
      <div style={{ fontSize: 12, color: '#888' }}>
        {zone.pricePerM2} / m²
      </div>
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 6, color: hovered ? RED : '#ccc', fontSize: 12, fontWeight: 600, transition: 'color 0.18s' }}>
        Ver análisis
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </Link>
  );
}
