'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  animate,
  type MotionValue,
} from 'framer-motion';
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

/* ── Bento resting-position layouts ────────────────────────────
   Each rect { l, t, w, h } in % of the photo container.
   These are the clip-path masks when the photo is "resting".  */

interface Rect { l: number; t: number; w: number; h: number }

/* G = gap between cells in % */
const G = 0.8;

const BENTO: Record<number, Rect[]> = {
  1: [{ l:0, t:0, w:100, h:100 }],

  /* 2: tall left + tall right, slight height difference */
  2: [
    { l:0,        t:0,    w:58-G/2,    h:100 },
    { l:58+G/2,   t:0,    w:42-G/2,    h:100 },
  ],

  /* 3: large left spanning full height, two stacked right */
  3: [
    { l:0,        t:0,    w:58-G/2,    h:100 },
    { l:58+G/2,   t:0,    w:42-G/2,    h:50-G/2 },
    { l:58+G/2,   t:50+G/2, w:42-G/2, h:50-G/2 },
  ],

  /* 4: one large top-left, two small top-right, one wide bottom */
  4: [
    { l:0,        t:0,       w:58-G/2,    h:60-G/2 },
    { l:58+G/2,   t:0,       w:22-G/2,   h:60-G/2 },
    { l:81+G/2,   t:0,       w:19-G/2,   h:60-G/2 },
    { l:0,        t:60+G/2,  w:100,       h:40-G/2 },
  ],

  /* 5: large left (full height) + 4 cells right in 2×2 */
  5: [
    { l:0,        t:0,       w:42-G/2,    h:100 },
    { l:42+G/2,   t:0,       w:29-G/2,    h:48-G/2 },
    { l:72+G/2,   t:0,       w:28-G/2,    h:48-G/2 },
    { l:42+G/2,   t:48+G/2,  w:29-G/2,    h:52-G/2 },
    { l:72+G/2,   t:48+G/2,  w:28-G/2,    h:52-G/2 },
  ],

  /* 6: large left (top 58%) + 2 small right top + wide bottom-left + 2 small bottom-right */
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
  // Dynamic fallback for n > 6
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

/* ── Animation helpers ─────────────────────────────────────── */

const SCROLL_PER_PHOTO = 900; // px of scroll per photo featured
const PHASE_START = 0.08;     // first 8% = mosaic overview

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

/* ── PhotoCard ─────────────────────────────────────────────── */

const R_REST = 14; // border-radius when resting
const R_FEAT = 20; // border-radius when fully featured

function PhotoCard({
  img,
  idx,
  n,
  rect,
  progress,
}: {
  img: string;
  idx: number;
  n: number;
  rect: Rect;
  progress: MotionValue<number>;
}) {
  // Clip values at rest (% inset from each edge)
  const CT = rect.t;
  const CR = 100 - rect.l - rect.w;
  const CB = 100 - rect.t - rect.h;
  const CL = rect.l;

  // intensity for THIS card (0 = resting, 1 = fully featured)
  const myInt = useTransform(progress, (p) => intensity(p, idx, n));

  // Clip-path edges interpolate from resting → 0 (full reveal)
  const cT   = useTransform(myInt, [0, 1], [CT, 0]);
  const cR   = useTransform(myInt, [0, 1], [CR, 0]);
  const cB   = useTransform(myInt, [0, 1], [CB, 0]);
  const cL   = useTransform(myInt, [0, 1], [CL, 0]);
  const cRad = useTransform(myInt, [0, 1], [R_REST, R_FEAT]);

  const clipPath = useTransform(
    [cT, cR, cB, cL, cRad] as MotionValue<number>[],
    ([t, r, b, l, rad]) => `inset(${t}% ${r}% ${b}% ${l}% round ${rad}px)`
  );

  // Dim non-featured cards when any card is expanding
  const opacity = useTransform(progress, (p) => {
    const mine = intensity(p, idx, n);
    if (mine > 0.12) return 1;
    const max  = maxIntensity(p, n);
    return Math.max(0.06, 1 - max * 0.92);
  });

  const zIndex = useTransform(myInt, v => v > 0.05 ? 10 : 1);

  // Ken Burns: image inside zooms as card expands
  const imgScale = useTransform(myInt, [0, 1], [1.0, 1.1]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        clipPath,
        opacity,
        zIndex,
        overflow: 'hidden',
        willChange: 'clip-path, opacity',
      }}
    >
      <motion.img
        src={img}
        alt=""
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          scale: imgScale,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      />
    </motion.div>
  );
}

/* ── BentoGallery (lightbox) ──────────────────────────────── */

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

  // MotionValue driving all animations (replaces a scroll container)
  const scrollY  = useMotionValue(0);
  const progress = useTransform(scrollY, [0, MAX], [0, 1]);

  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const [entered,   setEntered]   = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update active thumbnail
  useMotionValueEvent(progress, 'change', (p) => {
    if (p < PHASE_START) { setActiveIdx(-1); return; }
    let bestI = 0, bestV = -1;
    for (let i = 0; i < n; i++) {
      const v = intensity(p, i, n);
      if (v > bestV) { bestV = v; bestI = i; }
    }
    setActiveIdx(bestI);
  });

  // Fade-in entrance + body scroll lock
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    document.body.style.overflow = 'hidden';
    return () => { cancelAnimationFrame(id); document.body.style.overflow = ''; };
  }, []);

  // Keyboard: Esc close, arrow keys navigate
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') scrollToPhoto(Math.min(n - 1, activeIdx + 1));
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   scrollToPhoto(Math.max(0, activeIdx - 1));
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  // Wheel scroll: drives scrollY directly (scroll IS the lever)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollY.set(Math.max(0, Math.min(MAX, scrollY.get() + e.deltaY * 1.1)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [scrollY, MAX]);

  // Touch scroll (mobile)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let lastY = 0;
    const onStart = (e: TouchEvent) => { lastY = e.touches[0].clientY; };
    const onMove  = (e: TouchEvent) => {
      e.preventDefault();
      const dy = lastY - e.touches[0].clientY;
      lastY = e.touches[0].clientY;
      scrollY.set(Math.max(0, Math.min(MAX, scrollY.get() + dy * 2.2)));
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove',  onMove,  { passive: false });
    return () => { el.removeEventListener('touchstart', onStart); el.removeEventListener('touchmove', onMove); };
  }, [scrollY, MAX]);

  // Jump to startIndex on open
  useEffect(() => {
    if (!entered) return;
    if (startIndex === 0) return;
    const w = (1 - PHASE_START) / n;
    const targetP = PHASE_START + (startIndex + 0.5) * w;
    scrollY.set(MAX * targetP);
  }, [entered, startIndex, n, MAX, scrollY]);

  const scrollToPhoto = (i: number) => {
    const w = (1 - PHASE_START) / n;
    const targetP = PHASE_START + (i + 0.5) * w;
    animate(scrollY, MAX * targetP, { type: 'spring', stiffness: 90, damping: 22 });
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
      {/* ── Top bar ── */}
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

      {/* ── Bento display area (scroll events here) ── */}
      <div
        ref={containerRef}
        style={{ flex: 1, position: 'relative', minHeight: 0, padding: '0 16px 12px' }}
      >
        {/* Inner container: all photos stack here with clip-path */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {images.map((img, i) => (
            <PhotoCard
              key={i}
              img={img}
              idx={i}
              n={n}
              rect={layout[i]}
              progress={progress}
            />
          ))}
        </div>

        {/* Scroll hint on first open */}
        {entered && activeIdx < 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
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
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M4 9l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Desplázate para explorar
          </motion.div>
        )}
      </div>

      {/* ── Thumbnail strip ── */}
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

/* ── Preview (3 fotos) ─────────────────────────────────────── */

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

/* ── Export ─────────────────────────────────────────────────── */

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
