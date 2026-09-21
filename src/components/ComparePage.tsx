'use client';

import { useEffect, useState } from 'react';
import { properties, getInvestmentZoneForLocation, type Property } from '@/data/properties';
import { refCode } from '@/lib/favorites';

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED = '#f32735';
const MAX_COMPARE = 4;

interface Row {
  label: string;
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
      values: list.map((p) => p.price),
      nums: list.map((p) => num(p.price)),
      // Solo se resalta el más económico si todas son del mismo negocio (arriendo con arriendo, venta con venta)
      best: list.every((p) => p.businessType === list[0].businessType) ? 'min' : undefined,
    },
    { label: 'Oferta', values: list.map((p) => (p.businessType === 'Comprar' ? 'Venta' : 'Arriendo')) },
    { label: 'Sector', values: list.map((p) => p.location) },
    { label: 'Zona', values: list.map(zone) },
    { label: 'Área (m²)', values: list.map((p) => String(num(p.size) || '—')), nums: list.map((p) => num(p.size) || null), best: 'max' },
    { label: 'Habitaciones', values: list.map((p) => String(p.bedrooms)), nums: list.map((p) => p.bedrooms), best: 'max' },
    { label: 'Baños', values: list.map((p) => String(p.bathrooms)), nums: list.map((p) => p.bathrooms), best: 'max' },
    {
      label: 'Parqueaderos',
      values: list.map((p) => String(p.parking ?? p.garage ?? 0)),
      nums: list.map((p) => p.parking ?? p.garage ?? 0),
      best: 'max',
    },
    { label: 'Estrato', values: list.map((p) => (p.stratum ? String(p.stratum) : '—')) },
    { label: 'Amoblado', values: list.map((p) => yesNo(!!p.furnished)) },
    { label: 'Ascensor', values: list.map((p) => yesNo(has(p, 'ascensor'))) },
    { label: 'Unidad cerrada', values: list.map((p) => yesNo(has(p, 'unidad cerrada'))) },
    { label: 'Zona de ropas', values: list.map((p) => yesNo(has(p, 'lavander', 'ropas', 'servicios'))) },
    { label: 'Red de gas', values: list.map((p) => yesNo(has(p, 'gas'))) },
    { label: 'Cocina', values: list.map(kitchen) },
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
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px clamp(16px, 3vw, 52px) 56px' }}>
        <a href="/favoritos" style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: RED, textDecoration: 'none' }}>
          ← Volver a Mis Favoritos
        </a>
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

function CompareTable({ list }: { list: Property[] }) {
  const rows = buildRows(list);
  return (
    <>
      <p style={{ fontFamily: FONT, fontSize: 13, color: '#888', margin: '0 0 20px' }}>
        El mejor valor de cada fila aparece resaltado. Las filas marcadas con “·” son iguales en todas las propiedades.
      </p>
      <div style={{ overflowX: 'auto', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8 }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 180 + list.length * 210, fontFamily: FONT, fontSize: 14 }}>
          <thead>
            <tr>
              <th style={{ width: 180, background: '#fff' }} />
              {list.map((p) => (
                <th key={p.id} style={{ padding: 14, textAlign: 'left', verticalAlign: 'top', background: '#fff', fontWeight: 400 }}>
                  <img src={p.image} alt={p.title} style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 6, display: 'block', marginBottom: 10 }} />
                  <p style={{ fontWeight: 700, color: '#1a1a1a', margin: '0 0 2px' }}>{p.location}</p>
                  <a href={`/propiedad/${p.id}`} style={{ fontSize: 12, fontWeight: 700, color: RED, textDecoration: 'none' }}>
                    Cód. {refCode(p)} · Ver ficha
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const same = row.values.every((v) => v === row.values[0]);
              let bestVal: number | null = null;
              if (!same && row.nums && row.best) {
                const valid = row.nums.filter((n): n is number => n !== null);
                if (valid.length) bestVal = row.best === 'min' ? Math.min(...valid) : Math.max(...valid);
              }
              return (
                <tr key={row.label} style={{ background: same ? 'rgba(243,39,53,0.05)' : i % 2 ? '#fff' : '#fafafa' }}>
                  <th scope="row" style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: '#1a1a1a', background: '#f5f5f5', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    {row.label}{same ? ' ·' : ''}
                  </th>
                  {row.values.map((v, j) => {
                    const isBest = bestVal !== null && row.nums?.[j] === bestVal;
                    return (
                      <td
                        key={j}
                        style={{
                          padding: '12px 14px', borderTop: '1px solid rgba(0,0,0,0.06)',
                          color: isBest ? '#aa182c' : '#333', fontWeight: isBest ? 700 : 400,
                          background: isBest ? 'rgba(243,39,53,0.13)' : undefined,
                        }}
                      >
                        {v}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
