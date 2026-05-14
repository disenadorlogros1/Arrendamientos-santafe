'use client';

import { MessageCircle, ArrowRight, Info } from 'lucide-react';
import type { PageType } from '@/components/Header';

interface PropietariosBlockProps {
  onNavigate: (page: PageType) => void;
}

const WHATSAPP_URL =
  'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consignar%20una%20propiedad%20con%20Arrendamientos%20Santa%20Fe.';

export default function PropietariosBlock({ onNavigate }: PropietariosBlockProps) {
  return (
    <section className="relative py-16 sm:py-20 bg-brand-dark text-white overflow-hidden">
      {/* Acento visual sutil */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 20%, #f32735 0%, transparent 50%), radial-gradient(circle at 20% 80%, #f32735 0%, transparent 40%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            <span
              className="inline-block text-xs sm:text-sm font-semibold tracking-widest text-brand-red uppercase mb-3"
              style={{
                fontFamily:
                  "'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif",
              }}
            >
              Propietarios
            </span>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl leading-tight"
              style={{
                fontFamily:
                  "'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif",
                fontWeight: 300,
              }}
            >
              ¿Tienes un inmueble para{' '}
              <span className="text-brand-red font-medium">arrendar o vender</span>?
            </h2>
            <p className="mt-5 text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed">
              Consígnalo con una empresa que cuenta con experiencia, procesos
              claros y conocimiento del mercado inmobiliario en Antioquia.
            </p>

            {/* CTAs jerárquicos */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/* CTA Principal */}
              <button
                type="button"
                onClick={() => onNavigate('consignacion')}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-brand-red hover:bg-brand-red-hover text-white text-sm sm:text-base font-semibold rounded-md shadow-lg transition-colors"
              >
                Consignar mi propiedad
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* CTA Secundario */}
              <button
                type="button"
                onClick={() => onNavigate('consignacion')}
                className="inline-flex items-center gap-2 h-12 px-6 bg-transparent hover:bg-white/10 text-white text-sm sm:text-base font-semibold border-2 border-white/70 rounded-md transition-colors"
              >
                <Info className="w-4 h-4" />
                Conocer cómo funciona
              </button>

              {/* CTA Operativo */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-10 px-4 bg-white/10 hover:bg-white/20 text-white text-sm rounded-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Hablar con un asesor
              </a>
            </div>
          </div>

          {/* Bloque visual / valores clave */}
          <div className="md:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-5 backdrop-blur-sm">
                <p className="text-3xl font-bold text-brand-red">60</p>
                <p className="text-sm text-white/70 mt-1">años de experiencia</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-5 backdrop-blur-sm">
                <p className="text-3xl font-bold text-brand-red">3</p>
                <p className="text-sm text-white/70 mt-1">sedes en Antioquia</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-5 backdrop-blur-sm col-span-2">
                <p className="text-sm text-white/80 leading-relaxed">
                  Procesos claros, acompañamiento oportuno y asesoría en cada
                  etapa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
