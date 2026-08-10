'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

function applyInkFill(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const size = Math.max(
    Math.hypot(x, y),
    Math.hypot(rect.width - x, y),
    Math.hypot(x, rect.height - y),
    Math.hypot(rect.width - x, rect.height - y),
  ) * 2;
  el.style.setProperty('--x', `${x}px`);
  el.style.setProperty('--y', `${y}px`);
  el.style.setProperty('--size', `${size}px`);
}

export type PageType = 'home' | 'propiedades' | 'consignacion' | 'hipotecas' | 'nosotros' | 'blog' | 'historia-60' | 'blog-article' | 'inversionistas' | 'politicas' | 'terminos';

interface HeaderProps { currentPage: PageType; onNavigate: (page: PageType, filter?: string) => void; isHeroPage?: boolean; darkHeader?: boolean; }
interface SubItem { label: string; page?: PageType; href?: string; filter?: string; }
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
    <a href="https://wa.me/573006557529?text=Hola%20%F0%9F%91%8B" target="_blank" rel="noopener noreferrer"
      className={`flex items-center justify-center w-[42px] h-[42px] rounded-full transition-all duration-500 ${
        isRed ? 'bg-brand-red shadow-[0_0_20px_rgba(243,39,53,0.6)]' : 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.3)]'
      }`}
      style={{ color: isRed ? 'white' : '#aa182c' }}>
      <img src={isRed ? "/icons/icon-whatsapp-white.svg" : "/icons/icon-whatsapp-red-dark.svg"} alt="WhatsApp" className="w-5 h-5" />
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
      className={`flex items-center justify-center w-[42px] h-[42px] rounded-full transition-all duration-500 ${
        isRed ? 'bg-brand-red shadow-[0_0_20px_rgba(243,39,53,0.6)]' : 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.3)]'
      }`}
      style={{ color: isRed ? 'white' : '#aa182c' }}>
      <img src={isRed ? "/icons/icon-credit-card-white.svg" : "/icons/icon-credit-card-red-dark.svg"} alt="Pagar" className="w-5.5 h-5.5" />
    </a>
  );
}

const navItems: NavItem[] = [
  { label: 'Inicio', page: 'home' },
  { label: 'Propiedades', page: 'propiedades', children: [
    { label: 'Arriendo', page: 'propiedades', filter: 'Arrendar' },
    { label: 'Comprar', page: 'propiedades', filter: 'Comprar' },
    { label: 'Para inversionistas', page: 'inversionistas' },
  ]},
  { label: 'Servicios', children: [
    { label: 'Solicitud de arrendamiento', href: SOLICITUD_ARRENDAMIENTO_URL },
    { label: 'Reportar reparación', href: REPARACIONES_URL },
    { label: 'Consigna tu inmueble', page: 'consignacion' },
  ]},
  { label: 'Nosotros', page: 'nosotros' as const, children: [
    { label: 'Quiénes somos', page: 'nosotros' },
    { label: 'Blog', page: 'blog' },
  ]},
];

function WhatsAppButton() {
  const [isRed, setIsRed] = useState(false);
  useEffect(() => {
    const i = setInterval(() => setIsRed(p => !p), 6000);
    return () => clearInterval(i);
  }, []);
  return (
    <a href="https://wa.me/573006557529?text=Hola%20%F0%9F%91%8B" target="_blank" rel="noopener noreferrer"
      className={`flex items-center gap-2 h-[42px] px-5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-500 ${
        isRed ? 'bg-brand-red shadow-[0_0_20px_rgba(243,39,53,0.6)]' : 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.3)]'
      }`}
      style={{ color: isRed ? 'white' : '#aa182c' }}>
      <img src={isRed ? "/icons/icon-whatsapp-white.svg" : "/icons/icon-whatsapp-red-dark.svg"} alt="WhatsApp" className="w-5 h-5" />
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
      className={`flex items-center gap-2 h-[42px] px-5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-500 ${
        isRed ? 'bg-brand-red shadow-[0_0_20px_rgba(243,39,53,0.6)]' : 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.3)]'
      }`}
      style={{ color: isRed ? 'white' : '#aa182c' }}
      aria-label="Pagar en línea por PSE"
    >
      <img src={isRed ? "/icons/icon-credit-card-white.svg" : "/icons/icon-credit-card-red-dark.svg"} alt="Pagar" className="w-[21px] h-[21px]" />
      <span>Pagar en línea</span>
    </a>
  );
}

export default function Header({ currentPage, onNavigate, isHeroPage = true, darkHeader = false }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (page: PageType, filter?: string) => {
    onNavigate(page, filter);
    setMobileOpen(false);
    setExpandedMobile(null);
    setScrolled(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Header siempre translúcido — Carbón 40% en todas las páginas
  const isDark = true;
  const headerTextColor = '#fff';
  const navBgColor      = 'rgba(255, 255, 255, 0.25)';
  const navBorderColor  = 'rgba(255, 255, 255, 0.25)';
  const activePillBg    = 'rgba(245,245,245,0.3)';
  const activePillText  = '#ffffff';

  return (
    <header className="fixed top-0 left-0 right-0"
      style={{
        zIndex: 50,
        backgroundColor: 'rgba(26, 26, 26, 0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        backfaceVisibility: 'hidden',
        height: '86px',
      }}>

      {/* ── Desktop lg: flex-1 nav | Desktop xl+: nav absoluta centrada como buscador ── */}
      <div className="hidden lg:flex items-center h-full px-4 lg:px-8 gap-4 xl:gap-0 xl:relative">
        {/* Logo — flujo normal izquierda; z-10 solo en xl donde la nav es absoluta */}
        <button onClick={() => handleNav('home')} className="shrink-0 xl:relative xl:z-10">
          <img src="/icons/Logotipo_Logoblanco.svg" alt="Arrendamientos Santa Fe" className="h-10 md:h-11 w-auto object-contain" />
        </button>

        {/* Nav — flex-1 en lg (sin solapamiento); absoluta centrada en xl+ */}
        <div className="flex-1 min-w-0 flex items-center justify-center xl:flex-none xl:absolute xl:inset-0 xl:px-8 xl:pointer-events-none">
          <nav className="flex items-center justify-between gap-1 rounded-full p-[3px] h-[42px] border shadow-lg w-full xl:pointer-events-auto"
            style={{
              maxWidth: '64rem',
              overflow: 'visible',
              backgroundColor: navBgColor,
              borderColor: navBorderColor,
              backdropFilter: 'blur(10px)',
            }}>
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="relative group flex-1">
                  {(() => {
                    const isActive = currentPage === item.page || item.children?.some(c => c.page === currentPage);
                    return (
                      <button
                        onClick={() => { if (item.page) handleNav(item.page); }}
                        onMouseEnter={e => { setHoveredNav(item.label); if (!isActive) applyInkFill(e); }}
                        onMouseLeave={e => { setHoveredNav(null); if (!isActive) applyInkFill(e); }}
                        className={isActive ? 'w-full px-2 py-2 rounded-full' : 'nav-ink-btn w-full px-2 py-2 rounded-full'}
                        style={{ fontFamily: "'Avenir LT Std', 'Outfit', system-ui, sans-serif", fontWeight: (isActive || hoveredNav === item.label) ? 700 : 300, fontSize: '15px', color: isActive ? activePillText : headerTextColor, background: isActive ? activePillBg : 'transparent', transition: 'background 0.2s ease, color 0.2s ease' }}
                      >
                        <span style={{ fontWeight: 'inherit' }}>{item.label}</span>
                      </button>
                    );
                  })()}
                  <div className="absolute top-full left-1/2 pt-[3px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                    style={{ transform: 'translateX(-50%)', zIndex: 60 }}>
                    <div className="bg-white rounded-2xl min-w-[230px] shadow-2xl border border-gray-100 overflow-hidden">
                      {item.children.map((sub) =>
                        sub.href ? (
                          <a key={sub.label} href={sub.href} target="_blank" rel="noopener noreferrer"
                            className="block w-full text-left px-5 py-2.5 text-[15px] text-gray-700 hover:text-white hover:bg-brand-red transition-colors duration-150"
                            style={{ fontFamily: "'Avenir LT Std', 'Outfit', system-ui, sans-serif", fontWeight: 300 }}>
                            {sub.label}
                          </a>
                        ) : (
                          <button key={sub.label} onClick={() => { if (sub.page) handleNav(sub.page, sub.filter); }}
                            className="block w-full text-left px-5 py-2.5 text-[15px] text-gray-600 hover:text-white hover:bg-brand-red transition-colors duration-150"
                            style={{ fontFamily: "'Avenir LT Std', 'Outfit', system-ui, sans-serif", fontWeight: 300 }}>
                            {sub.label}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                (() => {
                  const isActive = currentPage === item.page;
                  return (
                    <button key={item.label} onClick={() => handleNav(item.page || 'home')}
                      onMouseEnter={e => { setHoveredNav(item.label); if (!isActive) applyInkFill(e); }}
                      onMouseLeave={e => { setHoveredNav(null); if (!isActive) applyInkFill(e); }}
                      className={isActive ? 'flex-1 px-2 py-2 rounded-full' : 'nav-ink-btn flex-1 px-2 py-2 rounded-full'}
                      style={{ fontFamily: "'Avenir LT Std', 'Outfit', system-ui, sans-serif", fontWeight: (isActive || hoveredNav === item.label) ? 700 : 300, fontSize: '15px', color: isActive ? activePillText : headerTextColor, background: isActive ? activePillBg : 'transparent', transition: 'background 0.2s ease, color 0.2s ease' }}>
                      <span style={{ fontWeight: 'inherit' }}>{item.label}</span>
                    </button>
                  );
                })()
              )
            )}
          </nav>
        </div>

        {/* Botones — flujo normal en lg; ml-auto + z-10 en xl donde la nav es absoluta */}
        <div className="flex items-center gap-2 shrink-0 xl:ml-auto xl:relative xl:z-10">
          <WhatsAppButton />
          <PSEButton />
        </div>
      </div>

      {/* ── Mobile: logo absoluto + iconos derecha ────────── */}
      <button onClick={() => handleNav('home')} className="lg:hidden absolute top-1/2 -translate-y-1/2 left-4 sm:left-6">
        <img src="/icons/Logotipo_Logoblanco.svg" alt="Arrendamientos Santa Fe" className="h-9 w-auto object-contain" />
      </button>

      <div className="flex lg:hidden items-center h-full px-4 sm:px-6">
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <MobileWhatsAppButton />
          <MobilePSEButton />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="p-1.5 hover:bg-white/10 rounded-full transition-colors" style={{ color: headerTextColor }} aria-label="Abrir menú">
                <img src={isDark ? "/icons/icon-menu-white.svg" : "/icons/icon-menu-black.svg"} alt="Menú" className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(90vw,320px)] bg-brand-dark border-brand-dark-secondary p-0">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <img src="/icons/Logotipo_Logoblanco.svg" alt="Arrendamientos Santa Fe" className="h-8 w-auto object-contain" />
                  <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white" aria-label="Cerrar menú">
                    <img src="/icons/icon-close-white.svg" alt="Cerrar" className="h-5 w-5" />
                  </button>
                </div>
                <nav className="flex flex-col p-3 gap-0.5 flex-1 overflow-y-auto">
                  {navItems.map((item) => (
                    <div key={item.label}>
                      <button
                        onClick={() => { if (item.children) setExpandedMobile(expandedMobile === item.label ? null : item.label); else if (item.page) handleNav(item.page); }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 ${currentPage === item.page ? 'bg-[#f5f5f5] text-[#1a1a1a]' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                        style={{ fontFamily: "'Avenir LT Std', 'Outfit', system-ui, sans-serif", fontWeight: currentPage === item.page ? 700 : 300 }}>
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
                                className="block w-full text-left px-4 py-3 text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200"
                                style={{ fontFamily: "'Avenir LT Std', 'Outfit', system-ui, sans-serif", fontWeight: 300 }}
                              >
                                {sub.label}
                              </a>
                            ) : (
                              <button key={sub.label} onClick={() => { if (sub.page) handleNav(sub.page, sub.filter); }}
                                className="w-full text-left px-4 py-1.5 text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200"
                                style={{ fontFamily: "'Avenir LT Std', 'Outfit', system-ui, sans-serif", fontWeight: 300 }}>
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
