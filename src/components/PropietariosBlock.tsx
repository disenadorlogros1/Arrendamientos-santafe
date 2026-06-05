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

export default function PropietariosBlock({ onNavigate }: PropietariosBlockProps) {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.propietarios-title-split', 0, true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: statsRef, count: count60 } = useCountAnimation(60, 2000);
  const { ref: countRef3, count: count3 } = useCountAnimation(3, 1500);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Calcula la posición del mouse dentro del contenedor (-1 a 1)
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Aplica el parallax (máximo ±40px) - reducido para evitar cortes
      setOffsetX(x * 40);
      setOffsetY(y * 40);
    }
  };

  const handleMouseLeave = () => {
    setOffsetX(0);
    setOffsetY(0);
  };

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
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Columna izquierda: Contenido */}
          <div className="md:col-span-6">
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
            <div className="mt-8 flex flex-col md:flex-row items-center gap-3">
              {/* CTA Principal */}
              <button
                type="button"
                onClick={() => onNavigate('consignacion')}
                className="w-full md:w-auto inline-flex items-center justify-center h-12 px-6 bg-brand-red text-white text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 hover:bg-white hover:text-brand-red"
                style={{ lineHeight: '1.2' }}
              >
                Consignar mi propiedad
              </button>

              {/* CTA Secundario */}
              <button
                type="button"
                onClick={() => onNavigate('consignacion')}
                className="w-full md:w-auto inline-flex items-center justify-center h-12 px-6 bg-brand-red text-white text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 hover:bg-white hover:text-brand-red"
                style={{ lineHeight: '1.2' }}
              >
                Conoce más
              </button>

              {/* CTA Operativo */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto inline-flex items-center justify-center h-12 px-6 bg-brand-red text-white text-sm font-semibold transition-all duration-300 hover:scale-105 hover:bg-white hover:text-brand-red"
                style={{ lineHeight: '1.2' }}
              >
                Hablar con un asesor
              </a>
            </div>

            {/* Bloque unificado con borde blanco */}
            <div className="mt-8 border-2 border-white rounded-lg p-8">
              {/* Estadísticas en una fila */}
              <div className="flex gap-16 md:gap-32 mb-8 items-center">
                {/* Estadística 1 */}
                <div ref={statsRef} className="flex items-center gap-4">
                  <p className="text-6xl md:text-7xl font-bold text-white leading-none">{count60}</p>
                  <div className="text-base md:text-lg text-white/90 leading-tight">
                    <p className="font-semibold">años</p>
                    <p>de experiencia</p>
                  </div>
                </div>

                {/* Estadística 2 */}
                <div ref={countRef3} className="flex items-center gap-4">
                  <p className="text-6xl md:text-7xl font-bold text-white leading-none">{count3}</p>
                  <div className="text-base md:text-lg text-white/90 leading-tight">
                    <p className="font-semibold">sedes</p>
                    <p>en Antioquia</p>
                  </div>
                </div>
              </div>

              {/* Texto descriptivo - ancho completo */}
              <p className="text-white/90 leading-relaxed border-t border-white/30 pt-6 text-sm md:text-base">
                Te avisamos cuando haya un arrendatario interesado. <span className="font-bold">Sin demoras, sin contratiempos.</span>
              </p>
            </div>
          </div>

          {/* Columna derecha: Imagen con parallax del mouse */}
          <div className="md:col-span-6 flex items-center justify-center">
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full h-96 md:h-[500px] rounded-xl overflow-hidden shadow-2xl cursor-move"
            >
              {/* Capa 1: Fondo - ESTÁTICA */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
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
                  className="absolute w-full h-full"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    minHeight: '140%',
                    minWidth: '140%',
                    top: '-20%',
                    left: '-20%'
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
    </section>
  );
}
