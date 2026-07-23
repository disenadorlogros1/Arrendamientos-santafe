'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { TrendingUp, Key, ClipboardList, BadgeCheck, Calculator } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HomeGif = (_: any) => (
  <><img src="/icons/icon-home-red.gif"   className="h-7 w-7 block group-hover:hidden" alt="" aria-hidden />
    <img src="/icons/icon-home-white.gif"  className="h-7 w-7 hidden group-hover:block" alt="" aria-hidden /></>
);
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/ScrollReveal';

const services = [
  {
    icon: HomeGif,
    title: 'Arrendamientos',
    description:
      'Encuentra tu próximo hogar o local. Te acompañamos desde la búsqueda hasta la firma.',
  },
  {
    icon: TrendingUp,
    title: 'Ventas',
    description: 'Vende al precio justo. Valoramos tu inmueble con criterio de mercado.',
  },
  {
    icon: Key,
    title: 'Consignación',
    description:
      'Nosotros conseguimos el arrendatario. Tú recibes el pago.',
  },
  {
    icon: ClipboardList,
    title: 'Administración',
    description:
      'Manejamos el cobro, los contratos y las reparaciones por ti.',
  },
  {
    icon: BadgeCheck,
    title: 'Avalúos',
    description: 'Recibe orientación sobre el valor comercial de tu inmueble.',
  },
  {
    icon: Calculator,
    title: 'Hipotecas',
    description: 'Conoce alternativas de préstamo sobre propiedad raíz.',
  },
];

export default function ServiciosPage() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.from(headerRef.current, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-brand-dark pb-12 md:pb-16" style={{ marginTop: '-86px', paddingTop: 'calc(86px + 48px)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div ref={headerRef}>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Nuestros servicios
            </h1>
            <p className="mt-2 text-white/70 max-w-2xl">
              Una oferta integral para acompañar tus decisiones inmobiliarias en
              Antioquia con respaldo, experiencia y procesos claros.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 0.1} y={30}>
                <div className="group p-6 rounded-xl border border-gray-100 hover:border-brand-red/20 hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-brand-red/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-brand-red group-hover:scale-110 transition-all duration-300">
                    <service.icon className="h-7 w-7 text-brand-red group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Additional info */}
      <section className="py-12 md:py-16 bg-brand-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <ScrollReveal y={20}>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Acompañamiento <span className="text-brand-red">en cada etapa</span>
              </h2>
              <p className="text-brand-gray leading-relaxed mb-4">
                Cada decisión inmobiliaria es distinta. Por eso ofrecemos un
                servicio con información clara, procesos ordenados y
                acompañamiento desde la primera consulta hasta el cierre.
              </p>
              <p className="text-brand-gray leading-relaxed">
                Nuestro equipo está disponible para orientarte en arrendamiento,
                venta, consignación, administración y asesoría hipotecaria.
              </p>
              <div className="mt-6 flex flex-wrap gap-6">
                <div>
                  <p className="text-3xl font-bold text-brand-red">60</p>
                  <p className="text-sm text-brand-gray">Años de experiencia</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-brand-red">3</p>
                  <p className="text-sm text-brand-gray">Sedes en Antioquia</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-brand-red">+1K</p>
                  <p className="text-sm text-brand-gray">Inmuebles en gestión activa</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal y={20} delay={0.1}>
              <div className="relative">
                <div
                  className="aspect-[4/3] rounded-2xl bg-cover bg-center"
                  style={{
                    backgroundImage: 'url(https://picsum.photos/seed/office-med/800/600)',
                  }}
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-brand-dark">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal y={20}>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              ¿Necesitas alguno de nuestros servicios?
            </h2>
            <p className="mt-3 text-white/70 max-w-xl mx-auto">
              Escríbenos por WhatsApp y un asesor te orientará con información
              clara sobre lo que necesitas.
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
                <img src="/icons/icon-whatsapp-red.gif" className="h-4 w-4 mr-2" alt="" aria-hidden="true" />
                Escribir por WhatsApp
              </a>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}