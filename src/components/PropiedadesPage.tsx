'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropertyCard from './PropertyCard';
import InfiniteCarousel from './InfiniteCarousel';
import { properties } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import PropiedadesSearchBar, { type PropSearchFilters } from './PropiedadesSearchBar';

const FONT_HEADING = "'Avenir Next Ultra Light', 'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif";
const FONT_BODY    = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";

function parsePrice(s: string): number {
  return parseInt(s.replace(/[^0-9]/g, '')) || 0;
}

function parseArea(s: string): number {
  return parseInt(s) || 0;
}

function applyFilters(filters: PropSearchFilters) {
  return properties.filter((p) => {
    // Tipo de negocio
    if (p.businessType && p.businessType !== filters.tipo) return false;

    // Sector
    if (filters.sector && p.location.toLowerCase() !== filters.sector.toLowerCase()) return false;

    // Precio
    const price = parsePrice(p.price);
    if (price > 0 && (price < filters.precioMin || price > filters.precioMax)) return false;

    // Habitaciones
    if (filters.habitaciones !== null) {
      if (filters.habitaciones >= 5) {
        if (p.bedrooms < 5) return false;
      } else {
        if (p.bedrooms !== filters.habitaciones) return false;
      }
    }

    // Baños
    if (filters.banos !== null) {
      if (filters.banos >= 4) {
        if (p.bathrooms < 4) return false;
      } else {
        if (p.bathrooms !== filters.banos) return false;
      }
    }

    // Parqueadero
    if (filters.parqueadero === 'con') {
      if (!p.parking && !p.garage) return false;
    } else if (filters.parqueadero === 'sin') {
      if (p.parking || p.garage) return false;
    }

    // Área
    const area = parseArea(p.size);
    if (filters.areaMin && area < parseInt(filters.areaMin)) return false;
    if (filters.areaMax && area > parseInt(filters.areaMax)) return false;

    // Estrato
    if (filters.estrato.length > 0) {
      if (!p.stratum || !filters.estrato.includes(String(p.stratum))) return false;
    }

    // Comodidades
    if (filters.comodidades.length > 0) {
      for (const c of filters.comodidades) {
        if (c === 'Amoblado' && !p.furnished) return false;
        if (c === 'Piscina' && !p.pool) return false;
        if (['Balcón', 'Unidad Cerrada', 'Cuarto útil', 'Juegos infantiles', 'Ascensor'].includes(c)) {
          const found = p.characteristics?.some(ch =>
            ch.toLowerCase().includes(c.toLowerCase())
          );
          if (!found) return false;
        }
      }
    }

    return true;
  });
}

export default function PropiedadesPage({ initialFilter = 'Todos' }: { initialFilter?: 'Todos' | 'Arrendar' | 'Comprar' }) {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.propiedades-title-split', 0, false);

  const initialTipo: 'Arrendar' | 'Comprar' = initialFilter === 'Comprar' ? 'Comprar' : 'Arrendar';
  const [appliedFilters, setAppliedFilters] = useState<PropSearchFilters>({
    tipo: initialTipo,
    sector: '',
    precioMin: 0,
    precioMax: 15_000_000,
    habitaciones: null,
    banos: null,
    parqueadero: null,
    areaMin: '',
    areaMax: '',
    estrato: [],
    comodidades: [],
  });

  useEffect(() => {
    setAppliedFilters(prev => ({
      ...prev,
      tipo: initialFilter === 'Comprar' ? 'Comprar' : 'Arrendar',
    }));
  }, [initialFilter]);

  const filtered = applyFilters(appliedFilters);

  return (
    <div className="min-h-screen" style={{ background: '#f7f6f4' }}>
      {/* Page Header */}
      <div style={{ background: '#0d0d0d', marginTop: '-43px', padding: 'calc(43px + clamp(32px, 5vw, 56px)) clamp(20px, 5vw, 80px) clamp(24px, 3vw, 40px)' }}>
        <div ref={titleRef}>
          <h1
            className="propiedades-title-split"
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 300,
              fontSize: 'clamp(26px, 3.4vw, 48px)',
              color: '#fff',
              lineHeight: 1.18,
              margin: '0 0 14px 0',
            }}
          >
            Ver{' '}
            <span style={{ fontWeight: 700, color: '#f32735' }}>propiedades</span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={titleAnimating ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 300,
              fontSize: 'clamp(13px, 1.1vw, 16px)',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.55,
              margin: 0,
              maxWidth: '560px',
            }}
          >
            Encuentra tu próximo hogar en Medellín y área metropolitana.
          </motion.p>
        </div>
      </div>

      {/* Search Bar — sticky bajo el header */}
      <div style={{ position: 'sticky', top: '43px', zIndex: 40 }}>
        <PropiedadesSearchBar
          initialTipo={initialTipo}
          onApply={setAppliedFilters}
        />
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px clamp(16px, 3vw, 48px)' }}>
        {/* Results count */}
        <p style={{ fontFamily: FONT_BODY, fontSize: '13px', color: '#999', marginBottom: '20px' }}>
          {filtered.length} {filtered.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
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
          <div className="text-center py-16">
            <p style={{ fontFamily: FONT_BODY, fontSize: '16px', color: '#999', marginBottom: '16px' }}>
              No se encontraron propiedades con los filtros seleccionados.
            </p>
            <button
              type="button"
              onClick={() => setAppliedFilters(prev => ({
                tipo: prev.tipo,
                sector: '',
                precioMin: 0,
                precioMax: prev.tipo === 'Comprar' ? 500_000_000 : 15_000_000,
                habitaciones: null,
                banos: null,
                parqueadero: null,
                areaMin: '',
                areaMax: '',
                estrato: [],
                comodidades: [],
              }))}
              style={{
                fontFamily: FONT_BODY, fontSize: '13px', fontWeight: 600,
                color: '#fff', background: '#f32735', border: 'none',
                cursor: 'pointer', padding: '11px 24px', borderRadius: '2px',
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Cross-linking CTAs */}
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'rgba(243,39,53,0.04)',
              border: '1px solid rgba(243,39,53,0.15)',
              borderRadius: '8px',
              padding: '32px',
            }}
          >
            <h3 style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: '20px', color: '#1a1a1a', marginBottom: '10px' }}>
              ¿Tienes un inmueble para arrendar o vender?
            </h3>
            <p style={{ fontFamily: FONT_BODY, fontSize: '14px', color: '#666', marginBottom: '20px', lineHeight: 1.55 }}>
              Consigna tu propiedad con nosotros y accede a nuestra red de clientes.
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
            style={{
              background: 'rgb(239,246,255)',
              border: '1px solid rgb(191,219,254)',
              borderRadius: '8px',
              padding: '32px',
            }}
          >
            <h3 style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: '20px', color: '#1a1a1a', marginBottom: '10px' }}>
              ¿Buscas oportunidades de inversión?
            </h3>
            <p style={{ fontFamily: FONT_BODY, fontSize: '14px', color: '#666', marginBottom: '20px', lineHeight: 1.55 }}>
              Descubre nuestras propiedades con mayor potencial de retorno en Antioquia.
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
