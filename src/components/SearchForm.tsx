'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, SlidersHorizontal, Hash, MapPin } from 'lucide-react';

const SECTORES = [
  'Medellín', 'Envigado', 'Rionegro', 'Bello', 'Itagüí', 'Sabaneta',
  'Caldas', 'Copacabana', 'Guarne', 'La Ceja',
  'El Poblado', 'Laureles', 'Belén', 'Estadio', 'Aranjuez',
  'Buenos Aires', 'Castilla', 'Robledo', 'Guayabal',
  'Santo Domingo', 'San Antonio de Prado',
];

const TIPOS_INMUEBLE = [
  'Apartamento', 'Apartaestudio', 'Casa', 'Oficina',
  'Local comercial', 'Bodega', 'Lote', 'Finca',
];

const HABITACIONES = ['1', '2', '3', '4', '5+'];
const BANOS = ['1', '2', '3', '4', '5+'];
const PARQUEADEROS = ['0', '1', '2', '3+'];
const ESTRATOS = ['1', '2', '3', '4', '5', '6'];

/* Price ranges per search type */
const PRICE_RANGES = {
  arrendar: { min: 100000, max: 15000000, step: 100000 },
  comprar:  { min: 30000000, max: 1500000000, step: 1000000 },
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
      <p className="text-[14px] text-gray-400 leading-tight whitespace-normal sm:whitespace-nowrap">{label}</p>
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
  const [searchMode, setSearchMode] = useState<'codigo' | 'ubicacion'>('ubicacion');
  const [sector, setSector] = useState('');
  const [tipo, setTipo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [habitaciones, setHabitaciones] = useState('');
  const [banos, setBanos] = useState('');
  const [parqueaderos, setParqueaderos] = useState('');
  const [estrato, setEstrato] = useState('');
  const [areaMin, setAreaMin] = useState('');
  const [areaMax, setAreaMax] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [precioMin, setPrecioMin] = useState(PRICE_RANGES.arrendar.min);
  const [precioMax, setPrecioMax] = useState(PRICE_RANGES.arrendar.max);
  const [isSearching, setIsSearching] = useState(false);
  const animRef = useRef<number>(0);

  const handleTabClick = useCallback((type: 'arrendar' | 'comprar') => {
    setSearchType(type);
    setPrecioMin(PRICE_RANGES[type].min);
    setPrecioMax(PRICE_RANGES[type].max);
    onMobileExpand(true);
  }, [onMobileExpand]);

  const handleClose = useCallback(() => {
    setSearchType(null);
    onMobileExpand(false);
    setShowAdvanced(false);
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
    <div className="relative mx-auto px-4 sm:px-6 lg:px-8 -mt-[100px] sm:-mt-[110px] lg:-mt-[140px]" style={{ width: '100%', maxWidth: '64rem', zIndex: 20 }}>
      {/* X button — mobile only when expanded */}
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
        {/* Tabs Arrendar / Comprar — blanco 50% opacidad */}
        <div className="flex bg-brand-dark w-full relative">
          {(['arrendar', 'comprar'] as const).map((t) => (
            <button key={t} onClick={() => handleTabClick(t)}
              className={`flex-1 px-5 py-2 transition-all duration-200 ${
                mobileExpanded && activeType === t
                  ? 'bg-white text-brand-red'
                  : 'bg-white/50 text-white hover:bg-white/70'
              }`}
              style={{ fontFamily: "'Avenir LT Pro 35 Light', 'Avenir', 'Outfit', system-ui, sans-serif", fontWeight: 400, fontSize: '15px' }}>
              {t === 'arrendar' ? 'Arrendar' : 'Comprar'}
            </button>
          ))}
          {!mobileExpanded && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-5 bg-white/40 sm:hidden" />
          )}
        </div>

        {/* Toggle: Por código / Por ubicación — solo en desktop cuando se selecciona arrendar/comprar */}
        <div className={`flex justify-center border-b border-gray-200 ${mobileExpanded ? '' : 'hidden'} ${searchType ? 'sm:flex' : 'sm:hidden'}`}>
          <button
            type="button"
            onClick={() => setSearchMode('codigo')}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold transition-colors ${
              searchMode === 'codigo'
                ? 'text-brand-red border-b-2 border-brand-red -mb-px'
                : 'text-gray-500 hover:text-brand-red'
            }`}
          >
            <Hash className="w-4 h-4" />
            Búsqueda por código
          </button>
          <button
            type="button"
            onClick={() => setSearchMode('ubicacion')}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold transition-colors ${
              searchMode === 'ubicacion'
                ? 'text-brand-red border-b-2 border-brand-red -mb-px'
                : 'text-gray-500 hover:text-brand-red'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Búsqueda por ubicación
          </button>
        </div>

        {/* MODO CÓDIGO — solo input de código + botón */}
        {searchMode === 'codigo' && (
          <div className={`search-fields flex flex-col sm:flex-row sm:flex-nowrap items-stretch ${mobileExpanded ? 'fields-expanded' : 'fields-collapsed'} ${searchType ? 'sm:flex' : 'sm:hidden'}`}>
            <div className="filter-field group flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
              <div className="filter-icon w-9 h-9 rounded shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f2f2f2' }}>
                <img src="/numero-codigo.gif" alt="Código" className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] text-gray-400 leading-tight">Código del inmueble</p>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ej: 1234"
                  className="w-full text-sm text-brand-dark font-semibold bg-transparent border-none outline-none placeholder:text-gray-300 placeholder:font-normal"
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="relative overflow-hidden bg-brand-red hover:bg-brand-red-hover text-white px-8 py-3 sm:py-[18px] sm:px-10 text-[18px] font-semibold flex items-center justify-center gap-2 transition-colors duration-200 shrink-0 active:scale-95"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray={isSearching ? '14 30' : '44 0'}
                  style={{ transition: 'stroke-dasharray 0.3s ease' }} />
                <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round"
                  style={{ opacity: isSearching ? 0 : 1, transition: 'opacity 0.25s ease' }} />
              </svg>
              <span className="whitespace-nowrap">Buscar inmueble</span>
            </button>
          </div>
        )}

        {/* MODO UBICACIÓN — todos los filtros */}
        {searchMode === 'ubicacion' && (
          <>
            <div className={`search-fields flex flex-col sm:flex-row sm:flex-nowrap items-stretch ${mobileExpanded ? 'fields-expanded' : 'fields-collapsed'} ${searchType ? 'sm:flex' : 'sm:hidden'}`}>
              {/* Ciudad o sector */}
              <div className="filter-field group flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
                <div className="filter-icon w-9 h-9 rounded shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f2f2f2' }}>
                  <img src="/ubicacion.gif" alt="Ciudad o sector" className="w-5 h-5" />
                </div>
                <CustomSelect label="Ciudad o sector" value={sector} onChange={setSector} options={SECTORES} placeholder="Seleccionar" />
              </div>

              {/* Tipo de inmueble */}
              <div className="filter-field group flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
                <div className="filter-icon w-9 h-9 rounded shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f2f2f2' }}>
                  <img src="/tipo-de-propiedad.gif" alt="Tipo" className="w-5 h-5" />
                </div>
                <CustomSelect label="Tipo de inmueble" value={tipo} onChange={setTipo} options={TIPOS_INMUEBLE} placeholder="Seleccionar" />
              </div>

              {/* Rango de precio */}
              <div className="filter-field group flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
                <div className="filter-icon w-9 h-9 rounded shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f2f2f2' }}>
                  <img src="/precio.gif" alt="Precio" className="w-5 h-5" />
                </div>
                <PriceRangeSlider searchType={activeType} minVal={precioMin} maxVal={precioMax} onChangeMin={setPrecioMin} onChangeMax={setPrecioMax} />
              </div>

              {/* Habitaciones */}
              <div className="filter-field group flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
                <div className="filter-icon w-9 h-9 rounded shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f2f2f2' }}>
                  <img src="/habitaciones-copia.gif" alt="Habitaciones" className="w-5 h-5" />
                </div>
                <CustomSelect label="Habitaciones" value={habitaciones} onChange={setHabitaciones} options={HABITACIONES.map(h => `${h} o más`)} placeholder="Seleccionar" />
              </div>
            </div>

            {/* Filtros avanzados (colapsable) — misma diagramación que el menú visible */}
            {showAdvanced && (
              <div className={`search-fields flex flex-col sm:flex-row sm:flex-nowrap items-stretch border-t border-gray-200 bg-gray-50 ${searchType ? 'sm:flex' : 'sm:hidden'}`}>
                {/* Baños */}
                <div className="filter-field group flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
                  <div className="filter-icon w-9 h-9 rounded shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f2f2f2' }}>
                    <SlidersHorizontal className="w-5 h-5 text-brand-red" />
                  </div>
                  <CustomSelect label="Baños" value={banos} onChange={setBanos} options={BANOS.map(b => `${b} o más`)} placeholder="Seleccionar" />
                </div>

                {/* Parqueaderos */}
                <div className="filter-field group flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
                  <div className="filter-icon w-9 h-9 rounded shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f2f2f2' }}>
                    <SlidersHorizontal className="w-5 h-5 text-brand-red" />
                  </div>
                  <CustomSelect label="Parqueaderos" value={parqueaderos} onChange={setParqueaderos} options={PARQUEADEROS.map(p => `${p} o más`)} placeholder="Seleccionar" />
                </div>

                {/* Área */}
                <div className="filter-field group flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
                  <div className="filter-icon w-9 h-9 rounded shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f2f2f2' }}>
                    <SlidersHorizontal className="w-5 h-5 text-brand-red" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] text-gray-400 leading-tight">Área (m²)</p>
                    <div className="flex items-center gap-2">
                      <input type="number" value={areaMin} onChange={(e) => setAreaMin(e.target.value)} placeholder="Min"
                        className="w-full text-sm text-brand-dark font-semibold bg-transparent border-none outline-none placeholder:text-gray-300 placeholder:font-normal" />
                      <span className="text-gray-300">—</span>
                      <input type="number" value={areaMax} onChange={(e) => setAreaMax(e.target.value)} placeholder="Max"
                        className="w-full text-sm text-brand-dark font-semibold bg-transparent border-none outline-none placeholder:text-gray-300 placeholder:font-normal" />
                    </div>
                  </div>
                </div>

                {/* Estrato */}
                <div className="filter-field group flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
                  <div className="filter-icon w-9 h-9 rounded shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f2f2f2' }}>
                    <SlidersHorizontal className="w-5 h-5 text-brand-red" />
                  </div>
                  <CustomSelect label="Estrato" value={estrato} onChange={setEstrato} options={ESTRATOS} placeholder="Seleccionar" />
                </div>
              </div>
            )}

            {/* Botón Búsqueda avanzada */}
            <div className="flex justify-center px-4 py-2.5 border-t border-gray-100 sm:hidden">
              <button
                type="button"
                onClick={() => setShowAdvanced(prev => !prev)}
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-brand-red font-semibold transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {showAdvanced ? 'Ocultar filtros avanzados' : 'Búsqueda avanzada'}
              </button>
            </div>

            {/* Botón Buscar inmueble — SIEMPRE ÚLTIMO */}
            <div className="flex sm:hidden px-4 py-3 border-t border-gray-100">
              <button
                onClick={handleSearch}
                className="w-full relative overflow-hidden bg-brand-red hover:bg-brand-red-hover text-white px-8 py-3 text-base font-semibold flex items-center justify-center gap-2 transition-colors duration-200 active:scale-95 rounded-lg"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="2.5" strokeLinecap="round"
                    strokeDasharray={isSearching ? '14 30' : '44 0'}
                    style={{ transition: 'stroke-dasharray 0.3s ease' }} />
                  <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round"
                    style={{ opacity: isSearching ? 0 : 1, transition: 'opacity 0.25s ease' }} />
                </svg>
                <span>Buscar inmueble</span>
              </button>
            </div>

            {/* Desktop: Botón Búsqueda avanzada y Buscar inmueble en dos filas */}
            <div className="hidden sm:flex sm:flex-col px-4 py-3 border-t border-gray-100 gap-2">
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(prev => !prev)}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-brand-red font-semibold transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {showAdvanced ? 'Ocultar filtros avanzados' : 'Búsqueda avanzada'}
                </button>
              </div>
              <button
                onClick={handleSearch}
                className="w-full relative overflow-hidden bg-brand-red hover:bg-brand-red-hover text-white px-12 py-4 text-lg font-bold flex items-center justify-center gap-2 transition-colors duration-200 active:scale-95"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="2.5" strokeLinecap="round"
                    strokeDasharray={isSearching ? '14 30' : '44 0'}
                    style={{ transition: 'stroke-dasharray 0.3s ease' }} />
                  <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round"
                    style={{ opacity: isSearching ? 0 : 1, transition: 'opacity 0.25s ease' }} />
                </svg>
                <span>Buscar inmueble</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
