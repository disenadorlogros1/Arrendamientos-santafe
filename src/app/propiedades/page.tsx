'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropiedadesPage from '@/components/PropiedadesPage';
import type { PageType } from '@/components/Header';

export default function Page() {
  const [currentPage, setCurrentPage] = useState<PageType>('propiedades');

  const handleNavigate = (page: PageType) => {
    if (page === 'home') {
      window.location.href = '/';
    } else {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1 relative pt-[80px]">
        <PropiedadesPage />
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
