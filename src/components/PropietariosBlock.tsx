'use client';

import { motion } from 'framer-motion';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import type { PageType } from '@/components/Header';

interface PropietariosBlockProps {
  onNavigate: (page: PageType) => void;
}

const WHATSAPP_URL =
  'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consignar%20una%20propiedad%20con%20Arrendamientos%20Santa%20Fe.';

export default function PropietariosBlock({ onNavigate }: PropietariosBlockProps) {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.propietarios-title-split', 0, true);

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
                fontFamily:
                  "'Avenir Next Ultra Light', 'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif",
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
            >
              Más de 60 años gestionando propiedades en Antioquia. Tu inmueble en manos de quienes conocen el mercado inmobiliario regional.
            </motion.p>

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

            {/* Bloque visual / valores clave */}
            <div className="mt-8 grid grid-cols-2 gap-4">
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
                  Te avisamos cuando haya un arrendatario interesado. Sin demoras, sin contratiempos.
                </p>
              </div>
            </div>
          </div>

          {/* Columna derecha: Imagen con efecto de zoom/escala */}
          <div className="md:col-span-6 flex items-center justify-center">
            <motion.div
              className="relative w-full h-96 md:h-[500px] rounded-xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Capa 1: Fondo */}
              <img
                src="/images/parallax-consignacion-1.png"
                alt="Fondo - Propiedad"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Capa 2: Adelante con opacidad para ver ambas */}
              <img
                src="/images/parallax-consignacion-2.png"
                alt="Frente - Propiedad"
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              />

              {/* Overlay gradient */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent pointer-events-none z-10"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
