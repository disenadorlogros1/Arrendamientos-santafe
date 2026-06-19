'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { X } from 'lucide-react';

const FONT = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', system-ui, sans-serif";

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
   Grid layout engine
───────────────────────────────────────────────────────────────── */

interface CellStyle { gridColumn: string; gridRow: string }
interface GridConfig { templateColumns: string; templateRows: string; cells: CellStyle[] }

function getGridConfig(n: number): GridConfig {
  if (n === 1) return {
    templateColumns: '1fr', templateRows: '1fr',
    cells: [{ gridColumn: '1', gridRow: '1' }],
  };
  if (n === 2) return {
    templateColumns: '1fr 1fr', templateRows: '1fr',
    cells: [{ gridColumn: '1', gridRow: '1' }, { gridColumn: '2', gridRow: '1' }],
  };
  if (n === 3) return {
    templateColumns: '2fr 1fr', templateRows: '1fr 1fr',
    cells: [
      { gridColumn: '1', gridRow: '1 / 3' },
      { gridColumn: '2', gridRow: '1' },
      { gridColumn: '2', gridRow: '2' },
    ],
  };
  if (n === 4) return {
    templateColumns: '2fr 1fr 1fr', templateRows: '1fr 1fr',
    cells: [
      { gridColumn: '1', gridRow: '1 / 3' },
      { gridColumn: '2', gridRow: '1' },
      { gridColumn: '3', gridRow: '1' },
      { gridColumn: '2 / 4', gridRow: '2' },
    ],
  };
  if (n === 5) return {
    templateColumns: '2fr 1fr 1fr', templateRows: '1fr 1fr',
    cells: [
      { gridColumn: '1', gridRow: '1 / 3' },
      { gridColumn: '2', gridRow: '1' },
      { gridColumn: '3', gridRow: '1' },
      { gridColumn: '2', gridRow: '2' },
      { gridColumn: '3', gridRow: '2' },
    ],
  };
  if (n === 6) return {
    templateColumns: '2fr 1fr 1fr', templateRows: '1fr 1fr 1fr',
    cells: [
      { gridColumn: '1 / 3', gridRow: '1 / 3' },
      { gridColumn: '3', gridRow: '1' },
      { gridColumn: '3', gridRow: '2' },
      { gridColumn: '1', gridRow: '3' },
      { gridColumn: '2', gridRow: '3' },
      { gridColumn: '3', gridRow: '3' },
    ],
  };
  // 7+ → 4-column, hero 2×2 top-left
  const COLS = 4;
  const cells: CellStyle[] = [{ gridColumn: '1 / 3', gridRow: '1 / 3' }];
  let r = 1, c = 3;
  for (let i = 1; i < n; i++) {
    cells.push({ gridColumn: String(c), gridRow: String(r) });
    c++;
    if (c > COLS) { c = 1; r++; if (r <= 2 && c <= 2) c = 3; }
  }
  const maxRow = Math.max(...cells.map(cell => {
    const row = cell.gridRow;
    return row.includes('/') ? parseInt(row.split('/')[1].trim()) - 1 : parseInt(row);
  }));
  return {
    templateColumns: '2fr 1fr 1fr 1fr',
    templateRows: `repeat(${maxRow}, 1fr)`,
    cells,
  };
}

/* ─────────────────────────────────────────────────────────────────
   HoverCard — floating card showing photo at native aspect ratio
───────────────────────────────────────────────────────────────── */

interface CardRect { left: number; top: number; width: number; height: number }

function computeCardRect(
  cellRect: DOMRect,
  naturalW: number,
  naturalH: number,
): CardRect {
  const maxW = window.innerWidth  * 0.84;
  const maxH = window.innerHeight * 0.84;
  const ratio = naturalW / (naturalH || 1);

  let w = Math.min(naturalW, maxW);
  let h = w / ratio;
  if (h > maxH) { h = maxH; w = h * ratio; }

  const centerX = cellRect.left + cellRect.width  / 2;
  const centerY = cellRect.top  + cellRect.height / 2;

  let left = centerX - w / 2;
  let top  = centerY - h / 2;
  left = Math.max(12, Math.min(left, window.innerWidth  - w - 12));
  top  = Math.max(12, Math.min(top,  window.innerHeight - h - 12));

  return { left, top, width: w, height: h };
}

/* ─────────────────────────────────────────────────────────────────
   BentoCell — tile with hover-expand to natural aspect ratio
───────────────────────────────────────────────────────────────── */

function BentoCell({
  img,
  cellStyle,
}: {
  img: string;
  cellStyle: CellStyle | undefined;
}) {
  const cellRef    = useRef<HTMLDivElement>(null);
  const imgRef     = useRef<HTMLImageElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);
  const dims       = useRef({ w: 0, h: 0 });
  const [cardRect, setCardRect] = useState<CardRect | null>(null);
  const [mounted,  setMounted]  = useState(false);

  // Read natural dimensions once loaded
  const syncDims = () => {
    const el = imgRef.current;
    if (el && el.naturalWidth > 0) {
      dims.current = { w: el.naturalWidth, h: el.naturalHeight };
    }
  };

  const handleMouseEnter = () => {
    if (!cellRef.current) return;
    syncDims();
    const { w, h } = dims.current;
    if (!w || !h) return;
    const rect = computeCardRect(cellRef.current.getBoundingClientRect(), w, h);
    setCardRect(rect);
    setMounted(true);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) { setCardRect(null); setMounted(false); return; }
    gsap.to(cardRef.current, {
      opacity: 0, scale: 0.94, duration: 0.15, ease: 'power2.in',
      onComplete: () => { setCardRect(null); setMounted(false); },
    });
  };

  // Animate in whenever cardRef mounts
  useEffect(() => {
    if (!mounted || !cardRef.current) return;
    gsap.fromTo(cardRef.current,
      { opacity: 0, scale: 0.90 },
      { opacity: 1, scale: 1,   duration: 0.22, ease: 'power2.out' },
    );
  }, [mounted]);

  return (
    <>
      <div
        ref={cellRef}
        className="bento-cell"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          gridColumn: cellStyle?.gridColumn,
          gridRow:    cellStyle?.gridRow,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'zoom-in',
          borderRadius: '6px',
          background: '#1a1a1a',
        }}
      >
        <img
          ref={imgRef}
          src={img}
          alt=""
          draggable={false}
          onLoad={syncDims}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
            userSelect: 'none',
          }}
        />
      </div>

      {/* Floating card portal */}
      {mounted && cardRect && createPortal(
        <div
          ref={cardRef}
          style={{
            position: 'fixed',
            left: cardRect.left,
            top:  cardRect.top,
            width:  cardRect.width,
            height: cardRect.height,
            zIndex: 1100,
            borderRadius: '8px',
            overflow: 'hidden',
            background: '#0c0c0c',
            boxShadow: '0 28px 72px rgba(0,0,0,0.80), 0 4px 16px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
        >
          <img
            src={img}
            alt=""
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        </div>,
        document.body,
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   BentoGallery — all photos in editorial grid, hover to reveal
───────────────────────────────────────────────────────────────── */

function BentoGallery({
  images,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [entered, setEntered] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const n    = images.length;
  const grid = getGridConfig(n);

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    document.body.style.overflow = 'hidden';
    return () => { cancelAnimationFrame(id); document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (!entered || !gridRef.current) return;
    const cells = gridRef.current.querySelectorAll('.bento-cell');
    gsap.fromTo(cells,
      { opacity: 0, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 0.38, stagger: 0.04, ease: 'power2.out' },
    );
  }, [entered]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const needsScroll = n > 9;

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: '#0c0c0c',
        display: 'flex', flexDirection: 'column',
        opacity: entered ? 1 : 0,
        transition: 'opacity 0.28s ease',
      }}
    >
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

      {/* Bento grid */}
      <div style={{
        flex: 1, minHeight: 0,
        overflowY: needsScroll ? 'auto' : 'hidden',
        padding: '0 16px 16px',
      }}>
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: grid.templateColumns,
            gridTemplateRows: needsScroll ? 'auto' : grid.templateRows,
            gap: '4px',
            height: needsScroll ? 'auto' : '100%',
            ...(needsScroll && { gridAutoRows: '220px' }),
          }}
        >
          {images.map((img, i) => (
            <BentoCell
              key={i}
              img={img}
              cellStyle={grid.cells[i]}
            />
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ─────────────────────────────────────────────────────────────────
   Preview (3 fotos) — entry point en la página de propiedad
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
  const [startIdx] = useState(0);
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
        <BentoGallery
          images={images}
          startIndex={startIdx}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
