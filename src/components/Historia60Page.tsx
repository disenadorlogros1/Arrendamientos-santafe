'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PageType } from '@/components/Header';

gsap.registerPlugin(ScrollTrigger);

interface Props { onNavigate: (page: PageType) => void; }

const FONT  = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED   = '#f32735';
const DARK  = '#1a1a1a';
const N     = 6;   // total panels
const CW    = 64;  // collapsed panel width (px)
const MAX_W = 1100; // max container width

type LayerCfg = { src: string; z: number; px: number; py: number; dur: number };

const L66: LayerCfg[] = [
  { src: '/images/Linea%20de%20tiempo/1966_capa_1b.png', z: 2, px: 6,  py: 4,  dur: 0.85 },
  { src: '/images/Linea%20de%20tiempo/1966_capa_1a.png', z: 4, px: 12, py: 8,  dur: 0.62 },
  { src: '/images/Linea%20de%20tiempo/1966_capa_3.png',  z: 6, px: 18, py: 11, dur: 0.42 },
  { src: '/images/Linea%20de%20tiempo/1966_capa_4.png',  z: 8, px: 24, py: 15, dur: 0.26 },
];

const L74: LayerCfg[] = [
  { src: '/images/Linea%20de%20tiempo/1974_capa_1b.png', z: 2, px: 6,  py: 4,  dur: 0.85 },
  { src: '/images/Linea%20de%20tiempo/1974_capa_1a.png', z: 4, px: 12, py: 8,  dur: 0.62 },
  { src: '/images/Linea%20de%20tiempo/1974-capa-3.png',  z: 6, px: 16, py: 10, dur: 0.42 },
  { src: '/images/Linea%20de%20tiempo/1974-capa-4.png',  z: 8, px: 22, py: 14, dur: 0.26 },
];

const EVENTS = [
  { year: '1966', title: 'Donde todo comenzó',                    body: 'Arrendamientos Santa Fe nace en Medellín con una visión de servicio, confianza y acompañamiento inmobiliario.',                                                                             layers: L66 },
  { year: '1974', title: 'Primeros cimientos',                    body: 'La empresa fortalece su presencia y consolida una operación más cercana para propietarios y clientes.',                                                                                      layers: L74 },
  { year: '2006', title: 'Reconocimiento y consolidación',        body: 'Cuatro décadas de trabajo reflejan una trayectoria construida con compromiso, seriedad y respaldo.',                                                                                        layers: L66 },
  { year: '2017', title: 'Más cerca de nuestros clientes',        body: 'Con la apertura de la sede en Envigado, Santa Fe amplía su presencia y fortalece su cercanía con nuevas zonas del Valle de Aburrá.',                                                        layers: L74 },
  { year: '2018', title: 'Evolución de marca',                    body: 'Arrendamientos Santa Fe renueva su imagen para proyectar una empresa más actual, cercana y coherente con su evolución.',                                                                     layers: L66 },
  { year: '2026', title: '60 años acompañando nuevas decisiones', body: 'Santa Fe celebra seis décadas de historia con una nueva etapa: la apertura de su sede en Rionegro, reafirmando su compromiso de estar más cerca de quienes toman decisiones inmobiliarias.', layers: L74 },
];

export default function Historia60Page({ onNavigate }: Props) {
  const wrapperRef       = useRef<HTMLDivElement>(null);
  const panelContainerRef = useRef<HTMLDivElement>(null); // the 16:9 constrained box
  const panelRefs        = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
  const textRefs         = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
  const dotRefs          = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
  const yearRefs         = useRef<(HTMLSpanElement | null)[]>(Array(N).fill(null));

  const imgRefs  = useRef<(HTMLImageElement | null)[][]>(EVENTS.map(() => Array(4).fill(null)));
  const pxSets   = useRef<((v: number) => void)[][]>(EVENTS.map(() => []));
  const pySets   = useRef<((v: number) => void)[][]>(EVENTS.map(() => []));
  const activeRef = useRef(0);

  // ── Parallax quickTo setup ────────────────────────────────────
  useEffect(() => {
    EVENTS.forEach((evt, pi) => {
      evt.layers.forEach((layer, li) => {
        const img = imgRefs.current[pi]?.[li];
        if (!img) return;
        pxSets.current[pi][li] = gsap.quickTo(img, 'x', { duration: layer.dur, ease: 'power3.out' });
        pySets.current[pi][li] = gsap.quickTo(img, 'y', { duration: layer.dur, ease: 'power3.out' });
      });
    });
  }, []);

  const resetParallax = (pi: number) => {
    EVENTS[pi]?.layers.forEach((_l, li) => {
      pxSets.current[pi][li]?.(0);
      pySets.current[pi][li]?.(0);
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const pi = activeRef.current;
    const panel = panelRefs.current[pi];
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width  - 0.5;
    const dy = (e.clientY - rect.top)  / rect.height - 0.5;
    EVENTS[pi].layers.forEach((l, li) => {
      pxSets.current[pi][li]?.(dx * l.px * 2);
      pySets.current[pi][li]?.(dy * l.py * 2);
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
      yearRefs.current.forEach((s, i)  => { if (s)  gsap.set(s,  { opacity: i === 0 ? 1 : 0.35 }); });

      if (reduced) return;

      for (let i = 0; i < N - 1; i++) {
        const ic      = i;
        const EW_cur  = CW_total - ic * CW;
        const EW_next = CW_total - (ic + 1) * CW;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: `top+=${ic * window.innerHeight} top`,
            end:   `top+=${(ic + 1) * window.innerHeight} top`,
            scrub: 1.2,
            onEnter:     () => { activeRef.current = ic + 1; resetParallax(ic); },
            onLeaveBack: () => { activeRef.current = ic;     resetParallax(ic + 1); },
          },
        });

        tl.fromTo(panelRefs.current[ic],     { width: EW_cur  }, { width: CW,      ease: 'none' }, 0)
          .fromTo(panelRefs.current[ic + 1], { width: 0       }, { width: EW_next, ease: 'none' }, 0)
          .fromTo(textRefs.current[ic],      { opacity: 1, y: 0  }, { opacity: 0, y: -10, ease: 'none' }, 0)
          .fromTo(textRefs.current[ic + 1],  { opacity: 0, y: 12 }, { opacity: 1, y: 0,   ease: 'none' }, 0)
          .fromTo(dotRefs.current[ic],       { scale: 1.8 }, { scale: 1,   ease: 'none' }, 0)
          .fromTo(dotRefs.current[ic + 1],   { scale: 1   }, { scale: 1.8, ease: 'none' }, 0)
          .fromTo(yearRefs.current[ic],      { opacity: 1    }, { opacity: 0.35, ease: 'none' }, 0)
          .fromTo(yearRefs.current[ic + 1],  { opacity: 0.35 }, { opacity: 1,    ease: 'none' }, 0);
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  // ── JSX ───────────────────────────────────────────────────────
  return (
    <div style={{ background: '#fff' }}>

      {/* ── Article hero ──────────────────────────────────────── */}
      <div style={{
        background: DARK, position: 'relative', overflow: 'hidden',
        marginTop: '-86px', paddingTop: 120, paddingBottom: 64,
        paddingLeft: 'clamp(24px,6vw,96px)', paddingRight: 'clamp(24px,6vw,96px)',
      }}>
        <span aria-hidden="true" style={{
          position: 'absolute', right: '-2%', top: '-10%',
          fontFamily: FONT, fontWeight: 900,
          fontSize: 'clamp(200px,28vw,380px)',
          color: 'rgba(255,255,255,0.04)', lineHeight: 1,
          userSelect: 'none', pointerEvents: 'none',
        }}>60</span>
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
          <h1 style={{
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

      {/* ── Horizontal scroll experience ──────────────────────── */}
      <div ref={wrapperRef} style={{ height: `${N * 100}vh`, background: '#fff' }}>
        <div
          style={{
            position: 'sticky', top: 0, width: '100%', height: '100vh',
            background: '#fff',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-start',
            paddingTop: 86,  // header height — panel starts right below the nav
            gap: 16,
          }}
        >

          {/* ── Panels — constrained to MAX_W, 16:9 ratio ──────── */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={() => resetParallax(activeRef.current)}
            ref={panelContainerRef}
            style={{
              width: '100%',
              maxWidth: MAX_W,
              // Height derived from aspect ratio — always shows full image
              aspectRatio: '16/9',
              overflow: 'hidden',
              display: 'flex',
              position: 'relative',
              boxShadow: '0 8px 48px rgba(0,0,0,0.18)',
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
                  flexShrink: 0,
                  background: '#0a0a0a',
                  width: pi === 0 ? '100%' : 0,
                  borderRight: pi < N - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}
              >
                {/* Parallax image layers — contain: show full 1920×1080 canvas */}
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
                      objectFit: 'contain',
                      display: 'block',
                      zIndex: layer.z, pointerEvents: 'none',
                    }}
                  />
                ))}

                {/* Collapsed year strip */}
                <div style={{
                  position: 'absolute', top: 0, left: 0,
                  width: CW, height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 25, pointerEvents: 'none',
                }}>
                  <span style={{
                    fontFamily: FONT, fontWeight: 900, fontSize: 8,
                    letterSpacing: '0.22em', color: 'rgba(255,255,255,0.4)',
                    writingMode: 'vertical-rl', transform: 'rotate(180deg)',
                    userSelect: 'none',
                  }}>
                    {evt.year}
                  </span>
                </div>

                {/* Text overlay */}
                <div
                  ref={el => { textRefs.current[pi] = el; }}
                  style={{
                    position: 'absolute',
                    bottom: 'clamp(16px,3vh,32px)',
                    left: CW + 20,
                    zIndex: 20,
                    maxWidth: 340,
                    pointerEvents: 'none',
                  }}
                >
                  <h3 style={{
                    fontFamily: FONT, fontWeight: 700,
                    fontSize: 'clamp(16px,1.8vw,26px)',
                    color: '#fff', lineHeight: 1.2, margin: '0 0 8px',
                  }}>
                    {evt.title}
                  </h3>
                  <p style={{
                    fontFamily: FONT, fontWeight: 300,
                    fontSize: 'clamp(11px,0.8vw,13px)',
                    color: 'rgba(255,255,255,0.75)',
                    lineHeight: 1.7, margin: 0,
                  }}>
                    {evt.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Timeline bar ─────────────────────────────────────── */}
          <div style={{
            width: '100%',
            maxWidth: MAX_W,
            position: 'relative',
            height: 52,
            display: 'flex',
          }}>
            {/* Connecting line */}
            <div style={{
              position: 'absolute',
              top: '50%', left: 0, right: 0,
              height: 2, background: DARK,
              transform: 'translateY(-50%)',
              zIndex: 1,
            }} />

            {/* Dots + years */}
            {EVENTS.map((evt, pi) => (
              <div
                key={evt.year}
                style={{
                  flex: 1, height: '100%',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 6, zIndex: 2, position: 'relative',
                }}
              >
                <span
                  ref={el => { yearRefs.current[pi] = el; }}
                  style={{
                    fontFamily: FONT, fontWeight: 900,
                    fontSize: 10, letterSpacing: '0.1em',
                    color: DARK, whiteSpace: 'nowrap',
                    userSelect: 'none',
                  }}
                >
                  {evt.year}
                </span>
                <div
                  ref={el => { dotRefs.current[pi] = el; }}
                  style={{
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

    </div>
  );
}
