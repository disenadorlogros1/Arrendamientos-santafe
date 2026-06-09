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

export default function PropietariosBlock({ onNavigate }: PropietariosBlockProps) {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.propietarios-title-split', 0, true);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref: statsRef, count: count60 } = useCountAnimation(60, 2000);
  const { ref: countRef3, count: count3 } = useCountAnimation(3, 1500);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isBentoExpanded, setIsBentoExpanded] = useState(false);

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Calcula la posición del mouse dentro del contenedor (-1 a 1)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Aplica el parallax: imagen superior 50% más de movimiento (±40px) que el fondo (±25px)
    setOffsetX(x * 40);
    setOffsetY(y * 40);
  };

  const handleMouseLeave = () => {
    setOffsetX(0);
    setOffsetY(0);
  };

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
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
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

          {/* Columna derecha: Imagen con parallax del mouse */}
          <div className="md:col-span-6 flex items-center justify-center">
            <div
              ref={containerRef}
              className="relative w-full overflow-hidden shadow-2xl cursor-move"
              style={{ height: 'clamp(200px, 50vw, 420px)', aspectRatio: '16 / 9' }}
            >
              {/* Capa 1: Fondo - PARALLAX LENTO */}
              <div
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{
                  transform: `translate(${offsetX * 0.625}px, ${offsetY * 0.625}px)`,
                  transition: 'transform 0.1s ease-out',
                }}
              >
                <img
                  src="/images/parallax-consignacion-1.png"
                  alt="Fondo - Propiedad"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center' }}
                />
              </div>

              {/* Capa 2: Adelante - PARALLAX DEL MOUSE */}
              <div
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{
                  transform: `translate(${offsetX}px, ${offsetY}px)`,
                  transition: 'transform 0.1s ease-out',
                }}
              >
                <img
                  src="/images/parallax-consignacion-2.png"
                  alt="Frente - Propiedad"
                  className="w-full h-full"
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'center'
                  }}
                />
              </div>

              {/* Overlay gradient */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent pointer-events-none z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
