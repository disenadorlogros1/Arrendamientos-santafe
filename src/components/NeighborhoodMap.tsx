'use client';

import { useEffect, useRef, useState } from 'react';
import type { InvestmentZone } from '@/data/investment-zones';
import { NEIGHBORHOOD_DATA } from '@/data/neighborhood-data';

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

interface Props { zone: InvestmentZone; }

interface ActiveNeighborhood {
  name: string; rentBlurb: string; buyBlurb: string;
  rentability: string; avgPrice: string; imageIdx: number;
}

const ZONE_CENTER: Record<string, { lat: number; lng: number; zoom: number }> = {
  norte:     { lat: 6.310, lng: -75.565, zoom: 12 },
  sur:       { lat: 6.160, lng: -75.600, zoom: 12 },
  oriente:   { lat: 6.175, lng: -75.480, zoom: 11 },
  occidente: { lat: 6.245, lng: -75.595, zoom: 13 },
};

export default function NeighborhoodMap({ zone }: Props) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const panelRef      = useRef<HTMLDivElement>(null);
  const mapRef        = useRef<any>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState<ActiveNeighborhood | null>(null);

  const cancelClose = () => {
    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      setActive(null);
    }, 250);
  };

  useEffect(() => {
    const subzones = zone.subzones;
    const viewConf = ZONE_CENTER[zone.slug] ?? { lat: 6.25, lng: -75.58, zoom: 12 };

    const PIN_W = 22, PIN_H = 30;

    const pinHtml = () =>
      `<div style="width:${PIN_W}px;height:${PIN_H}px;">
        <svg width="${PIN_W}" height="${PIN_H}" viewBox="0 0 22 30" fill="none">
          <path d="M11 0C4.925 0 0 4.925 0 11C0 19.25 11 30 11 30C11 30 22 19.25 22 11C22 4.925 17.075 0 11 0Z" fill="#222"/>
          <circle cx="11" cy="11" r="4.5" fill="white"/>
        </svg>
      </div>`;

    const labelHtml = (label: string) =>
      `<div style="padding:2px 7px;font-family:'Avenir LT Std','Outfit',sans-serif;font-size:9px;font-weight:700;letter-spacing:0.04em;color:#444;white-space:nowrap;transform:translate(-50%,6px);pointer-events:none;text-shadow:0 1px 3px rgba(255,255,255,0.9),0 0 6px rgba(255,255,255,0.7);">${label}</div>`;

    const init = () => {
      if (!containerRef.current || mapRef.current) return;
      const L = (window as any).L;

      mapRef.current = L.map(containerRef.current, {
        zoomControl: true, scrollWheelZoom: false, attributionControl: false,
        dragging: true, doubleClickZoom: false, touchZoom: true,
      }).setView([viewConf.lat, viewConf.lng], viewConf.zoom);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);

      for (const name of subzones) {
        const data = NEIGHBORHOOD_DATA[name];
        if (!data) continue;

        const pinIcon = L.divIcon({ className: '', html: pinHtml(), iconSize: [PIN_W, PIN_H], iconAnchor: [PIN_W/2, PIN_H] });
        const pin = L.marker([data.lat, data.lng], { icon: pinIcon }).addTo(mapRef.current);

        const labelIcon = L.divIcon({ className: '', html: labelHtml(name), iconSize: [0,0], iconAnchor: [0,0] });
        L.marker([data.lat, data.lng], { icon: labelIcon, interactive: false }).addTo(mapRef.current);

        // Solo abrir panel — sin setIcon() en el handler para evitar mouseout falsos
        pin.on('mouseover', () => {
          cancelClose();
          setActive({
            name:        data.name,
            rentBlurb:   data.rentBlurb,
            buyBlurb:    data.buyBlurb,
            rentability: data.rentability,
            avgPrice:    data.avgPrice,
            imageIdx:    data.imageIdx,
          });
        });

        pin.on('mouseout', scheduleClose);
      }
    };

    if ((window as any).L) {
      init();
    } else {
      if (!document.querySelector('link[data-leaflet]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        link.setAttribute('data-leaflet', '1');
        document.head.appendChild(link);
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.onload = init;
      document.head.appendChild(script);
    }

    return () => {
      cancelClose();
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zone.slug]);

  const imgSrc = active
    ? `/images/barrios/${NAME_TO_SLUG[active.name] ?? 'el-poblado'}.jpg`
    : null;

  return (
    <div style={{ position: 'relative', width: '100%', height: 480, overflow: 'hidden', isolation: 'isolate' as any }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', background: '#f5f5f5' }} />

      {/* Badge */}
      <div style={{
        position: 'absolute', top: 16, right: 16, zIndex: 10,
        padding: '6px 14px',
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(0,0,0,0.1)',
        fontFamily: FONT, fontSize: 10, fontWeight: 600,
        letterSpacing: '0.08em', color: '#888',
        opacity: active ? 0 : 1,
        transition: 'opacity 0.2s ease',
        pointerEvents: 'none',
      }}>
        {zone.subzones.length} sectores · Pasa el cursor sobre un pin
      </div>

      {/* Panel lateral */}
      <div
        ref={panelRef}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        style={{
          position: 'absolute', top: 0, right: 0, bottom: 0,
          width: '40%', zIndex: 11,
          background: '#f7f6f4',
          borderLeft: '1px solid #ebebeb',
          display: 'flex', flexDirection: 'column',
          fontFamily: FONT, overflow: 'hidden',
          transform: active ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <button
          onClick={() => { cancelClose(); setActive(null); }}
          style={{
            position: 'absolute', top: 12, right: 12, zIndex: 2,
            width: 28, height: 28,
            background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '50%', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT, fontSize: 14, color: '#888', lineHeight: 1, padding: 0,
          }}
          aria-label="Cerrar"
        >×</button>

        {active && (
          <>
            <div style={{ height: 180, overflow: 'hidden', flexShrink: 0 }}>
              {imgSrc && (
                <img src={imgSrc} alt={active.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
              )}
            </div>
            <div style={{ flex: 1, padding: '20px 20px 16px', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto' }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: RED, marginBottom: 5 }}>
                  {zone.name}
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
                  {active.name}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#ccc', marginBottom: 3 }}>Rentabilidad</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: RED }}>{active.rentability}</div>
                </div>
                <div style={{ width: 1, background: '#e8e8e8', alignSelf: 'stretch' }} />
                <div>
                  <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#ccc', marginBottom: 3 }}>Precio m²</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#1a1a1a', lineHeight: 1.3 }}>{active.avgPrice}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: RED, marginBottom: 4 }}>Arrendar</div>
                  <p style={{ fontSize: 11, color: '#555', lineHeight: 1.6, margin: 0 }}>{active.rentBlurb}</p>
                </div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#aaa', marginBottom: 4 }}>Comprar</div>
                  <p style={{ fontSize: 11, color: '#888', lineHeight: 1.6, margin: 0 }}>{active.buyBlurb}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
