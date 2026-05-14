'use client';

import { useState, useEffect } from 'react';
import { Menu, X, CreditCard } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

export type PageType = 'home' | 'propiedades' | 'consignacion' | 'hipotecas' | 'servicios' | 'nosotros' | 'politicas' | 'terminos';

interface HeaderProps { currentPage: PageType; onNavigate: (page: PageType) => void; }
interface SubItem { label: string; page?: PageType; href?: string; }
interface NavItem { label: string; page?: PageType; children?: SubItem[]; }

const PSE_URL = 'https://www.psepagos.co/PSEHostingUI/ShowTicketOffice.aspx?ID=9011';
const SOLICITUD_ARRENDAMIENTO_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfAg9SMibueBBUy-Pe1rQuO1Rz7U4z7z9uq91pv-gp-0-dCgQ/viewform';
const REPARACIONES_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdwCAaLU5ApyfAvf-yEEgj-fMQmnBRIh4614LhDIWtKhBDzyQ/viewform';

function MobileWhatsAppButton() {
  const [isRed, setIsRed] = useState(false);
  useEffect(() => {
    const i = setInterval(() => setIsRed(p => !p), 5000);
    return () => clearInterval(i);
  }, []);
  return (
    <a href="https://wa.me/573006557529?text=Hola%2C%20quisiera%20hablar%20con%20un%20asesor%20de%20Arrendamientos%20Santa%20Fe." target="_blank" rel="noopener noreferrer"
      className={`flex items-center justify-center w-[42px] h-[42px] rounded-full text-white transition-all duration-500 ${
        isRed ? 'bg-brand-red shadow-[0_0_20px_rgba(243,39,53,0.6)]' : 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.3)]'
      }`}
      style={{ color: isRed ? 'white' : '#232222' }}>
      <img src={isRed ? '/wpp-blanco.gif' : '/wpp-blanco.gif'} alt="WhatsApp" className="w-5 h-5" />
    </a>
  );
}

function MobilePSEButton() {
  const [isRed, setIsRed] = useState(false);
  useEffect(() => {
    const i = setInterval(() => setIsRed(p => !p), 5000);
    return () => clearInterval(i);
  }, []);
  return (
    <a href="https://www.psepagos.co/PSEHostingUI/ShowTicketOffice.aspx?ID=9011" target="_blank" rel="noopener noreferrer"
      className={`flex items-center justify-center w-[42px] h-[42px] rounded-full text-white transition-all duration-500 ${
        isRed ? 'bg-brand-red shadow-[0_0_20px_rgba(243,39,53,0.6)]' : 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.3)]'
      }`}
      style={{ color: isRed ? 'white' : '#232222' }}>
      <CreditCard className="w-5 h-5" />
    </a>
  );
}

const navItems: NavItem[] = [
  { label: 'Inicio', page: 'home' },
  { label: 'Propiedades', page: 'propiedades', children: [
    { label: 'Buscar propiedades', page: 'propiedades' },
    { label: 'Arrendar', page: 'propiedades' },
    { label: 'Comprar', page: 'propiedades' },
  ]},
  { label: 'Consignación', page: 'consignacion', children: [
    { label: 'Beneficios', page: 'consignacion' },
    { label: 'Proceso', page: 'consignacion' },
  ]},
  { label: 'Hipotecas', page: 'hipotecas', children: [
    { label: 'Calculadora', page: 'hipotecas' },
    { label: 'Requisitos', page: 'hipotecas' },
  ]},
  { label: 'Servicios', page: 'servicios', children: [
    { label: 'Todos los servicios', page: 'servicios' },
    { label: 'Pagar en línea', href: PSE_URL },
    { label: 'Solicitud de arrendamiento', href: SOLICITUD_ARRENDAMIENTO_URL },
    { label: 'Reportar reparación', href: REPARACIONES_URL },
  ]},
  { label: 'Nosotros', page: 'nosotros', children: [
    { label: 'Quiénes somos', page: 'nosotros' },
    { label: '60 años', page: 'nosotros' },
  ]},
];

function WhatsAppButton() {
  const [isRed, setIsRed] = useState(false);
  useEffect(() => {
    const i = setInterval(() => setIsRed(p => !p), 6000);
    return () => clearInterval(i);
  }, []);
  return (
    <a href="https://wa.me/573006557529?text=Hola%2C%20quisiera%20hablar%20con%20un%20asesor%20de%20Arrendamientos%20Santa%20Fe." target="_blank" rel="noopener noreferrer"
      className={`flex items-center gap-2 h-[42px] px-5 rounded-full text-sm font-semibold whitespace-nowrap text-white transition-all duration-500 ${
        isRed ? 'bg-brand-red shadow-[0_0_20px_rgba(243,39,53,0.6)]' : 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.3)]'
      }`}
      style={{ color: isRed ? 'white' : '#232222' }}>
      <img src={isRed ? '/wpp-blanco.gif' : '/wpp-blanco.gif'} alt="WhatsApp" className="w-5 h-5" />
      <span>WhatsApp</span>
    </a>
  );
}

function PSEButton() {
  const [isRed, setIsRed] = useState(false);
  useEffect(() => {
    const i = setInterval(() => setIsRed(p => !p), 6000);
    return () => clearInterval(i);
  }, []);
  return (
    <a
      href="https://www.psepagos.co/PSEHostingUI/ShowTicketOffice.aspx?ID=9011"
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 h-[42px] px-5 rounded-full text-sm font-semibold whitespace-nowrap text-white transition-all duration-500 ${
        isRed ? 'bg-brand-red shadow-[0_0_20px_rgba(243,39,53,0.6)]' : 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.3)]'
      }`}
      style={{ color: isRed ? 'white' : '#232222' }}
      aria-label="Pagar en línea por PSE"
    >
      <CreditCard className="w-4 h-4" />
      <span>Pagar en línea</span>
    </a>
  );
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (page: PageType) => {
    onNavigate(page);
    setMobileOpen(false);
    setExpandedMobile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 pt-4 pb-3 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${scrolled ? 'header-scrolled' : ''}`}
      style={{ zIndex: 50 }}>
      <div className="flex items-center justify-between gap-4 h-[58px]">
        {/* Logo — extremo izquierdo */}
        <button onClick={() => handleNav('home')} className="shrink-0">
          <img src="/logo-blanco.png" alt="Arrendamientos Santa Fe" className="h-10 md:h-11 w-auto object-contain drop-shadow-lg" />
        </button>

        {/* Nav capsula — centrada con max-width de SearchForm */}
        <nav className="hidden lg:flex items-center justify-between gap-1 bg-white/40 backdrop-blur-sm rounded-full px-2 h-[42px] border border-white/30 shadow-lg"
          style={{ overflow: 'visible', width: '100%', maxWidth: '64rem' }}>
          {navItems.map((item) =>
            item.children ? (
              /* Item con dropdown — CSS puro, sin JS */
              <div key={item.label} className="relative group flex-1">
                <button
                  className="w-full px-2 py-2 text-sm font-medium text-white rounded-full transition-all duration-300 ease-out hover:bg-brand-red"
                >
                  {item.label}
                </button>
                {/* Dropdown CSS — se muestra con group-hover */}
                <div className="absolute top-full left-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  style={{ transform: 'translateX(-50%)', zIndex: 60 }}>
                  <div className="bg-white rounded-2xl pt-2 pb-1 min-w-[230px] shadow-2xl border border-gray-100">
                    {item.children.map((sub) =>
                      sub.href ? (
                        <a
                          key={sub.label}
                          href={sub.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-left px-5 py-2.5 text-[15px] text-gray-700 hover:text-white hover:bg-brand-red transition-colors duration-150 first:rounded-t-2xl last:rounded-b-2xl"
                        >
                          {sub.label}
                        </a>
                      ) : (
                        <button
                          key={sub.label}
                          onClick={() => {
                            if (sub.page) handleNav(sub.page);
                          }}
                          className="block w-full text-left px-5 py-2.5 text-[15px] text-gray-700 hover:text-white hover:bg-brand-red transition-colors duration-150 first:rounded-t-2xl last:rounded-b-2xl"
                        >
                          {sub.label}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Item sin dropdown — click navega */
              <button
                key={item.label}
                onClick={() => handleNav(item.page || 'home')}
                className={`flex-1 px-2 py-2 text-sm font-medium text-white rounded-full transition-all duration-300 ease-out hover:bg-brand-red ${
                  currentPage === item.page ? 'text-white' : 'text-white'
                }`}
              >
                {item.label}
              </button>
            )
          )}
        </nav>

        {/* WhatsApp + PSE desktop */}
        <div className="hidden lg:flex shrink-0 items-center gap-2">
          <WhatsAppButton />
          <PSEButton />
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile WhatsApp: Icono, alterna cada 5 segundos */}
          <MobileWhatsAppButton />
          {/* Mobile PSE: Icono, alterna cada 5 segundos */}
          <MobilePSEButton />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="text-white p-1.5 hover:bg-white/10 rounded-full transition-colors" aria-label="Abrir menú">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-brand-dark border-brand-dark-secondary p-0">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <img src="/logo-blanco.png" alt="Arrendamientos Santa Fe" className="h-8 w-auto object-contain" />
                  <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white" aria-label="Cerrar menú">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="flex flex-col p-3 gap-0.5 flex-1 overflow-y-auto">
                  {navItems.map((item) => (
                    <div key={item.label}>
                      <button
                        onClick={() => { if (item.children) setExpandedMobile(expandedMobile === item.label ? null : item.label); else if (item.page) handleNav(item.page); }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${currentPage === item.page ? 'bg-brand-red text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                        {item.label}
                      </button>
                      {item.children && expandedMobile === item.label && (
                        <div className="pl-6 pb-1 space-y-0">
                          {item.children.map((sub) =>
                            sub.href ? (
                              <a
                                key={sub.label}
                                href={sub.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-left px-4 py-1.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200"
                              >
                                {sub.label}
                              </a>
                            ) : (
                              <button key={sub.label} onClick={() => { if (sub.page) handleNav(sub.page); }}
                                className="w-full text-left px-4 py-1.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200">
                                {sub.label}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
