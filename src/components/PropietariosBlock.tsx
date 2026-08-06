'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import { useCountAnimation } from '@/hooks/useCountAnimation';
import type { PageType } from '@/components/Header';

gsap.registerPlugin(ScrollTrigger);

interface PropietariosBlockProps {
  onNavigate: (page: PageType) => void;
}

const WHATSAPP_URL =
  'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consignar%20una%20propiedad%20con%20Arrendamientos%20Santa%20Fe.';

const FONT_BODY    = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const FONT_HEADING = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const FONT_HEAVY   = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED          = '#f32735';

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

export default function PropietariosBlock({ onNavigate }: PropietariosBlockProps) {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.propietarios-title-split', 0, true);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Refs for titleAnimating-driven elements
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef  = useRef<HTMLDivElement>(null);
  const lastPRef    = useRef<HTMLParagraphElement>(null);

  // Refs for scroll-driven clip-path panels
  const panelARef = useRef<HTMLDivElement>(null);
  const clipARef  = useRef<HTMLDivElement>(null);
  const gradARef  = useRef<HTMLDivElement>(null);

  const panelBRef = useRef<HTMLDivElement>(null);
  const clipBRef  = useRef<HTMLDivElement>(null);
  const gradBRef  = useRef<HTMLDivElement>(null);

  const panelCRef = useRef<HTMLDivElement>(null);
  const clipCRef  = useRef<HTMLDivElement>(null);
  const gradCRef  = useRef<HTMLDivElement>(null);

  // titleAnimating-driven animations
  useEffect(() => {
    if (!titleAnimating) return;
    const targets = [
      { el: subtitleRef.current,  delay: 0 },
      { el: buttonsRef.current,   delay: 0.1 },
      { el: lastPRef.current,     delay: 0.2 },
    ];
    targets.forEach(({ el, delay }) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, delay, ease: 'power2.out' }
      );
    });
  }, [titleAnimating]);

  // Scroll-driven clip-path reveal
  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;

    if (!isDesktop) {
      // En mobile las imágenes se muestran directamente sin animación de clip
      gsap.set([clipARef.current, clipBRef.current, clipCRef.current], { clipPath: 'none' });
      gsap.set([gradARef.current, gradBRef.current, gradCRef.current], { opacity: 1 });
      return;
    }

    // Initial states
    gsap.set(clipARef.current, { clipPath: 'inset(0 0 0 100%)' });
    gsap.set(clipBRef.current, { clipPath: 'inset(0 0 100% 0)' });
    gsap.set(clipCRef.current, { clipPath: 'inset(0 100% 0 0)' });
    gsap.set([gradARef.current, gradBRef.current, gradCRef.current], { opacity: 0 });

    const ctx = gsap.context(() => {
      // Scrubbed timeline — total duration 1.0 maps to scroll range
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
        },
      });

      const D = 0.88;

      // Panel A: scroll [0, 0.88] — left reveal
      tl.to(clipARef.current, { clipPath: 'inset(0 0 0 0%)', ease: 'none', duration: D }, 0);
      tl.to(gradARef.current, { opacity: 1,                  ease: 'none', duration: D * 0.7 }, D * 0.3);

      // Panel B: scroll [0.06, 0.94] — bottom reveal
      tl.to(clipBRef.current, { clipPath: 'inset(0 0 0% 0)', ease: 'none', duration: D }, 0.06);
      tl.to(gradBRef.current, { opacity: 1,                  ease: 'none', duration: D * 0.7 }, 0.06 + D * 0.3);

      // Panel C: scroll [0.12, 1.0] — right reveal
      tl.to(clipCRef.current, { clipPath: 'inset(0 0% 0 0)', ease: 'none', duration: D }, 0.12);
      tl.to(gradCRef.current, { opacity: 1,                  ease: 'none', duration: D * 0.7 }, 0.12 + D * 0.3);

      // Panel entry animations
      [
        { ref: panelARef, delay: 0 },
        { ref: panelBRef, delay: 0.09 },
        { ref: panelCRef, delay: 0.18 },
      ].forEach(({ ref, delay }) => {
        if (!ref.current) return;
        gsap.from(ref.current, {
          opacity: 0,
          scale: 0.92,
          duration: 0.55,
          delay,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-black w-full overflow-hidden" style={{ maxWidth: '1920px', margin: '0 auto' }}>

      <div className="flex flex-col lg:flex-row lg:h-[460px]">

        {/* ── BANNER MOBILE — solo visible en < lg ─────────────── */}
        <img
          src="/images/banner_propietarios_2.png"
          alt=""
          aria-hidden
          className="lg:hidden w-full"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            backgroundColor: '#000',
          }}
        />

        {/* ── COLUMNA IZQUIERDA ─────────────────────────────────── */}
        <div
          className="flex flex-col justify-start gap-4 px-6 pt-5 pb-5 sm:px-14 sm:py-12 lg:justify-center lg:py-0 lg:pl-16 lg:pr-14 lg:flex-shrink-0 lg:flex-grow-0 lg:basis-[672px]"
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

          <p
            ref={subtitleRef}
            style={{ fontFamily: FONT_BODY, fontSize: 'clamp(13px, 1.1vw, 17px)', fontWeight: 300, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.08, opacity: 0 }}
          >
            Más de 60 años gestionando propiedades en Antioquia. Tu inmueble en
            manos de quienes conocen el mercado inmobiliario regional.
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-2.5" style={{ opacity: 0 }}>
            <button
              onClick={() => onNavigate('consignacion')}
              className="flex-1 transition-colors duration-200"
              style={{ background: RED, color: '#fff', padding: '13px 16px', fontSize: 'clamp(13px, 0.9vw, 14px)', fontWeight: 500, border: 'none', outline: 'none', borderRadius: 0, cursor: 'pointer', fontFamily: FONT_BODY }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#aa182c')}
              onMouseLeave={(e) => (e.currentTarget.style.background = RED)}
            >
              Consignar mi propiedad
            </button>
            <button
              onClick={() => window.open(WHATSAPP_URL, '_blank')}
              className="flex-1 transition-colors duration-200"
              style={{ background: RED, color: '#fff', padding: '13px 16px', fontSize: 'clamp(13px, 0.9vw, 14px)', fontWeight: 500, border: 'none', outline: 'none', borderRadius: 0, cursor: 'pointer', fontFamily: FONT_BODY }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#aa182c')}
              onMouseLeave={(e) => (e.currentTarget.style.background = RED)}
            >
              Hablar con un asesor
            </button>
          </div>

          <p
            ref={lastPRef}
            style={{ fontFamily: FONT_BODY, fontSize: 'clamp(13px, 1.1vw, 17px)', fontWeight: 300, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.45, opacity: 0 }}
          >
            Te avisamos cuando haya un arrendatario interesado.{' '}
            <strong style={{ fontWeight: 700, color: '#fff' }}>Sin demoras, sin contratiempos.</strong>
          </p>
        </div>

        {/* ── GRID DERECHO — solo en lg+ ───────────────────────── */}
        <div
          className="hidden lg:grid flex-1 grid-cols-3 grid-rows-2 lg:h-full"
          style={{ gap: '3px' }}
        >

          {/* ── PAR A — cols 1-2, fila 1 (left reveal) */}
          <div
            ref={panelARef}
            className="group"
            style={{ gridColumn: '1 / 3', gridRow: '1', position: 'relative', overflow: 'hidden' }}
          >
            <div ref={clipARef} style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
              <div
                className="absolute inset-0 transition-transform duration-[650ms] ease-out group-hover:scale-[1.06]"
                style={{ backgroundImage: 'url(/images/banner_propietarios_1.png)', backgroundSize: 'cover', backgroundPosition: 'center top' }}
              />
            </div>
            <div ref={gradARef} style={{
              position: 'absolute', left: 0, top: 0, width: '58%', height: '100%',
              background: 'linear-gradient(to right, rgba(0,0,0,0.78) 50%, transparent)',
              zIndex: 2, pointerEvents: 'none',
            }} />
            <StatOverlay endValue={1000} prefix="+" label="inmuebles" sublabel="en gestión activa" duration={2000} position="left" />
          </div>

          {/* ── PAR B — col 3, filas 1-2 (bottom reveal) */}
          <div
            ref={panelBRef}
            className="group"
            style={{ gridColumn: '3', gridRow: '1 / 3', position: 'relative', overflow: 'hidden' }}
          >
            <div ref={clipBRef} style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
              <div
                className="absolute inset-0 transition-transform duration-[650ms] ease-out group-hover:scale-[1.06]"
                style={{ backgroundImage: 'url(/images/banner_propietarios_3.png)', backgroundSize: 'cover', backgroundPosition: 'center top' }}
              />
            </div>
            <div ref={gradBRef} style={{
              position: 'absolute', bottom: 0, left: 0, width: '100%', height: '58%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.78) 50%, transparent)',
              zIndex: 2, pointerEvents: 'none',
            }} />
            <StatOverlay endValue={3} prefix="" label="sedes" sublabel="en Antioquia" duration={800} position="bottom" />
          </div>

          {/* ── PAR C — cols 1-2, fila 2 (right reveal) */}
          <div
            ref={panelCRef}
            className="group"
            style={{ gridColumn: '1 / 3', gridRow: '2', position: 'relative', overflow: 'hidden' }}
          >
            <div ref={clipCRef} style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
              <div
                className="absolute inset-0 transition-transform duration-[650ms] ease-out group-hover:scale-[1.06]"
                style={{ backgroundImage: 'url(/images/banner_propietarios_2.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
            </div>
            <div ref={gradCRef} style={{
              position: 'absolute', right: 0, top: 0, width: '58%', height: '100%',
              background: 'linear-gradient(to left, rgba(0,0,0,0.78) 50%, transparent)',
              zIndex: 2, pointerEvents: 'none',
            }} />
            <StatOverlay endValue={60} prefix="" label="años" sublabel="de experiencia" duration={1600} position="right" />
          </div>

        </div>
      </div>
    </section>
  );
}