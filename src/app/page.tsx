'use client';

import { useState, useEffect, useRef } from 'react';
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
import BlogPage from '@/components/BlogPage';
import InversionistasPage from '@/components/InversionistasPage';
import PoliticasPage from '@/components/PoliticasPage';
import TerminosPage from '@/components/TerminosPage';

function HomePage({ onNavigate }: { onNavigate: (page: PageType) => void }) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState(0);
  const [totalHeight, setTotalHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScroll(scrollY);

      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.transform = `translateY(-${scrollY}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Contenedor Fixed con Parallax */}
      <div
        ref={scrollContainerRef}
        style={{
          width: '100%',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 0,
        }}
      >
        {/* Sección 1: Hero Principal como Header Parallax */}
        <HeroSection onNavigate={onNavigate} />
      </div>

      {/* Contenido que se desplaza sobre el header */}
      <div style={{ position: 'relative', zIndex: 10 }}>
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
      </div>

      {/* Espaciador para permitir scroll sobre el header */}
      <div style={{ height: 'calc(100vh + 1000px)', backgroundColor: 'transparent' }} />
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
