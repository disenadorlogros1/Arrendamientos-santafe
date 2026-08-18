'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';

const IMAGES = [
  '/images/Banners/banner_nosotros_1.webp',
  '/images/Banners/banner_nosotros_2.webp',
  '/images/Banners/banner_nosotros_3.webp',
];

interface Props {
  active: number;
  onSlideChange: (i: number) => void;
}

export default function NosotrosBanner({ active, onSlideChange }: Props) {
  const prevActive   = useRef(0);
  const imgRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef   = useRef<HTMLElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  /* Crossfade cuando cambia active */
  useEffect(() => {
    if (prevActive.current === active) return;
    imgRefs.current.forEach((div, i) => {
      if (!div) return;
      gsap.to(div, { opacity: i === active ? 1 : 0, duration: 0.55, ease: 'power2.inOut' });
    });
    prevActive.current = active;
  }, [active]);

  /* Entrada viewport + subrayado igual que el hero */
  useEffect(() => {
    const section   = sectionRef.current;
    const underline = underlineRef.current;
    if (!section) return;

    const st = gsap.from(section, {
      opacity: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 88%', once: true },
    });

    if (underline) {
      const isMob = window.innerWidth <= 768;
      gsap.set(underline, { scaleX: isMob ? 1 : 0 });
      if (!isMob) {
        gsap.to(underline, {
          scaleX: 1, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        });
      }
    }

    return () => { st.scrollTrigger?.kill(); st.kill(); };
  }, []);

  const prev = () => onSlideChange((active + IMAGES.length - 1) % IMAGES.length);
  const next = () => onSlideChange((active + 1) % IMAGES.length);

  return (
    <>
      <style>{`
        /* ── Desktop ── */
        .nb-arrow   { display: none !important; }
        .nb-dots    { display: none !important; }
        .nb-con-out { display: inline; }
        .nb-con-in  { display: none; }
        .nb-sub-d   { display: block; }
        .nb-sub-m   { display: none !important; }
        .nb-subtitle { line-height: 1.65; }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .nb-arrow {
            display: flex !important;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 44px;
            height: 44px;
            background: rgba(0, 0, 0, 0.38);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 20;
            -webkit-tap-highlight-color: transparent;
            padding: 10px;
          }
          .nb-arrow-prev { left: 12px; }
          .nb-arrow-next { right: 12px; }
          .nb-dots    { display: flex !important; }
          .nb-con-out { display: none; }
          .nb-con-in  { display: inline; }
          .nb-sub-d   { display: none !important; }
          .nb-sub-m   { display: block !important; }
          .nb-subtitle { line-height: 1.2 !important; }
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

        {/* Título + subtítulo — flex column igual que el hero */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          textAlign: 'center',
          padding: '0 clamp(52px, 8vw, 140px)',
        }}>
          {/*
            h2 como flex column con alignItems center:
            — cada <span> es flex item, su ancho = ancho del contenido
            — overflow hidden funciona sobre flex items (igual que el hero)
            — el underline width 100% = ancho del texto, no del contenedor
          */}
          <h2 style={{
            fontFamily: FONT, fontWeight: 300,
            fontSize: 'clamp(20px, 3.4vw, 52px)',
            color: '#fff', lineHeight: 0.3,
            margin: '0 0 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
          }}>
            {/* Línea 1:
                Desktop → "Somos una inmobiliaria antioqueña con"
                Mobile  → "Somos una inmobiliaria antioqueña"      */}
            <span>
              Una inmobiliaria antioqueña
              <span className="nb-con-out"> con</span>
            </span>

            {/* Línea 2 con subrayado (igual al hero del home):
                Desktop → "60 años de trayectoria."
                Mobile  → "con 60 años de trayectoria."            */}
            <span style={{
              fontWeight: 700,
              position: 'relative',
              overflow: 'hidden',
              marginTop: '-0.28em',
            }}>
              <span style={{ position: 'relative', zIndex: 2 }}>
                <span className="nb-con-in">con </span>
                60 años de trayectoria.
              </span>
              <span
                ref={underlineRef}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '62%',
                  left: 0,
                  width: '100%',
                  height: '13%',
                  backgroundColor: RED,
                  transformOrigin: 'left center',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />
            </span>
          </h2>

          {/* Subtítulo desktop: "Desde 1966..." */}
          <p
            className="nb-subtitle nb-sub-d"
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

          {/* Subtítulo mobile: "Inmobiliaria antioqueña..." (swapped desde el hero) */}
          <p
            className="nb-subtitle nb-sub-m"
            style={{
              fontFamily: FONT, fontWeight: 300,
              fontSize: 'clamp(12px, 1.05vw, 16px)',
              color: 'rgba(255,255,255,0.82)',
              maxWidth: '54rem', margin: 0,
            }}
          >
            Inmobiliaria antioqueña con más de 60 años de trayectoria.
          </p>
        </div>

        {/* Flechas con SVGs del proyecto — solo mobile */}
        <button className="nb-arrow nb-arrow-prev" onClick={prev} aria-label="Slide anterior">
          <img
            src="/icons/icon-arrow-right-white.svg"
            alt=""
            aria-hidden="true"
            style={{ width: '100%', height: '100%', transform: 'scaleX(-1)' }}
          />
        </button>
        <button className="nb-arrow nb-arrow-next" onClick={next} aria-label="Slide siguiente">
          <img
            src="/icons/icon-arrow-right-white.svg"
            alt=""
            aria-hidden="true"
            style={{ width: '100%', height: '100%' }}
          />
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
