'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, BarChart3, DollarSign, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { investmentZones } from '@/data/investment-zones';

const beneficios = [
  { icon: TrendingUp, title: 'Rentabilidad comprobada', description: '60 años de experiencia generando retornos consistentes para nuestros inversionistas' },
  { icon: BarChart3, title: 'Análisis de mercado', description: 'Acceso a estudios y reportes detallados del mercado inmobiliario en Antioquia' },
  { icon: DollarSign, title: 'Múltiples opciones', description: 'Desde arrendamiento hasta proyectos de desarrollo inmobiliario' },
  { icon: MapPin, title: 'Ubicaciones estratégicas', description: 'Propiedades en las mejores zonas de Medellín y área metropolitana' },
];

const WHATSAPP_URL = 'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consultar%20oportunidades%20de%20inversión%20inmobiliaria.';

export default function InversionistasPage() {
  const [expandedZone, setExpandedZone] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-dark to-gray-900 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Inversión inmobiliaria en Medellín y el Valle de Aburrá
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Conoce las zonas con mayor potencial de valorización y rentabilidad inmobiliaria en Antioquia.
            </p>
            <a
              href="#zonas"
              className="inline-flex items-center gap-2 h-12 px-8 bg-brand-red hover:bg-brand-red-hover text-white font-semibold rounded-full transition-all duration-300"
            >
              Ver zonas estratégicas
            </a>
          </motion.div>
        </div>
      </section>

      {/* Investment Zones Section */}
      <section id="zonas" className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Zonas estratégicas para invertir
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Selecciona una zona para conocer rentabilidad, precios y ventajas de inversión
            </p>
          </motion.div>

          {/* Zone Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {investmentZones.map((zone, index) => (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Basic Info - Always Visible */}
                <button
                  onClick={() => setExpandedZone(expandedZone === zone.id ? null : zone.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{zone.name}</h3>
                    <ChevronDown
                      className={`w-6 h-6 text-brand-red transition-transform duration-300 ${
                        expandedZone === zone.id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-brand-red/5 to-transparent p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Rentabilidad</p>
                      <p className="text-lg font-bold text-brand-red">{zone.rentability}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-transparent p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Precio m²</p>
                      <p className="text-sm font-bold text-gray-900">{zone.pricePerM2}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-transparent p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Estratos</p>
                      <p className="text-lg font-bold text-gray-900">{zone.strata}</p>
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedZone === zone.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200"
                    >
                      <div className="p-6 space-y-4">
                        {/* Description */}
                        <p className="text-gray-600 leading-relaxed">{zone.description}</p>

                        {/* Advantages */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3">Ventajas de inversión:</h4>
                          <ul className="space-y-2">
                            {zone.advantages.map((advantage, i) => (
                              <li key={i} className="flex items-start gap-2 text-gray-700">
                                <span className="w-2 h-2 bg-brand-red rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm">{advantage}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* CTAs */}
                        <div className="grid grid-cols-2 gap-3 pt-4">
                          <a
                            href={`/propiedades?location=${zone.name}`}
                            className="inline-flex items-center justify-center gap-1 h-10 px-4 bg-brand-red hover:bg-brand-red-hover text-white font-semibold rounded-lg transition-colors text-sm"
                          >
                            Ver propiedades
                          </a>
                          <a
                            href={`/inversionistas/${zone.slug}`}
                            className="inline-flex items-center justify-center gap-1 h-10 px-4 border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white font-semibold rounded-lg transition-colors text-sm"
                          >
                            Más información
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué invertir con nosotros?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {beneficios.map((beneficio, i) => (
              <motion.div
                key={beneficio.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <div className="w-12 h-12 bg-brand-red/10 rounded-lg flex items-center justify-center mb-4">
                  <beneficio.icon className="w-6 h-6 text-brand-red" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{beneficio.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{beneficio.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-brand-red">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white mb-8"
          >
            ¿Listo para comenzar tu inversión?
          </motion.h2>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-12 px-8 bg-white text-brand-red font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            <span>Solicitar asesoría</span>
            <img src="/icons/icon-whatsapp-red.gif" alt="WhatsApp" className="w-5 h-5" />
          </motion.a>
        </div>
      </section>
    </div>
  );
}
