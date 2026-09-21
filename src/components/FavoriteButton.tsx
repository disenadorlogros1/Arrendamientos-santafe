'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/lib/favorites';

interface FavoriteButtonProps {
  propertyId: number;
  size?: number;
  style?: React.CSSProperties;
}

const RED = '#f32735';

export default function FavoriteButton({ propertyId, size = 36, style }: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(propertyId);

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
      <Heart size={Math.round(size * 0.5)} color={RED} fill={active ? RED : 'none'} strokeWidth={2} />
    </button>
  );
}
