'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

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
    'Hasta $500.000',
    '$500.000 – $1.000.000',
    '$1.000.000 – $2.000.000',
    '$2.000.000 – $3.000.000',
    'Más de $3.000.000',
  ],
  comprar: [
    'Hasta $100M',
    '$100M – $200M',
    '$200M – $400M',
    '$400M – $600M',
    'Más de $600M',
  ],
};

/* ── Constantes de estilo ────────────────────────────────────────── */

const FONT        = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const COLOR_LABEL = '#909090';
const COLOR_VALUE = '#232222';
const RED         = '#f32735';
const RED_HOVER   = '#aa182c';

/* ── CustomSelect ────────────────────────────────────────────────── */

function CustomSelect({
  label, value, onChange, options, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string;
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

  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open) updatePos();
    setOpen(p => !p);
  }, [open, updatePos]);

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
    <div ref={dropdownRef}
      style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 2147483647 }}>
      <div className="bg-white shadow-2xl border border-gray-100 max-h-[240px] overflow-y-auto custom-scrollbar">
        {options.map(opt => (
          <button key={opt} type="button"
            onClick={e => { e.stopPropagation(); onChange(opt); setOpen(false); }}
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
          color: value ? COLOR_VALUE : '#b8b8b8', lineHeight: 1 }}>
          {value || placeholder || 'Seleccionar'}
        </span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"
          style={{ flexShrink: 0, opacity: 0.4,
            transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
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

/* ── Componente principal ────────────────────────────────────────── */

export default function SearchForm({ onNavigate }: SearchFormProps) {
  const [searchType, setSearchType] = useState<'arrendar' | 'comprar'>('arrendar');
  const [codigo,     setCodigo]     = useState('');
  const [sector,     setSector]     = useState('');
  const [tipo,       setTipo]       = useState('');
  const [precio,     setPrecio]     = useState('');

  const handleTabClick = (t: 'arrendar' | 'comprar') => {
    setSearchType(t);
    setPrecio('');
  };

  /* Celda de campo compartida */
  const FieldCell = ({
    icon, label, children, border = true,
  }: {
    icon: string; label: string; children: React.ReactNode; border?: boolean;
  }) => (
    <div
      className={`flex items-center gap-3 flex-1 px-5 py-4 min-w-0${border ? ' border-r border-gray-100' : ''}`}
    >
      <img src={icon} alt="" width={24} height={24} style={{ flexShrink: 0 }} />
      <div className="min-w-0 flex-1">
        <p style={{ fontFamily: FONT, fontSize: '11px', color: COLOR_LABEL,
          fontWeight: 300, marginBottom: '3px', lineHeight: 1 }}>
          {label}
        </p>
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.35)' }}>

      {/* ── Fila 1: Tabs Arrendar / Comprar ── */}
      <div className="flex" style={{ height: '44px' }}>
        {(['arrendar', 'comprar'] as const).map((t, i) => {
          const active = searchType === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => handleTabClick(t)}
              className="flex-1 flex items-center justify-center transition-all duration-200"
              style={{
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
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.55)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.4)'; }}
            >
              {t === 'arrendar' ? 'Arrendar' : 'Comprar'}
            </button>
          );
        })}
      </div>

      {/* ── Fila 2: Campos + Buscar ── */}
      <div className="flex bg-white">

        {/* Grid 2×2 en móvil, fila en desktop */}
        <div className="flex-1 grid grid-cols-2 sm:flex sm:flex-row">

          <FieldCell icon="/icons/icon-code-red.gif" label="Código inmueble">
            <input
              type="text"
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              placeholder="Ej: 12345"
              className="w-full bg-transparent border-none outline-none"
              style={{ fontFamily: FONT, fontSize: '14px',
                color: codigo ? COLOR_VALUE : '#b8b8b8', lineHeight: 1 }}
            />
          </FieldCell>

          <FieldCell
            icon="/icons/icon-location-red.gif"
            label="Ubicación"
            border={false}
          >
            <CustomSelect
              label="Ubicación"
              value={sector}
              onChange={setSector}
              options={SECTORES}
              placeholder="Seleccionar"
            />
          </FieldCell>

          {/* En móvil, estas dos celdas están en la segunda fila del grid */}
          <div className="flex items-center gap-3 flex-1 px-5 py-4 min-w-0 border-t sm:border-t-0 border-r border-gray-100">
            <img src="/icons/icon-home-red.gif" alt="" width={24} height={24} style={{ flexShrink: 0 }} />
            <div className="min-w-0 flex-1">
              <p style={{ fontFamily: FONT, fontSize: '11px', color: COLOR_LABEL,
                fontWeight: 300, marginBottom: '3px', lineHeight: 1 }}>
                Tipo de propiedad
              </p>
              <CustomSelect
                label="Tipo de propiedad"
                value={tipo}
                onChange={setTipo}
                options={TIPOS_INMUEBLE}
                placeholder="Seleccionar"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 px-5 py-4 min-w-0 border-t sm:border-t-0 border-gray-100">
            <img src="/icons/icon-dollar-red.gif" alt="" width={24} height={24} style={{ flexShrink: 0 }} />
            <div className="min-w-0 flex-1">
              <p style={{ fontFamily: FONT, fontSize: '11px', color: COLOR_LABEL,
                fontWeight: 300, marginBottom: '3px', lineHeight: 1 }}>
                Precio
              </p>
              <CustomSelect
                label="Precio"
                value={precio}
                onChange={setPrecio}
                options={PRESUPUESTO[searchType]}
                placeholder="Seleccionar"
              />
            </div>
          </div>
        </div>

        {/* Botón Buscar inmueble */}
        <button
          type="button"
          onClick={() => onNavigate?.('propiedades')}
          className="flex items-center justify-center gap-2.5 transition-colors duration-200 active:scale-[0.98] flex-shrink-0"
          style={{
            background: RED, color: '#fff',
            fontFamily: FONT, fontSize: '15px', fontWeight: 500,
            border: 'none', cursor: 'pointer',
            padding: '0 28px',
            minWidth: '160px',
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
