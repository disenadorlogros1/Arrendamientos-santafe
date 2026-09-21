'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropiedadesPage from '@/components/PropiedadesPage';
import { navigate } from '@/lib/navigate';
import type { InitialSearchParams } from '@/components/PropiedadesPage';

export default function PropiedadesShell() {
  const [initialFilter, setInitialFilter] = useState<'Todos' | 'Arrendar' | 'Comprar'>('Todos');
  const [initialQueString, setInitialQueString] = useState('');
  const [initialParams, setInitialParams] = useState<InitialSearchParams | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setInitialQueString(decodeURIComponent(q));

    // Filtros que llegan desde el buscador del home
    const negocio = params.get('negocio');
    const negocioParam = negocio === 'Arrendar' || negocio === 'Comprar' ? negocio : null;
    const found: InitialSearchParams = {};
    const codigo = params.get('codigo');
    const sectores = params.getAll('sector');
    const tipoprop = params.get('tipoprop');
    if (codigo) found.codigo = codigo;
    if (sectores.length) found.sector = sectores;
    if (tipoprop) found.tipoPropiedad = tipoprop;
    if (params.get('pmin') !== null && Number.isFinite(Number(params.get('pmin')))) found.precioMin = Number(params.get('pmin'));
    if (params.get('pmax') !== null && Number.isFinite(Number(params.get('pmax')))) found.precioMax = Number(params.get('pmax'));
    if (Object.keys(found).length) setInitialParams(found);

    const readHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#arrendar') setInitialFilter('Arrendar');
      else if (hash === '#comprar') setInitialFilter('Comprar');
      else setInitialFilter(negocioParam ?? 'Todos');
    };

    readHash();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="propiedades" onNavigate={navigate} />
      <main className="flex-1 relative" style={{ paddingTop: '86px' }}>
        <PropiedadesPage initialFilter={initialFilter} initialQueString={initialQueString} initialParams={initialParams} />
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}