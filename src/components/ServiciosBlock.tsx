'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import type { PageType } from '@/components/Header';

interface ServiciosBlockProps {
  onNavigate: (page: PageType) => void;
}

const FONT_BODY    = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const FONT_HEADING = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED          = '#f32735';
const PHONE_ARRIENDO  = '573006557529';
const PHONE_ASESOR    = '573044403848';
const SERV_GAP = 10;

function applyInkFill(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const size = Math.max(
    Math.hypot(x, y),
    Math.hypot(rect.width - x, y),
    Math.hypot(x, rect.height - y),
    Math.hypot(rect.width - x, rect.height - y),
  ) * 2;
  el.style.setProperty('--x', `${x}px`);
  el.style.setProperty('--y', `${y}px`);
  el.style.setProperty('--size', `${size}px`);
}

const servicios = [
  {
    iconRed:   '/icons/icon-arrendamientos-red.svg',
    iconWhite: '/icons/icon-arrendamientos-white.svg',
    title: 'Arrendamientos',
    description:
      'Sabemos que encontrar el inmueble indicado no es solo buscar, es encontrar el lugar donde vas a vivir o trabajar. Estamos aquí para que ese proceso sea fácil, seguro y a tu medida.',
    phone: PHONE_ARRIENDO,
    waMsg: 'Hola, quiero arrendar un inmueble',
  },
  {
    iconRed:   '/icons/icon-ventas-red.svg',
    iconWhite: '/icons/icon-ventas-white.svg',
    title: 'Ventas',
    description:
      'Comprar un inmueble es una de las decisiones más importantes de tu vida. Te acompañamos con el conocimiento del mercado y la experiencia para que elijas con seguridad.',
    phone: PHONE_ARRIENDO,
    waMsg: 'Hola, quiero comprar un inmueble',
  },
  {
    iconRed:   '/icons/icon-consult-red.svg',
    iconWhite: '/icons/icon-consult-white.svg',
    title: 'Consignación',
    description:
      'Tu propiedad merece estar en buenas manos. Nos encargamos de encontrar el cliente adecuado con la seriedad y el respaldo de 60 años en el mercado inmobiliario antioqueño.',
    phone: PHONE_ASESOR,
    waMsg: 'Hola, vengo de la página web y quiero consignar mi propiedad con ustedes. ¿Me pueden asesorar?',
  },
  {
    iconRed:   '/icons/icon-avaluos-red.svg',
    iconWhite: '/icons/icon-avaluos-white.svg',
    title: 'Avalúos',
    description:
      'Conocer el valor real de tu inmueble es el primer paso para tomar buenas decisiones. Te damos una valoración técnica, honesta y ajustada al mercado actual.',
    phone: PHONE_ASESOR,
    waMsg: 'Hola, vengo de la página web y me interesa un avalúo de mi inmueble. ¿Cómo es el proceso?',
  },
  {
    iconRed:   '/icons/icon-hipotecas-red.svg',
    iconWhite: '/icons/icon-hipotecas-white.svg',
    title: 'Hipotecas',
    description:
      '¿Necesitas dinero? Préstamos en hipoteca al 1.5% de interés, pagos anticipados sin penalización y abonos a capital desde $1.000.000',
    phone: PHONE_ASESOR,
    waMsg: 'Hola, vengo de la página web y quiero información sobre los préstamos de dinero en hipoteca. ¿Me pueden asesorar?',
  },
];

export default function ServiciosBlock({ onNavigate: _onNavigate }: ServiciosBlockProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [touchIdx, setTouchIdx]     = useState<number | null>(null);
  const [redIdx] = useState(() => Math.floor(Math.random() * servicios.length));

  const servContainerRef = useRef<HTMLDivElement>(null);
  const servTrackRef     = useRef<HTMLDivElement>(null);
  const servIsAnimating  = useRef(false);
  const [servStartIdx, setServStartIdx] = useState(0);
  const [servCardW, setServCardW]       = useState(0);
  const SERV_SLOT = servCardW + SERV_GAP;

  useEffect(() => {
    const el = servContainerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setServCardW(Math.floor((w - SERV_GAP) / 2));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const servNavigate = useCallback((forward: boolean) => {
    if (servIsAnimating.current || !servTrackRef.current || !servContainerRef.current || SERV_SLOT === 0) return;
    servIsAnimating.current = true;
    if (forward) {
      const slots    = servContainerRef.current.querySelectorAll<HTMLElement>('[data-serv]');
      const exiting  = slots[0];
      const entering = slots[slots.length - 1];
      gsap.set(entering, { scale: 0.75, opacity: 0 });
      gsap.timeline({
        onComplete: () => {
          flushSync(() => setServStartIdx(p => (p + 1) % servicios.length));
          gsap.set(servTrackRef.current, { x: 0 });
          servIsAnimating.current = false;
        },
      })
        .to(servTrackRef.current, { x: -SERV_SLOT, duration: 0.9,  ease: 'power4.out'  }, 0)
        .to(exiting,              { scale: 0.75, opacity: 0, duration: 0.42, ease: 'power2.in'  }, 0)
        .to(entering,             { scale: 1,    opacity: 1, duration: 0.66, ease: 'power3.out' }, 0.2);
    } else {
      flushSync(() => setServStartIdx(p => (p - 1 + servicios.length) % servicios.length));
      const slots    = servContainerRef.current.querySelectorAll<HTMLElement>('[data-serv]');
      const entering = slots[0];
      const exiting  = slots[slots.length - 1];
      gsap.set(servTrackRef.current, { x: -SERV_SLOT });
      gsap.set(entering,             { scale: 0.75, opacity: 0 });
      gsap.timeline({
        onComplete: () => { servIsAnimating.current = false; },
      })
        .to(servTrackRef.current, { x: 0,    duration: 0.9,  ease: 'power4.out'  }, 0)
        .to(exiting,              { scale: 0.75, opacity: 0, duration: 0.42, ease: 'power2.in'  }, 0)
        .to(entering,             { scale: 1,    opacity: 1, duration: 0.66, ease: 'power3.out' }, 0.2);
    }
  }, [SERV_SLOT]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!servIsAnimating.current) servNavigate(true);
    }, 4000);
    return () => clearInterval(id);
  }, [servNavigate]);

  return (
    <section style={{ background: '#fff' }} className="w-full">

      {/* Título */}
      <div
        className="px-6 sm:px-10 lg:px-14"
        style={{ paddingTop: '28px', paddingBottom: '28px', textAlign: 'center' }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontWeight: 300,
            fontSize: 'clamp(26px, 2.6vw, 46px)',
            color: '#555',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Nuestros <span style={{ fontWeight: 700 }}>servicios</span>
        </h2>
      </div>

      {/* ── CARRUSEL: mobile/tablet ── */}
      <div className="lg:hidden" style={{ paddingBottom: '24px', position: 'relative' }}>
        {/* Flecha izquierda — fuera del overflow-hidden */}
        <button
          onClick={() => servNavigate(false)}
          aria-label="Anterior"
          style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 20,
            width: 36, height: 36, borderRadius: '50%',
            background: RED, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(243,39,53,0.35)',
            transition: 'background 0.18s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#aa182c')}
          onMouseLeave={e => (e.currentTarget.style.background = RED)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div
          ref={servContainerRef}
          className="relative overflow-hidden"
          style={{ marginLeft: '46px', marginRight: '46px' }}
        >
          {servCardW > 0 && (
            <div
              ref={servTrackRef}
              className="flex"
              style={{ gap: `${SERV_GAP}px`, width: `${3 * servCardW + 2 * SERV_GAP}px`, willChange: 'transform' }}
            >
              {[0, 1, 2].map(i => {
                const s   = servicios[(servStartIdx + i) % servicios.length];
                const url = `https://wa.me/${s.phone}?text=${encodeURIComponent(s.waMsg)}`;
                return (
                  <a
                    key={s.title}
                    data-serv={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: `${servCardW}px`, minWidth: `${servCardW}px`, flexShrink: 0,
                      willChange: 'transform, opacity',
                      background: '#f5f5f5',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                      gap: '10px', padding: '20px 12px 16px', textDecoration: 'none',
                    }}
                  >
                    <img src={s.iconRed} alt="" width={36} height={36} />
                    <span style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: '14px', color: '#1a1a1a', lineHeight: 1.2 }}>
                      {s.title}
                    </span>
                    <span style={{
                      fontFamily: FONT_BODY, fontWeight: 500, fontSize: '12px',
                      color: '#fff', background: '#1a1a1a', borderRadius: '99px',
                      padding: '6px 10px', lineHeight: 1.3, marginTop: 'auto',
                    }}>
                      Hablar con un asesor
                    </span>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Flecha derecha — fuera del overflow-hidden */}
        <button
          onClick={() => servNavigate(true)}
          aria-label="Siguiente"
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 20,
            width: 36, height: 36, borderRadius: '50%',
            background: RED, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(243,39,53,0.35)',
            transition: 'background 0.18s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#aa182c')}
          onMouseLeave={e => (e.currentTarget.style.background = RED)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* ── DESKTOP (lg+): grid con descripción ── */}
      <div className="hidden lg:block lg:px-14" style={{ paddingBottom: '52px', overflow: 'visible' }}>
        <div
          className="grid lg:grid-cols-3 xl:grid-cols-5"
          style={{ gap: '0', background: 'transparent', overflow: 'visible' }}
        >
          {servicios.map((s, idx) => {
            const url      = `https://wa.me/${s.phone}?text=${encodeURIComponent(s.waMsg)}`;
            const isRed    = idx === redIdx;
            const isHov    = idx === hoveredIdx;
            const isTouch  = idx === touchIdx;
            const isActive = isHov || isTouch;
            const isAdj    = hoveredIdx !== null && Math.abs(idx - hoveredIdx) === 1;

            return (
              <div
                key={s.title}
                className="flex flex-col"
                style={{
                  gap: '14px',
                  padding: '24px 20px 20px',
                  borderRadius: 0,
                  background: isRed ? RED : '#fff',
                  cursor: 'default',
                  transform: isActive ? 'scale(1.06)' : isAdj ? 'scale(0.96)' : 'scale(1)',
                  zIndex: isActive ? 10 : 1,
                  position: 'relative',
                  transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease',
                  boxShadow: isActive ? '0 8px 32px rgba(0,0,0,0.18)' : 'none',
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onTouchStart={() => setTouchIdx(idx)}
                onTouchEnd={() => setTouchIdx(null)}
                onTouchCancel={() => setTouchIdx(null)}
              >
                <img
                  src={isRed ? s.iconWhite : s.iconRed}
                  alt=""
                  width={40}
                  height={40}
                  style={{ flexShrink: 0 }}
                />

                <h3
                  style={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 700,
                    fontSize: 'clamp(16px, 1.2vw, 20px)',
                    color: isRed ? '#fff' : '#1a1a1a',
                    margin: 0,
                    lineHeight: 1.15,
                  }}
                >
                  {s.title}
                </h3>

                <p
                  style={{
                    fontFamily: FONT_BODY,
                    fontWeight: 300,
                    fontSize: 'clamp(12.5px, 0.9vw, 14px)',
                    color: isRed ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.55)',
                    margin: 0,
                    lineHeight: 1.15,
                    flexGrow: 1,
                  }}
                >
                  {s.description}
                </p>

                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={applyInkFill}
                  onMouseLeave={applyInkFill}
                  className="hero-btn-fill inline-flex items-center justify-center rounded-full"
                  style={{
                    fontFamily: FONT_BODY,
                    fontWeight: 300,
                    fontSize: 'clamp(13px, 0.95vw, 15px)',
                    textDecoration: 'none',
                    height: '42px',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    alignSelf: 'flex-start',
                    background: isRed ? RED : '#1a1a1a',
                    border: isRed ? '1px solid rgba(255,255,255,0.7)' : 'none',
                  }}
                >
                  <span>Hablar con un asesor</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
