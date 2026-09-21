'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Property } from '@/data/properties';

const KEY = 'asf-favoritos';
const EVENT = 'asf-favoritos-change';

/** Código público del inmueble (ej. "A12439"), el mismo que se muestra en tarjetas y en /comparar?codigos= */
export const refCode = (p: Pick<Property, 'reference'>) => p.reference.replace('Ref. ', '');

function read(): number[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw.filter((n): n is number => typeof n === 'number') : [];
  } catch {
    return [];
  }
}

function write(next: number[]) {
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage no disponible */ }
  window.dispatchEvent(new Event(EVENT));
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
    write(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  }, []);

  const remove = useCallback((id: number) => {
    write(read().filter((x) => x !== id));
  }, []);

  return { ids, count: ids.length, isFavorite: (id: number) => ids.includes(id), toggle, remove };
}
