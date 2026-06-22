'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/* ─── Constants ────────────────────────────────────────────────── */
const FONT  = "'Avenir LT Pro 65 Medium','Avenir LT Pro','Avenir',system-ui,sans-serif";
const EASE  = 'cubic-bezier(0.22,1.0,0.36,1.0)';
const GRID_TRANSITION = 'grid-template-columns 0.55s cubic-bezier(0.25,0.46,0.45,0.94), grid-template-rows 0.55s cubic-bezier(0.25,0.46,0.45,0.94)';

const COLS      = 3;
const FR_ACTIVE = 3;
const FR_REST   = 0.7;

/* ─── Types ───────────────────────────────────────────────────── */
export interface PropertyStats {
  bedrooms?: number; bathrooms?: number;
  area?: string; price?: string; parking?: number;
}
interface PropertyGalleryProps { images: string[]; title: string; stats?: PropertyStats; }

/* ─── Grid helpers ────────────────────────────────────────────── */
function buildCols(hoveredCol: number | null, cols: number): string {
  if (hoveredCol === null) return `repeat(${cols}, 1fr)`;
  return Array.from({ length: cols }, (_, i) =>
    i === hoveredCol ? `${FR_ACTIVE}fr` : `${FR_REST}fr`
  ).join(' ');
}

function buildRows(hoveredRow: number | null, rows: number): string {
  if (hoveredRow === null) return `repeat(${rows}, 1fr)`;
  return Array.from({ length: rows }, (_, i) =>
    i === hoveredRow ? `${FR_ACTIVE - 0.5}fr` : `${FR_REST}fr`
  ).join(' ');
}

/* ─── BentoGallery ────────────────────────────────────────────── */
function BentoGallery({ images, onClose }: { images: string[]; onClose: () => void }) {
  const [hoveredIdx,  setHoveredIdx]  = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isMobile,    setIsMobile]    = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);

  const rows = Math.ceil(images.length / COLS);

  /* Derived: which col/row is hovered */
  const hoveredCol = hoveredIdx !== null ? hoveredIdx % COLS : null;
  const hoveredRow = hoveredIdx !== null ? Math.floor(hoveredIdx / COLS) : null;

  /* Accordion grid strings */
  const gridCols = buildCols(hoveredCol, COLS);
  const gridRows = buildRows(hoveredRow, rows);

  /* Last row: if incomplete, last image spans remaining cols */
  const remainder   = images.length % COLS;
  const lastSpan    = remainder > 0 ? COLS - remainder + 1 : 1;
  const lastIdx     = images.length - 1;

  /* ── Lock scroll ────────────────────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* ── Keyboard close ─────────────────────────────────────────── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  /* ── Responsive ─────────────────────────────────────────────── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Carousel scroll to selected ────────────────────────────── */
  useEffect(() => {
    if (selectedIdx === null || !carouselRef.current) return;
    const thumb = carouselRef.current.children[selectedIdx] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [selectedIdx]);

  const handleCellClick = useCallback((idx: number) => {
    setSelectedIdx(prev => prev === idx ? null : idx);
  }, []);

  /* ── Mobile ──────────────────────────────────────────────────── */
  if (isMobile) {
    return createPortal(
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#0c0c0c', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'flex-end', padding: '12px 16px', background: 'linear-gradient(#0c0c0c 70%, transparent)' }}>
          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', color: '#fff' }}>
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, padding: '0 3px 3px' }}>
          {images.map((img, idx) => (
            <div key={idx} style={{ aspectRatio: '1', borderRadius: 6, overflow: 'hidden', background: '#1a1a1a' }}>
              <img src={img} alt={`Foto ${idx + 1}`} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ))}
        </div>
      </div>,
      document.body
    );
  }

  /* ── Desktop ─────────────────────────────────────────────────── */
  return createPortal(
    <>
      <style>{`.bento-carousel::-webkit-scrollbar { display: none; }`}</style>

      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#0c0c0c', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '12px 20px', flexShrink: 0 }}>
          <button
            onClick={onClose}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: '#fff', transition: `background 0.2s ${EASE}` }}
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── Accordion grid ─────────────────────────────────────── */}
        {/* Wrapper flex item con alto definitivo — necesario para que 1fr en gridTemplateRows funcione */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '0 16px 8px' }}>
        <div
          style={{
            display: 'grid',
            height: '100%',          /* alto explícito → 1fr tiene referencia definitiva */
            gridTemplateColumns: gridCols,
            gridTemplateRows:    gridRows,
            transition: GRID_TRANSITION,
            gap: 4,
          }}
        >
          {images.map((img, idx) => {
            const isSelected = selectedIdx === idx;
            /* Last image fills remaining empty slots in incomplete row */
            const span = idx === lastIdx && remainder !== 0 ? lastSpan : 1;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => handleCellClick(idx)}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 8,
                  cursor: 'pointer',
                  gridColumn: span > 1 ? `span ${span}` : undefined,
                  outline: isSelected ? '2px solid rgba(255,255,255,0.65)' : '2px solid transparent',
                  outlineOffset: -2,
                  transition: `outline-color 0.2s ${EASE}`,
                }}
              >
                <img
                  src={img}
                  alt={`Foto ${idx + 1}`}
                  draggable={false}
                  style={{
                    width: '100%', height: '100%', display: 'block',
                    objectFit: 'cover', objectPosition: 'center',
                    userSelect: 'none', pointerEvents: 'none',
                    /* Subtle zoom on the active image while grid animates */
                    transform: hoveredIdx === idx ? 'scale(1.04)' : 'scale(1)',
                    transition: `transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)`,
                  }}
                />
              </div>
            );
          })}
        </div>
        </div>{/* end wrapper */}

        {/* ── Carousel ───────────────────────────────────────────── */}
        <div style={{ height: '10vh', minHeight: 60, maxHeight: 90, flexShrink: 0, display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
          <div
            ref={carouselRef}
            className="bento-carousel"
            style={{ height: '100%', overflowX: 'auto', overflowY: 'hidden', display: 'flex', alignItems: 'center', gap: 4, padding: '4px 16px 8px', scrollbarWidth: 'none', msOverflowStyle: 'none' as React.CSSProperties['msOverflowStyle'] }}
          >
            {images.map((img, idx) => {
              const isActive = selectedIdx === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  style={{ flexShrink: 0, height: '100%', aspectRatio: '4/3', borderRadius: 5, overflow: 'hidden', cursor: 'pointer', outline: isActive ? '2px solid #fff' : '2px solid transparent', outlineOffset: -2, opacity: isActive ? 1 : 0.55, transform: isActive ? 'scale(1.06)' : 'scale(1)', transition: `opacity 0.2s ${EASE}, transform 0.2s ${EASE}, outline-color 0.2s ${EASE}` }}
                >
                  <img src={img} alt={`Miniatura ${idx + 1}`} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </>,
    document.body
  );
}

/* ─── Preview grid (ficha de propiedad) ───────────────────────── */
function PreviewCell({ img, alt, rowSpan, onClick, overlay }: {
  img: string; alt: string; rowSpan?: boolean; onClick: () => void; overlay?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ gridRow: rowSpan ? '1/3' : undefined, position: 'relative', overflow: 'hidden', cursor: 'pointer', background: '#f0efed' }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <img src={img} alt={alt} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hov ? 'scale(1.04)' : 'scale(1)', transition: `transform 0.5s ${EASE}`, pointerEvents: 'none' }} />
      {overlay && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: '0.02em' }}>{overlay}</span>
        </div>
      )}
    </div>
  );
}

/* ─── Export ──────────────────────────────────────────────────── */
export default function PropertyGallery({ images, title, stats: _stats }: PropertyGalleryProps) {
  const [open,    setOpen]    = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr', gap: 4, height: 420, marginBottom: 24, borderRadius: 8, overflow: 'hidden' }}>
        <PreviewCell img={images[0]} alt={title} rowSpan onClick={() => setOpen(true)} />
        <PreviewCell img={images[1] ?? images[0]} alt={`${title} 2`} onClick={() => setOpen(true)} />
        <PreviewCell img={images[2] ?? images[0]} alt={`${title} 3`} onClick={() => setOpen(true)} overlay={images.length > 3 ? `+${images.length - 3} fotos` : undefined} />
      </div>
      {mounted && open && <BentoGallery images={images} onClose={() => setOpen(false)} />}
    </>
  );
}
