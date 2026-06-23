'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/* ─── Constants ────────────────────────────────────────────────── */
const FONT  = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const EASE  = 'cubic-bezier(0.22,1.0,0.36,1.0)';
const GRID_TRANSITION = 'grid-template-columns 0.55s cubic-bezier(0.25,0.46,0.45,0.94), grid-template-rows 0.55s cubic-bezier(0.25,0.46,0.45,0.94)';


/* ─── Types ───────────────────────────────────────────────────── */
export interface PropertyStats {
  bedrooms?: number; bathrooms?: number;
  area?: string; price?: string; parking?: number;
}
interface PropertyGalleryProps { images: string[]; title: string; stats?: PropertyStats; }

/*
 * Calcula columnas óptimas para que todas las imágenes quepan en pantalla.
 * Para fotos portrait (9:16) en pantalla 16:9, la celda ideal está ~1.5:1.
 * Fórmula: round(sqrt(n × 1.5)), clampado entre 3 y 6.
 */
function computeCols(n: number): number {
  const ideal = Math.max(3, Math.min(6, Math.round(Math.sqrt(n * 1.5))));
  // Prefer a value that divides n evenly → no empty cells in the last row
  for (let d = 0; d <= 2; d++) {
    for (const c of [ideal, ideal - d, ideal + d]) {
      if (c >= 3 && c <= 6 && n % c === 0) return c;
    }
  }
  return ideal;
}

/* ─── Grid helpers orientados ─────────────────────────────────── */
/*
 * Portrait hover → solo el ROW se expande (~87% de la altura).
 *   Columnas permanecen 1fr. La celda queda alta y estrecha (portrait).
 *
 * Landscape hover → COL + ROW se expanden juntos para acercar el ratio
 *   de la celda al ratio natural 2:1 de las imágenes landscape.
 *   Col activa: 67% del ancho. Row activo: 60% del alto.
 *   object-fit:cover llena la celda sin barras negras.
 */
function buildColsOriented(
  hoveredCol: number | null,
  isLandscape: boolean,
  cols: number
): string {
  if (hoveredCol === null) return `repeat(${cols}, 1fr)`;
  if (isLandscape) {
    /* Landscape: columna activa llena casi todo el ancho.
     * Las otras columnas quedan como franjas visibles a los lados (2fr). */
    return Array.from({ length: cols }, (_, i) =>
      i === hoveredCol ? '50fr' : '2fr'
    ).join(' ');
  }
  /* Portrait: columnas iguales → proporciones portrait naturales con la fila expandida. */
  return `repeat(${cols}, 1fr)`;
}

function buildRowsOriented(
  hoveredRow: number | null,
  _isLandscape: boolean,
  rows: number
): string {
  if (hoveredRow === null) return `repeat(${rows}, 1fr)`;
  /* Fila activa llena casi toda la altura; las otras quedan como franjas visibles. */
  return Array.from({ length: rows }, (_, i) =>
    i === hoveredRow ? '50fr' : '1fr'
  ).join(' ');
}

/* ─── BentoGallery ────────────────────────────────────────────── */
function BentoGallery({ images, onClose }: { images: string[]; onClose: () => void }) {
  const [hoveredIdx,   setHoveredIdx]   = useState<number | null>(null);
  const [selectedIdx,  setSelectedIdx]  = useState<number | null>(null);
  const [isMobile,     setIsMobile]     = useState(false);
  /* true = landscape, false = portrait/square */
  const [orientations, setOrientations] = useState<boolean[]>([]);

  const carouselRef = useRef<HTMLDivElement>(null);

  /* ── Detectar orientación de cada imagen ──────────────────────── */
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      images.map(src =>
        new Promise<boolean>(resolve => {
          const img = new window.Image();
          const done = () => resolve(img.naturalWidth > img.naturalHeight);
          img.onload  = done;
          img.onerror = () => resolve(false);
          img.src = src;
          if (img.complete && img.naturalWidth > 0) done();
        })
      )
    ).then(r => { if (!cancelled) setOrientations(r); });
    return () => { cancelled = true; };
  }, [images]);

  /* Columnas y filas dinámicas según cantidad de imágenes */
  const cols = computeCols(images.length);
  const rows = Math.ceil(images.length / cols);

  /* ¿Es landscape la imagen bajo el cursor? */
  const hoveredIsLandscape = hoveredIdx !== null ? (orientations[hoveredIdx] ?? false) : false;

  /* Derived: which col/row is hovered */
  const hoveredCol = hoveredIdx !== null ? hoveredIdx % cols : null;
  const hoveredRow = hoveredIdx !== null ? Math.floor(hoveredIdx / cols) : null;

  /* Grid strings orientados */
  const gridCols = buildColsOriented(hoveredCol, hoveredIsLandscape, cols);
  const gridRows = buildRowsOriented(hoveredRow, hoveredIsLandscape, rows);

  /* Sin spanning — cada celda ocupa exactamente 1 columna.
   * El spanning rompía el hover portrait: una celda con span 2 acumula
   * 0.6fr + 1fr = 1.6fr y queda más ancha que alta aunque sea portrait. */

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
            height: '100%',
            gridTemplateColumns: gridCols,
            gridTemplateRows:    gridRows,
            transition: GRID_TRANSITION,
            gap: 4,
          }}
        >
          {images.map((img, idx) => {
            const isHovered  = hoveredIdx === idx;
            const isSelected = selectedIdx === idx;
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
                  background: '#111',
                  outline: isSelected ? '2px solid rgba(255,255,255,0.65)' : '2px solid transparent',
                  outlineOffset: -2,
                  opacity: hoveredIdx !== null && !isHovered ? 0.45 : 1,
                  transition: `opacity 0.4s ${EASE}, outline-color 0.2s ${EASE}`,
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
                  }}
                />
              </div>
            );
          })}
          {/* Invisible placeholders for incomplete last row — same color as container,
              no border-radius, so they blend with the background and leave no dark hole */}
          {images.length % cols !== 0 &&
            Array.from({ length: cols - (images.length % cols) }, (_, i) => (
              <div key={`ph-${i}`} style={{ opacity: 0, pointerEvents: 'none' }} />
            ))
          }
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
