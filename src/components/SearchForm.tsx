'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, Home, BedDouble, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SearchForm() {
  const [searchType, setSearchType] = useState<'arrendar' | 'comprar'>('arrendar');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      className="relative z-20 mx-auto -mt-10 max-w-5xl px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-gray-100 rounded-full p-1 w-fit">
          <button
            onClick={() => setSearchType('arrendar')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              searchType === 'arrendar'
                ? 'bg-brand-dark text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Arrendar
          </button>
          <button
            onClick={() => setSearchType('comprar')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              searchType === 'comprar'
                ? 'bg-brand-dark text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Comprar
          </button>
        </div>

        {/* Search Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gray" />
            <input
              type="text"
              placeholder="Ubicación"
              defaultValue="Envigado"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-all"
            />
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gray" />
            <input
              type="text"
              placeholder="Hasta $1'500,000"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-all"
            />
          </div>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gray" />
            <select
              defaultValue="Apartamento"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-all appearance-none"
            >
              <option>Apartamento</option>
              <option>Casa</option>
              <option>Estudio</option>
              <option>Local Comercial</option>
            </select>
          </div>
          <div className="relative">
            <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gray" />
            <select
              defaultValue="1"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-all appearance-none"
            >
              <option value="1">1 o más</option>
              <option value="2">2 o más</option>
              <option value="3">3 o más</option>
              <option value="4">4 o más</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <Button className="mt-4 w-full bg-brand-red hover:bg-brand-red-hover text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2">
          <Search className="h-4 w-4" />
          Buscar
        </Button>

        {/* Subtitle */}
        <p className="mt-3 text-center text-xs text-brand-gray">
          Medellín y área metropolitana
        </p>
      </div>
    </motion.div>
  );
}
