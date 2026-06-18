'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropiedadesPage from '@/components/PropiedadesPage';
import type { PageType } from '@/components/Header';

function navigate(page: PageType, filter?: string) {
  if (page === 'propiedades') {
    const suffix = filter === 'Arrendar' ? '-arrendar' : filter === 'Comprar' ? '-comprar' : '';
    window.location.href = `/propiedades${suffix ? `#${suffix}` : ''}`;
  } else if (page === 'blog') {
    window.location.href = '/blog';
  } else if (page === 'inversionistas') {
    window.location.href = '/inversionistas';
  } else if (page === 'consignacion') {
    window.location.href = '/consignacion';
  } else {
    window.location.href = `/#${page}`;
  }
}

export default function Page() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="propiedades" onNavigate={navigate} />
      <main className="flex-1 relative" style={{ paddingTop: '86px' }}>
        <PropiedadesPage />
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}
