'use client';

import { useState, useEffect } from 'react';
import { type PageType } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import SearchForm from '@/components/SearchForm';
import UserLocation from '@/components/UserLocation';
import FeaturedSection from '@/components/FeaturedSection';
import PropiedadesPage from '@/components/PropiedadesPage';
import ConsignacionPage from '@/components/ConsignacionPage';
import HipotecasPage from '@/components/HipotecasPage';
import ServiciosPage from '@/components/ServiciosPage';
import InstitucionalPage from '@/components/InstitucionalPage';
import PropertyGrid from '@/components/PropertyGrid';
import { properties } from '@/data/properties';

function HomePage({ onNavigate }: { onNavigate: (page: PageType) => void }) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const featured = properties.filter((p) => p.featured);

  return (
    <>
      <HeroSection />
      <SearchForm mobileExpanded={mobileExpanded} onMobileExpand={setMobileExpanded} />
      <UserLocation mobileExpanded={mobileExpanded} />
      <div className="bg-brand-light py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FeaturedSection onNavigate={onNavigate} />
          <div className="pb-12 md:pb-16">
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

      <main className="flex-1 relative">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'propiedades' && <PropiedadesPage />}
        {currentPage === 'consignacion' && <ConsignacionPage />}
        {currentPage === 'hipotecas' && <HipotecasPage />}
        {currentPage === 'servicios' && <ServiciosPage />}
        {currentPage === 'nosotros' && <InstitucionalPage />}
      </main>

      <Footer />
    </div>
  );
}
