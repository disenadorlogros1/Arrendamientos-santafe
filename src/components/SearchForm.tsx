'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function SearchForm() {
  const [searchType, setSearchType] = useState<'arrendar' | 'comprar'>('arrendar');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      className="relative z-20 mx-auto -mt-10 px-4 sm:px-6 lg:px-8"
      style={{ maxWidth: '72rem' }}
    >
      <div className="bg-white shadow-2xl">
        {/* Tabs - fondo oscuro, bordes rectos */}
        <div className="flex bg-brand-dark w-full">
          <button
            onClick={() => setSearchType('arrendar')}
            className={`flex-1 px-5 py-2.5 text-sm transition-all duration-200 ${
              searchType === 'arrendar'
                ? 'bg-white text-[#808080]'
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
                ? 'bg-white text-[#808080]'
                : 'bg-white/40 text-white hover:bg-white/50'
            }`}
            style={{ fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif", fontWeight: 500 }}
          >
            Comprar
          </button>
        </div>

        {/* Search Fields - layout horizontal con iconos GIF, bordes rectos */}
        <div className="flex flex-col sm:flex-row">
          {/* Campo: Ubicación */}
          <div className="flex-1 flex items-center gap-2 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <img src="/ubicacion.gif" alt="Ubicación" className="w-5 h-5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400 leading-tight">Ubicación</p>
              <p className="text-sm text-brand-dark font-semibold truncate">Envigado</p>
            </div>
          </div>

          {/* Campo: Precio */}
          <div className="flex-1 flex items-center gap-2 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <img src="/precio.gif" alt="Precio" className="w-5 h-5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400 leading-tight">Precio</p>
              <p className="text-sm text-brand-dark font-semibold truncate">Hasta 1&apos;500.000</p>
            </div>
          </div>

          {/* Campo: Tipo de propiedad */}
          <div className="flex-1 flex items-center gap-2 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <img src="/tipo-de-propiedad.gif" alt="Tipo de propiedad" className="w-5 h-5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400 leading-tight">Tipo de propiedad</p>
              <p className="text-sm text-brand-dark font-semibold truncate">Apartamento</p>
            </div>
          </div>

          {/* Campo: Habitaciones */}
          <div className="flex-1 flex items-center gap-2 px-4 py-3 border-b sm:border-b-0 sm:border-r border-gray-200">
            <img src="/iconos-santafe.gif" alt="Habitaciones" className="w-5 h-5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400 leading-tight">Habitaciones</p>
              <p className="text-sm text-brand-dark font-semibold truncate">1 o más</p>
            </div>
          </div>

          {/* Botón Buscar - bordes rectos */}
          <button className="bg-brand-red hover:bg-brand-red-hover text-white px-6 py-3 sm:px-8 text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-200 shrink-0">
            <Search className="h-4 w-4" />
            Buscar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
