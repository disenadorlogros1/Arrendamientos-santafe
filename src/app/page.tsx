'use client';

import { useState, useEffect } from 'react';
import { type PageType } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import SearchForm from '@/components/SearchForm';
import UserLocation from '@/components/UserLocation';
import FeaturedSection from '@/components/FeaturedSection';
import PropietariosBlock from '@/components/PropietariosBlock';
import ServiciosBlock from '@/components/ServiciosBlock';
import TrayectoriaBlock from '@/components/TrayectoriaBlock';
import PropiedadesPage from '@/components/PropiedadesPage';
import ConsignacionPage from '@/components/ConsignacionPage';
import HipotecasPage from '@/components/HipotecasPage';
import ServiciosPage from '@/components/ServiciosPage';
import InstitucionalPage from '@/components/InstitucionalPage';
import PoliticasPage from '@/components/PoliticasPage';
import TerminosPage from '@/components/TerminosPage';

function HomePage({ onNavigate }: { onNavigate: (page: PageType) => void }) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  return (
    <>
      {/* Sección 1: Hero Principal */}
      <HeroSection onNavigate={onNavigate} />

      {/* Buscador (anclado al hero) */}
      <div id="buscador">
        <SearchForm mobileExpanded={mobileExpanded} onMobileExpand={setMobileExpanded} onNavigate={onNavigate} />
      </div>
      <UserLocation mobileExpanded={mobileExpanded} />

      {/* Sección 2: Propiedades Destacadas */}
      <div className="bg-brand-light py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FeaturedSection onNavigate={onNavigate} />
        </div>
      </div>

      {/* Sección 3: Bloque para Propietarios (Consignación) */}
      <PropietariosBlock onNavigate={onNavigate} />

      {/* Sección 4: Servicios Principales */}
      <ServiciosBlock onNavigate={onNavigate} />

      {/* Sección 5: Bloque Institucional 60 años */}
      <TrayectoriaBlock onNavigate={onNavigate} />
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
        {currentPage === 'nosotros' && <InstitucionalPage onNavigate={handleNavigate} />}
        {currentPage === 'politicas' && <PoliticasPage />}
        {currentPage === 'terminos' && <TerminosPage />}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
