'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, DollarSign, TrendingUp, Home } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { investmentZones, getZoneBySlug } from '@/data/investment-zones';
import { properties } from '@/data/properties';
import type { PageType } from '@/components/Header';

const WHATSAPP_URL = 'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consultar%20oportunidades%20de%20inversión%20inmobiliaria.';

export default function InversionZonePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [currentPage, setCurrentPage] = useState<PageType>('inversionistas');

  const zone = getZoneBySlug(slug);

  const relatedProperties = useMemo(() => {
    if (!zone) return [];
    return properties.filter(
      (p) => p.location.toLowerCase().includes(zone.name.toLowerCase()) && p.businessType === 'Comprar'
    );
  }, [zone]);

  const handleNavigate = (page: PageType) => {
    if (page === 'home') {
      window.location.href = '/';
    } else {
      setCurrentPage(page);
    }
  };

  if (!zone) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header currentPage={currentPage} onNavigate={handleNavigate} isHeroPage={false} />
        <main className="flex-1 flex items-center justify-center pt-[120px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Zona no encontrada</h1>
            <Link href="/inversionistas" className="text-brand-red hover:underline">
              Volver a zonas de inversión
            </Link>
          </div>
        </main>
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} onNavigate={handleNavigate} isHeroPage={false} />

      <main className="flex-1 relative pt-[120px]">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-dark to-gray-900 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/inversionistas"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a zonas de inversión
              </Link>

              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{zone.h1Title}</h1>
              <p className="text-lg text-gray-300 max-w-3xl">{zone.description}</p>
            </motion.div>
          </div>
        </section>

        {/* Zone Stats */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: TrendingUp, label: 'Rentabilidad promedio', value: zone.rentability },
                { icon: DollarSign, label: 'Precio por m²', value: zone.pricePerM2 },
                { icon: Home, label: 'Estratos predominantes', value: zone.strata },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-red/10 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-brand-red" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Advantages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Ventajas de invertir en {zone.name}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {zone.advantages.map((advantage, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-white rounded-xl p-6 border-l-4 border-brand-red"
                  >
                    <p className="text-gray-700 leading-relaxed">{advantage}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <section className="py-12 md:py-16 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-gray-900 mb-12"
              >
                Propiedades disponibles para inversión en {zone.name}
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProperties.map((property, i) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mt-12"
              >
                <Link
                  href={`/propiedades?location=${zone.name}&businessType=Comprar`}
                  className="inline-flex items-center gap-2 h-12 px-8 bg-brand-red hover:bg-brand-red-hover text-white font-semibold rounded-full transition-all duration-300"
                >
                  Ver todas las propiedades en {zone.name}
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        {/* Other Zones */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-gray-900 mb-12 text-center"
            >
              Explorar otras zonas de inversión
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {investmentZones
                .filter((z) => z.id !== zone.id)
                .map((otherZone, i) => (
                  <motion.Link
                    key={otherZone.id}
                    href={`/inversionistas/${otherZone.slug}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-red transition-colors">
                        {otherZone.name}
                      </h3>
                      <ArrowLeft className="w-5 h-5 text-brand-red rotate-180 group-hover:translate-x-1 transition-transform" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-brand-red">{otherZone.rentability}</span> rentabilidad
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">{otherZone.pricePerM2}</span> precio m²
                      </p>
                    </div>
                  </motion.Link>
                ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-brand-red">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                ¿Listo para invertir en {zone.name}?
              </h2>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-12 px-8 bg-white text-brand-red font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                <span>Solicitar asesoría</span>
                <img src="/icons/icon-whatsapp-red.gif" alt="WhatsApp" className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
