'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import { ArrowRight } from 'lucide-react';
import type { PageType } from '@/components/Header';

interface TrayectoriaBlockProps {
  onNavigate: (page: PageType) => void;
}

const FONT_BODY    = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const FONT_HEADING = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED          = '#f32735';

const HITOS = [
  { year: '1966', label: 'Nacemos en Medellín con una promesa: acompañar cada decisión con confianza y cercanía.', img: '/images/1966_Donde_todo_comenz%C3%B3.jpeg', objectPos: '60% 20%' },
  { year: '1974', label: 'Consolidamos nuestra operación y ganamos la confianza de propietarios y clientes en Antioquia.', img: '/images/1974_primeros_cimientos.jpeg', objectPos: '85% 20%' },
  { year: '2006', label: 'Cuatro décadas de trayectoria avalan nuestro respaldo y seriedad en el sector inmobiliario.', img: '/images/2006_Reconocimiento_consolidaci%C3%B3n.png', objectPos: '55% 20%' },
  { year: '2017', label: 'Abrimos sede en Envigado y ampliamos nuestra presencia en el sur del Valle de Aburrá.', img: '/images/2017_M%C3%A1s_cerca_de_nuestros%20clientes.png', objectPos: '70% 20%' },
  { year: '2018', label: 'Renovamos nuestra imagen para proyectar lo que siempre hemos sido: cercanos, serios y vigentes.', img: '/images/2018_Evoluci%C3%B3n_de_marca.png', objectPos: '40% 20%' },
  { year: '2026', label: '60 años creciendo con Antioquia. Celebramos con la apertura de nuestra sede en Rionegro.', img: '/images/2026_60_a%C3%B1os.png', objectPos: '15% 20%' },
];

export default function TrayectoriaBlock({ onNavigate }: TrayectoriaBlockProps) {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.trayectoria-title-split', 0, true);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!titleAnimating || !subtitleRef.current) return;
    gsap.fromTo(subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, [titleAnimating]);

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

          <p
            ref={subtitleRef}
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 400,
              fontSize: 'clamp(13px, 1vw, 15px)',
              color: '#666',
              lineHeight: 1.55,
              margin: 0,
              opacity: 0,
            }}
          >
            Desde 1966 acompañamos a personas, familias y propietarios en
            decisiones de arrendamiento, venta, administración e inversión
            inmobiliaria.
          </p>

          <button
            type="button"
            onClick={() => {
              onNavigate('historia-60');
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
            <div
              className="flex min-w-max lg:min-w-full px-8 sm:px-10 lg:px-12"
              style={{ gap: '8px', paddingTop: '28px', paddingBottom: '8px' }}
            >
              {HITOS.map((hito, i) => {
                const above = i % 2 === 0;
                return (
                  <div
                    key={hito.year}
                    className="flex flex-col items-center flex-1"
                    style={{ minWidth: '120px', gap: '10px' }}
                  >
                    {/* Label — alterna arriba / abajo */}
                    <div
                      className="flex items-end"
                      style={{ height: '64px', visibility: above ? 'visible' : 'hidden' }}
                    >
                      <p
                        style={{
                          fontFamily: FONT_BODY,
                          fontSize: 'clamp(10px, 0.72vw, 11px)',
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

                    {/* Franja de imagen con año superpuesto */}
                    <div
                      className="group relative z-10 overflow-hidden w-full"
                      style={{ height: '150px' }}
                    >
                      <img
                        src={hito.img}
                        alt={hito.year}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        style={{ objectPosition: hito.objectPos }}
                      />
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)',
                        padding: '20px 0 6px',
                        textAlign: 'center',
                      }}>
                        <span style={{
                          fontFamily: "'Avenir LT Std', system-ui, sans-serif",
                          fontSize: 'clamp(14px, 1.3vw, 18px)',
                          fontWeight: 900,
                          color: '#fff',
                          lineHeight: 1,
                        }}>
                          {hito.year}
                        </span>
                      </div>
                    </div>

                    {/* Label — abajo para los ítems impares */}
                    <div
                      className="flex items-start"
                      style={{ height: '64px', visibility: above ? 'hidden' : 'visible' }}
                    >
                      <p
                        style={{
                          fontFamily: FONT_BODY,
                          fontSize: 'clamp(10px, 0.72vw, 11px)',
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