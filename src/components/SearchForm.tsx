'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const SECTORES = [
  'Envigado', 'Poblado', 'Laureles', 'Belen', 'Estadio', 'Itagui', 'Sabaneta',
  'Bello', 'Caldas', 'Copacabana', 'Guarne', 'Rionegro', 'La Ceja',
  'Medellin', 'Aranjuez', 'Buenos Aires', 'Castilla', 'Robledo',
  'Guayabal', 'El Poblado', 'Santo Domingo', 'Manrique', 'Popular',
  'San Javier', 'Santa Cruz', 'Altavista', 'San Antonio de Prado',
];

const TIPOS_INMUEBLE = [
  'ApartaEstudio', 'Apartamento', 'Bodega', 'Casa', 'CasaLocal',
  'Finca', 'Local', 'Oficina',
];

const HABITACIONES = ['1', '2', '3', '4', '5+'];

/* Price ranges per search type */
const PRICE_RANGES = {
  arrendar: { min: 100000, max: 15000000, step: 100000 },
  comprar:  { min: 30000000, max: 500000000, step: 1000000 },
} as const;

function formatPrice(val: number) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1)}M`;
  return `$${val.toLocaleString('es-CO')}`;
}

function formatPriceFull(val: number) {
  return `$${val.toLocaleString('es-CO')} COP`;
}

/* ── CustomSelect — dropdown portalizado al body, sin flecha ── */
function CustomSelect({
  label, value, onChange, options, placeholder, dropdownWidth,
}: {
  label: string; value: string; onChange: (val: string) => void;
  options: string[]; placeholder?: string; dropdownWidth?: number;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => { setMounted(true); }, []);

  const updatePos = useCallback(() => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.left });
    }
  }, []);

  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open) updatePos();
    setOpen(prev => !prev);
  }, [open, updatePos]);

  const select = useCallback((val: string) => {
    onChange(val);
    setOpen(false);
  }, [onChange]);

  useEffect(() => {
    if (!open || !mounted) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(t) &&
          triggerRef.current && !triggerRef.current.contains(t)) setOpen(false);
    };
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => { clearTimeout(id); document.removeEventListener('mousedown', handler); };
  }, [open, mounted]);

  const dropdown = mounted && open ? (
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        width: `${dropdownWidth || 220}px`,
        zIndex: 2147483647,
      }}
    >
      <div className="bg-white rounded-2xl py-1 shadow-2xl border border-gray-100 max-h-[240px] overflow-y-auto">
        {options.map((opt) => (
          <button key={opt} type="button" onClick={(e) => { e.stopPropagation(); select(opt); }}
            className={`block w-full text-left px-4 py-2.5 text-[15px] transition-colors duration-150 first:rounded-t-2xl last:rounded-b-2xl ${
              value === opt ? 'bg-brand-red text-white font-semibold' : 'text-gray-700 hover:text-white hover:bg-brand-red'}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div className="min-w-0 flex-1">
      <p className="text-[14px] text-gray-400 leading-tight">{label}</p>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        className="w-full flex items-center text-sm text-brand-dark font-semibold bg-transparent border-none outline-none cursor-pointer text-left"
      >
        <span className={value ? '' : 'text-gray-300 font-normal'}>{value || placeholder || 'Seleccionar'}</span>
      </button>
      {dropdown && createPortal(dropdown, document.body)}
    </div>
  );
}

/* ── PriceRangeSlider — panel portalizado al body, sin flecha ── */
function PriceRangeSlider({ searchType, minVal, maxVal, onChangeMin, onChangeMax }: {
  searchType: 'arrendar' | 'comprar';
  minVal: number; maxVal: number; onChangeMin: (v: number) => void; onChangeMax: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const range = PRICE_RANGES[searchType];

  useEffect(() => { setMounted(true); }, []);

  const updatePos = useCallback(() => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.left });
    }
  }, []);

  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open) updatePos();
    setOpen(prev => !prev);
  }, [open, updatePos]);

  useEffect(() => {
    if (!open || !mounted) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(t) && triggerRef.current && !triggerRef.current.contains(t)) setOpen(false);
    };
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => { clearTimeout(id); document.removeEventListener('mousedown', handler); };
  }, [open, mounted]);

  const minPct = ((minVal - range.min) / (range.max - range.min)) * 100;
  const maxPct = ((maxVal - range.min) / (range.max - range.min)) * 100;

  const panel = mounted && open ? (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        width: '300px',
        zIndex: 2147483647,
      }}
    >
      <div className="bg-white rounded-2xl p-4 shadow-2xl border border-gray-100">
        <p className="text-xs text-gray-500 mb-3 font-medium">
          Rango: <span className="text-brand-red font-semibold">{formatPrice(minVal)}</span> — <span className="text-brand-red font-semibold">{formatPrice(maxVal)}</span>
        </p>
        <div className="relative h-2 bg-gray-200 rounded-full mb-4">
          <div className="absolute h-full bg-brand-red rounded-full" style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }} />
          <input type="range" min={range.min} max={range.max} step={range.step} value={minVal}
            onChange={(e) => onChangeMin(Math.min(Number(e.target.value), maxVal - range.step))}
            className="absolute top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-red [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-red [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer" />
          <input type="range" min={range.min} max={range.max} step={range.step} value={maxVal}
            onChange={(e) => onChangeMax(Math.max(Number(e.target.value), minVal + range.step))}
            className="absolute top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-red [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-red [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer" />
        </div>
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>{formatPriceFull(range.min)}</span>
          <span>{formatPriceFull(range.max)}</span>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="min-w-0 flex-1">
      <p className="text-[14px] text-gray-400 leading-tight">Precio</p>
      <button ref={triggerRef} type="button" onClick={toggle}
        className="w-full flex items-center text-sm text-brand-dark font-semibold bg-transparent border-none outline-none cursor-pointer text-left">
        <span className="text-xs">{formatPrice(minVal)} – {formatPrice(maxVal)}</span>
      </button>
      {panel && createPortal(panel, document.body)}
    </div>
  );
}

interface SearchFormProps {
  mobileExpanded: boolean;
  onMobileExpand: (expanded: boolean) => void;
}

export default function SearchForm({ mobileExpanded, onMobileExpand }: SearchFormProps) {
  const [searchType, setSearchType] = useState<'arrendar' | 'comprar' | null>(null);
  const activeType = searchType || 'arrendar';
  const [sector, setSector] = useState('');
  const [tipo, setTipo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [habitaciones, setHabitaciones] = useState('');
  const [precioMin, setPrecioMin] = useState(PRICE_RANGES.arrendar.min);
  const [precioMax, setPrecioMax] = useState(PRICE_RANGES.arrendar.max);
  const [isSearching, setIsSearching] = useState(false);
  const animRef = useRef<number>(0);

  const handleTabClick = useCallback((type: 'arrendar' | 'comprar') => {
    setSearchType(type);
    /* Reset price to new range when switching tabs */
    setPrecioMin(PRICE_RANGES[type].min);
    setPrecioMax(PRICE_RANGES[type].max);
    onMobileExpand(true);
  }, [onMobileExpand]);

  const handleClose = useCallback(() => {
    setSearchType(null);
    onMobileExpand(false);
  }, [onMobileExpand]);

  const handleSearch = useCallback(() => {
    setIsSearching(true);
    const spin = (now: number) => {
      animRef.current = requestAnimationFrame(spin);
    };
    animRef.current = requestAnimationFrame(spin);
    setTimeout(() => {
      cancelAnimationFrame(animRef.current);
      setIsSearching(false);
    }, 1200);
  }, []);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  return (
    <div className="relative mx-auto px-4 sm:px-6 lg:px-8 -mt-[112px] sm:-mt-[120px] lg:-mt-[180px]" style={{ maxWidth: '72rem', zIndex: 20 }}>
      {/* X button — positioned OUTSIDE the white card, top-right, mobile only, only when expanded */}
      {mobileExpanded && (
        <button
          type="button"
          onClick={handleClose}
          className="absolute -top-11 right-0 z-30 w-9 h-9 rounded-full bg-brand-red text-white flex items-center justify-center sm:hidden hover:bg-brand-red-hover transition-all duration-300 shadow-lg animate-[fadeInScale_0.2s_ease-out]"
          aria-label="Cerrar formulario"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="bg-white shadow-2xl">
        {/* Tabs */}
        <div className="flex bg-brand-dark w-full relative">
          {(['arrendar', 'comprar'] as const).map((t) => (
            <button key={t} onClick={() => handleTabClick(t)}
              className={`flex-1 px-5 py-3.5 transition-all duration-200 ${
                mobileExpanded ? (activeType === t ? 'bg-white text-brand-red' : 'bg-white/40 text-white hover:bg-white/50') : 'bg-white/40 text-white hover:bg-white/50'}`}
              style={{ fontFamily: "'Avenir LT Pro 35 Light', 'Avenir', 'Outfit', system-ui, sans-serif", fontWeight: 300, fontSize: '16px' }}>
              {t === 'arrendar' ? 'Arrendar' : 'Comprar'}
            </button>
          ))}

          {/* Divider line between Arrendar/Comprar — only on mobile, only when no option selected */}
          {!mobileExpanded && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-6 bg-white/40 sm:hidden" />
          )}
        </div>

        {/* Search Fields — mobile: vertical collapsible, desktop: single horizontal line */}
        <div className={`search-fields flex flex-col sm:flex-row sm:flex-nowrap items-stretch ${mobileExpanded ? 'fields-expanded' : 'fields-collapsed'}`}>
          {/* Código */}
          <div className="filter-field group flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="filter-icon w-9 h-9 rounded shrink-0 flex items-center justify-center transition-all duration-300" style={{ backgroundColor: '#f2f2f2' }}>
              <img src="/numero-codigo.gif" alt="Código" className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] text-gray-400 leading-tight">Código</p>
              <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ej: 1234"
                className="w-full text-sm text-brand-dark font-semibold bg-transparent border-none outline-none placeholder:text-gray-300 placeholder:font-normal" />
            </div>
          </div>

          {/* Ubicación */}
          <div className="filter-field group flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="filter-icon w-9 h-9 rounded shrink-0 flex items-center justify-center transition-all duration-300" style={{ backgroundColor: '#f2f2f2' }}>
              <img src="/ubicacion.gif" alt="Ubicación" className="w-5 h-5" />
            </div>
            <CustomSelect label="Ubicación" value={sector} onChange={setSector} options={SECTORES} placeholder="Seleccionar" />
          </div>

          {/* Precio */}
          <div className="filter-field group flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="filter-icon w-9 h-9 rounded shrink-0 flex items-center justify-center transition-all duration-300" style={{ backgroundColor: '#f2f2f2' }}>
              <img src="/precio.gif" alt="Precio" className="w-5 h-5" />
            </div>
            <PriceRangeSlider searchType={activeType} minVal={precioMin} maxVal={precioMax} onChangeMin={setPrecioMin} onChangeMax={setPrecioMax} />
          </div>

          {/* Tipo */}
          <div className="filter-field group flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="filter-icon w-9 h-9 rounded shrink-0 flex items-center justify-center transition-all duration-300" style={{ backgroundColor: '#f2f2f2' }}>
              <img src="/tipo-de-propiedad.gif" alt="Tipo" className="w-5 h-5" />
            </div>
            <CustomSelect label="Tipo de Inmueble" value={tipo} onChange={setTipo} options={TIPOS_INMUEBLE} placeholder="Seleccionar" />
          </div>

          {/* Habitaciones */}
          <div className="filter-field group flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="filter-icon w-9 h-9 rounded shrink-0 flex items-center justify-center transition-all duration-300" style={{ backgroundColor: '#f2f2f2' }}>
              <img src="/habitaciones-copia.gif" alt="Habitaciones" className="w-5 h-5" />
            </div>
            <CustomSelect label="Habitaciones" value={habitaciones} onChange={setHabitaciones} options={HABITACIONES.map(h => `${h} o más`)} placeholder="Seleccionar" />
          </div>

          {/* Botón Buscar — lupa animada */}
          <button
            onClick={handleSearch}
            className="relative overflow-hidden bg-brand-red hover:bg-brand-red-hover text-white px-8 py-3 sm:py-[18px] sm:px-10 text-[18px] font-semibold flex items-center justify-center gap-2 transition-colors duration-200 shrink-0 active:scale-95"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <circle
                cx="10" cy="10" r="7"
                stroke="white" strokeWidth="2.5" strokeLinecap="round"
                strokeDasharray={isSearching ? '14 30' : '44 0'}
                style={{ transition: 'stroke-dasharray 0.3s ease' }}
              />
              <line
                x1="14.5" y1="14.5" x2="20" y2="20"
                stroke="white" strokeWidth="2.5" strokeLinecap="round"
                style={{
                  opacity: isSearching ? 0 : 1,
                  transition: 'opacity 0.25s ease',
                }}
              />
              {isSearching && (
                <circle
                  cx="10" cy="10" r="5"
                  stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round"
                  strokeDasharray="8 24"
                  className="search-lens-group spinning"
                />
              )}
            </svg>
            <span className="whitespace-nowrap">Buscar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
