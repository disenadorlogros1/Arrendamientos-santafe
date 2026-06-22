'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { X } from 'lucide-react';

/* ─── Constants ────────────────────────────────────────────────── */
const FONT   = "'Avenir LT Pro 65 Medium','Avenir LT Pro','Avenir',system-ui,sans-serif";
const SPRING = 'cubic-bezier(0.34,1.56,0.64,1)'; // overshoot spring
const EASE   = 'cubic-bezier(0.22,1.0,0.36,1.0)';

const IMAGES_PER_PAGE = 20;
const COL_BIG   = 4.0;
const COL_SMALL = 0.45;
const ROW_BIG   = 1.55;
const ROW_SMALL = 0.65;

/* ─── Exports ─────────────────────────────────────────────────── */
export interface PropertyStats {
  bedrooms?: number; bathrooms?: number;
  area?: string; price?: string; parking?: number;
}
interface PropertyGalleryProps { images: string[]; title: string; stats?: PropertyStats; }

/* ─── Grid math ───────────────────────────────────────────────── */
function calcCols(n: number): number {
  if (n <= 4) return n;
  // Find best col count so last row is ≥ 50% full
  const max = Math.min(Math.ceil(n / 2), 6);
  for (let c = max; c >= 3; c--) {
    const lastRow = n % c || c;
    if (lastRow / c >= 0.5) return c;
  }
  return 3;
}

function colDefault(cols: number): string {
  return Array.from({ length: cols }, (_, i) => {
    if (i === 0) return '1.8fr';
    if (i === Math.floor(cols / 2)) return '1.35fr';
    return '1fr';
  }).join(' ');
}

function rowDefault(rows: number): string {
  return Array.from({ length: rows }, (_, i) => i === 0 ? '1.35fr' : '1fr').join(' ');
}

function colActive(activeCol: number, cols: number): string {
  return Array.from({ length: cols }, (_, i) =>
    i === activeCol ? `${COL_BIG}fr` : `${COL_SMALL}fr`
  ).join(' ');
}

function rowActive(activeRow: number, rows: number): string {
  return Array.from({ length: rows }, (_, i) =>
    i === activeRow ? `${ROW_BIG}fr` : `${ROW_SMALL}fr`
  ).join(' ');
}

/* ─── BentoGallery ────────────────────────────────────────────── */
function BentoGallery({ images, onClose }: { images: string[]; onClose: () => void }) {
  const [entered,      setEntered]      = useState(false);
  const [hoveredIdx,   setHoveredIdx]   = useState<number | null>(null);
  const [selectedIdx,  setSelectedIdx]  = useState<number | null>(null);
  const [currentPage,  setCurrentPage]  = useState(0);
  const [isMobile,     setIsMobile]     = useState(false);
  const [orientations, setOrientations] = useState<boolean[]>([]); // true = landscape

  const cellRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const animKey     = useRef(0);

  /* Pagination */
  const needsPagination = images.length > 40;
  const totalPages  = needsPagination ? Math.ceil(images.length / IMAGES_PER_PAGE) : 1;
  const pageStart   = currentPage * IMAGES_PER_PAGE;
  const pageImages  = needsPagination
    ? images.slice(pageStart, pageStart + IMAGES_PER_PAGE)
    : images;

  /* Grid dimensions */
  const n    = pageImages.length;
  const COLS = calcCols(n);
  const ROWS = Math.ceil(n / COLS);

  /* Detect image orientations for current page */
  useEffect(() => {
    setOrientations([]);
    Promise.all(
      pageImages.map(src => new Promise<boolean>(resolve => {
        const img = new window.Image();
        img.onload  = () => resolve(img.naturalWidth >= img.naturalHeight); // landscape OR square → wide
        img.onerror = () => resolve(false);
        img.src = src;
      }))
    ).then(setOrientations);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageImages.length]);

  /* Reorder images: landscape → wide positions (col 0 and middle col) */
  const displayOrder = useMemo<number[]>(() => {
    if (orientations.length < n) return Array.from({ length: n }, (_, i) => i);

    const widePos:   number[] = [];
    const narrowPos: number[] = [];
    for (let i = 0; i < n; i++) {
      const col = i % COLS;
      (col === 0 || col === Math.floor(COLS / 2)) ? widePos.push(i) : narrowPos.push(i);
    }

    const landscapes = orientations.flatMap((v, i) => v ? [i] : []);
    const portraits  = orientations.flatMap((v, i) => v ? [] : [i]);

    const result = new Array<number>(n);
    let lIdx = 0, pIdx = 0;
    for (const pos of widePos)   result[pos] = lIdx < landscapes.length ? landscapes[lIdx++] : portraits[pIdx++];
    for (const pos of narrowPos) result[pos] = pIdx < portraits.length  ? portraits[pIdx++]  : landscapes[lIdx++];
    return result;
  }, [orientations, n, COLS]);

  /* Reverse map: original index → display position (for carousel sync) */
  const origToDisplay = useMemo<number[]>(() => {
    const map = new Array<number>(displayOrder.length);
    displayOrder.forEach((orig, disp) => { map[orig] = disp; });
    return map;
  }, [displayOrder]);

  /* Selected image in original order (for carousel highlight) */
  const selectedOrigIdx = selectedIdx !== null ? (displayOrder[selectedIdx] ?? selectedIdx) : null;

  /* Grid always static — cells animate independently via transform */
  const gridCols = colDefault(COLS);
  const gridRows = rowDefault(ROWS);

  /* Per-cell transform: landscape expands wide, portrait expands tall */
  const getCellTransform = (dispIdx: number, isActive: boolean): string => {
    if (!isActive) return 'scale(1)';
    const origIdx     = displayOrder[dispIdx] ?? dispIdx;
    const isLandscape = orientations.length > origIdx ? orientations[origIdx] : false;
    return isLandscape ? 'scaleX(1.18) scaleY(1.06)' : 'scaleX(1.06) scaleY(1.18)';
  };

  /* ── Responsive ─────────────────────────────────────────────── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Lifecycle ──────────────────────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    return () => { cancelAnimationFrame(id); document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  /* ── GSAP staggered entrance ─────────────────────────────────── */
  useEffect(() => {
    if (!entered) return;
    const cells = cellRefs.current.filter(Boolean) as HTMLElement[];
    if (!cells.length) return;
    gsap.fromTo(cells,
      { opacity: 0, scale: 0.86 },
      { opacity: 1, scale: 1, duration: 0.42, ease: 'back.out(1.5)', stagger: 0.038, clearProps: 'transform' }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entered, animKey.current]);

  /* ── Carousel auto-scroll to selected thumbnail ──────────────── */
  useEffect(() => {
    if (selectedOrigIdx === null || !carouselRef.current) return;
    const globalIdx = currentPage * IMAGES_PER_PAGE + selectedOrigIdx;
    const thumb = carouselRef.current.children[globalIdx] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [selectedOrigIdx, currentPage]);

  /* ── Handlers ───────────────────────────────────────────────── */
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setSelectedIdx(null);
    setHoveredIdx(null);
    setOrientations([]);
    animKey.current += 1;
    requestAnimationFrame(() => {
      const cells = cellRefs.current.filter(Boolean) as HTMLElement[];
      if (!cells.length) return;
      gsap.fromTo(cells,
        { opacity: 0, scale: 0.86 },
        { opacity: 1, scale: 1, duration: 0.38, ease: 'back.out(1.4)', stagger: 0.032, clearProps: 'transform' }
      );
    });
  }, []);

  const handleCarouselClick = useCallback((globalOrigIdx: number) => {
    const localOrigIdx = needsPagination ? globalOrigIdx % IMAGES_PER_PAGE : globalOrigIdx;
    const displayIdx = origToDisplay[localOrigIdx] ?? localOrigIdx;
    if (needsPagination) {
      const page = Math.floor(globalOrigIdx / IMAGES_PER_PAGE);
      if (page !== currentPage) handlePageChange(page);
      setTimeout(() => setSelectedIdx(displayIdx), page !== currentPage ? 80 : 0);
    } else {
      setSelectedIdx(prev => prev === displayIdx ? null : displayIdx);
    }
  }, [needsPagination, currentPage, handlePageChange, origToDisplay]);

  const handleCellClick = useCallback((idx: number) => {
    setSelectedIdx(prev => prev === idx ? null : idx);
  }, []);

  /* ── Mobile layout ───────────────────────────────────────────── */
  if (isMobile) {
    return createPortal(
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: '#0c0c0c', overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          display: 'flex', justifyContent: 'flex-end',
          padding: '12px 16px', background: 'linear-gradient(#0c0c0c 70%, transparent)',
        }}>
          <button onClick={onClose} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)', border: 'none',
            cursor: 'pointer', color: '#fff',
          }}>
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 3, padding: '0 3px 3px',
        }}>
          {images.map((img, idx) => (
            <div key={idx} style={{ aspectRatio: '1', borderRadius: 6, overflow: 'hidden', background: '#1a1a1a' }}>
              <img src={img} alt={`Foto ${idx + 1}`} draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ))}
        </div>
      </div>,
      document.body
    );
  }

  /* ── Desktop layout ──────────────────────────────────────────── */
  return createPortal(
    <>
      <style>{`.bento-carousel::-webkit-scrollbar { display: none; }`}</style>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: '#0c0c0c',
        display: 'flex', flexDirection: 'column',
        opacity: entered ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }}>

        {/* ── Header ─────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: needsPagination ? 'space-between' : 'flex-end',
          padding: '12px 20px', flexShrink: 0, gap: 12,
        }}>
          {needsPagination && (
            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  style={{
                    padding: '5px 16px', borderRadius: 20,
                    background: i === currentPage ? '#fff' : 'rgba(255,255,255,0.1)',
                    color: i === currentPage ? '#000' : 'rgba(255,255,255,0.7)',
                    border: 'none', cursor: 'pointer',
                    fontFamily: FONT, fontSize: 12, fontWeight: 600,
                    transition: `background 0.2s ${EASE}, color 0.2s ${EASE}`,
                  }}
                >
                  Página {i + 1}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={onClose}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)', border: 'none',
              cursor: 'pointer', color: '#fff',
              transition: `background 0.2s ${EASE}`,
            }}
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── Bento grid ─────────────────────────────────────── */}
        <div style={{
          flex: 1, minHeight: 0,
          display: 'grid',
          gridTemplateColumns: gridCols,
          gridTemplateRows:    gridRows,
          gap: 4,
          padding: '0 16px 8px',
        }}>
          {Array.from({ length: n }, (_, dispIdx) => {
            const origIdx    = displayOrder[dispIdx] ?? dispIdx;
            const img        = pageImages[origIdx];
            const isHov      = hoveredIdx === dispIdx;
            const isSelected = selectedIdx === dispIdx;
            const isActive   = isHov || isSelected;

            const remainder  = n % COLS;
            const isLastCell = dispIdx === n - 1 && remainder !== 0;
            const spanCols   = isLastCell ? (COLS - remainder + 1) : 1;

            return (
              <div
                key={`p${currentPage}-${dispIdx}`}
                ref={el => { cellRefs.current[dispIdx] = el; }}
                onMouseEnter={() => setHoveredIdx(dispIdx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => handleCellClick(dispIdx)}
                style={{
                  position: 'relative', overflow: 'hidden',
                  borderRadius: 8, background: '#1a1a1a',
                  cursor: 'pointer',
                  gridColumn: spanCols > 1 ? `span ${spanCols}` : undefined,
                  outline: isSelected ? '2px solid rgba(255,255,255,0.65)' : '2px solid transparent',
                  outlineOffset: -2,
                  transform: getCellTransform(dispIdx, isActive),
                  transition: `transform 0.42s ${SPRING}, outline-color 0.2s ${EASE}`,
                  zIndex: isActive ? 4 : 1,
                }}
              >
                <img
                  src={img}
                  alt={`Foto ${origIdx + 1}`}
                  draggable={false}
                  style={{
                    width: '100%', height: '100%', display: 'block',
                    objectFit: 'cover', objectPosition: 'center',
                    transform: 'scale(1)',
                    userSelect: 'none', pointerEvents: 'none',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* ── Carousel ───────────────────────────────────────── */}
        <div style={{ height: '10vh', minHeight: 60, maxHeight: 90, flexShrink: 0, display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
        <div
          ref={carouselRef}
          className="bento-carousel"
          style={{
            height: '100%',
            overflowX: 'auto', overflowY: 'hidden',
            display: 'flex', alignItems: 'center',
            gap: 4, padding: '4px 16px 8px',
            scrollbarWidth: 'none', msOverflowStyle: 'none' as React.CSSProperties['msOverflowStyle'],
          }}
        >
          {images.map((img, globalIdx) => {
            const isActive = needsPagination
              ? currentPage === Math.floor(globalIdx / IMAGES_PER_PAGE) &&
                selectedOrigIdx === globalIdx % IMAGES_PER_PAGE
              : selectedOrigIdx === globalIdx;
            return (
              <div
                key={globalIdx}
                onClick={() => handleCarouselClick(globalIdx)}
                style={{
                  flexShrink: 0,
                  height: '100%',
                  aspectRatio: '4/3',
                  borderRadius: 5, overflow: 'hidden',
                  cursor: 'pointer',
                  outline: isActive ? '2px solid #fff' : '2px solid transparent',
                  outlineOffset: -2,
                  opacity: isActive ? 1 : 0.55,
                  transform: isActive ? 'scale(1.06)' : 'scale(1)',
                  transition: `opacity 0.2s ${EASE}, transform 0.2s ${EASE}, outline-color 0.2s ${EASE}`,
                }}
              >
                <img
                  src={img}
                  alt={`Miniatura ${globalIdx + 1}`}
                  draggable={false}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            );
          })}
        </div>
        </div>{/* end carousel wrapper */}

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
      style={{
        gridRow: rowSpan ? '1/3' : undefined,
        position: 'relative', overflow: 'hidden',
        cursor: 'pointer', background: '#f0efed',
      }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <img src={img} alt={alt} draggable={false} style={{
        width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        transform: hov ? 'scale(1.04)' : 'scale(1)',
        transition: `transform 0.5s ${EASE}`,
        pointerEvents: 'none',
      }} />
      {overlay && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: '0.02em' }}>
            {overlay}
          </span>
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
      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr',
        gap: 4, height: 420, marginBottom: 24, borderRadius: 8, overflow: 'hidden',
      }}>
        <PreviewCell img={images[0]} alt={title} rowSpan onClick={() => setOpen(true)} />
        <PreviewCell img={images[1] ?? images[0]} alt={`${title} 2`} onClick={() => setOpen(true)} />
        <PreviewCell
          img={images[2] ?? images[0]} alt={`${title} 3`}
          onClick={() => setOpen(true)}
          overlay={images.length > 3 ? `+${images.length - 3} fotos` : undefined}
        />
      </div>
      {mounted && open && <BentoGallery images={images} onClose={() => setOpen(false)} />}
    </>
  );
}
