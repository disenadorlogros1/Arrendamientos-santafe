'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, X, MessageCircle, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

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
  {
    label: 'Inicio',
    page: 'home',
  },
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

function DropdownItem({ item, onNavigate, onClose }: { item: NavItem; onNavigate: (page: PageType) => void; onClose: () => void }) {
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
      onClose();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => {
          if (item.page && !item.children) {
            onNavigate(item.page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium
          bg-white/50 text-white
          transition-all duration-300 ease-out
          hover:-translate-y-1
          hover:bg-brand-red hover:text-white hover:shadow-[0_0_16px_rgba(207,10,44,0.6)]"
      >
        {item.label}
        {item.children && (
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        )}
      </button>

      {/* Dropdown */}
      {item.children && open && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="bg-brand-dark/95 backdrop-blur-md border border-white/10 rounded-2xl py-2 min-w-[200px] shadow-2xl">
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
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-18 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 group"
          >
            <img
              src="/logo-blanco.png"
              alt="Santa Fé Arrendamientos"
              className="h-9 md:h-10 w-auto object-contain"
            />
          </button>

          {/* Desktop Nav - Capsule style */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <DropdownItem
                key={item.label}
                item={item}
                onNavigate={handleNav}
                onClose={() => {}}
              />
            ))}
          </nav>

          {/* WhatsApp Button (desktop) */}
          <Button
            asChild
            className="hidden lg:flex items-center gap-2 bg-brand-red text-white hover:bg-brand-red-light rounded-full px-5 font-medium
              shadow-[0_0_12px_rgba(207,10,44,0.4)] hover:shadow-[0_0_24px_rgba(207,10,44,0.7)]
              transition-all duration-300 hover:-translate-y-1"
          >
            <a
              href="https://wa.me/573000000000"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4 fill-white" />
              WhatsApp
            </a>
          </Button>

          {/* Mobile Hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <button className="text-white p-2" aria-label="Abrir menú">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-brand-dark border-brand-dark-secondary p-0">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Mobile header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <img
                    src="/logo-blanco.png"
                    alt="Santa Fé"
                    className="h-8 w-auto object-contain"
                  />
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="text-white/60 hover:text-white"
                    aria-label="Cerrar menú"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile Nav Items with accordion */}
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
                          currentPage === item.page
                            ? 'bg-brand-red text-white'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {item.label}
                        {item.children && (
                          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expandedMobile === item.label ? 'rotate-180' : ''}`} />
                        )}
                      </button>

                      {/* Mobile sub-items */}
                      {item.children && expandedMobile === item.label && (
                        <div className="pl-6 pb-2 space-y-0.5">
                          {item.children.map((sub) => (
                            <button
                              key={sub.label}
                              onClick={() => {
                                if (sub.page) {
                                  handleNav(sub.page);
                                }
                              }}
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

                {/* Mobile WhatsApp */}
                <div className="p-4 border-t border-white/10">
                  <Button
                    asChild
                    className="w-full flex items-center justify-center gap-2 bg-brand-red text-white hover:bg-brand-red-light rounded-full font-medium shadow-lg"
                  >
                    <a
                      href="https://wa.me/573000000000"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4 fill-white" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
