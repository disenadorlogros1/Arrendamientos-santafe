'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { SlidersHorizontal, MapPin, Home, Users } from 'lucide-react';

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

function CustomSelect({
  label, value, onChange, options, placeholder,
}: {
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
      <div className="bg-white rounded-2xl py-1 shadow-2xl border border-gray-100 max-h-[240px] overflow-y-auto">
        {options.map((opt) => (
          <button key={opt} type="button" onClick={(e) => { e.stopPropagation(); select(opt); }}
            className={`block w-full text-left px-4 py-2.5 text-[15px] transition-colors duration-150 ${
              value === opt ? 'bg-brand-red text-white font-semibold' : 'text-gray-700 hover:text-white hover:bg-brand-red'}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div className="min-w-0 flex-1">
      {label && <p className="text-[13px] text-gray-400 leading-tight mb-0.5">{label}</p>}
      <button ref={triggerRef} type="button" onClick={toggle}
        className="w-full flex items-center text-sm text-brand-dark font-semibold bg-transparent border-none outline-none cursor-pointer text-left">
        <span className={value ? 'text-brand-dark' : 'text-gray-300 font-normal'}>{value || placeholder || 'Seleccionar'}</span>
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

const FONT = "'Avenir LT Pro', 'Outfit', system-ui, sans-serif";

interface SearchFormProps {
  mobileExpanded: boolean;
  onMobileExpand: (expanded: boolean) => void;
  onNavigate?: (page: 'propiedades') => void;
}

export default function SearchForm({ onNavigate }: SearchFormProps) {
  // step: 0=inicial, 1=con métodos, 2=con filtros básicos, 3=con filtros avanzados
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [searchType, setSearchType] = useState<'arrendar' | 'comprar' | null>(null);
  const [searchMethod, setSearchMethod] = useState<'ubicacion' | 'codigo' | null>(null);

  // Filtros básicos
  const [sector, setSector] = useState('');
  const [tipo, setTipo] = useState('');
  const [habitaciones, setHabitaciones] = useState('');
  const [precioMin, setPrecioMin] = useState(PRICE_RANGES.arrendar.min);
  const [precioMax, setPrecioMax] = useState(PRICE_RANGES.arrendar.max);

  // Filtros avanzados
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

  return (
    <div className="relative mx-auto px-4 sm:px-6 lg:px-8 -mt-[100px] sm:-mt-[110px] lg:-mt-[140px]"
      style={{ width: '100%', maxWidth: '64rem', zIndex: 20 }}>
      <div className="shadow-2xl flex flex-col">

        {/* ── FILA 1: Tabs Arrendar / Comprar — siempre visible ── */}
        <div className="flex h-[50px]">
          {(['arrendar', 'comprar'] as const).map((t) => (
            <button key={t} onClick={() => handleTabClick(t)}
              className={`flex-1 flex items-center justify-center text-white font-medium transition-all ${
                searchType === t ? 'bg-brand-red' : 'bg-white/60'}`}
              style={{ fontSize: '22px', fontFamily: FONT, fontWeight: 500 }}>
              {t === 'arrendar' ? 'Arrendar' : 'Comprar'}
            </button>
          ))}
        </div>

        {/* ── FILA 2: Métodos de búsqueda — visible desde step 1 ── */}
        {step >= 1 && (
          <div className="flex h-[44px] bg-white border-b border-gray-200">
            <button onClick={() => handleMethodClick('codigo')}
              className="flex-1 flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors"
              style={{ color: searchMethod === 'codigo' ? '#aa182c' : '#808080', fontFamily: FONT, fontSize: '14px', fontWeight: 500,
                borderBottom: searchMethod === 'codigo' ? '3px solid #f32735' : '3px solid transparent' }}>
              # Búsqueda por código
            </button>
            <div className="w-px bg-gray-200 my-2" />
            <button onClick={() => handleMethodClick('ubicacion')}
              className="flex-1 flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors"
              style={{ color: searchMethod === 'ubicacion' ? '#aa182c' : '#808080', fontFamily: FONT, fontSize: '14px', fontWeight: 500,
                borderBottom: searchMethod === 'ubicacion' ? '3px solid #f32735' : '3px solid transparent' }}>
              📍 Búsqueda por ubicación
            </button>
          </div>
        )}

        {/* ── FILA 3: Filtros básicos — visible desde step 2 ── */}
        {step >= 2 && (
          <div className="flex flex-col sm:flex-row sm:flex-nowrap items-stretch bg-white border-b border-gray-200">
            {/* Ubicación */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-200 min-w-0">
              <div className="w-[48px] h-[48px] rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f2f2f2' }}>
                <MapPin className="w-5 h-5" style={{ color: '#aa182c' }} />
              </div>
              <CustomSelect label="Ubicación" value={sector} onChange={setSector} options={SECTORES} placeholder="Seleccionar" />
            </div>
            {/* Precio */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-200 min-w-0">
              <div className="w-[48px] h-[48px] rounded flex items-center justify-center flex-shrink-0 text-lg" style={{ backgroundColor: '#f2f2f2', color: '#aa182c' }}>
                $
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-gray-400 leading-tight mb-0.5">Precio</p>
                <p className="text-sm font-semibold text-brand-dark truncate">{formatPrice(precioMin)} – {formatPrice(precioMax)}</p>
              </div>
            </div>
            {/* Tipo de propiedad */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-200 min-w-0">
              <div className="w-[48px] h-[48px] rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f2f2f2' }}>
                <Home className="w-5 h-5" style={{ color: '#aa182c' }} />
              </div>
              <CustomSelect label="Tipo de propiedad" value={tipo} onChange={setTipo} options={TIPOS_INMUEBLE} placeholder="Seleccionar" />
            </div>
            {/* Habitaciones */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-200 min-w-0">
              <div className="w-[48px] h-[48px] rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f2f2f2' }}>
                <Users className="w-5 h-5" style={{ color: '#aa182c' }} />
              </div>
              <CustomSelect label="Habitaciones" value={habitaciones} onChange={setHabitaciones} options={HABITACIONES} placeholder="Seleccionar" />
            </div>
            {/* Botón buscar */}
            <button onClick={handleSearch}
              className="shrink-0 bg-brand-red hover:bg-brand-red-hover text-white px-8 py-3 font-semibold flex items-center justify-center gap-2 transition-colors duration-200 active:scale-95 whitespace-nowrap"
              style={{ fontSize: '18px', fontFamily: FONT, fontWeight: 500 }}>
              <SearchIcon />
              <span>Buscar inmueble</span>
            </button>
          </div>
        )}

        {/* ── FILA 4: Filtros avanzados — visible solo en step 3 ── */}
        {step === 3 && (
          <div className="flex flex-col sm:flex-row sm:flex-nowrap items-stretch bg-gray-50 border-b border-gray-200">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-200 min-w-0">
              <CustomSelect label="Baños" value={banos} onChange={setBanos} options={BANOS} placeholder="Seleccionar" />
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-200 min-w-0">
              <CustomSelect label="Área mínima" value={areaMin} onChange={setAreaMin} options={AREAS} placeholder="Seleccionar" />
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-200 min-w-0">
              <CustomSelect label="Área máxima" value={areaMax} onChange={setAreaMax} options={AREAS} placeholder="Seleccionar" />
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-3 min-w-0">
              <CustomSelect label="Parqueaderos" value={parqueaderos} onChange={setParqueaderos} options={PARQUEADEROS} placeholder="Seleccionar" />
            </div>
          </div>
        )}

        {/* ── FILA FINAL: Botón buscar (steps 0-1) o Búsqueda avanzada (steps 2-3) ── */}
        {step < 2 && (
          <button onClick={handleSearch}
            className="bg-brand-red hover:bg-brand-red-hover text-white px-8 py-4 font-semibold flex items-center justify-center gap-2 transition-colors duration-200 active:scale-95"
            style={{ fontSize: '20px', fontFamily: FONT, fontWeight: 500 }}>
            <SearchIcon />
            <span>Buscar inmueble</span>
          </button>
        )}

        {step >= 2 && (
          <div className="bg-brand-red py-3 px-4 flex items-center justify-center">
            <button type="button" onClick={handleAdvancedToggle}
              className="inline-flex items-center gap-2 text-white font-semibold hover:opacity-80 transition-opacity"
              style={{ fontSize: '15px', fontFamily: FONT, fontWeight: 500 }}>
              <SlidersHorizontal className="w-5 h-5" />
              {step === 3 ? 'Ocultar filtros avanzados' : 'Búsqueda avanzada'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
