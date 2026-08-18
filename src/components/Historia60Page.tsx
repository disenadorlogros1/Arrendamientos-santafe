'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PageType } from '@/components/Header';

gsap.registerPlugin(ScrollTrigger);

interface Props { onNavigate: (page: PageType) => void; }

const FONT  = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED   = '#f32735';
const DARK  = '#1a1a1a';
const FOG   = '#aab0ba'; // inactive year color
const N     = 6;    // total panels
const CW    = 0;    // collapsed width — 0 = panels completely hidden when inactive
const PANEL_H = 619; // panel height in px (matches previous 1100×16/9 ratio)

type LayerCfg = { src: string; z: number; px: number; py: number; dur: number };

const L66: LayerCfg[] = [
  { src: '/images/Banners/Linea%20de%20tiempo/1966-Fondo.webp',            z: 2,  px: 5,  py: 0, dur: 0.85 },
  { src: '/images/Banners/Linea%20de%20tiempo/1966-fecha-1.webp',          z: 4,  px: 12, py: 0, dur: 0.70 },
  { src: '/images/Banners/Linea%20de%20tiempo/1966-fecha-2.webp',          z: 6,  px: 19, py: 0, dur: 0.55 },
  { src: '/images/Banners/Linea%20de%20tiempo/1966-recorte-superior.webp', z: 8,  px: 26, py: 0, dur: 0.40 },
  { src: '/images/Banners/Linea%20de%20tiempo/1966-superior.webp',         z: 10, px: 34, py: 0, dur: 0.26 },
];

const L74: LayerCfg[] = [
  { src: '/images/Banners/Linea%20de%20tiempo/1974-Fondo.webp',            z: 2,  px: 5,  py: 0, dur: 0.85 },
  { src: '/images/Banners/Linea%20de%20tiempo/1974-fecha-1.webp',          z: 4,  px: 12, py: 0, dur: 0.70 },
  { src: '/images/Banners/Linea%20de%20tiempo/1974-fecha-2.webp',          z: 6,  px: 19, py: 0, dur: 0.55 },
  { src: '/images/Banners/Linea%20de%20tiempo/1974-recorte-superior.webp', z: 8,  px: 26, py: 0, dur: 0.40 },
  { src: '/images/Banners/Linea%20de%20tiempo/1974-superior.webp',         z: 10, px: 34, py: 0, dur: 0.26 },
];
const L2006: LayerCfg[] = [
  { src: '/images/Banners/Linea%20de%20tiempo/2006-Fondo.webp',            z: 2,  px: 5,  py: 0, dur: 0.85 },
  { src: '/images/Banners/Linea%20de%20tiempo/2006-fecha-1.webp',          z: 4,  px: 12, py: 0, dur: 0.70 },
  { src: '/images/Banners/Linea%20de%20tiempo/2006-fecha-2.webp',          z: 6,  px: 19, py: 0, dur: 0.55 },
  { src: '/images/Banners/Linea%20de%20tiempo/2006-recorte-superior.webp', z: 8,  px: 26, py: 0, dur: 0.40 },
  { src: '/images/Banners/Linea%20de%20tiempo/2006-superior.webp',         z: 10, px: 34, py: 0, dur: 0.26 },
];
const L2017: LayerCfg[] = [
  { src: '/images/Banners/Linea%20de%20tiempo/2017-Fondo.webp',            z: 2,  px: 5,  py: 0, dur: 0.85 },
  { src: '/images/Banners/Linea%20de%20tiempo/2017-fecha-1.webp',          z: 4,  px: 12, py: 0, dur: 0.70 },
  { src: '/images/Banners/Linea%20de%20tiempo/2017-fecha-2.webp',          z: 6,  px: 19, py: 0, dur: 0.55 },
  { src: '/images/Banners/Linea%20de%20tiempo/2017-recorte-superior.webp', z: 8,  px: 26, py: 0, dur: 0.40 },
  { src: '/images/Banners/Linea%20de%20tiempo/2017-superior.webp',         z: 10, px: 34, py: 0, dur: 0.26 },
];
const L2018: LayerCfg[] = [
  { src: '/images/Banners/Linea%20de%20tiempo/2018-Fondo.webp',    z: 2,  px: 5,  py: 0, dur: 0.85 },
  { src: '/images/Banners/Linea%20de%20tiempo/2018-fecha-1.webp',  z: 4,  px: 12, py: 0, dur: 0.70 },
  { src: '/images/Banners/Linea%20de%20tiempo/2018-fecha-2.webp',  z: 6,  px: 19, py: 0, dur: 0.55 },
  { src: '/images/Banners/Linea%20de%20tiempo/2018-superior.webp', z: 10, px: 34, py: 0, dur: 0.26 },
];
const L2026: LayerCfg[] = [
  { src: '/images/Banners/Linea%20de%20tiempo/2026-fondo.webp',    z: 2,  px: 5,  py: 0, dur: 0.85 },
  { src: '/images/Banners/Linea%20de%20tiempo/2026-fecha-1.webp',  z: 4,  px: 12, py: 0, dur: 0.70 },
  { src: '/images/Banners/Linea%20de%20tiempo/2026-fecha-2.webp',  z: 6,  px: 19, py: 0, dur: 0.55 },
  { src: '/images/Banners/Linea%20de%20tiempo/2026-superior.webp', z: 10, px: 34, py: 0, dur: 0.26 },
];

const EVENTS = [
  { year: '1966', title: 'Donde todo comenzó',                    body: 'Arrendamientos Santa Fe nace en Medellín con una visión de servicio, confianza y acompañamiento inmobiliario.',                                                                             layers: L66 },
  { year: '1974', title: 'Primeros cimientos',                    body: 'La empresa fortalece su presencia y consolida una operación más cercana para propietarios y clientes.',                                                                                      layers: L74 },
  { year: '2006', title: 'Reconocimiento y consolidación',        body: 'Cuatro décadas de trabajo reflejan una trayectoria construida con compromiso, seriedad y respaldo.',                                                                                        layers: L2006 },
  { year: '2017', title: 'Más cerca de nuestros clientes',        body: 'Con la apertura de la sede en Envigado, Santa Fe amplía su presencia y fortalece su cercanía con nuevas zonas del Valle de Aburrá.',                                                        layers: L2017 },
  { year: '2018', title: 'Evolución de marca',                    body: 'Arrendamientos Santa Fe renueva su imagen para proyectar una empresa más actual, cercana y coherente con su evolución.',                                                                     layers: L2018 },
  { year: '2026', title: '60 años acompañando nuevas decisiones', body: 'Santa Fe celebra seis décadas de historia con una nueva etapa: la apertura de su sede en Rionegro, reafirmando su compromiso de estar más cerca de quienes toman decisiones inmobiliarias.', layers: L2026 },
];

export default function Historia60Page({ onNavigate }: Props) {
  const wrapperRef        = useRef<HTMLDivElement>(null);
  const heroTitleRef      = useRef<HTMLHeadingElement>(null);
  const panelContainerRef = useRef<HTMLDivElement>(null);
  const panelRefs        = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
  const textRefs         = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
  const dotRefs          = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
  const yearRefs         = useRef<(HTMLSpanElement | null)[]>(Array(N).fill(null));

  const imgRefs       = useRef<(HTMLImageElement | null)[][]>(EVENTS.map(e => Array(e.layers.length).fill(null)));
  const proxyRefs     = useRef<{ x: number }[][]>(EVENTS.map(e => e.layers.map(() => ({ x: 0 }))));
  const pxSets        = useRef<((v: number) => void)[][]>(EVENTS.map(() => []));
  const activeRef     = useRef(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [mobileIdx, setMobileIdx] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Parallax via objectPosition (no overflow issues) ─────────
  useEffect(() => {
    EVENTS.forEach((evt, pi) => {
      evt.layers.forEach((layer, li) => {
        const img   = imgRefs.current[pi]?.[li];
        const proxy = proxyRefs.current[pi]?.[li];
        if (!img || !proxy) return;
        pxSets.current[pi][li] = gsap.quickTo(proxy, 'x', {
          duration: layer.dur * 0.6,
          ease: 'power3.out',
          onUpdate: () => {
            img.style.objectPosition = `calc(50% + ${proxy.x}px) 50%`;
          },
        });
      });
    });
  }, []);

  const resetParallax = (pi: number) => {
    EVENTS[pi]?.layers.forEach((_l, li) => {
      pxSets.current[pi][li]?.(0);
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const pi = activeRef.current;
    const panel = panelRefs.current[pi];
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width - 0.5;
    EVENTS[pi].layers.forEach((l, li) => {
      pxSets.current[pi][li]?.(dx * l.px * 4);
    });
  };

  // ── ScrollTrigger ─────────────────────────────────────────────
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const container = panelContainerRef.current;
      if (!container) return;
      // Use the actual rendered container width (respects maxWidth + viewport)
      const CW_total = container.getBoundingClientRect().width;

      // Panel 0 = full container; future panels = 0
      gsap.set(panelRefs.current[0], { width: CW_total });
      for (let k = 1; k < N; k++) {
        if (panelRefs.current[k]) gsap.set(panelRefs.current[k], { width: 0 });
      }

      // Initial text / dot / year
      textRefs.current.forEach((el, i) => { if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 12 }); });
      dotRefs.current.forEach((d, i)   => { if (d)  gsap.set(d,  { scale: i === 0 ? 1.8 : 1 }); });
      yearRefs.current.forEach((s, i)  => { if (s)  gsap.set(s,  { color: i === 0 ? RED : FOG, fontSize: i === 0 ? 14 : 11, fontWeight: i === 0 ? 700 : 300 }); });

      if (reduced) return;

      // Offset so the first transition starts exactly when the h1 title
      // disappears behind the 86px header as the user scrolls.
      const HEADER_H = 86;
      const scrollY  = window.scrollY;
      const titleBottom  = (heroTitleRef.current?.getBoundingClientRect().bottom  ?? 0) + scrollY;
      const wrapperTopPx = (wrapperRef.current?.getBoundingClientRect().top       ?? 0) + scrollY;
      const startOffset  = Math.round(wrapperTopPx - titleBottom + HEADER_H);

      for (let i = 0; i < N - 1; i++) {
        const ic      = i;
        const EW_cur  = CW_total - ic * CW;
        const EW_next = CW_total - (ic + 1) * CW;

        const activateYear = (idx: number) => {
          gsap.to(yearRefs.current[idx], { color: RED, fontSize: 14, fontWeight: 700, duration: 0.25, ease: 'power2.out' });
        };
        const deactivateYear = (idx: number) => {
          gsap.to(yearRefs.current[idx], { color: FOG, fontSize: 11, fontWeight: 300, duration: 0.25, ease: 'power2.out' });
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: `top+=${(ic * 2 + 1) * window.innerHeight} top+=${startOffset}`,
            end:   `top+=${(ic * 2 + 2) * window.innerHeight} top+=${startOffset}`,
            scrub: 1.2,
            onEnter:     () => { activeRef.current = ic + 1; resetParallax(ic);     deactivateYear(ic);     activateYear(ic + 1); },
            onLeaveBack: () => { activeRef.current = ic;     resetParallax(ic + 1); deactivateYear(ic + 1); activateYear(ic);     },
          },
        });

        tl.fromTo(panelRefs.current[ic],     { width: EW_cur  }, { width: CW,      ease: 'none' }, 0)
          .fromTo(panelRefs.current[ic + 1], { width: 0       }, { width: EW_next, ease: 'none' }, 0)
          .fromTo(textRefs.current[ic],      { opacity: 1, y: 0  }, { opacity: 0, y: -10, ease: 'none' }, 0)
          .fromTo(textRefs.current[ic + 1],  { opacity: 0, y: 12 }, { opacity: 1, y: 0,   ease: 'none' }, 0)
          .fromTo(dotRefs.current[ic],       { scale: 1.8 }, { scale: 1,   ease: 'none' }, 0)
          .fromTo(dotRefs.current[ic + 1],   { scale: 1   }, { scale: 1.8, ease: 'none' }, 0);
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  // ── Ken Burns mobile ──────────────────────────────────────────
  useEffect(() => {
    if (!isMobile) return;
    const KB = [
      { scale: 1.14, x:  18, dur: 8,  origin: '30% 60%' },
      { scale: 1.12, x: -15, dur: 7,  origin: '70% 40%' },
      { scale: 1.13, x:  14, dur: 9,  origin: '50% 50%' },
      { scale: 1.11, x: -16, dur: 10, origin: '40% 55%' },
      { scale: 1.14, x:  17, dur: 7,  origin: '60% 45%' },
      { scale: 1.12, x: -13, dur: 9,  origin: '55% 50%' },
    ];
    const timer = setTimeout(() => {
      EVENTS.forEach((_evt, pi) => {
        const img = imgRefs.current[pi]?.[0];
        if (!img) return;
        const k = KB[pi % KB.length];
        gsap.to(img, {
          scale: k.scale, x: k.x,
          duration: k.dur,
          ease: 'sine.inOut',
          yoyo: true, repeat: -1,
          transformOrigin: k.origin,
        });
      });
    }, 80);
    return () => clearTimeout(timer);
  }, [isMobile]);

  // ── JSX ───────────────────────────────────────────────────────
  return (
    <div style={{ background: '#fff' }}>
      <style>{`
        @keyframes badge-enter {
          from { opacity: 0; transform: scale(0.6) rotate(-12deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes badge-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-6px) rotate(2deg); }
        }
      `}</style>

      {/* ── Article hero ──────────────────────────────────────── */}
      <div style={{
        background: DARK, position: 'relative', overflow: 'hidden',
        marginTop: '-86px', paddingTop: 120, paddingBottom: 32,
        paddingLeft: 'clamp(24px,6vw,96px)', paddingRight: 'clamp(24px,6vw,96px)',
      }}>

        <div style={{ maxWidth: 680, position: 'relative', zIndex: 1 }}>
          <button
            onClick={() => onNavigate('blog')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: FONT, fontSize: 12, fontWeight: 600,
              color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em',
              padding: '0 0 28px', display: 'flex', alignItems: 'center', gap: 8,
              textTransform: 'uppercase',
            }}
          >
            ← Blog
          </button>
          <h1 ref={heroTitleRef} style={{
            fontFamily: FONT, fontWeight: 700,
            fontSize: 'clamp(28px,4vw,52px)',
            color: '#fff', lineHeight: 1.15, margin: '0 0 16px',
          }}>
            60 años de historia{' '}
            <em style={{ fontStyle: 'normal', fontWeight: 900 }}>en el corazón de Antioquia</em>
          </h1>
          <p style={{ fontFamily: FONT, fontSize: 13, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', margin: 0 }}>
            Junio 2026 &nbsp;|&nbsp; 5 min de lectura
          </p>
        </div>
      </div>

      {/* ── Mobile carousel ─────────────────────────────────────── */}
      {isMobile && (
        <div style={{ background: DARK, paddingBottom: 24 }}>

          {/* Texto centrado encima del banner */}
          <div style={{
            padding: '20px 20px 14px', minHeight: '180px',
            boxSizing: 'border-box', textAlign: 'center',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <h3 style={{
              fontFamily: FONT, fontWeight: 800, fontSize: 20,
              color: '#fff', lineHeight: 1.1, margin: 0,
            }}>
              {EVENTS[mobileIdx].title}
            </h3>
            <p style={{
              fontFamily: FONT, fontWeight: 400, fontSize: 13,
              color: 'rgba(255,255,255,0.75)', lineHeight: 1.3, margin: 0,
            }}>
              {EVENTS[mobileIdx].body}
            </p>
          </div>

          {/* Banner con flechas */}
          <div style={{ position: 'relative' }}>
            {/* Flecha izquierda */}
            <button
              type="button"
              aria-label="Año anterior"
              onClick={() => {
                const prev = Math.max(0, mobileIdx - 1);
                mobileScrollRef.current?.scrollTo({
                  left: prev * (mobileScrollRef.current?.offsetWidth ?? window.innerWidth),
                  behavior: 'smooth',
                });
              }}
              style={{
                position: 'absolute', left: 8, top: '50%',
                transform: 'translateY(-50%)', zIndex: 30,
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.14)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.28)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', padding: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Scroll container — scrollbar oculto */}
            <style>{`.mob-scroll::-webkit-scrollbar { display: none; }`}</style>
            <div
              ref={mobileScrollRef}
              className="mob-scroll"
              onScroll={(e) => {
                const idx = Math.round(e.currentTarget.scrollLeft / e.currentTarget.offsetWidth);
                setMobileIdx(idx);
              }}
              style={{
                display: 'flex',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
              } as React.CSSProperties}
            >
              {EVENTS.map((evt, pi) => (
                <div
                  key={evt.year}
                  style={{
                    minWidth: '100vw',
                    scrollSnapAlign: 'start',
                    position: 'relative',
                    aspectRatio: '1920/619',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  {evt.layers.map((layer, li) => (
                    <img
                      key={li}
                      ref={el => { imgRefs.current[pi][li] = el; }}
                      src={layer.src}
                      alt=""
                      aria-hidden="true"
                      style={{
                        position: 'absolute', top: 0, left: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: '50% 50%',
                        display: 'block',
                        zIndex: layer.z, pointerEvents: 'none',
                      }}
                    />
                  ))}
                  {pi === 0 && (
                    <img
                      src="/icons/60%20a%C3%B1os-mobile.svg"
                      alt=""
                      aria-hidden
                      style={{
                        position: 'absolute',
                        top: 10, right: 12, width: 54,
                        zIndex: 25, pointerEvents: 'none',
                        filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.4))',
                        animation: 'badge-enter 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.4s both, badge-float 5s ease-in-out 1.1s infinite',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Flecha derecha */}
            <button
              type="button"
              aria-label="Año siguiente"
              onClick={() => {
                const next = Math.min(N - 1, mobileIdx + 1);
                mobileScrollRef.current?.scrollTo({
                  left: next * (mobileScrollRef.current?.offsetWidth ?? window.innerWidth),
                  behavior: 'smooth',
                });
              }}
              style={{
                position: 'absolute', right: 8, top: '50%',
                transform: 'translateY(-50%)', zIndex: 30,
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.14)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.28)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', padding: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Timeline dots — años arriba, círculos en medio, línea abajo */}
          <div style={{
            display: 'flex',
            position: 'relative', height: 56,
            background: DARK,
          }}>
            {/* Línea horizontal — al mismo nivel que los círculos */}
            <div style={{
              position: 'absolute',
              top: 32,
              left: `calc(100% / ${N * 2})`,
              right: `calc(100% / ${N * 2})`,
              height: 1, background: FOG,
              zIndex: 1,
            }} />
            {EVENTS.map((evt, pi) => {
              const active = pi === mobileIdx;
              return (
                <button
                  key={evt.year}
                  onClick={() => {
                    mobileScrollRef.current?.scrollTo({
                      left: pi * (mobileScrollRef.current?.offsetWidth ?? window.innerWidth),
                      behavior: 'smooth',
                    });
                  }}
                  style={{
                    flex: 1, height: '100%', position: 'relative',
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: 0, zIndex: 2,
                  }}
                >
                  {/* Año — arriba */}
                  <span style={{
                    position: 'absolute',
                    top: 6, left: '50%',
                    transform: 'translateX(-50%)',
                    fontFamily: FONT, lineHeight: 1,
                    fontSize: active ? 11 : 10, fontWeight: active ? 700 : 300,
                    color: active ? RED : FOG,
                    whiteSpace: 'nowrap', letterSpacing: '0.1em',
                    transition: 'all 0.2s',
                  }}>
                    {evt.year}
                  </span>
                  {/* Círculo — sobre la línea */}
                  <div style={{
                    position: 'absolute',
                    top: 32, left: '50%',
                    transform: `translate(-50%, -50%) scale(${active ? 1.8 : 1})`,
                    width: 8, height: 8, borderRadius: '50%', background: RED,
                    transition: 'transform 0.2s',
                  }} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Desktop: Horizontal scroll experience ─────────────────── */}
      {!isMobile && (
      <div ref={wrapperRef} style={{ height: `${N * 200}dvh`, background: '#fff' }}>
        <div
          style={{
            position: 'sticky', top: 86, width: '100%', height: 'calc(100dvh - 86px)',
            background: '#fff',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 16,
          }}
        >

          {/* ── Panels — full viewport width, fixed height ──────── */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={() => resetParallax(activeRef.current)}
            ref={panelContainerRef}
            style={{
              width: '100%',
              height: `min(${PANEL_H}px, calc(100dvh - 170px))`,
              overflow: 'hidden',
              display: 'flex',
              position: 'relative',
            }}
          >
            {EVENTS.map((evt, pi) => (
              <div
                key={evt.year}
                ref={el => { panelRefs.current[pi] = el; }}
                style={{
                  position: 'relative',
                  height: '100%',
                  overflow: 'hidden',
                  clipPath: 'inset(0)',
                  flexShrink: 0,
                  background: '#ffffff',
                  width: pi === 0 ? '100%' : 0,
                }}
              >
                {/* Parallax image layers */}
                {evt.layers.map((layer, li) => (
                  <img
                    key={li}
                    ref={el => { imgRefs.current[pi][li] = el; }}
                    src={layer.src}
                    alt=""
                    aria-hidden="true"
                    style={{
                      position: 'absolute', top: 0, left: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                      objectPosition: '50% 50%',
                      display: 'block',
                      zIndex: layer.z, pointerEvents: 'none',
                    }}
                  />
                ))}

                {/* Gradient overlay — desktop only */}
                <div aria-hidden="true" style={{
                  position: 'absolute', inset: 0, zIndex: 12, pointerEvents: 'none',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 35%, transparent 65%)',
                }} />

                {/* Text overlay */}
                <div
                  ref={el => { textRefs.current[pi] = el; }}
                  style={{
                    position: 'absolute',
                    bottom: 'clamp(16px,3vh,32px)',
                    left: 'clamp(16px,5vw,28px)',
                    zIndex: 20,
                    maxWidth: 'clamp(260px,35vw,440px)',
                    pointerEvents: 'none',
                  }}
                >
                  <h3 style={{
                    fontFamily: FONT, fontWeight: 700,
                    fontSize: 'clamp(22px,2.4vw,34px)',
                    color: '#fff', lineHeight: 1.2, margin: '0 0 8px',
                  }}>
                    {evt.title}
                  </h3>
                  <p style={{
                    fontFamily: FONT, fontWeight: 300,
                    fontSize: 'clamp(14px,1.1vw,18px)',
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: 1.7, margin: 0,
                  }}>
                    {evt.body}
                  </p>
                </div>
              </div>
            ))}

            {/* Badge 60 años — decorativo, esquina superior derecha */}
            <img
              src="/icons/60%20a%C3%B1os-destok.svg"
              alt=""
              aria-hidden
              style={{
                position: 'absolute',
                top: 'clamp(12px, 2vw, 24px)',
                right: 'clamp(14px, 2.5vw, 36px)',
                width: 'clamp(90px, 9vw, 140px)',
                zIndex: 25,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.45))',
                animation: 'badge-enter 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.4s both, badge-float 5s ease-in-out 1.1s infinite',
              }}
            />
          </div>

          {/* ── Timeline bar ─────────────────────────────────────── */}
          <div style={{
            width: '100%',
            position: 'relative',
            height: 52,
            display: 'flex',
          }}>
            {/* Connecting line — from first dot to last dot */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: `calc(100% / ${N * 2})`,
              right: `calc(100% / ${N * 2})`,
              height: 1, background: FOG,
              transform: 'translateY(-50%)',
              zIndex: 1,
            }} />

            {/* Dots + years */}
            {EVENTS.map((evt, pi) => (
              <div
                key={evt.year}
                style={{ flex: 1, height: '100%', position: 'relative', zIndex: 2 }}
              >
                <span
                  ref={el => { yearRefs.current[pi] = el; }}
                  style={{
                    position: 'absolute',
                    bottom: 'calc(50% + 10px)',
                    left: '50%', transform: 'translateX(-50%)',
                    fontFamily: FONT, fontWeight: 300,
                    fontSize: 10, letterSpacing: '0.1em',
                    color: FOG, whiteSpace: 'nowrap',
                    userSelect: 'none',
                  }}
                >
                  {evt.year}
                </span>
                <div
                  ref={el => { dotRefs.current[pi] = el; }}
                  style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 8, height: 8,
                    borderRadius: '50%',
                    background: RED, flexShrink: 0,
                  }}
                />
              </div>
            ))}
          </div>

        </div>
      </div>
      )}

    </div>
  );
}
