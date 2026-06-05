'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import PropertyCard from './PropertyCard';
import InfiniteCarousel from './InfiniteCarousel';
import { properties } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';

const locations = ['Todas', 'Poblado', 'Envigado', 'Laureles', 'Buenos Aires', 'Sabaneta', 'Bello', 'Itagüí', 'Copacabana', 'La Strada'];
const types = ['Todos', 'Apartamento', 'Casa'];
const priceRanges = ['Todos', 'Hasta $800,000', '$800,000 - $1.500,000', '$1.500,000 - $2.500,000', 'Más de $2.500,000'];

export default function PropiedadesPage() {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.propiedades-title-split', 0, false);
  const [selectedBusinessType, setSelectedBusinessType] = useState<'Todos' | 'Arrendar' | 'Comprar'>('Todos');
  const [selectedLocation, setSelectedLocation] = useState('Todas');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedPrice, setSelectedPrice] = useState('Todos');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = properties.filter((p) => {
    if (selectedBusinessType !== 'Todos' && p.businessType !== selectedBusinessType) return false;
    if (selectedLocation !== 'Todas' && p.location !== selectedLocation) return false;
    if (selectedType !== 'Todos' && p.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-brand-dark py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={titleRef}>
          <h1
            className="propiedades-title-split text-3xl sm:text-4xl lg:text-5xl leading-tight text-white"
            style={{
              fontFamily: "'Avenir Next Ultra Light', 'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
              lineHeight: '1.2',
            }}
          >
            Ver{' '}
            <span
              className="text-brand-red inline-block"
              style={{
                fontWeight: 700,
              }}
            >
              propiedades
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleAnimating ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mt-5 text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed"
            style={{
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
              lineHeight: '1.45',
            }}
          >
            Encuentra tu próximo hogar en Medellín y área metropolitana. Explora nuestro inventario de propiedades disponibles.
          </motion.p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-1 sm:px-6 lg:px-8 py-8">
        {/* Business Type Filter — Igual al del Hero */}
        <div className="flex h-[44px] bg-white border border-gray-200 overflow-hidden mb-6 shadow-lg">
          {(['Todos', 'Arrendar', 'Comprar'] as const).map((type, i) => (
            <button
              key={type}
              onClick={() => setSelectedBusinessType(type)}
              className={`flex-1 flex items-center justify-center text-sm font-medium transition-all ${
                i < 2 ? 'border-r border-gray-200' : ''
              } ${
                selectedBusinessType === type
                  ? 'bg-brand-red text-white'
                  : 'bg-gray-50 text-brand-gray hover:bg-gray-100'
              }`}
              style={{
                fontFamily: "'Avenir LT Pro', 'Outfit', system-ui, sans-serif",
                fontSize: '14px',
              }}
            >
              {type}
            </button>
          ))}
        </div>

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

        {/* Mobile Carousel */}
        <div className="lg:hidden mb-8">
          <InfiniteCarousel properties={filtered} />
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-3 xl:grid-cols-4 gap-5">
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
          <div className="text-center py-16 lg:hidden">
            <p className="text-brand-gray text-lg">
              No se encontraron propiedades con los filtros seleccionados.
            </p>
            <Button
              onClick={() => {
                setSelectedBusinessType('Todos');
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

        {filtered.length === 0 && (
          <div className="hidden lg:block text-center py-16">
            <p className="text-brand-gray text-lg">
              No se encontraron propiedades con los filtros seleccionados.
            </p>
            <Button
              onClick={() => {
                setSelectedBusinessType('Todos');
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

        {/* Cross-linking CTAs */}
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-brand-red/5 to-transparent border border-brand-red/20 rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold text-brand-dark mb-3">¿Tienes un inmueble para arrendar o vender?</h3>
            <p className="text-gray-600 mb-6">
              Consigna tu propiedad con nosotros y accede a nuestra red de miles de clientes potenciales.
            </p>
            <Button
              onClick={() => window.location.href = '/consignacion'}
              className="bg-brand-red hover:bg-brand-red-hover text-white rounded-full"
            >
              Consigna tu propiedad
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-transparent border border-blue-200 rounded-xl p-8"
          >
            <h3 className="text-2xl font-bold text-brand-dark mb-3">¿Buscas oportunidades de inversión?</h3>
            <p className="text-gray-600 mb-6">
              Descubre nuestras propiedades con mayor potencial de retorno e inversión en Antioquia.
            </p>
            <Button
              onClick={() => window.location.href = '/inversionistas'}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            >
              Ver oportunidades de inversión
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
