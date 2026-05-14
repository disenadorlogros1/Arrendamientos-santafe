'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, SlidersHorizontal, Hash, MapPin, Home, Users } from 'lucide-react';

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
  onNavigate?: (page: 'propiedades') => void;
}

export default function SearchForm({ mobileExpanded, onMobileExpand, onNavigate }: SearchFormProps) {
  const [searchType, setSearchType] = useState<'arrendar' | 'comprar' | null>(null);
  const [searchMethod, setSearchMethod] = useState<'ubicacion' | 'codigo'>('ubicacion');
  const activeType = searchType || 'arrendar';
  const [sector, setSector] = useState('');
  const [tipo, setTipo] = useState('');
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

  const handleSearch = useCallback(() => {
    if (!searchType) {
      onNavigate?.('propiedades');
      return;
    }
    setIsSearching(true);
    const spin = (now: number) => {
      animRef.current = requestAnimationFrame(spin);
    };
    animRef.current = requestAnimationFrame(spin);
    setTimeout(() => {
      cancelAnimationFrame(animRef.current);
      setIsSearching(false);
    }, 1200);
  }, [searchType, onNavigate]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  return (
    <div className="relative mx-auto px-4 sm:px-6 lg:px-8 -mt-[100px] sm:-mt-[110px] lg:-mt-[140px]" style={{ width: '100%', maxWidth: '64rem', zIndex: 20 }}>
      <div className="shadow-2xl flex flex-col">
        {/* Tabs Arrendar / Comprar - Según SVG */}
        <div className="flex h-[50px]">
          {(['arrendar', 'comprar'] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTabClick(t)}
              className={`flex-1 flex flex-col items-center justify-center text-white font-medium transition-all ${
                searchType === t ? 'bg-brand-red' : 'bg-white/60'
              }`}
              style={{
                fontSize: '25px',
                fontFamily: "'Avenir LT Pro', 'Outfit', system-ui, sans-serif",
                fontWeight: 500,
              }}
            >
              {t === 'arrendar' ? 'Arrendar' : 'Comprar'}
            </button>
          ))}
        </div>

        {/* Subtítulos bajo los tabs - Búsqueda por código (izq) vs. Búsqueda por ubicación (der) */}
        <div className="flex h-[40px] bg-white border-b border-gray-300 items-center">
          {/* Búsqueda por código - izquierda, gris */}
          <button
            type="button"
            onClick={() => setSearchMethod('codigo')}
            className="flex-1 flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span
              style={{
                color: '#808080',
                fontFamily: "'Avenir LT Pro', 'Outfit', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              # Búsqueda por código
            </span>
          </button>

          {/* Línea divisoria */}
          <div className="h-6 w-px bg-gray-300" />

          {/* Búsqueda por ubicación - derecha, rojo */}
          <button
            type="button"
            onClick={() => setSearchMethod('ubicacion')}
            className="flex-1 flex items-center justify-center gap-2 hover:opacity-80 transition-opacity border-b-2"
            style={{
              borderColor: searchMethod === 'ubicacion' ? '#f32735' : 'transparent',
            }}
          >
            <span
              style={{
                color: '#aa182c',
                fontFamily: "'Avenir LT Pro', 'Outfit', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              📍 Búsqueda por ubicación
            </span>
          </button>
        </div>

        {/* Filtros — en una sola fila horizontal */}
        {searchType && (
          <>
            {/* Fila única: Ubicación, Precio, Tipo, Habitaciones + Botón Buscar */}
            <div className="flex flex-col sm:flex-row sm:flex-nowrap items-stretch bg-white border-b border-gray-300">
              {/* Ubicación */}
              <div className="filter-field flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-300 min-w-0">
                <div className="w-[54px] h-[54px] rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f2f2f2' }}>
                  <MapPin className="w-6 h-6" style={{ color: '#aa182c' }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 font-medium">Ubicación</p>
                  <CustomSelect value={sector} onChange={setSector} options={SECTORES} placeholder="Seleccionar" label="" />
                </div>
              </div>

              {/* Precio */}
              <div className="filter-field flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-300 min-w-0">
                <div className="w-[54px] h-[54px] rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f2f2f2' }}>
                  <img src="/precio.gif" alt="Precio" className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 font-medium">Precio</p>
                  <PriceRangeSlider searchType={activeType} minVal={precioMin} maxVal={precioMax} onChangeMin={setPrecioMin} onChangeMax={setPrecioMax} />
                </div>
              </div>

              {/* Tipo de propiedad */}
              <div className="filter-field flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-300 min-w-0">
                <div className="w-[54px] h-[54px] rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f2f2f2' }}>
                  <Home className="w-6 h-6" style={{ color: '#aa182c' }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 font-medium">Tipo de propiedad</p>
                  <CustomSelect value={tipo} onChange={setTipo} options={TIPOS_INMUEBLE} placeholder="Seleccionar" label="" />
                </div>
              </div>

              {/* Habitaciones */}
              <div className="filter-field flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-300 min-w-0">
                <div className="w-[54px] h-[54px] rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f2f2f2' }}>
                  <Users className="w-6 h-6" style={{ color: '#aa182c' }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 font-medium">Habitaciones</p>
                  <CustomSelect value={habitaciones} onChange={setHabitaciones} options={HABITACIONES.map(h => `${h} o más`)} placeholder="Seleccionar" label="" />
                </div>
              </div>

              {/* Botón Buscar inmueble */}
              <button
                onClick={handleSearch}
                className="shrink-0 bg-brand-red hover:bg-brand-red-hover text-white px-8 py-3 font-semibold flex items-center justify-center gap-2 transition-colors duration-200 active:scale-95 whitespace-nowrap"
                style={{
                  fontSize: '25px',
                  fontFamily: "'Avenir LT Pro', 'Outfit', system-ui, sans-serif",
                  fontWeight: 500,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="2.5" strokeLinecap="round"
                    strokeDasharray={isSearching ? '14 30' : '44 0'}
                    style={{ transition: 'stroke-dasharray 0.3s ease' }} />
                  <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round"
                    style={{ opacity: isSearching ? 0 : 1, transition: 'opacity 0.25s ease' }} />
                </svg>
                <span>Buscar inmueble</span>
              </button>
            </div>

            {/* Sección roja inferior - Búsqueda avanzada */}
            <div className="bg-brand-red py-4 px-4 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setShowAdvanced(prev => !prev)}
                className="inline-flex items-center gap-2 text-white font-semibold transition-colors hover:opacity-80"
                style={{
                  fontSize: '15px',
                  fontFamily: "'Avenir LT Pro', 'Outfit', system-ui, sans-serif",
                  fontWeight: 500,
                }}
              >
                <SlidersHorizontal className="w-5 h-5" />
                {showAdvanced ? 'Ocultar filtros avanzados' : 'Búsqueda avanzada'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
