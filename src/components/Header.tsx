'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

interface SubItem { label: string; href?: string; }
interface NavItem { label: string; href: string; children?: SubItem[]; }

const navItems: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Propiedades', href: '/propiedades/', children: [
    { label: 'Buscar propiedades', href: '/propiedades/' },
    { label: 'Arrendar', href: '/propiedades/' },
    { label: 'Comprar', href: '/propiedades/' },
  ]},
  { label: 'Consignación', href: '/consignacion/', children: [
    { label: 'Beneficios', href: '/consignacion/' },
    { label: 'Proceso', href: '/consignacion/' },
  ]},
  { label: 'Hipotecas', href: '/hipotecas/', children: [
    { label: 'Calculadora', href: '/hipotecas/' },
    { label: 'Requisitos', href: '/hipotecas/' },
  ]},
  { label: 'Servicios', href: '/servicios/', children: [
    { label: 'Pagar en línea', href: '/servicios/' },
    { label: 'Solicitud de arrendamiento', href: '/servicios/' },
    { label: 'Reparaciones', href: '/servicios/' },
  ]},
  { label: 'Nosotros', href: '/institucional/', children: [
    { label: 'Quiénes somos', href: '/institucional/' },
    { label: '60 años', href: '/institucional/' },
    { label: 'Blog', href: '/institucional/' },
  ]},
];

function isActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href.replace(/\/$/, ''));
}

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

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 pt-4 pb-3 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${scrolled ? 'header-scrolled' : ''}`}
      style={{ zIndex: 50 }}>
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <img src="/logo-blanco.png" alt="Santa Fé Arrendamientos" className="h-10 md:h-11 w-auto object-contain drop-shadow-lg" />
        </Link>

        {/* Nav capsula — desktop */}
        <nav className="hidden lg:flex items-center gap-0.5 bg-black/30 rounded-full px-2 h-[42px] border border-white/20 shadow-lg"
          style={{ overflow: 'visible' }}>
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label} className="relative group">
                <Link
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-white rounded-full transition-all duration-300 ease-out group-hover:bg-brand-red inline-block"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
                >
                  {item.label}
                </Link>
                <div className="absolute top-full left-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  style={{ transform: 'translateX(-50%)', zIndex: 60 }}>
                  <div className="bg-white rounded-2xl pt-2 pb-1 min-w-[210px] shadow-2xl border border-gray-100">
                    {item.children.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href || item.href}
                        className="block w-full text-left px-5 py-2.5 text-[15px] text-gray-700 hover:text-white hover:bg-brand-red transition-colors duration-150 first:rounded-t-2xl last:rounded-b-2xl"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-white rounded-full transition-all duration-300 ease-out hover:bg-brand-red"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
              >
                {item.label}
              </Link>
            )
          )}
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
                      {item.children ? (
                        <button
                          onClick={() => setExpandedMobile(expandedMobile === item.label ? null : item.label)}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(item.href, pathname) ? 'bg-brand-red text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                          {item.label}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`block w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(item.href, pathname) ? 'bg-brand-red text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                          {item.label}
                        </Link>
                      )}
                      {item.children && expandedMobile === item.label && (
                        <div className="pl-6 pb-1 space-y-0">
                          {item.children.map((sub) => (
                            <Link key={sub.label} href={sub.href || item.href}
                              onClick={() => setMobileOpen(false)}
                              className="block w-full px-4 py-1.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200">
                              {sub.label}
                            </Link>
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
