'use client';

import { useEffect, useRef, useState } from 'react';
import type { InvestmentZone } from '@/data/investment-zones';
import { NEIGHBORHOOD_DATA, BARRIO_IMAGES } from '@/data/neighborhood-data';

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED  = '#f32735';

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

    const buildMarkerHtml = (label: string, active: boolean) => {
      const bg   = active ? RED : 'rgba(20,20,20,0.85)';
      const border = active ? RED : 'rgba(255,255,255,0.25)';
      return `<div style="
        display:flex; align-items:center; justify-content:center;
        padding:4px 10px;
        background:${bg};
        border:1px solid ${border};
        font-family:'Avenir LT Std','Outfit',sans-serif;
        font-size:10px; font-weight:700; letter-spacing:0.04em;
        color:#fff; white-space:nowrap;
        transform:translate(-50%,-50%);
        box-shadow:0 2px 10px rgba(0,0,0,0.4);
        transition:background 0.18s, border-color 0.18s;
        pointer-events:none;
      ">${label}</div>`;
    };

    const init = () => {
      if (!containerRef.current || mapRef.current) return;
      const L = (window as any).L;

      mapRef.current = L.map(containerRef.current, {
        zoomControl:        false,
        scrollWheelZoom:    true,
        attributionControl: false,
        dragging:           true,
        doubleClickZoom:    false,
        touchZoom:          true,
      }).setView([viewConf.lat, viewConf.lng], viewConf.zoom);

      // Mapa oscuro CartoDB Dark Matter
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);

      for (const name of subzones) {
        const data = NEIGHBORHOOD_DATA[name];
        if (!data) continue;

        const icon = L.divIcon({
          className: '',
          html: buildMarkerHtml(name, false),
          iconSize:   [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([data.lat, data.lng], { icon }).addTo(mapRef.current);

        // Área interactiva invisible sobre cada marcador
        const circle = L.circle([data.lat, data.lng], {
          radius:      800,
          color:       RED,
          weight:      1.5,
          fillColor:   RED,
          fillOpacity: 0.06,
          opacity:     0.2,
        }).addTo(mapRef.current);

        circle.on('mouseover', () => {
          // Actualizar icono a estado activo
          marker.setIcon(L.divIcon({
            className: '',
            html: buildMarkerHtml(name, true),
            iconSize:   [0, 0],
            iconAnchor: [0, 0],
          }));
          circle.setStyle({ fillOpacity: 0.22, opacity: 0.7, weight: 2 });
          setHovered({
            name:        data.name,
            rentBlurb:   data.rentBlurb,
            buyBlurb:    data.buyBlurb,
            rentability: data.rentability,
            avgPrice:    data.avgPrice,
            imageIdx:    data.imageIdx,
          });
        });

        circle.on('mouseout', () => {
          marker.setIcon(L.divIcon({
            className: '',
            html: buildMarkerHtml(name, false),
            iconSize:   [0, 0],
            iconAnchor: [0, 0],
          }));
          circle.setStyle({ fillOpacity: 0.06, opacity: 0.2, weight: 1.5 });
          setHovered(null);
        });

        markersRef.current[name] = { marker, circle };
      }
    };

    if ((window as any).L) {
      init();
    } else {
      // Cargar CSS de Leaflet
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
    ? hovered.imageIdx === 1
      ? '/images/Barrios medellín.jpg'
      : `/images/Barrios medellín (${hovered.imageIdx}).jpg`
    : null;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Mapa */}
      <div style={{ position: 'relative', width: '100%', height: 480, background: '#0a0a0a' }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

        {/* Overlay label superior */}
        <div style={{
          position: 'absolute', top: 16, left: 16, zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 12px',
          background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          fontFamily: FONT,
        }}>
          <img src="/icons/icon-favicon-white.gif" width={11} height={11} style={{ opacity: 0.5 }} alt="" />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)' }}>
            {zone.subzones.length} sectores · Pasa el cursor para explorar
          </span>
        </div>

        {/* Nombre del barrio mientras hover */}
        {hovered && (
          <div style={{
            position: 'absolute', top: 16, right: 16, zIndex: 1000,
            padding: '6px 14px',
            background: RED,
            fontFamily: FONT, fontSize: 11, fontWeight: 800,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: '#fff',
          }}>
            {hovered.name}
          </div>
        )}
      </div>

      {/* Ficha inferior — se muestra al hover */}
      <div style={{
        width: '100%',
        background: '#111',
        borderTop: `3px solid ${hovered ? RED : 'rgba(255,255,255,0.06)'}`,
        overflow: 'hidden',
        maxHeight: hovered ? 260 : 0,
        transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1), border-color 0.2s ease',
      }}>
        {hovered && imgSrc && (
          <div style={{ display: 'flex', height: 220, boxSizing: 'border-box' }}>
            {/* Imagen */}
            <div style={{ width: 200, flexShrink: 0, overflow: 'hidden' }}>
              <img
                src={imgSrc}
                alt={hovered.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>

            {/* Info */}
            <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden' }}>
              {/* Nombre + stats en línea */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 16 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: RED, marginBottom: 6, fontFamily: FONT }}>
                    {zone.name}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.1, fontFamily: FONT }}>
                    {hovered.name}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' as const }}>
                    <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: FONT, marginBottom: 3 }}>Rentabilidad</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: RED, fontFamily: FONT }}>{hovered.rentability}</div>
                  </div>
                  <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
                  <div style={{ textAlign: 'right' as const }}>
                    <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: FONT, marginBottom: 3 }}>Precio m²</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: FONT }}>{hovered.avgPrice}</div>
                  </div>
                </div>
              </div>

              {/* Blurbs arrendar / comprar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1 }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: RED, marginBottom: 6, fontFamily: FONT }}>
                    Arrendar aquí
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0, fontFamily: FONT }}>
                    {hovered.rentBlurb}
                  </p>
                </div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontFamily: FONT }}>
                    Comprar aquí
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0, fontFamily: FONT }}>
                    {hovered.buyBlurb}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
