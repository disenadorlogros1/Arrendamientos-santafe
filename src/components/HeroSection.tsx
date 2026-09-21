'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import TitleUnderline from '@/components/TitleUnderline';

interface HeroSectionProps {
  onNavigate?: (page: 'propiedades' | 'consignacion') => void;
  searchFormSlot?: React.ReactNode;
}

/* ── Streamable background sin controles ──
   Dos videos: horizontal (16:9) para pantallas anchas y vertical (9:16) para celulares/portrait.
   El iframe se dimensiona como "cover" usando container query units del contenedor. */
const VIDEO_HORIZONTAL = 'ahrs1d';
const VIDEO_VERTICAL   = 'bi3mk3';

function StreamableBackground({ videoId, vertical }: { videoId: string; vertical: boolean }) {
  const coverRef = useRef<HTMLDivElement>(null);
  const cls = vertical ? 'streamable-bg-iframe streamable-bg-vertical' : 'streamable-bg-iframe streamable-bg-horizontal';

  return (
    <>
      <style>{`
        .streamable-bg-iframe {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          pointer-events: none !important;
          border: none !important;
        }
        /* 16:9 — cubre el contenedor con 100px extra para recortar bordes del player */
        .streamable-bg-horizontal {
          width: max(calc(100cqw + 100px), calc(177.78cqh + 100px)) !important;
          aspect-ratio: 16 / 9 !important;
          height: auto !important;
        }
        /* 9:16 — mismo criterio con la proporción vertical */
        .streamable-bg-vertical {
          width: max(calc(100cqw + 60px), calc(56.25cqh + 60px)) !important;
          aspect-ratio: 9 / 16 !important;
          height: auto !important;
        }
      `}</style>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ zIndex: 0, containerType: 'size' }}
        aria-hidden="true"
      >
        <iframe
          key={videoId}
          className={cls}
          src={`https://streamable.com/e/${videoId}?autoplay=1&muted=1&loop=1&nocontrols=1`}
          allow="autoplay; fullscreen"
          allowFullScreen
          onLoad={() => {
            if (coverRef.current) {
              coverRef.current.style.transition = 'opacity 1.2s ease';
              coverRef.current.style.opacity = '0';
            }
          }}
        />
        <div
          ref={coverRef}
          style={{
            position: 'absolute', inset: 0,
            background: '#0d0d0d',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
      </div>
    </>
  );
}

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

const WHATSAPP_URL =
  'https://wa.me/573044403848?text=Hola%2C%20vengo%20de%20la%20p%C3%A1gina%20web%20y%20quiero%20hablar%20con%20un%20asesor%20%F0%9F%98%8A';

const FONT_BODY    = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const FONT_HEADING = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED          = '#f32735';

export default function HeroSection({ onNavigate, searchFormSlot }: HeroSectionProps) {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.hero-title-split', 0, false, true);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const [titleHovered, setTitleHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // null hasta conocer la orientación: evita cargar primero el video equivocado
  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 640);
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);


  useEffect(() => {
    if (!titleAnimating || !subtitleRef.current) return;
    gsap.fromTo(subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, [titleAnimating]);

  return (
    <section style={{ background: '#000' }} className="w-full overflow-hidden">

      {/* Fila 1: celda video (flex-1) + celda stat (desktop) */}
      <div className="flex flex-col lg:flex-row" style={{ gap: '3px' }}>

        {/* Celda principal: video + contenido + buscador al fondo */}
        <div
          className="relative flex flex-col overflow-hidden flex-1"
          style={{ minHeight: 'clamp(500px, 88vh, 950px)' }}
          ref={titleRef}
        >
          {/* Video de fondo — Streamable (sin controles) */}
          {isPortrait !== null && (
            <StreamableBackground
              key={isPortrait ? 'v' : 'h'}
              videoId={isPortrait ? VIDEO_VERTICAL : VIDEO_HORIZONTAL}
              vertical={isPortrait}
            />
          )}

          {/* Overlay oscuro */}
          <div className="absolute inset-0 hero-video-overlay" />

          {/* Contenido — empujado hacia el buscador inferior */}
          <div
            className="relative flex-1 flex flex-col items-center justify-end px-4 pb-12 pt-16 sm:px-8 sm:pb-14 md:px-14 lg:px-16 lg:pb-16"
            style={{ zIndex: 10 }}
          >
            <div style={{ maxWidth: '700px', width: '100%', textAlign: 'center' }}>
              <h1
                className="hero-title-split text-[36px] sm:text-[clamp(32px,5vw,52px)]"
                style={{
                  fontFamily: FONT_HEADING,
                  fontWeight: 700,
                  lineHeight: 1.0,
                  margin: 0,
                  textAlign: 'center',
                  color: '#fff',
                  cursor: 'default',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: isMobile ? '2px' : 'clamp(6px, 1.2vw, 14px)',
                }}
                onMouseEnter={() => setTitleHovered(true)}
                onMouseLeave={() => setTitleHovered(false)}
              >
                <span style={{ fontWeight: 900 }}>60 años</span>
                <TitleUnderline
                  active={isMobile || titleHovered}
                  transition={isMobile ? 'none' : 'transform 0.234s ease'}
                  style={{ fontWeight: 300 }}
                >
                  conectando personas
                </TitleUnderline>
              </h1>

              <p
                ref={subtitleRef}
                style={{
                  fontFamily: FONT_BODY,
                  fontWeight: 300,
                  fontSize: 'clamp(16px, 1.25vw, 20px)',
                  color: 'rgba(255,255,255,0.85)',
                  marginTop: '32px',
                  lineHeight: 1.45,
                  textAlign: 'center',
                  opacity: 0,
                }}
              >
                con el lugar donde vivir, trabajar y crecer.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-7">
                <button
                  type="button"
                  onClick={() => onNavigate?.('propiedades')}
                  onMouseEnter={applyInkFill}
                  onMouseLeave={applyInkFill}
                  className="hero-btn-fill inline-flex items-center justify-center h-[42px] px-8 rounded-full"
                  style={{ fontFamily: "'Avenir LT Std', 'Outfit', system-ui, sans-serif", fontWeight: 300, fontSize: '15px', minWidth: '200px', maxWidth: '280px', width: '100%' }}
                >
                  <span>Ver propiedades disponibles</span>
                </button>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={applyInkFill}
                  onMouseLeave={applyInkFill}
                  className="hero-btn-fill inline-flex items-center justify-center h-[42px] px-8 rounded-full"
                  style={{ fontFamily: "'Avenir LT Std', 'Outfit', system-ui, sans-serif", fontWeight: 300, fontSize: '15px', minWidth: '200px', maxWidth: '280px', width: '100%', textDecoration: 'none' }}
                >
                  <span>Hablar con un asesor</span>
                </a>
              </div>
            </div>
          </div>

          {/* Buscador al fondo del hero — mismo ancho que el nav del header */}
          {searchFormSlot && (
            <div className="relative w-full px-4 sm:px-6 lg:px-8 pb-2" style={{ zIndex: 10 }}>
              <div id="buscador" style={{ width: '100%', maxWidth: '64rem', margin: '0 auto' }}>
                {searchFormSlot}
              </div>
            </div>
          )}

        </div>

      </div>

    </section>
  );
}