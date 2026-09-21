'use client';

import { useFavorites } from '@/lib/favorites';

interface FavoriteButtonProps {
  propertyId: number;
  size?: number;
  style?: React.CSSProperties;
}

const RED = '#f32735';
// Mismo trazado que public/icons/icon-heart-red.svg (para poder rellenarlo al guardar)
const HEART_PATH =
  'M952.28,336.13c-65.7-260.62-372.32-216.82-418.31,4.38h-2.68c-45.99-221.2-352.6-265-418.31-4.38-65.7,260.62,422.69,580.37,422.69,580.37,0,0,482.31-319.75,416.61-580.37Z';

export default function FavoriteButton({ propertyId, size = 36, style }: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(propertyId);
  const iconSize = Math.round(size * 0.58);

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); toggle(propertyId); }}
      onTouchStart={(e) => e.stopPropagation()}
      aria-label={active ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      aria-pressed={active}
      title={active ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: '#fff', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        transition: 'transform 0.18s ease',
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {active ? (
        <svg width={iconSize} height={iconSize} viewBox="0 0 1080 1080" aria-hidden="true">
          <path d={HEART_PATH} fill={RED} stroke={RED} strokeWidth={73.81} strokeMiterlimit={10} />
        </svg>
      ) : (
        <img src="/icons/icon-heart-red.svg" alt="" width={iconSize} height={iconSize} aria-hidden="true" />
      )}
    </button>
  );
}
