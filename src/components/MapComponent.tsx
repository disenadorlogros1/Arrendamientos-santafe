'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

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
  divIcon: (options?: any) => any;
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

              // Marcador: pin rojo con favicon blanco centrado
              const markerHtml = `
                <div style="position:relative;width:40px;height:50px;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.35))">
                  <svg viewBox="0 0 40 50" width="40" height="50" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2 C10.6 2 3 9.6 3 19 C3 29.8 20 48 20 48 C20 48 37 29.8 37 19 C37 9.6 29.4 2 20 2Z"
                          fill="#f32735" stroke="white" stroke-width="2.2"/>
                  </svg>
                  <img src="/icons/icon-favicon-white.gif"
                    style="position:absolute;top:50%;left:50%;transform:translate(-50%,-62%);width:20px;height:20px;object-fit:contain;pointer-events:none"/>
                </div>`;

              const markerIcon = L.divIcon({
                className: '',
                html: markerHtml,
                iconSize: [40, 50],
                iconAnchor: [20, 50],
                popupAnchor: [0, -52],
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
      <div className="relative w-full h-[300px] sm:h-[400px] overflow-hidden border border-gray-200">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-gray-600">Cargando mapa...</div>
          </div>
        )}
        <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
      </div>

    </div>
  );
}
