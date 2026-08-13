'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';

const slides = [
  {
    num: '01',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80',
    big: '+200',
    text: 'colaboradores acompañando procesos inmobiliarios',
  },
  {
    num: '02',
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80',
    big: undefined as string | undefined,
    text: 'Miles de clientes han confiado en nuestra gestión a lo largo de seis décadas.',
  },
  {
    num: '03',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
    big: undefined as string | undefined,
    text: 'Presencia en Antioquia con conocimiento local y acompañamiento cercano en cada proceso.',
  },
];

export default function NosotrosBanner() {
  const [active, setActive] = useState(0);
  const isAnimating = useRef(false);
  const textRef    = useRef<HTMLDivElement>(null);
  const imgRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  /* ── Cambio de slide ── */
  const goTo = (idx: number) => {
    if (isAnimating.current || idx === active) return;
    isAnimating.current = true;

    const text = textRef.current;
    if (!text) { isAnimating.current = false; return; }

    // Crossfade de imágenes
    imgRefs.current.forEach((div, i) => {
      if (!div) return;
      gsap.to(div, { opacity: i === idx ? 1 : 0, duration: 0.6, ease: 'power2.inOut' });
    });

    // Fade-out texto → actualiza estado → fade-in
    gsap.to(text, {
      opacity: 0, y: -14, duration: 0.22, ease: 'power2.in',
      onComplete: () => {
        setActive(idx);
        gsap.fromTo(text,
          { opacity: 0, y: 18 },
          {
            opacity: 1, y: 0, duration: 0.38, ease: 'power2.out',
            onComplete: () => { isAnimating.current = false; },
          }
        );
      },
    });
  };

  /* ── Entrada en viewport ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.from(section, {
      opacity: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 88%', once: true },
    });
  }, []);

  const slide = slides[active];

  return (
    <section
      ref={sectionRef}
      aria-label="Trayectoria de Arrendamientos Santa Fe"
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(380px, 50vw, 580px)',
        overflow: 'hidden',
      }}
    >
      {/* ── Capas de imagen ── */}
      {slides.map((s, i) => (
        <div
          key={i}
          ref={el => { imgRefs.current[i] = el; }}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: i === 0 ? 1 : 0,
            backgroundImage: `url(${s.img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            willChange: 'opacity',
          }}
        />
      ))}

      {/* ── Overlay degradado ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(8,8,8,0.88) 0%, rgba(8,8,8,0.52) 52%, rgba(8,8,8,0.12) 100%)',
        }}
      />

      {/* ── Contenido ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'clamp(24px, 4vw, 60px) clamp(20px, 5vw, 76px)',
          maxWidth: '1400px',
          margin: '0 auto',
          left: 0,
          right: 0,
        }}
      >
        {/* Texto animado */}
        <div ref={textRef} style={{ marginBottom: 30 }}>
          {slide.big && (
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize:   'clamp(56px, 7.5vw, 100px)',
                color:      RED,
                lineHeight: 1,
                display:    'block',
                marginBottom: 8,
              }}
            >
              {slide.big}
            </span>
          )}
          <p
            style={{
              fontFamily: FONT,
              fontWeight: 300,
              fontSize:   'clamp(17px, 1.9vw, 28px)',
              color:      '#fff',
              lineHeight: 1.42,
              maxWidth:   530,
              margin:     0,
            }}
          >
            {slide.text}
          </p>
        </div>

        {/* Botones 01 / 02 / 03 */}
        <div style={{ display: 'flex', gap: 8 }}>
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Ver sección ${s.num}`}
              aria-pressed={i === active}
              style={{
                fontFamily:    FONT,
                fontWeight:    700,
                fontSize:      13,
                letterSpacing: '0.06em',
                padding:       '9px 24px',
                border:        `2px solid ${i === active ? RED : 'rgba(255,255,255,0.38)'}`,
                background:    i === active ? RED : 'transparent',
                color:         '#fff',
                cursor:        'pointer',
                transition:    'background 0.2s, border-color 0.2s',
                lineHeight:    1,
              }}
            >
              {s.num}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
