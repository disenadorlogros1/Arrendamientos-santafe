'use client';

import { motion } from 'framer-motion';
import { Shield, Clock, TrendingUp, FileCheck, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  {
    icon: Shield,
    title: 'Seguridad total',
    description: 'Verificamos cada propiedad y documento antes de consignarla. Tu tranquilidad es nuestra prioridad.',
  },
  {
    icon: Clock,
    title: 'Proceso ágil',
    description: 'Gestionamos todo el proceso de consignación de manera eficiente para que no pierdas tiempo.',
  },
  {
    icon: TrendingUp,
    title: 'Valorización',
    description: 'Te asesoramos para que tu propiedad mantenga y aumente su valor en el mercado.',
  },
  {
    icon: FileCheck,
    title: 'Documentación completa',
    description: 'Nos encargamos de toda la documentación legal y contractual de tu propiedad.',
  },
];

const steps = [
  { number: '01', title: 'Contacto inicial', description: 'Cuéntanos sobre tu propiedad y tus expectativas de consignación.' },
  { number: '02', title: 'Visita y evaluación', description: 'Realizamos una visita profesional para evaluar tu inmueble.' },
  { number: '03', title: 'Documentación', description: 'Recopilamos y verificamos toda la documentación necesaria.' },
  { number: '04', title: 'Publicación', description: 'Tu propiedad es publicada en nuestras plataformas con fotografías profesionales.' },
  { number: '05', title: 'Gestión y cierre', description: 'Gestionamos las visitas, negociaciones y el cierre del arriendo o venta.' },
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
              Consignación
            </h1>
            <p className="mt-2 text-white/60 max-w-2xl">
              Confía tu propiedad a profesionales. Nos encargamos de todo para que tú solo recibas los beneficios.
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
              Más de 15 años de experiencia nos respaldan. Tu propiedad en las mejores manos.
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
              Un proceso simple y transparente de principio a fin.
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
              ¿Listo para consignar tu propiedad?
            </h2>
            <p className="mt-3 text-white/60 max-w-xl mx-auto">
              Contáctanos hoy y agenda una visita sin compromiso. Te asesoramos en todo el proceso.
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
    </div>
  );
}
