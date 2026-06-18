'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Grid2x2 } from 'lucide-react';

const FONT = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', system-ui, sans-serif";
const RED  = '#f32735';
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

/* ── Lightbox — Bento grid scrollable ─────────────────────────── */

function Lightbox({ images, startIndex, onClose }: {
  images: string[]; startIndex: number; onClose: () => void;
}) {
  const [entered, setEntered] = useState(false);
  const startRef = useRef<HTMLDivElement>(null);

  // Animación de entrada
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setEntered(true))
    );
    return () => cancelAnimationFrame(id);
  }, []);

  // Scroll a la foto inicial una vez visible
  useEffect(() => {
    if (!entered || !startRef.current) return;
    setTimeout(() => startRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
  }, [entered]);

  // ESC cierra
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Columnas: round-robin para distribuir fotos y respetar orientación
  const numCols = images.length <= 4 ? 2 : 3;
  const columns: { img: string; globalIdx: number }[][] =
    Array.from({ length: numCols }, () => []);
  images.forEach((img, i) => columns[i % numCols].push({ img, globalIdx: i }));

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#0d0d0d',
      display: 'flex', flexDirection: 'column',
      opacity: entered ? 1 : 0,
      transition: 'opacity 0.3s ease',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', flexShrink: 0,
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(-14px)',
        transition: `opacity 0.4s ${EASE} 0.05s, transform 0.4s ${EASE} 0.05s`,
      }}>
        <span style={{ fontFamily: FONT, fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
          {images.length} fotos
        </span>
        <button
          type="button"
          onClick={onClose}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.10)', border: 'none',
            cursor: 'pointer', color: '#fff', transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
        >
          <X size={17} />
        </button>
      </div>

      {/* Grid bento scrollable — columnas flex manuales */}
      <div style={{
        flex: 1, overflowY: 'auto', minHeight: 0,
        padding: '0 16px 24px',
        scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.12) transparent',
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ${EASE} 0.1s, transform 0.5s ${EASE} 0.1s`,
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          {columns.map((col, colIdx) => (
            <div
              key={colIdx}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {col.map(({ img, globalIdx }) => (
                <div
                  key={globalIdx}
                  ref={globalIdx === startIndex ? startRef : undefined}
                  style={{
                    outline: globalIdx === startIndex ? `3px solid ${RED}` : 'none',
                    outlineOffset: '-3px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={img}
                    alt={`Foto ${globalIdx + 1}`}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

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
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
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
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '6px',
        height: '460px',
        marginBottom: '24px',
      }}>
        <PreviewCell img={images[0]} alt={title} rowSpan onClick={() => open(0)} />
        <PreviewCell img={images[1] ?? images[0]} alt={`${title} 2`} onClick={() => open(1)} />
        <PreviewCell
          img={images[2] ?? images[0]}
          alt={`${title} 3`}
          onClick={() => open(2)}
          overlay={remaining > 0 ? `+${remaining} fotos` : undefined}
        />
      </div>

      {mounted && lightboxOpen && (
        <Lightbox images={images} startIndex={startIdx} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
}
