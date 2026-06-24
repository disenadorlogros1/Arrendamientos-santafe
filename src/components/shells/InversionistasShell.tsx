'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InversionistasPage from '@/components/InversionistasPage';
import { navigate } from '@/lib/navigate';

export default function InversionistasShell() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="inversionistas" onNavigate={navigate} darkHeader />
      <main className="flex-1 relative" style={{ paddingTop: '86px' }}>
        <InversionistasPage />
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}
