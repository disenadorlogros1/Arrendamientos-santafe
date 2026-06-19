'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const FONT = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', system-ui, sans-serif";
const ELASTIC = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const EASE_OUT = 'cubic-bezier(0.22, 1.0, 0.36, 1.0)';

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

/* ─────────────────────────────────────────────────────────────────
   ElasticCard — single photo card in the flex strip
───────────────────────────────────────────────────────────────── */

function ElasticCard({
  img,
  index,
  total,
  globalIndex,
  isHovered,
  anyHovered,
  onEnter,
  onLeave,
}: {
  img: string;
  index: number;
  total: number;
  globalIndex: number;
  isHovered: boolean;
  anyHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  // Track natural ratio to compute correct expansion flex
  const [naturalRatio, setNaturalRatio] = useState<number | null>(null);

  const syncRatio = () => {
    const el = imgRef.current;
    if (el && el.naturalWidth > 0) {
      setNaturalRatio(el.naturalWidth / el.naturalHeight);
    }
  };

  useEffect(() => {
    if (imgRef.current?.complete) syncRatio();
  }, []);

  // Expanded flex scales with the image's natural aspect ratio:
  // 16:9 landscape (1.78) → flex ≈ 6.2  (needs lots of width)
  // 4:3  landscape (1.33) → flex ≈ 4.7
  // 1:1  square    (1.00) → flex ≈ 3.5
  // 3:4  portrait  (0.75) → flex ≈ 2.6  (already tall — less width needed)
  // 9:16 portrait  (0.56) → flex ≈ 2.0
  const expandedFlex = naturalRatio
    ? Math.max(1.8, Math.min(8, naturalRatio * 3.5))
    : 4.5;

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        flex: isHovered ? expandedFlex : anyHovered ? 0.35 : 1,
        transition: `flex 0.48s ${isHovered ? ELASTIC : EASE_OUT}`,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'zoom-in',
        borderRadius: '6px',
        background: '#111',
        minWidth: 0,
      }}
    >
      {/* Photo */}
      <img
        ref={imgRef}
        src={img}
        alt={`Foto ${globalIndex + 1}`}
        draggable={false}
        onLoad={syncRatio}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          transition: `transform 0.55s ${EASE_OUT}`,
          userSelect: 'none',
        }}
      />

      {/* Dark gradient — always, stronger when compressed */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)',
        opacity: anyHovered && !isHovered ? 0.85 : 0.35,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
      }} />

      {/* Vertical index label — visible when other card is hovered */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        fontFamily: FONT,
        fontSize: '11px',
        letterSpacing: '0.12em',
        color: 'rgba(255,255,255,0.55)',
        opacity: anyHovered && !isHovered ? 1 : 0,
        transition: `opacity 0.2s ease ${anyHovered && !isHovered ? '0.15s' : '0s'}`,
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        {globalIndex + 1}
      </div>

      {/* Revealed content on expand */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '20px 18px',
        opacity: isHovered ? 1 : 0,
        transform: isHovered ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 0.22s ease ${isHovered ? '0.2s' : '0s'}, transform 0.22s ease ${isHovered ? '0.2s' : '0s'}`,
        pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily: FONT,
          fontSize: '12px',
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.06em',
        }}>
          <span style={{ color: '#fff', fontWeight: 600 }}>{globalIndex + 1}</span>
          {' / '}{total}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ElasticGallery — the full lightbox with elastic flex rows
───────────────────────────────────────────────────────────────── */

function ElasticGallery({
  images,
  onClose,
}: {
  images: string[];
  onClose: () => void;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [entered,    setEntered]    = useState(false);
  const rowsRef = useRef<HTMLDivElement>(null);

  const n = images.length;

  // More cards per row = narrower cards = taller portrait ratio on widescreen.
  // Target: cards should be clearly taller than wide (portrait initial state).
  // Strategy: min 5 per row, keep 2 rows for portrait feel on standard 1080p.
  //   1-5   → 1 row
  //   6-10  → 2 rows of 5 (cards ~384px wide × ~520px tall on 1920px = 0.74:1 portrait)
  //   11-14 → 2 rows of 7
  //   15+   → 3 rows
  const rowCount = n <= 5 ? 1 : n <= 14 ? 2 : 3;
  const perRow   = Math.ceil(n / rowCount);
  const rows: string[][] = [];
  for (let i = 0; i < n; i += perRow) rows.push(images.slice(i, i + perRow));

  // Entrance
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    document.body.style.overflow = 'hidden';
    return () => { cancelAnimationFrame(id); document.body.style.overflow = ''; };
  }, []);

  // Keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#0c0c0c',
      display: 'flex', flexDirection: 'column',
      opacity: entered ? 1 : 0,
      transition: 'opacity 0.28s ease',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', flexShrink: 0,
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(-8px)',
        transition: 'opacity 0.3s ease 0.06s, transform 0.3s ease 0.06s',
      }}>
        <span style={{ fontFamily: FONT, fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
          <span style={{ color: '#fff', fontWeight: 600 }}>{n}</span> fotos
          {hoveredIdx !== null && (
            <span style={{ marginLeft: '10px', color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>
              — pasa el cursor para explorar
            </span>
          )}
        </span>
        <button
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

      {/* Hint — shown only before first hover */}
      {hoveredIdx === null && (
        <div style={{
          position: 'absolute', bottom: '28px', left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: FONT, fontSize: '11px',
          color: 'rgba(255,255,255,0.28)',
          letterSpacing: '0.1em',
          pointerEvents: 'none',
          display: 'flex', alignItems: 'center', gap: '8px',
          opacity: entered ? 1 : 0,
          transition: 'opacity 0.4s ease 0.5s',
        }}>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Pasa el cursor por las fotos
        </div>
      )}

      {/* Elastic flex rows */}
      <div
        ref={rowsRef}
        style={{
          flex: 1, minHeight: 0,
          display: 'flex', flexDirection: 'column',
          gap: '4px',
          padding: '0 16px 16px',
        }}
      >
        {rows.map((rowImages, rowIdx) => {
          const rowStart = rowIdx * perRow;

          // Which global index is hovered in THIS row?
          const hoveredInRow =
            hoveredIdx !== null && hoveredIdx >= rowStart && hoveredIdx < rowStart + rowImages.length
              ? hoveredIdx
              : null;

          return (
            <div
              key={rowIdx}
              style={{
                flex: 1, display: 'flex', gap: '4px', minHeight: 0,
              }}
            >
              {rowImages.map((img, colIdx) => {
                const globalIdx = rowStart + colIdx;
                return (
                  <ElasticCard
                    key={globalIdx}
                    img={img}
                    index={colIdx}
                    total={n}
                    globalIndex={globalIdx}
                    isHovered={hoveredIdx === globalIdx}
                    anyHovered={hoveredInRow !== null}
                    onEnter={() => setHoveredIdx(globalIdx)}
                    onLeave={() => setHoveredIdx(null)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>,
    document.body,
  );
}

/* ─────────────────────────────────────────────────────────────────
   Preview (3 fotos) — entry point en la ficha técnica
───────────────────────────────────────────────────────────────── */

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
        width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        transform: hov ? 'scale(1.04)' : 'scale(1)',
        transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        pointerEvents: 'none',
      }} />
      {overlay && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
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
  const [open,    setOpen]    = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const remaining = images.length - 3;

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '4px',
        height: '420px',
        marginBottom: '24px',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <PreviewCell img={images[0]} alt={title} rowSpan onClick={() => setOpen(true)} />
        <PreviewCell img={images[1] ?? images[0]} alt={`${title} 2`} onClick={() => setOpen(true)} />
        <PreviewCell
          img={images[2] ?? images[0]}
          alt={`${title} 3`}
          onClick={() => setOpen(true)}
          overlay={images.length > 3 ? `+${remaining} fotos` : undefined}
        />
      </div>

      {mounted && open && (
        <ElasticGallery
          images={images}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
