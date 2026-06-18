'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Grid2x2, ArrowLeft } from 'lucide-react';

const FONT = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', system-ui, sans-serif";
const RED  = '#f32735';
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

/* ── Lightbox ──────────────────────────────────────────────────── */
// Dos modos:
//  • 'grid'   → masonry bento de todas las fotos (respeta orientación)
//  • 'viewer' → foto individual con flechas ← →

function Lightbox({ images, startIndex, onClose }: {
  images: string[]; startIndex: number; onClose: () => void;
}) {
  const [mode,      setMode]      = useState<'grid' | 'viewer'>('grid');
  const [viewerIdx, setViewerIdx] = useState(startIndex);
  const [entered,   setEntered]   = useState(false);

  // Refs para scroll al foto inicial en el grid
  const cellRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const gridRef   = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setEntered(true))
    );
    return () => cancelAnimationFrame(id);
  }, []);

  // Scroll a la foto inicial después de que la animación arranca
  useEffect(() => {
    if (!entered || mode !== 'grid') return;
    const cell = cellRefs.current[startIndex];
    if (cell) setTimeout(() => cell.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
  }, [entered, startIndex, mode]);

  // Scroll miniatura activa al centro en viewer
  useEffect(() => {
    if (!thumbsRef.current) return;
    const active = thumbsRef.current.querySelector('[data-active="true"]') as HTMLElement;
    active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [viewerIdx]);

  // Teclado
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mode === 'viewer') setMode('grid');
        else onClose();
      }
      if (mode === 'viewer') {
        if (e.key === 'ArrowLeft')  setViewerIdx(i => (i - 1 + images.length) % images.length);
        if (e.key === 'ArrowRight') setViewerIdx(i => (i + 1) % images.length);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [mode, images.length, onClose]);

  const openViewer = (i: number) => { setViewerIdx(i); setMode('viewer'); };
  const closeViewer = () => setMode('grid');
  const prev = () => setViewerIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setViewerIdx(i => (i + 1) % images.length);

  // Columnas del grid según cantidad de fotos
  const cols = images.length <= 4 ? 2 : images.length <= 15 ? 3 : 4;

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: '#0d0d0d',
        display: 'flex', flexDirection: 'column',
        opacity: entered ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      {/* ─────────────────────────────────────────────────────────
          MODO GRID — Bento/Masonry de todas las fotos
      ───────────────────────────────────────────────────────── */}
      {mode === 'grid' && (
        <>
          {/* Top bar grid */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', flexShrink: 0,
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateY(0)' : 'translateY(-14px)',
            transition: `opacity 0.4s ${EASE} 0.05s, transform 0.4s ${EASE} 0.05s`,
          }}>
            <span style={{ fontFamily: FONT, fontSize: '13px', color: 'rgba(255,255,255,0.50)' }}>
              {images.length} fotos
            </span>
            <button type="button" onClick={onClose} style={iconBtnStyle}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.20)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}>
              <X size={17} />
            </button>
          </div>

          {/* Masonry bento grid — scroll wrapper separado del columnCount */}
          <div
            ref={gridRef}
            style={{
              flex: 1, overflowY: 'auto', minHeight: 0,
              scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent',
              opacity: entered ? 1 : 0,
              transform: entered ? 'translateY(0)' : 'translateY(22px)',
              transition: `opacity 0.5s ${EASE} 0.1s, transform 0.5s ${EASE} 0.1s`,
            }}
          >
            <div style={{
              columnCount: cols, columnGap: '8px',
              padding: '0 16px 20px',
            }}>
              {images.map((img, i) => (
                <GridCell
                  key={i}
                  img={img}
                  index={i}
                  isStart={i === startIndex}
                  cellRef={el => { cellRefs.current[i] = el; }}
                  onClick={() => openViewer(i)}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────
          MODO VIEWER — Foto individual con navegación
      ───────────────────────────────────────────────────────── */}
      {mode === 'viewer' && (
        <>
          {/* Top bar viewer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 20px', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button type="button" onClick={closeViewer} style={iconBtnStyle}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.20)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}>
                <ArrowLeft size={17} />
              </button>
              <span style={{ fontFamily: FONT, fontSize: '13px', color: 'rgba(255,255,255,0.50)' }}>
                {viewerIdx + 1} / {images.length}
              </span>
            </div>
            <button type="button" onClick={onClose} style={iconBtnStyle}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.20)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}>
              <X size={17} />
            </button>
          </div>

          {/* Foto grande */}
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', minHeight: 0, padding: '0 68px',
          }}>
            <button type="button" onClick={prev} style={{ ...navArrowStyle, left: '14px' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}>
              <ChevronLeft size={22} />
            </button>

            <img
              key={viewerIdx}
              src={images[viewerIdx]}
              alt={`Foto ${viewerIdx + 1}`}
              style={{
                maxWidth: '100%', maxHeight: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />

            <button type="button" onClick={next} style={{ ...navArrowStyle, right: '14px' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}>
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Miniaturas */}
          <div
            ref={thumbsRef}
            style={{
              display: 'flex', gap: '6px', padding: '12px 20px', flexShrink: 0,
              overflowX: 'auto', scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.15) transparent',
            }}
          >
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                data-active={i === viewerIdx ? 'true' : 'false'}
                onClick={() => setViewerIdx(i)}
                style={{
                  flexShrink: 0, width: '68px', height: '48px',
                  border: i === viewerIdx ? `2px solid ${RED}` : '2px solid transparent',
                  borderRadius: '6px', overflow: 'hidden', cursor: 'pointer',
                  opacity: i === viewerIdx ? 1 : 0.42,
                  transition: 'opacity 0.2s, border-color 0.2s',
                  background: 'none', padding: 0,
                }}
                onMouseEnter={e => { if (i !== viewerIdx) e.currentTarget.style.opacity = '0.75'; }}
                onMouseLeave={e => { if (i !== viewerIdx) e.currentTarget.style.opacity = '0.42'; }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>,
    document.body
  );
}

/* ── Celda del grid masonry ──────────────────────────────────────── */

function GridCell({ img, index, isStart, cellRef, onClick }: {
  img: string; index: number; isStart: boolean;
  cellRef: (el: HTMLDivElement | null) => void;
  onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      ref={cellRef}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        breakInside: 'avoid',
        marginBottom: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        // Resalta la foto con la que se abrió el lightbox
        outline: isStart ? `3px solid ${RED}` : '3px solid transparent',
        outlineOffset: '-3px',
        transition: 'outline-color 0.25s ease',
      }}
    >
      {/* height: auto → respeta orientación vertical u horizontal sin recorte */}
      <img
        src={img}
        alt={`Foto ${index + 1}`}
        style={{
          width: '100%', height: 'auto',
          display: 'block',
          transform: hov ? 'scale(1.03)' : 'scale(1)',
          transition: 'transform 0.4s ease',
        }}
      />
      {/* Overlay hover */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.30)',
        opacity: hov ? 1 : 0,
        transition: 'opacity 0.3s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ChevronRight size={20} color="#fff" />
        </div>
      </div>
    </div>
  );
}

/* ── Estilos compartidos ─────────────────────────────────────────── */

const iconBtnStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '34px', height: '34px', borderRadius: '50%',
  background: 'rgba(255,255,255,0.10)', border: 'none',
  cursor: 'pointer', color: '#fff', transition: 'background 0.2s', flexShrink: 0,
};

const navArrowStyle: React.CSSProperties = {
  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '46px', height: '46px', borderRadius: '50%',
  background: 'rgba(255,255,255,0.12)', border: 'none',
  cursor: 'pointer', color: '#fff', zIndex: 2, transition: 'background 0.2s',
};

/* ── Celda del preview ───────────────────────────────────────────── */

function PreviewCell({ img, alt, rowSpan, onClick, overlay }: {
  img: string; alt: string; rowSpan?: boolean;
  onClick: () => void; overlay?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{
        gridRow: rowSpan ? '1 / 3' : undefined,
        position: 'relative', overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <img
        src={img} alt={alt} draggable={false}
        style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          transform: hov ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.45s ease',
          pointerEvents: 'none',
        }}
      />
      {/* Overlay "+N fotos" */}
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

/* ── Preview — 1 grande izquierda + 2 apiladas derecha ────────── */

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [startIdx,     setStartIdx]     = useState(0);
  const [mounted,      setMounted]      = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const open = (i: number) => { setStartIdx(i); setLightboxOpen(true); };

  const remaining = images.length - 3;

  return (
    <>
      {/* ── Grid fijo: col izquierda grande + col derecha 2 apiladas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '6px',
        height: '460px',
        marginBottom: '8px',
      }}>
        {/* Foto principal — ocupa las 2 filas */}
        <PreviewCell img={images[0]} alt={title} rowSpan onClick={() => open(0)} />

        {/* Foto 2 — fila superior derecha */}
        <PreviewCell img={images[1] ?? images[0]} alt={`${title} 2`} onClick={() => open(1)} />

        {/* Foto 3 — fila inferior derecha, con overlay "+N" si hay más */}
        <PreviewCell
          img={images[2] ?? images[0]}
          alt={`${title} 3`}
          onClick={() => open(2)}
          overlay={remaining > 0 ? `+${remaining} fotos` : undefined}
        />
      </div>


      {/* Lightbox */}
      {mounted && lightboxOpen && (
        <Lightbox images={images} startIndex={startIdx} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
}
