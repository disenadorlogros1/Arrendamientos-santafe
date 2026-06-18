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
const COLOR_LABEL = '#909090';
const COLOR_VALUE = '#232222';
const RED         = '#f32735';
const RED_HOVER   = '#aa182c';
const CELL_H      = 56;
const DIVIDER     = '1px solid rgba(0,0,0,0.07)';

/* ── Types ──────────────────────────────────────────────────────────── */

export interface PropSearchFilters {
  tipo: 'Todos' | 'Arrendar' | 'Comprar';
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
  min, max, step, value, onChange,
}: { min: number; max: number; step: number; value: [number, number]; onChange: (v: [number, number]) => void }) {
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
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '3px', transform: 'translateY(-50%)', background: '#e8e8e8', borderRadius: '2px', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: `${pctLow}%`, right: `${100 - pctHigh}%`, top: 0, bottom: 0, background: RED, borderRadius: '2px' }} />
        </div>
        <div style={{ position: 'absolute', left: `${pctLow}%`, top: '50%', transform: 'translate(-50%,-50%)', width: '10px', height: '10px', background: RED, borderRadius: '50%', pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', left: `${pctHigh}%`, top: '50%', transform: 'translate(-50%,-50%)', width: '10px', height: '10px', background: RED, borderRadius: '50%', pointerEvents: 'none', zIndex: 2 }} />
      </div>
      <p style={{ fontFamily: FONT, fontSize: '12px', fontWeight: 500, color: COLOR_VALUE, textAlign: 'center', margin: '8px 0 0', lineHeight: 1 }}>
        {fmtCOP(low)} – {fmtCOP(high)}
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
  const min  = isComprar ? 30_000_000  : 0;
  const max  = isComprar ? 500_000_000 : 15_000_000;
  const step = isComprar ? 5_000_000   : 250_000;

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
    <div ref={dropdownRef} style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}>
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
        <span style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400, color: display ? COLOR_VALUE : '#b8b8b8', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {display || 'Seleccionar'}
        </span>
      </button>
      {dropdown && createPortal(dropdown, document.body)}
    </div>
  );
}

/* ── CustomSelect — dropdown buscable portal ─────────────────────────── */

function CustomSelect({
  value, onChange, options, placeholder, searchable = false,
}: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; searchable?: boolean }) {
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
    <div ref={dropdownRef} style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}>
      <div className="bg-white shadow-2xl border border-gray-100 max-h-[240px] overflow-y-auto custom-scrollbar">
        {filtered.length === 0
          ? <p style={{ fontFamily: FONT, fontSize: '13px', padding: '10px 16px', color: '#aaa' }}>Sin resultados</p>
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
        <span style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400, color: value ? COLOR_VALUE : '#b8b8b8', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value || placeholder || 'Seleccionar'}
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
        padding: '5px 14px',
        border: `1px solid ${active ? RED : 'rgba(0,0,0,0.15)'}`,
        background: active ? RED : 'transparent',
        color: active ? '#fff' : '#555',
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

const advLabelStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: '11px',
  color: '#555',
  fontWeight: 500,
  marginBottom: '10px',
  lineHeight: 1,
};

/* ── Componente principal ────────────────────────────────────────────── */

interface Props {
  initialTipo?: 'Todos' | 'Arrendar' | 'Comprar';
  onApply: (f: PropSearchFilters) => void;
}

export default function PropiedadesSearchBar({ initialTipo = 'Todos', onApply }: Props) {
  const [tipo,          setTipo]          = useState<'Todos' | 'Arrendar' | 'Comprar'>(initialTipo);
  const [codigo,        setCodigo]        = useState('');
  const [sector,        setSector]        = useState('');
  const [tipoPropiedad, setTipoPropiedad] = useState('');
  const [precioRange,   setPrecioRange]   = useState<[number, number]>([0, 15_000_000]);
  const [showAdvanced,  setShowAdvanced]  = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [habitaciones, setHabitaciones] = useState<number | null>(null);
  const [banos,        setBanos]        = useState<number | null>(null);
  const [parqueadero,  setParqueadero]  = useState<'con' | 'sin' | null>(null);
  const [areaMin,      setAreaMin]      = useState('');
  const [areaMax,      setAreaMax]      = useState('');
  const [estrato,      setEstrato]      = useState<string[]>([]);
  const [comodidades,  setComodidades]  = useState<string[]>([]);

  useEffect(() => { setTipo(initialTipo); }, [initialTipo]);

  // Cierra búsqueda avanzada al hacer clic fuera del componente
  useEffect(() => {
    if (!showAdvanced) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowAdvanced(false);
      }
    };
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => { clearTimeout(id); document.removeEventListener('mousedown', handler); };
  }, [showAdvanced]);

  const searchType: 'arrendar' | 'comprar' | null =
    tipo === 'Comprar' ? 'comprar' : tipo === 'Arrendar' ? 'arrendar' : null;

  const handleApply = () => {
    onApply({
      tipo, codigo, sector, tipoPropiedad,
      precioMin: precioRange[0], precioMax: precioRange[1],
      habitaciones, banos, parqueadero,
      areaMin, areaMax, estrato, comodidades,
    });
  };

  const handleClear = () => {
    const defaultRange: [number, number] = tipo === 'Comprar'
      ? [30_000_000, 500_000_000]
      : [0, 15_000_000];
    setCodigo(''); setSector(''); setTipoPropiedad('');
    setPrecioRange(defaultRange);
    setHabitaciones(null); setBanos(null); setParqueadero(null);
    setAreaMin(''); setAreaMax(''); setEstrato([]); setComodidades([]);
    onApply({ ...DEFAULT_FILTERS, tipo, precioMin: defaultRange[0], precioMax: defaultRange[1] });
  };

  const toggleEstrato   = (e: string) => setEstrato(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);
  const toggleComodidad = (c: string) => setComodidades(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  return (
    <div ref={wrapperRef} style={{ maxWidth: '1400px', margin: '0 auto', padding: '10px clamp(16px, 3vw, 52px)' }}>
      <div style={{
        background: '#fff',
        border: '1px solid #e8e8e8',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
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
                  setTipo(t);
                  if (t === 'Comprar') setPrecioRange([30_000_000, 500_000_000]);
                  else setPrecioRange([0, 15_000_000]);
                }}
                style={{
                  flex: 1,
                  height: '100%',
                  background: active ? RED : 'transparent',
                  color: active ? '#fff' : '#666',
                  fontFamily: FONT,
                  fontSize: '14px',
                  fontWeight: active ? 600 : 400,
                  border: 'none',
                  borderRight: i < 2 ? DIVIDER : 'none',
                  cursor: 'pointer',
                  letterSpacing: '0.01em',
                  transition: 'background 0.2s ease, color 0.2s ease',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* ── Fila 2: Celdas de filtros — mismo look que hero ───────── */}
        <div style={{ display: 'flex', borderBottom: DIVIDER }}>

          {/* Código inmueble */}
          <div style={{ flex: 1, borderRight: DIVIDER }}>
            <div style={contentStyle}>
              <img src="/icons/icon-code-red.gif" alt="" width={24} height={24} style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={labelStyle}>Código inmueble</p>
                <input
                  type="text"
                  value={codigo}
                  onChange={e => setCodigo(e.target.value)}
                  placeholder="Ej: A11636"
                  className="search-field-input"
                  style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400, color: codigo ? COLOR_VALUE : '#b8b8b8', background: 'transparent', border: 'none', outline: 'none', width: '100%', lineHeight: 1 }}
                />
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div style={{ flex: 1, borderRight: DIVIDER }}>
            <div style={contentStyle}>
              <img src="/icons/icon-location-red.gif" alt="" width={24} height={24} style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={labelStyle}>Ubicación</p>
                <CustomSelect value={sector} onChange={setSector} options={SECTORES} placeholder="Seleccionar" searchable />
              </div>
            </div>
          </div>

          {/* Tipo de propiedad */}
          <div style={{ flex: 1, borderRight: DIVIDER }}>
            <div style={contentStyle}>
              <img src="/icons/icon-home-red.gif" alt="" width={24} height={24} style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={labelStyle}>Tipo de propiedad</p>
                <CustomSelect value={tipoPropiedad} onChange={setTipoPropiedad} options={TIPOS_INMUEBLE} placeholder="Seleccionar" searchable />
              </div>
            </div>
          </div>

          {/* Precio */}
          <div style={{ flex: 1 }}>
            <div style={contentStyle}>
              <img src="/icons/icon-dollar-red.gif" alt="" width={24} height={24} style={{ flexShrink: 0, alignSelf: 'flex-start', marginTop: '2px' }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={labelStyle}>Precio</p>
                <PriceSelect value={precioRange} onChange={setPrecioRange} searchType={searchType} />
              </div>
            </div>
          </div>

        </div>

        {/* ── Panel búsqueda avanzada ───────────────────────────────── */}
        {showAdvanced && (
          <div style={{ padding: '20px 24px', borderBottom: DIVIDER, background: '#fafafa' }}>

            {/* Fila 1: Habitaciones · Baños · Parqueadero · Área */}
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginBottom: '20px' }}>

              <div>
                <p style={advLabelStyle}>Habitaciones</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <Chip key={n} label={n === 5 ? '5+' : String(n)} active={habitaciones === n} onClick={() => setHabitaciones(habitaciones === n ? null : n)} />
                  ))}
                </div>
              </div>

              <div>
                <p style={advLabelStyle}>Baños</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1, 2, 3, 4].map(n => (
                    <Chip key={n} label={n === 4 ? '4+' : String(n)} active={banos === n} onClick={() => setBanos(banos === n ? null : n)} />
                  ))}
                </div>
              </div>

              <div>
                <p style={advLabelStyle}>Parqueadero</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <Chip label="Con parqueadero" active={parqueadero === 'con'} onClick={() => setParqueadero(parqueadero === 'con' ? null : 'con')} />
                  <Chip label="Sin parqueadero" active={parqueadero === 'sin'} onClick={() => setParqueadero(parqueadero === 'sin' ? null : 'sin')} />
                </div>
              </div>

              <div>
                <p style={advLabelStyle}>Área (m²)</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="number" value={areaMin} onChange={e => setAreaMin(e.target.value)} placeholder="Mín"
                    style={{ fontFamily: FONT, fontSize: '13px', color: COLOR_VALUE, background: '#fff', border: '1px solid rgba(0,0,0,0.15)', outline: 'none', padding: '6px 10px', width: '80px' }}
                  />
                  <span style={{ fontFamily: FONT, fontSize: '12px', color: '#aaa' }}>–</span>
                  <input
                    type="number" value={areaMax} onChange={e => setAreaMax(e.target.value)} placeholder="Máx"
                    style={{ fontFamily: FONT, fontSize: '13px', color: COLOR_VALUE, background: '#fff', border: '1px solid rgba(0,0,0,0.15)', outline: 'none', padding: '6px 10px', width: '80px' }}
                  />
                </div>
              </div>

            </div>

            {/* Fila 2: Estrato + Comodidades en la misma línea */}
            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

              <div style={{ flexShrink: 0 }}>
                <p style={advLabelStyle}>Estrato</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {ESTRATOS.map(e => (
                    <Chip key={e} label={e} active={estrato.includes(e)} onClick={() => toggleEstrato(e)} />
                  ))}
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={advLabelStyle}>Comodidades</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {COMODIDADES.map(c => (
                    <Chip key={c} label={c} active={comodidades.includes(c)} onClick={() => toggleComodidad(c)} />
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ── Fila 3: Acciones ──────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', height: '48px', background: '#fafafa' }}>

          <button
            type="button"
            onClick={() => setShowAdvanced(v => !v)}
            style={{
              display: 'flex', alignItems: 'center',
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '0 20px',
              fontFamily: FONT, fontSize: '13px', color: '#555', fontWeight: 400,
            }}
          >
            Búsqueda avanzada
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingRight: '4px' }}>
            <button
              type="button"
              onClick={handleClear}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: '13px', color: '#999', padding: '0 8px' }}
            >
              Limpiar
            </button>

            <button
              type="button"
              onClick={handleApply}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: RED, color: '#fff',
                fontFamily: FONT, fontSize: '14px', fontWeight: 600,
                border: 'none', cursor: 'pointer',
                padding: '0 28px',
                height: '100%',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = RED_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.background = RED)}
            >
              <img src="/icons/icon-search-white.gif" alt="" width={16} height={16} />
              Buscar inmueble
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
