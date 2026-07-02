'use client';

import { useState, useEffect } from 'react';
import { type PageType } from '@/components/Header';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import SearchForm from '@/components/SearchForm';
import FeaturedSection from '@/components/FeaturedSection';
import PropietariosBlock from '@/components/PropietariosBlock';
import ServiciosBlock from '@/components/ServiciosBlock';
import TrayectoriaBlock from '@/components/TrayectoriaBlock';
import ScrollReveal from '@/components/ScrollReveal';
import PropiedadesPage from '@/components/PropiedadesPage';
import ConsignacionPage from '@/components/ConsignacionPage';
import HipotecasPage from '@/components/HipotecasPage';
import InstitucionalPage from '@/components/InstitucionalPage';
import BlogPage from '@/components/BlogPage';
import Historia60Page from '@/components/Historia60Page';
import BlogArticlePage from '@/components/BlogArticlePage';
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

      {/* Sección 2: Propiedades Destacadas */}
      <div style={{ marginTop: '35px' }}>
        <ScrollReveal y={50} start="top 90%">
          <FeaturedSection onNavigate={onNavigate} />
        </ScrollReveal>
      </div>

      {/* Sección 3: Bloque para Propietarios (Consignación) */}
      <div style={{ marginTop: '35px' }}>
        <PropietariosBlock onNavigate={onNavigate} />
      </div>

      {/* Sección 4: Servicios Principales */}
      <div style={{ marginTop: '35px' }}>
        <ScrollReveal y={40} start="top 88%">
          <ServiciosBlock onNavigate={onNavigate} />
        </ScrollReveal>
      </div>

      {/* Sección 5: Bloque Institucional 60 años */}
      <div style={{ marginTop: '35px' }}>
        <ScrollReveal y={40} start="top 88%">
          <TrayectoriaBlock onNavigate={onNavigate} />
        </ScrollReveal>
      </div>
    </>
  );
}

const VALID_PAGES: PageType[] = ['home', 'propiedades', 'consignacion', 'hipotecas', 'nosotros', 'blog', 'historia-60', 'blog-article', 'inversionistas', 'politicas', 'terminos'];

function pageFromHash(hash: string): { page: PageType; filter: 'Todos' | 'Arrendar' | 'Comprar' } {
  if (hash === 'propiedades-arrendar') return { page: 'propiedades', filter: 'Arrendar' };
  if (hash === 'propiedades-comprar') return { page: 'propiedades', filter: 'Comprar' };
  const page = VALID_PAGES.includes(hash as PageType) ? (hash as PageType) : 'home';
  return { page, filter: 'Todos' };
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [articleId, setArticleId] = useState<number>(0);
  const [propiedadesFilter, setPropiedadesFilter] = useState<'Todos' | 'Arrendar' | 'Comprar'>('Todos');

  const handleNavigate = (page: PageType, filter?: string) => {
    const f = (filter as 'Todos' | 'Arrendar' | 'Comprar') || 'Todos';
    setCurrentPage(page);
    if (page === 'propiedades') {
      setPropiedadesFilter(f);
      const suffix = f === 'Arrendar' ? '-arrendar' : f === 'Comprar' ? '-comprar' : '';
      window.history.pushState({ page, filter: f }, '', `#propiedades${suffix}`);
    } else if (page === 'home') {
      setPropiedadesFilter('Todos');
      window.history.pushState({ page }, '', '/');
    } else {
      window.history.pushState({ page }, '', `#${page}`);
    }
  };

  const handleOpenArticle = (id: number) => {
    setArticleId(id);
    setCurrentPage('blog-article');
    window.history.pushState({ page: 'blog-article', articleId: id }, '', '#blog-article');
  };

  // Restore page from hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const { page, filter } = pageFromHash(hash);
    setCurrentPage(page);
    setPropiedadesFilter(filter);
  }, []);

  // Browser back/forward
  useEffect(() => {
    const onPopState = () => {
      const hash = window.location.hash.slice(1);
      const { page, filter } = pageFromHash(hash);
      setCurrentPage(page);
      setPropiedadesFilter(filter);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} onNavigate={handleNavigate} isHeroPage={true} />

      <main className="flex-1 relative" style={{ paddingTop: currentPage === 'home' ? 0 : '86px' }}>
        <div key={currentPage} className="page-fade-in">
          {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
          {currentPage === 'propiedades' && <PropiedadesPage initialFilter={propiedadesFilter} />}
          {currentPage === 'consignacion' && <ConsignacionPage onNavigate={handleNavigate} />}
          {currentPage === 'hipotecas' && <HipotecasPage />}
          {currentPage === 'nosotros' && <InstitucionalPage onNavigate={handleNavigate} />}
          {currentPage === 'blog' && <BlogPage onNavigate={handleNavigate} onOpenArticle={handleOpenArticle} />}
          {currentPage === 'blog-article' && <BlogArticlePage articleId={articleId} onNavigate={handleNavigate} />}
          {currentPage === 'historia-60' && <Historia60Page onNavigate={handleNavigate} />}
          {currentPage === 'inversionistas' && <InversionistasPage />}
          {currentPage === 'politicas' && <PoliticasPage />}
          {currentPage === 'terminos' && <TerminosPage />}
        </div>
      </main>

      <div style={{ marginTop: currentPage === 'home' ? '35px' : 0 }}>
        <Footer onNavigate={handleNavigate} />
      </div>
    </div>
  );
}
