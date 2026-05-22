'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogPage from '@/components/BlogPage';
import type { PageType } from '@/components/Header';

export default function Page() {
  const [currentPage, setCurrentPage] = useState<PageType>('blog');

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
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1 relative pt-[80px]">
        <BlogPage />
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
