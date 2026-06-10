'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';

interface HeroSectionProps {
  onNavigate?: (page: 'propiedades' | 'consignacion') => void;
  searchFormSlot?: React.ReactNode;
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

        {/* Celda principal: video + contenido */}
        <div
          className="relative flex items-center justify-center overflow-hidden flex-1"
          style={{ minHeight: 'clamp(340px, 65vh, 700px)' }}
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

          {/* Contenido */}
          <div
            className="relative w-full flex flex-col items-center px-8 py-14 sm:px-14 lg:px-16"
            style={{ zIndex: 10, maxWidth: '700px', margin: '0 auto' }}
          >
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
                className="hero-btn-fill inline-flex items-center justify-center h-[42px] px-6 rounded-full border border-white/30 text-sm"
                style={{ fontFamily: FONT_BODY, fontWeight: 300 }}
              >
                <span>Ver propiedades disponibles</span>
              </button>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-btn-fill inline-flex items-center justify-center h-[42px] px-5 rounded-full border border-white/30 text-sm"
                style={{ fontFamily: FONT_BODY, fontWeight: 300, textDecoration: 'none' }}
              >
                <span>Hablar con un asesor</span>
              </a>
            </div>
          </div>
        </div>

        {/* Celda stat lateral — solo desktop */}
        <div
          className="hidden lg:flex flex-col items-center justify-center gap-2 flex-shrink-0"
          style={{ background: '#1a1a1a', width: '200px' }}
        >
          <span
            style={{
              fontFamily: "'Avenir LT Pro 85 Heavy', 'Avenir LT Pro', system-ui, sans-serif",
              fontSize: 'clamp(48px, 4vw, 72px)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1,
            }}
          >
            60
          </span>
          <span
            style={{
              fontFamily: FONT_BODY,
              fontSize: '15px',
              fontWeight: 500,
              color: '#fff',
              lineHeight: 1,
            }}
          >
            años
          </span>
          <span
            style={{
              fontFamily: FONT_BODY,
              fontSize: '12px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1,
              textAlign: 'center',
              padding: '0 16px',
            }}
          >
            de experiencia en Antioquia
          </span>
        </div>
      </div>

      {/* Fila 2: celda SearchForm */}
      {searchFormSlot && (
        <div id="buscador" style={{ marginTop: '3px' }}>
          {searchFormSlot}
        </div>
      )}

    </section>
  );
}
