'use client';

import { useEffect, useRef, useState } from 'react';

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

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';

const BTN: React.CSSProperties = {
  width: 38, height: 38, borderRadius: '50%',
  background: 'rgba(255,255,255,0.97)',
  border: '1px solid rgba(0,0,0,0.13)',
  boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#1a1a1a', fontFamily: 'system-ui', padding: 0,
};

export default function MapComponent({
  latitude,
  longitude,
  title,
  businessType,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef          = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile,  setIsMobile]  = useState(false);
  const [mapActive, setMapActive] = useState(false);

  const defaultZoom = businessType === 'Arrendar' ? 16 : 14;

  /* ── Detectar mobile ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Cargar mapa ── */
  useEffect(() => {
    if (!mapContainerRef.current || !latitude || !longitude) return;

    const loadMap = async () => {
      try {
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement('link');
          link.rel  = 'stylesheet';
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
          document.head.appendChild(link);
        }

        const existing = document.querySelector('script[src*="leaflet.min.js"]');
        const script   = existing ?? document.createElement('script');

        const init = () => {
          if (typeof window === 'undefined' || !(window as any).L || !mapContainerRef.current) return;
          if (mapRef.current) return;
          const L       = (window as any).L as LeafletType;
          const mobile  = window.innerWidth < 1024;

          mapRef.current = L.map(mapContainerRef.current, {
            attributionControl: false,
            dragging:         !mobile,
            touchZoom:        !mobile,
            scrollWheelZoom:  false,
          }).setView([latitude, longitude], defaultZoom);

          L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            { maxZoom: 19, minZoom: 1 }
          ).addTo(mapRef.current);

          const markerHtml = `
            <div style="position:relative;width:40px;height:50px;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.35))">
              <svg viewBox="0 0 40 50" width="40" height="50" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2 C10.6 2 3 9.6 3 19 C3 29.8 20 48 20 48 C20 48 37 29.8 37 19 C37 9.6 29.4 2 20 2Z"
                      fill="#f32735"/>
              </svg>
              <img src="/icons/icon-favicon-white.svg"
                style="position:absolute;top:50%;left:50%;transform:translate(-50%,-62%);width:14px;height:14px;object-fit:contain;pointer-events:none"/>
            </div>`;

          const markerIcon = L.divIcon({
            className: '', html: markerHtml,
            iconSize: [40, 50], iconAnchor: [20, 50], popupAnchor: [0, -52],
          });

          const marker = L.marker([latitude, longitude], { icon: markerIcon }).addTo(mapRef.current);
          marker.bindPopup(`<strong>${title}</strong>`, { closeButton: true });
          marker.openPopup();

          if (businessType === 'Arrendar') {
            L.circle([latitude, longitude], {
              color: '#f32735', fillColor: '#f32735',
              fillOpacity: 0.1, radius: 250, weight: 2,
            }).addTo(mapRef.current);
          }

          setIsLoading(false);
        };

        if ((window as any).L) {
          init();
        } else if (existing) {
          existing.addEventListener('load', init);
        } else {
          (script as HTMLScriptElement).src   = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
          (script as HTMLScriptElement).async = true;
          (script as HTMLScriptElement).onload = init;
          document.head.appendChild(script);
        }
      } catch (error) {
        console.error('Error cargando mapa:', error);
        setIsLoading(false);
      }
    };

    loadMap();

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [latitude, longitude, title, businessType, defaultZoom]);

  /* ── Habilitar/deshabilitar interacción según mapActive ── */
  useEffect(() => {
    if (!mapRef.current || !isMobile) return;
    if (mapActive) {
      mapRef.current.dragging.enable();
      mapRef.current.touchZoom.enable();
    } else {
      mapRef.current.dragging.disable();
      mapRef.current.touchZoom.disable();
    }
  }, [mapActive, isMobile]);

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden border border-gray-200" style={{ height: 300 }}>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-gray-600">Cargando mapa...</div>
          </div>
        )}

        <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />

        {/* ── Overlay mobile: bloquea scroll accidental ── */}
        {isMobile && !mapActive && !isLoading && (
          <div
            onClick={() => setMapActive(true)}
            style={{
              position: 'absolute', inset: 0, zIndex: 900,
              background: 'rgba(0,0,0,0.16)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', userSelect: 'none',
            }}
          >
            <div style={{
              background: 'rgba(255,255,255,0.97)', borderRadius: 99,
              padding: '10px 20px', fontFamily: FONT,
              fontSize: 13, fontWeight: 600, color: '#1a1a1a',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 2px 16px rgba(0,0,0,0.14)',
            }}>
              {/* Ícono dedo táctil */}
              <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 0C6.17 0 5.5 0.67 5.5 1.5V8.26C5.04 7.96 4.52 7.75 4 7.75C2.62 7.75 1.5 8.87 1.5 10.25C1.5 11.28 1.82 12.01 2.24 12.7L4.5 16.5C5.12 17.43 6.19 18 7.33 18H10C12.21 18 14 16.21 14 14V7.5C14 6.67 13.33 6 12.5 6C12.16 6 11.86 6.12 11.62 6.31C11.38 5.55 10.67 5 9.83 5C9.43 5 9.06 5.14 8.76 5.38C8.48 4.57 7.79 4 7 4V1.5C7 0.67 6.33 0 5.5 0" fill="#1a1a1a" fillOpacity="0.75"/>
                <path d="M7 0C7.83 0 8.5 0.67 8.5 1.5V6C8.86 5.74 9.31 5.58 9.83 5.58C10.67 5.58 11.38 6.13 11.62 6.89C11.86 6.7 12.16 6.58 12.5 6.58C13.33 6.58 14 7.25 14 8.08V14C14 16.21 12.21 18 10 18H7.33C6.19 18 5.12 17.43 4.5 16.5L2.24 12.7C1.82 12.01 1.5 11.28 1.5 10.25C1.5 8.87 2.62 7.75 4 7.75C4.52 7.75 5.04 7.96 5.5 8.26V1.5C5.5 0.67 6.17 0 7 0Z" stroke="#1a1a1a" strokeWidth="0.5" fill="none"/>
              </svg>
              Toca para explorar el mapa
            </div>
          </div>
        )}

        {/* ── Controles móviles: zoom + centrar ── */}
        {isMobile && !isLoading && (
          <div style={{
            position: 'absolute', right: 10, bottom: 24, zIndex: 910,
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            <button
              style={BTN}
              onClick={() => { mapRef.current?.zoomIn(); setMapActive(true); }}
              title="Acercar"
              aria-label="Acercar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <button
              style={BTN}
              onClick={() => { mapRef.current?.zoomOut(); setMapActive(true); }}
              title="Alejar"
              aria-label="Alejar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <button
              style={{ ...BTN, background: RED, border: 'none', color: '#fff' }}
              onClick={() => {
                mapRef.current?.setView([latitude, longitude], defaultZoom);
                setMapActive(false);
              }}
              title="Centrar en el inmueble"
              aria-label="Centrar en el inmueble"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
              </svg>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
