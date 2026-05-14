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
const AREA_MIN = ['50', '100', '150', '200', '250'];
const AREA_MAX = ['200', '300', '400', '500', '1000+'];

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
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        width: '220px',
        zIndex: 2147483647,
      }}
    >
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

interface SearchFormProps {
  mobileExpanded: boolean;
  onMobileExpand: (expanded: boolean) => void;
  onNavigate?: (page: 'propiedades') => void;
}

export default function SearchForm({ mobileExpanded, onMobileExpand, onNavigate }: SearchFormProps) {
  // Estados del flujo progresivo
  const [searchType, setSearchType] = useState<'arrendar' | 'comprar' | null>(null);
  const [searchMethod, setSearchMethod] = useState<'ubicacion' | 'codigo' | null>(null);
  const [showBasicFilters, setShowBasicFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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

  const activeType = searchType || 'arrendar';

  const handleTabClick = (type: 'arrendar' | 'comprar') => {
    setSearchType(type);
    setPrecioMin(PRICE_RANGES[type].min);
    setPrecioMax(PRICE_RANGES[type].max);
  };

  const handleSearchMethodClick = (method: 'ubicacion' | 'codigo') => {
    setSearchMethod(method);
    setShowBasicFilters(true);
  };

  const handleSearch = () => {
    onNavigate?.('propiedades');
  };

  return (
    <div className="relative mx-auto px-4 sm:px-6 lg:px-8 -mt-[100px] sm:-mt-[110px] lg:-mt-[140px]" style={{ width: '100%', maxWidth: '64rem', zIndex: 20 }}>
      <div className="shadow-2xl flex flex-col bg-white">
        {/* ORDEN 1: Tabs + Botón Buscar inmueble */}
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

        {/* Mostrar "Buscar inmueble" si no hay searchType seleccionado */}
        {!searchType && (
          <button
            onClick={handleSearch}
            className="bg-brand-red hover:bg-brand-red-hover text-white px-8 py-4 font-semibold flex items-center justify-center gap-2 transition-colors duration-200 active:scale-95"
            style={{
              fontSize: '20px',
              fontFamily: "'Avenir LT Pro', 'Outfit', system-ui, sans-serif",
              fontWeight: 500,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span>Buscar inmueble</span>
          </button>
        )}

        {/* ORDEN 2: Métodos de búsqueda + Botón Buscar inmueble */}
        {searchType && !showBasicFilters && (
          <>
            <div className="flex h-[50px] bg-white border-b border-gray-300">
              <button
                onClick={() => handleSearchMethodClick('codigo')}
                className="flex-1 flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{
                  color: '#808080',
                  fontFamily: "'Avenir LT Pro', 'Outfit', system-ui, sans-serif",
                  fontSize: '15px',
                  fontWeight: 500,
                }}
              >
                # Búsqueda por código
              </button>
              <div className="h-full w-px bg-gray-300" />
              <button
                onClick={() => handleSearchMethodClick('ubicacion')}
                className="flex-1 flex items-center justify-center hover:opacity-80 transition-opacity border-b-4"
                style={{
                  color: '#aa182c',
                  borderColor: searchMethod === 'ubicacion' ? '#f32735' : 'transparent',
                  fontFamily: "'Avenir LT Pro', 'Outfit', system-ui, sans-serif",
                  fontSize: '15px',
                  fontWeight: 500,
                }}
              >
                📍 Búsqueda por ubicación
              </button>
            </div>

            <button
              onClick={handleSearch}
              className="bg-brand-red hover:bg-brand-red-hover text-white px-8 py-4 font-semibold flex items-center justify-center gap-2 transition-colors duration-200 active:scale-95"
              style={{
                fontSize: '20px',
                fontFamily: "'Avenir LT Pro', 'Outfit', system-ui, sans-serif",
                fontWeight: 500,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span>Buscar inmueble</span>
            </button>
          </>
        )}

        {/* ORDEN 3: Filtros básicos + Búsqueda avanzada */}
        {showBasicFilters && !showAdvancedFilters && (
          <>
            <div className="flex flex-col sm:flex-row sm:flex-nowrap items-stretch bg-white border-b border-gray-300">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-300 min-w-0">
                <div className="w-[54px] h-[54px] rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f2f2f2' }}>
                  <MapPin className="w-6 h-6" style={{ color: '#aa182c' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 font-medium">Ubicación</p>
                  <CustomSelect value={sector} onChange={setSector} options={SECTORES} placeholder="Seleccionar" label="" />
                </div>
              </div>

              <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-300 min-w-0">
                <div className="w-[54px] h-[54px] rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f2f2f2' }}>
                  <span style={{ color: '#aa182c', fontSize: '24px' }}>💰</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 font-medium">Precio</p>
                  <p className="text-sm text-brand-dark font-semibold">{formatPrice(precioMin)} - {formatPrice(precioMax)}</p>
                </div>
              </div>

              <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-300 min-w-0">
                <div className="w-[54px] h-[54px] rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f2f2f2' }}>
                  <Home className="w-6 h-6" style={{ color: '#aa182c' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 font-medium">Tipo de propiedad</p>
                  <CustomSelect value={tipo} onChange={setTipo} options={TIPOS_INMUEBLE} placeholder="Seleccionar" label="" />
                </div>
              </div>

              <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-300 min-w-0">
                <div className="w-[54px] h-[54px] rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f2f2f2' }}>
                  <Users className="w-6 h-6" style={{ color: '#aa182c' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 font-medium">Habitaciones</p>
                  <CustomSelect value={habitaciones} onChange={setHabitaciones} options={HABITACIONES} placeholder="Seleccionar" label="" />
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="shrink-0 bg-brand-red hover:bg-brand-red-hover text-white px-8 py-3 font-semibold flex items-center justify-center gap-2 transition-colors duration-200 active:scale-95 whitespace-nowrap"
                style={{
                  fontSize: '20px',
                  fontFamily: "'Avenir LT Pro', 'Outfit', system-ui, sans-serif",
                  fontWeight: 500,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <span>Buscar inmueble</span>
              </button>
            </div>

            <div className="bg-brand-red py-4 px-4 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(true)}
                className="inline-flex items-center gap-2 text-white font-semibold transition-colors hover:opacity-80"
                style={{
                  fontSize: '15px',
                  fontFamily: "'Avenir LT Pro', 'Outfit', system-ui, sans-serif",
                  fontWeight: 500,
                }}
              >
                <SlidersHorizontal className="w-5 h-5" />
                Búsqueda avanzada
              </button>
            </div>
          </>
        )}

        {/* ORDEN 4: Filtros avanzados expandidos */}
        {showAdvancedFilters && (
          <>
            <div className="flex flex-col sm:flex-row sm:flex-nowrap items-stretch bg-white border-b border-gray-300">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-300 min-w-0">
                <div className="w-[54px] h-[54px] rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f2f2f2' }}>
                  <MapPin className="w-6 h-6" style={{ color: '#aa182c' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 font-medium">Ubicación</p>
                  <CustomSelect value={sector} onChange={setSector} options={SECTORES} placeholder="Seleccionar" label="" />
                </div>
              </div>

              <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-300 min-w-0">
                <div className="w-[54px] h-[54px] rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f2f2f2' }}>
                  <span style={{ color: '#aa182c', fontSize: '24px' }}>💰</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 font-medium">Precio</p>
                  <p className="text-sm text-brand-dark font-semibold">{formatPrice(precioMin)} - {formatPrice(precioMax)}</p>
                </div>
              </div>

              <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-300 min-w-0">
                <div className="w-[54px] h-[54px] rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f2f2f2' }}>
                  <Home className="w-6 h-6" style={{ color: '#aa182c' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 font-medium">Tipo de propiedad</p>
                  <CustomSelect value={tipo} onChange={setTipo} options={TIPOS_INMUEBLE} placeholder="Seleccionar" label="" />
                </div>
              </div>

              <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-300 min-w-0">
                <div className="w-[54px] h-[54px] rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f2f2f2' }}>
                  <Users className="w-6 h-6" style={{ color: '#aa182c' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 font-medium">Habitaciones</p>
                  <CustomSelect value={habitaciones} onChange={setHabitaciones} options={HABITACIONES} placeholder="Seleccionar" label="" />
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="shrink-0 bg-brand-red hover:bg-brand-red-hover text-white px-8 py-3 font-semibold flex items-center justify-center gap-2 transition-colors duration-200 active:scale-95 whitespace-nowrap"
                style={{
                  fontSize: '20px',
                  fontFamily: "'Avenir LT Pro', 'Outfit', system-ui, sans-serif",
                  fontWeight: 500,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <span>Buscar inmueble</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-nowrap items-stretch bg-gray-50 border-b border-gray-300">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-300 min-w-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 font-medium">Baños</p>
                  <CustomSelect value={banos} onChange={setBanos} options={BANOS} placeholder="Seleccionar" label="" />
                </div>
              </div>

              <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-300 min-w-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 font-medium">Área mín (m²)</p>
                  <CustomSelect value={areaMin} onChange={setAreaMin} options={AREA_MIN} placeholder="Seleccionar" label="" />
                </div>
              </div>

              <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-gray-300 min-w-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 font-medium">Área máx (m²)</p>
                  <CustomSelect value={areaMax} onChange={setAreaMax} options={AREA_MAX} placeholder="Seleccionar" label="" />
                </div>
              </div>

              <div className="flex-1 flex items-center gap-3 px-4 py-3 min-w-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 font-medium">Parqueaderos</p>
                  <CustomSelect value={parqueaderos} onChange={setParqueaderos} options={PARQUEADEROS} placeholder="Seleccionar" label="" />
                </div>
              </div>
            </div>

            <div className="bg-brand-red py-4 px-4 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(false)}
                className="inline-flex items-center gap-2 text-white font-semibold transition-colors hover:opacity-80"
                style={{
                  fontSize: '15px',
                  fontFamily: "'Avenir LT Pro', 'Outfit', system-ui, sans-serif",
                  fontWeight: 500,
                }}
              >
                <SlidersHorizontal className="w-5 h-5" />
                Ocultar filtros avanzados
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
