'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';

interface HeroSectionProps {
  onNavigate?: (page: 'propiedades' | 'consignacion') => void;
  searchFormSlot?: React.ReactNode;
}

/* ── YouTube background sin controles (IFrame Player API) ── */
function YTBackground({ videoId }: { videoId: string }) {
  const coverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const playerId = 'yt-hero-bg';

    const initPlayer = () => {
      new (window as any).YT.Player(playerId, {
        videoId,
        playerVars: {
          autoplay: 1, mute: 1, loop: 1,
          playlist: videoId,
          controls: 0, disablekb: 1,
          rel: 0, showinfo: 0,
          modestbranding: 1, playsinline: 1,
          iv_load_policy: 3, fs: 0,
        },
        events: {
          onReady: (e: any) => e.target.playVideo(),
          onStateChange: (e: any) => {
            /* YT.PlayerState.PLAYING = 1 → desvanece la capa que cubre el UI de YouTube */
            if (e.data === 1 && coverRef.current) {
              coverRef.current.style.transition = 'opacity 0.8s ease';
              coverRef.current.style.opacity = '0';
            }
          },
        },
      });
    };

    if ((window as any).YT?.Player) {
      initPlayer();
    } else {
      if (!document.getElementById('yt-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'yt-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }
  }, [videoId]);

  return (
    <>
      <style>{`
        #yt-hero-bg {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          width: calc(177.78vh + 200px) !important;
          min-width: calc(100% + 200px) !important;
          height: calc(56.25vw + 200px) !important;
          min-height: calc(100% + 200px) !important;
          transform: translate(-50%, -50%) !important;
          pointer-events: none !important;
          border: none !important;
        }
      `}</style>
      {/*
        zIndex:0 en el wrapper crea un stacking context local →
        la capa cover (z-index:10) solo domina dentro de este wrapper,
        el overlay y el contenido del hero siguen pintando encima.
      */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <div id="yt-hero-bg" />
        {/* Cubre el botón de play de YouTube hasta que el video arranca */}
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

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
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
          {/* Video de fondo — YouTube IFrame API (sin controles) */}
          <YTBackground videoId="WJhuP6tOk74" />

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
                <span style={{ fontWeight: 200 }}>60 años</span>
                <span style={{ fontWeight: 300, position: 'relative', overflow: 'hidden' }}>
                  <span style={{ position: 'relative', zIndex: 2 }}>
                    conectando personas
                  </span>
                  {/* Línea roja — siempre visible en mobile, aparece en hover en desktop */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '62%',
                      left: 0,
                      width: '100%',
                      height: '13%',
                      backgroundColor: RED,
                      transform: `translateY(-50%) scaleX(${(isMobile || titleHovered) ? 1 : 0})`,
                      transformOrigin: 'left center',
                      zIndex: 1,
                      transition: isMobile ? 'none' : 'transform 0.234s ease',
                      pointerEvents: 'none',
                    }}
                  />
                </span>
              </h1>

              <p
                ref={subtitleRef}
                style={{
                  fontFamily: FONT_BODY,
                  fontWeight: 300,
                  fontSize: 'clamp(15px, 1.1vw, 17px)',
                  color: 'rgba(255,255,255,0.85)',
                  marginTop: '20px',
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

          {/* Ubicación — siempre debajo del buscador, sobre el video */}
          <div
            className="relative w-full flex items-center justify-center gap-2 pb-5 pt-3"
            style={{ zIndex: 10 }}
          >
            <img src="/icons/icon-location-white.svg" alt="" width={14} height={14} style={{ opacity: 0.75 }} />
            <span style={{
              fontFamily: FONT_BODY,
              fontSize: '13px',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.01em',
            }}>
              Propiedades en Medellín
            </span>
          </div>
        </div>

      </div>

    </section>
  );
}