'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { properties } from '@/data/properties';
import { Button } from '@/components/ui/button';

const locations = ['Todas', 'Poblado', 'Envigado', 'Laureles', 'Buenos Aires', 'Sabaneta', 'Bello', 'Itagüí', 'Copacabana', 'La Strada'];
const types = ['Todos', 'Apartamento', 'Casa'];
const priceRanges = ['Todos', 'Hasta $800,000', '$800,000 - $1.500,000', '$1.500,000 - $2.500,000', 'Más de $2.500,000'];

export default function PropiedadesPage() {
  const [selectedLocation, setSelectedLocation] = useState('Todas');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedPrice, setSelectedPrice] = useState('Todos');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = properties.filter((p) => {
    if (selectedLocation !== 'Todas' && p.location !== selectedLocation) return false;
    if (selectedType !== 'Todos' && p.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-brand-dark py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Propiedades
            </h1>
            <p className="mt-2 text-white/60">
              Encuentra tu próximo hogar en Medellín y área metropolitana
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gray" />
            <input
              type="text"
              placeholder="Buscar por referencia, ubicación..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red"
            />
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center gap-2 rounded-xl"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-100 space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-brand-gray uppercase tracking-wider mb-2">
                Ubicación
              </label>
              <div className="flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setSelectedLocation(loc)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedLocation === loc
                        ? 'bg-brand-red text-white'
                        : 'bg-white text-brand-gray border border-gray-200 hover:border-brand-red'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-gray uppercase tracking-wider mb-2">
                Tipo de propiedad
              </label>
              <div className="flex flex-wrap gap-2">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedType === t
                        ? 'bg-brand-red text-white'
                        : 'bg-white text-brand-gray border border-gray-200 hover:border-brand-red'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-gray uppercase tracking-wider mb-2">
                Rango de precio
              </label>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((pr) => (
                  <button
                    key={pr}
                    onClick={() => setSelectedPrice(pr)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedPrice === pr
                        ? 'bg-brand-red text-white'
                        : 'bg-white text-brand-gray border border-gray-200 hover:border-brand-red'
                    }`}
                  >
                    {pr}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Results count */}
        <p className="text-sm text-brand-gray mb-5">
          {filtered.length} propiedades encontradas
        </p>

        {/* Property Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-brand-gray text-lg">
              No se encontraron propiedades con los filtros seleccionados.
            </p>
            <Button
              onClick={() => {
                setSelectedLocation('Todas');
                setSelectedType('Todos');
                setSelectedPrice('Todos');
              }}
              className="mt-4 bg-brand-red hover:bg-brand-red-hover text-white rounded-full"
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
