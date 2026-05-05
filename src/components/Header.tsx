'use client';

import { useState } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { navItems, type PageType } from '@/data/properties';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: PageType) => {
    onNavigate(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-18 items-center justify-between">
          {/* Logo - White version for dark background */}
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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  currentPage === item.page
                    ? 'bg-white text-brand-red'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* WhatsApp Button (desktop) */}
          <Button
            asChild
            className="hidden md:flex items-center gap-2 bg-white text-brand-red hover:bg-white/90 rounded-full px-5 font-medium"
          >
            <a
              href="https://wa.me/573000000000"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4 fill-brand-red" />
              WhatsApp
            </a>
          </Button>

          {/* Mobile Hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <button className="text-white p-2" aria-label="Abrir menú">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-brand-dark border-brand-dark-secondary p-0">
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

                {/* Mobile Nav Items */}
                <nav className="flex flex-col p-4 gap-1 flex-1">
                  {navItems.map((item) => (
                    <button
                      key={item.page}
                      onClick={() => handleNav(item.page)}
                      className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        currentPage === item.page
                          ? 'bg-brand-red text-white'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                {/* Mobile WhatsApp */}
                <div className="p-4 border-t border-white/10">
                  <Button
                    asChild
                    className="w-full flex items-center justify-center gap-2 bg-white text-brand-red hover:bg-white/90 rounded-full font-medium"
                  >
                    <a
                      href="https://wa.me/573000000000"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4 fill-brand-red" />
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
