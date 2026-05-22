'use client';

import { properties } from '@/data/properties';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = parseInt(params.id as string);
  const property = properties.find((p) => p.id === propertyId);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Propiedad no encontrada</h1>
          <Link href="/" className="text-brand-red hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="text-brand-red hover:underline">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/" className="text-brand-red hover:underline">
              Propiedades
            </Link>
            <span>/</span>
            <span className="text-gray-900">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Imágenes */}
          <div className="lg:col-span-2">
            {/* Imagen principal */}
            <div className="mb-6 rounded-lg overflow-hidden bg-white border border-gray-200">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Tipo, Referencia, Título */}
            <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-red-600 text-sm font-bold">ARRIENDO</span>
                <span className="text-gray-600 text-sm font-bold">{property.type.toUpperCase()}</span>
                <span className="text-gray-600 text-sm font-bold">Ref. {property.reference.replace('Ref. ', '')}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <p className="text-gray-600 text-sm flex items-center gap-1 mb-4">
                <span>📍</span>
                {property.address || property.location}
              </p>

              {/* Precio */}
              <p className="text-4xl font-bold text-red-600 mb-6">{property.price}</p>

              {/* Características principales */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
                {property.bedrooms > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                    <div className="text-gray-600 text-sm uppercase">
                      Habitación{property.bedrooms > 1 ? 'es' : ''}
                    </div>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                    <div className="text-gray-600 text-sm uppercase">Baños</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{property.size}</div>
                  <div className="text-gray-600 text-sm uppercase">Área</div>
                </div>
                {property.stratum && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">Est. {property.stratum}</div>
                    <div className="text-gray-600 text-sm uppercase">Estrato</div>
                  </div>
                )}
                {property.parking && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{property.parking}</div>
                    <div className="text-gray-600 text-sm uppercase">Parqueaderos</div>
                  </div>
                )}
                {property.garage && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{property.garage}</div>
                    <div className="text-gray-600 text-sm uppercase">Garajes</div>
                  </div>
                )}
              </div>

              {/* Descripción */}
              {property.description && (
                <div className="mt-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Descripción</h2>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>
              )}

              {/* Detalles del inmueble */}
              <div className="mt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Detalles del inmueble</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <span className="text-red-600 text-xl">🏠</span>
                    <div>
                      <div className="text-xs text-gray-600">Tipo de inmueble</div>
                      <div className="font-semibold text-gray-900">{property.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <span className="text-red-600 text-xl">📐</span>
                    <div>
                      <div className="text-xs text-gray-600">Área construida</div>
                      <div className="font-semibold text-gray-900">{property.size}</div>
                    </div>
                  </div>
                  {property.stratum && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      <span className="text-red-600 text-xl">📊</span>
                      <div>
                        <div className="text-xs text-gray-600">Estrato</div>
                        <div className="font-semibold text-gray-900">{property.stratum}</div>
                      </div>
                    </div>
                  )}
                  {property.bedrooms > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      <span className="text-red-600 text-xl">🛏️</span>
                      <div>
                        <div className="text-xs text-gray-600">Habitaciones</div>
                        <div className="font-semibold text-gray-900">{property.bedrooms}</div>
                      </div>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      <span className="text-red-600 text-xl">🚿</span>
                      <div>
                        <div className="text-xs text-gray-600">Baños</div>
                        <div className="font-semibold text-gray-900">{property.bathrooms}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Características */}
              {property.characteristics && property.characteristics.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Características incluidas</h2>
                  <div className="flex flex-wrap gap-3">
                    {property.characteristics.map((char, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-full border border-red-200">
                        <span className="text-red-600">✓</span>
                        <span className="text-red-600 font-medium text-sm">{char}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha - Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📍</span>
                ¿Te interesa esta propiedad?
              </h3>
              <p className="text-gray-600 text-sm mb-6">Te responderemos de inmediato.</p>

              {/* Botón WhatsApp */}
              <a
                href={`https://wa.me/573006557529?text=${encodeURIComponent(
                  `Hola, quisiera consultar disponibilidad del inmueble ${property.reference} (${property.title}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 mb-4 transition"
              >
                <span>💬</span>
                Escribir por WhatsApp
              </a>

              <p className="text-center text-gray-600 text-xs mb-4">o envía un mensaje</p>

              {/* Formulario */}
              <form className="space-y-3">
                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2">
                    👤 Tu nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2">
                    📱 Teléfono
                  </label>
                  <input
                    type="tel"
                    placeholder="300 000 0000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2">
                    💬 Mensaje (opcional)
                  </label>
                  <textarea
                    placeholder="¿Está disponible para visitar esta semana?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 h-24 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition"
                >
                  ➤ Enviar consulta
                </button>
              </form>

              {/* Compartir */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-3">COMPARTIR PROPIEDAD</h4>
                <div className="flex gap-3">
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg transition text-sm">
                    💬
                  </button>
                  <button className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-3 rounded-lg transition text-sm">
                    🔗
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
