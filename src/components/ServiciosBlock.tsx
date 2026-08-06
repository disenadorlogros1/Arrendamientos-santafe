'use client';

import { useState, useRef, useEffect } from 'react';
import type { PageType } from '@/components/Header';

interface ServiciosBlockProps {
  onNavigate: (page: PageType) => void;
}

const FONT_BODY    = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const FONT_HEADING = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED          = '#f32735';
const PHONE        = '573006557529';

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
    icon: '/icons/icon-home-red.svg',
    title: 'Arrendamientos',
    description:
      'Sabemos que encontrar el inmueble indicado no es solo buscar, es encontrar el lugar donde vas a vivir o trabajar. Estamos aquí para que ese proceso sea fácil, seguro y a tu medida.',
    waMsg:
      'Hola, estoy buscando un inmueble para arrendar y me gustaría recibir asesoría. ¿Me pueden ayudar?',
  },
  {
    icon: '/icons/icon-credit-card-red.svg',
    title: 'Ventas',
    description:
      'Comprar un inmueble es una de las decisiones más importantes de tu vida. Te acompañamos con el conocimiento del mercado y la experiencia para que elijas con seguridad.',
    waMsg:
      'Hola, estoy interesado/a en comprar un inmueble y quisiera recibir orientación. ¿Me pueden ayudar?',
  },
  {
    icon: '/icons/icon-consult-red.svg',
    title: 'Consignación',
    description:
      'Tu propiedad merece estar en buenas manos. Nos encargamos de encontrar el cliente adecuado con la seriedad y el respaldo de 60 años en el mercado inmobiliario antioqueño.',
    waMsg:
      'Hola, tengo un inmueble disponible y me interesa consignarlo con Arrendamientos Santa Fe. ¿Me pueden dar más información sobre el proceso?',
  },
  {
    icon: '/icons/icon-area-red.svg',
    title: 'Avalúos',
    description:
      'Conocer el valor real de tu inmueble es el primer paso para tomar buenas decisiones. Te damos una valoración técnica, honesta y ajustada al mercado actual.',
    waMsg:
      'Hola, quisiera solicitar un avalúo comercial para mi inmueble. ¿Me pueden indicar cómo funciona el proceso?',
  },
  {
    icon: '/icons/icon-dollar-red.svg',
    title: 'Hipotecas',
    description:
      '¿Necesitas dinero? Préstamos en hipoteca al 1.5% de interés, pagos anticipados sin penalización y abonos a capital desde $1.000.000',
    waMsg:
      'Hola, tengo un inmueble y estoy explorando la posibilidad de obtener un préstamo hipotecario. Me gustaría saber cómo funciona el proceso con Arrendamientos Santa Fe.',
  },
];

export default function ServiciosBlock({ onNavigate: _onNavigate }: ServiciosBlockProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [touchIdx, setTouchIdx]     = useState<number | null>(null);
  const [redIdx] = useState(() => Math.floor(Math.random() * servicios.length));

  const trackRef     = useRef<HTMLDivElement>(null);
  const posRef       = useRef(0);
  const rafRef       = useRef<number>(0);
  const pausedRef    = useRef(false);
  const animatingRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const SPEED = 0.5;
    const step = () => {
      if (!pausedRef.current && !animatingRef.current) {
        posRef.current -= SPEED;
        const card = track.firstElementChild as HTMLElement;
        const pitch = card ? card.offsetWidth + 10 : 1;
        const halfWidth = pitch * servicios.length;
        if (Math.abs(posRef.current) >= halfWidth) posRef.current += halfWidth;
        track.style.transform = `translateX(${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const scrollBy = (dir: 'prev' | 'next') => {
    const track = trackRef.current;
    if (!track || animatingRef.current) return;
    const card = track.firstElementChild as HTMLElement;
    const pitch = card ? card.offsetWidth + 10 : window.innerWidth / 2;
    const halfWidth = pitch * servicios.length;

    if (dir === 'prev') {
      if (posRef.current > -(pitch + 1)) {
        posRef.current -= halfWidth;
        track.style.transition = 'none';
        track.style.transform = `translateX(${posRef.current}px)`;
        track.getBoundingClientRect();
      }
      posRef.current += pitch;
    } else {
      posRef.current -= pitch;
    }

    animatingRef.current = true;
    track.style.transition = 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)';
    track.style.transform = `translateX(${posRef.current}px)`;

    setTimeout(() => {
      if (track) {
        track.style.transition = '';
        if (posRef.current < -halfWidth) posRef.current += halfWidth;
      }
      animatingRef.current = false;
    }, 360);
  };

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

      {/* ── CARRUSEL: mobile (2 tarjetas) y tablet (3 tarjetas) ── */}
      <style>{`
        .servicio-card {
          width: calc(50vw - 10px);
          flex-shrink: 0;
          margin-right: 10px;
        }
        @media (min-width: 640px) {
          .servicio-card { width: calc(33.333vw - 10px); }
        }
      `}</style>

      <div className="lg:hidden" style={{ paddingBottom: '24px' }}>
        <div
          className="relative overflow-hidden"
          onPointerEnter={(e) => { if (e.pointerType === 'mouse') pausedRef.current = true; }}
          onPointerLeave={(e) => { if (e.pointerType === 'mouse') pausedRef.current = false; }}
        >
          {/* Flecha izquierda */}
          <button
            onClick={() => scrollBy('prev')}
            aria-label="Anterior"
            style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 10,
              width: 44,
              background: 'linear-gradient(to right, rgba(255,255,255,1) 45%, transparent)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Track */}
          <div ref={trackRef} className="flex" style={{ width: 'max-content' }}>
            {[...servicios, ...servicios].map((s, idx) => {
              const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(s.waMsg)}`;
              return (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="servicio-card"
                  style={{
                    background: '#f5f5f5',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '10px',
                    padding: '20px 12px 16px',
                    textDecoration: 'none',
                  }}
                >
                  <img src={s.icon} alt="" width={36} height={36} />
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

          {/* Flecha derecha */}
          <button
            onClick={() => scrollBy('next')}
            aria-label="Siguiente"
            style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, zIndex: 10,
              width: 44,
              background: 'linear-gradient(to left, rgba(255,255,255,1) 45%, transparent)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── DESKTOP (lg+): grid con descripción ── */}
      <div className="hidden lg:block lg:px-14" style={{ paddingBottom: '52px', overflow: 'visible' }}>
        <div
          className="grid lg:grid-cols-3 xl:grid-cols-5"
          style={{ gap: '0', background: 'transparent', overflow: 'visible' }}
        >
          {servicios.map((s, idx) => {
            const url    = `https://wa.me/${PHONE}?text=${encodeURIComponent(s.waMsg)}`;
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
                  src={s.icon}
                  alt=""
                  width={40}
                  height={40}
                  style={{ flexShrink: 0, filter: isRed ? 'brightness(0) invert(1)' : 'none' }}
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
