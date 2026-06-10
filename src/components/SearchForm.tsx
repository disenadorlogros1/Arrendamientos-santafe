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

/* ── Estilos compartidos ─────────────────────────────────────────── */

const FONT       = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const COLOR_LABEL = '#909090';
const COLOR_VALUE = '#232222';

/* ── CustomSelect ────────────────────────────────────────────────── */

function CustomSelect({ label, value, onChange, options, placeholder }: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

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
    setOpen(prev => !prev);
  }, [open, updatePos]);

  const select = useCallback((val: string) => {
    onChange(val);
    setOpen(false);
  }, [onChange]);

  useEffect(() => {
    if (!open || !mounted) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(t) &&
          triggerRef.current && !triggerRef.current.contains(t)) setOpen(false);
    };
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => { clearTimeout(id); document.removeEventListener('mousedown', handler); };
  }, [open, mounted]);

  const dropdown = mounted && open ? (
    <div
      ref={dropdownRef}
      style={{ position: 'fixed', top: `${pos.top}px`, left: `${pos.left}px`, width: `${pos.width}px`, zIndex: 2147483647 }}
    >
      <div className="bg-white shadow-2xl border border-gray-100 max-h-[240px] overflow-y-auto custom-scrollbar">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={(e) => { e.stopPropagation(); select(opt); }}
            className={`block w-full text-left px-4 py-2.5 transition-colors duration-100 ${
              value === opt
                ? 'bg-brand-red text-white'
                : 'text-gray-700 hover:bg-brand-red hover:text-white'
            }`}
            style={{ fontFamily: FONT, fontSize: '13px' }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div className="min-w-0 w-full">
      <p style={{ fontFamily: FONT, fontSize: '11px', color: COLOR_LABEL, fontWeight: 300, marginBottom: '2px', lineHeight: 1 }}>
        {label}
      </p>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between bg-transparent border-none outline-none cursor-pointer text-left gap-1"
      >
        <span style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400, color: value ? COLOR_VALUE : '#b8b8b8', lineHeight: 1 }}>
          {value || placeholder || 'Seleccionar'}
        </span>
        <svg
          width="10" height="6" viewBox="0 0 10 6" fill="none"
          style={{ flexShrink: 0, opacity: 0.35, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
        >
          <path d="M1 1l4 4 4-4" stroke="#232222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {dropdown && createPortal(dropdown, document.body)}
    </div>
  );
}

/* ── Icono buscar ────────────────────────────────────────────────── */

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

/* ── Props ───────────────────────────────────────────────────────── */

interface SearchFormProps {
  mobileExpanded: boolean;
  onMobileExpand: (expanded: boolean) => void;
  onNavigate?: (page: 'propiedades') => void;
}

/* ── Componente principal ────────────────────────────────────────── */

export default function SearchForm({ onNavigate }: SearchFormProps) {
  const [searchType, setSearchType] = useState<'arrendar' | 'comprar'>('arrendar');
  const [codigo, setCodigo] = useState('');
  const [sector, setSector] = useState('');
  const [tipo, setTipo] = useState('');
  const [presupuesto, setPresupuesto] = useState('');

  const handleTabClick = (type: 'arrendar' | 'comprar') => {
    setSearchType(type);
    setPresupuesto('');
  };

  const handleSearch = () => {
    onNavigate?.('propiedades');
  };

  const CELL = "flex items-center px-5 py-3.5 min-w-0";

  return (
    <div className="w-full">

      {/* ── Fila 1: Arrendar / Comprar ─────────────────────────── */}
      <div className="flex" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        {(['arrendar', 'comprar'] as const).map((t, i) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTabClick(t)}
            className="flex-1 flex items-center justify-center transition-colors duration-200"
            style={{
              height: '44px',
              fontFamily: FONT,
              fontSize: '15px',
              fontWeight: searchType === t ? 600 : 400,
              color: searchType === t ? '#fff' : '#555',
              background: searchType === t ? '#f32735' : '#fff',
              borderRight: i === 0 ? '1px solid rgba(0,0,0,0.06)' : 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {t === 'arrendar' ? 'Arrendar' : 'Comprar'}
          </button>
        ))}
      </div>

      {/* ── Fila 2: Campos + Botón buscar ──────────────────────── */}
      {/* Desktop: todos en fila | Móvil: grid 2×2 + botón abajo */}
      <div className="flex flex-col sm:flex-row bg-white">

        {/* Grid 2×2 en móvil, fila en desktop */}
        <div className="flex-1 grid grid-cols-2 sm:flex sm:flex-row sm:divide-x divide-gray-100">

          {/* Código */}
          <div
            className={`${CELL} border-b sm:border-b-0 border-gray-100`}
            style={{ borderRight: '1px solid #f0f0f0' }}
          >
            <div className="min-w-0 w-full">
              <p style={{ fontFamily: FONT, fontSize: '11px', color: COLOR_LABEL, fontWeight: 300, marginBottom: '2px', lineHeight: 1 }}>
                Código
              </p>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ej: 12345"
                className="w-full bg-transparent border-none outline-none"
                style={{ fontFamily: FONT, fontSize: '14px', color: codigo ? COLOR_VALUE : '#b8b8b8', fontWeight: 400, lineHeight: 1 }}
              />
            </div>
          </div>

          {/* Ubicación */}
          <div
            className={`${CELL} border-b sm:border-b-0 border-gray-100`}
            style={{ borderRight: '1px solid #f0f0f0' }}
          >
            <CustomSelect
              label="Ubicación"
              value={sector}
              onChange={setSector}
              options={SECTORES}
              placeholder="Seleccionar"
            />
          </div>

          {/* Tipo de inmueble */}
          <div
            className={CELL}
            style={{ borderRight: '1px solid #f0f0f0' }}
          >
            <CustomSelect
              label="Tipo de inmueble"
              value={tipo}
              onChange={setTipo}
              options={TIPOS_INMUEBLE}
              placeholder="Seleccionar"
            />
          </div>

          {/* Presupuesto */}
          <div className={CELL}>
            <CustomSelect
              label="Presupuesto"
              value={presupuesto}
              onChange={setPresupuesto}
              options={PRESUPUESTO[searchType]}
              placeholder="Seleccionar"
            />
          </div>
        </div>

        {/* Botón Buscar */}
        <button
          type="button"
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 transition-colors duration-200 active:scale-[0.98]"
          style={{
            background: '#f32735',
            color: '#fff',
            fontFamily: FONT,
            fontSize: '15px',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            padding: '0 32px',
            minHeight: '52px',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#aa182c')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#f32735')}
        >
          <SearchIcon />
          <span>Buscar</span>
        </button>
      </div>

    </div>
  );
}
