'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';

interface HeroSectionProps {
  onNavigate?: (page: 'propiedades' | 'consignacion') => void;
  searchFormSlot?: React.ReactNode;
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
  'https://wa.me/573006557529?text=Hola%2C%20quisiera%20hablar%20con%20un%20asesor%20de%20Arrendamientos%20Santa%20Fe.';

const FONT_BODY    = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const FONT_HEADING = "'Avenir Next Ultra Light', 'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif";
const RED          = '#f32735';

export default function HeroSection({ onNavigate, searchFormSlot }: HeroSectionProps) {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.hero-title-split');
  const boldTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!boldTextRef.current) return;
    const underlineEl = boldTextRef.current.nextElementSibling;
    if (!underlineEl) return;
    gsap.set(underlineEl, { scaleX: 0, transformOrigin: 'left center' });
    gsap.to(underlineEl, { scaleX: 1, duration: 0.9, delay: 1.6, ease: 'power3.out' });
  }, []);

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
          {/* Video de fondo */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=1920&q=80"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>

          {/* Overlay oscuro */}
          <div className="absolute inset-0 hero-video-overlay" />

          {/* Contenido centrado — ocupa el espacio disponible */}
          <div
            className="relative flex-1 flex flex-col items-center justify-center px-8 py-14 sm:px-14 lg:px-16"
            style={{ zIndex: 10 }}
          >
            <div style={{ maxWidth: '700px', width: '100%', textAlign: 'center' }}>
              <h1
                className="hero-title-split"
                style={{
                  fontFamily: FONT_HEADING,
                  fontWeight: 300,
                  fontSize: 'clamp(28px, 3vw, 52px)',
                  color: '#fff',
                  lineHeight: 1.2,
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                60 años{' '}
                <span style={{ fontWeight: 700, display: 'inline-block', position: 'relative' }}>
                  <span ref={boldTextRef} style={{ position: 'relative', zIndex: 2, display: 'block' }}>
                    conectando personas
                  </span>
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '48%',
                      left: 0,
                      width: '100%',
                      height: '0.15em',
                      backgroundColor: RED,
                      transform: 'translateY(-50%)',
                      zIndex: 1,
                    }}
                  />
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={titleAnimating ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                  fontFamily: FONT_BODY,
                  fontWeight: 300,
                  fontSize: 'clamp(13px, 1.1vw, 17px)',
                  color: 'rgba(255,255,255,0.85)',
                  marginTop: '20px',
                  lineHeight: 1.45,
                  textAlign: 'center',
                }}
              >
                con el lugar donde vivir, trabajar y crecer.
              </motion.p>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-7">
                <button
                  type="button"
                  onClick={() => onNavigate?.('propiedades')}
                  onMouseEnter={applyInkFill}
                  onMouseLeave={applyInkFill}
                  className="hero-btn-fill inline-flex items-center justify-center h-[42px] px-6 rounded-full text-sm"
                  style={{ fontFamily: FONT_BODY, fontWeight: 300 }}
                >
                  <span>Ver propiedades disponibles</span>
                </button>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={applyInkFill}
                  onMouseLeave={applyInkFill}
                  className="hero-btn-fill inline-flex items-center justify-center h-[42px] px-5 rounded-full text-sm"
                  style={{ fontFamily: FONT_BODY, fontWeight: 300, textDecoration: 'none' }}
                >
                  <span>Hablar con un asesor</span>
                </a>
              </div>
            </div>
          </div>

          {/* Buscador al fondo del hero, sobre el video */}
          {searchFormSlot && (
            <div id="buscador" className="relative w-full px-4 sm:px-8 lg:px-14 pb-8" style={{ zIndex: 10 }}>
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {searchFormSlot}
              </div>
            </div>
          )}
        </div>

      </div>

    </section>
  );
}
