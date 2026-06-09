'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import type { PageType } from '@/components/Header';

interface PropietariosBlockProps {
  onNavigate: (page: PageType) => void;
}

const WHATSAPP_URL =
  'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consignar%20una%20propiedad%20con%20Arrendamientos%20Santa%20Fe.';

// Spring physics configuration
const springTransition = {
  type: 'spring' as const,
  damping: 20,
  stiffness: 300,
  mass: 1,
};

// Estadísticas del Grid
const statsData = [
  { id: 1, value: 60, label: 'años de', suffix: '', label2: 'experiencia' },
  { id: 2, value: 3, label: 'sedes en', suffix: '', label2: 'Antioquia' },
  { id: 3, value: 1000, label: 'inmuebles en', suffix: '+', label2: 'gestión activa' },
];

// Componente individual de tarjeta con efecto Staggered Pinning
function StatsCard({ stat, index, scrollY, containerTop }: any) {
  // Convertir scroll global a scroll relativo del contenedor
  // Comenzar el efecto cuando el contenedor está en el viewport
  const relativeScroll = useTransform(scrollY,
    [containerTop - 400, containerTop + 400],  // Rango donde ocurre el efecto
    [0, 800]  // Mapear a progresión del efecto
  );

  // FASE 1: ENTRADA (0-400px) - Las tarjetas convergen hacia Y: 0
  const cardY = useTransform(relativeScroll, [0, 400], [index * 80, 0]);

  // FASE 2: APILAMIENTO (400px-800px) - Las tarjetas se "apilan"
  const cardYStack = useTransform(relativeScroll, [400, 800], [0, -index * 60]);

  // Combinar ambas fases
  const finalY = useTransform(relativeScroll, [0, 800], [index * 80, -index * 60]);

  // Z-index escalonado para crear el efecto de apilamiento visual
  const zIndex = statsData.length - index;

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 md:p-8 flex flex-col justify-center items-center text-center cursor-pointer overflow-hidden relative group min-h-[180px]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ ...springTransition, delay: index * 0.08 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      style={{
        y: finalY,
        zIndex,
      }}
    >
      {/* Hover gradient effect */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-brand-red/20 to-transparent transition-opacity duration-300 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10">
        <p className="text-5xl md:text-6xl font-bold text-white mb-4">
          {stat.value.toLocaleString('es-ES')}
          <span className="text-brand-red">{stat.suffix}</span>
        </p>
        <div className="text-base md:text-lg text-white/80 font-medium leading-tight">
          <p>{stat.label}</p>
          <p>{stat.label2}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function PropietariosBlock({ onNavigate }: PropietariosBlockProps) {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.propietarios-title-split', 0, true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerTop, setContainerTop] = useState(0);

  // Usar scroll global
  const { scrollY } = useScroll();

  // Calcular el offset del contenedor respecto al viewport
  useEffect(() => {
    const updateOffset = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerTop(window.scrollY + rect.top);
      }
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, []);

  return (
    <motion.section
      className="relative bg-brand-dark text-white overflow-hidden"
      style={{ padding: 'clamp(2rem, 5vw, 5rem) clamp(1rem, 4vw, 2rem)' }}
    >
      {/* Acento visual sutil */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 20%, #f32735 0%, transparent 50%), radial-gradient(circle at 20% 80%, #f32735 0%, transparent 40%)',
        }}
      />

      <div className="relative" style={{ width: '100%', maxWidth: 'min(100% - 2rem, 90rem)', margin: '0 auto' }}>
        <div
          className="grid grid-cols-1 md:grid-cols-12 items-center"
          style={{ gap: 'clamp(2rem, 5vw, 3rem)' }}
        >
          {/* Columna izquierda: Contenido */}
          <div className="md:col-span-6 flex flex-col justify-center" style={{ maxHeight: 'clamp(300px, 60vh, 420px)' }}>
            <h2
              ref={titleRef}
              className="propietarios-title-split text-3xl sm:text-4xl lg:text-5xl leading-tight text-white"
              style={{
                fontFamily: "'Avenir Next Ultra Light', 'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif",
                fontWeight: 300,
                lineHeight: '1.2',
              }}
            >
              ¿Tienes un inmueble para{' '}
              <span
                className="text-brand-red inline-block"
                style={{
                  fontWeight: 700,
                }}
              >
                arrendar o vender?
              </span>
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={titleAnimating ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="mt-5 text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed"
              style={{
                fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                fontWeight: 300,
                lineHeight: '1.45',
              }}
            >
              60 años gestionando propiedades en Antioquia. Sabemos cómo cuidar tu inmueble y encontrar el arrendatario indicado.
            </motion.p>

            {/* CTAs */}
            <div className="mt-5 flex flex-col md:flex-row items-center gap-2 md:gap-3">
              {/* CTA Principal */}
              <button
                type="button"
                onClick={() => onNavigate('consignacion')}
                className="w-full md:w-auto inline-flex items-center justify-center h-12 px-6 sm:px-8 bg-brand-red text-white text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 hover:bg-white hover:text-brand-red"
                style={{ lineHeight: '1.2' }}
              >
                Consignar mi propiedad
              </button>

              {/* CTA Secundario - WhatsApp */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto inline-flex items-center justify-center h-12 px-6 sm:px-8 bg-brand-red text-white text-sm font-semibold transition-all duration-300 hover:scale-105 hover:bg-white hover:text-brand-red"
                style={{ lineHeight: '1.2' }}
              >
                Hablar con un asesor
              </a>
            </div>
          </div>

          {/* Columna derecha: Grid con Staggered Pinning */}
          <div
            className="md:col-span-6 flex items-center justify-center"
            ref={containerRef}
            style={{
              minHeight: '600px',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '100%',
                position: 'relative',
                height: '100%',
              }}
            >
              {/* Grid container que contiene las 3 tarjetas apiladas */}
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative">
                {statsData.map((stat, index) => (
                  <StatsCard key={stat.id} stat={stat} index={index} scrollY={scrollY} containerTop={containerTop} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
