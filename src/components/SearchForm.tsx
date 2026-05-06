'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Hash } from 'lucide-react';

const SECTORES = [
  'Envigado', 'Poblado', 'Laureles', 'Belen', 'Estadio', 'Itagui', 'Sabaneta',
  'Bello', 'Caldas', 'Copacabana', 'Guarne', 'Rionegro', 'La Ceja',
  'Envigado', 'Medellin', 'Aranjuez', 'Buenos Aires', 'Castilla', 'Robledo',
  'Guayabal', 'El Poblado', 'Santo Domingo', 'Manrique', 'Popular',
  'San Javier', 'Santa Cruz', 'Altavista', 'San Antonio de Prado',
];

const TIPOS_INMUEBLE = [
  'ApartaEstudio', 'Apartamento', 'Bodega', 'Casa', 'CasaLocal',
  'Finca', 'Local', 'Oficina',
];

const HABITACIONES = ['1', '2', '3', '4', '5+'];

export default function SearchForm() {
  const [searchType, setSearchType] = useState<'arrendar' | 'comprar'>('arrendar');
  const [sector, setSector] = useState('');
  const [tipo, setTipo] = useState('');
  const [precioDesde, setPrecioDesde] = useState('');
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
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-gray-400 leading-tight">Sector</p>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full text-sm text-brand-dark font-semibold bg-transparent border-none outline-none appearance-none cursor-pointer"
              >
                <option value="">Seleccionar</option>
                {SECTORES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Campo: Precio */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="w-9 h-9 rounded shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f2f2f2' }}>
              <img src="/precio.gif" alt="Precio" className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-gray-400 leading-tight">Precio</p>
              <input
                type="text"
                value={precioHasta}
                onChange={(e) => setPrecioHasta(e.target.value)}
                placeholder="Hasta $5.000.000"
                className="w-full text-sm text-brand-dark font-semibold bg-transparent border-none outline-none placeholder:text-gray-300 placeholder:font-normal"
              />
            </div>
          </div>

          {/* Campo: Tipo de propiedad */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="w-9 h-9 rounded shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f2f2f2' }}>
              <img src="/tipo-de-propiedad.gif" alt="Tipo" className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-gray-400 leading-tight">Tipo de Inmueble</p>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full text-sm text-brand-dark font-semibold bg-transparent border-none outline-none appearance-none cursor-pointer"
              >
                <option value="">Seleccionar</option>
                {TIPOS_INMUEBLE.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Campo: Habitaciones */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="w-9 h-9 rounded shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f2f2f2' }}>
              <img src="/iconos-santafe.gif" alt="Habitaciones" className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-gray-400 leading-tight">Habitaciones</p>
              <select
                value={habitaciones}
                onChange={(e) => setHabitaciones(e.target.value)}
                className="w-full text-sm text-brand-dark font-semibold bg-transparent border-none outline-none appearance-none cursor-pointer"
              >
                <option value="">Seleccionar</option>
                {HABITACIONES.map((h) => (
                  <option key={h} value={h}>{h} o más</option>
                ))}
              </select>
            </div>
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
