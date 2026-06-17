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

/* ── Iconos GIF para estado colapsado ────────────────────────────── */

const GRAY_FILTER = 'grayscale(1) opacity(0.5)';

const IconCodigo    = () => <img src="/icons/icon-code-Gray.gif"     alt="" width={22} height={22} />;
const IconUbicacion = () => <img src="/icons/icon-location-red.gif"  alt="" width={22} height={22} style={{ filter: GRAY_FILTER }} />;
const IconTipo      = () => <img src="/icons/icon-home-red.gif"      alt="" width={22} height={22} style={{ filter: GRAY_FILTER }} />;
const IconPrecio    = () => <img src="/icons/icon-dollar-red.gif"    alt="" width={22} height={22} style={{ filter: GRAY_FILTER }} />;

/* ── CustomSelect ────────────────────────────────────────────────── */

function CustomSelect({
  value, onChange, options, placeholder, onOpen, searchable = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string; onOpen?: () => void; searchable?: boolean;
}) {
  const [open, setOpen]     = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery]   = useState('');
  const buttonRef           = useRef<HTMLButtonElement>(null);
  const inputRef            = useRef<HTMLInputElement>(null);
  const dropdownRef         = useRef<HTMLDivElement>(null);
  const [pos, setPos]       = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => { setMounted(true); }, []);

  const updatePos = useCallback(() => {
    const el = searchable ? inputRef.current : buttonRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      setPos({ top: r.bottom + 2, left: r.left, width: Math.max(r.width, 200) });
    }
  }, [searchable]);

  const openDropdown = useCallback(() => {
    updatePos();
    onOpen?.();
    setQuery('');
    setOpen(true);
  }, [updatePos, onOpen]);

  const toggle = useCallback(() => {
    if (!open) openDropdown();
    else setOpen(false);
  }, [open, openDropdown]);

  /* Cierra al hacer click fuera */
  useEffect(() => {
    if (!open || !mounted) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      const anchor = searchable ? inputRef.current : buttonRef.current;
      if (!dropdownRef.current?.contains(t) && !anchor?.contains(t)) {
        setOpen(false);
        setQuery('');
      }
    };
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => { clearTimeout(id); document.removeEventListener('mousedown', handler); };
  }, [open, mounted, searchable]);

  /* Evita que el scroll del dropdown haga scroll a la página */
  useEffect(() => {
    const el = dropdownRef.current;
    if (!el || !open) return;
    const stop = (e: WheelEvent) => e.stopPropagation();
    el.addEventListener('wheel', stop, { passive: false });
    return () => el.removeEventListener('wheel', stop);
  }, [open]);

  /* Recalcula posición al hacer scroll para que el dropdown siga al trigger */
  useEffect(() => {
    if (!open) return;
    window.addEventListener('scroll', updatePos, { passive: true });
    return () => window.removeEventListener('scroll', updatePos);
  }, [open, updatePos]);

  const filtered = searchable && query
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  const selectOption = (opt: string) => { onChange(opt); setOpen(false); setQuery(''); };

  const dropdown = mounted && open ? (
    <div ref={dropdownRef} style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 2147483647 }}>
      <div className="bg-white shadow-2xl border border-gray-100 max-h-[240px] overflow-y-auto custom-scrollbar">
        {filtered.length === 0
          ? <p style={{ fontFamily: FONT, fontSize: '13px', padding: '10px 16px', color: '#aaa' }}>Sin resultados</p>
          : filtered.map(opt => (
            <button key={opt} type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => selectOption(opt)}
              className={`block w-full text-left px-4 py-2.5 transition-colors duration-100 ${
                value === opt ? 'bg-brand-red text-white' : 'text-gray-700 hover:bg-brand-red hover:text-white'
              }`}
              style={{ fontFamily: FONT, fontSize: '13px' }}>
              {opt}
            </button>
          ))
        }
      </div>
    </div>
  ) : null;

  if (searchable) {
    return (
      <div className="min-w-0 w-full">
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            ref={inputRef}
            type="text"
            value={open ? query : value}
            onChange={e => { setQuery(e.target.value); if (!open) openDropdown(); }}
            onFocus={openDropdown}
            placeholder={open ? (value || 'Buscar...') : (placeholder || 'Seleccionar')}
            style={{
              fontFamily: FONT, fontSize: '14px', fontWeight: 400,
              color: COLOR_VALUE, background: 'transparent',
              border: 'none', outline: 'none', flex: 1, minWidth: 0, lineHeight: 1,
            }}
          />
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"
            style={{ flexShrink: 0, opacity: 0.4, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', cursor: 'pointer' }}
            onMouseDown={e => { e.preventDefault(); toggle(); }}>
            <path d="M1 1l4 4 4-4" stroke="#232222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {dropdown && createPortal(dropdown, document.body)}
      </div>
    );
  }

  return (
    <div className="min-w-0 w-full">
      <button ref={buttonRef} type="button" onClick={toggle}
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
  mobileExpanded?: boolean;
  onMobileExpand?: (expanded: boolean) => void;
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
        // flexBasis:'auto' es crítico: Tailwind flex-1 pone flex-basis:0%
        // Con flex-grow:0 y flex-basis:0% la celda colapsa a 0. 'auto' hace que
        // el width explícito sea respetado por el navegador.
        gsap.set(cell, { width: w, flexGrow: 0, flexShrink: 0, flexBasis: 'auto' });
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
      // Deshabilitar flex siempre para que GSAP controle el ancho
      gsap.set(cell, { flexGrow: 0, flexShrink: 0, flexBasis: 'auto' });
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
    // En modo filtros, clic sobre los filtros no hace nada (evita que el toggle
    // regrese a 'default' y descomprima el campo código).
    // Solo el clic sobre el icono de código puede salir del modo filtros.
    if (filterMode === 'filters' && clickedType === 'filters') return;
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

      {/* ── Fila 2 mobile: filtros desplegables + CTA ─────────── */}
      <div className="sm:hidden">

        {/* Filtros: animan con max-height cuando hay tab activo */}
        <div
          style={{
            maxHeight: searchType ? '260px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            background: '#fff',
          }}
        >
          {/* Código inmueble */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <img src="/icons/icon-code-red.gif" alt="" width={20} height={20} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={labelStyle}>Código inmueble</p>
              <input
                type="text"
                value={codigo}
                onChange={e => setCodigo(e.target.value)}
                placeholder="Ej: 12345"
                style={{ fontFamily: FONT, fontSize: '13px', color: codigo ? COLOR_VALUE : '#b8b8b8', background: 'transparent', border: 'none', outline: 'none', width: '100%', lineHeight: 1 }}
              />
            </div>
          </div>

          {/* Ubicación */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <img src="/icons/icon-location-red.gif" alt="" width={20} height={20} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={labelStyle}>Ubicación</p>
              <CustomSelect label="Ubicación" value={sector} onChange={setSector} options={SECTORES} placeholder="Seleccionar" />
            </div>
          </div>

          {/* Tipo de propiedad */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <img src="/icons/icon-home-red.gif" alt="" width={20} height={20} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={labelStyle}>Tipo de propiedad</p>
              <CustomSelect label="Tipo" value={tipo} onChange={setTipo} options={TIPOS_INMUEBLE} placeholder="Seleccionar" />
            </div>
          </div>

          {/* Precio */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 16px' }}>
            <img src="/icons/icon-dollar-red.gif" alt="" width={20} height={20} style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={labelStyle}>Precio</p>
              <CustomSelect label="Precio" value={precio} onChange={setPrecio} options={PRESUPUESTO[searchType ?? 'arrendar']} placeholder="Seleccionar" />
            </div>
          </div>
        </div>

        {/* CTA siempre visible */}
        <button
          type="button"
          onClick={() => onNavigate?.('propiedades')}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            background: RED, color: '#fff',
            fontFamily: FONT, fontSize: '15px', fontWeight: 600,
            border: 'none', cursor: 'pointer',
            padding: '16px 0',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = RED_HOVER)}
          onMouseLeave={e => (e.currentTarget.style.background = RED)}
        >
          <img src="/icons/icon-search-white.gif" alt="" width={18} height={18} />
          <span>Buscar inmueble</span>
        </button>
      </div>

      {/* ── Fila 2 desktop: filtros + botón buscar ───────────── */}
      <div ref={rowRef} className="hidden sm:flex" style={{ background: '#fff' }}>

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
                  searchable
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
                  searchable
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
