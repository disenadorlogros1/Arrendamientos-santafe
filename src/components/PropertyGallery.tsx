'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, BedDouble, Bath, Maximize2, Car } from 'lucide-react';
import { useCountAnimation } from '@/hooks/useCountAnimation';

/* ─── Constants ────────────────────────────────────────────────── */
const FONT  = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const EASE  = 'cubic-bezier(0.22,1.0,0.36,1.0)';
const GRID_TRANSITION = 'grid-template-columns 0.55s cubic-bezier(0.25,0.46,0.45,0.94), grid-template-rows 0.55s cubic-bezier(0.25,0.46,0.45,0.94)';


/* ─── Types ───────────────────────────────────────────────────── */
export interface PropertyStats {
  bedrooms?: number; bathrooms?: number;
  area?: string; price?: string; parking?: number;
  /** Slug de la zona de inversión, p.ej. 'laureles', 'el-poblado', 'rionegro' */
  zone?: string;
  /** Código de referencia de la propiedad, p.ej. 'A12594' */
  reference?: string;
}
interface PropertyGalleryProps { images: string[]; title: string; stats?: PropertyStats; }

/*
 * Calcula columnas óptimas para que todas las imágenes quepan en pantalla.
 * Para fotos portrait (9:16) en pantalla 16:9, la celda ideal está ~1.5:1.
 * Fórmula: round(sqrt(n × 1.5)), clampado entre 3 y 6.
 */
function computeCols(n: number): number {
  const ideal = Math.max(3, Math.min(6, Math.round(Math.sqrt(n * 1.5))));
  // Prefer a value that divides n evenly → no empty cells in the last row
  for (let d = 0; d <= 2; d++) {
    for (const c of [ideal, ideal - d, ideal + d]) {
      if (c >= 3 && c <= 6 && n % c === 0) return c;
    }
  }
  return ideal;
}

/*
 * Divide las imágenes en álbumes de 11 (deja 1 slot para la InfoCard en un grid 4×3=12).
 * Si el último álbum tiene menos de 6 fotos, se redistribuye con el penúltimo.
 */
function computeAlbums(images: string[]): string[][] {
  if (images.length <= 11) return [images];
  const ALBUM_SIZE = 11;
  const MIN_LAST   = 6;
  const albums: string[][] = [];
  for (let i = 0; i < images.length; i += ALBUM_SIZE) {
    albums.push(images.slice(i, i + ALBUM_SIZE));
  }
  const last = albums[albums.length - 1];
  if (last.length < MIN_LAST && albums.length >= 2) {
    const penultimate = albums[albums.length - 2];
    const combined    = [...penultimate, ...last];
    const half        = Math.ceil(combined.length / 2);
    albums[albums.length - 2] = combined.slice(0, half);
    albums[albums.length - 1] = combined.slice(half);
  }
  return albums;
}

/* ─── Grid helpers ────────────────────────────────────────────── */
/*
 * En hover la celda activa usa gridRow:1/-1 (span total de filas) para
 * ocupar toda la altura SIN expandir la fila — así las demás celdas del
 * mismo row conservan su altura normal y aparecen pequeñas a los lados.
 *
 * Solo para landscape se expande la columna activa para dar aspecto ancho.
 * Para portrait las columnas son iguales: 1/cols × ancho < alto = portrait.
 */
function buildCols(hoveredCol: number | null, isLandscape: boolean, cols: number): string {
  if (hoveredCol === null || !isLandscape) return `repeat(${cols}, 1fr)`;
  return Array.from({ length: cols }, (_, i) =>
    i === hoveredCol ? '10fr' : '1fr'
  ).join(' ');
}

/* ─── InfoCard — ficha informativa en celda de filler ─────────── */
const WA_NUM = '573006557529';
const RED    = '#f32735';

function applyInkFill(e: React.MouseEvent<HTMLElement>) {
  const el   = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x    = e.clientX - rect.left;
  const y    = e.clientY - rect.top;
  const size = Math.max(
    Math.hypot(x, y), Math.hypot(rect.width - x, y),
    Math.hypot(x, rect.height - y), Math.hypot(rect.width - x, rect.height - y),
  ) * 2;
  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position:absolute; border-radius:50%; pointer-events:none;
    width:${size}px; height:${size}px;
    left:${x}px; top:${y}px;
    transform:translate(-50%,-50%) scale(0);
    background:rgba(0,0,0,0.08);
    animation:gallery-ink 0.6s ease-out forwards;
  `;
  el.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);
}

function InfoCard({ type, stats, title }: {
  type: 0 | 1 | 2 | 3 | 4;
  stats?: PropertyStats;
  title: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const baseStyle: React.CSSProperties = {
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '20px 20px 16px',
    textDecoration: 'none',
    fontFamily: FONT,
    color: '#1a1a1a',
    background: '#fff',
    boxSizing: 'border-box',
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative',
  };

  const bigTitle: React.CSSProperties = {
    fontSize: 39, fontWeight: 800, lineHeight: 1.1,
    color: '#1a1a1a', marginBottom: 10, textAlign: 'center',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: RED, marginBottom: 5,
  };

  const bodyStyle: React.CSSProperties = {
    fontSize: 13, color: 'rgba(0,0,0,0.45)', lineHeight: 1.5, textAlign: 'center',
  };

  const innerWrap: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
    width: '100%', maxWidth: 260,
  };

  const ctaStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '100%',
    padding: '10px 18px',
    background: 'transparent',
    color: RED,
    fontFamily: FONT,
    fontSize: 12, fontWeight: 700,
    borderRadius: 999,
    border: `1px solid ${RED}`,
    textDecoration: 'none',
    letterSpacing: '0.03em',
    cursor: 'pointer',
    flexShrink: 0,
    boxSizing: 'border-box' as const,
    position: 'relative',
    overflow: 'hidden',
    transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
  };

  const effectiveType = (type === 0 && !stats?.zone) ? 2 : type;

  /* ── Card 0: Zona de inversión ── */
  if (effectiveType === 0) {
    const slug     = stats?.zone ?? '';
    const zoneName = slug.charAt(0).toUpperCase() + slug.slice(1) + ' de Medellín';
    const href     = `/inversionistas/${slug}`;
    return (
      <a href={href} style={baseStyle} onClick={e => e.stopPropagation()}>
        <div style={innerWrap}>
          <div style={bigTitle}>¿Buscas una zona para invertir?</div>
          <div style={bodyStyle}>Rentabilidades, valorización y oportunidades en {zoneName} del mercado inmobiliario.</div>
          <div style={{ height: 16 }} />
          <span className="gallery-cta-btn" style={ctaStyle}
            onMouseEnter={applyInkFill} onMouseLeave={applyInkFill}>
            Invertir en esta zona
          </span>
        </div>
      </a>
    );
  }

  /* ── Card 1: WhatsApp / asesor ── */
  if (effectiveType === 1) {
    const ref  = stats?.reference ?? '';
    const msg  = encodeURIComponent(`Hola, me interesa la propiedad${ref ? ` ${ref}` : ''} (${title}). ¿Podrían darme más información?`);
    const href = `https://wa.me/${WA_NUM}?text=${msg}`;
    const iconItems = [
      stats?.bedrooms  ? { icon: <BedDouble  size={20} strokeWidth={1.4} />, value: stats.bedrooms,  label: 'hab.' }  : null,
      stats?.bathrooms ? { icon: <Bath       size={20} strokeWidth={1.4} />, value: stats.bathrooms, label: 'baños' } : null,
      stats?.area      ? { icon: <Maximize2  size={20} strokeWidth={1.4} />, value: stats.area,      label: 'área' }  : null,
      stats?.parking   ? { icon: <Car        size={20} strokeWidth={1.4} />, value: stats.parking,   label: 'parq.' } : null,
    ].filter(Boolean) as { icon: React.ReactNode; value: string | number; label: string }[];
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={baseStyle} onClick={e => e.stopPropagation()}>
        <div style={innerWrap}>
          {stats?.price && (
            <>
              <div style={{ ...labelStyle, textAlign: 'center', marginBottom: 4, textTransform: 'none' }}>Precio de la propiedad</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1, marginBottom: 20, textAlign: 'center', width: '100%' }}>
                {stats.price}
              </div>
            </>
          )}
          {iconItems.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 8px', width: '100%' }}>
              {iconItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'rgba(0,0,0,0.3)', display: 'flex' }}>{item.icon}</span>
                  <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: '#1a1a1a', lineHeight: 1 }}>
                    {item.value} <span style={{ fontWeight: 400, color: 'rgba(0,0,0,0.45)' }}>{item.label}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
          <div style={{ height: 16 }} />
          <span className="gallery-cta-btn" style={ctaStyle}
            onMouseEnter={applyInkFill} onMouseLeave={applyInkFill}>
            Hablar con un asesor
          </span>
        </div>
      </a>
    );
  }

  /* ── Card 2: Ver propiedades ── */
  if (effectiveType === 2) {
    return (
      <a href="/propiedades" style={baseStyle} onClick={e => e.stopPropagation()}>
        <div style={innerWrap}>
          <div style={bigTitle}>Propiedades similares</div>
          <div style={bodyStyle}>Encuentra otras propiedades con características parecidas en nuestra oferta.</div>
          <div style={{ height: 16 }} />
          <span className="gallery-cta-btn" style={ctaStyle}
            onMouseEnter={applyInkFill} onMouseLeave={applyInkFill}>
            Ver propiedades
          </span>
        </div>
      </a>
    );
  }

  /* ── Card 3: Agendar visita ── */
  if (effectiveType === 3) {
    const ref  = stats?.reference ?? '';
    const msg  = encodeURIComponent(`Hola, quisiera agendar una visita para la propiedad${ref ? ` ${ref}` : ''} (${title}). ¿Cuándo podría visitarla?`);
    const href = `https://wa.me/${WA_NUM}?text=${msg}`;
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={baseStyle} onClick={e => e.stopPropagation()}>
        <div style={innerWrap}>
          <div style={bigTitle}>¿Quieres conocer esta propiedad en persona?</div>
          <div style={bodyStyle}>Coordina una visita con nuestros asesores y conoce todos los detalles.</div>
          <div style={{ height: 16 }} />
          <span className="gallery-cta-btn" style={ctaStyle}
            onMouseEnter={applyInkFill} onMouseLeave={applyInkFill}>
            Agendar visita
          </span>
        </div>
      </a>
    );
  }

  /* ── Card 4: Compartir ── */
  const shareUrl    = typeof window !== 'undefined' ? window.location.href : '';
  const waShareMsg  = encodeURIComponent(`Mira esta propiedad: ${title}\n${shareUrl}`);
  const waShareHref = `https://wa.me/?text=${waShareMsg}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={baseStyle} onClick={e => e.stopPropagation()}>
      <div style={innerWrap}>
        <div style={bigTitle}>Envía esta propiedad</div>
        <div style={bodyStyle}>Comparte los detalles con quien quieras por WhatsApp o copia el enlace.</div>
        <div style={{ height: 16 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
        <a href={waShareHref} target="_blank" rel="noopener noreferrer"
          className="gallery-cta-btn" style={ctaStyle}
          onMouseEnter={applyInkFill} onMouseLeave={applyInkFill}
          onClick={e => e.stopPropagation()}>
          Enviar por WhatsApp
        </a>
        <button
          className="gallery-cta-btn"
          style={{ ...ctaStyle, background: copied ? RED : 'transparent', color: copied ? '#fff' : RED }}
          onMouseEnter={applyInkFill} onMouseLeave={applyInkFill}
          onClick={handleCopy}
        >
          {copied ? '¡Enlace copiado!' : 'Copiar enlace'}
        </button>
        </div>
      </div>
    </div>
  );
}

/* ─── AlbumSlot — stack colapsado ↔ thumbnails expandidos ───── */
function AlbumSlot({ album, albumIndex, isExpanded, onToggle, onThumbHover }: {
  album: string[];
  albumIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
  onThumbHover: (idx: number | null) => void;
}) {
  const PHOTO_W    = 46;
  const PHOTO_H    = 62;
  const X_STEP     = 16;
  const SLOT_H     = PHOTO_H + 22;
  const count      = Math.min(3, album.length);
  const collapsedW = PHOTO_W + (count - 1) * X_STEP + 18;
  const THUMB_W    = Math.floor(64 * 4 / 3); // ≈85px — 4:3 a h=64
  const EXPANDED_W = 78 + 5 + album.length * THUMB_W + (album.length - 1) * 5 + 16;

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: SLOT_H,
        width: isExpanded ? EXPANDED_W : collapsedW,
        flexShrink: 0,
        transition: `width 0.45s ${EASE}`,
      }}
    >
      {/* ── Vista comprimida: pila de fotos ── */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: isExpanded ? 0 : 1,
        pointerEvents: isExpanded ? 'none' : 'auto',
        transition: `opacity 0.18s ${EASE}`,
      }}>
        <AlbumStack album={album} albumIndex={albumIndex} isActive={false} onClick={onToggle} />
      </div>

      {/* ── Vista expandida: primera tarjeta = label, resto = thumbnails ── */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: isExpanded ? 1 : 0,
        pointerEvents: isExpanded ? 'auto' : 'none',
        transition: `opacity 0.22s 0.18s ${EASE}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 4px',
      }}>
        <div
          className="bento-carousel"
          style={{
            display: 'flex',
            gap: 5,
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none' as React.CSSProperties['msOverflowStyle'],
            height: 68,
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Tarjeta de título (primera posición) */}
          <div
            onClick={onToggle}
            style={{
              flexShrink: 0,
              height: 64,
              width: 78,
              borderRadius: 6,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.22)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              gap: 3,
            }}
          >
            <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>
              Álbum {albumIndex + 1}
            </span>
            <span style={{ fontFamily: FONT, fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>
              {album.length} fotos
            </span>
          </div>

          {/* Thumbnails de fotos */}
          {album.map((img, i) => (
            <div
              key={i}
              onMouseEnter={e => { onThumbHover(i); (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.07)'; }}
              onMouseLeave={e => { onThumbHover(null); (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; }}
              style={{
                flexShrink: 0,
                height: 64,
                aspectRatio: '4/3',
                borderRadius: 5,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.18)',
                cursor: 'pointer',
                transition: `transform 0.2s ${EASE}`,
              }}
            >
              <img src={img} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── AlbumStack ──────────────────────────────────────────────── */
function AlbumStack({ album, albumIndex, isActive, onClick }: {
  album: string[];
  albumIndex: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  const count  = Math.min(3, album.length);
  const photos = album.slice(0, count);

  /* Fan config: each photo slightly more to the right and more rotated */
  const PHOTO_W = 46;
  const PHOTO_H = 62;
  const X_STEP  = 16; // horizontal offset between photos
  const FAN_ANGLES = [-9, -1, 7];
  const configs = Array.from({ length: count }, (_, i) => ({
    angle:   FAN_ANGLES[FAN_ANGLES.length - count + i],
    xOffset: i * X_STEP,
    zIndex:  i + 1,
  }));

  /* Total width = first photo + each step + some room for rotation overhang */
  const containerW = PHOTO_W + (count - 1) * X_STEP + 18;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        width: containerW,
        height: PHOTO_H + 22,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        flexShrink: 0,
        transform: isActive || hov ? 'translateY(-6px)' : 'none',
        transition: `transform 0.28s ${EASE}`,
      }}
    >
      {/* Foto stack */}
      {photos.map((img, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: PHOTO_W,
            height: PHOTO_H,
            top: 0,
            left: configs[i].xOffset,
            borderRadius: 5,
            overflow: 'hidden',
            transform: `rotate(${configs[i].angle}deg)`,
            transformOrigin: 'bottom center',
            zIndex: configs[i].zIndex,
            border: isActive && i === count - 1
              ? '2px solid rgba(255,255,255,0.9)'
              : '1.5px solid rgba(255,255,255,0.18)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.65)',
            opacity: isActive ? 1 : hov ? 0.85 : 0.6,
            transition: `opacity 0.22s ${EASE}, border-color 0.22s ${EASE}`,
          }}
        >
          <img
            src={img}
            alt=""
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
          />
        </div>
      ))}

      {/* Contador badge */}
      <div style={{
        position: 'absolute',
        top: PHOTO_H - 18,
        right: 0,
        background: isActive ? '#fff' : 'rgba(14,14,14,0.85)',
        color: isActive ? '#1a1a1a' : '#fff',
        fontFamily: FONT,
        fontSize: 10,
        fontWeight: 700,
        padding: '2px 7px',
        borderRadius: 10,
        zIndex: 10,
        border: isActive ? 'none' : '1px solid rgba(255,255,255,0.15)',
        letterSpacing: '0.03em',
        lineHeight: '1.4',
      }}>
        {album.length} →
      </div>

      {/* Etiqueta álbum */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: FONT,
        fontSize: 10,
        fontWeight: isActive ? 700 : 400,
        color: isActive ? '#fff' : 'rgba(255,255,255,0.38)',
        letterSpacing: '0.04em',
        lineHeight: 1,
      }}>
        Álbum {albumIndex + 1}
      </div>
    </button>
  );
}

/* ─── BentoGallery ────────────────────────────────────────────── */
function BentoGallery({ images, onClose, stats, title }: {
  images: string[];
  onClose: () => void;
  stats?: PropertyStats;
  title: string;
}) {
  const [hoveredIdx,     setHoveredIdx]     = useState<number | null>(null);
  const [selectedIdx,    setSelectedIdx]    = useState<number | null>(null);
  const [activeAlbum,    setActiveAlbum]    = useState(0);
  const [panelOpen,      setPanelOpen]      = useState(false);
  const [isMobile,       setIsMobile]       = useState(false);
  /* true = landscape, false = portrait/square — indexed over ALL images */
  const [allOrientations, setAllOrientations] = useState<boolean[]>([]);
  /* Tipo de ficha informativa: se elige aleatoriamente al montar */
  const [infoCardType]   = useState<0 | 1 | 2 | 3 | 4>(() => Math.floor(Math.random() * 5) as 0 | 1 | 2 | 3 | 4);

  /* Columna visual del cursor — solo para posicionar la imagen span en hover */
  const [hoveredMouseCol, setHoveredMouseCol] = useState(0);

  const carouselRef      = useRef<HTMLDivElement>(null);
  const gridRef          = useRef<HTMLDivElement>(null);
  /* Posición de inyección de InfoCard por álbum: key = "albumIdx-length" */
  const injectPositions  = useRef<Map<string, number>>(new Map());
  const clearTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  /* Caché de orientación por URL — persiste entre renders sin causar re-renders.
   * Se llena en el primer hover real (img ya renderizado en DOM, EXIF aplicado).
   * Evita el bug de EXIF-en-preload y el de onLoad-no-dispara-en-caché. */
  const orientMap    = useRef<Map<string, boolean>>(new Map());

  /* ── Álbumes calculados una sola vez ──────────────────────────── */
  const albums = useMemo(() => computeAlbums(images), [images]);
  const albumImages = albums[activeAlbum] ?? [];

  /* Índice global donde empieza el álbum activo */
  const albumStartIdx = useMemo(
    () => albums.slice(0, activeAlbum).reduce((s, a) => s + a.length, 0),
    [albums, activeAlbum]
  );

  /* Orientaciones del álbum activo (slice del array global) */
  const orientations = useMemo(
    () => allOrientations.slice(albumStartIdx, albumStartIdx + albumImages.length),
    [allOrientations, albumStartIdx, albumImages.length]
  );

  /* Orientación se detecta en handleGridMouseMove desde el img renderizado.
   * El preload con new window.Image() se eliminó porque puede leer dims crudas
   * (EXIF no aplicado) y sobreescribir el valor correcto después del primer hover. */

  /* ── Cambio / toggle de álbum ────────────────────────────────── */
  const handleAlbumChange = useCallback((idx: number) => {
    if (idx === activeAlbum) {
      setPanelOpen(prev => !prev);
    } else {
      setActiveAlbum(idx);
      setPanelOpen(true);
      setSelectedIdx(null);
      setHoveredIdx(null);
    }
  }, [activeAlbum]);

  const handlePrevAlbum = useCallback(() => {
    setActiveAlbum(prev => (prev - 1 + albums.length) % albums.length);
    setSelectedIdx(null);
    setHoveredIdx(null);
  }, [albums.length]);

  const handleNextAlbum = useCallback(() => {
    setActiveAlbum(prev => (prev + 1) % albums.length);
    setSelectedIdx(null);
    setHoveredIdx(null);
  }, [albums.length]);

  /* Columnas dinámicas según cantidad de imágenes del álbum activo */
  const cols = computeCols(albumImages.length);
  /* Si las fotos llenan el grid exactamente, quitar la última para que InfoCard no genere fila extra */
  const gridCount  = (albumImages.length % cols === 0 && albumImages.length > 0)
    ? albumImages.length - 1
    : albumImages.length;
  const gridImages = albumImages.slice(0, gridCount);

  /* ── Posición aleatoria de la InfoCard, estable por álbum ────── */
  const injectAt = useMemo(() => {
    const key = `${activeAlbum}-${gridCount}`;
    if (!injectPositions.current.has(key)) {
      const totalRows = Math.ceil(gridCount / cols);
      /* Elige una fila aleatoria: 0 = primera, totalRows = después de la última.
       * Se capea a gridCount para que la InfoCard nunca caiga fuera del grid. */
      const randomRow = Math.floor(Math.random() * (totalRows + 1));
      injectPositions.current.set(key, Math.min(randomRow * cols, gridCount));
    }
    return injectPositions.current.get(key)!;
  }, [activeAlbum, gridCount, cols]);

  /* Filas = ceil de (imágenes en grid + 1 InfoCard) */
  const rows = Math.ceil((gridCount + 1) / cols);

  /* Celdas vacías al final del grid (tras inyectar la InfoCard) */
  const totalCells    = gridCount + 1;
  const trailingEmpty = (cols - (totalCells % cols)) % cols;
  const lastImgIdx    = gridCount - 1;
  /* ¿El último elemento del grid es la InfoCard? (injectAt >= n → InfoCard va al final) */
  const infoCardIsLast = injectAt >= gridCount;

  /* ¿Es landscape la imagen bajo el cursor? */
  const hoveredIsLandscape = hoveredIdx !== null ? (orientations[hoveredIdx] ?? false) : false;

  /* Posición real en el grid del imagen hovered (offset +1 si InfoCard está antes) */
  const hoveredCellPos = hoveredIdx !== null
    ? (hoveredIdx < injectAt ? hoveredIdx : hoveredIdx + 1)
    : null;
  const isHovering = hoveredIdx !== null;

  /* ¿La imagen hovered es la que hace span para cubrir celdas vacías? */
  const hoveredIsSpanning = isHovering && hoveredIdx === lastImgIdx && trailingEmpty > 0 && !infoCardIsLast;

  /* Para la imagen spanning: usar columna del cursor; para las demás: columna de celda */
  const hoveredCol = hoveredCellPos !== null
    ? (hoveredIsSpanning ? hoveredMouseCol : hoveredCellPos % cols)
    : null;

  const gridCols = buildCols(hoveredCol, hoveredIsLandscape, cols);
  const gridRows = `repeat(${rows}, 1fr)`;

  /* Cuando hay hover: redistribuye todas las celdas que NO están en la columna expandida.
   * Las celdas se rellenan de arriba hacia abajo en las (cols-1) columnas restantes,
   * de modo que ninguna imagen queda debajo de la imagen expandida. */
  const cellRedistrMap = useMemo<Map<number, {gc: number; gr: number}>>(() => {
    if (hoveredCol === null) return new Map();
    const nonHovCols = Array.from({length: cols}, (_, i) => i).filter(c => c !== hoveredCol);
    const numNH = nonHovCols.length;
    const map = new Map<number, {gc: number; gr: number}>();
    let rank = 0;
    for (let cellPos = 0; cellPos < rows * cols; cellPos++) {
      if (cellPos % cols !== hoveredCol) {
        map.set(cellPos, {
          gc: nonHovCols[rank % numNH] + 1,
          gr: Math.floor(rank / numNH) + 1,
        });
        rank++;
      }
    }
    return map;
  }, [hoveredCol, cols, rows]);

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

  /* ── Responsive ─────────────────────────────────────────────── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Grid hover via event delegation ────────────────────────── */
  const handleGridMouseMove = useCallback((e: React.MouseEvent) => {
    const cell = (e.target as HTMLElement).closest('[data-idx]') as HTMLElement | null;
    const raw  = cell?.dataset?.idx;
    const idx  = raw !== undefined ? parseInt(raw) : null;
    if (clearTimer.current) { clearTimeout(clearTimer.current); clearTimer.current = null; }
    if (idx !== null && cell) {
      const src = albumImages[idx] ?? '';
      if (!orientMap.current.has(src)) {
        const imgEl = cell.querySelector('img') as HTMLImageElement | null;
        if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
          orientMap.current.set(src, imgEl.naturalWidth > imgEl.naturalHeight);
        }
      }
      const isLandscape = orientMap.current.get(src) ?? false;
      const gIdx = albumStartIdx + idx;

      /* Columna visual del cursor (para posicionar la imagen spanning en hover) */
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        const localCols = computeCols(albumImages.length);
        const mc = Math.max(0, Math.min(localCols - 1,
          Math.floor((e.clientX - rect.left) / (rect.width / localCols))
        ));
        setHoveredMouseCol(mc);
      }

      setAllOrientations(prev => {
        if (prev[gIdx] === isLandscape) return prev;
        const copy = [...prev]; copy[gIdx] = isLandscape; return copy;
      });
      setHoveredIdx(prev => prev === idx ? prev : idx);
    } else {
      clearTimer.current = setTimeout(() => setHoveredIdx(null), 80);
    }
  }, [albumStartIdx, albumImages]);

  const handleGridMouseLeave = useCallback(() => {
    if (clearTimer.current) clearTimeout(clearTimer.current);
    setHoveredIdx(null);
  }, []);

  /* ── Carousel scroll to selected ────────────────────────────── */
  useEffect(() => {
    if (selectedIdx === null || !carouselRef.current) return;
    const thumb = carouselRef.current.children[selectedIdx] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [selectedIdx]);

  const handleCellClick = useCallback((idx: number) => {
    setSelectedIdx(prev => prev === idx ? null : idx);
  }, []);

  /* ── Mobile ──────────────────────────────────────────────────── */
  if (isMobile) {
    return createPortal(
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#1a1a1a', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'flex-end', padding: '12px 16px', background: 'linear-gradient(#1a1a1a 70%, transparent)' }}>
          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', color: '#fff' }}>
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>
        {/* Álbumes en mobile */}
        {albums.length > 1 && (
          <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', flexWrap: 'wrap' }}>
            {albums.map((_, i) => (
              <button
                key={i}
                onClick={() => handleAlbumChange(i)}
                style={{ fontFamily: FONT, fontSize: 12, fontWeight: activeAlbum === i ? 700 : 400, color: activeAlbum === i ? '#fff' : 'rgba(255,255,255,0.5)', background: activeAlbum === i ? 'rgba(255,255,255,0.15)' : 'transparent', border: '1px solid', borderColor: activeAlbum === i ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)', borderRadius: 4, padding: '5px 12px', cursor: 'pointer', transition: `all 0.2s ${EASE}` }}
              >
                Álbum {i + 1}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, padding: '0 3px 3px' }}>
          {albumImages.map((img, idx) => (
            <div key={idx} style={{ aspectRatio: '1', borderRadius: 0, overflow: 'hidden', background: '#1a1a1a' }}>
              <img src={img} alt={`Foto ${idx + 1}`} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ))}
        </div>
      </div>,
      document.body
    );
  }

  /* ── Desktop ─────────────────────────────────────────────────── */
  return createPortal(
    <>
      <style>{`
        .bento-carousel::-webkit-scrollbar { display: none; }
        .gallery-cta-btn { position: relative; overflow: hidden; }
        .gallery-cta-btn:hover { background: #f32735 !important; border-color: #f32735 !important; color: #fff !important; }
        @keyframes gallery-ink {
          from { opacity: 1; transform: translate(-50%, -50%) scale(0); }
          to   { opacity: 0; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>

      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#1a1a1a', display: 'flex', flexDirection: 'column', cursor: 'default' }}>

        {/* Header — clic en área negra cierra (burbujea al contenedor) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '12px 20px', flexShrink: 0 }}>
          <button
            onClick={e => { e.stopPropagation(); onClose(); }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: '#fff', transition: `background 0.2s ${EASE}` }}
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── Accordion grid + flechas de álbum ─────────────────── */}
        <div onClick={e => e.stopPropagation()} style={{ flex: 1, minHeight: 0, position: 'relative' }}>

        {/* Flecha izquierda */}
        {albums.length > 1 && (
          <button
            onClick={e => { e.stopPropagation(); handlePrevAlbum(); }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.45)')}
            style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.18)', cursor: 'pointer', color: '#fff', backdropFilter: 'blur(6px)', transition: `background 0.2s ${EASE}` }}
          >
            <ChevronLeft size={22} strokeWidth={1.8} />
          </button>
        )}

        {/* Flecha derecha */}
        {albums.length > 1 && (
          <button
            onClick={e => { e.stopPropagation(); handleNextAlbum(); }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.45)')}
            style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.18)', cursor: 'pointer', color: '#fff', backdropFilter: 'blur(6px)', transition: `background 0.2s ${EASE}` }}
          >
            <ChevronRight size={22} strokeWidth={1.8} />
          </button>
        )}

        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', padding: '0 16px 8px' }}>
        <div
          ref={gridRef}
          onMouseMove={handleGridMouseMove}
          onMouseLeave={handleGridMouseLeave}
          style={{
            display: 'grid',
            height: '100%',
            gridTemplateColumns: gridCols,
            gridTemplateRows:    gridRows,
            transition: GRID_TRANSITION,
            gap: 4,
          }}
        >
          {/* ── Imágenes: posición explícita offset por la InfoCard ── */}
          {gridImages.map((img, idx) => {
            /* cellPos: posición real en el grid (desplazada +1 si InfoCard está antes) */
            const cp        = idx < injectAt ? idx : idx + 1;
            const normalCol = cp % cols;
            const normalRow = Math.floor(cp / cols);
            const isHovered  = hoveredIdx === idx;
            const isSelected = selectedIdx === idx;

            const isLastImg = idx === lastImgIdx && trailingEmpty > 0 && !infoCardIsLast;
            const sameCol  = isHovering && hoveredCol !== null && normalCol === hoveredCol;
            const hideCell = sameCol && !isHovered;
            const opacity  = hideCell ? 0 : (!isHovering ? 1 : isHovered ? 1 : 0.5);

            /* Posición final: hovered → expande; otras visibles en hover → redistribuyen;
             * última imagen sin hover → span; resto → posición normal. */
            let finalGc: string | number;
            let finalGr: string | number;
            if (isHovered) {
              finalGc = isLastImg ? hoveredMouseCol + 1 : normalCol + 1;
              finalGr = '1 / -1';
            } else if (isHovering && !hideCell && hoveredCol !== null) {
              const rp = cellRedistrMap.get(cp);
              finalGc = rp?.gc ?? normalCol + 1;
              finalGr = rp?.gr ?? normalRow + 1;
            } else if (!isHovering && isLastImg) {
              finalGc = `${normalCol + 1} / ${normalCol + trailingEmpty + 2}`;
              finalGr = normalRow + 1;
            } else {
              finalGc = normalCol + 1;
              finalGr = normalRow + 1;
            }

            return (
              <div
                key={idx}
                data-idx={idx}
                onClick={() => handleCellClick(idx)}
                style={{
                  gridColumn: finalGc,
                  gridRow: finalGr,
                  zIndex: isHovering && isHovered ? 1 : 0,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 0,
                  cursor: 'pointer',
                  background: '#1a1a1a',
                  outline: isSelected ? '2px solid rgba(255,255,255,0.65)' : '2px solid transparent',
                  outlineOffset: -2,
                  opacity,
                  pointerEvents: hideCell ? 'none' : undefined,
                  transition: `opacity 0.35s ${EASE}, outline-color 0.2s ${EASE}`,
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

          {/* ── InfoCard en posición aleatoria ── */}
          {(() => {
            const cardCol = injectAt % cols;
            const cardRow = Math.floor(injectAt / cols);
            const cardInHovCol = isHovering && hoveredCol !== null && cardCol === hoveredCol;
            const cardOpacity = cardInHovCol ? 0 : 1;

            let cardFinalGc: string | number;
            let cardFinalGr: number;
            if (isHovering && !cardInHovCol && hoveredCol !== null) {
              const rp = cellRedistrMap.get(injectAt);
              cardFinalGc = rp?.gc ?? cardCol + 1;
              cardFinalGr = rp?.gr ?? cardRow + 1;
            } else if (!isHovering && infoCardIsLast && trailingEmpty > 0) {
              const maxSpan = Math.min(trailingEmpty + 1, 2);
              cardFinalGc = `${cardCol + 1} / ${cardCol + maxSpan + 1}`;
              cardFinalGr = cardRow + 1;
            } else {
              cardFinalGc = cardCol + 1;
              cardFinalGr = cardRow + 1;
            }

            return (
              <div
                style={{
                  gridColumn: cardFinalGc,
                  gridRow: cardFinalGr,
                  zIndex: 0,
                  overflow: 'hidden',
                  borderRadius: 0,
                  opacity: cardOpacity,
                  transition: `opacity 0.35s ${EASE}`,
                }}
              >
                <InfoCard type={infoCardType} stats={stats} title={title} />
              </div>
            );
          })()}
        </div>
        </div>{/* end grid */}
        </div>{/* end wrapper */}

        {/* ── Barra inferior: álbumes inline (expansión horizontal) ─ */}
        {albums.length > 1 ? (
          <div
            onClick={e => e.stopPropagation()}
            style={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 16,
              padding: '10px 24px 18px',
              background: 'rgba(255,255,255,0.04)',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              overflowX: 'auto',
            }}
          >
            {albums.map((alb, i) => (
              <AlbumSlot
                key={i}
                album={alb}
                albumIndex={i}
                isExpanded={activeAlbum === i && panelOpen}
                onToggle={() => handleAlbumChange(i)}
                onThumbHover={idx => setHoveredIdx(idx)}
              />
            ))}
          </div>
        ) : (
          /* Carrusel original para galerías de ≤ 12 fotos */
          <div onClick={e => e.stopPropagation()} style={{ height: '7vh', minHeight: 48, maxHeight: 68, flexShrink: 0, display: 'flex', justifyContent: 'center', overflow: 'hidden', marginBottom: 10 }}>
            <div
              ref={carouselRef}
              className="bento-carousel"
              style={{ height: '100%', overflowX: 'auto', overflowY: 'hidden', display: 'flex', alignItems: 'center', gap: 3, padding: '3px 16px 6px', scrollbarWidth: 'none', msOverflowStyle: 'none' as React.CSSProperties['msOverflowStyle'] }}
            >
              {albumImages.map((img, idx) => {
                const isActive = hoveredIdx === idx || selectedIdx === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleCellClick(idx)}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    style={{ flexShrink: 0, height: '100%', aspectRatio: '4/3', borderRadius: 4, overflow: 'hidden', cursor: 'pointer', outline: isActive ? '2px solid rgba(255,255,255,0.8)' : '2px solid transparent', outlineOffset: -2, opacity: isActive ? 1 : 0.45, transform: isActive ? 'scale(1.08)' : 'scale(1)', transition: `opacity 0.2s ${EASE}, transform 0.25s ${EASE}, outline-color 0.15s ${EASE}` }}
                  >
                    <img src={img} alt={`Miniatura ${idx + 1}`} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </>,
    document.body
  );
}

/* ─── Preview grid (ficha de propiedad) ───────────────────────── */

/* Celda grande izquierda: crossfade bento cuando cambia la imagen */
function MainPreviewCell({ img, alt, onClick }: { img: string; alt: string; onClick: () => void }) {
  const [base,    setBase]    = useState(img);
  const [incoming, setIncoming] = useState<{ src: string; id: number } | null>(null);
  const [hov,     setHov]     = useState(false);
  const counter = useRef(0);

  useEffect(() => {
    if (img === base) return;
    setIncoming({ src: img, id: ++counter.current });
  }, [img]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{ gridRow: '1/3', position: 'relative', overflow: 'hidden', cursor: 'pointer', background: '#1a1a1a' }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Imagen base siempre visible debajo */}
      <img
        src={base} alt={alt} draggable={false}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', display: 'block', pointerEvents: 'none',
          transform: hov ? 'scale(1.04)' : 'scale(1)',
          transition: `transform 0.6s ${EASE}`,
        }}
      />
      {/* Incoming: se anima encima y al terminar pasa a ser la base */}
      {incoming && (
        <img
          key={incoming.id}
          src={incoming.src} alt={alt} draggable={false}
          onAnimationEnd={() => { setBase(incoming.src); setIncoming(null); }}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', display: 'block', pointerEvents: 'none',
            animation: `bentoReveal 0.42s ${EASE} forwards`,
          }}
        />
      )}
    </div>
  );
}

/* Overlay animado con conteo */
function PhotoCountOverlay({ count }: { count: number }) {
  const { ref, count: displayCount } = useCountAnimation(count, 700);
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <span style={{ fontFamily: FONT, fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
        +{displayCount}
      </span>
      <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.75)', marginTop: 5, letterSpacing: '0.04em' }}>
        fotos
      </span>
    </div>
  );
}

/* Celda pequeña derecha */
function SmallPreviewCell({ img, alt, onClick, overlay, overlayCount, onHoverIn, onHoverOut }: {
  img: string; alt: string; onClick: () => void; overlay?: string; overlayCount?: number;
  onHoverIn: () => void; onHoverOut: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', background: '#1a1a1a' }}
      onClick={onClick}
      onMouseEnter={() => { setHov(true);  onHoverIn();  }}
      onMouseLeave={() => { setHov(false); onHoverOut(); }}
    >
      <img src={img} alt={alt} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hov ? 'scale(1.04)' : 'scale(1)', transition: `transform 0.55s ${EASE}`, pointerEvents: 'none' }} />
      {overlayCount !== undefined ? (
        <PhotoCountOverlay count={overlayCount} />
      ) : overlay ? (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: '0.02em' }}>{overlay}</span>
        </div>
      ) : null}
    </div>
  );
}

/* ─── Export ──────────────────────────────────────────────────── */
export default function PropertyGallery({ images, title, stats }: PropertyGalleryProps) {
  const [open,       setOpen]       = useState(false);
  const [mounted,    setMounted]    = useState(false);
  const [previewIdx, setPreviewIdx] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <style>{`
        @keyframes bentoReveal {
          from { opacity: 0; transform: scale(1.05); }
          to   { opacity: 1; transform: scale(1);    }
        }
      `}</style>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr', gap: 4, height: 'clamp(320px, 52vw, 520px)', marginBottom: 24, borderRadius: 0, overflow: 'hidden' }}>
        <MainPreviewCell
          img={images[previewIdx] ?? images[0]}
          alt={title}
          onClick={() => setOpen(true)}
        />
        <SmallPreviewCell
          img={images[1] ?? images[0]}
          alt={`${title} 2`}
          onClick={() => setOpen(true)}
          onHoverIn={() => setPreviewIdx(1)}
          onHoverOut={() => setPreviewIdx(0)}
        />
        <SmallPreviewCell
          img={images[2] ?? images[0]}
          alt={`${title} 3`}
          onClick={() => setOpen(true)}
          onHoverIn={() => setPreviewIdx(2)}
          onHoverOut={() => setPreviewIdx(0)}
          overlayCount={images.length > 3 ? images.length - 3 : undefined}
        />
      </div>
      {mounted && open && <BentoGallery images={images} onClose={() => setOpen(false)} stats={stats} title={title} />}
    </>
  );
}
