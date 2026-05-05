'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

export type PageType =
  | 'home'
  | 'propiedades'
  | 'consignacion'
  | 'hipotecas'
  | 'servicios'
  | 'nosotros';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

interface SubItem {
  label: string;
  page?: PageType;
}

interface NavItem {
  label: string;
  page?: PageType;
  children?: SubItem[];
}

const navItems: NavItem[] = [
  { label: 'Inicio', page: 'home' },
  {
    label: 'Propiedades',
    page: 'propiedades',
    children: [
      { label: 'Buscar propiedades', page: 'propiedades' },
      { label: 'Arrendar', page: 'propiedades' },
      { label: 'Comprar', page: 'propiedades' },
    ],
  },
  {
    label: 'Consignación',
    page: 'consignacion',
    children: [
      { label: 'Beneficios', page: 'consignacion' },
      { label: 'Proceso', page: 'consignacion' },
    ],
  },
  {
    label: 'Hipotecas',
    page: 'hipotecas',
    children: [
      { label: 'Calculadora', page: 'hipotecas' },
      { label: 'Requisitos', page: 'hipotecas' },
    ],
  },
  {
    label: 'Servicios',
    page: 'servicios',
    children: [
      { label: 'Pagar en línea' },
      { label: 'Solicitud de arrendamiento' },
      { label: 'Reparaciones' },
    ],
  },
  {
    label: 'Nosotros',
    page: 'nosotros',
    children: [
      { label: 'Quiénes somos', page: 'nosotros' },
      { label: '60 años', page: 'nosotros' },
      { label: 'Blog' },
      { label: 'Contacto', page: 'nosotros' },
    ],
  },
];

function WhatsAppButton() {
  const [isRed, setIsRed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRed((prev) => !prev);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <a
      href="https://wa.me/573000000000"
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-700 ease-in-out whitespace-nowrap ${
        isRed
          ? 'bg-brand-red text-white shadow-[0_0_20px_rgba(207,10,44,0.6)]'
          : 'bg-white text-brand-red shadow-[0_0_12px_rgba(255,255,255,0.3)]'
      }`}
    >
      <img
        src={isRed ? '/wpp-rojo.gif' : '/wpp-blanco.gif'}
        alt="WhatsApp"
        className="w-5 h-5"
      />
      <span>WhatsApp</span>
    </a>
  );
}

function DropdownItem({ item, onNavigate }: { item: NavItem; onNavigate: (page: PageType) => void }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  const handleSubClick = (sub: SubItem) => {
    if (sub.page) {
      onNavigate(sub.page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isActive = item.page !== undefined;

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => {
          if (isActive && !item.children) {
            onNavigate(item.page!);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white whitespace-nowrap transition-all duration-300 hover:-translate-y-0.5"
      >
        {item.label}
        {item.children && (
          <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        )}
      </button>

      {item.children && open && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="bg-brand-dark/95 backdrop-blur-md border border-white/10 rounded-xl py-2 min-w-[200px] shadow-2xl">
            {item.children.map((sub) => (
              <button
                key={sub.label}
                onClick={() => handleSubClick(sub)}
                className="w-full text-left px-5 py-2.5 text-sm text-white/80 hover:text-white hover:bg-brand-red/80 transition-all duration-200 first:rounded-t-xl last:rounded-b-xl"
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
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
      <div className="mx-auto max-w-6xl">
        {/* Main capsule */}
        <div className="flex items-center justify-between bg-brand-dark/60 backdrop-blur-md rounded-full px-3 py-2 border border-white/10 shadow-lg">
          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center pl-2 pr-3"
          >
            <img
              src="/logo-blanco.png"
              alt="Santa Fé"
              className="h-8 md:h-9 w-auto object-contain"
            />
          </button>

          {/* Divider */}
          <div className="hidden lg:block w-px h-6 bg-white/20" />

          {/* Desktop Nav inside capsule */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <DropdownItem
                key={item.label}
                item={item}
                onNavigate={handleNav}
              />
            ))}
          </nav>

          {/* WhatsApp + Mobile Toggle */}
          <div className="flex items-center gap-2 ml-2">
            {/* Desktop WhatsApp */}
            <div className="hidden lg:block">
              <WhatsAppButton />
            </div>

            {/* Mobile Hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
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
                          onClick={() => {
                            if (item.children) {
                              setExpandedMobile(expandedMobile === item.label ? null : item.label);
                            } else if (item.page) {
                              handleNav(item.page);
                            }
                          }}
                          className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            currentPage === item.page ? 'bg-brand-red text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {item.label}
                          {item.children && (
                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expandedMobile === item.label ? 'rotate-180' : ''}`} />
                          )}
                        </button>
                        {item.children && expandedMobile === item.label && (
                          <div className="pl-6 pb-2 space-y-0.5">
                            {item.children.map((sub) => (
                              <button
                                key={sub.label}
                                onClick={() => { if (sub.page) handleNav(sub.page); }}
                                className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200"
                              >
                                {sub.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>

                  <div className="p-4 border-t border-white/10">
                    <WhatsAppButton />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
