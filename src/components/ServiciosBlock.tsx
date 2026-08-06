'use client';

import { useState } from 'react';
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

      {/* ── MOBILE: carrusel horizontal — 3 tarjetas visibles ── */}
      <div
        className="sm:hidden"
        style={{
          overflowX: 'auto',
          overflowY: 'visible',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingBottom: '24px',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        } as React.CSSProperties}
      >
        <div className="flex gap-2" style={{ width: 'max-content' }}>
          {servicios.map((s, idx) => {
            const url   = `https://wa.me/${PHONE}?text=${encodeURIComponent(s.waMsg)}`;
            const isRed = idx === redIdx;
            return (
              <a
                key={s.title}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 'calc((100vw - 48px) / 3)',
                  minWidth: '100px',
                  maxWidth: '130px',
                  flexShrink: 0,
                  scrollSnapAlign: 'start',
                  background: isRed ? RED : '#f5f5f5',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '8px',
                  padding: '16px 10px 14px',
                  textDecoration: 'none',
                }}
              >
                <img
                  src={s.icon}
                  alt=""
                  width={32}
                  height={32}
                  style={{ filter: isRed ? 'brightness(0) invert(1)' : 'none' }}
                />
                <span style={{
                  fontFamily: FONT_HEADING,
                  fontWeight: 700,
                  fontSize: '13px',
                  color: isRed ? '#fff' : '#1a1a1a',
                  lineHeight: 1.2,
                }}>
                  {s.title}
                </span>
                <span style={{
                  fontFamily: FONT_BODY,
                  fontWeight: 500,
                  fontSize: '11px',
                  color: '#fff',
                  background: isRed ? 'rgba(255,255,255,0.25)' : '#1a1a1a',
                  borderRadius: '99px',
                  padding: '5px 8px',
                  lineHeight: 1.3,
                  marginTop: 'auto',
                }}>
                  Hablar con un asesor
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* ── DESKTOP (sm+): grid con descripción ── */}
      <div className="hidden sm:block sm:px-10 lg:px-14" style={{ paddingBottom: '52px', overflow: 'visible' }}>
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
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
