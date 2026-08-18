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
  '/images/Banners/Linea%20de%20tiempo/1966-Fondo.webp',
  '/images/Banners/Linea%20de%20tiempo/1966-fecha-1.webp',
  '/images/Banners/Linea%20de%20tiempo/1966-fecha-2.webp',
  '/images/Banners/Linea%20de%20tiempo/1966-recorte-superior.webp',
  '/images/Banners/Linea%20de%20tiempo/1966-superior.webp',
];
const L74 = [
  '/images/Banners/Linea%20de%20tiempo/1974-Fondo.webp',
  '/images/Banners/Linea%20de%20tiempo/1974-fecha-1.webp',
  '/images/Banners/Linea%20de%20tiempo/1974-fecha-2.webp',
  '/images/Banners/Linea%20de%20tiempo/1974-recorte-superior.webp',
  '/images/Banners/Linea%20de%20tiempo/1974-superior.webp',
];
const L2006 = [
  '/images/Banners/Linea%20de%20tiempo/2006-Fondo.webp',
  '/images/Banners/Linea%20de%20tiempo/2006-fecha-1.webp',
  '/images/Banners/Linea%20de%20tiempo/2006-fecha-2.webp',
  '/images/Banners/Linea%20de%20tiempo/2006-recorte-superior.webp',
  '/images/Banners/Linea%20de%20tiempo/2006-superior.webp',
];
const L2017 = [
  '/images/Banners/Linea%20de%20tiempo/2017-Fondo.webp',
  '/images/Banners/Linea%20de%20tiempo/2017-fecha-1.webp',
  '/images/Banners/Linea%20de%20tiempo/2017-fecha-2.webp',
  '/images/Banners/Linea%20de%20tiempo/2017-recorte-superior.webp',
  '/images/Banners/Linea%20de%20tiempo/2017-superior.webp',
];
const L2018 = [
  '/images/Banners/Linea%20de%20tiempo/2018-Fondo.webp',
  '/images/Banners/Linea%20de%20tiempo/2018-fecha-1.webp',
  '/images/Banners/Linea%20de%20tiempo/2018-fecha-2.webp',
  '/images/Banners/Linea%20de%20tiempo/2018-superior.webp',
];
const L2026 = [
  '/images/Banners/Linea%20de%20tiempo/2026-fondo.webp',
  '/images/Banners/Linea%20de%20tiempo/2026-fecha-1.webp',
  '/images/Banners/Linea%20de%20tiempo/2026-fecha-2.webp',
  '/images/Banners/Linea%20de%20tiempo/2026-superior.webp',
];
const Z = [2, 4, 6, 8, 10];

const HITOS = [
  { year: '1966', set: 'L66', title: 'Donde todo comenzó',
    body: 'Arrendamientos Santa Fe nace en Medellín con una visión de servicio, confianza y acompañamiento inmobiliario.' },
  { year: '1974', set: 'L74', title: 'Primeros cimientos',
    body: 'La empresa fortalece su presencia y consolida una operación más cercana para propietarios y clientes.' },
  { year: '2006', set: 'L2006', title: 'Reconocimiento y consolidación',
    body: 'Cuatro décadas de trabajo reflejan una trayectoria construida con compromiso, seriedad y respaldo.' },
  { year: '2017', set: 'L2017', title: 'Más cerca de nuestros clientes',
    body: 'Con la apertura de la sede en Envigado, Santa Fe amplía su presencia en el Valle de Aburrá.' },
  { year: '2018', set: 'L2018', title: 'Evolución de marca',
    body: 'Arrendamientos Santa Fe renueva su imagen para proyectar una empresa más actual, cercana y coherente.' },
  { year: '2026', set: 'L2026', title: '60 años acompañando nuevas decisiones',
    body: 'Santa Fe celebra seis décadas de historia con la apertura de su sede en Rionegro.' },
] as const;

/*
  Imágenes reales: 1920 × 619 px → aspect-ratio 1920/619
  Desktop: imágenes con 60px extra de alto (top:-30px) para el parallax.
    Con extra=60px, objectFit:cover escala muy poco → mínimo recorte lateral.
  Mobile: imágenes a height:100% → cero recorte, parallax desactivado.
*/
const PARALLAX_Y_DESKTOP = [28, -38, -62, -88, -115];
const MOUSE_PX_DESKTOP   = [6, 18, 32, 48, 66]; // desplazamiento X máximo por capa al mover mouse

/* ── Estilos estáticos ───────────────────────────────────────── */
const ARROW_BASE: React.CSSProperties = {
  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
  zIndex: 30, width: 40, height: 40, borderRadius: '50%',
  background: 'rgba(255,255,255,0.14)',
  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.28)',
  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', padding: 0,
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

  const sectionRef      = useRef<HTMLElement>(null);
  const bannerWrapRef   = useRef<HTMLDivElement>(null);
  const l66ImgRefs      = useRef<(HTMLImageElement | null)[]>([]);
  const l74ImgRefs      = useRef<(HTMLImageElement | null)[]>([]);
  const l2006ImgRefs    = useRef<(HTMLImageElement | null)[]>([]);
  const l2017ImgRefs    = useRef<(HTMLImageElement | null)[]>([]);
  const l2018ImgRefs    = useRef<(HTMLImageElement | null)[]>([]);
  const l2026ImgRefs    = useRef<(HTMLImageElement | null)[]>([]);
  const l66GroupRef     = useRef<HTMLDivElement>(null);
  const l74GroupRef     = useRef<HTMLDivElement>(null);
  const l2006GroupRef   = useRef<HTMLDivElement>(null);
  const l2017GroupRef   = useRef<HTMLDivElement>(null);
  const l2018GroupRef   = useRef<HTMLDivElement>(null);
  const l2026GroupRef   = useRef<HTMLDivElement>(null);
  const desktopTextRef  = useRef<HTMLDivElement>(null);
  const mobileTextRef   = useRef<HTMLDivElement>(null);
  const tlRef           = useRef<HTMLDivElement>(null);
  const tlMobileRef     = useRef<HTMLDivElement>(null);
  const badgeRef        = useRef<HTMLDivElement>(null);
  const autoTimerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const entranceDoneRef = useRef(false);
  const mouseSettersRef = useRef<Map<HTMLImageElement, (dx: number) => void>>(new Map());

  const activeSet = HITOS[activeIdx].set;

  /* ── Mobile detection ────────────────────────────────────── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Auto-rotate (mobile) ────────────────────────────────── */
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

  /* ── Animación de entrada en mobile al cambiar slide ─────── */
  useEffect(() => {
    if (window.innerWidth >= 1024) return;
    const groupMap: Record<string, HTMLDivElement | null> = {
      L66:   l66GroupRef.current,
      L74:   l74GroupRef.current,
      L2006: l2006GroupRef.current,
      L2017: l2017GroupRef.current,
      L2018: l2018GroupRef.current,
      L2026: l2026GroupRef.current,
    };
    const group = groupMap[HITOS[activeIdx].set];
    if (!group) return;
    gsap.fromTo(group,
      { scale: 1.06 },
      { scale: 1, duration: 0.7, ease: 'power2.out' }
    );
  }, [activeIdx]);

  /* ── GSAP: entrada + parallax (solo desktop) ─────────────── */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([bannerWrapRef.current, desktopTextRef.current, mobileTextRef.current], { autoAlpha: 1 });
        gsap.set([tlRef.current, tlMobileRef.current], { opacity: 1 });
        entranceDoneRef.current = true;
        return;
      }

      gsap.set(bannerWrapRef.current, { autoAlpha: 0 });
      gsap.set([desktopTextRef.current, mobileTextRef.current], { autoAlpha: 0 });
      gsap.set([tlRef.current, tlMobileRef.current], { opacity: 0 });
      gsap.set(badgeRef.current, { autoAlpha: 0, scale: 0.82, rotation: -4, transformOrigin: '70% 20%' });

      gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true },
        onComplete: () => {
          entranceDoneRef.current = true;
          // Float ambiente del badge
          gsap.to(badgeRef.current, {
            y: -8, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1,
          });
        },
      })
        .to(bannerWrapRef.current, { autoAlpha: 1, duration: 1.1, ease: 'power2.out' })
        .fromTo(
          [desktopTextRef.current, mobileTextRef.current],
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out' },
          '-=0.5',
        )
        .fromTo(
          [tlRef.current, tlMobileRef.current],
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out' },
          '-=0.35',
        )
        .fromTo(badgeRef.current,
          { autoAlpha: 0, scale: 0.82, rotation: -4 },
          { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.4)' },
          '-=0.6');

      const isDesktop = window.innerWidth >= 1024;

      if (isDesktop) {
        /* Parallax Y desktop (scroll) + mouse X por capa */
        const allImgs = [...l66ImgRefs.current, ...l74ImgRefs.current, ...l2006ImgRefs.current,
                         ...l2017ImgRefs.current, ...l2018ImgRefs.current, ...l2026ImgRefs.current];
        allImgs.forEach((img, absIdx) => {
          if (!img) return;
          const li = absIdx % 5;

          gsap.to(img, {
            y: PARALLAX_Y_DESKTOP[li],
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom', end: 'bottom top', scrub: 1.4,
            },
          });

          const proxy  = { x: 0 };
          const px     = MOUSE_PX_DESKTOP[li];
          const setter = gsap.quickTo(proxy, 'x', {
            duration: 0.65, ease: 'power3.out',
            onUpdate: () => { img.style.objectPosition = `calc(50% + ${proxy.x}px) 50%`; },
          });
          mouseSettersRef.current.set(img, (dx: number) => setter(dx * px));
        });
      } else {
        /* Ken Burns mobile — intensidad 50% vs desktop */
        const KB = [
          { scale: 1.07, x:   9, dur: 9,  origin: '30% 60%' },
          { scale: 1.05, x:  -7, dur: 7,  origin: '70% 40%' },
          { scale: 1.06, x:   5, dur: 8,  origin: '50% 50%' },
          { scale: 1.04, x:  -6, dur: 11, origin: '40% 55%' },
          { scale: 1.055,x:   8, dur: 6,  origin: '60% 45%' },
        ];
        [...l66ImgRefs.current, ...l74ImgRefs.current, ...l2006ImgRefs.current, ...l2017ImgRefs.current, ...l2018ImgRefs.current, ...l2026ImgRefs.current].forEach((img, absIdx) => {
          if (!img) return;
          const li = absIdx % 5;
          const k  = KB[li];
          gsap.to(img, {
            scale: k.scale, x: k.x,
            duration: k.dur,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            transformOrigin: k.origin,
          });
        });
      }
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

  /* ── Estilos de imagen según breakpoint ──────────────────── */
  const imgStyle = (i: number): React.CSSProperties => ({
    position: 'absolute',
    /* Mobile: height:100% → cero recorte; Desktop: +60px de headroom para parallax */
    top:    isMobile ? 0 : '-30px',
    left:   0,
    width:  '100%',
    height: isMobile ? '100%' : 'calc(100% + 60px)',
    objectFit:      'cover',
    objectPosition: '50% 50%',
    zIndex: Z[i],
    pointerEvents: 'none',
    display: 'block',
  });

  /* ── Contenido de texto compartido ──────────────────────── */
  const heading = (
    <h2 style={{
      fontFamily: FONT, fontWeight: 800,
      fontSize: isMobile ? '20px' : 'clamp(22px, 2.5vw, 36px)',
      color: '#fff', lineHeight: 1.1, margin: 0,
      textAlign: isMobile ? 'center' : 'left',
    }}>
      {HITOS[displayIdx].title}
    </h2>
  );

  const bodyText = (
    <p style={{
      fontFamily: FONT, fontWeight: 400,
      fontSize: isMobile ? '13px' : 'clamp(14px, 1.15vw, 18px)',
      color: 'rgba(255,255,255,0.78)',
      lineHeight: 1.25, margin: 0,
      textAlign: isMobile ? 'center' : 'left',
    }}>
      {HITOS[displayIdx].body}
    </p>
  );

  /* ── Botón CTA ───────────────────────────────────────────── */
  const ctaButton = isMobile ? (
    /* Mobile: ancho total, rojo, sin radio */
    <button
      type="button"
      onClick={() => { onNavigate('historia-60'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      style={{
        fontFamily: FONT, fontWeight: 600, fontSize: '14px',
        color: '#fff', background: RED,
        border: 'none', borderRadius: 0,
        width: '100%', height: 50,
        cursor: 'pointer', letterSpacing: '0.03em',
      }}
    >
      Conocer nuestra historia
    </button>
  ) : (
    /* Desktop: glass blanco, sin radio, 30% más ancho */
    <button
      type="button"
      onClick={() => { onNavigate('historia-60'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      style={{
        fontFamily: FONT, fontWeight: 600,
        fontSize: 'clamp(12px, 0.9vw, 14px)',
        color: '#fff',
        background: 'rgba(255,255,255,0.28)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1.5px solid rgba(255,255,255,0.5)',
        borderRadius: 0,
        height: 42,
        padding: '0 30px',   /* +30% vs versión anterior (22px → 30px) */
        cursor: 'pointer',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      Conocer nuestra historia
    </button>
  );

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <section ref={sectionRef} className="w-full overflow-hidden" style={{ background: '#0c0c0c' }}>

      <style>{`
        .tray-tl-d { display: none !important; align-items: center; }
        .tray-tl-m { display: flex !important; align-items: center; }
        @media (min-width: 1024px) {
          .tray-tl-d { display: flex !important; }
          .tray-tl-m { display: none !important; }
        }
      `}</style>

      {/* ════ MOBILE: texto encima del banner ════════════════ */}
      {/*
        minHeight reserva espacio para el título+cuerpo más largo (2 líneas de h2
        + 3 líneas de body) → impide que el banner salte al cambiar de slide.
      */}
      <div
        ref={mobileTextRef}
        className="lg:hidden"
        style={{
          padding: '18px 24px',
          minHeight: '145px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '18px',
        }}
      >
        {heading}
        {bodyText}
      </div>

      {/* ════ BANNER ══════════════════════════════════════════ */}
      {/*
        aspect-ratio: 1920/619 = ratio exacto de las imágenes.
        Sin height fijo → el ancho dicta el alto → cero recorte.
      */}
      <div
        ref={bannerWrapRef}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1920/619',
          overflow: 'hidden',
        }}
        onMouseMove={(e) => {
          if (isMobile || !entranceDoneRef.current) return;
          const rect = bannerWrapRef.current?.getBoundingClientRect();
          if (!rect) return;
          const dx = (e.clientX - rect.left) / rect.width - 0.5;
          mouseSettersRef.current.forEach((setter) => setter(dx));
        }}
        onMouseLeave={() => {
          mouseSettersRef.current.forEach((setter) => setter(0));
        }}
      >

        {/* ── Grupo L66 ─────────────────────────────────── */}
        <div ref={l66GroupRef} style={{
          position: 'absolute', inset: 0,
          opacity: activeSet === 'L66' ? 1 : 0,
          transition: 'opacity 0.45s ease',
          zIndex: activeSet === 'L66' ? 2 : 1,
        }}>
          {L66.map((src, i) => (
            <img key={i} ref={el => { l66ImgRefs.current[i] = el; }}
              src={src} alt="" aria-hidden style={imgStyle(i)} />
          ))}
        </div>

        {/* ── Grupo L74 ─────────────────────────────────── */}
        <div ref={l74GroupRef} style={{
          position: 'absolute', inset: 0,
          opacity: activeSet === 'L74' ? 1 : 0,
          transition: 'opacity 0.45s ease',
          zIndex: activeSet === 'L74' ? 2 : 1,
        }}>
          {L74.map((src, i) => (
            <img key={i} ref={el => { l74ImgRefs.current[i] = el; }}
              src={src} alt="" aria-hidden style={imgStyle(i)} />
          ))}
        </div>

        {/* ── Grupo L2006 ────────────────────────────────── */}
        <div ref={l2006GroupRef} style={{
          position: 'absolute', inset: 0,
          opacity: activeSet === 'L2006' ? 1 : 0,
          transition: 'opacity 0.45s ease',
          zIndex: activeSet === 'L2006' ? 2 : 1,
        }}>
          {L2006.map((src, i) => (
            <img key={i} ref={el => { l2006ImgRefs.current[i] = el; }}
              src={src} alt="" aria-hidden
              style={{
                ...imgStyle(i),
                /* Capas de texto/composición: contain para ver la imagen completa sin recorte */
                ...(i > 0 ? { objectFit: 'contain', objectPosition: '50% 50%' } : {}),
              }} />
          ))}
        </div>

        {/* ── Grupo L2017 ────────────────────────────────── */}
        <div ref={l2017GroupRef} style={{
          position: 'absolute', inset: 0,
          opacity: activeSet === 'L2017' ? 1 : 0,
          transition: 'opacity 0.45s ease',
          zIndex: activeSet === 'L2017' ? 2 : 1,
        }}>
          {L2017.map((src, i) => (
            <img key={i} ref={el => { l2017ImgRefs.current[i] = el; }}
              src={src} alt="" aria-hidden
              style={{
                ...imgStyle(i),
                ...(i > 0 ? { objectFit: 'contain', objectPosition: '50% 50%' } : {}),
              }} />
          ))}
        </div>

        {/* ── Grupo L2018 ────────────────────────────────── */}
        <div ref={l2018GroupRef} style={{
          position: 'absolute', inset: 0,
          opacity: activeSet === 'L2018' ? 1 : 0,
          transition: 'opacity 0.45s ease',
          zIndex: activeSet === 'L2018' ? 2 : 1,
        }}>
          {L2018.map((src, i) => (
            <img key={i} ref={el => { l2018ImgRefs.current[i] = el; }}
              src={src} alt="" aria-hidden
              style={{
                ...imgStyle(i),
                ...(i > 0 ? { objectFit: 'contain', objectPosition: '50% 50%' } : {}),
              }} />
          ))}
        </div>

        {/* ── Grupo L2026 ────────────────────────────────── */}
        <div ref={l2026GroupRef} style={{
          position: 'absolute', inset: 0,
          opacity: activeSet === 'L2026' ? 1 : 0,
          transition: 'opacity 0.45s ease',
          zIndex: activeSet === 'L2026' ? 2 : 1,
        }}>
          {L2026.map((src, i) => (
            <img key={i} ref={el => { l2026ImgRefs.current[i] = el; }}
              src={src} alt="" aria-hidden
              style={{
                ...imgStyle(i),
                ...(i > 0 ? { objectFit: 'contain', objectPosition: '50% 50%' } : {}),
              }} />
          ))}
        </div>

        {/* ── Gradiente inferior (desktop: legibilidad texto) */}
        <div
          className="hidden lg:block"
          style={{
            position: 'absolute', inset: 0, zIndex: 15, pointerEvents: 'none',
            background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
          }}
        />

        {/* ── Gradiente sutil mobile (bordes) ────────────── */}
        <div
          className="lg:hidden"
          style={{
            position: 'absolute', inset: 0, zIndex: 15, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        {/* ── Badge 60 años (clickeable → historia-60) ───── */}
        <div
          ref={badgeRef}
          role="button"
          tabIndex={0}
          aria-label="60 años Arrendamientos Santa Fe — Ver historia"
          onClick={() => { onNavigate('historia-60'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onKeyDown={e => e.key === 'Enter' && (onNavigate('historia-60'), window.scrollTo({ top: 0, behavior: 'smooth' }))}
          style={{
            position: 'absolute',
            top:   isMobile ? '8px'  : 'clamp(12px, 2.5vw, 28px)',
            right: isMobile ? '52px' : 'clamp(60px, 6vw, 80px)',
            width: isMobile ? '38px' : 'clamp(80px, 8.5vw, 120px)',
            zIndex: 25,
            cursor: 'pointer',
            filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.45))',
          }}
        >
          <img
            src={isMobile ? '/icons/60%20a%C3%B1os-mobile.svg' : '/icons/60%20a%C3%B1os-destok.svg'}
            alt=""
            style={{ width: '100%', display: 'block', pointerEvents: 'none' }}
          />
        </div>

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

        {/* ── DESKTOP: texto sobreimpreso ─────────────────── */}
        <div
          ref={desktopTextRef}
          className="hidden lg:block"
          style={{
            position: 'absolute',
            bottom: 'clamp(52px, 7.5vw, 90px)',
            left:   'clamp(24px, 5vw, 80px)',
            zIndex: 20,
            maxWidth: 'clamp(280px, 38vw, 520px)',
          }}
        >
          {heading}
          {bodyText}
          <div style={{ marginTop: 20 }}>
            {ctaButton}
          </div>
        </div>

        {/* ── Timeline interactivo (solo desktop, dentro del banner) */}
        <div ref={tlRef} className="tray-tl-d" style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
          padding: '0 clamp(24px,5vw,80px)',
          height: 'clamp(36px, 4vw, 52px)',
          alignItems: 'center',
        }}>
          <div style={{ position: 'relative', flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{
              position: 'absolute', top: '50%', left: 0, right: 0,
              height: 1, background: 'rgba(255,255,255,0.22)', transform: 'translateY(-50%)',
            }} />
            {HITOS.map((hito, i) => {
              const isActive = i === activeIdx;
              return (
                <div
                  key={hito.year}
                  role="button" tabIndex={0}
                  aria-label={`${hito.year}: ${hito.title}`}
                  aria-pressed={isActive}
                  onMouseEnter={() => handleHover(i)}
                  onClick={() => handleClick(i)}
                  onKeyDown={e => e.key === 'Enter' && handleClick(i)}
                  style={{
                    position: 'absolute',
                    left: `${(i / (HITOS.length - 1)) * 100}%`,
                    top: '50%', transform: 'translate(-50%, -50%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                    cursor: 'pointer', padding: '10px 8px',
                  }}
                >
                  <div style={{
                    width: isActive ? 10 : 7, height: isActive ? 10 : 7,
                    borderRadius: '50%',
                    background: isActive ? RED : 'rgba(255,255,255,0.35)',
                    flexShrink: 0, transition: 'all 0.3s ease',
                  }} />
                  <span style={{
                    fontFamily: FONT,
                    fontSize: 'clamp(9px, 0.75vw, 12px)',
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? RED : 'rgba(255,255,255,0.4)',
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

      {/* ════ MOBILE: timeline bajo el banner ════════════════ */}
      <div
        ref={tlMobileRef}
        className="tray-tl-m"
        style={{
          padding: '12px 52px 0',
          height: '32px',
          alignItems: 'center',
          background: '#0c0c0c',
          position: 'relative',
        }}
      >
        <div style={{ position: 'relative', flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{
            position: 'absolute', top: '50%', left: 0, right: 0,
            height: 1, background: 'rgba(255,255,255,0.22)', transform: 'translateY(-50%)',
          }} />
          {HITOS.map((hito, i) => {
            const isActive = i === activeIdx;
            return (
              <div
                key={hito.year}
                role="button" tabIndex={0}
                aria-label={`${hito.year}: ${hito.title}`}
                aria-pressed={isActive}
                onClick={() => handleClick(i)}
                onKeyDown={e => e.key === 'Enter' && handleClick(i)}
                style={{
                  position: 'absolute',
                  left: `${(i / (HITOS.length - 1)) * 100}%`,
                  top: 0, bottom: 0,
                  transform: 'translateX(-50%)',
                  width: 40,
                  cursor: 'pointer',
                }}
              >
                {/* Año ENCIMA de la línea */}
                <span style={{
                  position: 'absolute',
                  bottom: '50%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: 6,
                  fontFamily: FONT, fontSize: '11px',
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? RED : 'rgba(255,255,255,0.4)',
                  lineHeight: 1, whiteSpace: 'nowrap',
                  transition: 'color 0.3s ease',
                }}>
                  {hito.year}
                </span>
                {/* Punto SOBRE la línea */}
                <div style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: isActive ? 10 : 7, height: isActive ? 10 : 7,
                  borderRadius: '50%',
                  background: isActive ? RED : 'rgba(255,255,255,0.35)',
                  transition: 'all 0.3s ease',
                }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ════ MOBILE: CTA debajo del timeline ════════════════ */}
      <div className="lg:hidden">
        {ctaButton}
      </div>

    </section>
  );
}
