'use client';

import { Fragment, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '@/components/ScrollReveal';
import type { PageType } from '@/components/Header';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  onNavigate: (page: PageType) => void;
}

const FONT_BODY    = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const FONT_HEADING = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const FONT_HEAVY   = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';
const DARK = '#1a1a1a';
const BG   = '#f7f6f4';

const events = [
  {
    year: '1966',
    title: 'Donde todo comenzó',
    body: 'Arrendamientos Santa Fe nace en Medellín con una visión de servicio, confianza y acompañamiento inmobiliario.',
    img: '/images/1966_Donde_todo_comenz%C3%B3.jpeg',
    objectPos: '60% 20%',
  },
  {
    year: '1974',
    title: 'Primeros cimientos',
    body: 'La empresa fortalece su presencia y consolida una operación más cercana para propietarios y clientes.',
    img: '/images/1974_primeros_cimientos.jpeg',
    objectPos: '85% 20%',
  },
  {
    year: '2006',
    title: 'Reconocimiento y consolidación',
    body: 'Cuatro décadas de trabajo reflejan una trayectoria construida con compromiso, seriedad y respaldo.',
    img: '/images/2006_Reconocimiento_consolidaci%C3%B3n.png',
    objectPos: '55% 20%',
  },
  {
    year: '2017',
    title: 'Más cerca de nuestros clientes',
    body: 'Con la apertura de la sede en Envigado, Santa Fe amplía su presencia y fortalece su cercanía con nuevas zonas del Valle de Aburrá.',
    img: '/images/2017_M%C3%A1s_cerca_de_nuestros%20clientes.png',
    objectPos: '70% 20%',
  },
  {
    year: '2018',
    title: 'Evolución de marca',
    body: 'Arrendamientos Santa Fe renueva su imagen para proyectar una empresa más actual, cercana y coherente con su evolución, sin perder la esencia que ha construido durante décadas.',
    img: '/images/2018_Evoluci%C3%B3n_de_marca.png',
    objectPos: '40% 20%',
  },
  {
    year: '2026',
    title: '60 años acompañando nuevas decisiones',
    body: 'Santa Fe celebra seis décadas de historia con una nueva etapa: la apertura de su sede en Rionegro, un paso que reafirma su compromiso de estar más cerca de quienes toman decisiones inmobiliarias en el Oriente Antioqueño.',
    img: '/images/2026_60_a%C3%B1os.png',
    objectPos: '15% 20%',
  },
];

const CONNECTOR_H = 32;
const DOT_SIZE    = 10;
const LINE_TOP    = CONNECTOR_H + DOT_SIZE / 2;

export default function Historia60Page({ onNavigate }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef  = useRef<HTMLDivElement>(null);
  const lineRef  = useRef<HTMLDivElement>(null);
  const dotsRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targets = [titleRef.current, metaRef.current];
    targets.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, y: i === 0 ? 16 : 0 },
        { opacity: 1, y: 0, duration: 0.5 + i * 0.05, delay: 0.08 + i * 0.08, ease: 'power2.out' }
      );
    });
  }, []);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    const ctx = gsap.context(() => {
      gsap.from(line, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.1,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: line, start: 'top 80%', once: true },
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const container = dotsRef.current;
    if (!container) return;
    const dots = container.querySelectorAll('.timeline-dot');
    const ctx = gsap.context(() => {
      dots.forEach((dot, i) => {
        gsap.from(dot, {
          scale: 0,
          duration: 0.32,
          delay: (i / (events.length - 1)) * 1.1 + 0.05,
          ease: 'back.out(1.7)',
          scrollTrigger: { trigger: container, start: 'top 80%', once: true },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>

      {/* ── Article Hero ─────────────────────────────────────── */}
      <div style={{ background: '#1a1a1a', position: 'relative', overflow: 'hidden', marginTop: '-86px' }}>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute', right: '-40px', top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: FONT_HEAVY,
            fontSize: 'clamp(180px, 28vw, 380px)',
            fontWeight: 800,
            color: 'rgba(255,255,255,0.042)',
            lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
          }}
        >60</span>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', padding: 'calc(86px + 20px) clamp(20px, 5vw, 80px) 20px' }}>
          <button
            type="button"
            onClick={() => onNavigate('blog')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontFamily: FONT_BODY, fontSize: '13px', fontWeight: 300,
              color: 'rgba(255,255,255,0.4)', background: 'transparent',
              border: 'none', cursor: 'pointer', padding: 0, marginBottom: '16px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Volver al blog
          </button>

          <h1
            ref={titleRef}
            style={{ fontFamily: FONT_HEADING, fontSize: 'clamp(24px, 3.2vw, 44px)', fontWeight: 300, color: '#fff', lineHeight: 1.18, margin: '0 0 14px 0', opacity: 0 }}
          >
            60 años de historia{' '}
            <span style={{ fontWeight: 700 }}>en el corazón de Antioquia</span>
          </h1>

          <div ref={metaRef} style={{ display: 'flex', gap: '20px', alignItems: 'center', opacity: 0 }}>
            <span style={{ fontFamily: FONT_BODY, fontSize: '12px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.02em' }}>Junio 2026</span>
            <span style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.12)' }} />
            <span style={{ fontFamily: FONT_BODY, fontSize: '12px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.02em' }}>5 min de lectura</span>
          </div>
        </div>
      </div>

      {/* ── Timeline Section ──────────────────────────────────── */}
      <div style={{ padding: '20px 0' }}>

        {/* ── Desktop (lg+) ── */}
        <div
          className="hidden lg:grid"
          style={{
            gridTemplateRows: 'auto auto auto',
            gridTemplateColumns: 'repeat(6, 1fr)',
            columnGap: '14px',
            padding: '0 clamp(32px, 4vw, 72px)',
          }}
        >
          {/* Horizontal timeline line */}
          <div ref={dotsRef} style={{ gridRow: '2', gridColumn: '1 / -1', position: 'relative', zIndex: 0 }}>
            <div
              ref={lineRef}
              style={{
                position: 'absolute',
                top: `${LINE_TOP}px`,
                left: 'calc(100% / 12)',
                right: 'calc(100% / 12)',
                height: '2px',
                background: DARK,
                transformOrigin: 'left center',
              }}
            />
          </div>

          {events.map((event, i) => {
            const lineDelay = (i / (events.length - 1)) * 1.1;
            const imgDelay  = lineDelay;
            const textDelay = lineDelay + 0.20;
            const isLast    = event.year === '2026';

            return (
              <Fragment key={event.year}>

                {/* Row 1 — Image */}
                <ScrollReveal y={-20} delay={imgDelay} start="top 80%" className="!w-auto" style={{ gridRow: '1', gridColumn: String(i + 1) } as React.CSSProperties}>
                  <div
                    className="group overflow-hidden"
                    style={{ width: '100%', aspectRatio: '4/3', cursor: 'pointer' }}
                  >
                    <img
                      src={event.img}
                      alt={event.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                      style={{ objectPosition: event.objectPos }}
                    />
                  </div>
                </ScrollReveal>

                {/* Row 2 — Axis */}
                <div style={{
                  gridRow: '2',
                  gridColumn: String(i + 1),
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  <div style={{ height: `${CONNECTOR_H}px`, width: '1px', borderLeft: '1px dashed rgba(0,0,0,0.25)' }} />

                  <div
                    className="timeline-dot"
                    style={{
                      width: `${DOT_SIZE}px`, height: `${DOT_SIZE}px`,
                      borderRadius: '50%',
                      background: isLast ? RED : '#fff',
                      border: `2px solid ${isLast ? RED : DARK}`,
                      flexShrink: 0, zIndex: 2,
                    }}
                  />

                  <span style={{
                    fontFamily: FONT_HEAVY,
                    fontSize: 'clamp(10px, 0.8vw, 12px)',
                    color: isLast ? RED : DARK,
                    letterSpacing: '0.05em',
                    marginTop: '6px',
                    flexShrink: 0,
                  }}>
                    {event.year}
                  </span>

                  <div style={{ height: `${CONNECTOR_H}px`, width: '1px', borderLeft: '1px dashed rgba(0,0,0,0.25)', marginTop: '6px' }} />
                </div>

                {/* Row 3 — Text */}
                <ScrollReveal y={16} delay={textDelay} start="top 80%" className="!w-auto" style={{ gridRow: '3', gridColumn: String(i + 1) } as React.CSSProperties}>
                  <div style={{ padding: '14px 10px 40px 10px' }}>
                    <h3 style={{
                      fontFamily: FONT_HEAVY,
                      fontSize: 'clamp(11px, 0.88vw, 13px)',
                      color: DARK, margin: '0 0 7px 0', lineHeight: 1.35,
                    }}>
                      {event.title}
                    </h3>
                    <p style={{
                      fontFamily: FONT_BODY,
                      fontSize: 'clamp(10px, 0.78vw, 12px)',
                      color: '#999', margin: 0, lineHeight: 1.65,
                    }}>
                      {event.body}
                    </p>
                  </div>
                </ScrollReveal>

              </Fragment>
            );
          })}
        </div>

        {/* ── Mobile (< lg) ── */}
        <div className="lg:hidden" style={{ padding: '0 clamp(20px, 5vw, 40px)', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: 'calc(clamp(20px, 5vw, 40px) + 19px)',
            top: 0, bottom: 0,
            width: '2px', background: 'rgba(0,0,0,0.1)',
          }} />

          {events.map((event, i) => {
            const isLast = event.year === '2026';
            return (
              <ScrollReveal key={event.year} y={14} delay={i * 0.07} start="top 85%">
                <div style={{ display: 'flex', gap: '20px', paddingBottom: i < events.length - 1 ? '36px' : 0 }}>
                  <div style={{ width: '40px', flexShrink: 0, paddingTop: '6px', position: 'relative' }}>
                    <div style={{
                      width: `${DOT_SIZE}px`, height: `${DOT_SIZE}px`,
                      borderRadius: '50%',
                      background: isLast ? RED : '#fff',
                      border: `2px solid ${isLast ? RED : DARK}`,
                      marginLeft: '14px', position: 'relative', zIndex: 1,
                    }} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      className="group overflow-hidden mb-3"
                      style={{ width: '100%', height: 'clamp(140px, 42vw, 200px)' }}
                    >
                      <img
                        src={event.img}
                        alt={event.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                        style={{ objectPosition: event.objectPos }}
                      />
                    </div>
                    <span style={{
                      fontFamily: FONT_HEAVY, fontSize: '12px',
                      color: isLast ? RED : DARK, letterSpacing: '0.06em',
                      display: 'block', marginBottom: '6px',
                    }}>
                      {event.year}
                    </span>
                    <h3 style={{ fontFamily: FONT_HEAVY, fontSize: 'clamp(14px, 3.8vw, 17px)', color: DARK, margin: '0 0 6px 0', lineHeight: 1.3 }}>
                      {event.title}
                    </h3>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 'clamp(13px, 3.2vw, 14px)', color: '#888', margin: 0, lineHeight: 1.6 }}>
                      {event.body}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* ── Closing ───────────────────────────────────────────── */}
      <ScrollReveal y={20}>
        <div style={{ background: DARK, padding: 'clamp(48px, 6vw, 72px) clamp(20px, 5vw, 80px)', textAlign: 'center' }}>
          <p style={{ fontFamily: FONT_HEADING, fontSize: 'clamp(20px, 2.4vw, 34px)', fontWeight: 300, color: '#fff', lineHeight: 1.45, margin: '0 auto 32px auto', maxWidth: '680px' }}>
            Seis décadas después, seguimos con la misma vocación:{' '}
            <span style={{ fontWeight: 700, color: RED }}>acompañar decisiones que cambian vidas.</span>
          </p>
          <button
            type="button"
            onClick={() => onNavigate('consignacion')}
            style={{
              fontFamily: FONT_BODY, fontSize: '14px', fontWeight: 600,
              color: '#fff', background: RED, border: 'none', cursor: 'pointer',
              padding: '14px 32px', borderRadius: '2px', transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#aa182c')}
            onMouseLeave={e => (e.currentTarget.style.background = RED)}
          >
            Consigna tu propiedad
          </button>
        </div>
      </ScrollReveal>

    </div>
  );
}
