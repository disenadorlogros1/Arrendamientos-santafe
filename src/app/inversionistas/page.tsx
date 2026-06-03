'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InversionistasPage from '@/components/InversionistasPage';
import type { PageType } from '@/components/Header';

export default function Page() {
  const [currentPage, setCurrentPage] = useState<PageType>('inversionistas');

  const handleNavigate = (page: PageType) => {
    if (page === 'home') {
      window.location.href = '/';
    } else if (page === 'propiedades') {
      window.location.href = '/propiedades';
    } else {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} onNavigate={handleNavigate} isHeroPage={false} />
      <main className="flex-1 relative pt-[120px]">
        <InversionistasPage />
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
