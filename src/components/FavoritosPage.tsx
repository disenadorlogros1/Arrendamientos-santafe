'use client';

import { useMemo, useState } from 'react';
import { useFavorites, refCode } from '@/lib/favorites';
import { properties, type Property } from '@/data/properties';

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED = '#f32735';
const MIN_COMPARE = 2;
const MAX_COMPARE = 4;

export default function FavoritosPage() {
  const { ids, remove } = useFavorites();
  const [selected, setSelected] = useState<Record<string, number[]>>({});

  const saved = useMemo(() => properties.filter((p) => ids.includes(p.id)), [ids]);

  // Agrupadas por tipo de inmueble: solo se comparan propiedades del mismo tipo
  const groups = useMemo(() => {
    const map = new Map<string, Property[]>();
    saved.forEach((p) => map.set(p.type, [...(map.get(p.type) ?? []), p]));
    return [...map.entries()];
  }, [saved]);

  const toggleSelect = (type: string, id: number) => {
    setSelected((prev) => {
      const current = (prev[type] ?? []).filter((x) => ids.includes(x));
      if (current.includes(id)) return { ...prev, [type]: current.filter((x) => x !== id) };
      if (current.length >= MAX_COMPARE) return prev;
      return { ...prev, [type]: [...current, id] };
    });
  };

  const compare = (type: string, list: Property[]) => {
    const chosen = list.filter((p) => (selected[type] ?? []).includes(p.id));
    window.location.href = `/comparar?codigos=${chosen.map(refCode).join(',')}`;
  };

  return (
    <div style={{ background: '#fff', minHeight: '60vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px clamp(16px, 3vw, 52px) 56px' }}>
        <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 'clamp(26px, 2.6vw, 40px)', color: '#1a1a1a', margin: '0 0 8px' }}>
          Mis Favoritos
        </h1>

        {saved.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ fontFamily: FONT, fontSize: 18, color: '#888', margin: '0 0 20px' }}>
              Aún no has guardado propiedades
            </p>
            <a
              href="/propiedades"
              className="btn-red-outline inline-flex items-center justify-center h-[42px] px-8"
              style={{ textDecoration: 'none', fontSize: 15 }}
            >
              <span>Ver propiedades</span>
            </a>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: FONT, fontSize: 15, color: '#666', margin: '0 0 28px' }}>
              {saved.length} {saved.length === 1 ? 'propiedad guardada' : 'propiedades guardadas'}. Selecciona {MIN_COMPARE} a {MAX_COMPARE} del mismo tipo para comparar.
            </p>

            {groups.map(([type, list]) => {
              const chosen = (selected[type] ?? []).filter((x) => ids.includes(x));
              const canCompare = chosen.length >= MIN_COMPARE && chosen.length <= MAX_COMPARE;
              return (
                <section key={type} style={{ marginBottom: 36 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                    <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 20, color: '#1a1a1a', margin: 0 }}>
                      {type} <span style={{ fontWeight: 400, color: '#999' }}>({list.length})</span>
                    </h2>
                    <button
                      type="button"
                      disabled={!canCompare}
                      onClick={() => compare(type, list)}
                      style={{
                        fontFamily: FONT, fontWeight: 700, fontSize: 14, height: 40, padding: '0 22px', border: 'none',
                        background: canCompare ? RED : '#eee', color: canCompare ? '#fff' : '#aaa',
                        cursor: canCompare ? 'pointer' : 'not-allowed', transition: 'background 0.2s ease',
                      }}
                    >
                      Comparar{chosen.length > 0 ? ` (${chosen.length})` : ''}
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                    {list.map((p) => {
                      const isSel = chosen.includes(p.id);
                      const blocked = !isSel && chosen.length >= MAX_COMPARE;
                      return (
                        <article
                          key={p.id}
                          style={{
                            background: '#fff', borderRadius: 8, overflow: 'hidden',
                            boxShadow: isSel ? `0 0 0 2px ${RED}, 0 2px 10px rgba(0,0,0,0.08)` : '0 1px 8px rgba(0,0,0,0.10)',
                          }}
                        >
                          <div style={{ position: 'relative', height: 160, background: '#eee' }}>
                            <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                            <label
                              style={{
                                position: 'absolute', top: 10, left: 10, display: 'inline-flex', alignItems: 'center', gap: 6,
                                background: '#fff', borderRadius: 4, padding: '5px 9px', fontFamily: FONT, fontWeight: 700, fontSize: 12,
                                color: '#1a1a1a', cursor: blocked ? 'not-allowed' : 'pointer', opacity: blocked ? 0.55 : 1,
                                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isSel}
                                disabled={blocked}
                                onChange={() => toggleSelect(type, p.id)}
                                style={{ accentColor: RED, width: 14, height: 14 }}
                              />
                              Comparar
                            </label>
                            <button
                              type="button"
                              onClick={() => remove(p.id)}
                              aria-label="Quitar de favoritos"
                              title="Quitar de favoritos"
                              style={{
                                position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%',
                                background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                              }}
                            >
                              <img src="/icons/icon-close-red-dark.svg" alt="" aria-hidden="true" width={14} height={14} />
                            </button>
                          </div>
                          <div style={{ padding: '12px 14px 14px' }}>
                            <p style={{ fontFamily: FONT, fontWeight: 900, fontSize: 20, color: '#1a1a1a', margin: '0 0 2px' }}>{p.price}</p>
                            <p style={{ fontFamily: FONT, fontSize: 13, color: '#666', margin: '0 0 4px' }}>{p.location}</p>
                            <p style={{ fontFamily: FONT, fontSize: 12, color: '#888', margin: '0 0 8px' }}>
                              {p.bedrooms} hab · {p.bathrooms} baños · {p.size}
                            </p>
                            <a href={`/propiedad/${p.id}`} style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, color: RED, textDecoration: 'none' }}>
                              Ver ficha →
                            </a>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
