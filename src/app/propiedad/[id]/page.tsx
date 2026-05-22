'use client';

import { properties } from '@/data/properties';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
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
            <button
              onClick={() => router.back()}
              className="text-brand-red hover:underline font-semibold"
              title="Volver"
            >
              ← Atrás
            </button>
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
                <span className="text-red-600 text-sm font-bold">{property.businessType === 'Comprar' ? 'VENTA' : 'ARRIENDO'}</span>
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
                    <img src="/icons/icon-home-red.gif" alt="Tipo" width="24" height="24" />
                    <div>
                      <div className="text-xs text-gray-600">Tipo de inmueble</div>
                      <div className="font-semibold text-gray-900">{property.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <img src="/icons/icon-area-gray.gif" alt="Área" width="24" height="24" />
                    <div>
                      <div className="text-xs text-gray-600">Área construida</div>
                      <div className="font-semibold text-gray-900">{property.size}</div>
                    </div>
                  </div>
                  {property.stratum && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      <img src="/icons/icon-home-red.gif" alt="Estrato" width="24" height="24" />
                      <div>
                        <div className="text-xs text-gray-600">Estrato</div>
                        <div className="font-semibold text-gray-900">Est. {property.stratum}</div>
                      </div>
                    </div>
                  )}
                  {property.bedrooms > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      <img src="/icons/icon-bed-gray.gif" alt="Habitaciones" width="24" height="24" />
                      <div>
                        <div className="text-xs text-gray-600">Habitaciones</div>
                        <div className="font-semibold text-gray-900">{property.bedrooms}</div>
                      </div>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      <img src="/icons/icon-bathroom-gray.gif" alt="Baños" width="24" height="24" />
                      <div>
                        <div className="text-xs text-gray-600">Baños</div>
                        <div className="font-semibold text-gray-900">{property.bathrooms}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mapa de OpenStreetMap - Solo para propiedades de arrendar */}
              {property.businessType === 'Arrendar' && (
                <div className="mt-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Ubicación</h2>
                  <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=-75.6,6.1,-75.5,6.3&layer=mapnik&marker=${property.location}`}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">© OpenStreetMap contributors</p>
                </div>
              )}

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
                <img src="/icons/icon-location-red.gif" alt="Ubicación" width="20" height="20" />
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
                <img src="/icons/icon-consult-white.gif" alt="WhatsApp" width="20" height="20" />
                Escribir por WhatsApp
              </a>

              <p className="text-center text-gray-600 text-xs mb-4">o envía un mensaje</p>

              {/* Formulario */}
              <form className="space-y-3">
                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2 flex items-center gap-2">
                    <img src="/icons/icon-location-red.gif" alt="Nombre" width="16" height="16" />
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2 flex items-center gap-2">
                    <img src="/icons/icon-location-red.gif" alt="Teléfono" width="16" height="16" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    placeholder="300 000 0000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2 flex items-center gap-2">
                    <img src="/icons/icon-consult-white.gif" alt="Mensaje" width="16" height="16" />
                    Mensaje (opcional)
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
                  Enviar consulta
                </button>
              </form>

              {/* Compartir */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-3">COMPARTIR PROPIEDAD</h4>
                <div className="flex gap-3">
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg transition text-sm flex items-center justify-center gap-2">
                    <img src="/icons/icon-consult-white.gif" alt="Compartir" width="16" height="16" />
                    WhatsApp
                  </button>
                  <button className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-3 rounded-lg transition text-sm flex items-center justify-center gap-2">
                    <img src="/icons/icon-location-red.gif" alt="Link" width="16" height="16" />
                    Copiar
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
