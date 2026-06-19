'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { X } from 'lucide-react';

const FONT = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', system-ui, sans-serif";
const RED  = '#f32735';

export interface PropertyStats {
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  price?: string;
  parking?: number;
}

interface PropertyGalleryProps {
  images: string[];
  title: string;
  stats?: PropertyStats;
}

interface Rect { l: number; t: number; w: number; h: number }

const G = 0.8;

const BENTO: Record<number, Rect[]> = {
  1: [{ l:0, t:0, w:100, h:100 }],
  2: [
    { l:0,        t:0,    w:58-G/2,    h:100 },
    { l:58+G/2,   t:0,    w:42-G/2,    h:100 },
  ],
  3: [
    { l:0,        t:0,    w:58-G/2,    h:100 },
    { l:58+G/2,   t:0,    w:42-G/2,    h:50-G/2 },
    { l:58+G/2,   t:50+G/2, w:42-G/2, h:50-G/2 },
  ],
  4: [
    { l:0,        t:0,       w:58-G/2,    h:60-G/2 },
    { l:58+G/2,   t:0,       w:22-G/2,   h:60-G/2 },
    { l:81+G/2,   t:0,       w:19-G/2,   h:60-G/2 },
    { l:0,        t:60+G/2,  w:100,       h:40-G/2 },
  ],
  5: [
    { l:0,        t:0,       w:42-G/2,    h:100 },
    { l:42+G/2,   t:0,       w:29-G/2,    h:48-G/2 },
    { l:72+G/2,   t:0,       w:28-G/2,    h:48-G/2 },
    { l:42+G/2,   t:48+G/2,  w:29-G/2,    h:52-G/2 },
    { l:72+G/2,   t:48+G/2,  w:28-G/2,    h:52-G/2 },
  ],
  6: [
    { l:0,        t:0,       w:42-G/2,    h:58-G/2 },
    { l:42+G/2,   t:0,       w:29-G/2,    h:28-G/2 },
    { l:72+G/2,   t:0,       w:28-G/2,    h:28-G/2 },
    { l:42+G/2,   t:28+G/2,  w:29-G/2,    h:30-G/2 },
    { l:72+G/2,   t:28+G/2,  w:28-G/2,    h:30-G/2 },
    { l:0,        t:58+G/2,  w:100,       h:42-G/2 },
  ],
};

function getLayout(n: number): Rect[] {
  if (BENTO[n]) return BENTO[n];
  const cols = Math.ceil(Math.sqrt(n * 1.3));
  const rows = Math.ceil(n / cols);
  const colW = (100 - (cols - 1) * G) / cols;
  const rowH = (100 - (rows - 1) * G) / rows;
  return Array.from({ length: n }, (_, i) => ({
    l: (i % cols) * (colW + G),
    t: Math.floor(i / cols) * (rowH + G),
    w: colW,
    h: rowH,
  }));
}

const SCROLL_PER_PHOTO = 900;
const PHASE_START = 0.08;

const R_REST = 14;
const R_FEAT = 20;

function intensity(p: number, i: number, n: number): number {
  if (p < PHASE_START) return 0;
  const w = (1 - PHASE_START) / n;
  const peak = PHASE_START + (i + 0.5) * w;
  const dist = Math.abs(p - peak);
  return Math.max(0, Math.min(1, 1 - dist / (w * 0.58)));
}

function maxIntensity(p: number, n: number): number {
  let m = 0;
  for (let i = 0; i < n; i++) m = Math.max(m, intensity(p, i, n));
  return m;
}

/* ── PhotoCard — plain DOM, animated by parent ticker ── */

function PhotoCard({
  img,
  rect,
  cardRef,
  imgRef,
}: {
  img: string;
  rect: Rect;
  cardRef: (el: HTMLDivElement | null) => void;
  imgRef: (el: HTMLImageElement | null) => void;
}) {
  const clipRest = `inset(${rect.t}% ${100 - rect.l - rect.w}% ${100 - rect.t - rect.h}% ${rect.l}% round ${R_REST}px)`;

  return (
    <div
      ref={cardRef}
      style={{
        position: 'absolute',
        inset: 0,
        clipPath: clipRest,
        opacity: 1,
        zIndex: 1,
        overflow: 'hidden',
        willChange: 'clip-path, opacity',
      }}
    >
      <img
        ref={imgRef}
        src={img}
        alt=""
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      />
    </div>
  );
}

/* ── BentoGallery (lightbox) ── */

function BentoGallery({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const n = images.length;
  const MAX = n * SCROLL_PER_PHOTO;
  const layout = getLayout(n);

  const scrollObj  = useRef({ y: 0 });
  const activeIdxRef = useRef(-1);
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const [entered,   setEntered]   = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hintRef      = useRef<HTMLDivElement>(null);

  // Refs to each card's outer div and inner img
  const cardRefs = useRef<Array<HTMLDivElement | null>>(Array(n).fill(null));
  const imgRefs  = useRef<Array<HTMLImageElement | null>>(Array(n).fill(null));

  // GSAP ticker — drives all photo DOM updates
  useEffect(() => {
    const tick = () => {
      const p   = scrollObj.current.y / MAX;
      const max = maxIntensity(p, n);

      for (let i = 0; i < n; i++) {
        const card = cardRefs.current[i];
        const img  = imgRefs.current[i];
        if (!card) continue;

        const mine = intensity(p, i, n);
        const rect = layout[i];
        const CT = rect.t;
        const CR = 100 - rect.l - rect.w;
        const CB = 100 - rect.t - rect.h;
        const CL = rect.l;

        const t   = CT   * (1 - mine);
        const r   = CR   * (1 - mine);
        const b   = CB   * (1 - mine);
        const l   = CL   * (1 - mine);
        const rad = R_REST + (R_FEAT - R_REST) * mine;

        card.style.clipPath = `inset(${t}% ${r}% ${b}% ${l}% round ${rad}px)`;
        card.style.opacity  = String(mine > 0.12 ? 1 : Math.max(0.06, 1 - max * 0.92));
        card.style.zIndex   = mine > 0.05 ? '10' : '1';

        if (img) {
          img.style.transform = `scale(${1.0 + 0.1 * mine})`;
        }
      }

      // Update active index — only triggers re-render when it changes
      let newActive = -1;
      if (p >= PHASE_START) {
        let bestI = 0, bestV = -1;
        for (let i = 0; i < n; i++) {
          const v = intensity(p, i, n);
          if (v > bestV) { bestV = v; bestI = i; }
        }
        newActive = bestI;
      }
      if (newActive !== activeIdxRef.current) {
        activeIdxRef.current = newActive;
        setActiveIdx(newActive);
      }
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [n, MAX, layout]);

  // Fade-in + body scroll lock
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    document.body.style.overflow = 'hidden';
    return () => { cancelAnimationFrame(id); document.body.style.overflow = ''; };
  }, []);

  // Scroll hint animation
  useEffect(() => {
    if (!entered || !hintRef.current) return;
    gsap.fromTo(hintRef.current, { opacity: 0, y: 6 }, { opacity: 1, y: 0, delay: 0.7, duration: 0.5 });
  }, [entered]);

  // Keyboard navigation
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') scrollToPhoto(Math.min(n - 1, activeIdxRef.current + 1));
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   scrollToPhoto(Math.max(0, activeIdxRef.current - 1));
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  // Wheel scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollObj.current.y = Math.max(0, Math.min(MAX, scrollObj.current.y + e.deltaY * 1.1));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [MAX]);

  // Touch scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let lastY = 0;
    const onStart = (e: TouchEvent) => { lastY = e.touches[0].clientY; };
    const onMove  = (e: TouchEvent) => {
      e.preventDefault();
      const dy = lastY - e.touches[0].clientY;
      lastY = e.touches[0].clientY;
      scrollObj.current.y = Math.max(0, Math.min(MAX, scrollObj.current.y + dy * 2.2));
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove',  onMove,  { passive: false });
    return () => { el.removeEventListener('touchstart', onStart); el.removeEventListener('touchmove', onMove); };
  }, [MAX]);

  // Jump to startIndex on open
  useEffect(() => {
    if (!entered || startIndex === 0) return;
    const w = (1 - PHASE_START) / n;
    const targetP = PHASE_START + (startIndex + 0.5) * w;
    scrollObj.current.y = MAX * targetP;
  }, [entered, startIndex, n, MAX]);

  const scrollToPhoto = (i: number) => {
    const w = (1 - PHASE_START) / n;
    const targetP = PHASE_START + (i + 0.5) * w;
    gsap.to(scrollObj.current, { y: MAX * targetP, ease: 'power3.out', duration: 0.7 });
  };

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: '#0c0c0c',
        display: 'flex', flexDirection: 'column',
        opacity: entered ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', flexShrink: 0, zIndex: 20, position: 'relative',
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'opacity 0.35s ease 0.07s, transform 0.35s ease 0.07s',
      }}>
        <span style={{ fontFamily: FONT, fontSize: '13px', color: 'rgba(255,255,255,0.32)' }}>
          {activeIdx >= 0
            ? <><span style={{ color: '#fff', fontWeight: 600 }}>{activeIdx + 1}</span>{' / '}{n}</>
            : <span style={{ color: '#fff', fontWeight: 600 }}>{n} fotos</span>
          }
        </span>
        <button
          type="button"
          onClick={onClose}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)', border: 'none',
            cursor: 'pointer', color: '#fff', transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >
          <X size={16} />
        </button>
      </div>

      {/* Bento display area */}
      <div
        ref={containerRef}
        style={{ flex: 1, position: 'relative', minHeight: 0, padding: '0 16px 12px' }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {images.map((img, i) => (
            <PhotoCard
              key={i}
              img={img}
              rect={layout[i]}
              cardRef={el => { cardRefs.current[i] = el; }}
              imgRef={el  => { imgRefs.current[i]  = el; }}
            />
          ))}
        </div>

        {/* Scroll hint */}
        {entered && activeIdx < 0 && (
          <div
            ref={hintRef}
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: FONT,
              fontSize: '11px',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.1em',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M4 9l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Desplázate para explorar
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      <div style={{
        height: '76px',
        overflowX: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        padding: '8px 16px',
        background: '#111',
        flexShrink: 0,
        scrollbarWidth: 'none',
        position: 'relative', zIndex: 20,
      }}>
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToPhoto(i)}
            style={{
              flexShrink: 0,
              height: '56px',
              aspectRatio: '4/3',
              padding: 0,
              border: `2px solid ${i === activeIdx ? RED : 'transparent'}`,
              cursor: 'pointer',
              overflow: 'hidden',
              background: 'none',
              transition: 'border-color 0.18s',
              borderRadius: '4px',
            }}
          >
            <img
              src={img}
              alt={`Foto ${i + 1}`}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block',
                opacity: i === activeIdx ? 1 : 0.38,
                transition: 'opacity 0.18s',
              }}
            />
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}

/* ── Preview (3 fotos) ── */

function PreviewCell({ img, alt, rowSpan, onClick, overlay }: {
  img: string; alt: string; rowSpan?: boolean; onClick: () => void; overlay?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{
        gridRow: rowSpan ? '1 / 3' : undefined,
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        background: '#f0efed',
      }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <img src={img} alt={alt} draggable={false} style={{
        width: '100%', height: '100%', objectFit: 'contain', display: 'block',
        transform: hov ? 'scale(1.03)' : 'scale(1)',
        transition: 'transform 0.45s ease',
        pointerEvents: 'none',
      }} />
      {overlay && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.48)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <span style={{ fontFamily: FONT, fontSize: '15px', fontWeight: 600, color: '#fff' }}>
            {overlay}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Export ── */

export default function PropertyGallery({ images, title, stats: _stats }: PropertyGalleryProps) {
  const [open,     setOpen]     = useState(false);
  const [startIdx, setStartIdx] = useState(0);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const openAt = (i: number) => { setStartIdx(i); setOpen(true); };
  const remaining = images.length - 3;

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '6px',
        height: '460px',
        marginBottom: '24px',
      }}>
        <PreviewCell img={images[0]} alt={title} rowSpan onClick={() => openAt(0)} />
        <PreviewCell img={images[1] ?? images[0]} alt={`${title} 2`} onClick={() => openAt(1)} />
        <PreviewCell
          img={images[2] ?? images[0]}
          alt={`${title} 3`}
          onClick={() => openAt(2)}
          overlay={remaining > 0 ? `+${remaining} fotos` : undefined}
        />
      </div>

      {mounted && open && (
        <BentoGallery
          images={images}
          startIndex={startIdx}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
