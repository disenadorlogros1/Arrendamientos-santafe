'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropiedadesPage from '@/components/PropiedadesPage';
import { navigate } from '@/lib/navigate';

export default function PropiedadesShell() {
  const [initialFilter, setInitialFilter] = useState<'Todos' | 'Arrendar' | 'Comprar'>('Todos');

  useEffect(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#arrendar') setInitialFilter('Arrendar');
    else if (hash === '#comprar') setInitialFilter('Comprar');
    else setInitialFilter('Todos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="propiedades" onNavigate={navigate} />
      <main className="flex-1 relative" style={{ paddingTop: '86px' }}>
        <PropiedadesPage initialFilter={initialFilter} />
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}