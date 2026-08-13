'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';

const facts = [
  {
    dt: 'Fundados en Medellín en 1966',
    dd: 'Más de seis décadas acompañando a propietarios, arrendatarios, compradores e inversionistas en Antioquia.',
  },
  {
    dt: 'Tres sedes en Antioquia',
    dd: 'Medellín · Envigado · Rionegro — presencia local con conocimiento real del mercado inmobiliario.',
  },
  {
    dt: 'Cinco servicios especializados',
    dd: 'Arrendamiento, ventas, consignación, avalúos comerciales e hipotecas, bajo un mismo respaldo.',
  },
];

export default function NosotrosBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRef  = useRef<HTMLSpanElement>(null);
  const factsRef   = useRef<HTMLDListElement>(null);
  const labelRef   = useRef<HTMLSpanElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section  = sectionRef.current;
    const number   = numberRef.current;
    const factsList = factsRef.current;
    if (!section || !number || !factsList) return;

    const triggers: ScrollTrigger[] = [];

    // Counter 0 → 60
    const obj = { val: 0 };
    const tCounter = gsap.to(obj, {
      val: 60,
      duration: 1.8,
      ease: 'power3.out',
      onUpdate: () => { number.textContent = Math.round(obj.val).toString(); },
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        once: true,
        onToggle: self => triggers.push(self),
      },
    });

    // Label "años" slide up
    if (labelRef.current) {
      gsap.from(labelRef.current, {
        opacity: 0, y: 18, duration: 0.65, delay: 0.25, ease: 'power2.out',
        scrollTrigger: {
          trigger: section, start: 'top 82%', once: true,
          onToggle: self => triggers.push(self),
        },
      });
    }

    // Subtext fade
    if (subtextRef.current) {
      gsap.from(subtextRef.current, {
        opacity: 0, y: 14, duration: 0.65, delay: 0.45, ease: 'power2.out',
        scrollTrigger: {
          trigger: section, start: 'top 82%', once: true,
          onToggle: self => triggers.push(self),
        },
      });
    }

    // Stagger reveal de los fact items
    const items = factsList.querySelectorAll<HTMLDivElement>('.fact-item');
    gsap.from(items, {
      opacity: 0, x: 36, stagger: 0.15, duration: 0.7, ease: 'power2.out',
      scrollTrigger: {
        trigger: factsList, start: 'top 88%', once: true,
        onToggle: self => triggers.push(self),
      },
    });

    return () => {
      tCounter.kill();
      triggers.forEach(t => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Trayectoria de Arrendamientos Santa Fe — 60 años de experiencia inmobiliaria en Antioquia"
      style={{
        background: '#fff',
        borderTop:    `3px solid ${RED}`,
        borderBottom: '1px solid #ebebeb',
      }}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 items-center"
        style={{
          maxWidth: '1400px',
          margin:  '0 auto',
          padding: 'clamp(40px, 5vw, 64px) clamp(20px, 4vw, 52px)',
          gap:     'clamp(36px, 4vw, 80px)',
        }}
      >
        {/* ── Contador ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, lineHeight: 1 }}>
            <span
              ref={numberRef}
              style={{
                fontFamily:         FONT,
                fontWeight:         900,
                fontSize:           'clamp(80px, 10vw, 136px)',
                color:              RED,
                lineHeight:         1,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              0
            </span>
            <span
              ref={labelRef}
              style={{
                fontFamily: FONT,
                fontWeight: 300,
                fontSize:   'clamp(24px, 2.8vw, 42px)',
                color:      '#1a1a1a',
                paddingBottom: '0.15em',
                lineHeight: 1,
              }}
            >
              años
            </span>
          </div>

          <p
            ref={subtextRef}
            style={{
              fontFamily: FONT,
              fontWeight: 400,
              fontSize:   'clamp(13px, 1vw, 16px)',
              color:      '#777',
              lineHeight: 1.6,
              maxWidth:   400,
              margin:     0,
            }}
          >
            De experiencia inmobiliaria en Antioquia. Arrendamientos, ventas,
            avalúos y consignaciones — desde 1966 en Medellín.
          </p>
        </div>

        {/* ── Hechos ── */}
        <dl
          ref={factsRef}
          style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}
        >
          {facts.map((fact, i) => (
            <div
              key={i}
              className="fact-item"
              style={{
                display:       'grid',
                gridTemplateColumns: '3px 1fr',
                gap:           '0 20px',
                paddingTop:    i === 0 ? 0 : 22,
                paddingBottom: 22,
                borderBottom:  i < facts.length - 1 ? '1px solid #ebebeb' : 'none',
              }}
            >
              {/* Barra roja */}
              <div style={{ background: RED, borderRadius: 2 }} />

              <div>
                <dt
                  style={{
                    fontFamily:  FONT,
                    fontWeight:  700,
                    fontSize:    'clamp(13px, 1vw, 15px)',
                    color:       '#1a1a1a',
                    marginBottom: 5,
                  }}
                >
                  {fact.dt}
                </dt>
                <dd
                  style={{
                    fontFamily: FONT,
                    fontWeight: 300,
                    fontSize:   'clamp(12px, 0.9vw, 14px)',
                    color:      '#888',
                    lineHeight: 1.6,
                    margin:     0,
                  }}
                >
                  {fact.dd}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
