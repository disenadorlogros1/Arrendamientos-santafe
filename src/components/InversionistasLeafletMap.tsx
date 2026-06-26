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

const RED = '#f32735';

const SECTOR_VIEW: Record<Sector, { center: [number, number]; zoom: number }> = {
  Norte:     { center: [6.36,  -75.55], zoom: 11 },
  Sur:       { center: [6.16,  -75.60], zoom: 12 },
  Oriente:   { center: [6.18,  -75.44], zoom: 10 },
  Occidente: { center: [6.245, -75.605], zoom: 13 },
};

// Polígonos aproximados para las 4 macro-zonas del área metropolitana de Medellín
const ZONE_POLYGONS: Record<string, [number, number][]> = {
  norte: [
    [6.2886,-75.5216],[6.3321,-75.5360],[6.3615,-75.5153],[6.3885,-75.5327],
    [6.4306,-75.4814],[6.4311,-75.5870],[6.4088,-75.6123],[6.3820,-75.6213],
    [6.3782,-75.6431],[6.3764,-75.6667],[6.3364,-75.6550],[6.3173,-75.6336],
    [6.3070,-75.5971],[6.3123,-75.5583],
  ],
  sur: [
    [6.1965,-75.6268],[6.1706,-75.6463],[6.1548,-75.6232],[6.1331,-75.6264],
    [6.1235,-75.5890],[6.1003,-75.5694],[6.1128,-75.5903],[6.1634,-75.6049],
    [6.1890,-75.5833],[6.1950,-75.5260],[6.1984,-75.4839],[6.1670,-75.4741],
    [6.1327,-75.5199],[6.1571,-75.5136],
  ],
  oriente: [
    [6.2314,-75.5756],[6.2247,-75.5652],[6.2158,-75.5635],[6.2145,-75.5578],
    [6.2185,-75.5553],[6.2143,-75.5469],[6.1755,-75.5574],[6.1794,-75.5727],
    [6.1890,-75.5833],[6.1702,-75.5370],[6.1951,-75.5260],[6.2051,-75.4859],
    [6.1921,-75.4654],[6.2129,-75.3861],[6.2337,-75.3749],[6.2244,-75.3277],
    [6.3186,-75.4821],[6.2961,-75.4885],[6.3013,-75.5154],[6.2897,-75.5217],
  ],
  occidente: [
    [6.2886,-75.5216],[6.3123,-75.5583],[6.3070,-75.5971],[6.2314,-75.5756],
    [6.2397,-75.5774],[6.2374,-75.6074],[6.2412,-75.6175],[6.2404,-75.6139],
    [6.2406,-75.6206],[6.2369,-75.6127],[6.2354,-75.6235],[6.2270,-75.6096],
    [6.2210,-75.6162],[6.2153,-75.6082],[6.2099,-75.6105],[6.2060,-75.6059],
    [6.1998,-75.6022],[6.2003,-75.5978],[6.1965,-75.6268],[6.1706,-75.6463],
    [6.2597,-75.5822],[6.2717,-75.5941],[6.2501,-75.5969],[6.2506,-75.6023],
    [6.2432,-75.6028],
  ],
};

export default function InversionistasLeafletMap({ zones, activeSector, hoveredZone }: Props) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const mapRef        = useRef<any>(null);
  const polygonsRef   = useRef<Record<string, { polygon: any; label: any }>>({});
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
        zoomControl:       false,
        scrollWheelZoom:   false,
        attributionControl: false,
        dragging:          false,
        doubleClickZoom:   false,
        touchZoom:         false,
      }).setView([6.2442, -75.5812], 10);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);

      zones.forEach(zone => {
        const coords = ZONE_POLYGONS[zone.id];
        if (!coords || coords.length < 3) return;

        const polygon = L.polygon(coords, {
          color:       '#aaa',
          weight:      1.5,
          fillColor:   '#aaa',
          fillOpacity: 0.06,
          opacity:     0.4,
        }).addTo(mapRef.current);

        // Etiqueta centrada en el polígono
        const lat = coords.reduce((s, c) => s + c[0], 0) / coords.length;
        const lng = coords.reduce((s, c) => s + c[1], 0) / coords.length;

        const label = L.marker([lat, lng], {
          icon: L.divIcon({
            className: '',
            html: `<span style="font-family:'Avenir LT Std','Outfit',sans-serif;font-size:10px;font-weight:700;color:#555;background:rgba(255,255,255,0.92);padding:2px 7px;border-radius:3px;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,0.10);border:1px solid rgba(0,0,0,0.08);display:inline-block;transform:translate(-50%,-50%)">${zone.name}</span>`,
            iconSize:   [0, 0],
            iconAnchor: [0, 0],
          }),
          interactive: false,
        }).addTo(mapRef.current);

        polygonsRef.current[zone.id] = { polygon, label };
      });
    };

    if ((window as any).L) {
      init();
    } else {
      const script  = document.createElement('script');
      script.src    = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.onload = init;
      document.head.appendChild(script);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    zones.forEach(zone => {
      const refs = polygonsRef.current[zone.id];
      if (!refs) return;

      const inActive = !activeSector || zone.sector === activeSector;
      const isHov    = hoveredZone === zone.id;

      if (isHov) {
        refs.polygon.setStyle({
          color: RED, weight: 2.5,
          fillColor: RED, fillOpacity: 0.30, opacity: 1,
        });
      } else if (inActive) {
        refs.polygon.setStyle({
          color: RED, weight: 1.5,
          fillColor: RED, fillOpacity: 0.15, opacity: 0.75,
        });
      } else {
        refs.polygon.setStyle({
          color: '#aaa', weight: 1,
          fillColor: '#aaa', fillOpacity: 0.04, opacity: 0.25,
        });
      }
    });

    if (activeSector !== prevSectorRef.current) {
      prevSectorRef.current = activeSector;
      if (activeSector) {
        const v = SECTOR_VIEW[activeSector];
        map.flyTo(v.center, v.zoom, { duration: 0.7, easeLinearity: 0.5 });
      } else {
        map.flyTo([6.2442, -75.5812], 10, { duration: 0.7, easeLinearity: 0.5 });
      }
    }
  }, [activeSector, hoveredZone, zones]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
