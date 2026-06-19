'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion';
import { X } from 'lucide-react';

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

const SCENE_BG = [RED, '#1a1a1a', '#262626', RED, '#1a1a1a'];

const STAT_FNS: Array<(s?: PropertyStats) => { label: string; value: string }> = [
  s => ({ label: 'HABITACIONES', value: s?.bedrooms != null ? String(s.bedrooms) : '—' }),
  s => ({ label: 'BAÑOS',        value: s?.bathrooms != null ? String(s.bathrooms) : '—' }),
  s => ({ label: 'ÁREA',         value: s?.area ?? '—' }),
  s => ({ label: 'PARQUEADERO',  value: s?.parking != null ? String(s.parking) : '—' }),
];

/* ── BentoScene ──────────────────────────────────────────────── */

function BentoScene({
  photos,
  label,
  value,
  blockBg,
  scrollerRef,
  onVisible,
  photoIdx,
}: {
  photos: [string, string | null];
  label: string;
  value: string;
  blockBg: string;
  scrollerRef: React.RefObject<HTMLDivElement | null>;
  onVisible: (i: number) => void;
  photoIdx: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hasSecond = photos[1] !== null;
  const photo2 = photos[1] ?? photos[0];

  const { scrollYProgress } = useScroll({
    target: wrapRef as React.RefObject<HTMLDivElement>,
    container: scrollerRef as React.RefObject<HTMLDivElement>,
    offset: ['start start', 'end end'],
  });

  /* Right column: small photo + color block shrink and fade */
  const rightOpacity = useTransform(scrollYProgress, [0, 0.38], [1, 0]);
  const rightScale   = useTransform(scrollYProgress, [0, 0.38], [1, 0.84]);

  /* Expanding overlay: clip from right column position → full width */
  const clipPct  = useTransform(scrollYProgress, [0.08, 0.70], [66.67, 0]);
  const clipPath = useTransform(clipPct, v => `inset(0% 0% 0% ${v}%)`);

  /* Overlay opacity */
  const overlayOpacity = useTransform(scrollYProgress, [0.05, 0.28], [0, 1]);

  /* Large stat text on expanded photo */
  const textOpacity = useTransform(scrollYProgress, [0.50, 0.78], [0, 1]);

  /* Main large photo fades near end, transitioning to next scene */
  const mainOpacity = useTransform(scrollYProgress, [0.78, 0.96], [1, 0]);

  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (v > 0.05 && v < 0.95) onVisible(photoIdx);
  });

  return (
    <div ref={wrapRef} style={{ height: '200vh', position: 'relative' }}>
      <div style={{
        position: 'sticky',
        top: 0,
        height: '80vh',
        overflow: 'hidden',
        background: '#0a0a0a',
      }}>
        {/* Bento grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: hasSecond ? '2fr 1fr' : '1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '4px',
        }}>
          {/* Large photo — spans both rows */}
          <motion.div style={{ gridRow: '1 / 3', overflow: 'hidden', opacity: mainOpacity }}>
            <img
              src={photos[0]}
              alt=""
              draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </motion.div>

          {hasSecond && (
            <>
              {/* Small photo — top right */}
              <motion.div style={{ overflow: 'hidden', opacity: rightOpacity, scale: rightScale }}>
                <img
                  src={photo2}
                  alt=""
                  draggable={false}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </motion.div>

              {/* Color block — bottom right */}
              <motion.div style={{
                background: blockBg,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
                padding: '20px 24px',
                overflow: 'hidden',
                opacity: rightOpacity,
                scale: rightScale,
              }}>
                <span style={{
                  fontFamily: FONT,
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.14em',
                  display: 'block',
                  marginBottom: '6px',
                }}>
                  {label}
                </span>
                <span style={{
                  fontFamily: FONT,
                  fontSize: 'clamp(26px, 3.8vw, 46px)',
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1,
                  display: 'block',
                }}>
                  {value}
                </span>
              </motion.div>
            </>
          )}
        </div>

        {/* Expanding overlay — clip-path grows from right column to full width */}
        {hasSecond && (
          <motion.div style={{
            position: 'absolute',
            inset: 0,
            clipPath,
            opacity: overlayOpacity,
            pointerEvents: 'none',
          }}>
            <img
              src={photo2}
              alt=""
              draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Gradient for readability */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 52%)',
            }} />
            {/* Big stat typography */}
            <motion.div style={{
              position: 'absolute',
              bottom: '48px',
              left: '40px',
              right: '40px',
              opacity: textOpacity,
            }}>
              <span style={{
                fontFamily: FONT,
                fontSize: '10px',
                color: 'rgba(255,255,255,0.42)',
                letterSpacing: '0.15em',
                display: 'block',
                marginBottom: '10px',
              }}>
                {label}
              </span>
              <span style={{
                fontFamily: FONT,
                fontSize: 'clamp(50px, 9vw, 88px)',
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1,
                display: 'block',
              }}>
                {value}
              </span>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ── BentoLightbox ───────────────────────────────────────────── */

function BentoLightbox({ images, stats, startIndex, onClose }: {
  images: string[];
  stats?: PropertyStats;
  startIndex: number;
  onClose: () => void;
}) {
  const [activeIdx, setActiveIdx] = useState(startIndex);
  const [entered, setEntered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Fade-in on open */
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setEntered(true))
    );
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = '';
    };
  }, []);

  /* Esc to close */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  /* Jump to the scene that contains startIndex on open */
  useEffect(() => {
    if (!entered || !scrollRef.current) return;
    const sceneIdx = Math.floor(startIndex / 2);
    if (sceneIdx === 0) return;
    setTimeout(() => {
      const els = scrollRef.current!.querySelectorAll<HTMLElement>('[data-bento-scene]');
      els[sceneIdx]?.scrollIntoView({ block: 'start' });
    }, 120);
  }, [entered, startIndex]);

  type SceneItem = { photos: [string, string | null]; label: string; value: string; blockBg: string; photoIdx: number };
  /* Build scenes: groups of 2 images */
  const scenes: SceneItem[] = [];
  for (let i = 0; i < images.length; i += 2) {
    const si = scenes.length;
    const sv = STAT_FNS[si % STAT_FNS.length](stats);
    scenes.push({
      photos: [images[i], images[i + 1] ?? null] as [string, string | null],
      label:   sv.label,
      value:   sv.value,
      blockBg: SCENE_BG[si % SCENE_BG.length],
      photoIdx: i,
    });
  }

  const scrollToScene = (imgIdx: number) => {
    setActiveIdx(imgIdx);
    const sceneIdx = Math.floor(imgIdx / 2);
    const els = scrollRef.current?.querySelectorAll<HTMLElement>('[data-bento-scene]');
    els?.[sceneIdx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#0a0a0a',
      display: 'flex', flexDirection: 'column',
      opacity: entered ? 1 : 0,
      transition: 'opacity 0.28s ease',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        flexShrink: 0,
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'opacity 0.35s ease 0.06s, transform 0.35s ease 0.06s',
      }}>
        <span style={{ fontFamily: FONT, fontSize: '13px', color: 'rgba(255,255,255,0.32)' }}>
          <span style={{ color: '#fff', fontWeight: 600 }}>{activeIdx + 1}</span>
          {' / '}{images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)', border: 'none',
            cursor: 'pointer', color: '#fff',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >
          <X size={16} />
        </button>
      </div>

      {/* Scroll zone — Bento scenes */}
      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: 'scroll', minHeight: 0 }}
      >
        {scenes.map((s, i) => (
          <div key={i} data-bento-scene={i}>
            <BentoScene
              photos={s.photos}
              label={s.label}
              value={s.value}
              blockBg={s.blockBg}
              scrollerRef={scrollRef}
              onVisible={setActiveIdx}
              photoIdx={s.photoIdx}
            />
          </div>
        ))}
      </div>

      {/* Thumbnail strip */}
      <div style={{
        height: '76px',
        overflowX: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        padding: '8px 16px',
        background: '#111',
        flexShrink: 0,
        scrollbarWidth: 'none',
      }}>
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToScene(i)}
            style={{
              flexShrink: 0,
              height: '56px',
              aspectRatio: '4/3',
              padding: 0,
              border: `2px solid ${i === activeIdx ? RED : 'transparent'}`,
              cursor: 'pointer',
              overflow: 'hidden',
              background: 'none',
              transition: 'border-color 0.18s',
            }}
          >
            <img
              src={img}
              alt={`Foto ${i + 1}`}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block',
                opacity: i === activeIdx ? 1 : 0.38,
                transition: 'opacity 0.18s',
              }}
            />
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}

/* ── Preview: 1 grande + 2 apiladas ─────────────────────────── */

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
      <img
        src={img} alt={alt} draggable={false}
        style={{
          width: '100%', height: '100%', objectFit: 'contain', display: 'block',
          transform: hov ? 'scale(1.03)' : 'scale(1)',
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

/* ── Export ──────────────────────────────────────────────────── */

export default function PropertyGallery({ images, title, stats }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [startIdx, setStartIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

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
        <BentoLightbox
          images={images}
          stats={stats}
          startIndex={startIdx}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
