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

/* ─── Grid helpers ────────────────────────────────────────────── */
/*
 * En hover la celda activa usa gridRow:1/-1 (span total de filas) para
 * ocupar toda la altura SIN expandir la fila — así las demás celdas del
 * mismo row conservan su altura normal y aparecen pequeñas a los lados.
 *
 * Solo para landscape se expande la columna activa para dar aspecto ancho.
 * Para portrait las columnas son iguales: 1/cols × ancho < alto = portrait.
 */
function buildCols(hoveredCol: number | null, isLandscape: boolean, cols: number): string {
  if (hoveredCol === null || !isLandscape) return `repeat(${cols}, 1fr)`;
  return Array.from({ length: cols }, (_, i) =>
    i === hoveredCol ? '10fr' : '1fr'
  ).join(' ');
}

/* ─── BentoGallery ────────────────────────────────────────────── */
function BentoGallery({ images, onClose }: { images: string[]; onClose: () => void }) {
  const [hoveredIdx,   setHoveredIdx]   = useState<number | null>(null);
  const [selectedIdx,  setSelectedIdx]  = useState<number | null>(null);
  const [isMobile,     setIsMobile]     = useState(false);
  /* true = landscape, false = portrait/square */
  const [orientations, setOrientations] = useState<boolean[]>([]);

  const carouselRef  = useRef<HTMLDivElement>(null);
  const clearTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const hoveredCol = hoveredIdx !== null ? hoveredIdx % cols : null;
  const isHovering = hoveredIdx !== null;

  const gridCols = buildCols(hoveredCol, hoveredIsLandscape, cols);
  const gridRows = `repeat(${rows}, 1fr)`;

  /* ── Última fila incompleta: qué imagen hace span extra ──────── */
  const fillerCount  = images.length % cols !== 0 ? cols - (images.length % cols) : 0;
  const lastRowStart = fillerCount > 0 ? (rows - 1) * cols : -1;
  /* Preferir imagen landscape del último row; si no, la última imagen */
  let spanIdx = -1;
  if (fillerCount > 0) {
    for (let i = lastRowStart; i < images.length; i++) {
      if (orientations[i] === true) { spanIdx = i; break; }
    }
    if (spanIdx === -1) spanIdx = images.length - 1;
  }

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

  /* ── Grid hover via event delegation (evita flicker por reorganización del grid) ── */
  const handleGridMouseMove = useCallback((e: React.MouseEvent) => {
    const cell = (e.target as HTMLElement).closest('[data-idx]') as HTMLElement | null;
    const raw  = cell?.dataset?.idx;
    const idx  = raw !== undefined ? parseInt(raw) : null;
    if (clearTimer.current) { clearTimeout(clearTimer.current); clearTimer.current = null; }
    if (idx !== null) {
      setHoveredIdx(prev => prev === idx ? prev : idx);
    } else {
      /* Cursor en el gap entre celdas → esperar un poco antes de limpiar */
      clearTimer.current = setTimeout(() => setHoveredIdx(null), 80);
    }
  }, []);

  const handleGridMouseLeave = useCallback(() => {
    if (clearTimer.current) clearTimeout(clearTimer.current);
    setHoveredIdx(null);
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
          onMouseMove={handleGridMouseMove}
          onMouseLeave={handleGridMouseLeave}
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
            const cellRow    = Math.floor(idx / cols);
            const isLastRow  = fillerCount > 0 && cellRow === rows - 1;
            const posInRow   = isLastRow ? idx - lastRowStart : idx % cols; // 0-indexed pos within row

            /* ── Columna explícita, ajustada para el span de la última fila ── */
            let gridColValue: string | number;
            if (isLastRow) {
              if (idx === spanIdx) {
                /* Esta imagen hace span para llenar el hueco */
                gridColValue = `${posInRow + 1} / ${posInRow + 1 + fillerCount + 1}`;
              } else if (spanIdx !== -1 && idx > spanIdx) {
                /* Imágenes después del span target se desplazan a la derecha */
                gridColValue = posInRow + fillerCount + 1;
              } else {
                gridColValue = posInRow + 1;
              }
            } else {
              gridColValue = posInRow + 1;
            }

            /* Misma columna que el hovered pero no es la celda activa → ocultar */
            const cellCol = idx % cols;
            const sameCol = isHovering && hoveredCol !== null && cellCol === hoveredCol;
            const hideCell = sameCol && !isHovered;
            const opacity  = hideCell ? 0 : (!isHovering ? 1 : isHovered ? 1 : 0.5);

            return (
              <div
                key={idx}
                data-idx={idx}
                onClick={() => handleCellClick(idx)}
                style={{
                  gridColumn: gridColValue,
                  gridRow: isHovering && isHovered ? '1 / -1' : cellRow + 1,
                  zIndex: isHovering && isHovered ? 1 : 0,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: '#111',
                  outline: isSelected ? '2px solid rgba(255,255,255,0.65)' : '2px solid transparent',
                  outlineOffset: -2,
                  opacity,
                  pointerEvents: hideCell ? 'none' : undefined,
                  transition: `opacity 0.35s ${EASE}, outline-color 0.2s ${EASE}`,
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

/* Celda grande izquierda: crossfade bento cuando cambia la imagen */
function MainPreviewCell({ img, alt, onClick }: { img: string; alt: string; onClick: () => void }) {
  const [base,    setBase]    = useState(img);
  const [incoming, setIncoming] = useState<{ src: string; id: number } | null>(null);
  const [hov,     setHov]     = useState(false);
  const counter = useRef(0);

  useEffect(() => {
    if (img === base) return;
    setIncoming({ src: img, id: ++counter.current });
  }, [img]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{ gridRow: '1/3', position: 'relative', overflow: 'hidden', cursor: 'pointer', background: '#111' }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Imagen base siempre visible debajo */}
      <img
        src={base} alt={alt} draggable={false}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', display: 'block', pointerEvents: 'none',
          transform: hov ? 'scale(1.04)' : 'scale(1)',
          transition: `transform 0.6s ${EASE}`,
        }}
      />
      {/* Incoming: se anima encima y al terminar pasa a ser la base */}
      {incoming && (
        <img
          key={incoming.id}
          src={incoming.src} alt={alt} draggable={false}
          onAnimationEnd={() => { setBase(incoming.src); setIncoming(null); }}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', display: 'block', pointerEvents: 'none',
            animation: `bentoReveal 0.42s ${EASE} forwards`,
          }}
        />
      )}
    </div>
  );
}

/* Celda pequeña derecha */
function SmallPreviewCell({ img, alt, onClick, overlay, onHoverIn, onHoverOut }: {
  img: string; alt: string; onClick: () => void; overlay?: string;
  onHoverIn: () => void; onHoverOut: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', background: '#111' }}
      onClick={onClick}
      onMouseEnter={() => { setHov(true);  onHoverIn();  }}
      onMouseLeave={() => { setHov(false); onHoverOut(); }}
    >
      <img src={img} alt={alt} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hov ? 'scale(1.04)' : 'scale(1)', transition: `transform 0.55s ${EASE}`, pointerEvents: 'none' }} />
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
  const [open,       setOpen]       = useState(false);
  const [mounted,    setMounted]    = useState(false);
  const [previewIdx, setPreviewIdx] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <style>{`
        @keyframes bentoReveal {
          from { opacity: 0; transform: scale(1.05); }
          to   { opacity: 1; transform: scale(1);    }
        }
      `}</style>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr', gap: 4, height: 420, marginBottom: 24, borderRadius: 8, overflow: 'hidden' }}>
        <MainPreviewCell
          img={images[previewIdx] ?? images[0]}
          alt={title}
          onClick={() => setOpen(true)}
        />
        <SmallPreviewCell
          img={images[1] ?? images[0]}
          alt={`${title} 2`}
          onClick={() => setOpen(true)}
          onHoverIn={() => setPreviewIdx(1)}
          onHoverOut={() => setPreviewIdx(0)}
        />
        <SmallPreviewCell
          img={images[2] ?? images[0]}
          alt={`${title} 3`}
          onClick={() => setOpen(true)}
          onHoverIn={() => setPreviewIdx(2)}
          onHoverOut={() => setPreviewIdx(0)}
          overlay={images.length > 3 ? `+${images.length - 3} fotos` : undefined}
        />
      </div>
      {mounted && open && <BentoGallery images={images} onClose={() => setOpen(false)} />}
    </>
  );
}
