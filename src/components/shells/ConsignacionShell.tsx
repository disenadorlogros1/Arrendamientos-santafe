'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConsignacionPage from '@/components/ConsignacionPage';
import { navigate } from '@/lib/navigate';

export default function ConsignacionShell() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="consignacion" onNavigate={navigate} />
      <main className="flex-1 relative" style={{ paddingTop: '86px' }}>
        <ConsignacionPage />
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}