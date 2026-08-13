'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';

const IMAGES = [
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
];

interface Props {
  active: number;
  onSlideChange: (i: number) => void;
}

export default function NosotrosBanner({ active, onSlideChange }: Props) {
  const prevActive   = useRef(0);
  const imgRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef   = useRef<HTMLElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);

  /* Crossfade cuando cambia active */
  useEffect(() => {
    if (prevActive.current === active) return;
    imgRefs.current.forEach((div, i) => {
      if (!div) return;
      gsap.to(div, { opacity: i === active ? 1 : 0, duration: 0.55, ease: 'power2.inOut' });
    });
    prevActive.current = active;
  }, [active]);

  /* Entrada viewport + animación subrayado */
  useEffect(() => {
    const section   = sectionRef.current;
    const underline = underlineRef.current;
    if (!section) return;

    const st = gsap.from(section, {
      opacity: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 88%', once: true },
    });

    let ulSt: gsap.core.Tween | undefined;
    if (underline) {
      ulSt = gsap.fromTo(
        underline,
        { scaleX: 0 },
        {
          scaleX: 1, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        }
      );
    }

    return () => {
      st.scrollTrigger?.kill(); st.kill();
      ulSt?.scrollTrigger?.kill(); ulSt?.kill();
    };
  }, []);

  const prev = () => onSlideChange((active + IMAGES.length - 1) % IMAGES.length);
  const next = () => onSlideChange((active + 1) % IMAGES.length);

  return (
    <>
      <style>{`
        /* --- Desktop defaults --- */
        .nb-arrow    { display: none !important; }
        .nb-dots     { display: none !important; }
        .nb-underline { display: block; }
        .nb-subtitle  { line-height: 1.65; }
        .nb-br        { display: inline; }

        /* --- Mobile overrides --- */
        @media (max-width: 768px) {
          .nb-arrow {
            display: flex !important;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            background: rgba(0, 0, 0, 0.45);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 20;
            color: #fff;
            -webkit-tap-highlight-color: transparent;
          }
          .nb-arrow-prev { left: 14px; }
          .nb-arrow-next { right: 14px; }

          .nb-dots { display: flex !important; }

          .nb-underline { display: none; }

          .nb-subtitle { line-height: 1.2 !important; }

          .nb-br { display: none; }
        }
      `}</style>

      <section
        ref={sectionRef}
        aria-label="Quiénes somos — Arrendamientos Santa Fe"
        style={{
          position: 'relative', width: '100%',
          height: 'clamp(300px, 52vw, 600px)', overflow: 'hidden',
        }}
      >
        {/* Capas de imagen */}
        {IMAGES.map((src, i) => (
          <div
            key={i}
            ref={el => { imgRefs.current[i] = el; }}
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              opacity: i === 0 ? 1 : 0,
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              willChange: 'opacity',
            }}
          />
        ))}

        {/* Overlay oscuro */}
        <div aria-hidden="true"
          style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.58)' }} />

        {/* Título + subtítulo */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          textAlign: 'center',
          padding: '0 clamp(52px, 8vw, 140px)',
        }}>
          <h2 style={{
            fontFamily: FONT, fontWeight: 300,
            fontSize: 'clamp(20px, 3.4vw, 52px)',
            color: '#fff', lineHeight: 1.1,
            margin: '0 0 14px',
          }}>
            Somos una inmobiliaria antioqueña
            <span className="nb-br" aria-hidden="true"><br /></span>{' '}
            con <span style={{ fontWeight: 700 }}>60 años de trayectoria.</span>
          </h2>

          {/* Línea animada — solo desktop */}
          <div
            className="nb-underline"
            ref={underlineRef}
            style={{
              width: 'clamp(60px, 7vw, 100px)', height: 3,
              background: RED, borderRadius: 2,
              transformOrigin: 'left center',
              marginBottom: 18,
            }}
          />

          <p
            className="nb-subtitle"
            style={{
              fontFamily: FONT, fontWeight: 300,
              fontSize: 'clamp(12px, 1.05vw, 16px)',
              color: 'rgba(255,255,255,0.82)',
              maxWidth: '54rem', margin: 0,
            }}
          >
            Desde 1966 acompañamos a personas, familias, propietarios, empresas e inversionistas
            en decisiones de arrendamiento, venta, compra, administración y consignación de inmuebles.
          </p>
        </div>

        {/* Flechas — solo mobile */}
        <button className="nb-arrow nb-arrow-prev" onClick={prev} aria-label="Slide anterior">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button className="nb-arrow nb-arrow-next" onClick={next} aria-label="Slide siguiente">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Dots — solo mobile */}
        <div className="nb-dots" style={{
          position: 'absolute', bottom: 14,
          left: '50%', transform: 'translateX(-50%)',
          gap: 8, alignItems: 'center',
        }}>
          {IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => onSlideChange(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === active ? 22 : 8, height: 8, borderRadius: 4,
                background: i === active ? RED : 'rgba(255,255,255,0.45)',
                border: 'none', padding: 0, cursor: 'pointer',
                transition: 'all 0.3s ease',
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      </section>
    </>
  );
}
