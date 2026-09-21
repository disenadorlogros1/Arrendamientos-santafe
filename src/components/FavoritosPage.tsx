'use client';

import { useMemo, useRef, useState } from 'react';
import { useFavorites, refCode } from '@/lib/favorites';
import { properties, type Property } from '@/data/properties';
import PropertyCard from '@/components/PropertyCard';

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED = '#f32735';
const MIN_COMPARE = 2;
const MAX_COMPARE = 4;

/** Grilla de cards. En celular (< 768px) se comporta como carrusel y muestra puntos de posición debajo. */
function FavCarousel({ count, children }: { count: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const updateActive = () => {
    const el = ref.current;
    if (!el) return;
    const base = el.getBoundingClientRect().left + 16; // padding-left del carrusel en celular
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const d = Math.abs(child.getBoundingClientRect().left - base);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    setActive(best);
  };

  const goTo = (i: number) => {
    const el = ref.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft - 16, behavior: 'smooth' });
  };

  return (
    <>
      <div ref={ref} onScroll={updateActive} className="fav-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {children}
      </div>
      {count > 1 && (
        <div className="fav-dots" role="tablist" aria-label="Posición en el carrusel">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Ir a la propiedad ${i + 1} de ${count}`}
              onClick={() => goTo(i)}
              className={i === active ? 'fav-dot fav-dot-active' : 'fav-dot'}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function FavoritosPage() {
  const { ids } = useFavorites();
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
      <style>{`
        .fav-mobile-cta { display: none; }
        .fav-dots { display: none; }
        @media (max-width: 767px) {
          .fav-head-btn { display: none !important; }
          .fav-mobile-cta { display: block; }
          /* Carrusel horizontal por tipo de propiedad */
          .fav-grid {
            display: flex !important;
            overflow-x: auto;
            gap: 12px !important;
            margin: 0 -16px;
            padding: 4px 16px 6px;
            scroll-snap-type: x mandatory;
            scroll-padding-left: 16px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .fav-grid::-webkit-scrollbar { display: none; }
          .fav-grid > * { flex: 0 0 76%; max-width: 330px; scroll-snap-align: start; }
          /* Puntos de posición */
          .fav-dots { display: flex; justify-content: center; align-items: center; gap: 6px; margin-top: 12px; }
          .fav-dot {
            width: 7px; height: 7px; padding: 0; border: none; border-radius: 4px;
            background: #d5d5d5; transition: width 0.2s ease, background 0.2s ease;
          }
          .fav-dot-active { width: 20px; background: #f32735; }
        }
      `}</style>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px clamp(16px, 3vw, 52px) 56px' }}>
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
                      {type}
                    </h2>
                    <button
                      type="button"
                      className="fav-head-btn"
                      disabled={!canCompare}
                      onClick={() => compare(type, list)}
                      style={{
                        fontFamily: FONT, fontWeight: 700, fontSize: 14, height: 40, padding: '0 22px', border: 'none',
                        background: canCompare ? RED : '#eee', color: canCompare ? '#fff' : '#aaa',
                        cursor: canCompare ? 'pointer' : 'not-allowed', transition: 'background 0.2s ease',
                      }}
                    >
                      Comparar
                    </button>
                  </div>

                  {/* Mismas cards verticales que Propiedades y Propiedades destacadas */}
                  <FavCarousel count={list.length}>
                    {list.map((p) => {
                      const isSel = chosen.includes(p.id);
                      const blocked = !isSel && chosen.length >= MAX_COMPARE;
                      return (
                        <div
                          key={p.id}
                          style={{
                            position: 'relative', borderRadius: 8,
                            boxShadow: isSel ? `0 0 0 1.5px ${RED}` : 'none',
                            transition: 'box-shadow 0.2s ease',
                          }}
                        >
                          <PropertyCard
                            property={p}
                            portraitMobile
                            disableSwipe
                            imageOverlay={
                              <button
                                type="button"
                                disabled={blocked}
                                aria-pressed={isSel}
                                onClick={() => toggleSelect(type, p.id)}
                                style={{
                                  fontFamily: FONT, fontWeight: 700, fontSize: 13, height: 34, padding: '0 16px', border: 'none',
                                  borderRadius: 999,
                                  background: isSel ? RED : '#fff', color: isSel ? '#fff' : '#1a1a1a',
                                  cursor: blocked ? 'not-allowed' : 'pointer', opacity: blocked ? 0.55 : 1,
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)', transition: 'background 0.2s ease, color 0.2s ease',
                                }}
                              >
                                Comparar
                              </button>
                            }
                          />
                        </div>
                      );
                    })}
                  </FavCarousel>

                  {/* Solo celular: botón Comparar debajo del carrusel */}
                  <div className="fav-mobile-cta" style={{ marginTop: 14 }}>
                    <button
                      type="button"
                      disabled={!canCompare}
                      onClick={() => compare(type, list)}
                      style={{
                        width: '100%', fontFamily: FONT, fontWeight: 700, fontSize: 15, height: 48, border: 'none', borderRadius: 999,
                        background: canCompare ? RED : '#eee', color: canCompare ? '#fff' : '#aaa',
                        cursor: canCompare ? 'pointer' : 'not-allowed', transition: 'background 0.2s ease',
                      }}
                    >
                      Comparar{chosen.length > 0 ? ` ${chosen.length} de ${type.toLowerCase()}` : ''}
                    </button>
                    {!canCompare && (
                      <p style={{ fontFamily: FONT, fontSize: 12, color: '#888', textAlign: 'center', margin: '8px 0 0' }}>
                        {list.length < MIN_COMPARE
                          ? `Guarda al menos ${MIN_COMPARE} propiedades de este tipo para compararlas`
                          : `Marca ${MIN_COMPARE - chosen.length} más para habilitar la comparación`}
                      </p>
                    )}
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
