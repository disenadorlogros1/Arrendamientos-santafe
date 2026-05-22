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

              {/* Contenedor horizontal de la línea de tiempo */}
              <div className="relative overflow-x-auto">
                {/* Línea roja horizontal central */}
                <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-16 bg-brand-red/10 pointer-events-none" />

                {/* Hitos */}
                <div className="flex gap-4 md:gap-6 pb-4 min-w-max md:min-w-full">
                  {HITOS.map((hito, index) => (
                    <div key={hito.year} className="flex flex-col items-center gap-3 flex-1 min-w-[180px]">
                      {/* Contenido arriba */}
                      <div className="h-20 flex items-end">
                        <p className="text-xs md:text-sm text-gray-600 leading-tight text-center">
                          {hito.label}
                        </p>
                      </div>

                      {/* Franja roja con el año */}
                      <div className="relative z-10 bg-brand-red px-4 py-3 rounded-sm flex items-center justify-center min-w-[140px]">
                        <p className="text-2xl md:text-3xl font-black text-white leading-none">
                          {hito.year}
                        </p>
                      </div>

                      {/* Contenido abajo (vacío, podría agregarse si es necesario) */}
                      <div className="h-20" />
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
