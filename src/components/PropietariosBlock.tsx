'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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

/* ── Texto de cifra con animación de conteo ──────────────────────── */

function StatOverlay({
  endValue,
  prefix = '',
  label,
  sublabel,
  duration = 2000,
  position,
}: {
  endValue: number;
  prefix?: string;
  label: string;
  sublabel: string;
  duration?: number;
  position: 'left' | 'right' | 'bottom';
}) {
  const { ref: countRef, count } = useCountAnimation(endValue, duration);

  const posStyle: React.CSSProperties =
    position === 'left'
      ? { left: 0, top: 0, width: '50%', height: '100%' }
      : position === 'right'
      ? { right: 0, top: 0, width: '50%', height: '100%' }
      : { bottom: 0, left: 0, width: '100%', height: '50%' };

  return (
    <div
      ref={countRef}
      style={{
        position: 'absolute',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...posStyle,
      }}
    >
      <span style={{ fontFamily: FONT_HEAVY, fontSize: 'clamp(28px, 3.2vw, 56px)', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
        {prefix}{count}
      </span>
      <span style={{ fontFamily: FONT_BODY, fontSize: 'clamp(12px, 1vw, 16px)', fontWeight: 300, color: '#fff', marginTop: '6px', lineHeight: 1 }}>
        {label}
      </span>
      <span style={{ fontFamily: FONT_BODY, fontSize: 'clamp(10px, 0.8vw, 12px)', fontWeight: 300, color: 'rgba(255,255,255,0.6)', marginTop: '3px', lineHeight: 1 }}>
        {sublabel}
      </span>
    </div>
  );
}

/* ── Componente principal ────────────────────────────────────────── */

export default function PropietariosBlock({ onNavigate }: PropietariosBlockProps) {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.propietarios-title-split', 0, true);
  const sectionRef = useRef<HTMLDivElement>(null);

  /* Scroll: empieza cuando el borde superior llega a corte 1 (20%)
     y termina cuando el borde inferior llega a corte 2 (80%)        */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.2', 'end 0.8'],
  });

  /* Tres pares con stagger leve — usan todo el rango 0→1 del offset */
  const progressA = useTransform(scrollYProgress, [0,    0.88], [0, 1]);
  const clipA     = useTransform(progressA, (p) => `inset(0 0 0 ${(1 - p) * 50}%)`);
  const bgOpA     = useTransform(progressA, [0, 1], [1, 0]);
  const gradOpA   = useTransform(progressA, [0.3, 1], [0, 1]);

  const progressB = useTransform(scrollYProgress, [0.06, 0.94], [0, 1]);
  const clipB     = useTransform(progressB, (p) => `inset(0 0 ${(1 - p) * 50}% 0)`);
  const bgOpB     = useTransform(progressB, [0, 1], [1, 0]);
  const gradOpB   = useTransform(progressB, [0.3, 1], [0, 1]);

  const progressC = useTransform(scrollYProgress, [0.12, 1],    [0, 1]);
  const clipC     = useTransform(progressC, (p) => `inset(0 ${(1 - p) * 50}% 0 0)`);
  const bgOpC     = useTransform(progressC, [0, 1], [1, 0]);
  const gradOpC   = useTransform(progressC, [0.3, 1], [0, 1]);

  return (
    <section ref={sectionRef} className="bg-black w-full overflow-hidden" style={{ maxWidth: '1920px', margin: '0 auto' }}>

      <div className="flex flex-col lg:flex-row lg:h-[460px]">

        {/* ── COLUMNA IZQUIERDA ─────────────────────────────────── */}
        <div
          className="flex flex-col justify-center gap-5 px-8 py-10 sm:px-14 sm:py-12 lg:py-0 lg:pl-16 lg:pr-14 lg:flex-shrink-0 lg:flex-grow-0"
          style={{ flexBasis: '672px' }}
        >
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

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleAnimating ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ fontFamily: FONT_BODY, fontSize: 'clamp(13px, 1.1vw, 17px)', fontWeight: 300, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.08 }}
          >
            Más de 60 años gestionando propiedades en Antioquia. Tu inmueble en
            manos de quienes conocen el mercado inmobiliario regional.
          </motion.p>

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

        {/* ── GRID DERECHO — 3 pares ────────────────────────────── */}
        <div
          className="flex-1 grid grid-cols-3 grid-rows-2 h-[200px] sm:h-[260px] lg:h-full"
          style={{ gap: '3px' }}
        >

          {/* ── PAR A — cols 1-2, fila 1
               Foto (celda 2) invade el stat (celda 1) hacia la izquierda */}
          <motion.div
            className="group"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay: 0, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ gridColumn: '1 / 3', gridRow: '1', position: 'relative', overflow: 'hidden' }}
          >
            {/* Fondo oscuro del stat — se desvanece al invadir */}
            <motion.div style={{
              position: 'absolute', left: 0, top: 0, width: '50%', height: '100%',
              background: '#2d2d2d', opacity: bgOpA, zIndex: 1,
            }} />

            {/* Foto con clip-path animado + hover zoom en inner div */}
            <motion.div style={{ position: 'absolute', inset: 0, clipPath: clipA, zIndex: 0, overflow: 'hidden' }}>
              <div
                className="absolute inset-0 transition-transform duration-[650ms] ease-out group-hover:scale-[1.06]"
                style={{ backgroundImage: 'url(/images/Banner_consigna_propiedad.png)', backgroundSize: 'cover', backgroundPosition: 'center top' }}
              />
            </motion.div>

            {/* Gradiente de legibilidad sobre la zona del stat */}
            <motion.div style={{
              position: 'absolute', left: 0, top: 0, width: '58%', height: '100%',
              background: 'linear-gradient(to right, rgba(0,0,0,0.78) 50%, transparent)',
              opacity: gradOpA, zIndex: 2, pointerEvents: 'none',
            }} />

            <StatOverlay endValue={1000} prefix="+" label="inmuebles" sublabel="en gestión activa" duration={2000} position="left" />
          </motion.div>

          {/* ── PAR B — col 3, filas 1-2
               Foto (celda 3) invade el stat (celda 6) hacia abajo */}
          <motion.div
            className="group"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay: 0.09, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ gridColumn: '3', gridRow: '1 / 3', position: 'relative', overflow: 'hidden' }}
          >
            {/* Fondo oscuro del stat */}
            <motion.div style={{
              position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%',
              background: '#2d2d2d', opacity: bgOpB, zIndex: 1,
            }} />

            {/* Foto */}
            <motion.div style={{ position: 'absolute', inset: 0, clipPath: clipB, zIndex: 0, overflow: 'hidden' }}>
              <div
                className="absolute inset-0 transition-transform duration-[650ms] ease-out group-hover:scale-[1.06]"
                style={{ backgroundImage: 'url(/images/banner_inversionistas.png)', backgroundSize: 'cover', backgroundPosition: 'center top' }}
              />
            </motion.div>

            {/* Gradiente */}
            <motion.div style={{
              position: 'absolute', bottom: 0, left: 0, width: '100%', height: '58%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.78) 50%, transparent)',
              opacity: gradOpB, zIndex: 2, pointerEvents: 'none',
            }} />

            <StatOverlay endValue={3} prefix="" label="sedes" sublabel="en Antioquia" duration={800} position="bottom" />
          </motion.div>

          {/* ── PAR C — cols 1-2, fila 2
               Foto (celda 4) invade el stat (celda 5) hacia la derecha */}
          <motion.div
            className="group"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ gridColumn: '1 / 3', gridRow: '2', position: 'relative', overflow: 'hidden' }}
          >
            {/* Fondo oscuro del stat */}
            <motion.div style={{
              position: 'absolute', right: 0, top: 0, width: '50%', height: '100%',
              background: '#2d2d2d', opacity: bgOpC, zIndex: 1,
            }} />

            {/* Foto */}
            <motion.div style={{ position: 'absolute', inset: 0, clipPath: clipC, zIndex: 0, overflow: 'hidden' }}>
              <div
                className="absolute inset-0 transition-transform duration-[650ms] ease-out group-hover:scale-[1.06]"
                style={{ backgroundImage: 'url(/images/banner_propietarios.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
            </motion.div>

            {/* Gradiente */}
            <motion.div style={{
              position: 'absolute', right: 0, top: 0, width: '58%', height: '100%',
              background: 'linear-gradient(to left, rgba(0,0,0,0.78) 50%, transparent)',
              opacity: gradOpC, zIndex: 2, pointerEvents: 'none',
            }} />

            <StatOverlay endValue={60} prefix="" label="años" sublabel="de experiencia" duration={1600} position="right" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
