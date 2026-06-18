'use client';

import { motion } from 'framer-motion';
import { Calendar, Home, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';

const WHATSAPP_URL = 'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consignar%20una%20propiedad%20con%20Arrendamientos%20Santa%20Fe.';
const PRIVACY_POLICY_URL = 'https://bit.ly/34WpJ7H';

export default function ConsignacionPage() {
  const { ref: titleRef, titleAnimating } = useSplitTextAnimation('.consignacion-title-split', 0, false);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[550px] md:h-[720px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800" style={{ marginTop: '-43px' }}>
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/Banner_consigna_propiedad.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl" ref={titleRef}>
          <h1
            className="consignacion-title-split text-3xl sm:text-4xl lg:text-5xl leading-tight text-white"
            style={{
              fontFamily: "'Avenir Next Ultra Light', 'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
              lineHeight: '1.2',
            }}
          >
            Ten la tranquilidad de dejar tu inmueble en{' '}
            <span
              className="text-brand-red inline-block"
              style={{
                fontWeight: 700,
              }}
            >
              buenas manos
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleAnimating ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mt-5 text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed"
            style={{
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
              lineHeight: '1.45',
            }}
          >
            Consigna tu inmueble con nosotros y deja que nuestro equipo experto se encargue de todo. Más de 60 años generando resultados.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleAnimating ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
            className="mt-8"
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-12 px-8 bg-brand-red hover:bg-white hover:text-brand-red text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <span>EMPECEMOS AHORA MISMO</span>
              <img src="/icons/icon-whatsapp-white.gif" alt="WhatsApp" className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Intro Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              Consigna tu inmueble con nosotros sin ningún costo de promoción y arriéndalo o véndelo en el menor tiempo posible
            </p>
          </motion.div>

          {/* Steps */}
          <div className="space-y-8 md:space-y-12 mb-12">
            {[
              { number: '1', title: 'DÉJANOS TUS DATOS' },
              { number: '2', title: 'TE BRINDAREMOS UNA ASESORÍA COMPLETA' },
              { number: '3', title: 'NOS OCUPAREMOS AHORA EN ADELANTE DEL RESTO' },
            ].map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-6 md:gap-8"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-brand-red rounded-full">
                    <span className="text-white font-bold text-lg md:text-xl">{step.number}</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg md:text-xl font-bold text-brand-dark">{step.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA and Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-12 px-8 border-2 border-brand-dark text-brand-dark font-semibold rounded-full hover:bg-brand-dark hover:text-white transition-all duration-300"
            >
              <span>EMPECEMOS</span>
              <img src="/icons/icon-whatsapp-white.gif" alt="WhatsApp" className="w-5 h-5 invert" />
            </a>

            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              *Al enviar el formulario estoy aceptando la política de tratamiento de datos:{' '}
              <a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">
                {PRIVACY_POLICY_URL}
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16"
          >
            ¿Por qué escogernos?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Experiencia',
                description: 'Contamos con más de 55 años de trayectoria, siendo una de las empresas pioneras del sector inmobiliario en Antioquia.',
              },
              {
                icon: Home,
                title: 'Confiabilidad',
                description: 'Administramos tu inmueble y nos aseguramos de que sea arrendado o comprado por la persona indicada.',
              },
              {
                icon: DollarSign,
                title: 'Respaldo',
                description: 'Garantizamos el pago del canon de arrendamiento y servicios públicos básicos.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-20 bg-brand-red">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white mb-8"
          >
            ¿Listo para arrendar tu inmueble?
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
            <span>EMPECEMOS</span>
            <img src="/icons/icon-whatsapp-red.gif" alt="WhatsApp" className="w-5 h-5" />
          </motion.a>
        </div>
      </section>
    </div>
  );
}
