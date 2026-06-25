'use client';

import { useEffect, useRef } from 'react';
import type { Sector } from '@/data/investment-zones';

export interface ZonePoint {
  id: string;
  name: string;
  sector: Sector;
  lat: number;
  lng: number;
}

interface Props {
  zones: ZonePoint[];
  activeSector: Sector | null;
  hoveredZone: string | null;
}

const SECTOR_COLORS: Record<Sector, string> = {
  Norte:     '#3b82f6',
  Sur:       '#10b981',
  Oriente:   '#f59e0b',
  Occidente: '#a855f7',
};

const SECTOR_VIEW: Record<Sector, { center: [number, number]; zoom: number }> = {
  Norte:     { center: [6.3420, -75.5420], zoom: 12 },
  Sur:       { center: [6.1680, -75.6050], zoom: 12 },
  Oriente:   { center: [6.1950, -75.5000], zoom: 11 },
  Occidente: { center: [6.2420, -75.6180], zoom: 12 },
};

export default function InversionistasLeafletMap({ zones, activeSector, hoveredZone }: Props) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const mapRef        = useRef<any>(null);
  const markersRef    = useRef<Record<string, { circle: any; label: any }>>({});
  const prevSectorRef = useRef<Sector | null>(null);

  useEffect(() => {
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel  = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(link);
    }

    const init = () => {
      if (!containerRef.current || mapRef.current) return;
      const L = (window as any).L;

      mapRef.current = L.map(containerRef.current, {
        zoomControl:      false,
        scrollWheelZoom:  false,
        attributionControl: false,
        dragging:         false,
        doubleClickZoom:  false,
        touchZoom:        false,
      }).setView([6.2442, -75.5812], 11);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);

      zones.forEach(zone => {
        const color = SECTOR_COLORS[zone.sector];

        const circle = L.circle([zone.lat, zone.lng], {
          radius:      2200,
          color,
          fillColor:   color,
          fillOpacity: 0.12,
          weight:      2,
          opacity:     0.4,
        }).addTo(mapRef.current);

        const label = L.marker([zone.lat, zone.lng], {
          icon: L.divIcon({
            className: '',
            html: `<span style="font-family:'Avenir LT Std','Outfit',sans-serif;font-size:10px;font-weight:700;color:${color};background:rgba(255,255,255,0.95);padding:2px 8px;border-radius:10px;white-space:nowrap;box-shadow:0 1px 6px rgba(0,0,0,0.12);border:1px solid ${color}50;display:inline-block;transform:translate(-50%,-50%)">${zone.name}</span>`,
            iconSize:   [0, 0],
            iconAnchor: [0, 0],
          }),
          interactive: false,
        }).addTo(mapRef.current);

        markersRef.current[zone.id] = { circle, label };
      });
    };

    if ((window as any).L) {
      init();
    } else {
      const script    = document.createElement('script');
      script.src      = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.onload   = init;
      document.head.appendChild(script);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    zones.forEach(zone => {
      const refs = markersRef.current[zone.id];
      if (!refs) return;
      const inActive = !activeSector || zone.sector === activeSector;
      const isHov    = hoveredZone === zone.id;

      refs.circle.setStyle({
        fillOpacity: isHov ? 0.45 : inActive ? 0.20 : 0.04,
        opacity:     isHov ? 1    : inActive ? 0.70 : 0.15,
        weight:      isHov ? 3    : inActive ? 2    : 1,
      });
      refs.circle.setRadius(isHov ? 2800 : 2200);
    });

    if (activeSector !== prevSectorRef.current) {
      prevSectorRef.current = activeSector;
      if (activeSector) {
        const v = SECTOR_VIEW[activeSector];
        map.flyTo(v.center, v.zoom, { duration: 0.7, easeLinearity: 0.5 });
      } else {
        map.flyTo([6.2442, -75.5812], 11, { duration: 0.7, easeLinearity: 0.5 });
      }
    }
  }, [activeSector, hoveredZone, zones]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
