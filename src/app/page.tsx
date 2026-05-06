'use client';

import { useState, useEffect } from 'react';
import { type PageType } from '@/components/Header';
import { properties } from '@/data/properties';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import SearchForm from '@/components/SearchForm';
import FeaturedSection from '@/components/FeaturedSection';
import PropertyGrid from '@/components/PropertyGrid';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import PropiedadesPage from '@/components/PropiedadesPage';
import ConsignacionPage from '@/components/ConsignacionPage';
import HipotecasPage from '@/components/HipotecasPage';
import ServiciosPage from '@/components/ServiciosPage';
import InstitucionalPage from '@/components/InstitucionalPage';

function HomePage({ onNavigate }: { onNavigate: (page: PageType) => void }) {
  const featured = properties.filter((p) => p.featured);

  return (
    <>
      <HeroSection />
      <SearchForm />
      <div className="bg-brand-light py-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FeaturedSection onNavigate={onNavigate} />
          <div className="pb-6 md:pb-8">
            <PropertyGrid properties={featured} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'propiedades' && <PropiedadesPage />}
        {currentPage === 'consignacion' && <ConsignacionPage />}
        {currentPage === 'hipotecas' && <HipotecasPage />}
        {currentPage === 'servicios' && <ServiciosPage />}
        {currentPage === 'nosotros' && <InstitucionalPage />}
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
