'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

/* ── Datos ───────────────────────────────────────────────────────── */

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
  'Local comercial', 'Bodega', 'Lote', 'Finca',
];

function fmtCOP(n: number): string {
  if (n === 0) return '$ 0';
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `$ ${Number.isInteger(m) ? m : m.toFixed(1)}M`;
  }
  return `$ ${Math.round(n / 1_000)}K`;
}

interface PriceRangeProps {
  min: number; max: number; step: number;
  value: [number, number]; onChange: (v: [number, number]) => void;
}

function PriceRangeSlider({ min, max, step, value, onChange }: PriceRangeProps) {
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
        {fmtCOP(low)} – {fmtCOP(high)}
      </p>
    </div>
  );
}

function PriceSelect({
  value, onChange, searchType, onOpen,
}: {
  value: [number, number]; onChange: (v: [number, number]) => void;
  searchType: 'arrendar' | 'comprar' | null; onOpen?: () => void;
}) {
  const [open, setOpen]       = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef             = useRef<HTMLButtonElement>(null);
  const dropdownRef           = useRef<HTMLDivElement>(null);
  const [pos, setPos]         = useState({ top: 0, left: 0, width: 0 });

  const isArrendar = searchType !== 'comprar';
  const min  = isArrendar ? 0          : 30_000_000;
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
        onClick={() => { if (!open) { updatePos(); onOpen?.(); setOpen(true); } else setOpen(false); }}
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

/* ── Constantes ──────────────────────────────────────────────────── */

const FONT        = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const COLOR_LABEL = '#888';
const COLOR_VALUE = '#1a1a1a';
const RED         = '#f32735';
const RED_HOVER   = '#aa182c';
const ICON_ONLY_W = 52;

/* ── CustomSelect ────────────────────────────────────────────────── */

function CustomSelect({
  value, onChange, options, placeholder, onOpen, searchable = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string; onOpen?: () => void; searchable?: boolean;
}) {
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

  const openDropdown = useCallback(() => {
    updatePos(); onOpen?.(); setQuery(''); setOpen(true);
  }, [updatePos, onOpen]);

  const toggle = useCallback(() => {
    if (!open) openDropdown(); else setOpen(false);
  }, [open, openDropdown]);

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
    const el = dropdownRef.current;
    if (!el || !open) return;
    const stop = (e: WheelEvent) => e.stopPropagation();
    el.addEventListener('wheel', stop, { passive: false });
    return () => el.removeEventListener('wheel', stop);
  }, [open]);

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
          ? <p style={{ fontFamily: FONT, fontSize: '13px', padding: '10px 16px', color: '#ccc' }}>Sin resultados</p>
          : filtered.map(opt => (
            <button key={opt} type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => selectOption(opt)}
              className={`block w-full text-left px-4 py-2.5 transition-colors duration-100 ${
                value === opt ? 'bg-brand-red text-white' : 'text-gray-700 hover:bg-brand-red hover:text-white'
              }`}
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
          style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400, color: COLOR_VALUE, background: 'transparent', border: 'none', outline: 'none', width: '100%', minWidth: 0, lineHeight: 1 }}
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

/* ── Props ───────────────────────────────────────────────────────── */

interface SearchFormProps {
  mobileExpanded?: boolean;
  onMobileExpand?: (expanded: boolean) => void;
  onNavigate?: (page: 'propiedades') => void;
}

/* ── Componente principal ────────────────────────────────────────── */

export default function SearchForm({ onNavigate }: SearchFormProps) {
  const router = useRouter();

  const [searchType,  setSearchType]  = useState<'arrendar' | 'comprar' | null>(null);
  const [queString,   setQueString]   = useState('');
  const [queActive,   setQueActive]   = useState(false);
  const [codigoActive,setCodigoActive]= useState(false);
  const [codigo,      setCodigo]      = useState('');
  const [sector,      setSector]      = useState('');
  const [tipo,        setTipo]        = useState('');
  const [precioRange, setPrecioRange] = useState<[number, number]>([0, 15_000_000]);

  /* ── Refs ── */
  const searchWrapRef  = useRef<HTMLDivElement>(null);
  const row2Ref        = useRef<HTMLDivElement>(null);
  const queCellRef     = useRef<HTMLDivElement>(null);
  const codigoCellRef  = useRef<HTMLDivElement>(null);
  const precioRef      = useRef<HTMLDivElement>(null);
  const queInputRef    = useRef<HTMLInputElement>(null);
  const codigoInputRef = useRef<HTMLInputElement>(null);

  /* Widths naturales (alineados con Precio) */
  const queNatW   = useRef(0);
  const codNatW   = useRef(0);
  const animLocked = useRef(false);

  /* ── Alineación: Código empieza donde empieza Precio ── */
  const applyAlign = useCallback(() => {
    if (animLocked.current) return;
    if (!precioRef.current || !row2Ref.current || !queCellRef.current || !codigoCellRef.current) return;
    const r2  = row2Ref.current.getBoundingClientRect();
    const pr  = precioRef.current.getBoundingClientRect();
    const qW  = pr.left - r2.left;
    const cW  = r2.width - qW;
    if (qW <= 10 || cW <= 10) return;
    queNatW.current  = qW;
    codNatW.current  = cW;
    gsap.set(queCellRef.current,  { width: qW, flexShrink: 0, flexGrow: 0, flexBasis: 'auto' });
    gsap.set(codigoCellRef.current,{ width: cW, flexShrink: 0, flexGrow: 0, flexBasis: 'auto' });
  }, []);

  useEffect(() => {
    // Delay to let Row 3 render first so precioRef is measurable
    const t = setTimeout(applyAlign, 0);
    const ro = new ResizeObserver(() => { if (!animLocked.current) applyAlign(); });
    if (row2Ref.current) ro.observe(row2Ref.current);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, [applyAlign]);

  /* ── Qué buscas ── */
  const activateQue = useCallback(() => {
    if (queActive) return;
    gsap.killTweensOf([queCellRef.current, codigoCellRef.current]);
    setCodigoActive(false);
    setQueActive(true);
    animLocked.current = true;
    const totalW = row2Ref.current?.getBoundingClientRect().width ?? 0;
    gsap.to(codigoCellRef.current, { width: 0, opacity: 0, duration: 0.32, ease: 'power3.out', overwrite: true });
    gsap.to(queCellRef.current,    { width: totalW, duration: 0.32, ease: 'power3.out', overwrite: true });
    setTimeout(() => queInputRef.current?.focus(), 10);
  }, [queActive]);

  const deactivateQue = useCallback(() => {
    setQueActive(false);
    queInputRef.current?.blur();
    gsap.to(queCellRef.current,     { width: queNatW.current, duration: 0.32, ease: 'power3.out', overwrite: true });
    gsap.to(codigoCellRef.current,  { width: codNatW.current, opacity: 1, duration: 0.32, ease: 'power3.out', overwrite: true,
      onComplete: () => { animLocked.current = false; applyAlign(); },
    });
  }, [applyAlign]);

  /* ── Código inmueble ── */
  const activateCodigo = useCallback(() => {
    if (codigoActive || queActive) return;
    const qW = queNatW.current || (queCellRef.current?.getBoundingClientRect().width ?? 0);
    const cW = codNatW.current  || (codigoCellRef.current?.getBoundingClientRect().width ?? 0);
    if (!queNatW.current)  queNatW.current  = qW;
    if (!codNatW.current)  codNatW.current  = cW;
    setCodigoActive(true);
    animLocked.current = true;
    gsap.to(queCellRef.current,    { width: ICON_ONLY_W, duration: 0.35, ease: 'power3.out', overwrite: true });
    gsap.to(codigoCellRef.current, { width: qW + cW - ICON_ONLY_W, duration: 0.35, ease: 'power3.out', overwrite: true });
    setTimeout(() => codigoInputRef.current?.focus(), 50);
  }, [codigoActive, queActive]);

  const deactivateCodigo = useCallback(() => {
    if (!codigoActive) return;
    setCodigoActive(false);
    gsap.to(queCellRef.current,    { width: queNatW.current, duration: 0.35, ease: 'power3.out', overwrite: true });
    gsap.to(codigoCellRef.current, { width: codNatW.current, duration: 0.35, ease: 'power3.out', overwrite: true,
      onComplete: () => { animLocked.current = false; applyAlign(); },
    });
  }, [codigoActive, applyAlign]);

  /* ── Buscar ── */
  const handleBuscar = useCallback(() => {
    if (queString.trim()) {
      router.push(`/propiedades?q=${encodeURIComponent(queString.trim())}`);
    } else {
      onNavigate?.('propiedades');
    }
  }, [queString, router, onNavigate]);

  /* ── Click fuera → deactivate ── */
  useEffect(() => {
    if (!queActive && !codigoActive) return;
    const handler = (e: MouseEvent) => {
      if (!searchWrapRef.current?.contains(e.target as Node)) {
        if (queActive) deactivateQue();
        else deactivateCodigo();
      }
    };
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 50);
    return () => { clearTimeout(id); document.removeEventListener('mousedown', handler); };
  }, [queActive, codigoActive, deactivateQue, deactivateCodigo]);

  /* ── Click dentro del form sobre area que no es Código → deactivate codigo ── */
  const handleFormClick = useCallback((e: React.MouseEvent) => {
    if (codigoActive && !codigoCellRef.current?.contains(e.target as Node)) {
      deactivateCodigo();
    }
  }, [codigoActive, deactivateCodigo]);

  /* ── Estilos ── */
  const fieldContent: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '14px 20px', minWidth: 0, width: '100%', height: '52px',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: FONT, fontSize: '11px', color: COLOR_LABEL,
    fontWeight: 300, marginBottom: '3px', lineHeight: 1, whiteSpace: 'nowrap',
  };
  const BORDER = '1px solid rgba(0,0,0,0.07)';

  /* ── Render ── */
  return (
    <div ref={searchWrapRef} className="w-full overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.35)' }} onClick={handleFormClick}>

      {/* ── Fila 1: Tabs ─────────────────────────────────────────── */}
      <div className="flex" style={{ height: '44px' }}>
        {(['arrendar', 'comprar'] as const).map((t, i) => {
          const active = searchType === t;
          return (
            <button key={t} type="button"
              onClick={() => { setSearchType(t); setPrecioRange(t === 'comprar' ? [30_000_000, 500_000_000] : [0, 15_000_000]); }}
              style={{
                flex: 1, height: '100%',
                background: active ? RED : 'rgba(255,255,255,0.4)',
                backdropFilter: active ? 'none' : 'blur(6px)',
                WebkitBackdropFilter: active ? 'none' : 'blur(6px)',
                color: active ? '#fff' : 'rgba(255,255,255,0.92)',
                fontFamily: FONT, fontSize: '15px', fontWeight: active ? 600 : 400,
                border: 'none', borderRight: i === 0 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                cursor: 'pointer', letterSpacing: '0.01em',
                transition: 'background 0.2s ease, color 0.2s ease',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.55)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.4)'; }}
            >
              {t === 'arrendar' ? 'Arrendar' : 'Comprar'}
            </button>
          );
        })}
      </div>

      {/* ── MOBILE ───────────────────────────────────────────────── */}
      <div className="lg:hidden">
        <div style={{
          maxHeight: searchType ? 'min(500px, calc(100dvh - 180px))' : '0px',
          overflow: searchType ? 'auto' : 'hidden',
          transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)',
          background: '#fff',
        }}>
          {/* Qué buscas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={labelStyle}>¿Qué buscas?</p>
              <input type="text" value={queString} onChange={e => setQueString(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleBuscar(); }}
                placeholder="Ej: inmueble cerca a Niquía" className="search-field-input"
                style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400, color: queString ? COLOR_VALUE : '#ccc', background: 'transparent', border: 'none', outline: 'none', width: '100%', lineHeight: 1 }} />
            </div>
          </div>
          {/* Código */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <img src="/icons/icon-code-red.gif" alt="" width={20} height={20} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={labelStyle}>Código inmueble</p>
              <input type="text" value={codigo} onChange={e => setCodigo(e.target.value)}
                placeholder="Ej: 12345" className="search-field-input"
                style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400, color: codigo ? COLOR_VALUE : '#ccc', background: 'transparent', border: 'none', outline: 'none', width: '100%', lineHeight: 1 }} />
            </div>
          </div>
          {/* Ubicación */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <img src="/icons/icon-location-red.gif" alt="" width={20} height={20} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={labelStyle}>Ubicación</p>
              <CustomSelect label="Ubicación" value={sector} onChange={setSector} options={SECTORES} placeholder="Seleccionar" />
            </div>
          </div>
          {/* Tipo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <img src="/icons/icon-home-red.gif" alt="" width={20} height={20} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={labelStyle}>Tipo de propiedad</p>
              <CustomSelect label="Tipo" value={tipo} onChange={setTipo} options={TIPOS_INMUEBLE} placeholder="Seleccionar" />
            </div>
          </div>
          {/* Precio */}
          <div style={{ padding: '13px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
              <img src="/icons/icon-dollar-red.gif" alt="" width={20} height={20} style={{ flexShrink: 0 }} />
              <p style={labelStyle}>Precio</p>
            </div>
            <PriceRangeSlider
              min={searchType === 'comprar' ? 30_000_000 : 0}
              max={searchType === 'comprar' ? 500_000_000 : 15_000_000}
              step={searchType === 'comprar' ? 5_000_000 : 250_000}
              value={precioRange} onChange={setPrecioRange}
            />
          </div>
        </div>
        <button type="button" onClick={handleBuscar}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: RED, color: '#fff', fontFamily: FONT, fontSize: '15px', fontWeight: 600, border: 'none', cursor: 'pointer', padding: '16px 0', transition: 'background 0.2s ease' }}
          onMouseEnter={e => (e.currentTarget.style.background = RED_HOVER)}
          onMouseLeave={e => (e.currentTarget.style.background = RED)}
        >
          <img src="/icons/icon-search-white.gif" alt="" width={18} height={18} />
          <span>Buscar inmueble</span>
        </button>
      </div>

      {/* ── DESKTOP ──────────────────────────────────────────────── */}
      <div className="hidden lg:block" style={{ background: '#fff' }}>

        {/* ── Fila 2: Qué buscas + Código ── */}
        <div ref={row2Ref} style={{ display: 'flex', borderBottom: BORDER, overflow: 'hidden' }}>

          {/* Qué buscas */}
          <div
            ref={queCellRef}
            style={{ flex: '3 3 60%', overflow: 'hidden', borderRight: BORDER, position: 'relative', cursor: 'text' }}
            onClick={codigoActive ? undefined : activateQue}
          >
            {/* Ícono solo (visible cuando codigoActive) */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: codigoActive ? 1 : 0,
              pointerEvents: codigoActive ? 'auto' : 'none',
              transition: 'opacity 0.18s ease',
              cursor: 'pointer',
            }} onClick={activateQue}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>

            {/* Contenido completo */}
            <div style={{ ...fieldContent, opacity: codigoActive ? 0 : 1, transition: 'opacity 0.15s ease' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke={queActive ? RED : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ flexShrink: 0, transition: 'stroke 0.2s ease' }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={labelStyle}>¿Qué buscas?</p>
                <input
                  ref={queInputRef}
                  type="text"
                  value={queString}
                  onChange={e => setQueString(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleBuscar(); if (e.key === 'Escape') deactivateQue(); }}
                  onFocus={activateQue}
                  placeholder="Ej: inmueble cerca a estación del metro"
                  className="search-field-input"
                  style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400, color: queString ? COLOR_VALUE : '#ccc', background: 'transparent', border: 'none', outline: 'none', width: '100%', lineHeight: 1 }}
                />
              </div>
            </div>
          </div>

          {/* Código inmueble */}
          <div
            ref={codigoCellRef}
            style={{ flex: '2 2 40%', overflow: 'hidden', cursor: 'text' }}
            onClick={activateCodigo}
          >
            <div style={fieldContent}>
              <img src="/icons/icon-code-red.gif" alt="" width={24} height={24} style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={labelStyle}>Código inmueble</p>
                <input
                  ref={codigoInputRef}
                  type="text"
                  value={codigo}
                  onChange={e => setCodigo(e.target.value)}
                  placeholder="Ej: 12345"
                  className="search-field-input"
                  onFocus={activateCodigo}
                  style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400, color: codigo ? COLOR_VALUE : '#ccc', background: 'transparent', border: 'none', outline: 'none', width: '100%', lineHeight: 1 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Fila 3: Filtros / Atrás+Buscar ── */}
        <div style={{ position: 'relative', height: '52px' }}>

          {/* Normal */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            opacity: queActive ? 0 : 1,
            pointerEvents: queActive ? 'none' : 'auto',
            transition: 'opacity 0.2s ease',
          }}>
            {/* Ubicación */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', borderRight: BORDER }}>
              <div style={fieldContent}>
                <img src="/icons/icon-location-red.gif" alt="" width={24} height={24} style={{ flexShrink: 0 }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={labelStyle}>Ubicación</p>
                  <CustomSelect label="Ubicación" value={sector} onChange={setSector} options={SECTORES} placeholder="Seleccionar" searchable />
                </div>
              </div>
            </div>
            {/* Tipo */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', borderRight: BORDER }}>
              <div style={fieldContent}>
                <img src="/icons/icon-home-red.gif" alt="" width={24} height={24} style={{ flexShrink: 0 }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={labelStyle}>Tipo de propiedad</p>
                  <CustomSelect label="Tipo" value={tipo} onChange={setTipo} options={TIPOS_INMUEBLE} placeholder="Seleccionar" searchable />
                </div>
              </div>
            </div>
            {/* Precio */}
            <div ref={precioRef} style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              <div style={fieldContent}>
                <img src="/icons/icon-dollar-red.gif" alt="" width={24} height={24} style={{ flexShrink: 0, alignSelf: 'flex-start', marginTop: '2px' }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={labelStyle}>Precio</p>
                  <PriceSelect value={precioRange} onChange={setPrecioRange} searchType={searchType} />
                </div>
              </div>
            </div>
            {/* Buscar */}
            <button type="button" onClick={handleBuscar}
              className="lg:px-4 xl:px-7 lg:min-w-[52px] xl:min-w-[160px]"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: RED, color: '#fff', fontFamily: FONT, fontSize: '15px', fontWeight: 500, border: 'none', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s ease' }}
              onMouseEnter={e => (e.currentTarget.style.background = RED_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.background = RED)}
            >
              <img src="/icons/icon-search-white.gif" alt="" width={18} height={18} />
              <span className="hidden xl:inline">Buscar inmueble</span>
            </button>
          </div>

          {/* queActive: Atrás + Buscar grande */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            opacity: queActive ? 1 : 0,
            pointerEvents: queActive ? 'auto' : 'none',
            transition: 'opacity 0.28s ease 0.1s',
          }}>
            <button type="button" onClick={deactivateQue}
              style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', border: 'none', borderRight: BORDER, cursor: 'pointer', fontFamily: FONT, fontSize: '14px', fontWeight: 400, color: '#555', transition: 'background 0.18s ease' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#ebebeb')}
              onMouseLeave={e => (e.currentTarget.style.background = '#f5f5f5')}
            >
              Atrás
            </button>
            <button type="button" onClick={handleBuscar}
              style={{ flex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: RED, color: '#fff', fontFamily: FONT, fontSize: '15px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background 0.2s ease' }}
              onMouseEnter={e => (e.currentTarget.style.background = RED_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.background = RED)}
            >
              <img src="/icons/icon-search-white.gif" alt="" width={18} height={18} />
              <span>Buscar inmueble</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
