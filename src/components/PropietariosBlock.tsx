'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import { useCountAnimation } from '@/hooks/useCountAnimation';
import type { PageType } from '@/components/Header';

interface PropietariosBlockProps {
  onNavigate: (page: PageType) => void;
}

const WHATSAPP_URL =
  'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consignar%20una%20propiedad%20con%20Arrendamientos%20Santa%20Fe.';

// Spring physics configuration para movimiento natural
const springTransition = {
  type: 'spring' as const,
  damping: 20,
  stiffness: 300,
  mass: 1,
};

// Estadísticas del Bento Grid
const bentoStats = [
  { id: 1, value: 2500, label: 'Propiedades', suffix: '+', size: 'large' },
  { id: 2, value: 15000, label: 'Clientes', suffix: '+', size: 'medium' },
  { id: 3, value: 98, label: 'Satisfacción', suffix: '%', size: 'medium' },
  { id: 4, value: 12, label: 'Ciudades', suffix: '', size: 'small' },
  { id: 5, value: 8500, label: 'Transacciones', suffix: '+', size: 'medium' },
  { id: 6, value: 4.2, label: 'Rentabilidad', suffix: '%', size: 'small' },
];

export default function PropietariosBlock({ onNavigate }: PropietariosBlockProps) {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.propietarios-title-split', 0, true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref: statsRef, count: count60 } = useCountAnimation(60, 2000);
  const { ref: countRef3, count: count3 } = useCountAnimation(3, 1500);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll-driven animation: detecta scroll y actualiza el estado
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      className="relative bg-brand-dark text-white overflow-hidden"
      layout
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
              Más de 60 años gestionando propiedades en Antioquia. Tu inmueble en manos de quienes conocen el mercado inmobiliario regional.
            </motion.p>

            {/* CTAs en ROJO */}
            <div className="mt-5 flex flex-col md:flex-row items-center gap-2 md:gap-3">
              {/* CTA Principal */}
              <button
                type="button"
                onClick={() => onNavigate('consignacion')}
                className="w-full md:w-auto inline-flex items-center justify-center h-12 px-4 sm:px-6 bg-brand-red text-white text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 hover:bg-white hover:text-brand-red"
                style={{ lineHeight: '1.2' }}
              >
                Consignar mi propiedad
              </button>

              {/* CTA Secundario */}
              <button
                type="button"
                onClick={() => onNavigate('consignacion')}
                className="w-full md:w-auto inline-flex items-center justify-center h-12 px-4 sm:px-6 bg-brand-red text-white text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 hover:bg-white hover:text-brand-red"
                style={{ lineHeight: '1.2' }}
              >
                Conoce más
              </button>

              {/* CTA Operativo */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto inline-flex items-center justify-center h-12 px-4 sm:px-6 bg-brand-red text-white text-sm font-semibold transition-all duration-300 hover:scale-105 hover:bg-white hover:text-brand-red"
                style={{ lineHeight: '1.2' }}
              >
                Hablar con un asesor
              </a>
            </div>

            {/* Bloque unificado con borde blanco - Bento Grid Dinámico */}
            <motion.div
              className="mt-4 border-2 border-white p-4 md:p-6"
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={springTransition}
              viewport={{ once: true }}
              style={{
                transform: `translateY(${scrollProgress * 20}px)`,
              }}
            >
              {/* Estadísticas en Bento Grid dinámico */}
              <motion.div
                className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-32 mb-8 items-center"
                layout
                onClick={() => setIsBentoExpanded(!isBentoExpanded)}
                style={{ cursor: 'pointer' }}
              >
                {/* Estadística 1 - Spring Physics */}
                <motion.div
                  ref={statsRef}
                  className="flex items-center gap-4 flex-1"
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={springTransition}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, x: 10 }}
                >
                  <p className="text-6xl md:text-7xl font-bold text-white leading-none">{count60}</p>
                  <div className="text-3xl md:text-4xl text-white/90 leading-none">
                    <p className="font-semibold">años</p>
                    <p className="text-sm md:text-base leading-[0.75]">de experiencia</p>
                  </div>
                </motion.div>

                {/* Estadística 2 - Spring Physics */}
                <motion.div
                  ref={countRef3}
                  className="flex items-center gap-4 flex-1"
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ ...springTransition, delay: 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, x: 10 }}
                >
                  <p className="text-6xl md:text-7xl font-bold text-white leading-none">{count3}</p>
                  <div className="text-3xl md:text-4xl text-white/90 leading-none">
                    <p className="font-semibold">sedes</p>
                    <p className="text-sm md:text-base leading-[0.75]">en Antioquia</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Texto descriptivo - ancho completo */}
              <p className="text-white/90 leading-relaxed text-sm md:text-base">
                Te avisamos cuando haya un arrendatario interesado. <span className="font-bold">Sin demoras, sin contratiempos.</span>
              </p>
            </motion.div>
          </div>

          {/* Columna derecha: Bento Grid de Estadísticas */}
          <div className="md:col-span-6 flex items-center justify-center">
            <div className="w-full grid grid-cols-3 gap-3 md:gap-4">
              {bentoStats.map((stat, index) => {
                const isLarge = stat.size === 'large';
                const isMedium = stat.size === 'medium';
                const colSpan = isLarge ? 'col-span-2 row-span-2' : isMedium ? 'col-span-2' : 'col-span-1';

                return (
                  <motion.div
                    key={stat.id}
                    className={`${colSpan} bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 md:p-6 flex flex-col justify-center items-center text-center cursor-pointer overflow-hidden relative group`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ ...springTransition, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -10 }}
                  >
                    {/* Hover gradient effect */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-brand-red/20 to-transparent transition-opacity duration-300 pointer-events-none"
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ ...springTransition, delay: index * 0.05 + 0.2 }}
                        viewport={{ once: true }}
                      >
                        <p className={`${isLarge ? 'text-5xl md:text-6xl' : isMedium ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'} font-bold text-white mb-2`}>
                          {stat.value.toLocaleString('es-ES')}
                          <span className="text-brand-red">{stat.suffix}</span>
                        </p>
                        <p className={`${isLarge ? 'text-lg md:text-xl' : isMedium ? 'text-base md:text-lg' : 'text-sm md:text-base'} text-white/80 font-medium`}>
                          {stat.label}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
