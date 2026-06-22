'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { X } from 'lucide-react';

const FONT     = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', system-ui, sans-serif";
const ELASTIC  = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const EASE_OUT = 'cubic-bezier(0.22, 1.0, 0.36, 1.0)';

export interface PropertyStats {
  bedrooms?: number; bathrooms?: number;
  area?: string; price?: string; parking?: number;
}

interface PropertyGalleryProps {
  images: string[]; title: string; stats?: PropertyStats;
}

/* ─────────────────────────────────────────────────────────────────
   Natural-ratio floating card — portal, position fixed
   Portrait (9:16) → tall card
   Landscape (16:9) → wide card
   No effect on grid layout — siblings compress via elastic flex.
───────────────────────────────────────────────────────────────── */

interface FloatRect { left: number; top: number; width: number; height: number }

function computeFloatRect(anchor: DOMRect, nw: number, nh: number): FloatRect {
  const PAD  = 12;
  const maxW = window.innerWidth  - PAD * 2;
  const maxH = window.innerHeight - PAD * 2;
  const r    = nw / nh;
  let w = Math.min(nw, maxW);
  let h = w / r;
  if (h > maxH) { h = maxH; w = h * r; }
  const cx   = anchor.left + anchor.width  / 2;
  const cy   = anchor.top  + anchor.height / 2;
  let left   = cx - w / 2;
  let top    = cy - h / 2;
  left = Math.max(PAD, Math.min(left, window.innerWidth  - w - PAD));
  top  = Math.max(PAD, Math.min(top,  window.innerHeight - h - PAD));
  return { left, top, width: w, height: h };
}

/* ─────────────────────────────────────────────────────────────────
   ElasticCard
───────────────────────────────────────────────────────────────── */

function ElasticCard({
  img, total, globalIndex,
  isHovered, anyHovered,
  onEnter, onLeave,
}: {
  img: string; total: number; globalIndex: number;
  isHovered: boolean; anyHovered: boolean;
  onEnter: () => void; onLeave: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const floatRef     = useRef<HTMLDivElement | null>(null);
  const imgRef       = useRef<HTMLImageElement>(null);
  const dims         = useRef({ w: 0, h: 0 });
  const [floatRect, setFloatRect] = useState<FloatRect | null>(null);
  const [showFloat, setShowFloat] = useState(false);

  const syncDims = () => {
    const el = imgRef.current;
    if (el?.naturalWidth) dims.current = { w: el.naturalWidth, h: el.naturalHeight };
  };

  useEffect(() => { if (imgRef.current?.complete) syncDims(); }, []);

  const ratio = dims.current.w / (dims.current.h || 1);
  const expandedFlex = ratio >= 1
    ? Math.max(2.5, Math.min(9, ratio * 3.5))
    : 1.2;

  const handleEnter = () => {
    onEnter();
    if (!containerRef.current || !dims.current.w) return;
    const rect = computeFloatRect(
      containerRef.current.getBoundingClientRect(),
      dims.current.w,
      dims.current.h,
    );
    setFloatRect(rect);
    setShowFloat(true);
  };

  const handleLeave = () => {
    onLeave();
    if (!floatRef.current) { setShowFloat(false); setFloatRect(null); return; }
    gsap.to(floatRef.current, {
      opacity: 0, scale: 0.94, duration: 0.15, ease: 'power2.in',
      onComplete: () => { setShowFloat(false); setFloatRect(null); },
    });
  };

  useEffect(() => {
    if (!showFloat || !floatRef.current) return;
    gsap.fromTo(floatRef.current,
      { opacity: 0, scale: 0.88 },
      { opacity: 1, scale: 1, duration: 0.24, ease: 'power2.out' },
    );
  }, [showFloat]);

  const currentFlex = isHovered ? expandedFlex : anyHovered ? 0.35 : 1;

  return (
    <>
      <div
        ref={containerRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          flex: currentFlex,
          transition: `flex 0.48s ${isHovered ? ELASTIC : EASE_OUT}`,
          position: 'relative', overflow: 'hidden',
          cursor: 'zoom-in', borderRadius: '6px',
          background: '#111', minWidth: 0,
        }}
      >
        <img
          ref={imgRef}
          src={img}
          alt={`Foto ${globalIndex + 1}`}
          draggable={false}
          onLoad={syncDims}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            display: 'block',
            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
            transition: `transform 0.55s ${EASE_OUT}`,
            userSelect: 'none',
          }}
        />

        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          opacity: anyHovered && !isHovered ? 1 : 0,
          transition: 'opacity 0.28s ease',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          writingMode: 'vertical-rl',
          fontFamily: FONT, fontSize: '11px', letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.6)',
          opacity: anyHovered && !isHovered ? 1 : 0,
          transition: `opacity 0.2s ease ${anyHovered && !isHovered ? '0.15s' : '0s'}`,
          pointerEvents: 'none', userSelect: 'none',
        }}>
          {globalIndex + 1}
        </div>

        {isHovered && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '20px 18px', pointerEvents: 'none',
          }}>
            <span style={{ fontFamily: FONT, fontSize: '12px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em' }}>
              <span style={{ color: '#fff', fontWeight: 600 }}>{globalIndex + 1}</span>{' / '}{total}
            </span>
          </div>
        )}
      </div>

      {showFloat && floatRect && createPortal(
        <div
          ref={el => { floatRef.current = el; }}
          style={{
            position: 'fixed',
            left: floatRect.left, top: floatRect.top,
            width: floatRect.width, height: floatRect.height,
            zIndex: 1100, borderRadius: '8px', overflow: 'hidden',
            background: '#0c0c0c',
            boxShadow: '0 28px 72px rgba(0,0,0,0.82), 0 4px 16px rgba(0,0,0,0.5)',
            pointerEvents: 'none', willChange: 'transform,opacity',
          }}
        >
          <img src={img} alt="" draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        </div>,
        document.body,
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ElasticGallery
───────────────────────────────────────────────────────────────── */

function ElasticGallery({ images, onClose }: { images: string[]; onClose: () => void }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [entered,    setEntered]    = useState(false);

  const n        = images.length;
  const rowCount = n <= 5 ? 1 : n <= 14 ? 2 : 3;
  const perRow   = Math.ceil(n / rowCount);
  const rows: string[][] = [];
  for (let i = 0; i < n; i += perRow) rows.push(images.slice(i, i + perRow));

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    document.body.style.overflow = 'hidden';
    return () => { cancelAnimationFrame(id); document.body.style.overflow = ''; };
  }, []);

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
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', flexShrink: 0,
        opacity: entered ? 1 : 0,
        transform: entered ? 'none' : 'translateY(-8px)',
        transition: 'opacity 0.3s ease 0.06s, transform 0.3s ease 0.06s',
      }}>
        <span style={{ fontFamily: FONT, fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
          <span style={{ color: '#fff', fontWeight: 600 }}>{n}</span> fotos
        </span>
        <button onClick={onClose} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 34, height: 34, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)', border: 'none',
          cursor: 'pointer', color: '#fff', transition: 'background 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        ><X size={16} /></button>
      </div>

      {hoveredIdx === null && (
        <div style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          fontFamily: FONT, fontSize: '11px', letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.28)',
          display: 'flex', alignItems: 'center', gap: 8,
          opacity: entered ? 1 : 0, transition: 'opacity 0.4s ease 0.5s',
          pointerEvents: 'none',
        }}>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Pasa el cursor por las fotos
        </div>
      )}

      <div style={{
        flex: 1, minHeight: 0,
        display: 'flex', flexDirection: 'column',
        gap: 4, padding: '0 16px 16px',
      }}>
        {rows.map((rowImages, rowIdx) => {
          const rowStart        = rowIdx * perRow;
          const anyHoveredInRow = hoveredIdx !== null
            && Math.floor(hoveredIdx / perRow) === rowIdx;

          return (
            <div key={rowIdx} style={{ flex: 1, display: 'flex', gap: 4, minHeight: 0 }}>
              {rowImages.map((img, colIdx) => {
                const globalIdx = rowStart + colIdx;
                return (
                  <ElasticCard
                    key={globalIdx}
                    img={img} total={n} globalIndex={globalIdx}
                    isHovered={hoveredIdx === globalIdx}
                    anyHovered={anyHoveredInRow}
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
   Preview grid
───────────────────────────────────────────────────────────────── */

function PreviewCell({ img, alt, rowSpan, onClick, overlay }: {
  img: string; alt: string; rowSpan?: boolean; onClick: () => void; overlay?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ gridRow: rowSpan ? '1/3' : undefined, position: 'relative', overflow: 'hidden', cursor: 'pointer', background: '#f0efed' }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <img src={img} alt={alt} draggable={false} style={{
        width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        transform: hov ? 'scale(1.04)' : 'scale(1)',
        transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
        pointerEvents: 'none',
      }} />
      {overlay && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
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
  const [open, setOpen]       = useState(false);
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
          img={images[2] ?? images[0]} alt={`${title} 3`} onClick={() => setOpen(true)}
          overlay={images.length > 3 ? `+${images.length - 3} fotos` : undefined}
        />
      </div>
      {mounted && open && <ElasticGallery images={images} onClose={() => setOpen(false)} />}
    </>
  );
}
