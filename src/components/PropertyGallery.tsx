'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Grid2x2 } from 'lucide-react';

const FONT = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', system-ui, sans-serif";
const RED  = '#f32735';
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

/* ── Lightbox — Bento Grid ─────────────────────────────────────── */

function Lightbox({ images, startIndex, onClose }: {
  images: string[]; startIndex: number; onClose: () => void;
}) {
  const [idx,     setIdx]     = useState(startIndex);
  const [entered, setEntered] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);

  // Doble rAF para arrancar la transición CSS después del mount
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setEntered(true))
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next, onClose]);

  // Scroll miniatura activa al centro
  useEffect(() => {
    if (!thumbsRef.current) return;
    const active = thumbsRef.current.querySelector('[data-active="true"]') as HTMLElement;
    active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [idx]);

  const i1 = (idx + 1) % images.length;
  const i2 = (idx + 2) % images.length;

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: '#0d0d0d',
        display: 'flex', flexDirection: 'column',
        padding: '16px', gap: '10px',
        opacity: entered ? 1 : 0,
        transition: `opacity 0.3s ease`,
      }}
    >
      {/* ── Top bar ───────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(-14px)',
        transition: `opacity 0.4s ${EASE} 0.05s, transform 0.4s ${EASE} 0.05s`,
      }}>
        {/* Contador + flechas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button type="button" onClick={prev} style={arrowBtnStyle}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}>
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontFamily: FONT, fontSize: '13px', color: 'rgba(255,255,255,0.50)', minWidth: '52px', textAlign: 'center' }}>
            {idx + 1} / {images.length}
          </span>
          <button type="button" onClick={next} style={arrowBtnStyle}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Cerrar */}
        <button type="button" onClick={onClose} style={{ ...arrowBtnStyle, width: '36px', height: '36px' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}>
          <X size={17} />
        </button>
      </div>

      {/* ── Bento Grid ────────────────────────────────────────── */}
      <div style={{
        flex: 1, minHeight: 0,
        display: 'grid',
        gridTemplateColumns: '3fr 2fr',
        gridTemplateRows: '1fr 1fr',
        gap: '8px',
      }}>
        {/* Foto principal — ocupa las 2 filas */}
        <BentoCell
          img={images[idx]}
          rowSpan
          entered={entered}
          delay={0.10}
          onClick={prev}
        />
        {/* Foto siguiente */}
        <BentoCell
          img={images[i1]}
          entered={entered}
          delay={0.16}
          onClick={() => setIdx(i1)}
          dimmed
        />
        {/* Foto siguiente+1 */}
        <BentoCell
          img={images[i2]}
          entered={entered}
          delay={0.22}
          onClick={() => setIdx(i2)}
          dimmed
        />
      </div>

      {/* ── Thumbnails ────────────────────────────────────────── */}
      <div
        ref={thumbsRef}
        style={{
          display: 'flex', gap: '6px', flexShrink: 0,
          overflowX: 'auto', scrollbarWidth: 'thin',
          padding: '2px 0',
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(18px)',
          transition: `opacity 0.4s ${EASE} 0.22s, transform 0.4s ${EASE} 0.22s`,
        }}
      >
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            data-active={i === idx ? 'true' : 'false'}
            onClick={() => setIdx(i)}
            style={{
              flexShrink: 0, width: '72px', height: '50px',
              border: i === idx ? `2px solid ${RED}` : '2px solid transparent',
              borderRadius: '7px', overflow: 'hidden', cursor: 'pointer',
              opacity: i === idx ? 1 : 0.45,
              transition: 'opacity 0.2s, border-color 0.2s',
              background: 'none', padding: 0,
            }}
            onMouseEnter={e => { if (i !== idx) e.currentTarget.style.opacity = '0.75'; }}
            onMouseLeave={e => { if (i !== idx) e.currentTarget.style.opacity = '0.45'; }}
          >
            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}

/* ── Bento cell ──────────────────────────────────────────────────── */

function BentoCell({ img, rowSpan, entered, delay, onClick, dimmed }: {
  img: string; rowSpan?: boolean; entered: boolean;
  delay: number; onClick: () => void; dimmed?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        gridRow: rowSpan ? '1 / 3' : undefined,
        borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
        opacity: entered ? 1 : 0,
        transform: entered ? 'scale(1)' : 'scale(0.88)',
        transition: `opacity 0.55s ${EASE} ${delay}s, transform 0.55s ${EASE} ${delay}s`,
        position: 'relative',
      }}
    >
      <img
        src={img}
        alt=""
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: hov ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.5s ease',
          display: 'block',
        }}
      />
      {/* Overlay: foto secundaria levemente oscurecida, aclara en hover */}
      {dimmed && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.35)',
          transition: 'background 0.3s ease',
          ...(hov ? { background: 'rgba(0,0,0,0.08)' } : {}),
        }} />
      )}
    </div>
  );
}

const arrowBtnStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '34px', height: '34px', borderRadius: '50%',
  background: 'rgba(255,255,255,0.10)', border: 'none',
  cursor: 'pointer', color: '#fff', transition: 'background 0.2s',
};

/* ── Preview — Expanding Flex Cards (3 fotos) ──────────────────── */

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [startIdx,     setStartIdx]     = useState(0);
  const [mounted,      setMounted]      = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const open = (i: number) => { setStartIdx(i); setLightboxOpen(true); };

  // Solo 3 fotos visibles en la preview
  const gridImages = images.slice(0, 3);
  const remaining  = images.length - 3;

  return (
    <>
      {/* ── Acordeón de 3 tarjetas ───────────────────────────── */}
      <div style={{
        display: 'flex',
        gap: '6px',
        height: '460px',
        marginBottom: '8px',
      }}>
        {gridImages.map((img, i) => {
          const isHov = hoveredIdx === i;
          const anyHov = hoveredIdx !== null;

          // Primera foto más ancha por defecto
          const defaultGrow = i === 0 ? 1.8 : 1;
          const growVal = anyHov
            ? (isHov ? 4 : (i === 0 ? 1.2 : 0.8))
            : defaultGrow;

          const showCountOverlay = i === 2 && remaining > 0 && !isHov;

          return (
            <div
              key={i}
              style={{
                flexGrow: growVal, flexShrink: 1, flexBasis: '0px',
                minWidth: 0, position: 'relative',
                overflow: 'hidden', cursor: 'pointer',
                borderRadius: '10px',
                transition: 'flex-grow 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => open(i)}
            >
              <img
                src={img}
                alt={`${title} - foto ${i + 1}`}
                draggable={false}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transform: isHov ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
                  pointerEvents: 'none', userSelect: 'none', display: 'block',
                }}
              />

              {/* Gradiente en hover */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0) 55%)',
                opacity: isHov ? 1 : 0,
                transition: 'opacity 0.4s ease', pointerEvents: 'none',
              }} />

              {/* Contador + ícono en hover */}
              <div style={{
                position: 'absolute', bottom: '14px', left: '16px', right: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                opacity: isHov ? 1 : 0,
                transform: isHov ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.35s ease 0.12s, transform 0.35s ease 0.12s',
                pointerEvents: 'none',
              }}>
                <span style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>
                  {i + 1} / {images.length}
                </span>
                <Grid2x2 size={14} color="rgba(255,255,255,0.75)" />
              </div>

              {/* "+N fotos" en la última celda */}
              {showCountOverlay && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.48)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'none',
                }}>
                  <span style={{ fontFamily: FONT, fontSize: '15px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
                    +{remaining} fotos
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Botón "Ver todas" */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => open(0)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            fontFamily: FONT, fontSize: '13px', fontWeight: 500,
            color: '#333', background: '#fff',
            border: '1px solid #ddd', borderRadius: '6px',
            padding: '8px 16px', cursor: 'pointer',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.color = RED; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.color = '#333'; }}
        >
          <Grid2x2 size={15} />
          Ver todas las fotos ({images.length})
        </button>
      </div>

      {/* Lightbox Bento */}
      {mounted && lightboxOpen && (
        <Lightbox images={images} startIndex={startIdx} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
}
