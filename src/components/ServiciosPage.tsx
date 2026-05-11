'use client';

import { motion } from 'framer-motion';
import {
  Home,
  Key,
  FileCheck,
  Scale,
  PaintBucket,
  Camera,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: Home,
    title: 'Arriendos',
    description:
      'Gestión completa de arriendo: búsqueda de inquilinos, contratos, cobros y mantenimiento. Tú solo recibes tu renta.',
  },
  {
    icon: Key,
    title: 'Ventas',
    description:
      'Venta profesional de tu propiedad con tasación de mercado, fotografía profesional y negociación experta.',
  },
  {
    icon: FileCheck,
    title: 'Consignación',
    description:
      'Deja tu propiedad en nuestras manos. La administramos, protegemos y mantenemos como si fuera nuestra.',
  },
  {
    icon: Scale,
    title: 'Asesoría legal',
    description:
      'Revisión de contratos, estudio de títulos y acompañamiento legal en todas las transacciones inmobiliarias.',
  },
  {
    icon: PaintBucket,
    title: 'Adecuación',
    description:
      'Servicio de adecuación y mejora de propiedades para maximizar su valor en el mercado de arriendo o venta.',
  },
  {
    icon: Camera,
    title: 'Fotografía profesional',
    description:
      'Sesiones fotográficas y videos de alta calidad para que tu propiedad destaque en todas las plataformas.',
  },
];

export default function ServiciosPage() {
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
              Nuestros Servicios
            </h1>
            <p className="mt-2 text-white/60 max-w-2xl">
              Soluciones inmobiliarias integrales para cada etapa de tu vida.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services Grid */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group p-6 rounded-xl border border-gray-100 hover:border-brand-red/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 bg-brand-red/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-brand-red group-hover:scale-110 transition-all duration-300">
                  <service.icon className="h-7 w-7 text-brand-red group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-brand-gray leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional info */}
      <section className="py-12 md:py-16 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Atención <span className="text-brand-red">personalizada</span>
              </h2>
              <p className="text-brand-gray leading-relaxed mb-4">
                Cada cliente es único, y cada propiedad lo es también. Por eso ofrecemos un servicio
                personalizado que se adapta a tus necesidades específicas, ya sea que busques arrendar,
                comprar, vender o consignar tu propiedad.
              </p>
              <p className="text-brand-gray leading-relaxed">
                Nuestro equipo de profesionales está disponible para acompañarte en cada paso del proceso,
                desde la primera consulta hasta la firma del contrato.
              </p>
              <div className="mt-6 flex flex-wrap gap-6">
                <div>
                  <p className="text-3xl font-bold text-brand-red">500+</p>
                  <p className="text-sm text-brand-gray">Propiedades gestionadas</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-brand-red">15+</p>
                  <p className="text-sm text-brand-gray">Años de experiencia</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-brand-red">98%</p>
                  <p className="text-sm text-brand-gray">Clientes satisfechos</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div
                className="aspect-[4/3] rounded-2xl bg-cover bg-center"
                style={{
                  backgroundImage: 'url(https://picsum.photos/seed/office-med/800/600)',
                }}
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
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
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              ¿Necesitas alguno de nuestros servicios?
            </h2>
            <p className="mt-3 text-white/60 max-w-xl mx-auto">
              Escríbenos y cuéntanos qué necesitas. Te respondemos en minutos.
            </p>
            <Button
              asChild
              className="mt-6 bg-white text-brand-dark hover:bg-white/90 rounded-full px-8 py-3 font-semibold"
            >
              <a
                href="https://wa.me/573006557529?text=Hola%2C%20quisiera%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Arrendamientos%20Santa%20Fe."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Escribir por WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
