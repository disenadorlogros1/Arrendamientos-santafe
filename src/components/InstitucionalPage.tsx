'use client';

import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Heart,
  Target,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const team = [
  {
    name: 'María Fernanda López',
    role: 'Directora General',
    image: 'https://picsum.photos/seed/team1/400/400',
  },
  {
    name: 'Carlos Andrés Gómez',
    role: 'Asesor Comercial',
    image: 'https://picsum.photos/seed/team2/400/400',
  },
  {
    name: 'Laura Patricia Martínez',
    role: 'Asesora Legal',
    image: 'https://picsum.photos/seed/team3/400/400',
  },
  {
    name: 'Juan Sebastián Ramírez',
    role: 'Coordinador de Ventas',
    image: 'https://picsum.photos/seed/team4/400/400',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Transparencia',
    description: 'Operamos con total honestidad y claridad en cada transacción.',
  },
  {
    icon: Target,
    title: 'Compromiso',
    description: 'Nos comprometemos con cada cliente para encontrar la mejor solución.',
  },
  {
    icon: Users,
    title: 'Cercanía',
    description: 'Tratamos a cada cliente como parte de nuestra familia.',
  },
];

export default function InstitucionalPage() {
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
              Institucional
            </h1>
            <p className="mt-2 text-white/60 max-w-2xl">
              Conoce quiénes somos y por qué somos tu mejor opción inmobiliaria en Medellín.
            </p>
          </motion.div>
        </div>
      </div>

      {/* About */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo-rojo.png" alt="Arrendamientos Santa Fe" className="h-6 w-auto object-contain" />
                <h2 className="text-sm font-medium text-brand-red uppercase tracking-wider">
                  Sobre nosotros
                </h2>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Más de 15 años conectando personas con su hogar ideal
              </h3>
              <p className="text-brand-gray leading-relaxed mb-4">
                Arrendamientos Santa Fe nació con la misión de hacer más fácil y transparente el
                proceso de encontrar arriendo o compra de propiedades en Medellín y su área
                metropolitana.
              </p>
              <p className="text-brand-gray leading-relaxed mb-4">
                Desde nuestros inicios, nos hemos destacado por un servicio personalizado, una
                comunicación clara y un compromiso genuino con cada uno de nuestros clientes. No
                somos una inmobiliaria más, somos tu aliado inmobiliario de confianza.
              </p>
              <p className="text-brand-gray leading-relaxed">
                Hoy contamos con un equipo multidisciplinario de profesionales apasionados por el
                sector inmobiliario, listos para acompañarte en cada paso de tu camino hacia el
                hogar de tus sueños.
              </p>
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
                  backgroundImage:
                    'url(https://picsum.photos/seed/medellin-city/800/600)',
                }}
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 bg-white rounded-xl p-4 shadow-lg">
                <p className="text-2xl font-bold text-brand-red">15+</p>
                <p className="text-xs text-brand-gray">Años de experiencia</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-16 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Nuestros <span className="text-brand-red">valores</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center bg-white p-8 rounded-xl shadow-sm"
              >
                <div className="w-14 h-14 bg-brand-red/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-7 w-7 text-brand-red" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-brand-gray leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
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
              Nuestro <span className="text-brand-red">equipo</span>
            </h2>
            <p className="mt-3 text-brand-gray max-w-2xl mx-auto">
              Profesionales comprometidos con hacer de tu experiencia inmobiliaria la mejor posible.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div
                  className="aspect-square rounded-2xl bg-cover bg-center mb-3 mx-auto w-full max-w-[200px]"
                  style={{ backgroundImage: `url(${member.image})` }}
                />
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{member.name}</h4>
                <p className="text-xs sm:text-sm text-brand-gray">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 md:py-16 bg-brand-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Contáctanos
            </h2>
            <p className="mt-3 text-white/60 max-w-xl mx-auto">
              Estamos disponibles para atenderte y resolver todas tus dudas.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-5 text-center border border-white/10">
              <MapPin className="h-6 w-6 text-brand-red mx-auto mb-2" />
              <p className="text-sm text-white font-medium">Ubicación</p>
              <p className="text-xs text-white/50 mt-1">Medellín, Antioquia</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 text-center border border-white/10">
              <Phone className="h-6 w-6 text-brand-red mx-auto mb-2" />
              <p className="text-sm text-white font-medium">Teléfono</p>
              <p className="text-xs text-white/50 mt-1">+57 300 000 0000</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 text-center border border-white/10">
              <Mail className="h-6 w-6 text-brand-red mx-auto mb-2" />
              <p className="text-sm text-white font-medium">Email</p>
              <p className="text-xs text-white/50 mt-1">info@santafe.com</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 text-center border border-white/10">
              <Clock className="h-6 w-6 text-brand-red mx-auto mb-2" />
              <p className="text-sm text-white font-medium">Horario</p>
              <p className="text-xs text-white/50 mt-1">Lun - Sáb: 8am - 6pm</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button
              asChild
              className="bg-white text-brand-dark hover:bg-white/90 rounded-full px-8 py-3 font-semibold"
            >
              <a
                href="https://wa.me/573006557529?text=Hola%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Arrendamientos%20Santa%20Fe."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
