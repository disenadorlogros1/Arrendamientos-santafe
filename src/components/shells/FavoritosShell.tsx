'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FavoritosPage from '@/components/FavoritosPage';
import { navigate } from '@/lib/navigate';

export default function FavoritosShell() {
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="favoritos" onNavigate={navigate} />
      <main className="flex-1 relative" style={{ paddingTop: '86px' }}>
        <FavoritosPage />
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}
