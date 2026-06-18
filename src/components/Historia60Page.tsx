'use client';

import { Fragment } from 'react';
import { motion } from 'framer-motion';
import type { PageType } from '@/components/Header';

interface Props {
  onNavigate: (page: PageType) => void;
}

const FONT_BODY    = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const FONT_HEADING = "'Avenir Next Ultra Light', 'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif";
const FONT_HEAVY   = "'Avenir LT Pro 85 Heavy', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';
const DARK = '#1a1a1a';
const BG   = '#f7f6f4';

const events = [
  {
    year: '1966',
    title: 'Donde todo comenzó',
    body: 'Arrendamientos Santa Fe nace en Medellín con una visión de servicio, confianza y acompañamiento inmobiliario.',
    img: '/images/1966_Donde_todo_comenz%C3%B3.jpeg',
    objectPos: '60% 20%',
  },
  {
    year: '1974',
    title: 'Primeros cimientos',
    body: 'La empresa fortalece su presencia y consolida una operación más cercana para propietarios y clientes.',
    img: '/images/1974_primeros_cimientos.jpeg',
    objectPos: '85% 20%',
  },
  {
    year: '2006',
    title: 'Reconocimiento y consolidación',
    body: 'Cuatro décadas de trabajo reflejan una trayectoria construida con compromiso, seriedad y respaldo.',
    img: '/images/2006_Reconocimiento_consolidaci%C3%B3n.png',
    objectPos: '55% 20%',
  },
  {
    year: '2017',
    title: 'Más cerca de nuestros clientes',
    body: 'Con la apertura de la sede en Envigado, Santa Fe amplía su presencia y fortalece su cercanía con nuevas zonas del Valle de Aburrá.',
    img: '/images/2017_M%C3%A1s_cerca_de_nuestros%20clientes.png',
    objectPos: '70% 20%',
  },
  {
    year: '2018',
    title: 'Evolución de marca',
    body: 'Arrendamientos Santa Fe renueva su imagen para proyectar una empresa más actual, cercana y coherente con su evolución, sin perder la esencia que ha construido durante décadas.',
    img: '/images/2018_Evoluci%C3%B3n_de_marca.png',
    objectPos: '40% 20%',
  },
  {
    year: '2026',
    title: '60 años acompañando nuevas decisiones',
    body: 'Santa Fe celebra seis décadas de historia con una nueva etapa: la apertura de su sede en Rionegro, un paso que reafirma su compromiso de estar más cerca de quienes toman decisiones inmobiliarias en el Oriente Antioqueño.',
    img: '/images/2026_60_a%C3%B1os.png',
    objectPos: '15% 20%',
  },
];

// Axis geometry
const CONNECTOR_H = 32;
const DOT_SIZE    = 10;
const LINE_TOP    = CONNECTOR_H + DOT_SIZE / 2; // px from top of axis row to line center

export default function Historia60Page({ onNavigate }: Props) {

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>

      {/* ── Article Hero ─────────────────────────────────────── */}
      <div style={{ background: '#0d0d0d', position: 'relative', overflow: 'hidden' }}>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute', right: '-40px', top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: FONT_HEAVY,
            fontSize: 'clamp(180px, 28vw, 380px)',
            fontWeight: 800,
            color: 'rgba(255,255,255,0.042)',
            lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
          }}
        >60</span>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', padding: '20px clamp(20px, 5vw, 80px) 20px' }}>
          <button
            type="button"
            onClick={() => onNavigate('blog')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontFamily: FONT_BODY, fontSize: '13px', fontWeight: 300,
              color: 'rgba(255,255,255,0.4)', background: 'transparent',
              border: 'none', cursor: 'pointer', padding: 0, marginBottom: '16px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Volver al blog
          </button>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
            style={{ fontFamily: FONT_HEADING, fontSize: 'clamp(24px, 3.2vw, 44px)', fontWeight: 300, color: '#fff', lineHeight: 1.18, margin: '0 0 14px 0' }}
          >
            60 años de historia{' '}
            <span style={{ fontWeight: 700 }}>en el corazón de Antioquia</span>
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.16 }} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ fontFamily: FONT_BODY, fontSize: '12px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.02em' }}>Junio 2026</span>
            <span style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.12)' }} />
            <span style={{ fontFamily: FONT_BODY, fontSize: '12px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.02em' }}>5 min de lectura</span>
          </motion.div>
        </div>
      </div>

      {/* ── Timeline Section ──────────────────────────────────── */}
      <div style={{ padding: '20px 0' }}>

        {/* ── Desktop (lg+) — imágenes arriba, texto abajo ── */}
        <div
          className="hidden lg:grid"
          style={{
            gridTemplateRows: 'auto auto auto',
            gridTemplateColumns: 'repeat(6, 1fr)',
            columnGap: '14px',
            padding: '0 clamp(32px, 4vw, 72px)',
          }}
        >
          {/* Línea horizontal — se dibuja de izquierda a derecha */}
          <div style={{ gridRow: '2', gridColumn: '1 / -1', position: 'relative', zIndex: 0 }}>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                position: 'absolute',
                top: `${LINE_TOP}px`,
                left: 'calc(100% / 12)',
                right: 'calc(100% / 12)',
                height: '2px',
                background: DARK,
                transformOrigin: 'left center',
              }}
            />
          </div>

          {events.map((event, i) => {
            const lineDelay = (i / (events.length - 1)) * 1.1;
            const dotDelay  = lineDelay + 0.05;
            const imgDelay  = lineDelay + 0.0;
            const textDelay = lineDelay + 0.20;
            const isLast    = event.year === '2026';

            return (
              <Fragment key={event.year}>

                {/* Row 1 — IMAGEN horizontal completa */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.55, delay: imgDelay }}
                  style={{ gridRow: '1', gridColumn: i + 1 }}
                >
                  <div
                    className="group overflow-hidden"
                    style={{ width: '100%', aspectRatio: '4/3', cursor: 'pointer' }}
                  >
                    <img
                      src={event.img}
                      alt={event.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                      style={{ objectPosition: event.objectPos }}
                    />
                  </div>
                </motion.div>

                {/* Row 2 — EJE: conector arriba + dot + año + conector abajo */}
                <div style={{
                  gridRow: '2',
                  gridColumn: i + 1,
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  {/* Conector punteado hacia imagen */}
                  <div style={{ height: `${CONNECTOR_H}px`, width: '1px', borderLeft: '1px dashed rgba(0,0,0,0.25)' }} />

                  {/* Dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.32, delay: dotDelay, type: 'spring', stiffness: 320, damping: 18 }}
                    style={{
                      width: `${DOT_SIZE}px`, height: `${DOT_SIZE}px`,
                      borderRadius: '50%',
                      background: isLast ? RED : '#fff',
                      border: `2px solid ${isLast ? RED : DARK}`,
                      flexShrink: 0, zIndex: 2,
                    }}
                  />

                  {/* Año */}
                  <span style={{
                    fontFamily: FONT_HEAVY,
                    fontSize: 'clamp(10px, 0.8vw, 12px)',
                    color: isLast ? RED : DARK,
                    letterSpacing: '0.05em',
                    marginTop: '6px',
                    flexShrink: 0,
                  }}>
                    {event.year}
                  </span>

                  {/* Conector punteado hacia texto */}
                  <div style={{ height: `${CONNECTOR_H}px`, width: '1px', borderLeft: '1px dashed rgba(0,0,0,0.25)', marginTop: '6px' }} />
                </div>

                {/* Row 3 — TEXTO (todos abajo) */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: textDelay }}
                  style={{
                    gridRow: '3',
                    gridColumn: i + 1,
                    padding: '14px 10px 40px 10px',
                  }}
                >
                  <h3 style={{
                    fontFamily: FONT_HEAVY,
                    fontSize: 'clamp(11px, 0.88vw, 13px)',
                    color: DARK, margin: '0 0 7px 0', lineHeight: 1.35,
                  }}>
                    {event.title}
                  </h3>
                  <p style={{
                    fontFamily: FONT_BODY,
                    fontSize: 'clamp(10px, 0.78vw, 12px)',
                    color: '#999', margin: 0, lineHeight: 1.65,
                  }}>
                    {event.body}
                  </p>
                </motion.div>

              </Fragment>
            );
          })}
        </div>

        {/* ── Mobile (< lg) — vertical con imagen ── */}
        <div className="lg:hidden" style={{ padding: '0 clamp(20px, 5vw, 40px)', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: 'calc(clamp(20px, 5vw, 40px) + 19px)',
            top: 0, bottom: 0,
            width: '2px', background: 'rgba(0,0,0,0.1)',
          }} />

          {events.map((event, i) => {
            const isLast = event.year === '2026';
            return (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                style={{ display: 'flex', gap: '20px', paddingBottom: i < events.length - 1 ? '36px' : 0 }}
              >
                {/* Dot */}
                <div style={{ width: '40px', flexShrink: 0, paddingTop: '6px', position: 'relative' }}>
                  <div style={{
                    width: `${DOT_SIZE}px`, height: `${DOT_SIZE}px`,
                    borderRadius: '50%',
                    background: isLast ? RED : '#fff',
                    border: `2px solid ${isLast ? RED : DARK}`,
                    marginLeft: '14px', position: 'relative', zIndex: 1,
                  }} />
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  {/* Imagen mobile: proporción más horizontal */}
                  <div
                    className="group overflow-hidden mb-3"
                    style={{ width: '100%', height: 'clamp(140px, 42vw, 200px)' }}
                  >
                    <img
                      src={event.img}
                      alt={event.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                      style={{ objectPosition: event.objectPos }}
                    />
                  </div>
                  <span style={{
                    fontFamily: FONT_HEAVY, fontSize: '12px',
                    color: isLast ? RED : DARK, letterSpacing: '0.06em',
                    display: 'block', marginBottom: '6px',
                  }}>
                    {event.year}
                  </span>
                  <h3 style={{ fontFamily: FONT_HEAVY, fontSize: 'clamp(14px, 3.8vw, 17px)', color: DARK, margin: '0 0 6px 0', lineHeight: 1.3 }}>
                    {event.title}
                  </h3>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 'clamp(13px, 3.2vw, 14px)', color: '#888', margin: 0, lineHeight: 1.6 }}>
                    {event.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Closing ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        style={{ background: DARK, padding: 'clamp(48px, 6vw, 72px) clamp(20px, 5vw, 80px)', textAlign: 'center' }}
      >
        <p style={{ fontFamily: FONT_HEADING, fontSize: 'clamp(20px, 2.4vw, 34px)', fontWeight: 300, color: '#fff', lineHeight: 1.45, margin: '0 auto 32px auto', maxWidth: '680px' }}>
          Seis décadas después, seguimos con la misma vocación:{' '}
          <span style={{ fontWeight: 700, color: RED }}>acompañar decisiones que cambian vidas.</span>
        </p>
        <button
          type="button"
          onClick={() => onNavigate('consignacion')}
          style={{
            fontFamily: FONT_BODY, fontSize: '14px', fontWeight: 600,
            color: '#fff', background: RED, border: 'none', cursor: 'pointer',
            padding: '14px 32px', borderRadius: '2px', transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#aa182c')}
          onMouseLeave={e => (e.currentTarget.style.background = RED)}
        >
          Consigna tu propiedad
        </button>
      </motion.div>

    </div>
  );
}
