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

export default function TrayectoriaBlock({ onNavigate }: TrayectoriaBlockProps) {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.trayectoria-title-split', 0, true);

  return (
    <section style={{ background: '#fff' }} className="w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row">

        {/* Celda título */}
        <div
          className="flex flex-col justify-center gap-6 px-8 py-12 sm:px-14 sm:py-14 lg:py-16 lg:px-16 lg:flex-shrink-0"
          style={{
            flexBasis: '460px',
            borderRight: '1px solid #f0f0f0',
            borderBottom: '1px solid #f0f0f0',
          }}
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
              fontWeight: 400,
              fontSize: 'clamp(13px, 1vw, 15px)',
              color: '#666',
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
              borderRadius: '2px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#aa182c')}
            onMouseLeave={(e) => (e.currentTarget.style.background = RED)}
          >
            Conocer nuestra historia
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline — ocupa el espacio donde estaban las stats */}
        <div style={{ flex: 1, overflow: 'hidden', borderBottom: '1px solid #f0f0f0' }}>

          {/* Etiqueta "Línea de tiempo" */}
          <p
            className="px-8 sm:px-10 lg:px-12"
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: '#bbb',
              textTransform: 'uppercase',
              margin: '32px 0 0',
            }}
          >
            Línea de tiempo
          </p>

          {/* Timeline horizontal */}
          <div className="relative overflow-x-auto" style={{ padding: '0 0 32px' }}>

            {/* Franja de fondo centrada en los badges */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: '50%',
                left: 0,
                right: 0,
                height: '60px',
                transform: 'translateY(-50%)',
                background: 'rgba(243,39,53,0.07)',
              }}
            />

            <div
              className="flex min-w-max lg:min-w-full px-8 sm:px-10 lg:px-12"
              style={{ gap: '12px', paddingTop: '28px', paddingBottom: '8px' }}
            >
              {HITOS.map((hito, i) => {
                const above = i % 2 === 0;
                return (
                  <div
                    key={hito.year}
                    className="flex flex-col items-center flex-1"
                    style={{ minWidth: '130px', gap: '10px' }}
                  >
                    {/* Label — alterna arriba / abajo */}
                    <div
                      className="flex items-end"
                      style={{ height: '60px', visibility: above ? 'visible' : 'hidden' }}
                    >
                      <p
                        style={{
                          fontFamily: FONT_BODY,
                          fontSize: 'clamp(10px, 0.72vw, 12px)',
                          fontWeight: 400,
                          color: '#888',
                          lineHeight: 1.45,
                          textAlign: 'center',
                          margin: 0,
                        }}
                      >
                        {hito.label}
                      </p>
                    </div>

                    {/* Badge año */}
                    <div
                      className="relative z-10 flex items-center justify-center"
                      style={{
                        background: RED,
                        padding: '9px 18px',
                        minWidth: '100px',
                        borderRadius: '2px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Avenir LT Pro 85 Heavy', system-ui, sans-serif",
                          fontSize: 'clamp(18px, 1.6vw, 26px)',
                          fontWeight: 900,
                          color: '#fff',
                          lineHeight: 1,
                        }}
                      >
                        {hito.year}
                      </span>
                    </div>

                    {/* Label — abajo para los ítems pares */}
                    <div
                      className="flex items-start"
                      style={{ height: '60px', visibility: above ? 'hidden' : 'visible' }}
                    >
                      <p
                        style={{
                          fontFamily: FONT_BODY,
                          fontSize: 'clamp(10px, 0.72vw, 12px)',
                          fontWeight: 400,
                          color: '#888',
                          lineHeight: 1.45,
                          textAlign: 'center',
                          margin: 0,
                        }}
                      >
                        {hito.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
