'use client';

import { motion } from 'framer-motion';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import { useCountAnimation } from '@/hooks/useCountAnimation';
import type { PageType } from '@/components/Header';

interface PropietariosBlockProps {
  onNavigate: (page: PageType) => void;
}

const WHATSAPP_URL =
  'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consignar%20una%20propiedad%20con%20Arrendamientos%20Santa%20Fe.';

const FONT_BODY    = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const FONT_HEADING = "'Avenir Next Ultra Light', 'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif";
const FONT_HEAVY   = "'Avenir LT Pro 85 Heavy', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const RED          = '#f32735';

const EASE_BENTO = [0.25, 0.46, 0.45, 0.94] as const;

/* ── Sub-componentes ─────────────────────────────────────────────── */

function StatCard({
  endValue,
  prefix = '',
  label,
  sublabel,
  duration = 2000,
}: {
  endValue: number;
  prefix?: string;
  label: string;
  sublabel: string;
  duration?: number;
}) {
  const { ref: countRef, count } = useCountAnimation(endValue, duration);

  return (
    <motion.div
      ref={countRef}
      style={{
        background: '#2d2d2d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
      whileHover={{ backgroundColor: '#3a3a3a' }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        style={{
          fontFamily: FONT_HEAVY,
          fontSize: 'clamp(28px, 3.2vw, 56px)',
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1,
          display: 'block',
        }}
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {prefix}{count}
      </motion.span>
      <span style={{ fontFamily: FONT_BODY, fontSize: 'clamp(12px, 1vw, 16px)', fontWeight: 300, color: '#fff', marginTop: '6px', lineHeight: 1 }}>
        {label}
      </span>
      <span style={{ fontFamily: FONT_BODY, fontSize: 'clamp(10px, 0.8vw, 12px)', fontWeight: 300, color: 'rgba(255,255,255,0.6)', marginTop: '3px', lineHeight: 1 }}>
        {sublabel}
      </span>
    </motion.div>
  );
}

function PhotoCell({ url, position = 'center' }: { url: string; position?: string }) {
  return (
    <div style={{ overflow: 'hidden', height: '100%', position: 'relative' }}>
      <motion.div
        style={{
          backgroundImage: `url(${url})`,
          backgroundSize: 'cover',
          backgroundPosition: position,
          height: '100%',
          width: '100%',
          transformOrigin: 'center center',
        }}
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.65, ease: EASE_BENTO }}
      />
    </div>
  );
}

/* ── Datos del grid ──────────────────────────────────────────────── */

const GRID = [
  { type: 'stat',  endValue: 1000, prefix: '+', label: 'inmuebles', sublabel: 'en gestión activa',  duration: 2000 },
  { type: 'photo', url: '/images/Banner_consigna_propiedad.png', position: 'center top' },
  { type: 'photo', url: '/images/banner_inversionistas.png',     position: 'center top' },
  { type: 'photo', url: '/images/banner_propietarios.png',       position: 'center' },
  { type: 'stat',  endValue: 60,   prefix: '',  label: 'años',      sublabel: 'de experiencia',      duration: 1600 },
  { type: 'stat',  endValue: 3,    prefix: '',  label: 'sedes',     sublabel: 'en Antioquia',         duration: 800  },
] as const;

/* ── Componente principal ────────────────────────────────────────── */

export default function PropietariosBlock({ onNavigate }: PropietariosBlockProps) {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.propietarios-title-split', 0, true);

  return (
    <section className="bg-black w-full overflow-hidden" style={{ maxWidth: '1920px', margin: '0 auto' }}>

      <div className="flex flex-col lg:flex-row lg:h-[460px]">

        {/* ── COLUMNA IZQUIERDA (+20% ancho) ───────────────────── */}
        <div
          className="flex flex-col justify-center gap-5 px-8 py-10 sm:px-14 sm:py-12 lg:py-0 lg:pl-16 lg:pr-14 lg:flex-shrink-0 lg:flex-grow-0"
          style={{ flexBasis: '672px' }}
        >
          {/* Título */}
          <h2
            ref={titleRef}
            className="propietarios-title-split"
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 300,
              fontSize: 'clamp(26px, 2.6vw, 46px)',
              color: '#fff',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            ¿Tienes un inmueble para{' '}
            <span style={{ display: 'block', fontWeight: 700, color: RED }}>
              arrendar o vender?
            </span>
          </h2>

          {/* Descripción — interlineado −30% (1.55 → 1.08) */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleAnimating ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              fontFamily: FONT_BODY,
              fontSize: 'clamp(13px, 1.1vw, 17px)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.75)',
              margin: 0,
              lineHeight: 1.08,
            }}
          >
            Más de 60 años gestionando propiedades en Antioquia. Tu inmueble en
            manos de quienes conocen el mercado inmobiliario regional.
          </motion.p>

          {/* Botones */}
          <motion.div
            className="flex gap-2.5"
            initial={{ opacity: 0, y: 20 }}
            animate={titleAnimating ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
          >
            <button
              onClick={() => onNavigate('consignacion')}
              className="flex-1 transition-colors duration-200"
              style={{ background: RED, color: '#fff', padding: '13px 16px', fontSize: 'clamp(13px, 0.9vw, 14px)', fontWeight: 500, border: 'none', borderRadius: '2px', cursor: 'pointer', fontFamily: FONT_BODY }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#aa182c')}
              onMouseLeave={(e) => (e.currentTarget.style.background = RED)}
            >
              Consignar mi propiedad
            </button>

            <button
              onClick={() => window.open(WHATSAPP_URL, '_blank')}
              className="flex-1 transition-colors duration-200"
              style={{ background: RED, color: '#fff', padding: '13px 16px', fontSize: 'clamp(13px, 0.9vw, 14px)', fontWeight: 500, border: 'none', borderRadius: '2px', cursor: 'pointer', fontFamily: FONT_BODY }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#aa182c')}
              onMouseLeave={(e) => (e.currentTarget.style.background = RED)}
            >
              Hablar con un asesor
            </button>
          </motion.div>

          {/* Nota — mismo tamaño que subtítulo del Hero */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleAnimating ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
            style={{ fontFamily: FONT_BODY, fontSize: 'clamp(13px, 1.1vw, 17px)', fontWeight: 300, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.45 }}
          >
            Te avisamos cuando haya un arrendatario interesado.{' '}
            <strong style={{ fontWeight: 700, color: '#fff' }}>Sin demoras, sin contratiempos.</strong>
          </motion.p>
        </div>

        {/* ── GRID DERECHO 3 × 2 — efecto Bento stagger ───────── */}
        <div
          className="flex-1 grid grid-cols-3 grid-rows-2 h-[200px] sm:h-[260px] lg:h-full"
          style={{ gap: '3px' }}
        >
          {GRID.map((cell, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: i * 0.09, ease: EASE_BENTO }}
              style={{ overflow: 'hidden' }}
            >
              {cell.type === 'stat' ? (
                <StatCard
                  endValue={cell.endValue}
                  prefix={cell.prefix}
                  label={cell.label}
                  sublabel={cell.sublabel}
                  duration={cell.duration}
                />
              ) : (
                <PhotoCell url={cell.url} position={cell.position} />
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
