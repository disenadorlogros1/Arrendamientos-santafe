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
import ScrollReveal from '@/components/ScrollReveal';
import PropiedadesPage from '@/components/PropiedadesPage';
import ConsignacionPage from '@/components/ConsignacionPage';
import HipotecasPage from '@/components/HipotecasPage';
import ServiciosPage from '@/components/ServiciosPage';
import InstitucionalPage from '@/components/InstitucionalPage';
import BlogPage from '@/components/BlogPage';
import InversionistasPage from '@/components/InversionistasPage';
import PoliticasPage from '@/components/PoliticasPage';
import TerminosPage from '@/components/TerminosPage';

function HomePage({ onNavigate }: { onNavigate: (page: PageType) => void }) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  return (
    <>
      {/* Sección 1: Hero + Buscador integrado como celda bento */}
      <HeroSection
        onNavigate={onNavigate}
        searchFormSlot={
          <SearchForm
            mobileExpanded={mobileExpanded}
            onMobileExpand={setMobileExpanded}
            onNavigate={onNavigate}
          />
        }
      />
      <UserLocation mobileExpanded={mobileExpanded} />

      {/* Sección 2: Propiedades Destacadas */}
      <ScrollReveal y={50} start="top 90%">
        <FeaturedSection onNavigate={onNavigate} />
      </ScrollReveal>

      {/* Sección 3: Bloque para Propietarios (Consignación) */}
      <ScrollReveal y={40} start="top 88%">
        <PropietariosBlock onNavigate={onNavigate} />
      </ScrollReveal>

      {/* Sección 4: Servicios Principales */}
      <ScrollReveal y={40} start="top 88%">
        <ServiciosBlock onNavigate={onNavigate} />
      </ScrollReveal>

      {/* Sección 5: Bloque Institucional 60 años */}
      <ScrollReveal y={40} start="top 88%">
        <TrayectoriaBlock onNavigate={onNavigate} />
      </ScrollReveal>
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
        {currentPage === 'blog' && <BlogPage />}
        {currentPage === 'inversionistas' && <InversionistasPage />}
        {currentPage === 'politicas' && <PoliticasPage />}
        {currentPage === 'terminos' && <TerminosPage />}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
