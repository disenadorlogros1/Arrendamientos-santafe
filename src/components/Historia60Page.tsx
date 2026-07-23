'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PageType } from '@/components/Header';

gsap.registerPlugin(ScrollTrigger);

interface Props { onNavigate: (page: PageType) => void; }

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';
const DARK = '#1a1a1a';
const N    = 6;   // total panels
const CW   = 80;  // collapsed panel width (px)

type LayerCfg = { src: string; z: number; px: number; py: number; dur: number };

const L66: LayerCfg[] = [
  { src: '/images/Linea%20de%20tiempo/1966_capa_1b.png', z: 2, px: 8,  py: 5,  dur: 0.85 },
  { src: '/images/Linea%20de%20tiempo/1966_capa_1a.png', z: 4, px: 16, py: 10, dur: 0.62 },
  { src: '/images/Linea%20de%20tiempo/1966_capa_3.png',  z: 6, px: 24, py: 15, dur: 0.42 },
  { src: '/images/Linea%20de%20tiempo/1966_capa_4.png',  z: 8, px: 34, py: 21, dur: 0.26 },
];

const L74: LayerCfg[] = [
  { src: '/images/Linea%20de%20tiempo/1974_capa_1b.png', z: 2, px: 8,  py: 5,  dur: 0.85 },
  { src: '/images/Linea%20de%20tiempo/1974_capa_1a.png', z: 4, px: 15, py: 10, dur: 0.62 },
  { src: '/images/Linea%20de%20tiempo/1974-capa-3.png',  z: 6, px: 22, py: 14, dur: 0.42 },
  { src: '/images/Linea%20de%20tiempo/1974-capa-4.png',  z: 8, px: 30, py: 19, dur: 0.26 },
];

const EVENTS = [
  { year: '1966', title: 'Donde todo comenzó',                   body: 'Arrendamientos Santa Fe nace en Medellín con una visión de servicio, confianza y acompañamiento inmobiliario.',                                                                             layers: L66 },
  { year: '1974', title: 'Primeros cimientos',                   body: 'La empresa fortalece su presencia y consolida una operación más cercana para propietarios y clientes.',                                                                                      layers: L74 },
  { year: '2006', title: 'Reconocimiento y consolidación',       body: 'Cuatro décadas de trabajo reflejan una trayectoria construida con compromiso, seriedad y respaldo.',                                                                                        layers: L66 },
  { year: '2017', title: 'Más cerca de nuestros clientes',       body: 'Con la apertura de la sede en Envigado, Santa Fe amplía su presencia y fortalece su cercanía con nuevas zonas del Valle de Aburrá.',                                                        layers: L74 },
  { year: '2018', title: 'Evolución de marca',                   body: 'Arrendamientos Santa Fe renueva su imagen para proyectar una empresa más actual, cercana y coherente con su evolución.',                                                                     layers: L66 },
  { year: '2026', title: '60 años acompañando nuevas decisiones',body: 'Santa Fe celebra seis décadas de historia con una nueva etapa: la apertura de su sede en Rionegro, un paso que reafirma su compromiso de estar más cerca de quienes toman decisiones inmobiliarias en el Oriente Antioqueño.', layers: L74 },
];

export default function Historia60Page({ onNavigate }: Props) {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const panelRefs   = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
  const tlItemRefs  = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
  const textRefs    = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
  const dotRefs     = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
  const yearRefs    = useRef<(HTMLSpanElement | null)[]>(Array(N).fill(null));

  // imgRefs[panel][layer], pxSets/pySets[panel][layer]
  const imgRefs = useRef<(HTMLImageElement | null)[][]>(EVENTS.map(() => Array(4).fill(null)));
  const pxSets  = useRef<((v: number) => void)[][]>(EVENTS.map(() => []));
  const pySets  = useRef<((v: number) => void)[][]>(EVENTS.map(() => []));
  const activeRef = useRef(0);

  // ── Parallax GSAP quickTo setup ──────────────────────────────
  useEffect(() => {
    EVENTS.forEach((evt, pi) => {
      evt.layers.forEach((layer, li) => {
        const img = imgRefs.current[pi]?.[li];
        if (!img) return;
        gsap.set(img, { scale: 1.08, transformOrigin: 'center center' });
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

  // ── ScrollTrigger: panel expand / collapse ───────────────────
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const EW = window.innerWidth - (N - 1) * CW;

      // Set pixel widths (replace CSS calc)
      panelRefs.current.forEach((p, i)  => { if (p) gsap.set(p, { width: i === 0 ? EW : CW }); });
      tlItemRefs.current.forEach((t, i) => { if (t) gsap.set(t, { width: i === 0 ? EW : CW }); });

      // Initial visibility
      textRefs.current.forEach((el, i) => { if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 16 }); });
      dotRefs.current.forEach((d, i)   => { if (d)  gsap.set(d,  { scale: i === 0 ? 1.8 : 1 }); });
      yearRefs.current.forEach((s, i)  => { if (s)  gsap.set(s,  { opacity: i === 0 ? 1 : 0.4 }); });

      if (reduced) return;

      for (let i = 0; i < N - 1; i++) {
        const ic = i;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: `top+=${ic * window.innerHeight} top`,
            end:   `top+=${(ic + 1) * window.innerHeight} top`,
            scrub: 1.4,
            onEnter:     () => { activeRef.current = ic + 1; resetParallax(ic); },
            onLeaveBack: () => { activeRef.current = ic;     resetParallax(ic + 1); },
          },
        });

        // Panel widths
        tl.to(panelRefs.current[ic],     { width: CW, ease: 'none' }, 0)
          .to(panelRefs.current[ic + 1], { width: EW, ease: 'none' }, 0);

        // Timeline item widths (mirror panels)
        tl.to(tlItemRefs.current[ic],     { width: CW, ease: 'none' }, 0)
          .to(tlItemRefs.current[ic + 1], { width: EW, ease: 'none' }, 0);

        // Text fade
        tl.to(textRefs.current[ic],     { opacity: 0, y: -12, ease: 'none' }, 0)
          .to(textRefs.current[ic + 1], { opacity: 1, y: 0,   ease: 'none' }, 0);

        // Dot + year
        tl.to(dotRefs.current[ic],     { scale: 1,   ease: 'none' }, 0)
          .to(dotRefs.current[ic + 1], { scale: 1.8, ease: 'none' }, 0)
          .to(yearRefs.current[ic],    { opacity: 0.4, ease: 'none' }, 0)
          .to(yearRefs.current[ic+1],  { opacity: 1,   ease: 'none' }, 0);
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
      <div ref={wrapperRef} style={{ height: `${N * 100}vh` }}>
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={() => resetParallax(activeRef.current)}
          style={{
            position: 'sticky', top: 0, width: '100%', height: '100vh',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            background: DARK,
          }}
        >

          {/* ── Panels track ───────────────────────────────────── */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
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
                  // CSS initial — GSAP replaces with pixel value after mount
                  width: pi === 0 ? `calc(100vw - ${(N - 1) * CW}px)` : CW,
                  borderRight: pi < N - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}
              >
                {/* Image layers */}
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
                      display: 'block',
                      zIndex: layer.z,
                      pointerEvents: 'none',
                    }}
                  />
                ))}

                {/* Collapsed year label (always in the left strip) */}
                <div style={{
                  position: 'absolute', top: 0, left: 0,
                  width: CW, height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 30, pointerEvents: 'none',
                }}>
                  <span style={{
                    fontFamily: FONT, fontWeight: 900, fontSize: 9,
                    letterSpacing: '0.22em', color: 'rgba(255,255,255,0.45)',
                    writingMode: 'vertical-rl', transform: 'rotate(180deg)',
                    userSelect: 'none',
                  }}>
                    {evt.year}
                  </span>
                </div>

                {/* Text overlay — fades in when expanded */}
                <div
                  ref={el => { textRefs.current[pi] = el; }}
                  style={{
                    position: 'absolute',
                    bottom: 'clamp(28px,5vh,60px)',
                    left: CW + 28,
                    zIndex: 20,
                    maxWidth: 400,
                    pointerEvents: 'none',
                  }}
                >
                  <h3 style={{
                    fontFamily: FONT, fontWeight: 700,
                    fontSize: 'clamp(22px,2.6vw,38px)',
                    color: '#fff', lineHeight: 1.15,
                    margin: '0 0 14px',
                  }}>
                    {evt.title}
                  </h3>
                  <p style={{
                    fontFamily: FONT, fontWeight: 300,
                    fontSize: 'clamp(12px,1vw,15px)',
                    color: 'rgba(255,255,255,0.72)',
                    lineHeight: 1.75, margin: 0,
                  }}>
                    {evt.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Timeline bar ────────────────────────────────────── */}
          <div style={{
            height: 80, flexShrink: 0,
            background: '#fff',
            display: 'flex',
            position: 'relative',
          }}>
            {/* Black connecting line */}
            <div style={{
              position: 'absolute',
              top: '50%', left: 0, right: 0,
              height: 2, background: DARK,
              transform: 'translateY(-50%)',
              zIndex: 1,
            }} />

            {/* Per-panel dot + year — widths mirrored with panels */}
            {EVENTS.map((evt, pi) => (
              <div
                key={evt.year}
                ref={el => { tlItemRefs.current[pi] = el; }}
                style={{
                  position: 'relative',
                  height: '100%',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  zIndex: 2,
                  // CSS initial — GSAP replaces after mount
                  width: pi === 0 ? `calc(100vw - ${(N - 1) * CW}px)` : CW,
                  overflow: 'hidden',
                }}
              >
                <span
                  ref={el => { yearRefs.current[pi] = el; }}
                  style={{
                    fontFamily: FONT, fontWeight: 900,
                    fontSize: 11, letterSpacing: '0.1em',
                    color: DARK, whiteSpace: 'nowrap',
                    userSelect: 'none',
                  }}
                >
                  {evt.year}
                </span>
                <div
                  ref={el => { dotRefs.current[pi] = el; }}
                  style={{
                    width: 10, height: 10,
                    borderRadius: '50%',
                    background: RED,
                    flexShrink: 0,
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
