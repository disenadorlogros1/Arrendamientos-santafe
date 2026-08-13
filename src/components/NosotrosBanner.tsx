'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";

const IMAGES = [
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
];

interface Props {
  active: number;
}

export default function NosotrosBanner({ active }: Props) {
  const prevActive = useRef(0);
  const imgRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  /* Crossfade cuando cambia active */
  useEffect(() => {
    if (prevActive.current === active) return;
    imgRefs.current.forEach((div, i) => {
      if (!div) return;
      gsap.to(div, { opacity: i === active ? 1 : 0, duration: 0.55, ease: 'power2.inOut' });
    });
    prevActive.current = active;
  }, [active]);

  /* Entrada viewport */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const st = gsap.from(section, {
      opacity: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 88%', once: true },
    });
    return () => { st.scrollTrigger?.kill(); st.kill(); };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Quiénes somos — Arrendamientos Santa Fe"
      style={{ position: 'relative', width: '100%', height: 'clamp(400px, 52vw, 600px)', overflow: 'hidden' }}
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

      {/* Overlay oscuro uniforme */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(10,10,10,0.58)',
        }}
      />

      {/* Título + subtítulo centrados */}
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          textAlign: 'center',
          padding: '0 clamp(20px, 8vw, 140px)',
        }}
      >
        <h2
          style={{
            fontFamily: FONT,
            fontWeight: 300,
            fontSize: 'clamp(24px, 3.4vw, 52px)',
            color: '#fff',
            lineHeight: 1.15,
            margin: '0 0 20px',
          }}
        >
          Somos una inmobiliaria antioqueña<br />
          con <span style={{ fontWeight: 700 }}>60 años de trayectoria.</span>
        </h2>
        <p
          style={{
            fontFamily: FONT,
            fontWeight: 300,
            fontSize: 'clamp(13px, 1.05vw, 16px)',
            color: 'rgba(255,255,255,0.82)',
            lineHeight: 1.65,
            maxWidth: '54rem',
            margin: 0,
          }}
        >
          Desde 1966 acompañamos a personas, familias, propietarios, empresas e inversionistas
          en decisiones de arrendamiento, venta, compra, administración y consignación de inmuebles.
        </p>
      </div>
    </section>
  );
}
