'use client';

import { ArrowRight, Award, Users, Building2 } from 'lucide-react';
import type { PageType } from '@/components/Header';

interface TrayectoriaBlockProps {
  onNavigate: (page: PageType) => void;
}

const HITOS = [
  { year: '1966', label: 'Nacemos en Medellín con una promesa: acompañar cada decisión con confianza y cercanía.' },
  { year: '1974', label: 'Consolidamos nuestra operación y ganamos la confianza de propietarios y clientes en Antioquia.' },
  { year: '2006', label: 'Cuatro décadas de trayectoria avalan nuestro respaldo y seriedad en el sector inmobiliario.' },
  { year: '2017', label: 'Abrimos sede en Envigado y ampliamos nuestra presencia en el sur del Valle de Aburrá.' },
  { year: '2018', label: 'Renovamos nuestra imagen para proyectar lo que siempre hemos sido: cercanos, serios y vigentes.' },
  { year: '2026', label: '60 años creciendo con Antioquia. Celebramos con la apertura de nuestra sede en Rionegro.' },
];

export default function TrayectoriaBlock({ onNavigate }: TrayectoriaBlockProps) {
  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Acento decorativo */}
      <div
        aria-hidden="true"
        className="absolute -top-20 -right-20 w-72 h-72 bg-brand-red/5 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 -left-20 w-72 h-72 bg-brand-red/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Texto */}
          <div className="lg:col-span-6">
            <span className="inline-block text-xs sm:text-sm font-semibold tracking-widest text-brand-red uppercase mb-3">
              Nuestra trayectoria
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl text-brand-dark leading-tight"
              style={{
                fontFamily:
                  "'Avenir Next Ultra Light', 'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif",
                fontWeight: 300,
              }}
            >
              <span className="text-brand-red font-medium">60 años</span> de
              experiencia inmobiliaria en Antioquia
            </h2>
            <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
              Desde 1966 acompañamos a personas, familias y propietarios en
              decisiones de arrendamiento, venta, administración e inversión
              inmobiliaria.
            </p>

            {/* Cifras clave */}
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <Award className="w-5 h-5 text-brand-red mx-auto mb-1" />
                <p className="text-2xl font-bold text-brand-dark">60+</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  años de experiencia
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <Building2 className="w-5 h-5 text-brand-red mx-auto mb-1" />
                <p className="text-2xl font-bold text-brand-dark">3</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  sedes en Antioquia
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <Users className="w-5 h-5 text-brand-red mx-auto mb-1" />
                <p className="text-2xl font-bold text-brand-dark">+1K</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  inmuebles en gestión activa
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => {
                  onNavigate('nosotros');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 h-12 px-6 bg-brand-red hover:bg-brand-red-hover text-white text-sm sm:text-base font-semibold rounded-md shadow-sm transition-colors"
              >
                Conocer nuestra historia
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Línea de tiempo */}
          <div className="lg:col-span-6">
            <div className="relative">
              <h3 className="text-sm font-semibold tracking-widest text-gray-500 uppercase mb-8">
                Línea de tiempo
              </h3>

              {/* Contenedor de la línea de tiempo */}
              <div className="relative">
                {/* Línea roja central */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-brand-red h-full top-0" />

                {/* Hitos */}
                <div className="space-y-8 md:space-y-12">
                  {HITOS.map((hito, index) => (
                    <div key={hito.year} className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-6 md:gap-8 items-start`}>
                      {/* Contenido */}
                      <div className={`w-1/2 ${index % 2 === 0 ? 'text-right pr-4' : 'text-left pl-4'}`}>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {hito.label}
                        </p>
                      </div>

                      {/* Año */}
                      <div className="flex items-center justify-center">
                        <p className="text-4xl md:text-5xl font-black text-brand-red leading-none">
                          {hito.year}
                        </p>
                      </div>

                      {/* Espacio derecho */}
                      <div className="w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
