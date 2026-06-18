'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Grid2x2 } from 'lucide-react';

const FONT = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', system-ui, sans-serif";
const RED  = '#f32735';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

/* ── Lightbox ──────────────────────────────────────────────────── */

function Lightbox({ images, startIndex, onClose }: {
  images: string[]; startIndex: number; onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const thumbsRef = useRef<HTMLDivElement>(null);

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

  // Scroll active thumbnail into view
  useEffect(() => {
    if (!thumbsRef.current) return;
    const active = thumbsRef.current.querySelector('[data-active="true"]') as HTMLElement;
    active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [idx]);

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.97)',
        display: 'flex', flexDirection: 'column',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px', flexShrink: 0,
      }}>
        <span style={{ fontFamily: FONT, fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
          {idx + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
            color: '#fff', transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
        >
          <X size={18} />
        </button>
      </div>

      {/* Main image area */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', padding: '0 72px',
        minHeight: 0,
      }}>
        {/* Prev arrow */}
        <button
          type="button"
          onClick={prev}
          style={{
            position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer',
            color: '#fff', zIndex: 2, transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
        >
          <ChevronLeft size={24} />
        </button>

        <img
          key={idx}
          src={images[idx]}
          alt={`Foto ${idx + 1}`}
          style={{
            maxWidth: '100%', maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: '4px',
          }}
        />

        {/* Next arrow */}
        <button
          type="button"
          onClick={next}
          style={{
            position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer',
            color: '#fff', zIndex: 2, transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Thumbnails strip */}
      <div
        ref={thumbsRef}
        style={{
          display: 'flex', gap: '6px', padding: '14px 24px', flexShrink: 0,
          overflowX: 'auto', scrollbarWidth: 'thin',
        }}
      >
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            data-active={i === idx ? 'true' : 'false'}
            onClick={() => setIdx(i)}
            style={{
              flexShrink: 0, width: '80px', height: '56px',
              border: i === idx ? `2px solid ${RED}` : '2px solid transparent',
              borderRadius: '4px', overflow: 'hidden', cursor: 'pointer',
              opacity: i === idx ? 1 : 0.5,
              transition: 'opacity 0.2s, border-color 0.2s',
              background: 'none', padding: 0,
            }}
            onMouseEnter={e => { if (i !== idx) e.currentTarget.style.opacity = '0.8'; }}
            onMouseLeave={e => { if (i !== idx) e.currentTarget.style.opacity = '0.5'; }}
          >
            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}

/* ── Grid ──────────────────────────────────────────────────────── */

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [startIdx,     setStartIdx]     = useState(0);
  const [mounted,      setMounted]      = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const open = (i: number) => { setStartIdx(i); setLightboxOpen(true); };

  const remaining = images.length - 5;

  return (
    <>
      {/* ── Grid Trulia-style ─────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '3fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '4px',
        height: '460px',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '8px',
      }}>
        {/* Main large image — spans 2 rows */}
        <Cell img={images[0]} alt={title} rowSpan onClick={() => open(0)} />

        {/* 4 small images */}
        {[1, 2, 3, 4].map((i) => (
          <Cell
            key={i}
            img={images[i] ?? images[0]}
            alt={`${title} ${i + 1}`}
            onClick={() => open(i)}
            overlay={i === 4 && remaining > 0 ? `+${remaining} fotos` : undefined}
          />
        ))}
      </div>

      {/* "Ver todas" button */}
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

      {/* Lightbox (portal) */}
      {mounted && lightboxOpen && (
        <Lightbox images={images} startIndex={startIdx} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
}

/* ── Cell helper ─────────────────────────────────────────────────── */

function Cell({ img, alt, rowSpan, onClick, overlay }: {
  img: string; alt: string; rowSpan?: boolean;
  onClick: () => void; overlay?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        gridRow: rowSpan ? '1 / 3' : undefined,
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={img}
        alt={alt}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.4s ease',
        }}
      />
      {overlay && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: FONT, fontSize: '16px', fontWeight: 600, color: '#fff' }}>
            {overlay}
          </span>
        </div>
      )}
    </div>
  );
}
