'use client';

import { useFavorites } from '@/lib/favorites';
import { properties } from '@/data/properties';
import PropertyGrid from '@/components/PropertyGrid';

const FONT = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";

export default function FavoritosPage() {
  const { ids } = useFavorites();
  const saved = properties.filter((p) => ids.includes(p.id));

  return (
    <div style={{ background: '#fff', minHeight: '60vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px clamp(16px, 3vw, 52px) 56px' }}>
        <h1 style={{ fontFamily: FONT, fontWeight: 900, fontSize: 'clamp(26px, 2.6vw, 40px)', color: '#1a1a1a', margin: '0 0 24px' }}>
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
          <PropertyGrid properties={saved} />
        )}
      </div>
    </div>
  );
}
