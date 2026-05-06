'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

export type PageType = 'home' | 'propiedades' | 'consignacion' | 'hipotecas' | 'servicios' | 'nosotros';

interface HeaderProps { currentPage: PageType; onNavigate: (page: PageType) => void; }
interface SubItem { label: string; page?: PageType; }
interface NavItem { label: string; page?: PageType; children?: SubItem[]; }

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
    { label: 'Pagar en línea' },
    { label: 'Solicitud de arrendamiento' },
    { label: 'Reparaciones' },
  ]},
  { label: 'Nosotros', page: 'nosotros', children: [
    { label: 'Quiénes somos', page: 'nosotros' },
    { label: '60 años', page: 'nosotros' },
    { label: 'Blog' },
    { label: 'Contacto', page: 'nosotros' },
  ]},
];

function WhatsAppButton() {
  const [isRed, setIsRed] = useState(false);
  useEffect(() => {
    const i = setInterval(() => setIsRed(p => !p), 10000);
    return () => clearInterval(i);
  }, []);
  return (
    <a href="https://wa.me/573000000000" target="_blank" rel="noopener noreferrer"
      className={`flex items-center gap-2 h-[42px] px-5 rounded-full text-sm font-semibold transition-all duration-700 ease-in-out whitespace-nowrap ${
        isRed ? 'bg-brand-red text-white shadow-[0_0_20px_rgba(207,10,44,0.6)]' : 'bg-white text-brand-red shadow-[0_0_12px_rgba(255,255,255,0.3)]'
      }`}>
      <img src={isRed ? '/wpp-blanco.gif' : '/wpp-rojo.gif'} alt="WhatsApp" className="w-5 h-5" />
      <span>WhatsApp</span>
    </a>
  );
}

/* NavDropdown con dropdown via Portal — escapa de TODOS los contextos de apilamiento */
function NavDropdown({ item, onNavigate }: { item: NavItem; onNavigate: (page: PageType) => void }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => { setMounted(true); }, []);

  const updatePos = useCallback(() => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ top: r.bottom, left: r.left + r.width / 2 });
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    updatePos();
    setOpen(true);
  }, [updatePos]);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), 300);
  }, []);

  const handleSubClick = useCallback((sub: SubItem) => {
    if (sub.page) { onNavigate(sub.page); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    setOpen(false);
  }, [onNavigate]);

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  // Cerrar al click fuera
  useEffect(() => {
    if (!open) return;
    const outside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(t) && triggerRef.current && !triggerRef.current.contains(t)) setOpen(false);
    };
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, [open]);

  const dropdownContent = item.children && open ? (
    <div
      ref={dropdownRef}
      onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }}
      onMouseLeave={handleMouseLeave}
      className="bg-white rounded-2xl pt-2 pb-1 min-w-[210px] shadow-xl border border-gray-100"
      style={{
        position: 'fixed',
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        transform: 'translateX(-50%)',
        zIndex: 99999,
      }}
    >
      {item.children.map((sub) => (
        <button
          key={sub.label}
          onClick={() => handleSubClick(sub)}
          className="w-full text-left px-5 py-2 text-base text-brand-dark/70 hover:text-white hover:bg-brand-red transition-all duration-200 first:rounded-t-2xl last:rounded-b-2xl"
        >
          {sub.label}
        </button>
      ))}
    </div>
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => { if (item.page && !item.children) { onNavigate(item.page); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
        className="px-5 py-2 text-sm font-medium text-white rounded-full transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-110 hover:bg-brand-red hover:text-white hover:shadow-[0_0_24px_rgba(207,10,44,0.7),0_0_48px_rgba(207,10,44,0.3)]"
        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
      >
        {item.label}
      </button>

      {/* Dropdown portalizado al body — escapa del contexto z-50 del header */}
      {mounted && dropdownContent && createPortal(dropdownContent, document.body)}
    </>
  );
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  const handleNav = (page: PageType) => {
    onNavigate(page);
    setMobileOpen(false);
    setExpandedMobile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
        {/* Logo */}
        <button onClick={() => handleNav('home')} className="shrink-0">
          <img src="/logo-blanco.png" alt="Santa Fé Arrendamientos" className="h-10 md:h-11 w-auto object-contain drop-shadow-lg" />
        </button>

        {/* Nav capsula */}
        <nav className="hidden lg:flex items-center gap-0.5 bg-white/50 backdrop-blur-md rounded-full px-2 h-[42px] border border-white/30 shadow-lg">
          {navItems.map((item) => (
            <NavDropdown key={item.label} item={item} onNavigate={handleNav} />
          ))}
        </nav>

        {/* WhatsApp desktop */}
        <div className="hidden lg:block shrink-0"><WhatsAppButton /></div>

        {/* Mobile */}
        <div className="flex items-center gap-3 lg:hidden">
          <WhatsAppButton />
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
                  <img src="/logo-blanco.png" alt="Santa Fé" className="h-8 w-auto object-contain" />
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
                          {item.children.map((sub) => (
                            <button key={sub.label} onClick={() => { if (sub.page) handleNav(sub.page); }}
                              className="w-full text-left px-4 py-1.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200">
                              {sub.label}
                            </button>
                          ))}
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
