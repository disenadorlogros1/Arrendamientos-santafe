'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, X, Navigation } from 'lucide-react';

interface MapComponentProps {
  latitude: number;
  longitude: number;
  title: string;
  businessType: 'Arrendar' | 'Comprar';
}

interface LeafletType {
  map: (el: HTMLElement, options?: any) => any;
  tileLayer: (url: string, options?: any) => any;
  marker: (latlng: [number, number], options?: any) => any;
  icon: (options?: any) => any;
  circle: (latlng: [number, number], options?: any) => any;
}

export default function MapComponent({
  latitude,
  longitude,
  title,
  businessType,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [isDirectionsModalOpen, setIsDirectionsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapContainerRef.current || !latitude || !longitude) return;

    const loadMap = async () => {
      try {
        // Cargar Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        document.head.appendChild(link);

        // Cargar Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
        script.async = true;
        script.onload = () => {
          if (typeof window !== 'undefined' && (window as any).L && mapContainerRef.current) {
            const L = (window as any).L as LeafletType;

            if (!mapRef.current) {
              const zoomLevel = businessType === 'Arrendar' ? 16 : 14;

              mapRef.current = L.map(mapContainerRef.current).setView(
                [latitude, longitude],
                zoomLevel
              );

              // Agregar tiles de Carto Light
              L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                {
                  attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                  maxZoom: 19,
                  minZoom: 1,
                }
              ).addTo(mapRef.current);

              // Crear marcador SVG personalizado
              const markerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40"><circle cx="20" cy="20" r="18" fill="#f32735" stroke="white" stroke-width="2"/><path d="M20 8 C 16 8, 13 11, 13 15 C 13 19, 20 28, 20 28 C 20 28, 27 19, 27 15 C 27 11, 24 8, 20 8 Z" fill="white"/><circle cx="20" cy="14" r="3" fill="#f32735"/></svg>`;

              const markerIcon = L.icon({
                iconUrl: `data:image/svg+xml;base64,${btoa(markerSvg)}`,
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40],
              });

              const marker = L.marker([latitude, longitude], { icon: markerIcon }).addTo(
                mapRef.current
              );

              marker.bindPopup(`<strong>${title}</strong>`, { closeButton: true });
              marker.openPopup();

              // Agregar círculo de 250m solo para ARRENDAR
              if (businessType === 'Arrendar') {
                L.circle([latitude, longitude], {
                  color: '#f32735',
                  fillColor: '#f32735',
                  fillOpacity: 0.1,
                  radius: 250,
                  weight: 2,
                }).addTo(mapRef.current);
              }

              setIsLoading(false);
            }
          }
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Error cargando mapa:', error);
        setIsLoading(false);
      }
    };

    loadMap();

    return () => {
      // Limpiar mapa al desmontar
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, title, businessType]);

  return (
    <div className="w-full">
      {/* Mapa */}
      <div className="relative w-full h-[300px] sm:h-[400px] rounded-xl overflow-hidden border border-gray-200">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-gray-600">Cargando mapa...</div>
          </div>
        )}
        <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
      </div>

      {/* Botón "Cómo llegar" */}
      <button
        onClick={() => setIsDirectionsModalOpen(true)}
        className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 bg-brand-red hover:bg-brand-red-hover text-white text-sm font-semibold rounded-lg transition-colors"
      >
        <Navigation className="w-4 h-4" />
        Cómo llegar
      </button>

      {/* Modal de direcciones */}
      {isDirectionsModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            {/* Botón cerrar */}
            <button
              onClick={() => setIsDirectionsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold text-brand-dark mb-2">Cómo llegar</h3>
            <p className="text-sm text-gray-600 mb-6">{title}</p>

            {/* Botones de dirección */}
            <div className="space-y-3">
              {/* Google Maps */}
              <a
                href={`https://maps.google.com/?q=${latitude},${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full h-14 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="font-medium text-gray-900">Google Maps</span>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>

              {/* Waze */}
              <a
                href={`https://waze.com/ul?ll=${latitude},${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full h-14 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Navigation className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">Waze</span>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>

            <button
              onClick={() => setIsDirectionsModalOpen(false)}
              className="mt-6 w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
