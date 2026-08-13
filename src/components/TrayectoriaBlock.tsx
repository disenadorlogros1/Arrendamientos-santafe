'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PageType } from '@/components/Header';

gsap.registerPlugin(ScrollTrigger);

function applyInkFill(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const size = Math.max(
    Math.hypot(x, y), Math.hypot(rect.width - x, y),
    Math.hypot(x, rect.height - y), Math.hypot(rect.width - x, rect.height - y),
  ) * 2;
  el.style.setProperty('--x', `${x}px`);
  el.style.setProperty('--y', `${y}px`);
  el.style.setProperty('--size', `${size}px`);
}

interface TrayectoriaBlockProps {
  onNavigate: (page: PageType) => void;
}

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';

const YEARS = ['1966', '1974', '2006', '2017', '2018', '2026'];

const LAYERS = [
  { src: '/images/Linea%20de%20tiempo/1966-Fondo.webp',            z: 2 },
  { src: '/images/Linea%20de%20tiempo/1966-fecha-1.webp',          z: 4 },
  { src: '/images/Linea%20de%20tiempo/1966-fecha-2.webp',          z: 6 },
  { src: '/images/Linea%20de%20tiempo/1966-recorte-superior.webp', z: 8 },
  { src: '/images/Linea%20de%20tiempo/1966-superior.webp',         z: 10 },
];

/*
  Parallax rates (y travel in px across the full scroll range of the section).
  Positive = layer moves DOWN as user scrolls (appears farther away).
  Negative = layer moves UP faster than container (appears closer).

  Fase 1 usa autoAlpha + scale  → no usa la propiedad y
  Fase 2 usa y                  → no usa autoAlpha ni scale
  → cero conflicto entre fases; GSAP compone ambas en el mismo transform.
*/
const PARALLAX = [
   40,   // Fondo: lento, parece lejano
  -45,   // fecha-1: sube moderado
  -70,   // fecha-2: sube más
  -95,   // recorte-superior: sube bastante
 -120,   // superior: sube más — se percibe al frente
];

export default function TrayectoriaBlock({ onNavigate }: TrayectoriaBlockProps) {
  const sectionRef  = useRef<HTMLElement>(null);
  const imgRefs     = useRef<(HTMLImageElement | null)[]>([]);
  const textRef     = useRef<HTMLDivElement>(null);
  const tlRef       = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const imgs = imgRefs.current.filter(Boolean) as HTMLImageElement[];

      /* ── Estado inicial: invisible ── */
      gsap.set([...imgs, textRef.current, tlRef.current], { autoAlpha: 0 });

      /* ══ FASE 1 — Entrada escalonada al viewport ══════════════
         Usa solo autoAlpha (opacity+visibility) y scale.
         NO toca la propiedad y → sin conflicto con Fase 2.        */
      const entrance = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          once: true,
        },
      });

      /* Fondo: fade in + ligero zoom-out */
      entrance.fromTo(imgs[0],
        { autoAlpha: 0, scale: 1.07 },
        { autoAlpha: 1, scale: 1, duration: 1.25, ease: 'power2.out' }
      );

      /* Capas del año (fecha-1, fecha-2): se revelan con stagger */
      if (imgs[1] && imgs[2]) {
        entrance.fromTo([imgs[1], imgs[2]],
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.70, stagger: 0.20, ease: 'power2.out' },
          '-=0.85'
        );
      }

      /* Recortes fotográficos */
      if (imgs[3] && imgs[4]) {
        entrance.fromTo([imgs[3], imgs[4]],
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.65, stagger: 0.14, ease: 'power2.out' },
          '-=0.50'
        );
      }

      /* Texto y timeline */
      entrance.fromTo([textRef.current, tlRef.current],
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.50, stagger: 0.10, ease: 'power2.out' },
        '-=0.35'
      );

      /* ══ FASE 2 — Parallax continuo mientras se hace scroll ══
         Usa solo y (translateY).
         NO toca autoAlpha ni scale → sin conflicto con Fase 1.    */
      imgs.forEach((img, i) => {
        if (!img) return;
        gsap.to(img, {
          y: PARALLAX[i],
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end:   'bottom top',
            scrub: 1.4,
          },
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full overflow-hidden" style={{ background: '#0c0c0c' }}>

      <div style={{ position: 'relative', width: '100%', height: 'clamp(260px, 40vw, 600px)', overflow: 'hidden' }}>

        {LAYERS.map((layer, i) => (
          <img
            key={i}
            ref={el => { imgRefs.current[i] = el; }}
            src={layer.src}
            alt=""
            aria-hidden
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: '50% 50%',
              zIndex: layer.z, pointerEvents: 'none', display: 'block',
            }}
          />
        ))}

        {/* Degradado inferior */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 15,
          background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Texto + botón */}
        <div
          ref={textRef}
          style={{
            position: 'absolute',
            bottom: 'clamp(52px, 8vw, 88px)',
            left: 'clamp(20px, 5vw, 72px)',
            zIndex: 20,
            maxWidth: 'clamp(220px, 36vw, 460px)',
          }}
        >
          <h2 style={{
            fontFamily: FONT, fontWeight: 700,
            fontSize: 'clamp(15px, 1.8vw, 26px)',
            color: '#fff', lineHeight: 1.2, margin: '0 0 8px',
          }}>
            Donde todo comenzó
          </h2>
          <p style={{
            fontFamily: FONT, fontWeight: 300,
            fontSize: 'clamp(11px, 0.9vw, 14px)',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.65, margin: '0 0 16px',
          }}>
            Arrendamientos Santa Fe nace en Medellín con una visión de servicio,
            confianza y acompañamiento inmobiliario.
          </p>
          <button
            type="button"
            onClick={() => { onNavigate('historia-60'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onMouseEnter={applyInkFill}
            onMouseLeave={applyInkFill}
            className="btn-red-outline"
            style={{ fontSize: 'clamp(11px, 0.85vw, 13px)', height: 38, padding: '0 18px' }}
          >
            <span>Conocer nuestra historia</span>
          </button>
        </div>

        {/* Timeline */}
        <div
          ref={tlRef}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            zIndex: 20,
            padding: '0 clamp(20px,5vw,72px)',
            height: 'clamp(36px, 4vw, 52px)',
            display: 'flex', alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative', flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{
              position: 'absolute', top: '50%', left: 0, right: 0,
              height: 1, background: 'rgba(255,255,255,0.22)',
              transform: 'translateY(-50%)',
            }} />
            {YEARS.map((year, i) => (
              <div key={year} style={{
                position: 'absolute',
                left: `${(i / (YEARS.length - 1)) * 100}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
              }}>
                <div style={{
                  width:  i === 0 ? 10 : 7,
                  height: i === 0 ? 10 : 7,
                  borderRadius: '50%',
                  background: i === 0 ? RED : 'rgba(255,255,255,0.35)',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: FONT,
                  fontSize: 'clamp(8px, 0.7vw, 11px)',
                  fontWeight: i === 0 ? 700 : 400,
                  color: i === 0 ? RED : 'rgba(255,255,255,0.4)',
                  lineHeight: 1, whiteSpace: 'nowrap',
                }}>
                  {year}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
