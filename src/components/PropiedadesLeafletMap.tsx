'use client';

import { useEffect, useRef, useState } from 'react';
import type { Property } from '@/data/properties';

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const MARKER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40"><circle cx="20" cy="20" r="18" fill="#f32735" stroke="white" stroke-width="2"/><path d="M20 8 C 16 8, 13 11, 13 15 C 13 19, 20 28, 20 28 C 20 28, 27 19, 27 15 C 27 11, 24 8, 20 8 Z" fill="white"/><circle cx="20" cy="14" r="3" fill="#f32735"/></svg>`;

interface Props {
  properties: Property[];
}

export default function PropiedadesLeafletMap({ properties }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  // Init Leaflet once
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

  // Update markers when properties or ready state changes
  useEffect(() => {
    if (!ready || !layerRef.current || !(window as any).L) return;
    const L = (window as any).L;

    layerRef.current.clearLayers();

    const icon = L.icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(MARKER_SVG)}`,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    });

    properties
      .filter(p => p.latitude && p.longitude)
      .forEach(p => {
        L.marker([p.latitude!, p.longitude!], { icon })
          .addTo(layerRef.current)
          .bindPopup(
            `<div style="font-family:${FONT};font-size:12px;line-height:1.4">
              <strong style="font-size:13px;color:#111">${p.reference}</strong><br/>
              <span style="color:#666">${p.location || ''}</span>
            </div>`,
            { maxWidth: 180 }
          );
      });
  }, [ready, properties]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '420px' }}>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%' }}
      />
      {/* Label flotante igual al de MapComponent */}
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
