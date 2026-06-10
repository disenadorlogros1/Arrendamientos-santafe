'use client';

import { motion } from 'framer-motion';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import { ArrowRight } from 'lucide-react';
import type { PageType } from '@/components/Header';

interface TrayectoriaBlockProps {
  onNavigate: (page: PageType) => void;
}

const FONT_BODY    = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const FONT_HEADING = "'Avenir Next Ultra Light', 'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif";
const RED          = '#f32735';

const HITOS = [
  { year: '1966', label: 'Nacemos en Medellín con una promesa: acompañar cada decisión con confianza y cercanía.' },
  { year: '1974', label: 'Consolidamos nuestra operación y ganamos la confianza de propietarios y clientes en Antioquia.' },
  { year: '2006', label: 'Cuatro décadas de trayectoria avalan nuestro respaldo y seriedad en el sector inmobiliario.' },
  { year: '2017', label: 'Abrimos sede en Envigado y ampliamos nuestra presencia en el sur del Valle de Aburrá.' },
  { year: '2018', label: 'Renovamos nuestra imagen para proyectar lo que siempre hemos sido: cercanos, serios y vigentes.' },
  { year: '2026', label: '60 años creciendo con Antioquia. Celebramos con la apertura de nuestra sede en Rionegro.' },
];

const STATS = [
  { number: '60+', label: 'años', sublabel: 'de experiencia' },
  { number: '3',   label: 'sedes', sublabel: 'en Antioquia' },
  { number: '+1K', label: 'inmuebles', sublabel: 'en gestión activa' },
];

export default function TrayectoriaBlock({ onNavigate }: TrayectoriaBlockProps) {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.trayectoria-title-split', 0, true);

  return (
    <section style={{ background: '#0a0a0a' }} className="w-full overflow-hidden">

      {/* Fila 1: Celda de texto + 3 celdas de stats */}
      <div className="flex flex-col lg:flex-row" style={{ gap: '3px' }}>

        {/* Celda título */}
        <div
          className="flex flex-col justify-center gap-6 px-8 py-12 sm:px-14 sm:py-14 lg:py-16 lg:px-16 lg:flex-shrink-0"
          style={{ background: '#1a1a1a', flexBasis: '520px' }}
        >
          <h2
            ref={titleRef}
            className="trayectoria-title-split"
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 300,
              fontSize: 'clamp(24px, 2.4vw, 42px)',
              color: RED,
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Inmobiliaria con{' '}
            <span style={{ display: 'block', fontWeight: 700 }}>
              60 años de experiencia
            </span>
            en Antioquia
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleAnimating ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 300,
              fontSize: 'clamp(13px, 1vw, 15px)',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            Desde 1966 acompañamos a personas, familias y propietarios en
            decisiones de arrendamiento, venta, administración e inversión
            inmobiliaria.
          </motion.p>

          <button
            type="button"
            onClick={() => {
              onNavigate('nosotros');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 self-start transition-colors duration-200"
            style={{
              background: RED,
              color: '#fff',
              padding: '13px 20px',
              fontSize: 'clamp(13px, 0.9vw, 14px)',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              fontFamily: FONT_BODY,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#aa182c')}
            onMouseLeave={(e) => (e.currentTarget.style.background = RED)}
          >
            Conocer nuestra historia
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 celdas de stats */}
        <div className="flex-1 grid grid-cols-3" style={{ gap: '3px' }}>
          {STATS.map((s) => (
            <div
              key={s.number}
              className="flex flex-col items-center justify-center py-12 px-4"
              style={{ background: '#2d2d2d' }}
            >
              <span
                style={{
                  fontFamily: "'Avenir LT Pro 85 Heavy', 'Avenir LT Pro', 'Avenir', system-ui, sans-serif",
                  fontSize: 'clamp(36px, 3.5vw, 60px)',
                  fontWeight: 800,
                  color: '#fff',
                  lineHeight: 1,
                }}
              >
                {s.number}
              </span>
              <span
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 'clamp(14px, 1.1vw, 18px)',
                  fontWeight: 500,
                  color: '#fff',
                  marginTop: '8px',
                  lineHeight: 1,
                }}
              >
                {s.label}
              </span>
              <span
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 'clamp(11px, 0.8vw, 13px)',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.5)',
                  marginTop: '4px',
                  lineHeight: 1,
                }}
              >
                {s.sublabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Fila 2: Timeline full-width */}
      <div style={{ background: '#1a1a1a', marginTop: '3px', padding: '40px 0' }}>
        <p
          className="px-8 sm:px-14 lg:px-16 mb-8"
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: '11px',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            margin: '0 0 32px',
          }}
        >
          Línea de tiempo
        </p>

        <div className="relative overflow-x-auto">
          {/* Franja horizontal de fondo */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-full pointer-events-none"
            style={{ height: '56px', background: 'rgba(243,39,53,0.08)' }}
          />

          <div
            className="flex pb-2 min-w-max md:min-w-full px-8 sm:px-14 lg:px-16"
            style={{ gap: '16px' }}
          >
            {HITOS.map((hito) => (
              <div
                key={hito.year}
                className="flex flex-col items-center flex-1"
                style={{ minWidth: '140px', gap: '12px' }}
              >
                {/* Texto arriba */}
                <div className="flex items-end" style={{ height: '64px' }}>
                  <p
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: 'clamp(10px, 0.75vw, 12px)',
                      fontWeight: 400,
                      color: 'rgba(255,255,255,0.45)',
                      lineHeight: 1.4,
                      textAlign: 'center',
                    }}
                  >
                    {hito.label}
                  </p>
                </div>

                {/* Badge de año */}
                <div
                  className="relative z-10 flex items-center justify-center"
                  style={{
                    background: RED,
                    padding: '10px 20px',
                    minWidth: '110px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Avenir LT Pro 85 Heavy', system-ui, sans-serif",
                      fontSize: 'clamp(20px, 1.8vw, 28px)',
                      fontWeight: 900,
                      color: '#fff',
                      lineHeight: 1,
                    }}
                  >
                    {hito.year}
                  </span>
                </div>

                {/* Espacio abajo */}
                <div style={{ height: '64px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
