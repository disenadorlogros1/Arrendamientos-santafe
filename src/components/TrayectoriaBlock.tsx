'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PageType } from '@/components/Header';

gsap.registerPlugin(ScrollTrigger);

interface TrayectoriaBlockProps {
  onNavigate: (page: PageType) => void;
}

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';

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

/* Parallax y-travel por slot. Imágenes con top:-120px y height:calc(100%+240px)
   dan ≥120px de margen para que ninguna capa se vea cortada. */
const PARALLAX_Y = [40, -45, -70, -95, -120];

/* ── Estilos del botón flecha ──────────────────────────────────── */
const ARROW_BASE: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 30,
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.14)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.28)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: 0,
};

/* ── Estilos del botón CTA glass ──────────────────────────────── */
const GLASS_BTN: React.CSSProperties = {
  fontFamily: FONT,
  fontWeight: 600,
  color: '#fff',
  background: 'rgba(255,255,255,0.28)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1.5px solid rgba(255,255,255,0.5)',
  borderRadius: 4,
  cursor: 'pointer',
  letterSpacing: '0.02em',
  whiteSpace: 'nowrap' as const,
};

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function TrayectoriaBlock({ onNavigate }: TrayectoriaBlockProps) {
  const [activeIdx,  setActiveIdx]  = useState(0);
  const [displayIdx, setDisplayIdx] = useState(0);
  const [isMobile,   setIsMobile]   = useState(false);

  const sectionRef        = useRef<HTMLElement>(null);
  const bannerWrapRef     = useRef<HTMLDivElement>(null);
  const l66ImgRefs        = useRef<(HTMLImageElement | null)[]>([]);
  const l74ImgRefs        = useRef<(HTMLImageElement | null)[]>([]);
  const desktopTextRef    = useRef<HTMLDivElement>(null);  // texto dentro del banner (desktop)
  const mobileTextRef     = useRef<HTMLDivElement>(null);  // texto encima del banner (mobile)
  const tlRef             = useRef<HTMLDivElement>(null);
  const badgeRef          = useRef<HTMLImageElement>(null);
  const autoTimerRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const entranceDoneRef   = useRef(false);

  const activeSet = HITOS[activeIdx].set;

  /* ── Mobile detection ─────────────────────────────────────── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Auto-rotate (mobile only) ────────────────────────────── */
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

  /* ── Crossfade de texto al cambiar año ───────────────────── */
  useEffect(() => {
    const targets = [desktopTextRef.current, mobileTextRef.current].filter(Boolean);

    if (!entranceDoneRef.current) {
      setDisplayIdx(activeIdx);
      return;
    }

    gsap.killTweensOf(targets);
    gsap.to(targets, {
      opacity: 0, duration: 0.18, ease: 'power1.in',
      onComplete: () => {
        setDisplayIdx(activeIdx);
        gsap.to(targets, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      },
    });

    // Badge pulse
    if (badgeRef.current) {
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
        gsap.set([bannerWrapRef.current, desktopTextRef.current, mobileTextRef.current], { autoAlpha: 1 });
        entranceDoneRef.current = true;
        return;
      }

      gsap.set(bannerWrapRef.current, { autoAlpha: 0 });
      gsap.set([desktopTextRef.current, mobileTextRef.current, tlRef.current], { autoAlpha: 0 });
      gsap.set(badgeRef.current, { autoAlpha: 0, scale: 0.82, rotation: -4, transformOrigin: '70% 20%' });

      gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true },
        onComplete: () => {
          entranceDoneRef.current = true;
          gsap.to(badgeRef.current, {
            y: -8, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1,
          });
        },
      })
        .to(bannerWrapRef.current, { autoAlpha: 1, duration: 1.1, ease: 'power2.out' })
        .fromTo(
          [desktopTextRef.current, mobileTextRef.current, tlRef.current],
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out' },
          '-=0.5',
        )
        .fromTo(badgeRef.current,
          { autoAlpha: 0, scale: 0.82, rotation: -4 },
          { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.4)' },
          '-=0.6');

      /* Parallax — imágenes tienen 120px extra arriba y abajo */
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

  /* ── Navegación ──────────────────────────────────────────── */
  const goTo = (idx: number) => {
    const next = ((idx % HITOS.length) + HITOS.length) % HITOS.length;
    setActiveIdx(next);
    if (isMobile) pauseAutoRotate();
  };

  const handleHover = (idx: number) => {
    if (isMobile || idx === activeIdx) return;
    setActiveIdx(idx);
  };

  const handleClick = (idx: number) => {
    setActiveIdx(idx);
    if (isMobile) pauseAutoRotate();
  };

  /* ── Contenido de texto compartido ──────────────────────── */
  const yearLabel = (
    <p style={{
      fontFamily: FONT, fontWeight: 700,
      fontSize: '11px', letterSpacing: '0.1em',
      color: RED, margin: '0 0 8px', textTransform: 'uppercase',
    }}>
      {HITOS[displayIdx].year}
    </p>
  );

  const heading = (
    <h2 style={{
      fontFamily: FONT, fontWeight: 800,
      fontSize: isMobile ? '20px' : 'clamp(22px, 2.5vw, 36px)',
      color: '#fff', lineHeight: 1.15, margin: '0 0 10px',
    }}>
      {HITOS[displayIdx].title}
    </h2>
  );

  const body = (
    <p style={{
      fontFamily: FONT, fontWeight: 400,
      fontSize: isMobile ? '13px' : 'clamp(14px, 1.15vw, 18px)',
      color: 'rgba(255,255,255,0.75)',
      lineHeight: 1.6, margin: 0,
    }}>
      {HITOS[displayIdx].body}
    </p>
  );

  const ctaButton = (
    <button
      type="button"
      onClick={() => { onNavigate('historia-60'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      style={{
        ...GLASS_BTN,
        fontSize: isMobile ? '13px' : 'clamp(12px, 0.9vw, 14px)',
        height: isMobile ? 46 : 42,
        padding: '0 22px',
      }}
    >
      Conocer nuestra historia
    </button>
  );

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <section ref={sectionRef} className="w-full overflow-hidden" style={{ background: '#0c0c0c' }}>

      {/* ════ MOBILE: texto encima del banner ════════════════ */}
      <div
        ref={mobileTextRef}
        className="lg:hidden"
        style={{ padding: '22px 20px 14px' }}
      >
        {yearLabel}
        {heading}
        {body}
      </div>

      {/* ════ BANNER ══════════════════════════════════════════ */}
      <div
        ref={bannerWrapRef}
        style={{
          position: 'relative',
          width: '100%',
          height: isMobile ? '280px' : 'clamp(360px, 42vw, 620px)',
          overflow: 'hidden',
        }}
      >

        {/* ── Grupo L66 ─────────────────────────────────── */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: activeSet === 'L66' ? 1 : 0,
          transition: 'opacity 0.45s ease',
          zIndex: activeSet === 'L66' ? 2 : 1,
        }}>
          {L66.map((src, i) => (
            <img key={i} ref={el => { l66ImgRefs.current[i] = el; }}
              src={src} alt="" aria-hidden
              style={{
                position: 'absolute',
                top: '-120px', left: 0,
                width: '100%',
                height: 'calc(100% + 240px)',
                objectFit: 'cover', objectPosition: '50% 50%',
                zIndex: Z[i], pointerEvents: 'none', display: 'block',
              }}
            />
          ))}
        </div>

        {/* ── Grupo L74 ─────────────────────────────────── */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: activeSet === 'L74' ? 1 : 0,
          transition: 'opacity 0.45s ease',
          zIndex: activeSet === 'L74' ? 2 : 1,
        }}>
          {L74.map((src, i) => (
            <img key={i} ref={el => { l74ImgRefs.current[i] = el; }}
              src={src} alt="" aria-hidden
              style={{
                position: 'absolute',
                top: '-120px', left: 0,
                width: '100%',
                height: 'calc(100% + 240px)',
                objectFit: 'cover', objectPosition: '50% 50%',
                zIndex: Z[i], pointerEvents: 'none', display: 'block',
              }}
            />
          ))}
        </div>

        {/* ── Gradiente inferior (desktop: legibilidad del texto) */}
        <div
          className="hidden lg:block"
          style={{
            position: 'absolute', inset: 0, zIndex: 15, pointerEvents: 'none',
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.12) 52%, transparent 100%)',
          }}
        />

        {/* ── Gradiente sutil mobile (oscurece bordes) ─────── */}
        <div
          className="lg:hidden"
          style={{
            position: 'absolute', inset: 0, zIndex: 15, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.5) 100%)',
          }}
        />

        {/* ── Badge 60 años ──────────────────────────────── */}
        <img
          ref={badgeRef}
          src="/images/60%20a%C3%B1os%20Arrendamientos%20Santa%20Fe.svg"
          alt="60 años Arrendamientos Santa Fe"
          style={{
            position: 'absolute',
            top:   isMobile ? '10px' : 'clamp(12px, 2.5vw, 28px)',
            right: isMobile ? '56px' : 'clamp(60px, 6vw, 80px)',
            width: isMobile ? '64px' : 'clamp(80px, 9vw, 130px)',
            zIndex: 25,
            pointerEvents: 'none',
            display: 'block',
            filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.45))',
          }}
        />

        {/* ── Flecha izquierda ───────────────────────────── */}
        <button
          type="button"
          aria-label="Año anterior"
          onClick={() => goTo(activeIdx - 1)}
          style={{ ...ARROW_BASE, left: isMobile ? 8 : 16 }}
        >
          <ChevronLeft />
        </button>

        {/* ── Flecha derecha ─────────────────────────────── */}
        <button
          type="button"
          aria-label="Año siguiente"
          onClick={() => goTo(activeIdx + 1)}
          style={{ ...ARROW_BASE, right: isMobile ? 8 : 16 }}
        >
          <ChevronRight />
        </button>

        {/* ── DESKTOP: texto sobreimpreso en el banner ───── */}
        <div
          ref={desktopTextRef}
          className="hidden lg:block"
          style={{
            position: 'absolute',
            bottom: 'clamp(56px, 8vw, 100px)',
            left:   'clamp(24px, 5vw, 80px)',
            zIndex: 20,
            maxWidth: 'clamp(280px, 38vw, 520px)',
          }}
        >
          {yearLabel}
          {heading}
          {body}
          <div style={{ marginTop: 22 }}>
            {ctaButton}
          </div>
        </div>

        {/* ── Timeline interactivo ───────────────────────── */}
        <div ref={tlRef} style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
          padding: isMobile ? '0 52px' : '0 clamp(24px,5vw,80px)',
          height: isMobile ? '42px' : 'clamp(36px, 4vw, 52px)',
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
                    padding: '10px 8px',
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
                    fontSize:   isMobile ? '9px' : 'clamp(8px, 0.7vw, 11px)',
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
      {/* ════ FIN BANNER ══════════════════════════════════════ */}

      {/* ════ MOBILE: CTA debajo del banner ══════════════════ */}
      <div
        className="lg:hidden"
        style={{ padding: '14px 20px 26px', background: '#0c0c0c' }}
      >
        {ctaButton}
      </div>

    </section>
  );
}
