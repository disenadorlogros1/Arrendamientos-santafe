'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropiedadesPage from '@/components/PropiedadesPage';
import { navigate } from '@/lib/navigate';

export default function PropiedadesShell() {
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