'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/* ─── Constants ────────────────────────────────────────────────── */
const FONT  = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const EASE  = 'cubic-bezier(0.22,1.0,0.36,1.0)';
const GRID_TRANSITION = 'grid-template-columns 0.55s cubic-bezier(0.25,0.46,0.45,0.94), grid-template-rows 0.55s cubic-bezier(0.25,0.46,0.45,0.94)';


/* ─── Types ───────────────────────────────────────────────────── */
export interface PropertyStats {
  bedrooms?: number; bathrooms?: number;
  area?: string; price?: string; parking?: number;
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
function BentoGallery({ images, onClose }: { images: string[]; onClose: () => void }) {
  const [hoveredIdx,     setHoveredIdx]     = useState<number | null>(null);
  const [selectedIdx,    setSelectedIdx]    = useState<number | null>(null);
  const [activeAlbum,    setActiveAlbum]    = useState(0);
  const [panelOpen,      setPanelOpen]      = useState(false);
  const [isMobile,       setIsMobile]       = useState(false);
  /* true = landscape, false = portrait/square — indexed over ALL images */
  const [allOrientations, setAllOrientations] = useState<boolean[]>([]);

  const carouselRef  = useRef<HTMLDivElement>(null);
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
      setPanelOpen(prev => !prev); // mismo álbum → toggle panel
    } else {
      setActiveAlbum(idx);
      setPanelOpen(true);          // álbum nuevo → abrir panel
      setSelectedIdx(null);
      setHoveredIdx(null);
    }
  }, [activeAlbum]);

  /* Columnas y filas dinámicas según cantidad de imágenes del álbum activo */
  const cols = computeCols(albumImages.length);
  const rows = Math.ceil(albumImages.length / cols);

  /* ¿Es landscape la imagen bajo el cursor? */
  const hoveredIsLandscape = hoveredIdx !== null ? (orientations[hoveredIdx] ?? false) : false;

  const hoveredCol = hoveredIdx !== null ? hoveredIdx % cols : null;
  const isHovering = hoveredIdx !== null;

  const gridCols = buildCols(hoveredCol, hoveredIsLandscape, cols);
  const gridRows = `repeat(${rows}, 1fr)`;

  /* ── Última fila incompleta: qué imagen hace span extra ──────── */
  const fillerCount  = albumImages.length % cols !== 0 ? cols - (albumImages.length % cols) : 0;
  const lastRowStart = fillerCount > 0 ? (rows - 1) * cols : -1;
  /* Preferir imagen landscape del último row; si no, la última imagen */
  let spanIdx = -1;
  if (fillerCount > 0) {
    for (let i = lastRowStart; i < albumImages.length; i++) {
      if (orientations[i] === true) { spanIdx = i; break; }
    }
    if (spanIdx === -1) spanIdx = albumImages.length - 1;
  }

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
      /* Orientación desde Map ref (evita EXIF-preload bug + onLoad-cache bug).
       * Si la URL no está en el mapa, leer del img renderizado en DOM.
       * naturalWidth/Height del img real siempre refleja la rotación EXIF aplicada. */
      const src   = albumImages[idx] ?? '';
      if (!orientMap.current.has(src)) {
        const imgEl = cell.querySelector('img') as HTMLImageElement | null;
        if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
          orientMap.current.set(src, imgEl.naturalWidth > imgEl.naturalHeight);
        }
      }
      const isLandscape = orientMap.current.get(src) ?? false;
      const gIdx = albumStartIdx + idx;
      /* React 18 batchea ambos setState → un solo render, sin parpadeo */
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
            <div key={idx} style={{ aspectRatio: '1', borderRadius: 6, overflow: 'hidden', background: '#1a1a1a' }}>
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

        {/* ── Accordion grid ─────────────────────────────────────── */}
        <div onClick={e => e.stopPropagation()} style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '0 16px 8px' }}>
        <div
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
          {albumImages.map((img, idx) => {
            const isHovered  = hoveredIdx === idx;
            const isSelected = selectedIdx === idx;
            const cellRow    = Math.floor(idx / cols);
            const isLastRow  = fillerCount > 0 && cellRow === rows - 1;
            const posInRow   = isLastRow ? idx - lastRowStart : idx % cols;

            /* ── Columna explícita, ajustada para el span de la última fila ── */
            let gridColValue: string | number;
            if (isLastRow) {
              if (idx === spanIdx) {
                gridColValue = `${posInRow + 1} / ${posInRow + 1 + fillerCount + 1}`;
              } else if (spanIdx !== -1 && idx > spanIdx) {
                gridColValue = posInRow + fillerCount + 1;
              } else {
                gridColValue = posInRow + 1;
              }
            } else {
              gridColValue = posInRow + 1;
            }

            /* Misma columna que el hovered pero no es la celda activa → ocultar */
            const cellCol = idx % cols;
            const sameCol = isHovering && hoveredCol !== null && cellCol === hoveredCol;
            const hideCell = sameCol && !isHovered;
            const opacity  = hideCell ? 0 : (!isHovering ? 1 : isHovered ? 1 : 0.5);

            return (
              <div
                key={idx}
                data-idx={idx}
                onClick={() => handleCellClick(idx)}
                style={{
                  gridColumn: gridColValue,
                  gridRow: isHovering && isHovered ? '1 / -1' : cellRow + 1,
                  zIndex: isHovering && isHovered ? 1 : 0,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 12,
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
        </div>
        </div>{/* end wrapper */}

        {/* ── Zona inferior: panel + pilas ───────────────────────── */}
        {albums.length > 1 ? (
          <div
            onClick={e => e.stopPropagation()}
            style={{ flexShrink: 0, display: 'flex', flexDirection: 'column' }}
          >
            {/* Panel expandible de miniaturas — encima de las pilas */}
            <div
              style={{
                overflow: 'hidden',
                maxHeight: panelOpen ? '110px' : '0px',
                opacity: panelOpen ? 1 : 0,
                transition: `max-height 0.38s ${EASE}, opacity 0.28s ${EASE}`,
              }}
            >
              <div
                className="bento-carousel"
                style={{
                  display: 'flex',
                  gap: 5,
                  padding: '8px 20px 4px',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  height: 96,
                  alignItems: 'center',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none' as React.CSSProperties['msOverflowStyle'],
                }}
              >
                {(albums[activeAlbum] ?? []).map((img, i) => (
                  <div
                    key={i}
                    style={{
                      flexShrink: 0,
                      height: 80,
                      aspectRatio: '4/3',
                      borderRadius: 6,
                      overflow: 'hidden',
                      border: '1.5px solid rgba(255,255,255,0.15)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                      transition: `transform 0.22s ${EASE}`,
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.06)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; }}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${i + 1}`}
                      draggable={false}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Pilas de álbum */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 24, padding: '4px 20px 18px' }}>
              {albums.map((alb, i) => (
                <AlbumStack
                  key={i}
                  album={alb}
                  albumIndex={i}
                  isActive={activeAlbum === i && panelOpen}
                  onClick={() => handleAlbumChange(i)}
                />
              ))}
            </div>
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
export default function PropertyGallery({ images, title, stats: _stats }: PropertyGalleryProps) {
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
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr', gap: 4, height: 420, marginBottom: 24, borderRadius: 8, overflow: 'hidden' }}>
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
      {mounted && open && <BentoGallery images={images} onClose={() => setOpen(false)} />}
    </>
  );
}
