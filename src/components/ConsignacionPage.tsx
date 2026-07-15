'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import ScrollReveal from '@/components/ScrollReveal';
import type { PageType } from '@/components/Header';

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';

const WHATSAPP_URL = 'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consignar%20una%20propiedad%20con%20Arrendamientos%20Santa%20Fe.';

function applyInkFill(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const size = Math.max(Math.hypot(x,y), Math.hypot(rect.width-x,y), Math.hypot(x,rect.height-y), Math.hypot(rect.width-x,rect.height-y)) * 2;
  el.style.setProperty('--x', `${x}px`);
  el.style.setProperty('--y', `${y}px`);
  el.style.setProperty('--size', `${size}px`);
}

const pasos = [
  {
    number: '01',
    title: 'Déjanos tus datos',
    description: 'Cuéntanos sobre tu inmueble. Te contactamos para comenzar el proceso sin ningún costo de promoción.',
  },
  {
    number: '02',
    title: 'Asesoría completa',
    description: 'Nuestro equipo te brinda una asesoría personalizada con estudio de mercado y avalúo comercial incluido.',
  },
  {
    number: '03',
    title: 'Nos encargamos del resto',
    description: 'Promoción, selección del arrendatario, contratos y administración. Tú solo recibes el pago puntual.',
  },
];

const razones = [
  {
    icon: '/icons/icon-schedule-red.gif',
    title: 'Experiencia',
    description: 'Contamos con más de 55 años de trayectoria, siendo una de las empresas pioneras del sector inmobiliario en Antioquia.',
  },
  {
    icon: '/icons/icon-favorite-red.gif',
    title: 'Confiabilidad',
    description: 'Administramos tu inmueble y nos aseguramos de que sea arrendado o comprado por la persona indicada.',
  },
  {
    icon: '/icons/icon-dollar-red.gif',
    title: 'Respaldo',
    description: 'Garantizamos el pago del canon de arrendamiento y servicios públicos básicos.',
  },
];

interface ConsignacionPageProps {
  onNavigate?: (page: PageType) => void;
}

export default function ConsignacionPage({ onNavigate }: ConsignacionPageProps = {}) {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.consignacion-title-split', 0, false);
  const subtitleRef    = useRef<HTMLParagraphElement>(null);
  const ctaBtnRef      = useRef<HTMLDivElement>(null);
  const [titleHovered, setTitleHovered] = useState(false);
  const [hoveredPaso,  setHoveredPaso]  = useState<number | null>(null);
  const [hoveredRazon, setHoveredRazon] = useState<number | null>(null);

  useEffect(() => {
    if (!titleAnimating) return;
    if (subtitleRef.current) {
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
    if (ctaBtnRef.current) {
      gsap.fromTo(ctaBtnRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.1, ease: 'power2.out' }
      );
    }
  }, [titleAnimating]);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section
        className="relative h-[550px] md:h-[720px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800"
        style={{ marginTop: '-86px' }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/Banner_consigna_propiedad.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl" ref={titleRef}>
          <h1
            className="consignacion-title-split leading-tight text-white text-center"
            style={{ fontFamily: FONT, fontWeight: 300, lineHeight: '1.2', fontSize: 'clamp(28px, 4vw, 52px)' }}
            onMouseEnter={() => setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
          >
            Ten la tranquilidad de dejar tu inmueble en{' '}
            <span style={{ display: 'inline-block', fontWeight: 700, position: 'relative', overflow: 'hidden' }}>
              <span style={{ position: 'relative', zIndex: 2 }}>buenas manos</span>
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '62%',
                  left: 0,
                  width: '100%',
                  height: '13%',
                  backgroundColor: RED,
                  transform: `translateY(-50%) scaleX(${titleHovered ? 1 : 0})`,
                  transformOrigin: 'left center',
                  zIndex: 1,
                  transition: 'transform 0.234s ease',
                  pointerEvents: 'none',
                }}
              />
            </span>
          </h1>

          <p
            ref={subtitleRef}
            style={{
              fontFamily: FONT, fontWeight: 300, lineHeight: '1.45',
              color: 'rgba(255,255,255,0.8)', maxWidth: '36rem', margin: '1.25rem auto 0',
              fontSize: 'clamp(14px, 1vw, 18px)', opacity: 0,
            }}
          >
            Consigna tu inmueble con nosotros y deja que nuestro equipo experto se encargue de todo. Más de 60 años generando resultados.
          </p>

          <div ref={ctaBtnRef} className="mt-8 text-center" style={{ opacity: 0 }}>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={applyInkFill}
              onMouseLeave={applyInkFill}
              className="hero-btn-fill inline-flex items-center gap-2 justify-center h-12 px-8 rounded-full"
              style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, textDecoration: 'none', cursor: 'pointer' }}
            >
              <span>Empecemos ahora mismo</span>
              <img src="/icons/icon-whatsapp-white.gif" alt="WhatsApp" width={20} height={20} style={{ position: 'relative', zIndex: 1 }} />
            </a>
          </div>
        </div>
      </section>

      {/* Proceso — 3 cards horizontales */}
      <section style={{ background: '#f7f6f4' }} className="w-full">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '52px clamp(20px, 4vw, 52px) 28px', textAlign: 'center' }}>
          <ScrollReveal y={20}>
            <h2 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 'clamp(26px, 2.6vw, 46px)', color: '#555', lineHeight: 1.2, margin: 0 }}>
              Consigna tu inmueble <span style={{ fontWeight: 700 }}>en 3 pasos</span>
            </h2>
            <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 'clamp(14px, 1vw, 16px)', color: '#888', marginTop: 12, lineHeight: 1.5 }}>
              Sin costo de promoción. Arriéndalo o véndelo en el menor tiempo posible.
            </p>
          </ScrollReveal>
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 52px) 0' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 0 }}>
            {pasos.map((paso, idx) => {
              const isHov = hoveredPaso === idx;
              const isAdj = hoveredPaso !== null && Math.abs(idx - hoveredPaso) === 1;
              return (
                <div
                  key={paso.number}
                  style={{
                    padding: '28px 24px 32px',
                    background: '#fff',
                    cursor: 'default',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 20,
                    transform: isHov ? 'scale(1.05)' : isAdj ? 'scale(0.97)' : 'scale(1)',
                    zIndex: isHov ? 10 : 1, position: 'relative',
                    transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease',
                    boxShadow: isHov ? '0 8px 32px rgba(0,0,0,0.18)' : 'none',
                  }}
                  onMouseEnter={() => setHoveredPaso(idx)}
                  onMouseLeave={() => setHoveredPaso(null)}
                >
                  <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 'clamp(34px, 2.8vw, 48px)', color: RED, lineHeight: 1, flexShrink: 0 }}>
                    {paso.number}
                  </span>
                  <div style={{ paddingTop: 4 }}>
                    <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 'clamp(15px, 1.1vw, 18px)', color: '#1a1a1a', margin: '0 0 8px 0', lineHeight: 1.2 }}>
                      {paso.title}
                    </h3>
                    <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 'clamp(12.5px, 0.9vw, 14px)', color: 'rgba(0,0,0,0.55)', margin: 0, lineHeight: 1.6 }}>
                      {paso.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '10px clamp(20px, 4vw, 52px) 40px', textAlign: 'center' }}>
          <p style={{ fontFamily: FONT, fontSize: 13, color: '#888', margin: 0 }}>
            *Al continuar estoy aceptando la{' '}
            <button
              type="button"
              onClick={() => { onNavigate?.('politicas'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit', fontFamily: 'inherit', color: RED, fontWeight: 500 }}
            >
              política de tratamiento de datos personales
            </button>
            .
          </p>
        </div>
      </section>

      {/* ¿Por qué escogernos? — 3 cards centradas, sin CTA */}
      <section style={{ background: '#fff' }} className="w-full">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '52px clamp(20px, 4vw, 52px) 28px', textAlign: 'center' }}>
          <ScrollReveal y={20}>
            <h2 style={{ fontFamily: FONT, fontWeight: 300, fontSize: 'clamp(26px, 2.6vw, 46px)', color: '#555', lineHeight: 1.2, margin: 0 }}>
              ¿Por qué <span style={{ fontWeight: 700 }}>escogernos?</span>
            </h2>
          </ScrollReveal>
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 52px) 52px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 0 }}>
            {razones.map((r, idx) => {
              const isHov = hoveredRazon === idx;
              const isAdj = hoveredRazon !== null && Math.abs(idx - hoveredRazon) === 1;
              return (
                <div
                  key={r.title}
                  style={{
                    padding: '32px 24px 36px',
                    background: '#f5f5f5',
                    cursor: 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 14,
                    transform: isHov ? 'scale(1.08)' : isAdj ? 'scale(0.96)' : 'scale(1)',
                    zIndex: isHov ? 10 : 1, position: 'relative',
                    transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease',
                    boxShadow: isHov ? '0 8px 32px rgba(0,0,0,0.18)' : 'none',
                  }}
                  onMouseEnter={() => setHoveredRazon(idx)}
                  onMouseLeave={() => setHoveredRazon(null)}
                >
                  <img src={r.icon} alt="" width={44} height={44} style={{ flexShrink: 0, display: 'block' }} />
                  <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 'clamp(17px, 1.3vw, 22px)', color: '#1a1a1a', margin: 0, lineHeight: 1.15 }}>
                    {r.title}
                  </h3>
                  <p style={{ fontFamily: FONT, fontWeight: 300, fontSize: 'clamp(13px, 0.95vw, 15px)', color: 'rgba(0,0,0,0.55)', margin: 0, lineHeight: 1.6 }}>
                    {r.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA final — niebla */}
      <section className="py-16 md:py-20" style={{ background: '#ccc' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal y={20}>
            <h2
              className="text-3xl md:text-4xl font-bold mb-8"
              style={{ fontFamily: FONT, color: '#555' }}
            >
              ¿Listo para arrendar o vender tu inmueble?
            </h2>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={applyInkFill}
              onMouseLeave={applyInkFill}
              className="cta-btn-light inline-flex items-center gap-2 h-12 px-8 rounded-full"
              style={{ fontFamily: FONT, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}
            >
              <span>Solicitar asesoría</span>
              <img src="/icons/icon-whatsapp-red.gif" alt="WhatsApp" className="w-5 h-5" style={{ position: 'relative', zIndex: 1 }} />
            </a>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
