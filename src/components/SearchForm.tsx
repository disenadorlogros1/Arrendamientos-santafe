'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Hash, ChevronDown } from 'lucide-react';

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

const RANGOS_PRECIO = [
  '$0 - $500.000',
  '$500.000 - $1.000.000',
  '$1.000.000 - $1.500.000',
  '$1.500.000 - $2.000.000',
  '$2.000.000 - $2.500.000',
  '$2.500.000 - $3.000.000',
  '$3.000.000 - $4.000.000',
  '$4.000.000 - $5.000.000',
  '$5.000.000 - $6.000.000',
  '$6.000.000 - $7.000.000',
];

/* ── CustomSelect: mismo diseño de dropdown que el Header ── */
function CustomSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  dropdownWidth,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  dropdownWidth?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-w-0 flex-1 relative" ref={ref}>
      <p className="text-[11px] text-gray-400 leading-tight">{label}</p>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-sm text-brand-dark font-semibold bg-transparent border-none outline-none cursor-pointer text-left pr-1"
      >
        <span className={value ? '' : 'text-gray-300 font-normal'}>
          {value || placeholder || 'Seleccionar'}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown – mismo estilo que el Header: bg-white, rounded-2xl, shadow, hover rojo */}
      {open && (
        <div className="absolute top-full left-0 pt-1 z-50" style={{ width: `${dropdownWidth || 220}px` }}>
          <div className="bg-white rounded-2xl py-1 shadow-xl border border-gray-100 max-h-[220px] overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-1.5 text-sm transition-all duration-200 first:rounded-t-2xl last:rounded-b-2xl ${
                  value === opt
                    ? 'bg-brand-red text-white font-semibold'
                    : 'text-brand-dark/70 hover:text-white hover:bg-brand-red'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchForm() {
  const [searchType, setSearchType] = useState<'arrendar' | 'comprar'>('arrendar');
  const [sector, setSector] = useState('');
  const [tipo, setTipo] = useState('');
  const [precioHasta, setPrecioHasta] = useState('');
  const [codigo, setCodigo] = useState('');
  const [habitaciones, setHabitaciones] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      className="relative z-20 mx-auto px-4 sm:px-6 lg:px-8"
      style={{ maxWidth: '72rem', marginTop: '-80px' }}
    >
      <div className="bg-white shadow-2xl">
        {/* Tabs - fondo oscuro, bordes rectos */}
        <div className="flex bg-brand-dark w-full">
          <button
            onClick={() => setSearchType('arrendar')}
            className={`flex-1 px-5 py-2.5 text-sm transition-all duration-200 ${
              searchType === 'arrendar'
                ? 'bg-white text-brand-red'
                : 'bg-white/40 text-white hover:bg-white/50'
            }`}
            style={{ fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif", fontWeight: 500 }}
          >
            Arrendar
          </button>
          <button
            onClick={() => setSearchType('comprar')}
            className={`flex-1 px-5 py-2.5 text-sm transition-all duration-200 ${
              searchType === 'comprar'
                ? 'bg-white text-brand-red'
                : 'bg-white/40 text-white hover:bg-white/50'
            }`}
            style={{ fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif", fontWeight: 500 }}
          >
            Comprar
          </button>
        </div>

        {/* Search Fields - orden: Código, Ubicación, Precio, Tipo, Habitaciones + Buscar */}
        <div className="flex flex-col sm:flex-row items-stretch">
          {/* Campo: Código */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="w-9 h-9 rounded shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f2f2f2' }}>
              <Hash className="w-5 h-5 text-brand-red" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-gray-400 leading-tight">Código</p>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ej: 1234"
                className="w-full text-sm text-brand-dark font-semibold bg-transparent border-none outline-none placeholder:text-gray-300 placeholder:font-normal"
              />
            </div>
          </div>

          {/* Campo: Ubicación / Sector */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="w-9 h-9 rounded shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f2f2f2' }}>
              <img src="/ubicacion.gif" alt="Ubicación" className="w-5 h-5" />
            </div>
            <CustomSelect
              label="Sector"
              value={sector}
              onChange={setSector}
              options={SECTORES}
              placeholder="Seleccionar"
            />
          </div>

          {/* Campo: Precio - Rango */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="w-9 h-9 rounded shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f2f2f2' }}>
              <img src="/precio.gif" alt="Precio" className="w-5 h-5" />
            </div>
            <CustomSelect
              label="Precio"
              value={precioHasta}
              onChange={setPrecioHasta}
              options={RANGOS_PRECIO}
              placeholder="Hasta $7.000.000"
              dropdownWidth={260}
            />
          </div>

          {/* Campo: Tipo de propiedad */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="w-9 h-9 rounded shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f2f2f2' }}>
              <img src="/tipo-de-propiedad.gif" alt="Tipo" className="w-5 h-5" />
            </div>
            <CustomSelect
              label="Tipo de Inmueble"
              value={tipo}
              onChange={setTipo}
              options={TIPOS_INMUEBLE}
              placeholder="Seleccionar"
            />
          </div>

          {/* Campo: Habitaciones */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="w-9 h-9 rounded shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f2f2f2' }}>
              <img src="/iconos-santafe.gif" alt="Habitaciones" className="w-5 h-5" />
            </div>
            <CustomSelect
              label="Habitaciones"
              value={habitaciones}
              onChange={setHabitaciones}
              options={HABITACIONES.map((h) => `${h} o más`)}
              placeholder="Seleccionar"
            />
          </div>

          {/* Botón Buscar - más grande que los filtros */}
          <button className="bg-brand-red hover:bg-brand-red-hover text-white px-8 py-3 sm:py-[18px] sm:px-10 text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-200 shrink-0">
            <Search className="h-5 w-5" />
            <span className="whitespace-nowrap">Buscar</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
