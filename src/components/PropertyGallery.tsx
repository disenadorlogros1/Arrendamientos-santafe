'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { X } from 'lucide-react';

const FONT    = "'Avenir LT Pro 65 Medium','Avenir LT Pro','Avenir',system-ui,sans-serif";
const SPRING  = 'cubic-bezier(0.34,1.56,0.64,1)';
const EASE    = 'cubic-bezier(0.22,1.0,0.36,1.0)';

export interface PropertyStats {
  bedrooms?: number; bathrooms?: number;
  area?: string; price?: string; parking?: number;
}
interface PropertyGalleryProps { images: string[]; title: string; stats?: PropertyStats; }

/* ─────────────────────────────────────────────────────────────────
   Floating card — shows image at its exact natural aspect ratio
   (portrait 9:16 → tall card, landscape 16:9 → wide card)
───────────────────────────────────────────────────────────────── */
interface FloatRect { left: number; top: number; width: number; height: number }

function calcFloatRect(anchor: DOMRect, nw: number, nh: number): FloatRect {
  const PAD  = 16;
  const maxW = window.innerWidth  - PAD * 2;
  const maxH = window.innerHeight - PAD * 2;
  const r    = nw / nh;
  let w = Math.min(nw, maxW);
  let h = w / r;
  if (h > maxH) { h = maxH; w = h * r; }
  let left = anchor.left + anchor.width  / 2 - w / 2;
  let top  = anchor.top  + anchor.height / 2 - h / 2;
  left = Math.max(PAD, Math.min(left, window.innerWidth  - w - PAD));
  top  = Math.max(PAD, Math.min(top,  window.innerHeight - h - PAD));
  return { left, top, width: w, height: h };
}

/* ─────────────────────────────────────────────────────────────────
   BentoGallery
   ─ CSS Grid animates grid-template-columns + grid-template-rows
     simultaneously → bento reflow where hovered cell expands in
     BOTH axes while neighbors compress based on proximity.
   ─ Floating card appears at natural image dimensions on top.
───────────────────────────────────────────────────────────────── */

function BentoGallery({ images, onClose }: { images: string[]; onClose: () => void }) {
  const [entered,    setEntered]    = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const floatRef    = useRef<HTMLDivElement | null>(null);
  const cellRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const naturalDims = useRef<Record<number, { w: number; h: number }>>({});
  const [floatRect, setFloatRect] = useState<FloatRect | null>(null);
  const [showFloat, setShowFloat] = useState(false);

  const n    = images.length;
  const COLS = n <= 4 ? n : n <= 9 ? Math.ceil(n / 2) : 5;
  const ROWS = Math.ceil(n / COLS);

  /* ── Bento track templates ──────────────────────────────────────
     Hovered cell dominates in BOTH col and row.
     Cells sharing the row get taller (but narrower if not the col).
     Cells sharing the col get wider (but shorter if not the row).
     Cells in neither compress in both dimensions.
  ─────────────────────────────────────────────────────────────── */
  const COL_BIG  = 4.5;
  const COL_SMALL = 0.38;
  const ROW_BIG  = 3.8;
  const ROW_SMALL = 0.42;

  function colTemplate(): string {
    if (hoveredIdx === null) return `repeat(${COLS}, 1fr)`;
    const hc = hoveredIdx % COLS;
    return Array.from({ length: COLS }, (_, i) =>
      i === hc ? `${COL_BIG}fr` : `${COL_SMALL}fr`,
    ).join(' ');
  }

  function rowTemplate(): string {
    if (hoveredIdx === null) return `repeat(${ROWS}, 1fr)`;
    const hr = Math.floor(hoveredIdx / COLS);
    return Array.from({ length: ROWS }, (_, i) =>
      i === hr ? `${ROW_BIG}fr` : `${ROW_SMALL}fr`,
    ).join(' ');
  }

  /* ── Floating card management ──────────────────────────────── */
  const openFloat = (idx: number) => {
    const cell = cellRefs.current[idx];
    const d    = naturalDims.current[idx];
    if (!cell || !d?.w) return;
    const rect = calcFloatRect(cell.getBoundingClientRect(), d.w, d.h);
    setFloatRect(rect);
    setShowFloat(true);
  };

  const closeFloat = () => {
    if (!floatRef.current) { setShowFloat(false); setFloatRect(null); return; }
    gsap.to(floatRef.current, {
      opacity: 0, scale: 0.94, duration: 0.15, ease: 'power2.in',
      onComplete: () => { setShowFloat(false); setFloatRect(null); },
    });
  };

  useEffect(() => {
    if (!showFloat || !floatRef.current) return;
    gsap.fromTo(floatRef.current,
      { opacity: 0, scale: 0.86 },
      { opacity: 1, scale: 1, duration: 0.26, ease: 'power2.out' },
    );
  }, [showFloat]);

  /* ── Lifecycle ─────────────────────────────────────────────── */
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    document.body.style.overflow = 'hidden';
    return () => { cancelAnimationFrame(id); document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const currentImg = hoveredIdx !== null ? images[hoveredIdx] : null;

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#0c0c0c',
      display: 'flex', flexDirection: 'column',
      opacity: entered ? 1 : 0,
      transition: 'opacity 0.28s ease',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', flexShrink: 0,
        opacity: entered ? 1 : 0,
        transform: entered ? 'none' : 'translateY(-8px)',
        transition: 'opacity 0.3s ease 0.06s, transform 0.3s ease 0.06s',
      }}>
        <span style={{ fontFamily: FONT, fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
          <span style={{ color: '#fff', fontWeight: 600 }}>{n}</span> fotos
        </span>
        <button onClick={onClose} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 34, height: 34, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)', border: 'none',
          cursor: 'pointer', color: '#fff', transition: 'background 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        ><X size={16} /></button>
      </div>

      {/* Hint */}
      {hoveredIdx === null && (
        <div style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          fontFamily: FONT, fontSize: '11px', letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.28)',
          display: 'flex', alignItems: 'center', gap: 8,
          opacity: entered ? 1 : 0, transition: 'opacity 0.4s ease 0.5s',
          pointerEvents: 'none',
        }}>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Pasa el cursor por las fotos
        </div>
      )}

      {/* ── Bento grid ─────────────────────────────────────────── */}
      <div style={{
        flex: 1, minHeight: 0,
        display: 'grid',
        gridTemplateColumns: colTemplate(),
        gridTemplateRows:    rowTemplate(),
        transition: [
          `grid-template-columns 0.52s ${SPRING}`,
          `grid-template-rows    0.52s ${SPRING}`,
        ].join(', '),
        gap: 4,
        padding: '0 16px 16px',
      }}>
        {images.map((img, idx) => {
          const isHov = hoveredIdx === idx;
          const hc    = hoveredIdx !== null ? hoveredIdx % COLS : -1;
          const hr    = hoveredIdx !== null ? Math.floor(hoveredIdx / COLS) : -1;
          const sameCol = idx % COLS === hc;
          const sameRow = Math.floor(idx / COLS) === hr;
          const isActive = hoveredIdx !== null && !isHov;

          // Cells sharing col/row with hovered get medium dim; others get heavy dim
          const dimOpacity = isActive
            ? (sameCol || sameRow ? 0.45 : 0.72)
            : 0;

          return (
            <div
              key={idx}
              ref={el => { cellRefs.current[idx] = el; }}
              onMouseEnter={() => { setHoveredIdx(idx); openFloat(idx); }}
              onMouseLeave={() => { setHoveredIdx(null); closeFloat(); }}
              style={{
                position: 'relative', overflow: 'hidden',
                borderRadius: 6, background: '#111', cursor: 'zoom-in',
              }}
            >
              <img
                src={img}
                alt={`Foto ${idx + 1}`}
                draggable={false}
                onLoad={e => {
                  const el = e.currentTarget;
                  if (el.naturalWidth) naturalDims.current[idx] = { w: el.naturalWidth, h: el.naturalHeight };
                }}
                style={{
                  width: '100%', height: '100%', display: 'block',
                  objectFit: 'cover', objectPosition: 'center',
                  transform: isHov ? 'scale(1.03)' : 'scale(1)',
                  transition: `transform 0.55s ${EASE}`,
                  userSelect: 'none',
                }}
              />

              {/* Darkening for non-hovered cells */}
              <div style={{
                position: 'absolute', inset: 0,
                background: '#000',
                opacity: dimOpacity,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
              }} />

              {/* Number label on strongly-dimmed cells */}
              {isActive && !sameCol && !sameRow && (
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  fontFamily: FONT, fontSize: '11px', letterSpacing: '0.1em',
                  color: 'rgba(255,255,255,0.4)',
                  pointerEvents: 'none', userSelect: 'none',
                }}>
                  {idx + 1}
                </div>
              )}

              {/* Counter on hovered cell */}
              {isHov && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '16px', pointerEvents: 'none',
                }}>
                  <span style={{ fontFamily: FONT, fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{idx + 1}</span>{' / '}{n}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating natural-ratio card */}
      {showFloat && floatRect && currentImg && createPortal(
        <div
          ref={el => { floatRef.current = el; }}
          style={{
            position: 'fixed',
            left: floatRect.left, top: floatRect.top,
            width: floatRect.width, height: floatRect.height,
            zIndex: 1200, borderRadius: 8, overflow: 'hidden',
            background: '#0c0c0c',
            boxShadow: '0 32px 80px rgba(0,0,0,0.85), 0 4px 20px rgba(0,0,0,0.6)',
            pointerEvents: 'none', willChange: 'transform,opacity',
          }}
        >
          <img src={currentImg} alt="" draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        </div>,
        document.body,
      )}
    </div>,
    document.body,
  );
}

/* ─────────────────────────────────────────────────────────────────
   Preview grid — property page entry point
───────────────────────────────────────────────────────────────── */

function PreviewCell({ img, alt, rowSpan, onClick, overlay }: {
  img: string; alt: string; rowSpan?: boolean; onClick: () => void; overlay?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ gridRow: rowSpan ? '1/3' : undefined, position: 'relative', overflow: 'hidden', cursor: 'pointer', background: '#f0efed' }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <img src={img} alt={alt} draggable={false} style={{
        width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        transform: hov ? 'scale(1.04)' : 'scale(1)',
        transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
        pointerEvents: 'none',
      }} />
      {overlay && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
        }}>
          <span style={{ fontFamily: FONT, fontSize: '15px', fontWeight: 600, color: '#fff', letterSpacing: '0.02em' }}>
            {overlay}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Export
───────────────────────────────────────────────────────────────── */

export default function PropertyGallery({ images, title, stats: _stats }: PropertyGalleryProps) {
  const [open, setOpen]       = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr',
        gap: 4, height: 420, marginBottom: 24, borderRadius: 8, overflow: 'hidden',
      }}>
        <PreviewCell img={images[0]} alt={title} rowSpan onClick={() => setOpen(true)} />
        <PreviewCell img={images[1] ?? images[0]} alt={`${title} 2`} onClick={() => setOpen(true)} />
        <PreviewCell
          img={images[2] ?? images[0]} alt={`${title} 3`} onClick={() => setOpen(true)}
          overlay={images.length > 3 ? `+${images.length - 3} fotos` : undefined}
        />
      </div>
      {mounted && open && <BentoGallery images={images} onClose={() => setOpen(false)} />}
    </>
  );
}
