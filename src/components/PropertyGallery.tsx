'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { X } from 'lucide-react';

/* ─── Constants ────────────────────────────────────────────────── */
const FONT   = "'Avenir LT Pro 65 Medium','Avenir LT Pro','Avenir',system-ui,sans-serif";
const SPRING = 'cubic-bezier(0.34,1.56,0.64,1)';
const EASE   = 'cubic-bezier(0.22,1.0,0.36,1.0)';

const IMAGES_PER_PAGE = 20;

/* ─── Types ───────────────────────────────────────────────────── */
export interface PropertyStats {
  bedrooms?: number; bathrooms?: number;
  area?: string; price?: string; parking?: number;
}
interface PropertyGalleryProps { images: string[]; title: string; stats?: PropertyStats; }

/* ─── BentoGallery ────────────────────────────────────────────── */
function BentoGallery({ images, onClose }: { images: string[]; onClose: () => void }) {
  const [hoveredIdx,   setHoveredIdx]   = useState<number | null>(null);
  const [selectedIdx,  setSelectedIdx]  = useState<number | null>(null);
  const [currentPage,  setCurrentPage]  = useState(0);
  const [isMobile,     setIsMobile]     = useState(false);
  const [orientations, setOrientations] = useState<boolean[]>([]); // true = landscape/square
  const [gridReady,    setGridReady]    = useState(false);

  const cellRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  /* Pagination */
  const needsPagination = images.length > IMAGES_PER_PAGE;
  const totalPages  = needsPagination ? Math.ceil(images.length / IMAGES_PER_PAGE) : 1;
  const pageStart   = currentPage * IMAGES_PER_PAGE;
  const pageImages  = needsPagination ? images.slice(pageStart, pageStart + IMAGES_PER_PAGE) : images;

  /* ── Detect orientations for current page ───────────────────── */
  useEffect(() => {
    setGridReady(false);
    setOrientations([]);
    cellRefs.current = [];

    Promise.all(
      pageImages.map(src => new Promise<boolean>(resolve => {
        const img = new window.Image();
        const done = () => resolve(img.naturalWidth >= img.naturalHeight);
        img.onload  = done;
        img.onerror = () => resolve(false);
        img.src = src;
        // Already cached
        if (img.complete && img.naturalWidth > 0) done();
      }))
    ).then(result => {
      setOrientations(result);
      setGridReady(true);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

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

  /* ── GSAP entrance when grid is ready ───────────────────────── */
  useEffect(() => {
    if (!gridReady) return;
    const cells = cellRefs.current.filter(Boolean) as HTMLElement[];
    if (!cells.length) return;
    gsap.killTweensOf(cells);
    gsap.fromTo(cells,
      { opacity: 0, scale: 0.86 },
      { opacity: 1, scale: 1, duration: 0.42, ease: 'back.out(1.5)', stagger: 0.038, clearProps: 'transform,opacity' }
    );
  }, [gridReady, currentPage]);

  /* ── Responsive ─────────────────────────────────────────────── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Carousel: scroll to selected thumbnail ─────────────────── */
  useEffect(() => {
    if (selectedIdx === null || !carouselRef.current) return;
    const globalIdx = currentPage * IMAGES_PER_PAGE + selectedIdx;
    const thumb = carouselRef.current.children[globalIdx] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [selectedIdx, currentPage]);

  /* ── Handlers ───────────────────────────────────────────────── */
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setSelectedIdx(null);
    setHoveredIdx(null);
  }, []);

  const handleCarouselClick = useCallback((globalIdx: number) => {
    if (needsPagination) {
      const page       = Math.floor(globalIdx / IMAGES_PER_PAGE);
      const idxInPage  = globalIdx % IMAGES_PER_PAGE;
      if (page !== currentPage) handlePageChange(page);
      setTimeout(() => setSelectedIdx(idxInPage), page !== currentPage ? 80 : 0);
    } else {
      setSelectedIdx(prev => prev === globalIdx ? null : globalIdx);
    }
  }, [needsPagination, currentPage, handlePageChange]);

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
          padding: '12px 16px',
          background: 'linear-gradient(#0c0c0c 70%, transparent)',
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
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridAutoFlow: 'dense',
          gridAutoRows: 'clamp(100px, 40vw, 180px)',
          gap: 3, padding: '0 3px 3px',
        }}>
          {images.map((img, idx) => (
            <div key={idx} style={{ borderRadius: 6, overflow: 'hidden', background: '#1a1a1a' }}>
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
        opacity: gridReady ? 1 : 0,
        transition: 'opacity 0.18s ease',
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
                <button key={i} onClick={() => handlePageChange(i)} style={{
                  padding: '5px 16px', borderRadius: 20,
                  background: i === currentPage ? '#fff' : 'rgba(255,255,255,0.1)',
                  color: i === currentPage ? '#000' : 'rgba(255,255,255,0.7)',
                  border: 'none', cursor: 'pointer',
                  fontFamily: FONT, fontSize: 12, fontWeight: 600,
                  transition: `background 0.2s ${EASE}, color 0.2s ${EASE}`,
                }}>
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
        {/*
          grid-auto-flow: dense fills gaps automatically.
          Landscape (span 2) and portrait (span 1) let CSS pack rows without black holes.
          Hover uses transform only — grid layout never changes.
        */}
        <div style={{
          flex: 1, minHeight: 0, overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridAutoFlow: 'dense',
          gridAutoRows: 'clamp(130px, 18vw, 210px)',
          alignContent: 'start',
          gap: 4,
          padding: '0 16px 8px',
        }}>
          {pageImages.map((img, idx) => {
            const landscape  = orientations[idx] ?? false;
            const isHov      = hoveredIdx === idx;
            const isSelected = selectedIdx === idx;
            const isActive   = isHov || isSelected;
            const anyHovered = hoveredIdx !== null;

            /* Active cell grows to its natural ratio, others shrink */
            const transform = isActive
              ? (landscape ? 'scaleX(1.2) scaleY(1.06)' : 'scaleX(1.06) scaleY(1.2)')
              : (anyHovered ? 'scale(0.88)' : 'scale(1)');

            return (
              <div
                key={`p${currentPage}-${idx}`}
                ref={el => { cellRefs.current[idx] = el; }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setSelectedIdx(prev => prev === idx ? null : idx)}
                style={{
                  position: 'relative', overflow: 'hidden',
                  borderRadius: 8, background: '#1a1a1a',
                  cursor: 'pointer',
                  /* Landscape fills a wide slot, portrait a narrow one */
                  gridColumn: landscape ? 'span 2' : 'span 1',
                  outline: isSelected ? '2px solid rgba(255,255,255,0.65)' : '2px solid transparent',
                  outlineOffset: -2,
                  transform,
                  transition: `transform 0.38s ${SPRING}, outline-color 0.2s ${EASE}`,
                  zIndex: isActive ? 4 : 1,
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
              scrollbarWidth: 'none',
              msOverflowStyle: 'none' as React.CSSProperties['msOverflowStyle'],
            }}
          >
            {images.map((img, globalIdx) => {
              const isActive = needsPagination
                ? currentPage === Math.floor(globalIdx / IMAGES_PER_PAGE) &&
                  selectedIdx === globalIdx % IMAGES_PER_PAGE
                : selectedIdx === globalIdx;
              return (
                <div
                  key={globalIdx}
                  onClick={() => handleCarouselClick(globalIdx)}
                  style={{
                    flexShrink: 0, height: '100%', aspectRatio: '4/3',
                    borderRadius: 5, overflow: 'hidden', cursor: 'pointer',
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
