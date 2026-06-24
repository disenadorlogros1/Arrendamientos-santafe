'use client';

import { useEffect, useRef, useState } from 'react';
import type { Property } from '@/data/properties';

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";

// Icono 10% más pequeño: 18px en vez de 20px
const MARKER_HTML = `
  <div style="position:relative;width:40px;height:50px;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.35))">
    <svg viewBox="0 0 40 50" width="40" height="50" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2 C10.6 2 3 9.6 3 19 C3 29.8 20 48 20 48 C20 48 37 29.8 37 19 C37 9.6 29.4 2 20 2Z"
            fill="#f32735" stroke="white" stroke-width="2.2"/>
    </svg>
    <img src="/icons/icon-favicon-white.gif"
      style="position:absolute;top:50%;left:50%;transform:translate(-50%,-62%);width:18px;height:18px;object-fit:contain;pointer-events:none"/>
  </div>
`;

interface Props {
  properties: Property[];
  onBoundsChange?: (visible: Property[]) => void;
  onHoverProperty?: (prop: Property | null) => void;
  onClickProperty?: (prop: Property) => void;
}

export default function PropiedadesLeafletMap({ properties, onBoundsChange, onHoverProperty, onClickProperty }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  const propsRef   = useRef(properties);
  const cbRef      = useRef(onBoundsChange);
  const hoverRef   = useRef(onHoverProperty);
  const clickRef   = useRef(onClickProperty);
  propsRef.current = properties;
  cbRef.current    = onBoundsChange;
  hoverRef.current = onHoverProperty;
  clickRef.current = onClickProperty;

  const fireUpdate = (map: any) => {
    if (!cbRef.current) return;
    const bounds = map.getBounds();
    const visible = propsRef.current.filter(
      p => p.latitude && p.longitude && bounds.contains([p.latitude!, p.longitude!])
    );
    cbRef.current(visible);
  };

  useEffect(() => {
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (!containerRef.current || mapRef.current) return;
      const L = (window as any).L;

      mapRef.current = L.map(containerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([6.2442, -75.5812], 12);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(mapRef.current);

      layerRef.current = L.layerGroup().addTo(mapRef.current);
      mapRef.current.on('moveend zoomend', () => fireUpdate(mapRef.current));
      setReady(true);
    };

    if ((window as any).L) {
      initMap();
    } else {
      const existing = document.querySelector('script[src*="leaflet.min.js"]');
      if (existing) {
        existing.addEventListener('load', initMap);
      } else {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
        script.async = true;
        script.onload = initMap;
        document.head.appendChild(script);
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        layerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!ready || !layerRef.current || !(window as any).L) return;
    const L = (window as any).L;

    layerRef.current.clearLayers();

    const icon = L.divIcon({
      className: '',
      html: MARKER_HTML,
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [0, -52],
    });

    properties
      .filter(p => p.latitude && p.longitude)
      .forEach(p => {
        const marker = L.marker([p.latitude!, p.longitude!], { icon })
          .addTo(layerRef.current);

        // Hover: muestra la propiedad en el panel izquierdo
        marker.on('mouseover', () => {
          if (hoverRef.current) hoverRef.current(p);
        });
        marker.on('mouseout', () => {
          if (hoverRef.current) hoverRef.current(null);
        });

        // Clic: abre la ficha de la propiedad
        marker.on('click', () => {
          if (clickRef.current) {
            clickRef.current(p);
          } else {
            window.location.href = `/propiedad/${p.id}`;
          }
        });
      });

    if (mapRef.current) fireUpdate(mapRef.current);
  }, [ready, properties]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <div style={{
        position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)',
        borderRadius: '20px', padding: '6px 14px',
        fontSize: '11px', fontFamily: FONT, color: '#666',
        whiteSpace: 'nowrap', boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
        pointerEvents: 'none', zIndex: 999,
      }}>
        Medellín y Área Metropolitana
      </div>
    </div>
  );
}
