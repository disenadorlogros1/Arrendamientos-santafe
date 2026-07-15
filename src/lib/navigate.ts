import type { PageType } from '@/components/Header';

export function navigate(page: PageType, filter?: string) {
  if (page === 'propiedades') {
    const suffix = filter === 'Arrendar' ? '#arrendar' : filter === 'Comprar' ? '#comprar' : '';
    window.location.href = `/propiedades${suffix}`;
  } else if (page === 'blog') {
    window.location.href = '/blog';
  } else if (page === 'historia-60') {
    window.location.href = '/blog/historia-60';
  } else if (page === 'inversionistas') {
    window.location.href = '/inversionistas';
  } else if (page === 'consignacion') {
    window.location.href = '/consignacion';
  } else {
    window.location.href = `/#${page}`;
  }
}