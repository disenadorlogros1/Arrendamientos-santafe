'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PageType } from '@/components/Header';

gsap.registerPlugin(ScrollTrigger);

function applyInkFill(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const size = Math.max(
    Math.hypot(x, y), Math.hypot(rect.width - x, y),
    Math.hypot(x, rect.height - y), Math.hypot(rect.width - x, rect.height - y),
  ) * 2;
  el.style.setProperty('--x', `${x}px`);
  el.style.setProperty('--y', `${y}px`);
  el.style.setProperty('--size', `${size}px`);
}

interface TrayectoriaBlockProps {
  onNavigate: (page: PageType) => void;
}

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';

/* ── Layer sources — mismos que Historia60Page ─────────────────── */
const L66 = [
  '/images/Linea%20de%20tiempo/1966-Fondo.webp',
  '/images/Linea%20de%20tiempo/1966-fecha-1.webp',
  '/images/Linea%20de%20tiempo/1966-fecha-2.webp',
  '/images/Linea%20de%20tiempo/1966-recorte-superior.webp',
  '/images/Linea%20de%20tiempo/1966-superior.webp',
];
const L74 = [
  '/images/Linea%20de%20tiempo/1974-Fondo.webp',
  '/images/Linea%20de%20tiempo/1974-fecha-1.webp',
  '/images/Linea%20de%20tiempo/1974-fecha-2.webp',
  '/images/Linea%20de%20tiempo/1974-recorte-superior.webp',
  '/images/Linea%20de%20tiempo/1974-superior.webp',
];
const Z = [2, 4, 6, 8, 10];

const HITOS = [
  { year: '1966', set: 'L66', title: 'Donde todo comenzó',
    body: 'Arrendamientos Santa Fe nace en Medellín con una visión de servicio, confianza y acompañamiento inmobiliario.' },
  { year: '1974', set: 'L74', title: 'Primeros cimientos',
    body: 'La empresa fortalece su presencia y consolida una operación más cercana para propietarios y clientes.' },
  { year: '2006', set: 'L66', title: 'Reconocimiento y consolidación',
    body: 'Cuatro décadas de trabajo reflejan una trayectoria construida con compromiso, seriedad y respaldo.' },
  { year: '2017', set: 'L74', title: 'Más cerca de nuestros clientes',
    body: 'Con la apertura de la sede en Envigado, Santa Fe amplía su presencia en el Valle de Aburrá.' },
  { year: '2018', set: 'L66', title: 'Evolución de marca',
    body: 'Arrendamientos Santa Fe renueva su imagen para proyectar una empresa más actual, cercana y coherente.' },
  { year: '2026', set: 'L74', title: '60 años acompañando nuevas decisiones',
    body: 'Santa Fe celebra seis décadas de historia con la apertura de su sede en Rionegro.' },
] as const;

/*
  Parallax y-travel por slot de capa (0 = fondo … 4 = frente).
  Fase 1 usa autoAlpha/scale → no toca y.
  Fase 2 usa y              → no toca autoAlpha ni scale.
  GSAP los compone en el mismo transform sin conflicto.
*/
const PARALLAX_Y = [40, -45, -70, -95, -120];

export default function TrayectoriaBlock({ onNavigate }: TrayectoriaBlockProps) {
  const [activeIdx,  setActiveIdx]  = useState(0);
  const [displayIdx, setDisplayIdx] = useState(0); // idx del texto visible (rezagado al crossfade)
  const [isMobile,   setIsMobile]   = useState(false);

  const sectionRef      = useRef<HTMLElement>(null);
  const bannerWrapRef   = useRef<HTMLDivElement>(null);
  const l66ImgRefs      = useRef<(HTMLImageElement | null)[]>([]);
  const l74ImgRefs      = useRef<(HTMLImageElement | null)[]>([]);
  const textRef         = useRef<HTMLDivElement>(null);
  const tlRef           = useRef<HTMLDivElement>(null);
  const badgeRef        = useRef<HTMLImageElement>(null);
  const autoTimerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const entranceDoneRef = useRef(false);

  const activeSet = HITOS[activeIdx].set;

  /* ── Detectar mobile ──────────────────────────────────────── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Auto-rotación (solo mobile) ─────────────────────────── */
  const startAutoRotate = useCallback(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % HITOS.length);
    }, 3500);
  }, []);

  const pauseAutoRotate = useCallback(() => {
    if (autoTimerRef.current) { clearInterval(autoTimerRef.current); autoTimerRef.current = null; }
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(startAutoRotate, 6000);
  }, [startAutoRotate]);

  useEffect(() => {
    if (!isMobile) return;
    startAutoRotate();
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [isMobile, startAutoRotate]);

  /* ── Crossfade del texto al cambiar año ──────────────────── */
  useEffect(() => {
    if (!textRef.current) return;

    // Antes de la entrada: sincronizar sin animación
    if (!entranceDoneRef.current) {
      setDisplayIdx(activeIdx);
      return;
    }

    gsap.killTweensOf(textRef.current);
    gsap.to(textRef.current, {
      opacity: 0, duration: 0.18, ease: 'power1.in',
      onComplete: () => {
        setDisplayIdx(activeIdx);
        gsap.to(textRef.current, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      },
    });

    // Micro-pulse del badge al cambiar de año
    if (badgeRef.current && entranceDoneRef.current) {
      gsap.killTweensOf(badgeRef.current, 'scale');
      gsap.to(badgeRef.current, {
        keyframes: [{ scale: 1.07, duration: 0.18 }, { scale: 1, duration: 0.25 }],
        ease: 'power1.inOut',
      });
    }
  }, [activeIdx]);

  /* ── GSAP: entrada + parallax ────────────────────────────── */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(bannerWrapRef.current, { autoAlpha: 1 });
        entranceDoneRef.current = true;
        return;
      }

      /* Estado inicial: banner invisible + badge oculto */
      gsap.set(bannerWrapRef.current, { autoAlpha: 0 });
      gsap.set([textRef.current, tlRef.current], { autoAlpha: 0 });
      gsap.set(badgeRef.current, { autoAlpha: 0, scale: 0.82, rotation: -4, transformOrigin: '70% 20%' });

      /* Entrada al viewport */
      gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true },
        onComplete: () => {
          entranceDoneRef.current = true;
          /* Float ambiente: arrancar tras la entrada */
          gsap.to(badgeRef.current, {
            y: -8, duration: 3.5, ease: 'sine.inOut',
            yoyo: true, repeat: -1,
          });
        },
      })
        .to(bannerWrapRef.current,
          { autoAlpha: 1, duration: 1.1, ease: 'power2.out' })
        .fromTo([textRef.current, tlRef.current],
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
          '-=0.5')
        /* Badge entra como si cayera en posición */
        .fromTo(badgeRef.current,
          { autoAlpha: 0, scale: 0.82, rotation: -4 },
          { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.4)' },
          '-=0.6');

      /* Parallax por slot de capa — aplicado a los dos grupos */
      [...l66ImgRefs.current, ...l74ImgRefs.current].forEach((img, absIdx) => {
        if (!img) return;
        gsap.to(img, {
          y: PARALLAX_Y[absIdx % 5],
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end:   'bottom top',
            scrub: 1.4,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Handlers de interacción ─────────────────────────────── */
  const handleHover = (idx: number) => {
    if (isMobile || idx === activeIdx) return;
    setActiveIdx(idx);
  };

  const handleClick = (idx: number) => {
    setActiveIdx(idx);
    if (isMobile) pauseAutoRotate();
  };

  return (
    <section ref={sectionRef} className="w-full overflow-hidden" style={{ background: '#0c0c0c' }}>
      <div
        ref={bannerWrapRef}
        style={{ position: 'relative', width: '100%', height: 'clamp(260px, 40vw, 600px)', overflow: 'hidden' }}
      >

        {/* ── Grupo L66 (1966 / 2006 / 2018) ─────────────────── */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: activeSet === 'L66' ? 1 : 0,
          transition: 'opacity 0.45s ease',
          zIndex: activeSet === 'L66' ? 2 : 1,
        }}>
          {L66.map((src, i) => (
            <img key={i} ref={el => { l66ImgRefs.current[i] = el; }}
              src={src} alt="" aria-hidden
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: '50% 50%',
                zIndex: Z[i], pointerEvents: 'none', display: 'block' }}
            />
          ))}
        </div>

        {/* ── Grupo L74 (1974 / 2017 / 2026) ─────────────────── */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: activeSet === 'L74' ? 1 : 0,
          transition: 'opacity 0.45s ease',
          zIndex: activeSet === 'L74' ? 2 : 1,
        }}>
          {L74.map((src, i) => (
            <img key={i} ref={el => { l74ImgRefs.current[i] = el; }}
              src={src} alt="" aria-hidden
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: '50% 50%',
                zIndex: Z[i], pointerEvents: 'none', display: 'block' }}
            />
          ))}
        </div>

        {/* ── Gradiente inferior ───────────────────────────────── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 15, pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
        }} />

        {/* ── Badge 60 años — fijo, superior derecha ───────────── */}
        <img
          ref={badgeRef}
          src="/images/60%20a%C3%B1os%20Arrendamientos%20Santa%20Fe.svg"
          alt="60 años Arrendamientos Santa Fe"
          style={{
            position: 'absolute',
            top:   'clamp(12px, 2.5vw, 28px)',
            right: 'clamp(14px, 3vw, 36px)',
            width: 'clamp(72px, 9vw, 130px)',
            zIndex: 25,
            pointerEvents: 'none',
            display: 'block',
            filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.45))',
          }}
        />

        {/* ── Texto + botón ────────────────────────────────────── */}
        <div ref={textRef} style={{
          position: 'absolute',
          bottom: 'clamp(52px, 8vw, 88px)',
          left:   'clamp(20px, 5vw, 72px)',
          zIndex: 20, maxWidth: 'clamp(220px, 36vw, 460px)',
        }}>
          <h2 style={{
            fontFamily: FONT, fontWeight: 700,
            fontSize: 'clamp(15px, 1.8vw, 26px)',
            color: '#fff', lineHeight: 1.2, margin: '0 0 8px',
          }}>
            {HITOS[displayIdx].title}
          </h2>
          <p style={{
            fontFamily: FONT, fontWeight: 300,
            fontSize: 'clamp(11px, 0.9vw, 14px)',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.65, margin: '0 0 16px',
          }}>
            {HITOS[displayIdx].body}
          </p>
          <button
            type="button"
            onClick={() => { onNavigate('historia-60'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onMouseEnter={applyInkFill}
            onMouseLeave={applyInkFill}
            className="btn-red-outline"
            style={{ fontSize: 'clamp(11px, 0.85vw, 13px)', height: 38, padding: '0 18px' }}
          >
            <span>Conocer nuestra historia</span>
          </button>
        </div>

        {/* ── Timeline interactivo ─────────────────────────────── */}
        <div ref={tlRef} style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
          padding: '0 clamp(20px,5vw,72px)',
          height: 'clamp(36px, 4vw, 52px)',
          display: 'flex', alignItems: 'center',
        }}>
          <div style={{ position: 'relative', flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
            {/* Línea base */}
            <div style={{
              position: 'absolute', top: '50%', left: 0, right: 0,
              height: 1, background: 'rgba(255,255,255,0.22)',
              transform: 'translateY(-50%)',
            }} />

            {/* Puntos y años */}
            {HITOS.map((hito, i) => {
              const isActive = i === activeIdx;
              return (
                <div
                  key={hito.year}
                  role="button"
                  tabIndex={0}
                  aria-label={`${hito.year}: ${hito.title}`}
                  aria-pressed={isActive}
                  onMouseEnter={() => handleHover(i)}
                  onClick={() => handleClick(i)}
                  onKeyDown={e => e.key === 'Enter' && handleClick(i)}
                  style={{
                    position: 'absolute',
                    left: `${(i / (HITOS.length - 1)) * 100}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                    cursor: 'pointer',
                    padding: '10px 8px', /* área táctil generosa */
                  }}
                >
                  <div style={{
                    width:      isActive ? 10 : 7,
                    height:     isActive ? 10 : 7,
                    borderRadius: '50%',
                    background: isActive ? RED : 'rgba(255,255,255,0.35)',
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                  }} />
                  <span style={{
                    fontFamily: FONT,
                    fontSize:   'clamp(8px, 0.7vw, 11px)',
                    fontWeight: isActive ? 700 : 400,
                    color:      isActive ? RED : 'rgba(255,255,255,0.4)',
                    lineHeight: 1, whiteSpace: 'nowrap',
                    transition: 'color 0.3s ease',
                  }}>
                    {hito.year}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
