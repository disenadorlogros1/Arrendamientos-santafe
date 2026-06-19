'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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

/* ─────────────────────────────────────────────────────────────────
   Grid layout engine
   Returns CSS gridColumn / gridRow for each photo slot.
   Hero (index 0) always gets the most visual weight.
───────────────────────────────────────────────────────────────── */

interface CellStyle { gridColumn: string; gridRow: string }
interface GridConfig { templateColumns: string; templateRows: string; cells: CellStyle[] }

function getGridConfig(n: number): GridConfig {
  if (n === 1) return {
    templateColumns: '1fr',
    templateRows: '1fr',
    cells: [{ gridColumn: '1', gridRow: '1' }],
  };

  if (n === 2) return {
    templateColumns: '1fr 1fr',
    templateRows: '1fr',
    cells: [
      { gridColumn: '1', gridRow: '1' },
      { gridColumn: '2', gridRow: '1' },
    ],
  };

  if (n === 3) return {
    templateColumns: '2fr 1fr',
    templateRows: '1fr 1fr',
    cells: [
      { gridColumn: '1', gridRow: '1 / 3' },   // hero: left column, full height
      { gridColumn: '2', gridRow: '1' },
      { gridColumn: '2', gridRow: '2' },
    ],
  };

  if (n === 4) return {
    templateColumns: '2fr 1fr 1fr',
    templateRows: '1fr 1fr',
    cells: [
      { gridColumn: '1', gridRow: '1 / 3' },   // hero: left column, full height
      { gridColumn: '2', gridRow: '1' },
      { gridColumn: '3', gridRow: '1' },
      { gridColumn: '2 / 4', gridRow: '2' },   // wide bottom-right
    ],
  };

  if (n === 5) return {
    templateColumns: '2fr 1fr 1fr',
    templateRows: '1fr 1fr',
    cells: [
      { gridColumn: '1', gridRow: '1 / 3' },   // hero: left column, full height
      { gridColumn: '2', gridRow: '1' },
      { gridColumn: '3', gridRow: '1' },
      { gridColumn: '2', gridRow: '2' },
      { gridColumn: '3', gridRow: '2' },
    ],
  };

  if (n === 6) return {
    templateColumns: '2fr 1fr 1fr',
    templateRows: '1fr 1fr 1fr',
    cells: [
      { gridColumn: '1 / 3', gridRow: '1 / 3' }, // hero: top-left 2×2
      { gridColumn: '3', gridRow: '1' },
      { gridColumn: '3', gridRow: '2' },
      { gridColumn: '1', gridRow: '3' },
      { gridColumn: '2', gridRow: '3' },
      { gridColumn: '3', gridRow: '3' },
    ],
  };

  // 7+ photos → 4-column layout, hero always top-left 2×2
  const COLS = 4;
  const cells: CellStyle[] = [
    { gridColumn: '1 / 3', gridRow: '1 / 3' },
  ];

  let r = 1, c = 3;
  for (let i = 1; i < n; i++) {
    cells.push({ gridColumn: String(c), gridRow: String(r) });
    c++;
    if (c > COLS) {
      c = 1;
      r++;
      // Skip the 2×2 hero area in rows 1-2, cols 1-2
      if (r <= 2 && c <= 2) c = 3;
    }
  }

  const maxRow = Math.max(...cells.map(cell => {
    const row = cell.gridRow;
    if (row.includes('/')) return parseInt(row.split('/')[1].trim()) - 1;
    return parseInt(row);
  }));

  return {
    templateColumns: '2fr 1fr 1fr 1fr',
    templateRows: `repeat(${maxRow}, 1fr)`,
    cells,
  };
}

/* ─────────────────────────────────────────────────────────────────
   PhotoViewer — fullscreen single photo with arrows + thumbnail strip
───────────────────────────────────────────────────────────────── */

function PhotoViewer({
  images,
  index,
  onClose,
  onBack,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onBack: () => void;
}) {
  const [current, setCurrent] = useState(index);
  const [transitioning, setTransitioning] = useState(false);
  const imgRef       = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRef     = useRef<HTMLDivElement>(null);

  // Entrance
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }
    );
  }, []);

  // Scroll active thumbnail into view
  useEffect(() => {
    const strip = thumbRef.current;
    if (!strip) return;
    const active = strip.children[current] as HTMLElement;
    if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [current]);

  const navigate = useCallback((dir: -1 | 1) => {
    if (transitioning) return;
    const next = (current + dir + images.length) % images.length;
    if (!imgRef.current) { setCurrent(next); return; }
    setTransitioning(true);
    gsap.to(imgRef.current, {
      opacity: 0, x: dir * -24, duration: 0.16, ease: 'power2.in',
      onComplete: () => {
        setCurrent(next);
        gsap.fromTo(imgRef.current!,
          { opacity: 0, x: dir * 24 },
          { opacity: 1, x: 0, duration: 0.2, ease: 'power2.out',
            onComplete: () => setTransitioning(false) }
        );
      },
    });
  }, [current, images.length, transitioning]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      { onClose(); return; }
      if (e.key === 'ArrowRight')  navigate(1);
      if (e.key === 'ArrowLeft')   navigate(-1);
      if (e.key === 'Backspace')   onBack();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [navigate, onClose, onBack]);

  return (
    <div ref={containerRef} style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      background: '#000',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', flexShrink: 0, zIndex: 10,
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontFamily: FONT, fontSize: '12px', color: 'rgba(255,255,255,0.5)',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Todas las fotos
        </button>

        <span style={{ fontFamily: FONT, fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
          <span style={{ color: '#fff', fontWeight: 600 }}>{current + 1}</span>
          {' / '}{images.length}
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

      {/* Image area */}
      <div style={{
        flex: 1, position: 'relative', display: 'flex',
        alignItems: 'center', justifyContent: 'center', minHeight: 0,
      }}>
        <img
          ref={imgRef}
          src={images[current]}
          alt={`Foto ${current + 1}`}
          style={{
            maxWidth: '90%', maxHeight: '100%',
            objectFit: 'contain', display: 'block',
            userSelect: 'none', pointerEvents: 'none',
          }}
        />

        {/* Prev arrow */}
        {images.length > 1 && (
          <button
            onClick={() => navigate(-1)}
            style={{
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)', border: 'none',
              cursor: 'pointer', color: '#fff', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.24)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* Next arrow */}
        {images.length > 1 && (
          <button
            onClick={() => navigate(1)}
            style={{
              position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)', border: 'none',
              cursor: 'pointer', color: '#fff', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.24)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      <div
        ref={thumbRef}
        style={{
          height: '80px', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '8px 16px', overflowX: 'auto',
          scrollbarWidth: 'none', background: '#0a0a0a',
        }}
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => {
              if (i === current) return;
              const dir = i > current ? 1 : -1;
              if (!imgRef.current) { setCurrent(i); return; }
              setTransitioning(true);
              gsap.to(imgRef.current, {
                opacity: 0, x: dir * -24, duration: 0.16, ease: 'power2.in',
                onComplete: () => {
                  setCurrent(i);
                  gsap.fromTo(imgRef.current!,
                    { opacity: 0, x: dir * 24 },
                    { opacity: 1, x: 0, duration: 0.2, ease: 'power2.out',
                      onComplete: () => setTransitioning(false) }
                  );
                },
              });
            }}
            style={{
              flexShrink: 0, height: '58px', aspectRatio: '4/3',
              padding: 0, cursor: 'pointer', overflow: 'hidden',
              border: `2px solid ${i === current ? RED : 'transparent'}`,
              borderRadius: '4px', background: 'none',
              transition: 'border-color 0.18s, opacity 0.18s',
              opacity: i === current ? 1 : 0.38,
            }}
          >
            <img
              src={img}
              alt={`Foto ${i + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   BentoGallery — all photos visible simultaneously in editorial grid
───────────────────────────────────────────────────────────────── */

function BentoGallery({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [entered, setEntered] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);
  const n = images.length;
  const grid = getGridConfig(n);

  // Entrance: overlay fade + cell stagger
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
      {
        opacity: 1, scale: 1,
        duration: 0.38, stagger: 0.04,
        ease: 'power2.out',
      }
    );
  }, [entered]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (viewerIndex !== null) setViewerIndex(null); else onClose(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [viewerIndex, onClose]);

  // Open viewer at startIndex if > 0
  useEffect(() => {
    if (entered && startIndex > 0) setViewerIndex(startIndex);
  }, [entered, startIndex]);

  const needsScroll = n > 9;

  return createPortal(
    <div
      ref={overlayRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: '#0c0c0c',
        display: 'flex', flexDirection: 'column',
        opacity: entered ? 1 : 0,
        transition: 'opacity 0.28s ease',
      }}
    >
      {viewerIndex !== null ? (
        <PhotoViewer
          images={images}
          index={viewerIndex}
          onClose={onClose}
          onBack={() => setViewerIndex(null)}
        />
      ) : (
        <>
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
          <div
            style={{
              flex: 1, minHeight: 0,
              overflowY: needsScroll ? 'auto' : 'hidden',
              padding: '0 16px 16px',
            }}
          >
            <div
              ref={gridRef}
              style={{
                display: 'grid',
                gridTemplateColumns: grid.templateColumns,
                gridTemplateRows: needsScroll ? 'auto' : grid.templateRows,
                gap: '4px',
                height: needsScroll ? 'auto' : '100%',
                // For scrollable grids, each row has a fixed height
                ...(needsScroll && {
                  gridAutoRows: '220px',
                }),
              }}
            >
              {images.map((img, i) => (
                <BentoCell
                  key={i}
                  img={img}
                  idx={i}
                  cellStyle={grid.cells[i]}
                  onClick={() => setViewerIndex(i)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>,
    document.body
  );
}

/* ─────────────────────────────────────────────────────────────────
   BentoCell — individual photo tile with hover effects
───────────────────────────────────────────────────────────────── */

function BentoCell({
  img, idx, cellStyle, onClick,
}: {
  img: string;
  idx: number;
  cellStyle: CellStyle | undefined;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="bento-cell"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: cellStyle?.gridColumn,
        gridRow:    cellStyle?.gridRow,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        borderRadius: '6px',
        background: '#1a1a1a',
      }}
    >
      <img
        src={img}
        alt={`Foto ${idx + 1}`}
        draggable={false}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover', display: 'block',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'transform',
        }}
      />
      {/* Hover overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.28)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: hovered ? 'scale(1)' : 'scale(0.7)',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 2h4v4M14 2L9 7M6 14H2v-4M2 14l5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
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
          <span style={{
            fontFamily: FONT, fontSize: '15px', fontWeight: 600, color: '#fff',
            letterSpacing: '0.02em',
          }}>
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
        gap: '4px',
        height: '420px',
        marginBottom: '24px',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <PreviewCell img={images[0]} alt={title} rowSpan onClick={() => openAt(0)} />
        <PreviewCell img={images[1] ?? images[0]} alt={`${title} 2`} onClick={() => openAt(1)} />
        <PreviewCell
          img={images[2] ?? images[0]}
          alt={`${title} 3`}
          onClick={() => openAt(2)}
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
