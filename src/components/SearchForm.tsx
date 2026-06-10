'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

/* ── Datos ───────────────────────────────────────────────────────── */

const SECTORES = [
  'Amaga', 'Barbosa', 'Bello', 'Copacabana', 'Envigado', 'Guarne', 'Guatapé', 'Itagüí',
  'La Ceja', 'La Estrella', 'Marinilla', 'Rionegro', 'Sabaneta', 'Sopetran',
  'Aranjuez', 'Barrio Colombia', 'Barrio Córdoba', 'Barrio Cristóbal', 'Barrio Girardot',
  'Barrio Santa Fe', 'Barrio Trinidad', 'Belén', 'Belencito', 'Boston', 'Boyacá',
  'Las Brisas', 'Buenos Aires', 'Caicedo', 'Calasanz', 'Caldas', 'Campo Amor',
  'Campo Valdés', 'Caribe', 'Castellana', 'Castilla', 'Centro', 'Cerca Éxito de Colombia',
  'Conquistadores', 'Cristo Rey', 'Doce de Octubre', 'El Carmen', 'Enciso', 'Estadio',
  'Fátima', 'Florencia', 'Floresta', 'Florida Nueva', 'Francisco Antonio Zea', 'Girardota',
  'Guayabal', 'La América', 'Llanogrande', 'López de Mesa', 'Loreto', 'Los Colores',
  'Los Olivos', 'Lourdes', 'Malibu', 'Manrique', 'Mayorca', 'Milagrosa', 'Naranjal',
  'Pedregal', 'Poblado', 'Prado', 'Retiro', 'Robledo', 'Rosales', 'San Antonio de Prado',
  'San Benito', 'San Cristóbal', 'San Diego', 'San Diego Poblado', 'San Javier',
  'San Jerónimo', 'San Joaquín', 'San Pablo', 'San Pedro', 'San Sebastián de Palmitas',
  'San Vicente Ferrer', 'Santa Cruz', 'Santa Elena', 'Santa Fe de Antioquia', 'Santa Mónica',
  'Sevilla', 'Simón Bolívar', 'Toscana', 'Tricentenario', 'Velódromo', 'Villa Hermosa',
];

const TIPOS_INMUEBLE = [
  'Apartamento', 'Apartaestudio', 'Casa', 'Oficina',
  'Local comercial', 'Bodega', 'Lote', 'Finca',
];

const PRESUPUESTO = {
  arrendar: [
    'Hasta $500.000', '$500.000 – $1.000.000', '$1.000.000 – $2.000.000',
    '$2.000.000 – $3.000.000', 'Más de $3.000.000',
  ],
  comprar: [
    'Hasta $100M', '$100M – $200M', '$200M – $400M',
    '$400M – $600M', 'Más de $600M',
  ],
};

/* ── Constantes ──────────────────────────────────────────────────── */

const FONT        = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const COLOR_LABEL = '#909090';
const COLOR_VALUE = '#232222';
const RED         = '#f32735';
const RED_HOVER   = '#aa182c';
const ICON_ONLY_W = 52; // ancho de celda colapsada

/* ── Iconos SVG para estado colapsado (gris) ─────────────────────── */

const IconCodigo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);
const IconUbicacion = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconTipo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const IconPrecio = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

/* ── CustomSelect ────────────────────────────────────────────────── */

function CustomSelect({
  value, onChange, options, placeholder, onOpen,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string; onOpen?: () => void;
}) {
  const [open, setOpen]       = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef            = useRef<HTMLButtonElement>(null);
  const dropdownRef           = useRef<HTMLDivElement>(null);
  const [pos, setPos]         = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => { setMounted(true); }, []);

  const updatePos = useCallback(() => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 2, left: r.left, width: Math.max(r.width, 200) });
    }
  }, []);

  const toggle = useCallback(() => {
    if (!open) {
      updatePos();
      onOpen?.();
    }
    setOpen(p => !p);
  }, [open, updatePos, onOpen]);

  useEffect(() => {
    if (!open || !mounted) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!dropdownRef.current?.contains(t) && !triggerRef.current?.contains(t)) setOpen(false);
    };
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => { clearTimeout(id); document.removeEventListener('mousedown', handler); };
  }, [open, mounted]);

  const dropdown = mounted && open ? (
    <div ref={dropdownRef} style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 2147483647 }}>
      <div className="bg-white shadow-2xl border border-gray-100 max-h-[240px] overflow-y-auto custom-scrollbar">
        {options.map(opt => (
          <button key={opt} type="button"
            onClick={() => { onChange(opt); setOpen(false); }}
            className={`block w-full text-left px-4 py-2.5 transition-colors duration-100 ${
              value === opt ? 'bg-brand-red text-white' : 'text-gray-700 hover:bg-brand-red hover:text-white'
            }`}
            style={{ fontFamily: FONT, fontSize: '13px' }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div className="min-w-0 w-full">
      <button ref={triggerRef} type="button" onClick={toggle}
        className="w-full flex items-center justify-between bg-transparent border-none outline-none cursor-pointer text-left gap-1">
        <span style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400,
          color: value ? COLOR_VALUE : '#b8b8b8', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value || placeholder || 'Seleccionar'}
        </span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"
          style={{ flexShrink: 0, opacity: 0.4, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
          <path d="M1 1l4 4 4-4" stroke="#232222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {dropdown && createPortal(dropdown, document.body)}
    </div>
  );
}

/* ── Props ───────────────────────────────────────────────────────── */

interface SearchFormProps {
  mobileExpanded: boolean;
  onMobileExpand: (expanded: boolean) => void;
  onNavigate?: (page: 'propiedades') => void;
}

type FilterMode = 'default' | 'codigo' | 'filters';

/* ── Componente principal ────────────────────────────────────────── */

export default function SearchForm({ onNavigate }: SearchFormProps) {
  // null = ningún tab seleccionado (ambos en blanco 40%)
  const [searchType, setSearchType] = useState<'arrendar' | 'comprar' | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>('default');
  const [codigo,     setCodigo]     = useState('');
  const [sector,     setSector]     = useState('');
  const [tipo,       setTipo]       = useState('');
  const [precio,     setPrecio]     = useState('');

  /* Refs GSAP */
  const rowRef      = useRef<HTMLDivElement>(null);
  const buscarRef   = useRef<HTMLButtonElement>(null);
  const cellRefs    = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const iconRefs    = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  // Rastrea si ya fijamos anchos explícitos (para hacer lock en la primera interacción)
  const widthsLocked = useRef(false);

  /* Estado inicial de iconos via GSAP (no en style prop de React) */
  useEffect(() => {
    iconRefs.current.forEach(el => {
      if (el) gsap.set(el, { opacity: 0, scale: 0.7 });
    });
  }, []);

  /* Fija anchos explícitos justo antes de la primera animación */
  const lockWidths = useCallback(() => {
    if (widthsLocked.current) return;
    cellRefs.current.forEach(cell => {
      if (!cell) return;
      const w = cell.getBoundingClientRect().width;
      if (w > 0) {
        gsap.set(cell, { width: w, flexGrow: 0, flexShrink: 0 });
      }
    });
    widthsLocked.current = true;
  }, []);

  /* Animación coordinada (misma curva que el carrusel) */
  const animateMode = useCallback((mode: FilterMode) => {
    if (typeof window === 'undefined' || window.innerWidth < 640) return;
    if (!rowRef.current || !buscarRef.current) return;

    lockWidths(); // lock en la primera interacción, no en el mount

    const totalW = rowRef.current.getBoundingClientRect().width;
    const btnW   = buscarRef.current.getBoundingClientRect().width;
    const avail  = totalW - btnW;

    const widths: [number, number, number, number] =
      mode === 'default'
        ? [avail / 4, avail / 4, avail / 4, avail / 4]
        : mode === 'codigo'
        ? [avail - 3 * ICON_ONLY_W, ICON_ONLY_W, ICON_ONLY_W, ICON_ONLY_W]
        : [ICON_ONLY_W, (avail - ICON_ONLY_W) / 3, (avail - ICON_ONLY_W) / 3, (avail - ICON_ONLY_W) / 3];

    const collapsed =
      mode === 'default' ? [false, false, false, false]
      : mode === 'codigo' ? [false, true,  true,  true]
      :                     [true,  false, false, false];

    /* Ancho de cada celda: power4.out = mismo impulso que las cards */
    cellRefs.current.forEach((cell, i) => {
      if (!cell) return;
      // Deshabilitar flex siempre (no solo en lockWidths) para que GSAP controle el ancho
      gsap.set(cell, { flexGrow: 0, flexShrink: 0 });
      gsap.to(cell, { width: widths[i], duration: 0.65, ease: 'power4.out', overwrite: 'auto' });
    });

    /* Contenido que colapsa: encoge y desaparece (como card saliente) */
    contentRefs.current.forEach((el, i) => {
      if (!el) return;
      if (collapsed[i]) {
        gsap.to(el, { opacity: 0, scale: 0.85, duration: 0.2, ease: 'power2.in', overwrite: 'auto' });
      } else {
        gsap.to(el, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out', delay: 0.25, overwrite: 'auto' });
      }
    });

    /* Icono que aparece: crece y aparece (como card entrante) */
    iconRefs.current.forEach((el, i) => {
      if (!el) return;
      if (collapsed[i]) {
        gsap.to(el, { opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out', delay: 0.2, overwrite: 'auto' });
      } else {
        gsap.to(el, { opacity: 0, scale: 0.7, duration: 0.15, ease: 'power2.in', overwrite: 'auto' });
      }
    });
  }, [lockWidths]);

  const handleCellClick = useCallback((clickedType: 'codigo' | 'filters') => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) return;
    const newMode: FilterMode = filterMode === clickedType ? 'default' : clickedType;
    setFilterMode(newMode);
    animateMode(newMode);
  }, [filterMode, animateMode]);

  /* ── Helpers de estilo ───────────────────────────────────────── */

  const cellStyle = (extraStyle?: React.CSSProperties): React.CSSProperties => ({
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    ...extraStyle,
  });

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 20px',
    minWidth: 0,
    width: '100%',
  };

  const iconOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    // opacity y transform los controla GSAP (no React) para evitar que el re-render los resetee
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: '11px',
    color: COLOR_LABEL,
    fontWeight: 300,
    marginBottom: '3px',
    lineHeight: 1,
    whiteSpace: 'nowrap',
  };

  /* ── Render ──────────────────────────────────────────────────── */

  return (
    <div className="w-full overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.35)' }}>

      {/* ── Fila 1: Tabs Arrendar / Comprar ─────────────────────── */}
      <div className="flex" style={{ height: '44px' }}>
        {(['arrendar', 'comprar'] as const).map((t, i) => {
          const active = searchType === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => { setSearchType(t); setPrecio(''); }}
              style={{
                flex: 1,
                height: '100%',
                background: active ? RED : 'rgba(255,255,255,0.4)',
                backdropFilter: active ? 'none' : 'blur(6px)',
                WebkitBackdropFilter: active ? 'none' : 'blur(6px)',
                color: active ? '#fff' : 'rgba(255,255,255,0.92)',
                fontFamily: FONT,
                fontSize: '15px',
                fontWeight: active ? 600 : 400,
                border: 'none',
                borderRight: i === 0 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                cursor: 'pointer',
                letterSpacing: '0.01em',
                transition: 'background 0.2s ease, color 0.2s ease',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.55)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.4)'; }}
            >
              {t === 'arrendar' ? 'Arrendar' : 'Comprar'}
            </button>
          );
        })}
      </div>

      {/* ── Fila 2: Filtros + Botón buscar ──────────────────────── */}
      <div ref={rowRef} style={{ display: 'flex', background: '#fff' }}>

        {/* Cuatro celdas — grid en móvil, flex en desktop */}
        <div className="flex-1 grid grid-cols-2 sm:flex sm:flex-row">

          {/* ── 0: Código ── */}
          <div
            ref={el => { cellRefs.current[0] = el; }}
            className="sm:flex-1 border-b sm:border-b-0"
            style={cellStyle({ borderRight: '1px solid rgba(0,0,0,0.07)' })}
            onClick={() => handleCellClick('codigo')}
          >
            <div ref={el => { iconRefs.current[0] = el; }} style={iconOverlayStyle}>
              <IconCodigo />
            </div>
            <div ref={el => { contentRefs.current[0] = el; }} style={contentStyle}>
              <img src="/icons/icon-code-red.gif" alt="" width={24} height={24} style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={labelStyle}>Código inmueble</p>
                <input
                  type="text"
                  value={codigo}
                  onChange={e => setCodigo(e.target.value)}
                  placeholder="Ej: 12345"
                  style={{ fontFamily: FONT, fontSize: '14px', color: codigo ? COLOR_VALUE : '#b8b8b8',
                    background: 'transparent', border: 'none', outline: 'none', width: '100%', lineHeight: 1 }}
                />
              </div>
            </div>
          </div>

          {/* ── 1: Ubicación ── */}
          <div
            ref={el => { cellRefs.current[1] = el; }}
            className="sm:flex-1 border-b sm:border-b-0"
            style={cellStyle({ borderRight: '1px solid rgba(0,0,0,0.07)' })}
            onClick={() => handleCellClick('filters')}
          >
            <div ref={el => { iconRefs.current[1] = el; }} style={iconOverlayStyle}>
              <IconUbicacion />
            </div>
            <div ref={el => { contentRefs.current[1] = el; }} style={contentStyle}>
              <img src="/icons/icon-location-red.gif" alt="" width={24} height={24} style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={labelStyle}>Ubicación</p>
                <CustomSelect
                  label="Ubicación" value={sector} onChange={setSector}
                  options={SECTORES} placeholder="Seleccionar"
                  onOpen={() => handleCellClick('filters')}
                />
              </div>
            </div>
          </div>

          {/* ── 2: Tipo de propiedad ── */}
          <div
            ref={el => { cellRefs.current[2] = el; }}
            className="sm:flex-1"
            style={cellStyle({ borderRight: '1px solid rgba(0,0,0,0.07)' })}
            onClick={() => handleCellClick('filters')}
          >
            <div ref={el => { iconRefs.current[2] = el; }} style={iconOverlayStyle}>
              <IconTipo />
            </div>
            <div ref={el => { contentRefs.current[2] = el; }} style={contentStyle}>
              <img src="/icons/icon-home-red.gif" alt="" width={24} height={24} style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={labelStyle}>Tipo de propiedad</p>
                <CustomSelect
                  label="Tipo" value={tipo} onChange={setTipo}
                  options={TIPOS_INMUEBLE} placeholder="Seleccionar"
                  onOpen={() => handleCellClick('filters')}
                />
              </div>
            </div>
          </div>

          {/* ── 3: Precio ── */}
          <div
            ref={el => { cellRefs.current[3] = el; }}
            className="sm:flex-1"
            style={cellStyle()}
            onClick={() => handleCellClick('filters')}
          >
            <div ref={el => { iconRefs.current[3] = el; }} style={iconOverlayStyle}>
              <IconPrecio />
            </div>
            <div ref={el => { contentRefs.current[3] = el; }} style={contentStyle}>
              <img src="/icons/icon-dollar-red.gif" alt="" width={24} height={24} style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={labelStyle}>Precio</p>
                <CustomSelect
                  label="Precio" value={precio} onChange={setPrecio}
                  options={PRESUPUESTO[searchType ?? 'arrendar']} placeholder="Seleccionar"
                  onOpen={() => handleCellClick('filters')}
                />
              </div>
            </div>
          </div>

        </div>

        {/* ── Botón Buscar ── */}
        <button
          ref={buscarRef}
          type="button"
          onClick={() => onNavigate?.('propiedades')}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            background: RED, color: '#fff',
            fontFamily: FONT, fontSize: '15px', fontWeight: 500,
            border: 'none', cursor: 'pointer',
            padding: '0 28px', minWidth: '160px', flexShrink: 0,
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = RED_HOVER)}
          onMouseLeave={e => (e.currentTarget.style.background = RED)}
        >
          <img src="/icons/icon-search-white.gif" alt="" width={18} height={18} />
          <span>Buscar inmueble</span>
        </button>

      </div>
    </div>
  );
}
