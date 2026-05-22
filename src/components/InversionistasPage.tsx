'use client';

import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, DollarSign, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const beneficios = [
  { icon: TrendingUp, title: 'Rentabilidad comprobada', description: '60 años de experiencia generando retornos consistentes para nuestros inversionistas' },
  { icon: BarChart3, title: 'Análisis de mercado', description: 'Acceso a estudios y reportes detallados del mercado inmobiliario en Antioquia' },
  { icon: DollarSign, title: 'Múltiples opciones', description: 'Desde arrendamiento hasta proyectos de desarrollo inmobiliario' },
  { icon: MapPin, title: 'Ubicaciones estratégicas', description: 'Propiedades en las mejores zonas de Medellín y área metropolitana' },
];

const oportunidades = [
  {
    title: 'Propiedades en Arrendamiento',
    description: 'Invierte en propiedades generadoras de ingresos mensuales con alta demanda en Medellín.',
    retorno: '5-8% anual',
  },
  {
    title: 'Proyectos Inmobiliarios',
    description: 'Participación en proyectos de desarrollo con potencial de revalorización significativa.',
    retorno: '15-25% ciclo proyecto',
  },
  {
    title: 'Cartera Diversificada',
    description: 'Portafolio balanceado entre diferentes tipos de propiedades y ubicaciones.',
    retorno: 'Personalizado',
  },
];

const pasos = [
  { numero: '1', titulo: 'Consulta inicial', descripcion: 'Conocemos tu perfil de inversión y objetivos financieros' },
  { numero: '2', titulo: 'Análisis de opciones', descripcion: 'Presentamos oportunidades alineadas con tu perfil' },
  { numero: '3', titulo: 'Evaluación técnica', descripcion: 'Análisis legal, técnico y financiero de la propiedad' },
  { numero: '4', titulo: 'Cierre e inversión', descripcion: 'Acompañamiento completo en el proceso de inversión' },
];

export default function InversionistasPage() {
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
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Para Inversionistas
            </h1>
            <p className="text-white/70 text-lg max-w-2xl">
              Oportunidades inmobiliarias con rentabilidad comprobada en Antioquia
            </p>
          </motion.div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Invierte en el crecimiento de Medellín
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Con 60 años acompañando inversores, te ofrecemos oportunidades inmobiliarias de alto potencial en las mejores ubicaciones de Antioquia.
            </p>
          </motion.div>

          {/* Beneficios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {beneficios.map((beneficio, idx) => {
              const Icon = beneficio.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <Icon className="w-8 h-8 text-brand-red mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">{beneficio.title}</h3>
                  <p className="text-gray-600 text-sm">{beneficio.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Oportunidades */}
      <section className="py-12 md:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 text-center">
              Tipos de Inversión
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Elige la opción que mejor se adapte a tu estrategia de inversión
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {oportunidades.map((oportunidad, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-lg border border-gray-200 hover:shadow-xl transition-all"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{oportunidad.title}</h3>
                  <p className="text-gray-600 text-sm mb-6">{oportunidad.descripcion}</p>
                  <div className="pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Retorno potencial:</p>
                    <p className="text-2xl font-bold text-brand-red">{oportunidad.retorno}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Proceso de inversión */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 text-center">
              Nuestro Proceso
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Te acompañamos en cada paso de tu inversión inmobiliaria
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {pasos.map((paso, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                    <div className="w-12 h-12 bg-brand-red text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {paso.numero}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{paso.titulo}</h3>
                    <p className="text-gray-600 text-sm">{paso.descripcion}</p>
                  </div>
                  {idx < pasos.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-brand-red" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-12 md:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                ¿Por qué invertir con nosotros?
              </h2>
              <ul className="space-y-4">
                {[
                  '60 años de experiencia y trayectoria comprobada',
                  'Equipo de expertos en análisis inmobiliario',
                  'Transparencia total en cada transacción',
                  'Acceso exclusivo a oportunidades premium',
                  'Acompañamiento profesional de principio a fin',
                  'Rentabilidades consistentes y verificables',
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-brand-red/10 to-brand-red/5 rounded-lg p-8 border border-brand-red/20"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Listo para invertir?
              </h3>
              <p className="text-gray-700 mb-6">
                Contáctanos hoy y conoce las oportunidades exclusivas que tenemos disponibles para ti.
              </p>
              <Button className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-semibold h-12">
                Solicitar asesoría
              </Button>
              <p className="text-gray-600 text-sm text-center mt-4">
                O llama a <span className="font-semibold">+57 300 655 7529</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
