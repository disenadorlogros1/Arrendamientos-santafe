'use client';

import { useFavorites } from '@/lib/favorites';

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";

/** Acceso flotante "Mis Favoritos (n)" — solo aparece cuando hay propiedades guardadas. */
export default function FloatingFavorites() {
  const { count } = useFavorites();
  if (count === 0) return null;

  return (
    <a
      href="/favoritos"
      aria-label={`Mis Favoritos, ${count} guardadas`}
      style={{
        position: 'fixed', left: 24, bottom: 24, zIndex: 45,
        display: 'inline-flex', alignItems: 'center', gap: 10,
        height: 44, padding: '0 14px 0 16px', borderRadius: 999,
        background: '#1a1a1a', color: '#fff', textDecoration: 'none',
        fontFamily: FONT, fontWeight: 700, fontSize: 14,
        boxShadow: '0 4px 18px rgba(0,0,0,0.35)',
      }}
    >
      <img src="/icons/icon-heart-white.svg" alt="" aria-hidden="true" width={18} height={18} />
      <span>Mis Favoritos</span>
      <span
        style={{
          minWidth: 22, height: 22, borderRadius: 11, padding: '0 6px',
          background: '#f32735', color: '#fff', fontSize: 12, fontWeight: 700,
          lineHeight: '22px', textAlign: 'center',
        }}
      >
        {count}
      </span>
    </a>
  );
}
