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
  activeSector: Sector | null;
  hoveredSector: Sector | null;
}

const RED = '#f32735';

const SECTOR_VIEW: Record<Sector, { center: [number, number]; zoom: number }> = {
  Norte:     { center: [6.365,  -75.575], zoom: 11 },
  Sur:       { center: [6.155,  -75.608], zoom: 12 },
  Oriente:   { center: [6.160,  -75.510], zoom: 10 },
  Occidente: { center: [6.240,  -75.604], zoom: 13 },
};

// Municipios reales por sector
const SECTOR_MUNICIPALITIES: Record<Sector, string[]> = {
  Norte:     ['bello', 'copacabana'],
  Sur:       ['envigado', 'sabaneta', 'itagui'],
  Oriente:   ['el-poblado', 'rionegro'],
  Occidente: ['laureles', 'belen'],
};

const MUNICIPALITY_SECTOR: Record<string, Sector> = {};
for (const [sector, ids] of Object.entries(SECTOR_MUNICIPALITIES)) {
  ids.forEach(id => { MUNICIPALITY_SECTOR[id] = sector as Sector; });
}

const MUNICIPALITY_LABEL: Record<string, string> = {
  bello: 'Bello', copacabana: 'Copacabana',
  envigado: 'Envigado', sabaneta: 'Sabaneta', itagui: 'Itagüí',
  'el-poblado': 'El Poblado', rionegro: 'Rionegro',
  laureles: 'Laureles', belen: 'Belén',
};

// Polígonos reales OSM — nominatim.openstreetmap.org/lookup
const ZONE_POLYGONS: Record<string, [number, number][]> = {
  // Bello municipio — R1307262
  bello: [
    [6.376421,-75.666713],[6.360225,-75.664074],[6.349344,-75.654818],[6.336411,-75.654965],
    [6.313363,-75.625908],[6.31388,-75.608425],[6.308758,-75.603865],[6.312305,-75.55831],
    [6.29823,-75.536968],[6.296193,-75.527121],[6.292126,-75.529335],[6.287127,-75.525916],
    [6.332089,-75.536016],[6.336224,-75.535654],[6.345899,-75.517068],[6.361507,-75.515304],
    [6.384814,-75.533349],[6.38849,-75.532662],[6.380803,-75.552783],[6.418638,-75.570411],
    [6.424624,-75.577926],[6.431065,-75.586973],[6.430284,-75.592058],[6.413498,-75.600347],
    [6.381953,-75.621298],[6.387618,-75.634951],[6.380018,-75.651877],[6.376421,-75.666713],
  ],
  // Copacabana municipio — R1307276
  copacabana: [
    [6.336224,-75.535654],[6.289701,-75.521699],[6.296103,-75.488516],[6.299878,-75.486904],
    [6.306502,-75.491032],[6.311423,-75.483634],[6.317274,-75.468178],[6.331586,-75.452871],
    [6.336121,-75.45305],[6.33693,-75.460278],[6.373213,-75.486565],[6.376859,-75.480395],
    [6.37571,-75.473834],[6.379715,-75.481122],[6.421981,-75.491386],[6.430631,-75.481357],
    [6.433027,-75.490837],[6.417652,-75.497049],[6.417604,-75.503167],[6.412825,-75.503406],
    [6.413752,-75.512106],[6.409378,-75.512671],[6.39481,-75.522961],[6.387643,-75.533196],
    [6.369243,-75.523619],[6.361065,-75.515219],[6.338412,-75.523556],[6.336224,-75.535654],
  ],
  // Envigado municipio — R1307277
  envigado: [
    [6.163417,-75.604928],[6.152079,-75.601281],[6.143209,-75.591176],[6.112736,-75.590312],
    [6.107706,-75.577093],[6.104771,-75.564203],[6.10578,-75.550681],[6.131676,-75.536276],
    [6.132758,-75.519919],[6.14393,-75.521498],[6.151634,-75.513514],[6.157024,-75.513561],
    [6.153782,-75.504463],[6.155958,-75.502145],[6.160801,-75.487705],[6.157964,-75.475538],
    [6.166974,-75.474146],[6.174293,-75.484658],[6.198382,-75.483908],[6.193924,-75.497153],
    [6.18944,-75.500953],[6.195684,-75.516433],[6.195079,-75.525978],[6.174576,-75.546762],
    [6.176273,-75.565877],[6.18898,-75.583311],[6.170659,-75.60187],[6.163417,-75.604928],
  ],
  // Sabaneta municipio — R1307270
  sabaneta: [
    [6.151824,-75.633128],[6.132679,-75.632031],[6.13383,-75.627194],[6.126481,-75.620215],
    [6.126098,-75.614143],[6.116532,-75.605705],[6.112736,-75.590312],[6.143209,-75.591176],
    [6.152079,-75.601281],[6.163417,-75.604928],[6.151824,-75.633128],
  ],
  // Itagüí municipio — R1343279
  itagui: [
    [6.17059,-75.646298],[6.165483,-75.645426],[6.160971,-75.62564],[6.153691,-75.625021],
    [6.164069,-75.604095],[6.170659,-75.60187],[6.188331,-75.583671],[6.196986,-75.580865],
    [6.197076,-75.587666],[6.192722,-75.591711],[6.198846,-75.602595],[6.196453,-75.626789],
    [6.18873,-75.628352],[6.180745,-75.637201],[6.175525,-75.634535],[6.17059,-75.646298],
  ],
  // El Poblado – Comuna 14 Medellín — R7673973
  'el-poblado': [
    [6.18898,-75.583311],[6.179428,-75.572669],[6.175485,-75.557445],[6.179459,-75.554108],
    [6.185345,-75.556665],[6.184896,-75.552844],[6.192222,-75.554372],[6.21425,-75.546884],
    [6.213778,-75.551203],[6.218485,-75.555348],[6.214539,-75.557757],[6.215834,-75.563482],
    [6.218543,-75.566103],[6.224681,-75.565174],[6.231344,-75.575622],[6.18898,-75.583311],
  ],
  // Rionegro municipio — R3947503
  rionegro: [
    [6.205087,-75.485857],[6.189555,-75.485626],[6.166974,-75.474146],[6.116857,-75.465565],
    [6.101934,-75.46735],[6.087451,-75.45019],[6.069092,-75.445477],[6.068078,-75.425801],
    [6.065774,-75.384654],[6.077703,-75.381394],[6.105467,-75.390944],[6.113057,-75.357628],
    [6.133851,-75.354669],[6.172821,-75.358148],[6.193185,-75.347286],[6.198757,-75.329091],
    [6.206074,-75.327578],[6.211712,-75.327235],[6.21397,-75.330599],[6.218642,-75.330822],
    [6.223066,-75.342926],[6.23362,-75.350045],[6.233705,-75.374914],[6.212886,-75.386132],
    [6.214722,-75.408472],[6.199276,-75.422736],[6.196485,-75.464438],[6.205087,-75.485857],
  ],
  // Laureles-Estadio – Comuna 11 Medellín — R7680490
  laureles: [
    [6.241197,-75.617504],[6.237445,-75.607382],[6.239661,-75.577441],[6.248662,-75.580214],
    [6.259883,-75.574171],[6.259772,-75.58218],[6.271764,-75.594137],[6.254334,-75.598942],
    [6.254993,-75.596416],[6.250127,-75.596869],[6.250602,-75.602292],[6.243213,-75.602789],
    [6.241197,-75.617504],
  ],
  // Belén – Comuna 16 Medellín — R7676068
  belen: [
    [6.235372,-75.623533],[6.234643,-75.616512],[6.227981,-75.615415],[6.226977,-75.609581],
    [6.22268,-75.611013],[6.221026,-75.616166],[6.215314,-75.608184],[6.209917,-75.61048],
    [6.206004,-75.605928],[6.20521,-75.60943],[6.199764,-75.602165],[6.200307,-75.597757],
    [6.20992,-75.597914],[6.21122,-75.594246],[6.231397,-75.590175],[6.231344,-75.575622],
    [6.239661,-75.577441],[6.237445,-75.607382],[6.240392,-75.613921],[6.236893,-75.612701],
    [6.240626,-75.620611],[6.237917,-75.619566],[6.235372,-75.623533],
  ],
};

export default function InversionistasLeafletMap({ activeSector, hoveredSector }: Props) {
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
        zoomControl:        false,
        scrollWheelZoom:    false,
        attributionControl: false,
        dragging:           false,
        doubleClickZoom:    false,
        touchZoom:          false,
      }).setView([6.2442, -75.5812], 10);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);

      for (const [id, coords] of Object.entries(ZONE_POLYGONS)) {
        if (coords.length < 3) continue;

        const polygon = L.polygon(coords, {
          color: '#aaa', weight: 1.5,
          fillColor: '#aaa', fillOpacity: 0.06, opacity: 0.4,
        }).addTo(mapRef.current);

        const lat = coords.reduce((s, c) => s + c[0], 0) / coords.length;
        const lng = coords.reduce((s, c) => s + c[1], 0) / coords.length;
        const label = MUNICIPALITY_LABEL[id] ?? id;

        const marker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: '',
            html: `<span style="font-family:'Avenir LT Std','Outfit',sans-serif;font-size:10px;font-weight:700;color:#555;background:rgba(255,255,255,0.92);padding:2px 7px;border-radius:3px;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,0.10);border:1px solid rgba(0,0,0,0.08);display:inline-block;transform:translate(-50%,-50%)">${label}</span>`,
            iconSize:   [0, 0],
            iconAnchor: [0, 0],
          }),
          interactive: false,
        }).addTo(mapRef.current);

        polygonsRef.current[id] = { polygon, label: marker };
      }
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

  // Actualizar estilos cuando cambia sector activo u hover
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const effectiveSector = hoveredSector ?? activeSector;

    for (const [id, refs] of Object.entries(polygonsRef.current)) {
      const sector = MUNICIPALITY_SECTOR[id];
      const inActive = !effectiveSector || sector === effectiveSector;
      const isHov    = hoveredSector !== null && sector === hoveredSector;

      if (isHov) {
        refs.polygon.setStyle({
          color: RED, weight: 2.5,
          fillColor: RED, fillOpacity: 0.30, opacity: 1,
        });
      } else if (inActive) {
        refs.polygon.setStyle({
          color: RED, weight: 1.5,
          fillColor: RED, fillOpacity: 0.15, opacity: 0.8,
        });
      } else {
        refs.polygon.setStyle({
          color: '#ccc', weight: 1,
          fillColor: '#ccc', fillOpacity: 0.04, opacity: 0.3,
        });
      }
    }

    const targetSector = hoveredSector ?? activeSector;
    if (targetSector !== prevSectorRef.current) {
      prevSectorRef.current = targetSector;
      if (targetSector) {
        const v = SECTOR_VIEW[targetSector];
        map.flyTo(v.center, v.zoom, { duration: 0.7, easeLinearity: 0.5 });
      } else {
        map.flyTo([6.2442, -75.5812], 10, { duration: 0.7, easeLinearity: 0.5 });
      }
    }
  }, [activeSector, hoveredSector]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
