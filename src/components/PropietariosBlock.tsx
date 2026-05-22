'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import type { PageType } from '@/components/Header';

interface PropietariosBlockProps {
  onNavigate: (page: PageType) => void;
}

const WHATSAPP_URL =
  'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consignar%20una%20propiedad%20con%20Arrendamientos%20Santa%20Fe.';

export default function PropietariosBlock({ onNavigate }: PropietariosBlockProps) {
  const [isVisible, setIsVisible] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => observer.disconnect();
  }, []);
  return (
    <section className="relative py-16 sm:py-20 bg-brand-dark text-white overflow-hidden">
      {/* Acento visual sutil */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 20%, #f32735 0%, transparent 50%), radial-gradient(circle at 20% 80%, #f32735 0%, transparent 40%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            <h2
              ref={titleRef}
              className="text-3xl sm:text-4xl lg:text-5xl leading-tight text-white"
              style={{
                fontFamily:
                  "'Avenir Next Ultra Light', 'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif",
                fontWeight: 300,
              }}
            >
              ¿Tienes un inmueble para{' '}
              <span
                className="text-brand-red inline-block"
                style={{
                  fontWeight: 700,
                  background: 'linear-gradient(to bottom, transparent 60%, white 60%, white 84%, transparent 84%)',
                  WebkitBoxDecorationBreak: 'clone',
                  boxDecorationBreak: 'clone',
                  padding: '0 4px',
                  margin: '0 -4px',
                  clipPath: 'inset(0 100% 0 0)',
                  animation: isVisible ? 'slideHighlightFromLeft 4.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.42s forwards' : 'none',
                }}
              >
                arrendar o vender?
              </span>
            </h2>
            <p className="mt-5 text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed">
              Más de 60 años gestionando propiedades en Antioquia. Tu inmueble en manos de quienes conocen el mercado inmobiliario regional.
            </p>

            {/* CTAs jerárquicos */}
            <div className="mt-8 flex flex-col md:flex-row items-center gap-3">
              {/* CTA Principal */}
              <button
                type="button"
                onClick={() => onNavigate('consignacion')}
                className="w-full md:w-auto inline-flex items-center justify-center h-12 px-6 bg-white text-brand-red text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 hover:bg-brand-red hover:text-white"
                style={{ lineHeight: '1.2' }}
              >
                Consignar mi propiedad
              </button>

              {/* CTA Secundario */}
              <button
                type="button"
                onClick={() => onNavigate('consignacion')}
                className="w-full md:w-auto inline-flex items-center justify-center h-12 px-6 bg-white text-brand-red text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 hover:bg-brand-red hover:text-white"
                style={{ lineHeight: '1.2' }}
              >
                Conocer cómo funciona
              </button>

              {/* CTA Operativo */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto inline-flex items-center justify-center h-12 px-6 bg-white text-brand-red text-sm font-semibold transition-all duration-300 hover:scale-105 hover:bg-brand-red hover:text-white"
                style={{ lineHeight: '1.2' }}
              >
                Hablar con un asesor
              </a>
            </div>
          </div>

          {/* Bloque visual / valores clave */}
          <div className="md:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-5 backdrop-blur-sm">
                <p className="text-3xl font-bold text-brand-red">60</p>
                <p className="text-sm text-white/70 mt-1">años de experiencia</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-5 backdrop-blur-sm">
                <p className="text-3xl font-bold text-brand-red">3</p>
                <p className="text-sm text-white/70 mt-1">sedes en Antioquia</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-5 backdrop-blur-sm col-span-2">
                <p className="text-sm text-white/80 leading-relaxed">
                  Te avisamos cuando haya un arrendatario interesado. Sin cuelgues, sin demoras.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
