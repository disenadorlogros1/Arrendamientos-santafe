'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
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

// Bento Grid items - Mix de tarjetas e imágenes
const bentoItems = [
  {
    id: 1,
    type: 'stat',
    size: 'large',
    value: 1000,
    label: 'inmuebles en',
    label2: 'gestión activa',
    suffix: '+',
    bgImage: 'https://images.unsplash.com/photo-1570129477492-45ac003f2e18?w=600&h=500&fit=crop',
  },
  {
    id: 2,
    type: 'image',
    size: 'small',
    bgImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=400&fit=crop',
  },
  {
    id: 3,
    type: 'image',
    size: 'small',
    bgImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c52e8e?w=400&h=400&fit=crop',
  },
  {
    id: 4,
    type: 'image',
    size: 'small',
    bgImage: 'https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?w=400&h=400&fit=crop',
  },
  {
    id: 5,
    type: 'stat',
    size: 'small',
    value: 60,
    label: 'años de',
    label2: 'experiencia',
    suffix: '',
  },
  {
    id: 6,
    type: 'stat',
    size: 'small',
    value: 3,
    label: 'sedes en',
    label2: 'Antioquia',
    suffix: '',
  },
];

// Componente de tarjeta individual - SIN animación de scroll
function BentoCard({ item, index }: any) {
  // Size classes
  const isLarge = item.size === 'large';
  const colSpan = isLarge ? 'col-span-2 row-span-2' : 'col-span-1';
  const minHeight = isLarge ? 'min-h-[200px]' : 'min-h-[130px]';

  if (item.type === 'image') {
    return (
      <motion.div
        className={`${colSpan} ${minHeight} bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden relative group`}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.05 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.05 }}
        style={{
          backgroundImage: `url(${item.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`${colSpan} ${minHeight} bg-white/10 backdrop-blur-sm border border-white/20 p-4 md:p-6 flex flex-col justify-center items-center text-center cursor-pointer overflow-hidden relative group`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.05 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      style={{
        backgroundImage: item.bgImage ? `url(${item.bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay para tarjetas con imagen */}
      {item.bgImage && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />
      )}

      {/* Hover gradient effect */}
      {!item.bgImage && (
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-brand-red/20 to-transparent transition-opacity duration-300 pointer-events-none"
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        <p className={`${isLarge ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'} font-bold text-white mb-2 md:mb-3`}>
          {item.value.toLocaleString('es-ES')}
          <span className="text-brand-red">{item.suffix}</span>
        </p>
        <div className={`${isLarge ? 'text-base md:text-lg' : 'text-sm md:text-base'} text-white/90 font-medium leading-tight`}>
          <p>{item.label}</p>
          <p>{item.label2}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function PropietariosBlock({ onNavigate }: PropietariosBlockProps) {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.propietarios-title-split', 0, true);
  const containerRef = useRef<HTMLDivElement>(null);

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
          className="grid grid-cols-1 md:grid-cols-12 items-start"
          style={{ gap: 'clamp(1.5rem, 3vw, 2rem)' }}
        >
          {/* Columna izquierda: Contenido */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-start pt-0 md:pt-4">
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

            {/* Descripción después de CTAs */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={titleAnimating ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
              className="mt-6 text-sm sm:text-base text-white/80 max-w-xl leading-relaxed"
              style={{
                fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                fontWeight: 300,
                lineHeight: '1.45',
              }}
            >
              Te avisamos cuando haya un arrendatario interesado. <span className="font-semibold text-white">Sin demoras, sin contratiempos.</span>
            </motion.p>
          </div>

          {/* Columna derecha: Bento Grid */}
          <div
            className="md:col-span-7 lg:col-span-8 flex items-start justify-center"
            ref={containerRef}
            style={{
              minHeight: '500px',
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
              {/* Bento Grid 3x2 */}
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-1.5 md:gap-2 relative">
                {bentoItems.map((item, index) => (
                  <BentoCard key={item.id} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
