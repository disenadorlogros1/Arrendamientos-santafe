'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';

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

const MIN_PRECIO = 0;
const MAX_PRECIO = 7000000;

function formatPrice(val: number) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1)}M`;
  return `$${val.toLocaleString('es-CO')}`;
}

/* ── CustomSelect con dropdown position:fixed ── */
function CustomSelect({
  label, value, onChange, options, placeholder, dropdownWidth,
}: {
  label: string; value: string; onChange: (val: string) => void;
  options: string[]; placeholder?: string; dropdownWidth?: number;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePos = useCallback(() => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.left });
    }
  }, []);

  const toggle = useCallback(() => {
    if (!open) updatePos();
    setOpen(prev => !prev);
  }, [open, updatePos]);

  useEffect(() => {
    if (!open) return;
    const outside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(t) &&
          triggerRef.current && !triggerRef.current.contains(t)) setOpen(false);
    };
    const scroll = () => setOpen(false);
    document.addEventListener('mousedown', outside);
    window.addEventListener('scroll', scroll, true);
    return () => { document.removeEventListener('mousedown', outside); window.removeEventListener('scroll', scroll, true); };
  }, [open]);

  return (
    <div className="min-w-0 flex-1">
      <p className="text-[11px] text-gray-400 leading-tight">{label}</p>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between text-sm text-brand-dark font-semibold bg-transparent border-none outline-none cursor-pointer text-left pr-1"
      >
        <span className={value ? '' : 'text-gray-300 font-normal'}>{value || placeholder || 'Seleccionar'}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div ref={dropdownRef} className="bg-white rounded-2xl py-1 shadow-xl border border-gray-100 max-h-[220px] overflow-y-auto"
          style={{ position: 'fixed', top: `${pos.top}px`, left: `${pos.left}px`, width: `${dropdownWidth || 220}px`, zIndex: 99999 }}>
          {options.map((opt) => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-base transition-all duration-200 first:rounded-t-2xl last:rounded-b-2xl ${
                value === opt ? 'bg-brand-red text-white font-semibold' : 'text-brand-dark/70 hover:text-white hover:bg-brand-red'}`}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── PriceRangeSlider con panel position:fixed ── */
function PriceRangeSlider({ minVal, maxVal, onChangeMin, onChangeMax }: {
  minVal: number; maxVal: number; onChangeMin: (v: number) => void; onChangeMax: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePos = useCallback(() => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.left });
    }
  }, []);

  const toggle = useCallback(() => { if (!open) updatePos(); setOpen(prev => !prev); }, [open, updatePos]);

  useEffect(() => {
    if (!open) return;
    const outside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(t) && triggerRef.current && !triggerRef.current.contains(t)) setOpen(false);
    };
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, [open]);

  const minPct = ((minVal - MIN_PRECIO) / (MAX_PRECIO - MIN_PRECIO)) * 100;
  const maxPct = ((maxVal - MIN_PRECIO) / (MAX_PRECIO - MIN_PRECIO)) * 100;

  return (
    <div className="min-w-0 flex-1">
      <p className="text-[11px] text-gray-400 leading-tight">Precio</p>
      <button ref={triggerRef} type="button" onClick={toggle}
        className="w-full flex items-center justify-between text-sm text-brand-dark font-semibold bg-transparent border-none outline-none cursor-pointer text-left pr-1">
        <span className="text-xs">{formatPrice(minVal)} – {formatPrice(maxVal)}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div ref={panelRef} className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
          style={{ position: 'fixed', top: `${pos.top}px`, left: `${pos.left}px`, width: '280px', zIndex: 99999 }}>
          <p className="text-xs text-gray-500 mb-3 font-medium">
            Rango: <span className="text-brand-red font-semibold">{formatPrice(minVal)}</span> — <span className="text-brand-red font-semibold">{formatPrice(maxVal)}</span>
          </p>
          <div className="relative h-2 bg-gray-200 rounded-full mb-4">
            <div className="absolute h-full bg-brand-red rounded-full" style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }} />
            <input type="range" min={MIN_PRECIO} max={MAX_PRECIO} step={100000} value={minVal}
              onChange={(e) => onChangeMin(Math.min(Number(e.target.value), maxVal - 100000))}
              className="absolute top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-red [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-red [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer" />
            <input type="range" min={MIN_PRECIO} max={MAX_PRECIO} step={100000} value={maxVal}
              onChange={(e) => onChangeMax(Math.max(Number(e.target.value), minVal + 100000))}
              className="absolute top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-red [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-red [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer" />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400"><span>$0 COP</span><span>$7.000.000 COP</span></div>
        </div>
      )}
    </div>
  );
}

export default function SearchForm() {
  const [searchType, setSearchType] = useState<'arrendar' | 'comprar'>('arrendar');
  const [sector, setSector] = useState('');
  const [tipo, setTipo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [habitaciones, setHabitaciones] = useState('');
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(MAX_PRECIO);
  const [isSearching, setIsSearching] = useState(false);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const handleSearch = useCallback(() => {
    setIsSearching(true);
    lastTimeRef.current = performance.now();

    const spin = (now: number) => {
      lastTimeRef.current = now;
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
    <div style={{ maxWidth: '72rem', margin: '-120px auto 0', padding: '0 1rem', position: 'relative' }}>
      <div className="bg-white shadow-2xl">
        {/* Tabs */}
        <div className="flex bg-brand-dark w-full">
          {(['arrendar', 'comprar'] as const).map((t) => (
            <button key={t} onClick={() => setSearchType(t)}
              className={`flex-1 px-5 py-2.5 text-sm transition-all duration-200 ${
                searchType === t ? 'bg-white text-brand-red' : 'bg-white/40 text-white hover:bg-white/50'}`}
              style={{ fontFamily: "'Avenir LT Pro 65 Medium', sans-serif", fontWeight: 500 }}>
              {t === 'arrendar' ? 'Arrendar' : 'Comprar'}
            </button>
          ))}
        </div>

        {/* Search Fields */}
        <div className="flex flex-col sm:flex-row items-stretch">
          {/* Código */}
          <div className="group flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="w-9 h-9 rounded shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(207,10,44,0.5)]" style={{ backgroundColor: '#f2f2f2' }}>
              <img src="/numero-codigo.gif" alt="Código" className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-gray-400 leading-tight">Código</p>
              <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ej: 1234"
                className="w-full text-sm text-brand-dark font-semibold bg-transparent border-none outline-none placeholder:text-gray-300 placeholder:font-normal" />
            </div>
          </div>

          {/* Sector */}
          <div className="group flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="w-9 h-9 rounded shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(207,10,44,0.5)]" style={{ backgroundColor: '#f2f2f2' }}>
              <img src="/ubicacion.gif" alt="Ubicación" className="w-5 h-5" />
            </div>
            <CustomSelect label="Sector" value={sector} onChange={setSector} options={SECTORES} placeholder="Seleccionar" />
          </div>

          {/* Precio */}
          <div className="group flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="w-9 h-9 rounded shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(207,10,44,0.5)]" style={{ backgroundColor: '#f2f2f2' }}>
              <img src="/precio.gif" alt="Precio" className="w-5 h-5" />
            </div>
            <PriceRangeSlider minVal={precioMin} maxVal={precioMax} onChangeMin={setPrecioMin} onChangeMax={setPrecioMax} />
          </div>

          {/* Tipo */}
          <div className="group flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="w-9 h-9 rounded shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(207,10,44,0.5)]" style={{ backgroundColor: '#f2f2f2' }}>
              <img src="/tipo-de-propiedad.gif" alt="Tipo" className="w-5 h-5" />
            </div>
            <CustomSelect label="Tipo de Inmueble" value={tipo} onChange={setTipo} options={TIPOS_INMUEBLE} placeholder="Seleccionar" />
          </div>

          {/* Habitaciones */}
          <div className="group flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="w-9 h-9 rounded shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(207,10,44,0.5)]" style={{ backgroundColor: '#f2f2f2' }}>
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
