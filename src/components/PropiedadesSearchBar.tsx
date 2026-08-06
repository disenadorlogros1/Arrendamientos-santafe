'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

/* ── Datos ─────────────────────────────────────────────────────────── */

const SECTORES = [
  'Amaga', 'Barbosa', 'Bello', 'Copacabana', 'Envigado', 'Guarne', 'Guatapé', 'Itagüí',
  'La Ceja', 'La Estrella', 'Marinilla', 'Rionegro', 'Sabaneta', 'Sopetran',
  'Aranjuez', 'Barrio Colombia', 'Barrio Córdoba', 'Barrio Cristóbal', 'Barrio Girardot',
  'Barrio Santa Fe', 'Barrio Trinidad', 'Belén', 'Belencito', 'Boston', 'Boyacá',
  'Las Brisas', 'Buenos Aires', 'Caicedo', 'Calasanz', 'Caldas', 'Campo Amor',
  'Campo Valdés', 'Caribe', 'Castellana', 'Castilla', 'Centro', 'Cerca Éxito de Colombia',
  'Conquistadores', 'Cristo Rey', 'Doce de Octubre', 'El Carmen', 'Enciso', 'Estadio',
  'Fátima', 'Florencia', 'Floresta', 'Florida Nueva', 'Francisco Antonio Zea', 'Girardota',
  'Guayabal', 'La América', 'Llanogrande', 'López de Mesa', 'Loreto', 'Los Colores',
  'Los Olivos', 'Lourdes', 'Malibu', 'Manrique', 'Mayorca', 'Milagrosa', 'Naranjal',
  'Pedregal', 'Poblado', 'Prado', 'Retiro', 'Robledo', 'Rosales', 'San Antonio de Prado',
  'San Benito', 'San Cristóbal', 'San Diego', 'San Diego Poblado', 'San Javier',
  'San Jerónimo', 'San Joaquín', 'San Pablo', 'San Pedro', 'San Sebastián de Palmitas',
  'San Vicente Ferrer', 'Santa Cruz', 'Santa Elena', 'Santa Fe de Antioquia', 'Santa Mónica',
  'Sevilla', 'Simón Bolívar', 'Toscana', 'Tricentenario', 'Velódromo', 'Villa Hermosa',
];

const TIPOS_INMUEBLE = [
  'Apartamento', 'Apartaestudio', 'Casa', 'Oficina',
  'Local', 'Bodega', 'Lote', 'Finca',
];

const ESTRATOS    = ['1', '2', '3', '4', '5', '6'];
const COMODIDADES = ['Amoblado', 'Piscina', 'Balcón', 'Unidad Cerrada', 'Cuarto útil', 'Ascensor', 'Juegos infantiles'];

/* ── Constantes ─────────────────────────────────────────────────────── */

const FONT        = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const COLOR_LABEL = '#888';
const COLOR_VALUE = '#1a1a1a';
const RED         = '#f32735';
const RED_HOVER   = '#aa182c';
const CELL_H      = 56;
const DIVIDER     = '1px solid rgba(0,0,0,0.07)';

/* ── Types ──────────────────────────────────────────────────────────── */

export interface PropSearchFilters {
  tipo: 'Todos' | 'Arrendar' | 'Comprar';
  textoBusqueda: string;
  codigo: string;
  sector: string;
  tipoPropiedad: string;
  precioMin: number;
  precioMax: number;
  habitaciones: number | null;
  banos: number | null;
  parqueadero: 'con' | 'sin' | null;
  areaMin: string;
  areaMax: string;
  estrato: string[];
  comodidades: string[];
}

export const DEFAULT_FILTERS: PropSearchFilters = {
  tipo: 'Todos',
  textoBusqueda: '',
  codigo: '',
  sector: '',
  tipoPropiedad: '',
  precioMin: 0,
  precioMax: 15_000_000,
  habitaciones: null,
  banos: null,
  parqueadero: null,
  areaMin: '',
  areaMax: '',
  estrato: [],
  comodidades: [],
};

/* ── Helpers ────────────────────────────────────────────────────────── */

function fmtCOP(n: number): string {
  if (n === 0) return '$ 0';
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `$ ${Number.isInteger(m) ? m : m.toFixed(1)}M`;
  }
  return `$ ${Math.round(n / 1_000)}K`;
}

/* ── PriceRangeSlider — mismo estilo que el hero ────────────────────── */

function PriceRangeSlider({
  min, max, step, value, onChange, formatter = fmtCOP,
}: { min: number; max: number; step: number; value: [number, number]; onChange: (v: [number, number]) => void; formatter?: (n: number) => string }) {
  const [low, high] = value;
  const trackRef  = useRef<HTMLDivElement>(null);
  const dragging  = useRef<'low' | 'high' | null>(null);
  const lowRef    = useRef(low);
  const highRef   = useRef(high);
  lowRef.current  = low;
  highRef.current = high;

  const pctLow  = ((low  - min) / (max - min)) * 100;
  const pctHigh = ((high - min) / (max - min)) * 100;

  const valFromX = (clientX: number) => {
    if (!trackRef.current) return null;
    const r   = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    return Math.round((min + pct * (max - min)) / step) * step;
  };

  const move = (clientX: number) => {
    const v = valFromX(clientX);
    if (v === null) return;
    if (dragging.current === 'low')
      onChange([Math.max(min, Math.min(v, highRef.current - step)), highRef.current]);
    else
      onChange([lowRef.current, Math.min(max, Math.max(v, lowRef.current + step))]);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const v = valFromX(e.clientX);
    if (v === null) return;
    dragging.current = Math.abs(v - lowRef.current) <= Math.abs(v - highRef.current) ? 'low' : 'high';
    move(e.clientX);
    const onMove = (ev: MouseEvent) => move(ev.clientX);
    const onUp   = () => { dragging.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const v = valFromX(e.touches[0].clientX);
    if (v === null) return;
    dragging.current = Math.abs(v - lowRef.current) <= Math.abs(v - highRef.current) ? 'low' : 'high';
    move(e.touches[0].clientX);
    const onMove = (ev: TouchEvent) => { ev.preventDefault(); move(ev.touches[0].clientX); };
    const onEnd  = () => { dragging.current = null; window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd); };
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
  };

  return (
    <div style={{ userSelect: 'none' }}>
      <div
        ref={trackRef}
        style={{ position: 'relative', height: '20px', cursor: 'pointer', marginTop: '4px' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '3px', transform: 'translateY(-50%)', background: '#f5f5f5', borderRadius: '2px', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: `${pctLow}%`, right: `${100 - pctHigh}%`, top: 0, bottom: 0, background: RED, borderRadius: '2px' }} />
        </div>
        <div style={{ position: 'absolute', left: `${pctLow}%`, top: '50%', transform: 'translate(-50%,-50%)', width: '10px', height: '10px', background: RED, borderRadius: '50%', pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', left: `${pctHigh}%`, top: '50%', transform: 'translate(-50%,-50%)', width: '10px', height: '10px', background: RED, borderRadius: '50%', pointerEvents: 'none', zIndex: 2 }} />
      </div>
      <p style={{ fontFamily: FONT, fontSize: '12px', fontWeight: 500, color: COLOR_VALUE, textAlign: 'center', margin: '8px 0 0', lineHeight: 1 }}>
        {formatter(low)} – {formatter(high)}
      </p>
    </div>
  );
}

/* ── PriceSelect — dropdown portal ──────────────────────────────────── */

function PriceSelect({
  value, onChange, searchType,
}: { value: [number, number]; onChange: (v: [number, number]) => void; searchType: 'arrendar' | 'comprar' | null }) {
  const [open, setOpen]       = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef             = useRef<HTMLButtonElement>(null);
  const dropdownRef           = useRef<HTMLDivElement>(null);
  const [pos, setPos]         = useState({ top: 0, left: 0, width: 0 });

  const isComprar = searchType === 'comprar';
  const isArrendar = searchType === 'arrendar';
  const min  = isComprar ? 30_000_000  : 0;
  const max  = isArrendar ? 15_000_000 : 500_000_000;
  const step = isArrendar ? 250_000    : 5_000_000;

  useEffect(() => { setMounted(true); }, []);

  const updatePos = useCallback(() => {
    if (buttonRef.current) {
      const r = buttonRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 2, left: r.left, width: Math.max(r.width, 260) });
    }
  }, []);

  useEffect(() => {
    if (!open || !mounted) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!dropdownRef.current?.contains(t) && !buttonRef.current?.contains(t)) setOpen(false);
    };
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => { clearTimeout(id); document.removeEventListener('mousedown', handler); };
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener('scroll', updatePos, { passive: true });
    return () => window.removeEventListener('scroll', updatePos);
  }, [open, updatePos]);

  const [low, high] = value;
  const pristine = low === min && high === max;
  const display  = pristine ? null : `${fmtCOP(low)} – ${fmtCOP(high)}`;

  const dropdown = mounted && open ? (
    <div ref={dropdownRef} data-search-portal style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}>
      <div className="bg-white shadow-2xl border border-gray-100" style={{ padding: '16px 20px 22px' }}>
        <PriceRangeSlider min={min} max={max} step={step} value={value} onChange={onChange} />
      </div>
    </div>
  ) : null;

  return (
    <div className="min-w-0 w-full">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => { if (!open) { updatePos(); setOpen(true); } else setOpen(false); }}
        className="w-full flex items-center bg-transparent border-none outline-none cursor-pointer text-left"
      >
        <span style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400, color: display ? COLOR_VALUE : '#ccc', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {display || 'Seleccionar'}
        </span>
      </button>
      {dropdown && createPortal(dropdown, document.body)}
    </div>
  );
}

/* ── CustomSelect — dropdown buscable portal ─────────────────────────── */

function CustomSelect({
  value, onChange, options, placeholder, searchable = false, footer,
}: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; searchable?: boolean; footer?: React.ReactNode }) {
  const [open, setOpen]       = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery]     = useState('');
  const buttonRef             = useRef<HTMLButtonElement>(null);
  const inputRef              = useRef<HTMLInputElement>(null);
  const dropdownRef           = useRef<HTMLDivElement>(null);
  const [pos, setPos]         = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => { setMounted(true); }, []);

  const updatePos = useCallback(() => {
    const el = searchable ? inputRef.current : buttonRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setPos({ top: r.bottom + 2, left: r.left, width: Math.max(r.width, 200) });
    }
  }, [searchable]);

  const openDropdown = useCallback(() => { updatePos(); setQuery(''); setOpen(true); }, [updatePos]);
  const toggle = useCallback(() => { if (!open) openDropdown(); else setOpen(false); }, [open, openDropdown]);

  useEffect(() => {
    if (!open || !mounted) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      const anchor = searchable ? inputRef.current : buttonRef.current;
      if (!dropdownRef.current?.contains(t) && !anchor?.contains(t)) { setOpen(false); setQuery(''); }
    };
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => { clearTimeout(id); document.removeEventListener('mousedown', handler); };
  }, [open, mounted, searchable]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener('scroll', updatePos, { passive: true });
    return () => window.removeEventListener('scroll', updatePos);
  }, [open, updatePos]);

  const filtered = searchable && query
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  const selectOption = (opt: string) => { onChange(opt); setOpen(false); setQuery(''); };

  const dropdown = mounted && open ? (
    <div ref={dropdownRef} data-search-portal style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}>
      <div className="bg-white shadow-2xl border border-gray-100" style={{ display: 'flex', flexDirection: 'column', maxHeight: '280px' }}>
        {/* Lista scrollable */}
        <div className="red-scrollbar" style={{ overflowY: 'auto', flex: 1 }}>
          {filtered.length === 0
            ? <p style={{ fontFamily: FONT, fontSize: '13px', padding: '10px 16px', color: '#ccc' }}>Sin resultados</p>
            : filtered.map(opt => (
              <button key={opt} type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => selectOption(opt)}
                className={`block w-full text-left px-4 py-2.5 transition-colors duration-100 ${value === opt ? 'bg-brand-red text-white' : 'text-gray-700 hover:bg-brand-red hover:text-white'}`}
                style={{ fontFamily: FONT, fontSize: '13px' }}>
                {opt}
              </button>
            ))
          }
        </div>
        {/* Footer fijo — cierra el dropdown al hacer clic */}
        {footer && (
          <div
            style={{ borderTop: '1px solid rgba(0,0,0,0.07)', flexShrink: 0 }}
            onClick={() => { setOpen(false); setQuery(''); }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  ) : null;

  if (searchable) {
    return (
      <div className="min-w-0 w-full">
        <input
          ref={inputRef}
          type="text"
          className="search-field-input"
          value={open ? query : value}
          onChange={e => { setQuery(e.target.value); if (!open) openDropdown(); }}
          onFocus={openDropdown}
          placeholder={open ? (value || 'Buscar...') : (placeholder || 'Seleccionar')}
          style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400, color: COLOR_VALUE, background: 'transparent', border: 'none', outline: 'none', width: '100%', lineHeight: 1 }}
        />
        {dropdown && createPortal(dropdown, document.body)}
      </div>
    );
  }

  return (
    <div className="min-w-0 w-full">
      <button ref={buttonRef} type="button" onClick={toggle}
        className="w-full flex items-center bg-transparent border-none outline-none cursor-pointer text-left">
        <span style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400, color: value ? COLOR_VALUE : '#ccc', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value || placeholder || 'Seleccionar'}
        </span>
      </button>
      {dropdown && createPortal(dropdown, document.body)}
    </div>
  );
}

/* ── AreaRangeSlider — igual que PriceRangeSlider pero para m² ───────── */

const AREA_SLIDER_MIN = 0;
const AREA_SLIDER_MAX = 500;
const AREA_STEP       = 5;

function AreaRangeSlider({
  areaMin, areaMax, onChange,
}: { areaMin: string; areaMax: string; onChange: (min: string, max: string) => void }) {
  const low  = areaMin ? Math.max(AREA_SLIDER_MIN, Number(areaMin)) : AREA_SLIDER_MIN;
  const high = areaMax ? Math.min(AREA_SLIDER_MAX, Number(areaMax)) : AREA_SLIDER_MAX;

  const trackRef  = useRef<HTMLDivElement>(null);
  const dragging  = useRef<'low' | 'high' | null>(null);
  const lowRef    = useRef(low);
  const highRef   = useRef(high);
  lowRef.current  = low;
  highRef.current = high;

  const pctLow  = ((low  - AREA_SLIDER_MIN) / (AREA_SLIDER_MAX - AREA_SLIDER_MIN)) * 100;
  const pctHigh = ((high - AREA_SLIDER_MIN) / (AREA_SLIDER_MAX - AREA_SLIDER_MIN)) * 100;

  const valFromX = (clientX: number) => {
    if (!trackRef.current) return null;
    const r   = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    return Math.round((AREA_SLIDER_MIN + pct * (AREA_SLIDER_MAX - AREA_SLIDER_MIN)) / AREA_STEP) * AREA_STEP;
  };

  const emit = (newLow: number, newHigh: number) => {
    onChange(
      newLow > AREA_SLIDER_MIN ? String(newLow) : '',
      newHigh < AREA_SLIDER_MAX ? String(newHigh) : '',
    );
  };

  const move = (clientX: number) => {
    const v = valFromX(clientX);
    if (v === null) return;
    if (dragging.current === 'low')
      emit(Math.max(AREA_SLIDER_MIN, Math.min(v, highRef.current - AREA_STEP)), highRef.current);
    else
      emit(lowRef.current, Math.min(AREA_SLIDER_MAX, Math.max(v, lowRef.current + AREA_STEP)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const v = valFromX(e.clientX);
    if (v === null) return;
    dragging.current = Math.abs(v - lowRef.current) <= Math.abs(v - highRef.current) ? 'low' : 'high';
    move(e.clientX);
    const onMove = (ev: MouseEvent) => move(ev.clientX);
    const onUp   = () => { dragging.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const v = valFromX(e.touches[0].clientX);
    if (v === null) return;
    dragging.current = Math.abs(v - lowRef.current) <= Math.abs(v - highRef.current) ? 'low' : 'high';
    move(e.touches[0].clientX);
    const onMove = (ev: TouchEvent) => { ev.preventDefault(); move(ev.touches[0].clientX); };
    const onEnd  = () => { dragging.current = null; window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd); };
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
  };

  const label = low === AREA_SLIDER_MIN && high === AREA_SLIDER_MAX
    ? 'Cualquier área'
    : low === AREA_SLIDER_MIN
      ? `Hasta ${high} m²`
      : high === AREA_SLIDER_MAX
        ? `Desde ${low} m²`
        : `${low} – ${high} m²`;

  return (
    <div style={{ userSelect: 'none', width: '100%' }}>
      <div
        ref={trackRef}
        style={{ position: 'relative', height: '20px', cursor: 'pointer', marginTop: '4px' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '3px', transform: 'translateY(-50%)', background: '#f5f5f5', borderRadius: '2px', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: `${pctLow}%`, right: `${100 - pctHigh}%`, top: 0, bottom: 0, background: RED, borderRadius: '2px' }} />
        </div>
        <div style={{ position: 'absolute', left: `${pctLow}%`, top: '50%', transform: 'translate(-50%,-50%)', width: '10px', height: '10px', background: RED, borderRadius: '50%', pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', left: `${pctHigh}%`, top: '50%', transform: 'translate(-50%,-50%)', width: '10px', height: '10px', background: RED, borderRadius: '50%', pointerEvents: 'none', zIndex: 2 }} />
      </div>
      <p style={{ fontFamily: FONT, fontSize: '12px', fontWeight: 500, color: COLOR_VALUE, textAlign: 'center', margin: '8px 0 0', lineHeight: 1 }}>
        {label}
      </p>
    </div>
  );
}

/* ── AreaSelect — dropdown portal (igual que PriceSelect) ────────────── */

function AreaSelect({
  areaMin, areaMax, onChange,
}: { areaMin: string; areaMax: string; onChange: (min: string, max: string) => void }) {
  const [open, setOpen]       = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef             = useRef<HTMLButtonElement>(null);
  const dropdownRef           = useRef<HTMLDivElement>(null);
  const [pos, setPos]         = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => { setMounted(true); }, []);

  const updatePos = useCallback(() => {
    if (buttonRef.current) {
      const r = buttonRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 2, left: r.left, width: Math.max(r.width, 260) });
    }
  }, []);

  useEffect(() => {
    if (!open || !mounted) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!dropdownRef.current?.contains(t) && !buttonRef.current?.contains(t)) setOpen(false);
    };
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => { clearTimeout(id); document.removeEventListener('mousedown', handler); };
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener('scroll', updatePos, { passive: true });
    return () => window.removeEventListener('scroll', updatePos);
  }, [open, updatePos]);

  const low  = areaMin ? Number(areaMin) : AREA_SLIDER_MIN;
  const high = areaMax ? Number(areaMax) : AREA_SLIDER_MAX;
  const pristine = low === AREA_SLIDER_MIN && high === AREA_SLIDER_MAX;
  const display = pristine ? null :
    low === AREA_SLIDER_MIN  ? `Hasta ${high} m²` :
    high === AREA_SLIDER_MAX ? `Desde ${low} m²` :
    `${low} – ${high} m²`;

  const dropdown = mounted && open ? (
    <div ref={dropdownRef} data-search-portal style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}>
      <div className="bg-white shadow-2xl border border-gray-100" style={{ padding: '16px 20px 22px' }}>
        <AreaRangeSlider areaMin={areaMin} areaMax={areaMax} onChange={onChange} />
      </div>
    </div>
  ) : null;

  return (
    <div className="min-w-0 w-full">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => { if (!open) { updatePos(); setOpen(true); } else setOpen(false); }}
        className="w-full flex items-center bg-transparent border-none outline-none cursor-pointer text-left"
      >
        <span style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400, color: display ? COLOR_VALUE : '#ccc', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {display || 'Seleccionar'}
        </span>
      </button>
      {dropdown && createPortal(dropdown, document.body)}
    </div>
  );
}

/* ── Chip ───────────────────────────────────────────────────────────── */

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '3px 12px',
        border: `1px solid ${active ? RED : 'rgba(0,0,0,0.12)'}`,
        background: active ? RED : 'transparent',
        color: active ? '#fff' : '#ccc',
        fontFamily: FONT,
        fontSize: '13px',
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

/* ── Estilos compartidos ────────────────────────────────────────────── */

const contentStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '14px 20px',
  height: `${CELL_H}px`,
  minWidth: 0,
};

const labelStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: '11px',
  color: COLOR_LABEL,
  fontWeight: 300,
  marginBottom: '3px',
  lineHeight: 1,
  whiteSpace: 'nowrap',
};

const advContentStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  padding: '8px 20px',
  height: `${CELL_H}px`,
  minWidth: 0,
  overflow: 'hidden',
};

/* ── Componente principal ────────────────────────────────────────────── */

interface Props {
  initialTipo?: 'Todos' | 'Arrendar' | 'Comprar';
  initialTextoBusqueda?: string;
  onApply: (f: PropSearchFilters) => void;
  onShowMap?: () => void;
  mapActive?: boolean;
  collapsed?: boolean;
}

const fi = (base: string, focused: boolean, filled: boolean) =>
  filled ? `/icons/${base}-red.svg` : focused ? `/icons/${base}-red-dark.svg` : `/icons/${base}-gray.svg`;

export default function PropiedadesSearchBar({ initialTipo = 'Todos', initialTextoBusqueda = '', onApply, onShowMap, mapActive = false, collapsed = false }: Props) {
  const [tipo,           setTipo]          = useState<'Todos' | 'Arrendar' | 'Comprar'>(initialTipo);
  const [textoBusqueda,  setTextoBusqueda] = useState(initialTextoBusqueda);
  const [busquedaActive, setBusquedaActive] = useState(false);
  const [codigo,         setCodigo]        = useState('');
  const [codigoActive,   setCodigoActive]  = useState(false);
  const [sector,        setSector]        = useState('');
  const [tipoPropiedad, setTipoPropiedad] = useState('');

  const [showAdvanced, setShowAdvanced] = useState(false);

  const busquedaInputRef = useRef<HTMLInputElement>(null);
  const codigoInputRef   = useRef<HTMLInputElement>(null);
  const wrapperRef       = useRef<HTMLDivElement>(null);

  const activateBusqueda = useCallback(() => {
    setBusquedaActive(true);
    setCodigoActive(false);
    setTimeout(() => busquedaInputRef.current?.focus(), 0);
  }, []);

  const activateCodigo = useCallback(() => {
    setCodigoActive(true);
    setBusquedaActive(false);
    setTimeout(() => codigoInputRef.current?.focus(), 0);
  }, []);

  const busquedaCollapsed = busquedaActive || textoBusqueda.length > 0;
  const codigoCollapsed   = codigoActive   || codigo.length > 0;
  const col1Collapsed   = codigoActive   || (codigoCollapsed  && !busquedaCollapsed);
  const col2Collapsed   = busquedaActive || (busquedaCollapsed && !codigoCollapsed);
  const col345Collapsed = busquedaCollapsed || codigoCollapsed;
  const defaultPrecioRange = (t: string): [number, number] =>
    t === 'Comprar' ? [30_000_000, 500_000_000] : t === 'Arrendar' ? [0, 15_000_000] : [0, 500_000_000];

  const [precioRange, setPrecioRange] = useState<[number, number]>(defaultPrecioRange(initialTipo));

  const [habitaciones, setHabitaciones] = useState<number | null>(null);
  const [banos,        setBanos]        = useState<number | null>(null);
  const [parqueadero,  setParqueadero]  = useState<'con' | 'sin' | null>(null);
  const [areaMin,      setAreaMin]      = useState('');
  const [areaMax,      setAreaMax]      = useState('');
  const [estrato,      setEstrato]      = useState<string[]>([]);
  const [comodidades,  setComodidades]  = useState<string[]>([]);

  useEffect(() => {
    setTipo(initialTipo);
    setPrecioRange(defaultPrecioRange(initialTipo));
  }, [initialTipo]);

  // Cierra búsqueda avanzada al hacer clic fuera del componente (excepto portals de filtros)
  useEffect(() => {
    if (!showAdvanced) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (wrapperRef.current?.contains(t)) return;
      if (t.closest('[data-search-portal]')) return;
      setShowAdvanced(false);
    };
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => { clearTimeout(id); document.removeEventListener('mousedown', handler); };
  }, [showAdvanced]);

  const searchType: 'arrendar' | 'comprar' | null =
    tipo === 'Comprar' ? 'comprar' : tipo === 'Arrendar' ? 'arrendar' : null;

  const handleApply = () => {
    onApply({
      tipo, textoBusqueda, codigo, sector, tipoPropiedad,
      precioMin: precioRange[0], precioMax: precioRange[1],
      habitaciones, banos, parqueadero,
      areaMin, areaMax, estrato, comodidades,
    });
  };

  const handleClear = () => {
    const defaultRange = defaultPrecioRange(tipo);
    setTextoBusqueda(''); setCodigo(''); setSector(''); setTipoPropiedad('');
    setPrecioRange(defaultRange);
    setHabitaciones(null); setBanos(null); setParqueadero(null);
    setAreaMin(''); setAreaMax(''); setEstrato([]); setComodidades([]);
    onApply({ ...DEFAULT_FILTERS, tipo, precioMin: defaultRange[0], precioMax: defaultRange[1] });
  };

  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [showFiltersSheet, setShowFiltersSheet] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMounted, setSheetMounted] = useState(false);
  const [searchFocused,  setSearchFocused]  = useState(false);
  const [codigoFocused,  setCodigoFocused]  = useState(false);
  const [sectorFocused,  setSectorFocused]  = useState(false);
  const [tipoFocused,    setTipoFocused]    = useState(false);

  useEffect(() => { setSheetMounted(true); }, []);

  const openSheet = () => {
    setShowFiltersSheet(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setSheetOpen(true)));
  };

  const closeSheet = () => {
    setSheetOpen(false);
    setTimeout(() => setShowFiltersSheet(false), 350);
  };

  const activeFilterCount = (
    (codigo ? 1 : 0) + (sector ? 1 : 0) + (tipoPropiedad ? 1 : 0) +
    (habitaciones !== null ? 1 : 0) + (banos !== null ? 1 : 0) +
    (parqueadero !== null ? 1 : 0) + estrato.length + comodidades.length
  );

  const toggleEstrato   = (e: string) => setEstrato(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);
  const toggleComodidad = (c: string) => setComodidades(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  return (
    <div ref={wrapperRef} style={{ maxWidth: '1400px', margin: '0 auto', padding: '8px clamp(16px, 3vw, 52px) 24px' }}>
      <div style={{
        background: '#fff',
        boxShadow: '0 10px 48px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.10)',
        overflow: 'hidden',
      }}>

        {/* ── Fila 1: Tabs ──────────────────────────────────────────── */}
        <div style={{ display: 'flex', height: '44px', borderBottom: DIVIDER }}>
          {(['Todos', 'Arrendar', 'Comprar'] as const).map((t, i) => {
            const active = tipo === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => {
                  const newRange = defaultPrecioRange(t);
                  setTipo(t);
                  setPrecioRange(newRange);
                  onApply({
                    tipo: t, textoBusqueda, codigo, sector, tipoPropiedad,
                    precioMin: newRange[0], precioMax: newRange[1],
                    habitaciones, banos, parqueadero,
                    areaMin, areaMax, estrato, comodidades,
                  });
                }}
                style={{
                  flex: 1,
                  height: '100%',
                  backgroundColor: active
                    ? '#f5f5f5'
                    : hoveredTab === t ? 'rgba(0,0,0,0.03)' : 'transparent',
                  color: active ? '#1a1a1a' : '#555',
                  fontFamily: FONT,
                  fontSize: '14px',
                  fontWeight: active ? 600 : 400,
                  border: 'none',
                  borderRight: i < 2 ? DIVIDER : 'none',
                  cursor: 'pointer',
                  letterSpacing: '0.01em',
                  transition: 'background 0.2s ease, color 0.2s ease',
                }}
                onMouseEnter={() => setHoveredTab(t)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* ── Grid único: filtros principales + avanzados alineados ─── */}
        <div style={{
          overflow: 'hidden',
          maxHeight: collapsed ? '0px' : '2000px',
          transition: 'max-height 0.45s cubic-bezier(0.4,0,0.2,1)',
        }}>

          {/* ── MOBILE: Vista inicial simplificada (< lg) ──────────── */}
          <div className="lg:hidden">

            {/* ¿Qué buscas? */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', borderBottom: DIVIDER }}>
              <img src={fi('icon-search', searchFocused, !!textoBusqueda)} width={20} height={20} alt="" aria-hidden style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={labelStyle}>¿Qué buscas?</p>
                <input type="text" value={textoBusqueda}
                  onChange={e => {
                    const v = e.target.value; setTextoBusqueda(v);
                    onApply({ tipo, textoBusqueda: v, codigo, sector, tipoPropiedad, precioMin: precioRange[0], precioMax: precioRange[1], habitaciones, banos, parqueadero, areaMin, areaMax, estrato, comodidades });
                  }}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  onKeyDown={e => { if (e.key === 'Enter') handleApply(); }}
                  placeholder="Ej: apartamento cerca al metro"
                  style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400, color: textoBusqueda ? COLOR_VALUE : '#ccc', background: 'transparent', border: 'none', outline: 'none', width: '100%', lineHeight: 1 }} />
              </div>
            </div>

            {/* Más filtros | Ver en mapa */}
            <div style={{ display: 'flex', height: '48px', borderBottom: DIVIDER }}>
              <button
                type="button"
                onClick={openSheet}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#f7f6f4', border: 'none', borderRight: DIVIDER, cursor: 'pointer', fontFamily: FONT, fontSize: '13px', color: activeFilterCount > 0 ? COLOR_VALUE : '#888', fontWeight: activeFilterCount > 0 ? 500 : 400, transition: 'background 0.15s ease' }}
                onTouchStart={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.06)'; }}
                onTouchEnd={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f7f6f4'; }}
              >
                <img src={
                  activeFilterCount > 0 ? '/icons/icon-sliders-red.svg' :
                  showFiltersSheet ? '/icons/icon-sliders-red-dark.svg' :
                  '/icons/icon-sliders-gray.svg'
                } width={14} height={14} alt="" />
                Más filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </button>
              <button
                type="button"
                onClick={onShowMap}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#f7f6f4', border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: '13px', color: '#888', fontWeight: 400, transition: 'background 0.15s ease' }}
                onTouchStart={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.06)'; }}
                onTouchEnd={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f7f6f4'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={mapActive ? '#f32735' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
                </svg>
                Ver en mapa
              </button>
            </div>

            {/* CTA */}
            <button type="button" onClick={handleApply}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: RED, color: '#fff', fontFamily: FONT, fontSize: '15px', fontWeight: 600, border: 'none', cursor: 'pointer', padding: '16px 0', transition: 'background 0.2s ease' }}
              onMouseEnter={e => (e.currentTarget.style.background = RED_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.background = RED)}
            >
              <img src="/icons/icon-search-white.svg" alt="" width={18} height={18} />
              <span>Buscar inmueble</span>
            </button>

          </div>{/* end lg:hidden */}

          {/* ── DESKTOP: Grid + acciones (≥ lg) ──────────────────── */}
          <div className="hidden lg:block">
          <div style={{
          display: 'grid',
          gridTemplateColumns:
            busquedaActive                         ? `calc(100% - 208px) 52px 52px 52px 52px` :
            codigoActive                           ? `52px calc(100% - 208px) 52px 52px 52px` :
            busquedaCollapsed && codigoCollapsed   ? `2fr 2fr 52px 52px 52px` :
            busquedaCollapsed                      ? `calc(100% - 208px) 52px 52px 52px 52px` :
            codigoCollapsed                        ? `52px calc(100% - 208px) 52px 52px 52px` :
            'repeat(5, 1fr)',
          transition: 'grid-template-columns 0.38s cubic-bezier(0.4,0,0.2,1)',
        }}>

          {/* ── Fila principal ──────────────────────────────────────── */}

          {/* Col 1: Búsqueda libre tipo Google */}
          <div
            style={{ position: 'relative', borderRight: DIVIDER, borderBottom: DIVIDER, overflow: 'hidden', cursor: 'text' }}
            onClick={activateBusqueda}
          >
            {/* Icon overlay — visible cuando está colapsado */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: col1Collapsed ? 1 : 0, transition: 'opacity 0.2s ease', pointerEvents: 'none' }}>
              <img src="/icons/icon-search-red.svg" width={20} height={20} alt="" aria-hidden style={{ opacity: 0.65 }} />
            </div>
            <div style={{ ...contentStyle, opacity: col1Collapsed ? 0 : 1, transition: 'opacity 0.15s ease' }}>
              <img src="/icons/icon-search-red.svg" width={20} height={20} alt="" aria-hidden style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={labelStyle}>¿Qué buscas?</p>
                <input
                  type="text"
                  value={textoBusqueda}
                  onChange={e => {
                    const v = e.target.value;
                    setTextoBusqueda(v);
                    onApply({
                      tipo, textoBusqueda: v, codigo, sector, tipoPropiedad,
                      precioMin: precioRange[0], precioMax: precioRange[1],
                      habitaciones, banos, parqueadero,
                      areaMin, areaMax, estrato, comodidades,
                    });
                  }}
                  ref={busquedaInputRef}
                  onFocus={activateBusqueda}
                  onBlur={() => { if (!textoBusqueda) setBusquedaActive(false); }}
                  placeholder="Ej: inmueble cerca a Niquia"
                  className="search-field-input"
                  style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400, color: textoBusqueda ? COLOR_VALUE : '#ccc', background: 'transparent', border: 'none', outline: 'none', width: '100%', lineHeight: 1 }}
                />
              </div>
            </div>
          </div>

          {/* Col 2: Código inmueble */}
          <div
            style={{ position: 'relative', borderRight: DIVIDER, borderBottom: DIVIDER, overflow: 'hidden', cursor: 'text' }}
            onClick={activateCodigo}
          >
            {/* Icon overlay — visible cuando está colapsado */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: col2Collapsed ? 1 : 0, transition: 'opacity 0.2s ease', pointerEvents: 'none' }}>
              <img src="/icons/icon-code-red.svg" alt="" width={22} height={22} style={{ filter: 'grayscale(0.3) opacity(0.7)' }} />
            </div>
            <div style={{ ...contentStyle, opacity: col2Collapsed ? 0 : 1, transition: 'opacity 0.15s ease' }}>
              <img src="/icons/icon-code-red.svg" alt="" width={24} height={24} style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={labelStyle}>Código inmueble</p>
                <input
                  type="text"
                  value={codigo}
                  onChange={e => {
                    const v = e.target.value;
                    setCodigo(v);
                    onApply({
                      tipo, textoBusqueda, codigo: v, sector, tipoPropiedad,
                      precioMin: precioRange[0], precioMax: precioRange[1],
                      habitaciones, banos, parqueadero,
                      areaMin, areaMax, estrato, comodidades,
                    });
                  }}
                  ref={codigoInputRef}
                  onFocus={activateCodigo}
                  onBlur={() => { if (!codigo) setCodigoActive(false); }}
                  placeholder="Ej: A11636"
                  className="search-field-input"
                  style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400, color: codigo ? COLOR_VALUE : '#ccc', background: 'transparent', border: 'none', outline: 'none', width: '100%', lineHeight: 1 }}
                />
              </div>
            </div>
          </div>

          {/* Col 2: Ubicación */}
          <div style={{ position: 'relative', borderRight: DIVIDER, borderBottom: DIVIDER, overflow: 'hidden' }}>
            {/* Icon overlay — visible cuando está colapsado */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: col345Collapsed ? 1 : 0, transition: 'opacity 0.2s ease', pointerEvents: 'none' }}>
              <img src="/icons/icon-location-red.svg" alt="" width={22} height={22} style={{ filter: 'grayscale(0.3) opacity(0.7)' }} />
            </div>
            <div style={{ ...contentStyle, opacity: col345Collapsed ? 0 : 1, transition: 'opacity 0.15s ease' }}>
              <img src="/icons/icon-location-red.svg" alt="" width={24} height={24} style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={labelStyle}>Ubicación / Mapa</p>
                <CustomSelect
                  value={sector}
                  onChange={setSector}
                  options={SECTORES}
                  placeholder="Seleccionar"
                  searchable
                  footer={onShowMap ? (
                    <button
                      type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => { onShowMap(); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        width: '100%', padding: '10px 16px',
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        fontFamily: FONT, fontSize: '13px', fontWeight: 500,
                        color: '#888',
                        transition: 'color 0.15s ease, background 0.15s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#f7f6f4'; e.currentTarget.style.color = '#555'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#888'; }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                        <line x1="9" y1="3" x2="9" y2="18"/>
                        <line x1="15" y1="6" x2="15" y2="21"/>
                      </svg>
                      Ver mapa
                    </button>
                  ) : undefined}
                />
              </div>
            </div>
          </div>

          {/* Col 3: Tipo de propiedad */}
          <div style={{ position: 'relative', borderRight: DIVIDER, borderBottom: DIVIDER, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: col345Collapsed ? 1 : 0, transition: 'opacity 0.2s ease', pointerEvents: 'none' }}>
              <img src="/icons/icon-home-red.svg" alt="" width={22} height={22} style={{ filter: 'grayscale(0.3) opacity(0.7)' }} />
            </div>
            <div style={{ ...contentStyle, opacity: col345Collapsed ? 0 : 1, transition: 'opacity 0.15s ease' }}>
              <img src="/icons/icon-home-red.svg" alt="" width={24} height={24} style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={labelStyle}>Tipo de propiedad</p>
                <CustomSelect value={tipoPropiedad} onChange={setTipoPropiedad} options={TIPOS_INMUEBLE} placeholder="Seleccionar" searchable />
              </div>
            </div>
          </div>

          {/* Col 4: Precio */}
          <div style={{ position: 'relative', borderBottom: DIVIDER, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: col345Collapsed ? 1 : 0, transition: 'opacity 0.2s ease', pointerEvents: 'none' }}>
              <img src="/icons/icon-dollar-red.svg" alt="" width={22} height={22} style={{ filter: 'grayscale(0.3) opacity(0.7)' }} />
            </div>
            <div style={{ ...contentStyle, opacity: col345Collapsed ? 0 : 1, transition: 'opacity 0.15s ease' }}>
              <img src="/icons/icon-dollar-red.svg" alt="" width={24} height={24} style={{ flexShrink: 0, alignSelf: 'flex-start', marginTop: '2px' }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={labelStyle}>Precio</p>
                <PriceSelect value={precioRange} onChange={setPrecioRange} searchType={searchType} />
              </div>
            </div>
          </div>

          {/* ── Filtros avanzados — sub-grid propio de 4 columnas ─────── */}
          {showAdvanced && (
            <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: DIVIDER }}>

              {/* Col 1: Habitaciones */}
              <div style={{ borderRight: DIVIDER, borderBottom: DIVIDER }}>
                <div style={advContentStyle}>
                  <img src="/icons/icon-bed-red.svg" alt="" width={24} height={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={labelStyle}>Habitaciones</p>
                    <div style={{ display: 'flex', gap: '5px', marginTop: '4px', flexWrap: 'wrap' }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <Chip key={n} label={n === 5 ? '5+' : String(n)} active={habitaciones === n} onClick={() => setHabitaciones(habitaciones === n ? null : n)} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Col 2: Baños */}
              <div style={{ borderRight: DIVIDER, borderBottom: DIVIDER }}>
                <div style={advContentStyle}>
                  <img src="/icons/icon-bathroom-red.svg" alt="" width={24} height={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={labelStyle}>Baños</p>
                    <div style={{ display: 'flex', gap: '5px', marginTop: '4px', flexWrap: 'wrap' }}>
                      {[1, 2, 3, 4].map(n => (
                        <Chip key={n} label={n === 4 ? '4+' : String(n)} active={banos === n} onClick={() => setBanos(banos === n ? null : n)} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Col 3: Parqueadero */}
              <div style={{ borderRight: DIVIDER, borderBottom: DIVIDER }}>
                <div style={advContentStyle}>
                  <img src="/icons/icon-sliders-red.svg" alt="" width={24} height={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={labelStyle}>Parqueadero</p>
                    <div style={{ display: 'flex', gap: '5px', marginTop: '4px', flexWrap: 'nowrap' }}>
                      <Chip label="Con parqueadero" active={parqueadero === 'con'} onClick={() => setParqueadero(parqueadero === 'con' ? null : 'con')} />
                      <Chip label="Sin parqueadero" active={parqueadero === 'sin'} onClick={() => setParqueadero(parqueadero === 'sin' ? null : 'sin')} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Col 4: Área */}
              <div style={{ borderBottom: DIVIDER }}>
                <div style={advContentStyle}>
                  <img src="/icons/icon-area-red.svg" alt="" width={24} height={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={labelStyle}>Área (m²)</p>
                    <AreaSelect
                      areaMin={areaMin}
                      areaMax={areaMax}
                      onChange={(min, max) => {
                        setAreaMin(min);
                        setAreaMax(max);
                        onApply({
                          tipo, textoBusqueda, codigo, sector, tipoPropiedad,
                          precioMin: precioRange[0], precioMax: precioRange[1],
                          habitaciones, banos, parqueadero,
                          areaMin: min, areaMax: max, estrato, comodidades,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Col 1: Estrato */}
              <div style={{ borderRight: DIVIDER }}>
                <div style={advContentStyle}>
                  <img src="/icons/icon-code-red.svg" alt="" width={24} height={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={labelStyle}>Estrato</p>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'nowrap' }}>
                      {ESTRATOS.map(e => (
                        <Chip key={e} label={e} active={estrato.includes(e)} onClick={() => toggleEstrato(e)} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Col 2-4: Comodidades */}
              <div style={{ gridColumn: 'span 3' }}>
                <div style={advContentStyle}>
                  <img src="/icons/icon-favorite-red.svg" alt="" width={24} height={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={labelStyle}>Comodidades</p>
                    <div style={{ display: 'flex', gap: '5px', marginTop: '4px', flexWrap: 'wrap' }}>
                      {COMODIDADES.map(c => (
                        <Chip key={c} label={c} active={comodidades.includes(c)} onClick={() => toggleComodidad(c)} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ── Fila 3: Acciones — dos botones iguales ───────────────── */}
        <div style={{ display: 'flex', height: '48px' }}>

          <button
            type="button"
            onClick={() => setShowAdvanced(v => !v)}
            style={{
              flex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: showAdvanced ? 'rgba(0,0,0,0.04)' : '#f7f6f4',
              border: 'none', borderRight: DIVIDER, cursor: 'pointer',
              fontFamily: FONT, fontSize: '13px', color: showAdvanced ? COLOR_VALUE : '#888', fontWeight: 400,
              transition: 'background 0.15s ease, color 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = showAdvanced ? 'rgba(0,0,0,0.04)' : '#f7f6f4'; }}
          >
            Búsqueda avanzada
          </button>

          <button
            type="button"
            onClick={handleApply}
            style={{
              flex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: RED, color: '#fff',
              fontFamily: FONT, fontSize: '14px', fontWeight: 600,
              border: 'none', cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = RED_HOVER)}
            onMouseLeave={e => (e.currentTarget.style.background = RED)}
          >
            <img src="/icons/icon-search-white.svg" alt="" width={16} height={16} />
            Buscar inmueble
          </button>

        </div>
          </div>{/* end hidden lg:block */}

        </div>{/* end collapse wrapper */}

      </div>

      {/* ── Modal "Más filtros" — portal to body ─────────────────── */}
      {showFiltersSheet && sheetMounted && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 9990, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>

          {/* Backdrop */}
          <div
            onClick={closeSheet}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)', transition: 'opacity 0.25s ease', opacity: sheetOpen ? 1 : 0 }}
          />

          {/* Modal */}
          <div style={{
            position: 'relative',
            background: '#fff',
            borderRadius: 0,
            width: '100%',
            maxWidth: '440px',
            maxHeight: '85dvh',
            display: 'flex', flexDirection: 'column',
            opacity: sheetOpen ? 1 : 0,
            transform: sheetOpen ? 'scale(1)' : 'scale(0.96)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
          }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: DIVIDER }}>
              <span style={{ fontFamily: FONT, fontSize: '16px', fontWeight: 600, color: COLOR_VALUE }}>Filtros</span>
              <button type="button" onClick={closeSheet}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div style={{ flex: 1, overflowY: 'auto' }}>

              {/* Código */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: DIVIDER }}>
                <img src={fi('icon-code', codigoFocused, !!codigo)} width={20} height={20} alt="" aria-hidden style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={labelStyle}>Código inmueble</p>
                  <input type="text" value={codigo}
                    onChange={e => {
                      const v = e.target.value; setCodigo(v);
                      onApply({ tipo, textoBusqueda, codigo: v, sector, tipoPropiedad, precioMin: precioRange[0], precioMax: precioRange[1], habitaciones, banos, parqueadero, areaMin, areaMax, estrato, comodidades });
                    }}
                    onFocus={() => setCodigoFocused(true)}
                    onBlur={() => setCodigoFocused(false)}
                    placeholder="Ej: A11636"
                    style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400, color: codigo ? COLOR_VALUE : '#ccc', background: 'transparent', border: 'none', outline: 'none', width: '100%', lineHeight: 1 }} />
                </div>
              </div>

              {/* Ubicación — fila styled + native select invisible encima */}
              <div style={{ position: 'relative', borderBottom: DIVIDER }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px' }}>
                  <img src={fi('icon-location', sectorFocused, !!sector)} width={20} height={20} alt="" aria-hidden style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={labelStyle}>Ubicación</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: FONT, fontSize: '14px', color: sector ? COLOR_VALUE : '#aaa' }}>{sector || 'Seleccionar'}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                </div>
                <select value={sector} onChange={e => {
                    const v = e.target.value; setSector(v);
                    onApply({ tipo, textoBusqueda, codigo, sector: v, tipoPropiedad, precioMin: precioRange[0], precioMax: precioRange[1], habitaciones, banos, parqueadero, areaMin, areaMax, estrato, comodidades });
                  }}
                  onFocus={() => setSectorFocused(true)}
                  onBlur={() => setSectorFocused(false)}
                  style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}>
                  <option value="">Seleccionar</option>
                  {SECTORES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Tipo de propiedad — mismo patrón */}
              <div style={{ position: 'relative', borderBottom: DIVIDER }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px' }}>
                  <img src={fi('icon-home', tipoFocused, !!tipoPropiedad)} width={20} height={20} alt="" aria-hidden style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={labelStyle}>Tipo de propiedad</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: FONT, fontSize: '14px', color: tipoPropiedad ? COLOR_VALUE : '#aaa' }}>{tipoPropiedad || 'Seleccionar'}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                </div>
                <select value={tipoPropiedad} onChange={e => {
                    const v = e.target.value; setTipoPropiedad(v);
                    onApply({ tipo, textoBusqueda, codigo, sector, tipoPropiedad: v, precioMin: precioRange[0], precioMax: precioRange[1], habitaciones, banos, parqueadero, areaMin, areaMax, estrato, comodidades });
                  }}
                  onFocus={() => setTipoFocused(true)}
                  onBlur={() => setTipoFocused(false)}
                  style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}>
                  <option value="">Seleccionar</option>
                  {TIPOS_INMUEBLE.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Precio */}
              <div style={{ padding: '14px 20px', borderBottom: DIVIDER }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                  <img src={fi('icon-dollar', false, precioRange[0] > 0 || precioRange[1] < (tipo === 'Comprar' ? 500_000_000 : 15_000_000))} width={20} height={20} alt="" aria-hidden style={{ flexShrink: 0 }} />
                  <p style={labelStyle}>Precio</p>
                </div>
                <PriceRangeSlider
                  min={tipo === 'Comprar' ? 30_000_000 : 0}
                  max={tipo === 'Comprar' ? 500_000_000 : 15_000_000}
                  step={tipo === 'Comprar' ? 5_000_000 : 250_000}
                  value={precioRange}
                  onChange={setPrecioRange}
                />
              </div>

              {/* Habitaciones */}
              <div style={{ padding: '14px 20px', borderBottom: DIVIDER }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <img src={fi('icon-bed', false, habitaciones !== null)} width={20} height={20} alt="" aria-hidden style={{ flexShrink: 0 }} />
                  <p style={labelStyle}>Habitaciones</p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[1,2,3,4,5].map(n => <Chip key={n} label={n === 5 ? '5+' : String(n)} active={habitaciones === n} onClick={() => setHabitaciones(habitaciones === n ? null : n)} />)}
                </div>
              </div>

              {/* Baños */}
              <div style={{ padding: '14px 20px', borderBottom: DIVIDER }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <img src={fi('icon-bathroom', false, banos !== null)} width={20} height={20} alt="" aria-hidden style={{ flexShrink: 0 }} />
                  <p style={labelStyle}>Baños</p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[1,2,3,4].map(n => <Chip key={n} label={n === 4 ? '4+' : String(n)} active={banos === n} onClick={() => setBanos(banos === n ? null : n)} />)}
                </div>
              </div>

              {/* Parqueadero */}
              <div style={{ padding: '14px 20px', borderBottom: DIVIDER }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <img src={fi('icon-parking', false, parqueadero !== null)} width={20} height={20} alt="" aria-hidden style={{ flexShrink: 0 }} />
                  <p style={labelStyle}>Parqueadero</p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Chip label="Con parqueadero" active={parqueadero === 'con'} onClick={() => setParqueadero(parqueadero === 'con' ? null : 'con')} />
                  <Chip label="Sin parqueadero" active={parqueadero === 'sin'} onClick={() => setParqueadero(parqueadero === 'sin' ? null : 'sin')} />
                </div>
              </div>

              {/* Estrato */}
              <div style={{ padding: '14px 20px', borderBottom: DIVIDER }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <img src="/icons/icon-code-red.svg" width={20} height={20} alt="" aria-hidden style={{ flexShrink: 0 }} />
                  <p style={labelStyle}>Estrato</p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {ESTRATOS.map(e => <Chip key={e} label={e} active={estrato.includes(e)} onClick={() => toggleEstrato(e)} />)}
                </div>
              </div>

              {/* Comodidades */}
              <div style={{ padding: '14px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <img src="/icons/icon-favorite-red.svg" width={20} height={20} alt="" aria-hidden style={{ flexShrink: 0 }} />
                  <p style={labelStyle}>Comodidades</p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {COMODIDADES.map(c => <Chip key={c} label={c} active={comodidades.includes(c)} onClick={() => toggleComodidad(c)} />)}
                </div>
              </div>

            </div>

            {/* Footer fijo */}
            <div style={{ display: 'flex', borderTop: DIVIDER, flexShrink: 0 }}>
              <button type="button"
                onClick={handleClear}
                style={{ flex: 1, height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f6f4', border: 'none', borderRight: DIVIDER, cursor: 'pointer', fontFamily: FONT, fontSize: '14px', color: '#888', fontWeight: 400 }}>
                Limpiar
              </button>
              <button type="button"
                onClick={() => { handleApply(); closeSheet(); }}
                style={{ flex: 1, height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: RED, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: '14px', fontWeight: 600, transition: 'background 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.background = RED_HOVER)}
                onMouseLeave={e => (e.currentTarget.style.background = RED)}
              >
                <img src="/icons/icon-search-white.svg" alt="" width={16} height={16} />
                Ver propiedades
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
