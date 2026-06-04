'use client';

import { motion } from 'framer-motion';
import { Shield, Clock, TrendingUp, FileCheck, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  {
    icon: Shield,
    title: 'Respaldo y experiencia',
    description: '60 años de trayectoria en el mercado inmobiliario de Antioquia.',
  },
  {
    icon: Clock,
    title: 'Procesos claros',
    description: 'Acompañamiento oportuno en cada etapa, con información transparente.',
  },
  {
    icon: TrendingUp,
    title: 'Conocimiento del mercado',
    description: 'Te orientamos sobre el comportamiento del sector y la valorización de tu inmueble.',
  },
  {
    icon: FileCheck,
    title: 'Gestión documental',
    description: 'Apoyo en la revisión y trámite de la documentación legal y contractual.',
  },
];

const steps = [
  { number: '01', title: 'Contacto inicial', description: 'Cuéntanos sobre tu inmueble y los objetivos del propietario.' },
  { number: '02', title: 'Visita y evaluación', description: 'Visitamos el inmueble y revisamos su estado, ubicación y características.' },
  { number: '03', title: 'Documentación', description: 'Recopilamos y revisamos la documentación requerida para la gestión.' },
  { number: '04', title: 'Publicación', description: 'Publicamos el inmueble en nuestros canales con material fotográfico profesional.' },
  { number: '05', title: 'Gestión y cierre', description: 'Coordinamos visitas, negociación y cierre del arrendamiento o venta.' },
];

export default function ConsignacionPage() {
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
              Consignación de inmuebles
            </h1>
            <p className="mt-2 text-white/70 max-w-2xl">
              Consigna tu propiedad con respaldo, experiencia y conocimiento del
              mercado inmobiliario en Antioquia.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Benefits */}
      <section className="py-12 md:py-20 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              ¿Por qué consignar con <span className="text-brand-red">Arrendamientos Santa Fe</span>?
            </h2>
            <p className="mt-3 text-brand-gray max-w-2xl mx-auto">
              60 años de experiencia en arrendamiento, venta y administración
              inmobiliaria en Antioquia.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-brand-red" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-brand-gray leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Proceso de <span className="text-brand-red">consignación</span>
            </h2>
            <p className="mt-3 text-brand-gray max-w-2xl mx-auto">
              Un proceso ordenado, con información clara en cada etapa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative text-center"
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gray-200" />
                )}
                <div className="w-16 h-16 bg-brand-red rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  {step.number}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{step.title}</h3>
                <p className="text-xs text-brand-gray leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-brand-dark">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Users className="h-12 w-12 text-brand-red mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              ¿Tienes un inmueble para consignar?
            </h2>
            <p className="mt-3 text-white/70 max-w-xl mx-auto">
              Conversemos sobre tu propiedad. Te orientamos con información
              clara para que tomes una mejor decisión.
            </p>
            <Button
              asChild
              className="mt-6 bg-white text-brand-dark hover:bg-white/90 rounded-full px-8 py-3 font-semibold"
            >
              <a
                href="https://wa.me/573006557529?text=Hola%2C%20quisiera%20consignar%20una%20propiedad%20con%20Arrendamientos%20Santa%20Fe."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Consignar por WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Cross-linking CTAs */}
      <section className="py-12 md:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-blue-50 to-transparent border border-blue-200 rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold text-brand-dark mb-3">¿Buscas una propiedad para arrendar o comprar?</h3>
              <p className="text-gray-600 mb-6">
                Explora nuestro catálogo de miles de propiedades disponibles en Medellín y Antioquia.
              </p>
              <Button
                onClick={() => window.location.href = '/propiedades'}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              >
                Ver propiedades disponibles
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-green-50 to-transparent border border-green-200 rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold text-brand-dark mb-3">¿Te interesa invertir en inmuebles?</h3>
              <p className="text-gray-600 mb-6">
                Descubre nuestras oportunidades de inversión con mayor potencial de retorno en Antioquia.
              </p>
              <Button
                onClick={() => window.location.href = '/inversionistas'}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full"
              >
                Explorar inversiones inmobiliarias
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
