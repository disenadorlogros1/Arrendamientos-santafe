'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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
 * Divide las imágenes en álbumes de 12.
 * Si el último álbum tiene menos de 6 fotos, se redistribuye con el penúltimo.
 */
function computeAlbums(images: string[]): string[][] {
  if (images.length <= 12) return [images];
  const ALBUM_SIZE = 12;
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

function InfoCard({ type, stats, title }: {
  type: 0 | 1 | 2 | 3 | 4;
  stats?: PropertyStats;
  title: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const baseStyle: React.CSSProperties = {
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '18px 16px 16px',
    textDecoration: 'none',
    fontFamily: FONT,
    color: '#fff',
    background: 'linear-gradient(145deg, #1a1a1a 0%, #111 100%)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 0,
    boxSizing: 'border-box',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: `background 0.25s ${EASE}`,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
    marginBottom: 6,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 15, fontWeight: 700, lineHeight: 1.25,
    color: '#fff', marginBottom: 6,
  };

  const bodyStyle: React.CSSProperties = {
    fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.45,
    flexGrow: 1,
  };

  const ctaStyle: React.CSSProperties = {
    marginTop: 12,
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontSize: 12, fontWeight: 700,
    color: '#fff',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: 6,
    padding: '6px 12px',
    textDecoration: 'none',
    letterSpacing: '0.02em',
    flexShrink: 0,
  };

  const iconBox: React.CSSProperties = {
    width: 32, height: 32, borderRadius: 0,
    background: 'rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 10, flexShrink: 0,
  };

  /* ── Card 0: Ubicación / Inversión ── */
  /* Si no hay zona configurada, caer a la card de similares para no enlazar a zona incorrecta */
  const effectiveType = (type === 0 && !stats?.zone) ? 2 : type;
  if (effectiveType === 0) {
    const slug     = stats?.zone ?? '';
    const zoneName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const href     = `/inversionistas/${slug}`;
    return (
      <a href={href} style={baseStyle} onClick={e => e.stopPropagation()}>
        <div style={iconBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
          </svg>
        </div>
        <div>
          <div style={labelStyle}>Zona de inversión</div>
          <div style={titleStyle}>{zoneName}</div>
          <div style={bodyStyle}>Descubre por qué invertir en esta zona es una oportunidad única en el mercado inmobiliario.</div>
        </div>
        <div style={ctaStyle}>Invertir en esta zona &rarr;</div>
      </a>
    );
  }

  /* ── Card 1: Precio y comodidades ── */
  if (effectiveType === 1) {
    const ref = stats?.reference ?? '';
    const msg = encodeURIComponent(`Hola, me interesa la propiedad${ref ? ` ${ref}` : ''} (${title}). ¿Podrían darme más información?`);
    const href = `https://wa.me/${WA_NUM}?text=${msg}`;
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={baseStyle} onClick={e => e.stopPropagation()}>
        <div style={iconBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div>
          <div style={labelStyle}>Precio</div>
          {stats?.price && <div style={titleStyle}>{stats.price}</div>}
          <div style={bodyStyle}>
            {[
              stats?.bedrooms  ? `${stats.bedrooms} hab.`  : null,
              stats?.bathrooms ? `${stats.bathrooms} baños` : null,
              stats?.area      ? stats.area                 : null,
              stats?.parking   ? `${stats.parking} parq.`  : null,
            ].filter(Boolean).join('  ·  ')}
          </div>
        </div>
        <div style={ctaStyle}>Hablar con un asesor &rarr;</div>
      </a>
    );
  }

  /* ── Card 2: Propiedades similares ── */
  if (effectiveType === 2) {
    return (
      <a href="/propiedades" style={baseStyle} onClick={e => e.stopPropagation()}>
        <div style={iconBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        </div>
        <div>
          <div style={labelStyle}>Explora más</div>
          <div style={titleStyle}>Propiedades similares</div>
          <div style={bodyStyle}>Encuentra otras propiedades con características parecidas en nuestra oferta.</div>
        </div>
        <div style={ctaStyle}>Ver propiedades &rarr;</div>
      </a>
    );
  }

  /* ── Card 3: Solicitar visita ── */
  if (effectiveType === 3) {
    const ref = stats?.reference ?? '';
    const msg = encodeURIComponent(
      `Hola, quisiera agendar una visita para la propiedad${ref ? ` ${ref}` : ''} (${title}). ¿Cuándo podría visitarla?`
    );
    const href = `https://wa.me/${WA_NUM}?text=${msg}`;
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={baseStyle} onClick={e => e.stopPropagation()}>
        <div style={iconBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div>
          <div style={labelStyle}>Agenda tu visita</div>
          <div style={titleStyle}>¿Te gustaría conocerla en persona?</div>
          <div style={bodyStyle}>Coordina una visita con nuestros asesores y descubre todos los detalles de esta propiedad.</div>
        </div>
        <div style={ctaStyle}>Agendar visita &rarr;</div>
      </a>
    );
  }

  /* ── Card 4: Compartir propiedad ── */
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const waShareMsg = encodeURIComponent(`Mira esta propiedad: ${title}\n${shareUrl}`);
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
      <div style={iconBox}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      </div>
      <div>
        <div style={labelStyle}>Compartir</div>
        <div style={titleStyle}>Envía esta propiedad</div>
        <div style={bodyStyle}>Comparte los detalles con quien quieras por WhatsApp o copia el enlace.</div>
      </div>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <a
          href={waShareHref} target="_blank" rel="noopener noreferrer"
          style={{ ...ctaStyle, background: 'rgba(37,211,102,0.15)', borderColor: 'rgba(37,211,102,0.35)', color: '#4ade80' }}
          onClick={e => e.stopPropagation()}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.882a.5.5 0 0 0 .614.612l6.101-1.597A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.898 0-3.677-.524-5.198-1.435l-.373-.224-3.862 1.011 1.027-3.752-.243-.385A9.954 9.954 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          Enviar por WhatsApp
        </a>
        <button
          style={{ ...ctaStyle, cursor: 'pointer', border: 'none', background: copied ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)' }}
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              ¡Enlace copiado!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copiar enlace
            </>
          )}
        </button>
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
        color: isActive ? '#111' : '#fff',
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

  /* ── Posición aleatoria de la InfoCard, estable por álbum ────── */
  const injectAt = useMemo(() => {
    const key = `${activeAlbum}-${albumImages.length}`;
    if (!injectPositions.current.has(key)) {
      const totalRows = Math.ceil(albumImages.length / cols);
      /* Elige una fila aleatoria: 0 = primera, totalRows = después de la última */
      const randomRow = Math.floor(Math.random() * (totalRows + 1));
      injectPositions.current.set(key, randomRow * cols);
    }
    return injectPositions.current.get(key)!;
  }, [activeAlbum, albumImages.length, cols]);

  /* Filas = ceil de (imágenes + 1 InfoCard) */
  const rows = Math.ceil((albumImages.length + 1) / cols);

  /* Celdas vacías al final del grid (tras inyectar la InfoCard) */
  const totalCells    = albumImages.length + 1;
  const trailingEmpty = (cols - (totalCells % cols)) % cols;
  const lastImgIdx    = albumImages.length - 1;
  /* ¿El último elemento del grid es la InfoCard? (injectAt >= n → InfoCard va al final) */
  const infoCardIsLast = injectAt >= albumImages.length;

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
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#0c0c0c', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'flex-end', padding: '12px 16px', background: 'linear-gradient(#0c0c0c 70%, transparent)' }}>
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
      <style>{`.bento-carousel::-webkit-scrollbar { display: none; }`}</style>

      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#0c0c0c', display: 'flex', flexDirection: 'column', cursor: 'default' }}>

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
          {albumImages.map((img, idx) => {
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
                  background: '#111',
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
              cardFinalGc = `${cardCol + 1} / ${cardCol + trailingEmpty + 2}`;
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
      style={{ gridRow: '1/3', position: 'relative', overflow: 'hidden', cursor: 'pointer', background: '#111' }}
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

/* Celda pequeña derecha */
function SmallPreviewCell({ img, alt, onClick, overlay, onHoverIn, onHoverOut }: {
  img: string; alt: string; onClick: () => void; overlay?: string;
  onHoverIn: () => void; onHoverOut: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', background: '#111' }}
      onClick={onClick}
      onMouseEnter={() => { setHov(true);  onHoverIn();  }}
      onMouseLeave={() => { setHov(false); onHoverOut(); }}
    >
      <img src={img} alt={alt} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hov ? 'scale(1.04)' : 'scale(1)', transition: `transform 0.55s ${EASE}`, pointerEvents: 'none' }} />
      {overlay && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: '0.02em' }}>{overlay}</span>
        </div>
      )}
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
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr', gap: 4, height: 'clamp(220px, 45vw, 420px)', marginBottom: 24, borderRadius: 8, overflow: 'hidden' }}>
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
          overlay={images.length > 3 ? `+${images.length - 3} fotos` : undefined}
        />
      </div>
      {mounted && open && <BentoGallery images={images} onClose={() => setOpen(false)} stats={stats} title={title} />}
    </>
  );
}
