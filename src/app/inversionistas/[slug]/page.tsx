'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import gsap from 'gsap';
import { ArrowLeft, DollarSign, TrendingUp, Home } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import ScrollReveal from '@/components/ScrollReveal';
import { investmentZones, getZoneBySlug } from '@/data/investment-zones';
import { properties, getNeighborhoodsForZone } from '@/data/properties';
import type { PageType } from '@/components/Header';
import { navigate } from '@/lib/navigate';

const WHATSAPP_URL = 'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consultar%20oportunidades%20de%20inversión%20inmobiliaria.';

export default function InversionZonePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [currentPage, setCurrentPage] = useState<PageType>('inversionistas');
  const heroRef = useRef<HTMLDivElement>(null);

  const zone = getZoneBySlug(slug);

  const relatedProperties = useMemo(() => {
    if (!zone) return [];
    return properties.filter(
      (p) => p.location.toLowerCase().includes(zone.name.toLowerCase()) && p.businessType === 'Comprar'
    );
  }, [zone]);

  const neighborhoods = useMemo(() => (zone ? getNeighborhoodsForZone(zone.slug) : []), [zone]);

  useEffect(() => {
    if (heroRef.current) {
      gsap.from(heroRef.current, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' });
    }
  }, []);

  const handleNavigate = (page: PageType, filter?: string) => {
    navigate(page, filter);
  };

  if (!zone) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header currentPage={currentPage} onNavigate={handleNavigate} isHeroPage={false} darkHeader />
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
      <Header currentPage={currentPage} onNavigate={handleNavigate} isHeroPage={false} darkHeader />

      <main className="flex-1 relative">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-dark to-gray-900 pt-[120px] pb-12 md:pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div ref={heroRef}>
              <Link
                href="/inversionistas"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a zonas de inversión
              </Link>

              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{zone.h1Title}</h1>
              <p className="text-lg text-gray-300 max-w-3xl">{zone.description}</p>
            </div>
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
                <ScrollReveal key={stat.label} delay={i * 0.1} y={20}>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-brand-red/10 rounded-lg flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-brand-red" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Advantages */}
            <ScrollReveal y={20}>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Ventajas de invertir en {zone.name}</h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {zone.advantages.map((advantage, i) => (
                <ScrollReveal key={i} delay={i * 0.1} y={20}>
                  <div className="bg-white rounded-xl p-6 border-l-4 border-brand-red">
                    <p className="text-gray-700 leading-relaxed">{advantage}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Neighborhoods */}
        {neighborhoods.length > 0 && (
          <section className="py-12 md:py-16 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <ScrollReveal y={20}>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Sectores y barrios de {zone.name}
                </h2>
                <p className="text-gray-500 mb-8">
                  Zonas geográficas incluidas en este sector de inversión
                </p>
              </ScrollReveal>

              <div className="flex flex-wrap gap-2">
                {neighborhoods.map((name, i) => (
                  <ScrollReveal key={name} delay={i * 0.02} y={10}>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      {name}
                    </span>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <section className="py-12 md:py-16 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <ScrollReveal y={20}>
                <h2 className="text-3xl font-bold text-gray-900 mb-12">
                  Propiedades disponibles para inversión en {zone.name}
                </h2>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProperties.map((property, i) => (
                  <ScrollReveal key={property.id} delay={i * 0.1} y={20}>
                    <PropertyCard property={property} />
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal y={20} className="text-center mt-12">
                <Link
                  href={`/propiedades?location=${zone.name}&businessType=Comprar`}
                  className="inline-flex items-center gap-2 h-12 px-8 bg-brand-red hover:bg-brand-red-hover text-white font-semibold rounded-full transition-all duration-300"
                >
                  Ver todas las propiedades en {zone.name}
                </Link>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* Other Zones */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal y={20} className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Explorar otras zonas de inversión
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {investmentZones
                .filter((z) => z.id !== zone.id)
                .map((otherZone, i) => (
                  <ScrollReveal key={otherZone.id} delay={i * 0.1} y={20}>
                    <Link
                      href={`/inversionistas/${otherZone.slug}`}
                      className="block bg-white rounded-xl p-6 hover:shadow-lg transition-all group cursor-pointer"
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
                    </Link>
                  </ScrollReveal>
                ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-brand-red">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal y={20}>
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
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}