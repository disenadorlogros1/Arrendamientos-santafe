'use client';

import { MapPin, Building2 } from 'lucide-react';

const ZONAS = {
  'Valle de Aburrá': [
    'Medellín', 'Envigado', 'Itagüí', 'Sabaneta', 'Bello',
    'Copacabana', 'La Estrella', 'Caldas', 'Girardota', 'Barbosa',
  ],
  'Oriente Antioqueño': [
    'Rionegro', 'La Ceja', 'El Carmen de Viboral', 'Marinilla',
    'Guarne', 'El Retiro', 'San Vicente', 'El Santuario',
  ],
  'Municipios aledaños': [
    'San Jerónimo', 'Sopetrán', 'San Antonio de Prado',
  ],
};

const SEDES = [
  {
    nombre: 'Sede Medellín',
    direccion: 'Calle 44 San Juan #71-34',
  },
  {
    nombre: 'Sede Envigado',
    direccion: 'Centro Comercial Metrosur',
  },
  {
    nombre: 'Sede Rionegro',
    direccion: 'Parque Comercial Río del Este',
  },
];

export default function ZonasCoberturaMap() {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-block text-xs sm:text-sm font-semibold tracking-widest text-brand-red uppercase mb-3">
            Cobertura
          </span>
          <h2
            className="text-3xl sm:text-4xl text-brand-dark"
            style={{
              fontFamily:
                "'Avenir LT Std', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
            }}
          >
            Zonas donde te acompañamos
          </h2>
          <p
            className="mt-3 text-base text-gray-500 max-w-2xl mx-auto"
            style={{
              fontFamily:
                "'Avenir LT Std', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
            }}
          >
            Operamos en el Valle de Aburrá, el Oriente Antioqueño y municipios
            aledaños del departamento de Antioquia.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-stretch">
          {/* Mapa Google */}
          <div className="lg:col-span-3 rounded-lg overflow-hidden border border-gray-200 shadow-sm min-h-[420px]">
            <iframe
              title="Mapa de cobertura Arrendamientos Santa Fe — Antioquia"
              src="https://www.google.com/maps?q=Antioquia,+Colombia&z=8&output=embed"
              className="w-full h-full min-h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          {/* Listado de zonas */}
          <div className="lg:col-span-2 space-y-5">
            {Object.entries(ZONAS).map(([titulo, lugares]) => (
              <div
                key={titulo}
                className="bg-gray-50 border border-gray-200 rounded-lg p-5"
              >
                <h3 className="flex items-center gap-2 text-base font-semibold text-brand-dark">
                  <MapPin className="w-4 h-4 text-brand-red" />
                  {titulo}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {lugares.map((l) => (
                    <span
                      key={l}
                      className="inline-block px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-700"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sedes físicas */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SEDES.map((s) => (
            <div
              key={s.nombre}
              className="bg-white border border-gray-200 hover:border-brand-red rounded-lg p-5 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 shrink-0 rounded-md bg-brand-red/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-brand-red" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-dark">
                    {s.nombre}
                  </h4>
                  <p className="mt-0.5 text-xs text-gray-600">{s.direccion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
