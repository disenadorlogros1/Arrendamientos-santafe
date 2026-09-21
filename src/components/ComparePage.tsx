'use client';

import { useEffect, useState } from 'react';
import { properties, getInvestmentZoneForLocation, type Property } from '@/data/properties';
import { refCode } from '@/lib/favorites';

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED = '#f32735';
const MAX_COMPARE = 4;

interface Row {
  label: string;
  icon: string;
  values: string[];
  /** valores numéricos para resaltar el mejor */
  nums?: (number | null)[];
  best?: 'min' | 'max';
}

const num = (s: string) => parseInt(s.replace(/[^0-9]/g, ''), 10) || 0;
const yesNo = (b: boolean) => (b ? 'Sí' : 'No');
const has = (p: Property, ...keys: string[]) =>
  (p.characteristics ?? []).some((c) => keys.some((k) => c.toLowerCase().includes(k)));

function kitchen(p: Property): string {
  const c = (p.characteristics ?? []).find((x) => x.toLowerCase().includes('cocina'));
  if (!c) return '—';
  const rest = c.replace(/cocina/i, '').trim();
  return rest ? rest.charAt(0).toUpperCase() + rest.slice(1) : 'Sí';
}

function buildRows(list: Property[]): Row[] {
  const zone = (p: Property) => {
    const z = getInvestmentZoneForLocation(p.location);
    return z ? z.charAt(0).toUpperCase() + z.slice(1) : '—';
  };
  return [
    {
      label: 'Precio',
      icon: '/icons/icon-dollar-red.svg',
      values: list.map((p) => p.price),
      nums: list.map((p) => num(p.price)),
      // Solo se resalta el más económico si todas son del mismo negocio (arriendo con arriendo, venta con venta)
      best: list.every((p) => p.businessType === list[0].businessType) ? 'min' : undefined,
    },
    { label: 'Oferta', icon: '/icons/icon-key-red.svg', values: list.map((p) => (p.businessType === 'Comprar' ? 'Venta' : 'Arriendo')) },
    { label: 'Sector', icon: '/icons/icon-location-red.svg', values: list.map((p) => p.location) },
    { label: 'Zona', icon: '/icons/icon-home-red.svg', values: list.map(zone) },
    { label: 'Área (m²)', icon: '/icons/icon-area-red.svg', values: list.map((p) => String(num(p.size) || '—')), nums: list.map((p) => num(p.size) || null), best: 'max' },
    { label: 'Habitaciones', icon: '/icons/icon-bed-red.svg', values: list.map((p) => String(p.bedrooms)), nums: list.map((p) => p.bedrooms), best: 'max' },
    { label: 'Baños', icon: '/icons/icon-bathroom-red.svg', values: list.map((p) => String(p.bathrooms)), nums: list.map((p) => p.bathrooms), best: 'max' },
    {
      label: 'Parqueaderos',
      icon: '/icons/icon-parking-red.svg',
      values: list.map((p) => String(p.parking ?? p.garage ?? 0)),
      nums: list.map((p) => p.parking ?? p.garage ?? 0),
      best: 'max',
    },
    { label: 'Estrato', icon: '/icons/icon-estrato-red.svg', values: list.map((p) => (p.stratum ? String(p.stratum) : '—')) },
    { label: 'Amoblado', icon: '/icons/icon-sofa-red.svg', values: list.map((p) => yesNo(!!p.furnished)) },
    { label: 'Ascensor', icon: '/icons/icon-check-red.svg', values: list.map((p) => yesNo(has(p, 'ascensor'))) },
    { label: 'Unidad cerrada', icon: '/icons/icon-shield-red.svg', values: list.map((p) => yesNo(has(p, 'unidad cerrada'))) },
    { label: 'Zona de ropas', icon: '/icons/icon-water-red.svg', values: list.map((p) => yesNo(has(p, 'lavander', 'ropas', 'servicios'))) },
    { label: 'Red de gas', icon: '/icons/icon-flame-red.svg', values: list.map((p) => yesNo(has(p, 'gas'))) },
    { label: 'Cocina', icon: '/icons/icon-kitchen-red.svg', values: list.map(kitchen) },
  ];
}

export default function ComparePage() {
  const [list, setList] = useState<Property[] | null>(null);

  useEffect(() => {
    const codes = (new URLSearchParams(window.location.search).get('codigos') ?? '')
      .split(',').map((c) => c.trim().toLowerCase()).filter(Boolean).slice(0, MAX_COMPARE);
    const found = codes
      .map((c) => properties.find((p) => refCode(p).toLowerCase() === c))
      .filter((p): p is Property => !!p);
    setList(found);
  }, []);

  return (
    <div style={{ background: '#fff', minHeight: '60vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px clamp(16px, 3vw, 52px) 56px' }}>
        <style>{`
          .cmp-back-mobile { display: none; }
          @media (max-width: 1023px) {
            .cmp-back-desktop { display: none !important; }
            .cmp-back-mobile {
              display: flex; align-items: center; justify-content: center;
              position: sticky; top: 98px; z-index: 30;
              width: 40px; height: 40px; border-radius: 50%; border: none; padding: 0;
              background: ${RED}; box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            }
          }
        `}</style>
        <a className="cmp-back-desktop" href="/favoritos" style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: RED, textDecoration: 'none' }}>
          ← Volver a Mis Favoritos
        </a>
        <button
          type="button"
          className="cmp-back-mobile"
          aria-label="Volver a la página anterior"
          onClick={() => {
            if (document.referrer && window.history.length > 1) window.history.back();
            else window.location.href = '/favoritos';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 'clamp(26px, 2.6vw, 40px)', color: '#1a1a1a', margin: '14px 0 8px' }}>
          Comparar propiedades
        </h1>

        {list === null ? (
          <p style={{ fontFamily: FONT, color: '#888' }}>Cargando…</p>
        ) : list.length < 2 ? (
          <p style={{ fontFamily: FONT, color: '#888', marginTop: 24 }}>
            Selecciona al menos 2 propiedades en tus favoritos para compararlas.
          </p>
        ) : (
          <CompareTable list={list} />
        )}
      </div>
    </div>
  );
}

function CompareRow({ icon, label, value, best }: { icon: string; label: string; value: string; best: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '10px 0', minWidth: 0, overflow: 'hidden' }}
    >
      <img
        src={icon} width="15" height="15" alt=""
        style={{
          flexShrink: 0, alignSelf: 'center',
          filter: hov || best
            ? 'invert(16%) sepia(100%) saturate(6000%) hue-rotate(340deg) brightness(85%)'
            : 'grayscale(1) opacity(0.35)',
          transition: 'filter 0.18s',
        }}
      />
      <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: '#333', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ flex: 1, height: 0, minWidth: 12, borderBottom: `1px solid ${hov || best ? RED : '#1a1a1a'}`, marginBottom: 3, transition: 'border-color 0.18s' }} />
      <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: best ? 700 : 400, color: best ? '#aa182c' : '#555', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  );
}

function CompareTable({ list }: { list: Property[] }) {
  const rows = buildRows(list);
  return (
    <>
      <style>{`
        .cmp-mobile { display: none; }
        @media (max-width: 1023px) {
          .cmp-desktop { display: none; }
          .cmp-mobile { display: block; max-width: 640px; margin: 0 auto; }
        }
      `}</style>
      <p style={{ fontFamily: FONT, fontSize: 13, color: '#888', margin: '0 0 20px' }}>
        El mejor valor de cada fila aparece resaltado en rojo.
      </p>
      <div className="cmp-mobile">
        <CompareMobile list={list} rows={rows} />
      </div>
      <div className="cmp-desktop" style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${list.length}, minmax(260px, 1fr))`, gap: 0, minWidth: list.length * 260 }}>
          {list.map((p, col) => (
            <div key={p.id} style={{ padding: '0 24px', borderLeft: col > 0 ? '1px solid rgba(0,0,0,0.1)' : 'none', minWidth: 0 }}>
              <img src={p.image} alt={p.title} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 6, display: 'block', marginBottom: 12 }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: FONT, fontWeight: 900, fontSize: 16, color: '#1a1a1a', margin: '0 0 2px' }}>{p.location}</p>
                  <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: '#888', margin: 0 }}>Cód. {refCode(p)}</p>
                </div>
                <a
                  href={`/propiedad/${p.id}`}
                  style={{
                    flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    height: 34, padding: '0 16px', borderRadius: 999, background: RED, color: '#fff',
                    fontFamily: FONT, fontWeight: 700, fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap',
                  }}
                >
                  Ver propiedad
                </a>
              </div>
              <h2 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '22px 0 8px' }}>Detalles del inmueble</h2>
              {rows.map((row) => {
                const same = row.values.every((v) => v === row.values[0]);
                let bestVal: number | null = null;
                if (!same && row.nums && row.best) {
                  const valid = row.nums.filter((n): n is number => n !== null);
                  if (valid.length) bestVal = row.best === 'min' ? Math.min(...valid) : Math.max(...valid);
                }
                const best = bestVal !== null && row.nums?.[col] === bestVal;
                return <CompareRow key={row.label} icon={row.icon} label={row.label} value={row.values[col]} best={best} />;
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── Vista para celular: una fila por característica, sin cajas con scroll ── */
function bestIndexes(row: Row): Set<number> {
  const out = new Set<number>();
  const same = row.values.every((v) => v === row.values[0]);
  if (same || !row.nums || !row.best) return out;
  const valid = row.nums.filter((n): n is number => n !== null);
  if (!valid.length) return out;
  const target = row.best === 'min' ? Math.min(...valid) : Math.max(...valid);
  row.nums.forEach((n, i) => { if (n === target) out.add(i); });
  return out;
}

function CompareMobile({ list, rows }: { list: Property[]; rows: Row[] }) {
  // 2 propiedades → 2 columnas, 3 → 3 columnas, 4 → 2×2. Todo fluye con el scroll de la página, sin cajas con barras.
  const cols = list.length === 3 ? 3 : 2;
  const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 8 };
  return (
    <div>
      {/* Propiedades */}
      <div style={grid}>
        {list.map((p) => (
          <div key={p.id} style={{ minWidth: 0 }}>
            <a href={`/propiedad/${p.id}`} style={{ display: 'block', textDecoration: 'none' }}>
              <img src={p.image} alt={p.title} style={{ width: '100%', height: 96, objectFit: 'cover', borderRadius: 8, display: 'block', marginBottom: 8 }} />
              <p style={{ fontFamily: FONT, fontWeight: 900, fontSize: 14, color: '#1a1a1a', margin: 0, lineHeight: 1.2 }}>{p.location}</p>
              <p style={{ fontFamily: FONT, fontWeight: 700, fontSize: 11, color: '#888', margin: '2px 0 8px' }}>Cód. {refCode(p)}</p>
            </a>
            <a
              href={`/propiedad/${p.id}`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', height: 34, borderRadius: 999,
                background: RED, color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 12.5, textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >
              Ver propiedad
            </a>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '26px 0 4px' }}>Detalles del inmueble</h2>

      {/* Una fila por característica: etiqueta arriba y el valor de cada propiedad debajo */}
      {rows.map((row) => {
        const best = bestIndexes(row);
        return (
          <div key={row.label} style={{ padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <img src={row.icon} width="15" height="15" alt="" style={{ flexShrink: 0, filter: 'grayscale(1) opacity(0.4)' }} />
              <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: '#333' }}>{row.label}</span>
            </div>
            <div style={grid}>
              {row.values.map((v, j) => {
                const isBest = best.has(j);
                return (
                  <a
                    key={j}
                    href={`/propiedad/${list[j].id}`}
                    aria-label={`${row.label}: ${v}. Ver propiedad ${list[j].location}`}
                    style={{
                      display: 'block', textDecoration: 'none', cursor: 'pointer',
                      minWidth: 0, textAlign: 'center', padding: '8px 6px', borderRadius: 8,
                      background: isBest ? 'rgba(243,39,53,0.09)' : '#f7f6f4',
                      boxShadow: isBest ? 'inset 0 0 0 1px rgba(243,39,53,0.35)' : 'none',
                    }}
                  >
                    <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: isBest ? 700 : 400, color: isBest ? '#aa182c' : '#444', wordBreak: 'break-word', lineHeight: 1.25 }}>{v}</div>
                    <div style={{ fontFamily: FONT, fontSize: 10.5, color: '#999', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{list[j].location}</div>
                  </a>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
