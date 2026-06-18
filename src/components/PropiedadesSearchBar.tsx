'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/* ── Tipos ─────────────────────────────────────────────────────────── */

export interface PropSearchFilters {
  tipo: 'Arrendar' | 'Comprar';
  sector: string;
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

const DEFAULT_FILTERS: PropSearchFilters = {
  tipo: 'Arrendar',
  sector: '',
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

const COMODIDADES = [
  'Amoblado', 'Balcón', 'Unidad Cerrada', 'Cuarto útil',
  'Piscina', 'Juegos infantiles', 'Ascensor',
];

const ESTRATOS = ['1', '2', '3', '4', '5', '6'];

/* ── Estilos ────────────────────────────────────────────────────────── */

const FONT      = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const RED       = '#f32735';
const RED_HOVER = '#aa182c';

function fmtCOP(n: number): string {
  if (n === 0) return '$ 0';
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `$ ${Number.isInteger(m) ? m : m.toFixed(1)}M`;
  }
  return `$ ${Math.round(n / 1_000)}K`;
}

/* ── PriceSlider inline ─────────────────────────────────────────────── */

function PriceSlider({ min, max, step, value, onChange }: {
  min: number; max: number; step: number;
  value: [number, number]; onChange: (v: [number, number]) => void;
}) {
  const [low, high] = value;
  const trackRef   = useRef<HTMLDivElement>(null);
  const dragging   = useRef<'low' | 'high' | null>(null);
  const lowRef     = useRef(low);
  const highRef    = useRef(high);
  lowRef.current   = low;
  highRef.current  = high;

  const pctLow  = ((low  - min) / (max - min)) * 100;
  const pctHigh = ((high - min) / (max - min)) * 100;

  const valFromX = (x: number) => {
    if (!trackRef.current) return null;
    const r = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (x - r.left) / r.width));
    return Math.round((min + pct * (max - min)) / step) * step;
  };

  const move = (x: number) => {
    const v = valFromX(x);
    if (v === null) return;
    if (dragging.current === 'low')
      onChange([Math.max(min, Math.min(v, highRef.current - step)), highRef.current]);
    else
      onChange([lowRef.current, Math.min(max, Math.max(v, lowRef.current + step))]);
  };

  const onMouseDown = (e: React.MouseEvent) => {
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

  return (
    <div style={{ userSelect: 'none', padding: '0 2px' }}>
      <div ref={trackRef} style={{ position: 'relative', height: '20px', cursor: 'pointer' }} onMouseDown={onMouseDown}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '3px', transform: 'translateY(-50%)', background: '#e8e8e8', borderRadius: '2px' }}>
          <div style={{ position: 'absolute', left: `${pctLow}%`, right: `${100 - pctHigh}%`, top: 0, bottom: 0, background: RED, borderRadius: '2px' }} />
        </div>
        <div style={{ position: 'absolute', left: `${pctLow}%`, top: '50%', transform: 'translate(-50%,-50%)', width: '12px', height: '12px', background: RED, border: '2px solid #fff', borderRadius: '50%', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', zIndex: 2 }} />
        <div style={{ position: 'absolute', left: `${pctHigh}%`, top: '50%', transform: 'translate(-50%,-50%)', width: '12px', height: '12px', background: RED, border: '2px solid #fff', borderRadius: '50%', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', zIndex: 2 }} />
      </div>
      <p style={{ fontFamily: FONT, fontSize: '12px', color: RED, textAlign: 'center', margin: '6px 0 0', fontWeight: 500 }}>
        {fmtCOP(low)} – {fmtCOP(high)}
      </p>
    </div>
  );
}

/* ── Chip genérico ──────────────────────────────────────────────────── */

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: FONT, fontSize: '12px', fontWeight: active ? 600 : 400,
        padding: '5px 12px', borderRadius: '20px', cursor: 'pointer',
        border: active ? `1.5px solid ${RED}` : '1.5px solid #e5e7eb',
        background: active ? `${RED}12` : '#fff',
        color: active ? RED : '#555',
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

/* ── Segmento del toolbar ─────────────────────────────────────────── */

function Segment({ label, valueLabel, active, isOpen, onClick, children, minWidth = 130 }: {
  label: string; valueLabel?: string; active?: boolean;
  isOpen: boolean; onClick: () => void;
  children?: React.ReactNode; minWidth?: number;
}) {
  const Chevron = isOpen ? ChevronUp : ChevronDown;
  const hasValue = !!valueLabel;

  return (
    <div style={{ position: 'relative', minWidth }}>
      <button
        type="button"
        onClick={onClick}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '0 16px', height: '52px', width: '100%',
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: FONT, fontSize: '13px',
          color: hasValue || active ? RED : '#333',
          fontWeight: hasValue || active ? 600 : 400,
          whiteSpace: 'nowrap',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => { if (!hasValue && !active) e.currentTarget.style.background = '#fafafa'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
      >
        <span>{hasValue ? valueLabel : label}</span>
        <Chevron size={13} strokeWidth={2} style={{ flexShrink: 0, color: hasValue || active ? RED : '#999' }} />
      </button>

      {isOpen && children && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 100,
          background: '#fff', border: '1px solid #e5e7eb',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)', borderRadius: '6px',
          minWidth: '220px', overflow: 'hidden',
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Contador (habitaciones / baños) ─────────────────────────────── */

function CounterDropdown({ value, onChange, max = 5 }: {
  value: number | null; onChange: (v: number | null) => void; max?: number;
}) {
  const options: Array<{ label: string; val: number | null }> = [
    { label: 'Cualquiera', val: null },
    ...Array.from({ length: max }, (_, i) => ({
      label: i + 1 < max ? `${i + 1}` : `${i + 1}+`,
      val: i + 1,
    })),
  ];
  return (
    <div style={{ padding: '12px 14px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {options.map(o => (
        <Chip key={o.label} label={o.label} active={value === o.val} onClick={() => onChange(o.val)} />
      ))}
    </div>
  );
}

/* ── Componente principal ─────────────────────────────────────────── */

export default function PropiedadesSearchBar({
  initialTipo = 'Arrendar',
  onApply,
}: {
  initialTipo?: 'Arrendar' | 'Comprar';
  onApply: (f: PropSearchFilters) => void;
}) {
  const [f, setF] = useState<PropSearchFilters>({ ...DEFAULT_FILTERS, tipo: initialTipo });
  const [open, setOpen]           = useState<string | null>(null);
  const [sectorQuery, setSectorQuery] = useState('');
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setF(prev => ({ ...prev, tipo: initialTipo })); }, [initialTipo]);

  /* Cierra al clic fuera */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = useCallback((name: string) => setOpen(prev => prev === name ? null : name), []);

  const update = useCallback(<K extends keyof PropSearchFilters>(key: K, val: PropSearchFilters[K]) => {
    setF(prev => ({ ...prev, [key]: val }));
  }, []);

  const toggleComodidad = useCallback((c: string) => {
    setF(prev => ({
      ...prev,
      comodidades: prev.comodidades.includes(c)
        ? prev.comodidades.filter(x => x !== c)
        : [...prev.comodidades, c],
    }));
  }, []);

  const toggleEstrato = useCallback((e: string) => {
    setF(prev => ({
      ...prev,
      estrato: prev.estrato.includes(e)
        ? prev.estrato.filter(x => x !== e)
        : [...prev.estrato, e],
    }));
  }, []);

  const clear = useCallback(() => {
    const reset = { ...DEFAULT_FILTERS, tipo: f.tipo };
    setF(reset);
    setOpen(null);
    onApply(reset);
  }, [f.tipo, onApply]);

  const apply = useCallback(() => {
    setOpen(null);
    onApply(f);
  }, [f, onApply]);

  /* Labels de resumen por filtro */
  const sectorLabel   = f.sector || undefined;
  const precioIsDefault = (f.tipo === 'Arrendar' ? f.precioMax === 15_000_000 : f.precioMax === 500_000_000) && f.precioMin === 0;
  const precioLabel   = !precioIsDefault ? `${fmtCOP(f.precioMin)} – ${fmtCOP(f.precioMax)}` : undefined;
  const habLabel      = f.habitaciones !== null ? (f.habitaciones >= 5 ? '5+' : `${f.habitaciones} hab`) : undefined;
  const banosLabel    = f.banos !== null ? (f.banos >= 4 ? '4+' : `${f.banos} baños`) : undefined;
  const parqLabel     = f.parqueadero ? (f.parqueadero === 'con' ? 'Con parq.' : 'Sin parq.') : undefined;
  const extraCount    = (f.estrato.length > 0 ? 1 : 0) + f.comodidades.length + (f.areaMin || f.areaMax ? 1 : 0);
  const masLabel      = extraCount > 0 ? `${extraCount} filtro${extraCount > 1 ? 's' : ''}` : undefined;

  const isArrendar = f.tipo === 'Arrendar';
  const precioMin  = isArrendar ? 0 : 30_000_000;
  const precioMax  = isArrendar ? 15_000_000 : 500_000_000;
  const precioStep = isArrendar ? 250_000 : 5_000_000;

  const filteredSectores = sectorQuery
    ? SECTORES.filter(s => s.toLowerCase().includes(sectorQuery.toLowerCase()))
    : SECTORES;

  const SEP = <div style={{ width: '1px', height: '28px', background: '#e5e7eb', flexShrink: 0 }} />;

  return (
    <div
      ref={barRef}
      style={{
        background: '#fff',
        borderBottom: '1px solid #ebebeb',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'visible',
        position: 'relative',
        zIndex: 40,
      }}
    >
      {/* Tipo toggle */}
      <div style={{ position: 'relative', minWidth: 120 }}>
        <button
          type="button"
          onClick={() => {
            const next: 'Arrendar' | 'Comprar' = f.tipo === 'Arrendar' ? 'Comprar' : 'Arrendar';
            const newF = { ...f, tipo: next, precioMin: 0, precioMax: next === 'Arrendar' ? 15_000_000 : 500_000_000 };
            setF(newF);
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0 16px', height: '52px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: FONT, fontSize: '13px', fontWeight: 600, color: RED,
            whiteSpace: 'nowrap',
          }}
        >
          {f.tipo}
          <ChevronDown size={13} strokeWidth={2.5} style={{ color: RED }} />
        </button>
      </div>

      {SEP}

      {/* Sector */}
      <Segment label="Sector" valueLabel={sectorLabel} isOpen={open === 'sector'} onClick={() => toggle('sector')} minWidth={150}>
        <div style={{ padding: '10px 12px 6px' }}>
          <input
            autoFocus
            type="text"
            placeholder="Buscar sector..."
            value={sectorQuery}
            onChange={e => setSectorQuery(e.target.value)}
            style={{
              width: '100%', fontFamily: FONT, fontSize: '13px', padding: '7px 10px',
              border: '1px solid #e5e7eb', borderRadius: '4px', outline: 'none',
              color: '#333',
            }}
          />
        </div>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <button
            type="button"
            onClick={() => { update('sector', ''); setSectorQuery(''); setOpen(null); }}
            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 14px', fontFamily: FONT, fontSize: '13px', color: f.sector === '' ? RED : '#555', fontWeight: f.sector === '' ? 600 : 400, background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            Todos los sectores
          </button>
          {filteredSectores.map(s => (
            <button key={s} type="button"
              onClick={() => { update('sector', s); setSectorQuery(''); setOpen(null); }}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 14px', fontFamily: FONT, fontSize: '13px', color: f.sector === s ? RED : '#555', fontWeight: f.sector === s ? 600 : 400, background: f.sector === s ? '#fff5f5' : 'transparent', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => { if (f.sector !== s) e.currentTarget.style.background = '#fafafa'; }}
              onMouseLeave={e => { if (f.sector !== s) e.currentTarget.style.background = 'transparent'; }}
            >
              {s}
            </button>
          ))}
        </div>
      </Segment>

      {SEP}

      {/* Precio */}
      <Segment label="Precio" valueLabel={precioLabel} isOpen={open === 'precio'} onClick={() => toggle('precio')} minWidth={150}>
        <div style={{ padding: '16px 18px 20px' }}>
          <PriceSlider
            min={precioMin} max={precioMax} step={precioStep}
            value={[f.precioMin, f.precioMax]}
            onChange={([lo, hi]) => setF(prev => ({ ...prev, precioMin: lo, precioMax: hi }))}
          />
        </div>
      </Segment>

      {SEP}

      {/* Habitaciones */}
      <Segment label="Habitaciones" valueLabel={habLabel} isOpen={open === 'hab'} onClick={() => toggle('hab')} minWidth={150}>
        <CounterDropdown value={f.habitaciones} onChange={v => update('habitaciones', v)} max={5} />
      </Segment>

      {SEP}

      {/* Baños */}
      <Segment label="Baños" valueLabel={banosLabel} isOpen={open === 'banos'} onClick={() => toggle('banos')} minWidth={120}>
        <CounterDropdown value={f.banos} onChange={v => update('banos', v)} max={4} />
      </Segment>

      {SEP}

      {/* Parqueadero */}
      <Segment label="Parqueadero" valueLabel={parqLabel} isOpen={open === 'parq'} onClick={() => toggle('parq')} minWidth={150}>
        <div style={{ padding: '12px 14px', display: 'flex', gap: '6px' }}>
          <Chip label="Cualquiera" active={f.parqueadero === null} onClick={() => update('parqueadero', null)} />
          <Chip label="Con parqueadero" active={f.parqueadero === 'con'} onClick={() => update('parqueadero', 'con')} />
          <Chip label="Sin parqueadero" active={f.parqueadero === 'sin'} onClick={() => update('parqueadero', 'sin')} />
        </div>
      </Segment>

      {SEP}

      {/* Más filtros */}
      <Segment label="Más filtros" valueLabel={masLabel} isOpen={open === 'mas'} onClick={() => toggle('mas')} minWidth={140}>
        <div style={{ padding: '16px 18px', width: '340px' }}>
          {/* Área */}
          <p style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 600, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Área (m²)</p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
            <input
              type="number" placeholder="Desde"
              value={f.areaMin}
              onChange={e => update('areaMin', e.target.value)}
              style={{ flex: 1, fontFamily: FONT, fontSize: '13px', padding: '7px 10px', border: '1px solid #e5e7eb', borderRadius: '4px', outline: 'none', color: '#333' }}
            />
            <input
              type="number" placeholder="Hasta"
              value={f.areaMax}
              onChange={e => update('areaMax', e.target.value)}
              style={{ flex: 1, fontFamily: FONT, fontSize: '13px', padding: '7px 10px', border: '1px solid #e5e7eb', borderRadius: '4px', outline: 'none', color: '#333' }}
            />
          </div>

          {/* Estrato */}
          <p style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 600, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Estrato</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
            {ESTRATOS.map(e => (
              <Chip key={e} label={e} active={f.estrato.includes(e)} onClick={() => toggleEstrato(e)} />
            ))}
          </div>

          {/* Comodidades */}
          <p style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 600, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Otras comodidades</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {COMODIDADES.map(c => (
              <Chip key={c} label={c} active={f.comodidades.includes(c)} onClick={() => toggleComodidad(c)} />
            ))}
          </div>
        </div>
      </Segment>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Limpiar */}
      <button
        type="button"
        onClick={clear}
        style={{
          fontFamily: FONT, fontSize: '13px', fontWeight: 400, color: '#888',
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '0 16px', height: '52px', whiteSpace: 'nowrap',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#333')}
        onMouseLeave={e => (e.currentTarget.style.color = '#888')}
      >
        Limpiar
      </button>

      {/* Filtrar */}
      <button
        type="button"
        onClick={apply}
        style={{
          fontFamily: FONT, fontSize: '13px', fontWeight: 600, color: '#fff',
          background: RED, border: 'none', cursor: 'pointer',
          padding: '0 24px', height: '52px', whiteSpace: 'nowrap',
          flexShrink: 0,
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = RED_HOVER)}
        onMouseLeave={e => (e.currentTarget.style.background = RED)}
      >
        Filtrar
      </button>
    </div>
  );
}
