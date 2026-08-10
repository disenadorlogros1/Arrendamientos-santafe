'use client';

import { useRef, useEffect, useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import TrayectoriaBlock from '@/components/TrayectoriaBlock';
import type { PageType } from '@/components/Header';

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';

/* ── CountUp ── */
function CountUp({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const ref     = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        let cur = 0;
        const tick = setInterval(() => {
          cur += Math.max(1, Math.ceil(to / 30));
          if (cur >= to) { setCount(to); clearInterval(tick); }
          else            { setCount(cur); }
        }, 40);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

/* ── Data ── */
const cifras: Array<
  | { type: 'count'; num: number; prefix: string; suffix: string; label: string }
  | { type: 'text'; text: string }
> = [
  { type: 'count', num: 200, prefix: '+', suffix: '',        label: 'colaboradores acompañando procesos inmobiliarios'     },
  { type: 'text',  text: 'Miles de clientes han confiado en nuestra gestión a lo largo de seis décadas.'                  },
  { type: 'text',  text: 'Presencia en Antioquia con conocimiento local y acompañamiento cercano en cada proceso.'         },
];

const razones = [
  {
    title: 'Experiencia que da criterio',
    description:
      'Seis décadas en el mercado nos han permitido entender mejor los sectores, los ciclos y las necesidades de propietarios, arrendatarios, compradores e inversionistas.',
  },
  {
    title: 'Acompañamiento cercano',
    description:
      'Escuchamos, orientamos y acompañamos cada proceso con una atención humana, clara y responsable.',
  },
  {
    title: 'Procesos claros y respaldo',
    description:
      'Trabajamos con información organizada, canales definidos y procedimientos que buscan generar tranquilidad en cada etapa.',
  },
];

interface InstitucionalPageProps {
  onNavigate?: (page: PageType) => void;
}

export default function InstitucionalPage({ onNavigate }: InstitucionalPageProps = {}) {
  const [hoveredCifra,  setHoveredCifra]  = useState<number | null>(null);
  const [hoveredRazon,  setHoveredRazon]  = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>

      {/* ── Hero ── */}
      <section
        style={{
          background: '#1a1a1a',
          marginTop: '-86px',
          paddingTop: 'calc(86px + clamp(32px, 5vw, 56px))',
          paddingBottom: 'clamp(24px, 3vw, 40px)',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 clamp(20px, 4vw, 60px)' }}>
          <h1
            style={{
              fontFamily: FONT, fontWeight: 300,
              fontSize: 'clamp(26px, 3.4vw, 48px)',
              color: '#fff', lineHeight: 1.18, margin: '0 0 14px 0',
            }}
          >
            Sobre <span style={{ fontWeight: 700 }}>nosotros</span>
          </h1>
          <p
            style={{
              fontFamily: FONT, fontWeight: 300,
              fontSize: 'clamp(13px, 1.1vw, 16px)',
              color: '#fff',
              margin: 0, maxWidth: '560px', lineHeight: 1.55,
            }}
          >
            Inmobiliaria antioqueña con más de 60 años de trayectoria.
          </p>
        </div>
      </section>

      {/* ── Quiénes somos ── */}
      <section style={{ background: '#fff' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px clamp(20px, 4vw, 52px) 56px' }}>

          <ScrollReveal y={20}>
            <h2
              style={{
                fontFamily: FONT, fontWeight: 300,
                fontSize: 'clamp(24px, 2.8vw, 46px)',
                color: '#555', lineHeight: 1.05, margin: '0 0 16px',
                textAlign: 'center',
              }}
            >
              Somos una inmobiliaria antioqueña<br />
              con <span style={{ fontWeight: 700 }}>60 años de trayectoria.</span>
            </h2>
            <p
              style={{
                fontFamily: FONT, fontWeight: 300,
                fontSize: 'clamp(14px, 1vw, 16px)',
                color: '#888', lineHeight: 1.65, maxWidth: '54rem', margin: '0 auto',
                textAlign: 'center',
              }}
            >
              Desde 1966 acompañamos a personas, familias, propietarios, empresas e inversionistas
              en decisiones de arrendamiento, venta, compra, administración y consignación de inmuebles.
            </p>
          </ScrollReveal>

          {/* Grid cifras 3×1 */}
          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{
              marginTop: 52,
              gap: 'clamp(10px, 1.2vw, 16px)',
            }}
          >
            {cifras.map((cifra, i) => (
              <ScrollReveal key={i} y={12} delay={i * 0.07} style={{ height: '100%' }}>
                <div
                  onMouseEnter={() => setHoveredCifra(i)}
                  onMouseLeave={() => setHoveredCifra(null)}
                  style={{
                    padding: 'clamp(32px, 3.5vw, 48px) clamp(20px, 2.5vw, 36px)',
                    background: '#f5f5f5',
                    display: 'flex',
                    gap: 'clamp(14px, 1.8vw, 24px)',
                    alignItems: 'center',
                    height: '100%',
                    boxSizing: 'border-box',
                    transform: hoveredCifra === i ? 'scale(1.04)' : 'scale(1)',
                    transition: 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    cursor: 'default',
                    zIndex: hoveredCifra === i ? 1 : 0,
                    position: 'relative',
                  }}
                >
                  {/* Número de serie */}
                  <span
                    style={{
                      fontFamily: FONT, fontWeight: 900,
                      fontSize: 'clamp(36px, 3.2vw, 52px)',
                      color: RED, lineHeight: 1, flexShrink: 0,
                    }}
                  >
                    0{i + 1}
                  </span>

                  {/* Contenido */}
                  {cifra.type === 'count' ? (
                    <p
                      style={{
                        fontFamily: FONT, fontWeight: 300,
                        fontSize: 'clamp(13px, 1vw, 16px)',
                        color: '#555', lineHeight: 1.55, margin: 0,
                      }}
                    >
                      <span style={{ fontWeight: 700 }}><CountUp to={cifra.num} prefix={cifra.prefix} /></span>
                      {' '}{cifra.label}
                    </p>
                  ) : (
                    <p
                      style={{
                        fontFamily: FONT, fontWeight: 300,
                        fontSize: 'clamp(13px, 1vw, 16px)',
                        color: '#555', lineHeight: 1.55, margin: 0,
                      }}
                    >
                      {cifra.text}
                    </p>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Por qué confiar ── */}
      <section style={{ background: '#fff' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px clamp(20px, 4vw, 52px) 56px' }}>

          <ScrollReveal y={20}>
            <h2
              style={{
                fontFamily: FONT, fontWeight: 300,
                fontSize: 'clamp(24px, 2.8vw, 46px)',
                color: '#555', lineHeight: 1.2, margin: 0,
                textAlign: 'center',
              }}
            >
              ¿Por qué confiar en{' '}
              <span style={{ fontWeight: 700 }}>arrendamientos Santa Fe</span>?
            </h2>
          </ScrollReveal>

          {/* Grid razones 3×1 */}
          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{
              marginTop: 40,
              gap: 'clamp(10px, 1.2vw, 16px)',
            }}
          >
            {razones.map((razon, i) => (
              <ScrollReveal key={i} y={12} delay={i * 0.09} style={{ height: '100%' }}>
                <div
                  onMouseEnter={() => setHoveredRazon(i)}
                  onMouseLeave={() => setHoveredRazon(null)}
                  style={{
                    padding: 'clamp(24px, 3vw, 40px) clamp(20px, 2.5vw, 36px)',
                    background: '#f5f5f5',
                    height: '100%',
                    boxSizing: 'border-box',
                    transform: hoveredRazon === i ? 'scale(1.04)' : 'scale(1)',
                    transition: 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    cursor: 'default',
                    zIndex: hoveredRazon === i ? 1 : 0,
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT, fontWeight: 900,
                      fontSize: 'clamp(36px, 3.2vw, 52px)',
                      color: RED, lineHeight: 1, display: 'block',
                      marginBottom: 16,
                    }}
                  >
                    0{i + 1}
                  </span>
                  <h3
                    style={{
                      fontFamily: FONT, fontWeight: 700,
                      fontSize: 'clamp(15px, 1.2vw, 19px)',
                      color: '#1a1a1a', lineHeight: 1.25,
                      margin: '0 0 10px',
                    }}
                  >
                    {razon.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: FONT, fontWeight: 300,
                      fontSize: 'clamp(13px, 1vw, 16px)',
                      color: '#888', lineHeight: 1.6, margin: 0,
                    }}
                  >
                    {razon.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Banner 60 años ── */}
      {onNavigate && <TrayectoriaBlock onNavigate={onNavigate} />}

    </div>
  );
}
