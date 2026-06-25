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
      <div className="flex flex-col lg:flex-row lg:h-[460px]">

        {/* Columna texto */}
        <div
          className="flex flex-col justify-center gap-5 px-8 py-10 sm:px-14 sm:py-12 lg:py-0 lg:pl-16 lg:pr-14 lg:flex-shrink-0 lg:flex-grow-0"
          style={{ flexBasis: '672px' }}
        >
          <h2
            ref={titleRef}
            className="trayectoria-title-split"
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 300,
              fontSize: 'clamp(24px, 2.4vw, 42px)',
              color: '#555',
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
            className="inline-flex items-center justify-center gap-2 w-full transition-colors duration-200"
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

        {/* Grid 6 columnas × 1 fila */}
        <div
          className="flex-1 grid h-[240px] sm:h-[320px] lg:h-full"
          style={{ gridTemplateColumns: 'repeat(6, 1fr)', gap: '3px' }}
        >
          {HITOS.map((hito) => (
            <div
              key={hito.year}
              className="group relative overflow-hidden"
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
                padding: '24px 0 8px',
                textAlign: 'center',
              }}>
                <span style={{
                  fontFamily: "'Avenir LT Std', system-ui, sans-serif",
                  fontSize: 'clamp(13px, 1.1vw, 17px)',
                  fontWeight: 900,
                  color: '#fff',
                  lineHeight: 1,
                }}>
                  {hito.year}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}