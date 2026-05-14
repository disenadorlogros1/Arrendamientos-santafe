'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { SlidersHorizontal, MapPin, Home, BedDouble, CircleDollarSign } from 'lucide-react';

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
const AREAS = ['50m²', '100m²', '150m²', '200m²', '250m²', '300m²', '400m²', '500m²+'];

const PRICE_RANGES = {
  arrendar: { min: 100000, max: 15000000, step: 100000 },
  comprar:  { min: 30000000, max: 1500000000, step: 1000000 },
} as const;

function formatPrice(val: number) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1)}M`;
  return `$${val.toLocaleString('es-CO')}`;
}

const FONT = "'Avenir LT Pro', 'Outfit', system-ui, sans-serif";
const COLOR_LABEL = '#808080';
const COLOR_VALUE = '#232222';
const COLOR_ICON = '#aa182c';

function CustomSelect({ label, value, onChange, options, placeholder }: {
  label: string; value: string; onChange: (val: string) => void;
  options: string[]; placeholder?: string;
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
    <div ref={dropdownRef} style={{ position: 'fixed', top: `${pos.top}px`, left: `${pos.left}px`, width: '220px', zIndex: 2147483647 }}>
      <div className="bg-white py-1 shadow-2xl border border-gray-100 max-h-[240px] overflow-y-auto">
        {options.map((opt) => (
          <button key={opt} type="button" onClick={(e) => { e.stopPropagation(); select(opt); }}
            className={`block w-full text-left px-4 py-2.5 text-[14px] transition-colors duration-150 ${
              value === opt ? 'bg-brand-red text-white font-semibold' : 'text-gray-700 hover:text-white hover:bg-brand-red'}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div className="min-w-0 flex-1">
      {label && (
        <p className="leading-tight mb-[2px]" style={{ fontFamily: FONT, fontSize: '11px', color: COLOR_LABEL, fontWeight: 300 }}>
          {label}
        </p>
      )}
      <button ref={triggerRef} type="button" onClick={toggle}
        className="w-full flex items-center bg-transparent border-none outline-none cursor-pointer text-left">
        <span style={{
          fontFamily: FONT,
          fontSize: '15px',
          fontWeight: 400,
          color: value ? COLOR_VALUE : '#b0b0b0',
        }}>
          {value || placeholder || 'Seleccionar'}
        </span>
      </button>
      {dropdown && createPortal(dropdown, document.body)}
    </div>
  );
}

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

interface SearchFormProps {
  mobileExpanded: boolean;
  onMobileExpand: (expanded: boolean) => void;
  onNavigate?: (page: 'propiedades') => void;
}

export default function SearchForm({ onNavigate }: SearchFormProps) {
  // step 0 = Orden 1, step 1 = Orden 2, step 2 = Orden 3, step 3 = Orden 4
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [searchType, setSearchType] = useState<'arrendar' | 'comprar' | null>(null);
  const [searchMethod, setSearchMethod] = useState<'ubicacion' | 'codigo' | null>(null);

  const [sector, setSector] = useState('');
  const [tipo, setTipo] = useState('');
  const [habitaciones, setHabitaciones] = useState('');
  const [precioMin, setPrecioMin] = useState(PRICE_RANGES.arrendar.min);
  const [precioMax, setPrecioMax] = useState(PRICE_RANGES.arrendar.max);
  const [banos, setBanos] = useState('');
  const [areaMin, setAreaMin] = useState('');
  const [areaMax, setAreaMax] = useState('');
  const [parqueaderos, setParqueaderos] = useState('');

  const handleTabClick = (type: 'arrendar' | 'comprar') => {
    setSearchType(type);
    setPrecioMin(PRICE_RANGES[type].min);
    setPrecioMax(PRICE_RANGES[type].max);
    if (step < 1) setStep(1);
  };

  const handleMethodClick = (method: 'ubicacion' | 'codigo') => {
    setSearchMethod(method);
    setStep(2);
  };

  const handleAdvancedToggle = () => {
    setStep(step === 3 ? 2 : 3);
  };

  const handleSearch = () => {
    onNavigate?.('propiedades');
  };

  // Estilo compartido para cada celda de filtro
  const filterCell = "flex-1 flex items-center gap-2.5 px-5 py-2.5 min-w-0";

  return (
    <div className="relative mx-auto px-4 sm:px-6 lg:px-8 -mt-[70px] sm:-mt-[110px] lg:-mt-[140px]"
      style={{ width: '100%', maxWidth: '64rem', zIndex: 20 }}>
      <div className="shadow-2xl flex flex-col overflow-hidden">

        {/* ── FILA 1: Tabs Arrendar / Comprar — siempre visible ── */}
        <div className="flex h-[48px]">
          {(['arrendar', 'comprar'] as const).map((t) => (
            <button key={t} onClick={() => handleTabClick(t)}
              className={`flex-1 flex items-center justify-center text-white transition-all ${
                searchType === t ? 'bg-brand-red' : 'bg-white/60 hover:bg-white/70'}`}
              style={{ fontSize: '20px', fontFamily: FONT, fontWeight: 400 }}>
              {t === 'arrendar' ? 'Arrendar' : 'Comprar'}
            </button>
          ))}
        </div>

        {/* ── FILA 2: Métodos — visible desde Orden 2 ── */}
        {step >= 1 && (
          <div className="flex h-[40px] bg-white border-b border-gray-100">
            <button onClick={() => handleMethodClick('codigo')}
              className="flex-1 flex items-center justify-center hover:bg-gray-50 transition-colors"
              style={{
                color: searchMethod === 'codigo' ? COLOR_ICON : COLOR_LABEL,
                fontFamily: FONT, fontSize: '13px', fontWeight: 500,
                borderBottom: searchMethod === 'codigo' ? '2px solid #f32735' : '2px solid transparent',
              }}>
              # Búsqueda por código
            </button>
            <div className="w-px bg-gray-100 my-2" />
            <button onClick={() => handleMethodClick('ubicacion')}
              className="flex-1 flex items-center justify-center hover:bg-gray-50 transition-colors"
              style={{
                color: searchMethod === 'ubicacion' ? COLOR_ICON : COLOR_LABEL,
                fontFamily: FONT, fontSize: '13px', fontWeight: 500,
                borderBottom: searchMethod === 'ubicacion' ? '2px solid #f32735' : '2px solid transparent',
              }}>
              📍 Búsqueda por ubicación
            </button>
          </div>
        )}

        {/* ── FILA 3: Filtros básicos — visible desde Orden 3 ── */}
        {step >= 2 && (
          <div className="flex flex-col sm:flex-row sm:flex-nowrap items-stretch bg-white border-b border-gray-100">
            <div className={`${filterCell} border-b sm:border-b-0 sm:border-r border-gray-100`}>
              <MapPin className="w-[22px] h-[22px] flex-shrink-0" strokeWidth={1.6} style={{ color: COLOR_ICON }} />
              <CustomSelect label="Ubicación" value={sector} onChange={setSector} options={SECTORES} placeholder="Seleccionar" />
            </div>
            <div className={`${filterCell} border-b sm:border-b-0 sm:border-r border-gray-100`}>
              <CircleDollarSign className="w-[22px] h-[22px] flex-shrink-0" strokeWidth={1.6} style={{ color: COLOR_ICON }} />
              <div className="min-w-0 flex-1">
                <p className="leading-tight mb-[2px]" style={{ fontFamily: FONT, fontSize: '11px', color: COLOR_LABEL, fontWeight: 300 }}>Precio</p>
                <p style={{ fontFamily: FONT, fontSize: '15px', fontWeight: 600, color: COLOR_VALUE }}>
                  {formatPrice(precioMin)} – {formatPrice(precioMax)}
                </p>
              </div>
            </div>
            <div className={`${filterCell} border-b sm:border-b-0 sm:border-r border-gray-100`}>
              <Home className="w-[22px] h-[22px] flex-shrink-0" strokeWidth={1.6} style={{ color: COLOR_ICON }} />
              <CustomSelect label="Tipo de propiedad" value={tipo} onChange={setTipo} options={TIPOS_INMUEBLE} placeholder="Seleccionar" />
            </div>
            <div className={filterCell}>
              <BedDouble className="w-[22px] h-[22px] flex-shrink-0" strokeWidth={1.6} style={{ color: COLOR_ICON }} />
              <CustomSelect label="Habitaciones" value={habitaciones} onChange={setHabitaciones} options={HABITACIONES} placeholder="Seleccionar" />
            </div>
          </div>
        )}

        {/* ── FILA 4: Filtros avanzados — visible solo en Orden 4 ── */}
        {step === 3 && (
          <div className="flex flex-col sm:flex-row sm:flex-nowrap items-stretch bg-[#fafafa] border-b border-gray-100">
            <div className={`${filterCell} border-b sm:border-b-0 sm:border-r border-gray-100`}>
              <CustomSelect label="Baños" value={banos} onChange={setBanos} options={BANOS} placeholder="Seleccionar" />
            </div>
            <div className={`${filterCell} border-b sm:border-b-0 sm:border-r border-gray-100`}>
              <CustomSelect label="Área mínima" value={areaMin} onChange={setAreaMin} options={AREAS} placeholder="Seleccionar" />
            </div>
            <div className={`${filterCell} border-b sm:border-b-0 sm:border-r border-gray-100`}>
              <CustomSelect label="Área máxima" value={areaMax} onChange={setAreaMax} options={AREAS} placeholder="Seleccionar" />
            </div>
            <div className={filterCell}>
              <CustomSelect label="Parqueaderos" value={parqueaderos} onChange={setParqueaderos} options={PARQUEADEROS} placeholder="Seleccionar" />
            </div>
          </div>
        )}

        {/* ── FILA Búsqueda avanzada — blanca, visible desde Orden 3 ── */}
        {step >= 2 && (
          <div className="bg-white border-b border-gray-100 py-2.5 px-4 flex items-center justify-center">
            <button type="button" onClick={handleAdvancedToggle}
              className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity"
              style={{ fontSize: '13px', fontFamily: FONT, fontWeight: 500, color: COLOR_LABEL }}>
              <SlidersHorizontal className="w-4 h-4" strokeWidth={1.6} />
              {step === 3 ? 'Ocultar filtros avanzados' : 'Búsqueda avanzada'}
            </button>
          </div>
        )}

        {/* ── FILA FINAL: Buscar inmueble — roja, siempre al final ── */}
        <button onClick={handleSearch}
          className="bg-brand-red hover:bg-brand-red-hover text-white py-3.5 flex items-center justify-center gap-2 transition-colors duration-200 active:scale-[0.99]"
          style={{ fontSize: '20px', fontFamily: FONT, fontWeight: 400 }}>
          <SearchIcon />
          <span>Buscar inmueble</span>
        </button>

      </div>
    </div>
  );
}
