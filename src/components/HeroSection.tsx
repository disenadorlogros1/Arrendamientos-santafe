'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';

interface HeroSectionProps {
  onNavigate?: (page: 'propiedades' | 'consignacion') => void;
}

const WHATSAPP_URL =
  'https://wa.me/573006557529?text=Hola%2C%20quisiera%20hablar%20con%20un%20asesor%20de%20Arrendamientos%20Santa%20Fe.';

const AnimatedText = ({ text, startIndex = 0 }: { text: string; startIndex?: number }) => {
  return (
    <>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="letter-animate"
          style={{ animationDelay: `${(startIndex + i) * 0.06}s` }}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </>
  );
};

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const titleRef = useSplitTextAnimation('.hero-title-split');
  const boldTextRef = useRef<HTMLSpanElement>(null);

  // Animar el subrayado después de que termine el título (1.4s duración del título)
  useEffect(() => {
    if (!boldTextRef.current) return;

    // Iniciar invisible
    gsap.set(boldTextRef.current, { borderBottomWidth: '0px' });

    // Aparecer deslizándose de izquierda a derecha después del título
    gsap.to(boldTextRef.current, {
      borderBottomWidth: '10px',
      duration: 0.9,
      delay: 1.6,
      ease: 'power3.out',
    });
  }, []);

  const scrollToSearch = () => {
    onNavigate?.('propiedades');
  };

  return (
    <section className="relative w-full h-[calc(100vh-100px)] lg:h-[70vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Video */}
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

      {/* Dark overlay */}
      <div className="absolute inset-0 hero-video-overlay" />

      {/* Content — Centrado en la mitad del viewport */}
      <div
        className="relative w-full px-6 sm:px-12 md:px-16 mx-auto"
        style={{ zIndex: 10, maxWidth: '56rem' }}
        ref={titleRef}
      >
        <h1
          className="hero-title-split text-3xl sm:text-4xl lg:text-5xl text-white"
          style={{
            fontFamily:
              "'Avenir Next Ultra Light', 'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 300,
            lineHeight: '1.2',
          }}
        >
          60 años acompañando
          <span
            ref={boldTextRef}
            style={{
              fontWeight: 700,
              display: 'block',
              borderBottom: '10px solid #f32735',
              borderBottomWidth: '0px',
              paddingBottom: '5px',
            }}
          >
            decisiones que importan.
          </span>
        </h1>
        <p
          className="mt-5 text-base sm:text-lg text-white max-w-2xl"
          style={{
            fontFamily:
              "'Avenir Next Ultra Light', 'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 200,
            letterSpacing: '0.2em',
            lineHeight: '1.32',
            textShadow: '0 1px 10px rgba(0,0,0,0.4)',
          }}
        >
          Respaldo y experiencia para encontrar o gestionar tu propiedad ideal en Antioquia.
        </p>

        {/* CTAs jerárquicos — botones cápsula con hover blanco + resplandor rojo */}
        <div className="mt-7 flex flex-wrap items-center gap-1.5 sm:gap-3">
          {/* CTA Principal: Ver propiedades disponibles */}
          <button
            type="button"
            onClick={scrollToSearch}
            className="hero-btn group inline-flex items-center justify-center h-[42px] px-6 bg-black/30 hover:bg-white/60 text-white text-sm sm:text-base rounded-full border border-white/30 transition-all duration-300 hover:scale-105"
            style={{
              textShadow: '0 1px 3px rgba(0,0,0,0.4)',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
            }}
          >
            Ver propiedades disponibles
          </button>

          {/* CTA Operativo: Hablar con un asesor (WhatsApp) */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-btn group inline-flex items-center gap-2 h-[42px] px-5 bg-black/30 hover:bg-white/60 text-white text-sm sm:text-base rounded-full border border-white/30 transition-all duration-300 hover:scale-105"
            style={{
              textShadow: '0 1px 3px rgba(0,0,0,0.4)',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
            }}
          >
            <span>Hablar con un asesor</span>
          </a>
        </div>
      </div>
    </section>
  );
}
