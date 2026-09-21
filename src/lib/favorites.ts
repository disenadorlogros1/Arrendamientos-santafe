'use client';

import { useCallback, useEffect, useState } from 'react';

const KEY = 'asf-favoritos';
const EVENT = 'asf-favoritos-change';

function read(): number[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw.filter((n): n is number => typeof n === 'number') : [];
  } catch {
    return [];
  }
}

/** Favoritos guardados en el navegador (sin cuenta), sincronizados entre componentes y pestañas. */
export function useFavorites() {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    const sync = () => setIds(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggle = useCallback((id: number) => {
    const current = read();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage no disponible */ }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { ids, count: ids.length, isFavorite: (id: number) => ids.includes(id), toggle };
}
