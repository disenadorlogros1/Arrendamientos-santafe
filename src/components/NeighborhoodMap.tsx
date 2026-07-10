'use client';

import { useEffect, useRef, useState } from 'react';
import type { InvestmentZone } from '@/data/investment-zones';
import { NEIGHBORHOOD_DATA, BARRIO_IMAGES } from '@/data/neighborhood-data';

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';

const NAME_TO_SLUG: Record<string, string> = {
  'Bello': 'bello', 'Copacabana': 'copacabana', 'Aranjuez': 'aranjuez',
  'Castilla': 'castilla', 'Manrique': 'manrique', 'Popular': 'popular',
  'Santa Cruz': 'santa-cruz', 'Tricentenario': 'tricentenario',
  'Campo Valdés': 'campo-valdes', 'Doce de Octubre': 'doce-de-octubre',
  'Caribe': 'caribe', 'Prado': 'prado', 'Boyacá': 'boyaca',
  'Envigado': 'envigado', 'Sabaneta': 'sabaneta', 'Itagüí': 'itagui',
  'La Estrella': 'la-estrella', 'Caldas': 'caldas', 'Guayabal': 'guayabal',
  'San Antonio de Prado': 'san-antonio-de-prado', 'Belencito': 'belencito',
  'El Poblado': 'el-poblado', 'Castropol': 'el-poblado', 'Rosales': 'el-poblado',
  'San Diego': 'san-diego', 'Rionegro': 'rionegro', 'Llanogrande': 'llanogrande',
  'Guarne': 'guarne', 'La Ceja': 'la-ceja', 'Retiro': 'retiro',
  'Marinilla': 'marinilla', 'Santa Elena': 'santa-elena',
  'Laureles': 'laureles', 'Estadio': 'estadio', 'Florida Nueva': 'florida-nueva',
  'La América': 'la-america', 'Los Colores': 'los-colores',
  'Castellana': 'laureles', 'Conquistadores': 'laureles',
  'Belén': 'belen', 'Campo Amor': 'campo-amor', 'Robledo': 'robledo',
  'San Cristóbal': 'san-cristobal', 'Calasanz': 'calasanz',
  'San Javier': 'san-javier', 'Naranjal': 'naranjal',
};

interface Props {
  zone: InvestmentZone;
}

interface HoveredNeighborhood {
  name: string;
  rentBlurb: string;
  buyBlurb: string;
  rentability: string;
  avgPrice: string;
  imageIdx: number;
}

const ZONE_CENTER: Record<string, { lat: number; lng: number; zoom: number }> = {
  norte:     { lat: 6.310, lng: -75.565, zoom: 12 },
  sur:       { lat: 6.160, lng: -75.600, zoom: 12 },
  oriente:   { lat: 6.175, lng: -75.480, zoom: 11 },
  occidente: { lat: 6.245, lng: -75.595, zoom: 13 },
};

export default function NeighborhoodMap({ zone }: Props) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const mapRef        = useRef<any>(null);
  const markersRef    = useRef<Record<string, any>>({});
  const [hovered, setHovered] = useState<HoveredNeighborhood | null>(null);

  useEffect(() => {
    const subzones  = zone.subzones;
    const viewConf  = ZONE_CENTER[zone.slug] ?? { lat: 6.25, lng: -75.58, zoom: 12 };

    const pinHtml = (active: boolean) => {
      const fill = active ? RED : '#222';
      const scale = active ? 1.35 : 1;
      return `<div style="transform:translate(-50%,-100%) scale(${scale});transform-origin:50% 100%;transition:transform 0.18s ease;pointer-events:none;">
        <svg width="22" height="30" viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 0C4.925 0 0 4.925 0 11C0 19.25 11 30 11 30C11 30 22 19.25 22 11C22 4.925 17.075 0 11 0Z" fill="${fill}"/>
          <circle cx="11" cy="11" r="4.5" fill="white"/>
        </svg>
      </div>`;
    };

    const labelHtml = (label: string, active: boolean) =>
      `<div style="
        padding:3px 8px;
        background:${active ? RED : 'rgba(255,255,255,0.92)'};
        border:1px solid ${active ? RED : 'rgba(0,0,0,0.12)'};
        font-family:'Avenir LT Std','Outfit',sans-serif;
        font-size:9px; font-weight:700; letter-spacing:0.04em;
        color:${active ? '#fff' : '#222'}; white-space:nowrap;
        transform:translate(-50%,6px);
        box-shadow:0 1px 6px rgba(0,0,0,0.12);
        pointer-events:none;
      ">${label}</div>`;

    const init = () => {
      if (!containerRef.current || mapRef.current) return;
      const L = (window as any).L;

      mapRef.current = L.map(containerRef.current, {
        zoomControl:        true,
        scrollWheelZoom:    false,
        attributionControl: false,
        dragging:           true,
        doubleClickZoom:    false,
        touchZoom:          true,
      }).setView([viewConf.lat, viewConf.lng], viewConf.zoom);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);

      for (const name of subzones) {
        const data = NEIGHBORHOOD_DATA[name];
        if (!data) continue;

        const pinIcon = L.divIcon({
          className: '',
          html: pinHtml(false),
          iconSize:   [0, 0],
          iconAnchor: [0, 0],
        });
        const pin = L.marker([data.lat, data.lng], { icon: pinIcon }).addTo(mapRef.current);

        const labelIcon = L.divIcon({
          className: '',
          html: labelHtml(name, false),
          iconSize:   [0, 0],
          iconAnchor: [0, 0],
        });
        const label = L.marker([data.lat, data.lng], { icon: labelIcon, interactive: false }).addTo(mapRef.current);

        const hitArea = L.circle([data.lat, data.lng], {
          radius: 500, color: 'transparent', weight: 0, fillOpacity: 0,
        }).addTo(mapRef.current);

        hitArea.on('mouseover', () => {
          pin.setIcon(L.divIcon({ className: '', html: pinHtml(true), iconSize: [0,0], iconAnchor: [0,0] }));
          label.setIcon(L.divIcon({ className: '', html: labelHtml(name, true), iconSize: [0,0], iconAnchor: [0,0] }));
          setHovered({
            name:        data.name,
            rentBlurb:   data.rentBlurb,
            buyBlurb:    data.buyBlurb,
            rentability: data.rentability,
            avgPrice:    data.avgPrice,
            imageIdx:    data.imageIdx,
          });
        });

        hitArea.on('mouseout', () => {
          pin.setIcon(L.divIcon({ className: '', html: pinHtml(false), iconSize: [0,0], iconAnchor: [0,0] }));
          label.setIcon(L.divIcon({ className: '', html: labelHtml(name, false), iconSize: [0,0], iconAnchor: [0,0] }));
          setHovered(null);
        });

        markersRef.current[name] = { pin, label, hitArea };
      }
    };

    if ((window as any).L) {
      init();
    } else {
      if (!document.querySelector('link[data-leaflet]')) {
        const link  = document.createElement('link');
        link.rel    = 'stylesheet';
        link.href   = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        link.setAttribute('data-leaflet', '1');
        document.head.appendChild(link);
      }
      const script  = document.createElement('script');
      script.src    = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.onload = init;
      document.head.appendChild(script);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = {};
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zone.slug]);

  const imgSrc = hovered
    ? `/images/barrios/${NAME_TO_SLUG[hovered.name] ?? 'el-poblado'}.jpg`
    : null;

  return (
    <div style={{ position: 'relative', width: '100%', height: 480, overflow: 'hidden' }}>
      {/* Mapa — ocupa todo el contenedor */}
      <div ref={containerRef} style={{ width: '100%', height: '100%', background: '#f5f5f5' }} />

      {/* Badge "X sectores" — top-right sobre el mapa, se oculta al hover */}
      <div style={{
        position: 'absolute', top: 16, right: 16, zIndex: 1000,
        padding: '6px 14px',
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(0,0,0,0.1)',
        fontFamily: FONT,
        fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#888',
        opacity: hovered ? 0 : 1,
        transition: 'opacity 0.2s ease',
        pointerEvents: 'none',
      }}>
        {zone.subzones.length} sectores · Pasa el cursor para explorar
      </div>

      {/* Panel desplegable — overlay 40% derecho */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: '40%', zIndex: 999,
        background: '#f7f6f4',
        borderLeft: '1px solid #ebebeb',
        display: 'flex', flexDirection: 'column',
        fontFamily: FONT,
        overflow: 'hidden',
        transform: hovered ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {hovered && (
          <>
            {/* Imagen */}
            <div style={{ height: 180, overflow: 'hidden', flexShrink: 0 }}>
              {imgSrc && (
                <img
                  src={imgSrc}
                  alt={hovered.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                />
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, padding: '20px 20px 16px', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto' }}>
              {/* Zona + nombre */}
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: RED, marginBottom: 5 }}>
                  {zone.name}
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
                  {hovered.name}
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#ccc', marginBottom: 3 }}>Rentabilidad</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: RED }}>{hovered.rentability}</div>
                </div>
                <div style={{ width: 1, background: '#e8e8e8', alignSelf: 'stretch' }} />
                <div>
                  <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#ccc', marginBottom: 3 }}>Precio m²</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#1a1a1a', lineHeight: 1.3 }}>{hovered.avgPrice}</div>
                </div>
              </div>

              {/* Blurbs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: RED, marginBottom: 4 }}>
                    Arrendar
                  </div>
                  <p style={{ fontSize: 11, color: '#555', lineHeight: 1.6, margin: 0 }}>{hovered.rentBlurb}</p>
                </div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#aaa', marginBottom: 4 }}>
                    Comprar
                  </div>
                  <p style={{ fontSize: 11, color: '#888', lineHeight: 1.6, margin: 0 }}>{hovered.buyBlurb}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
