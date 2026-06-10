'use client';

import {
  Home,
  TrendingUp,
  Key,
  ClipboardList,
  BadgeCheck,
  Calculator,
  ArrowRight,
} from 'lucide-react';
import type { PageType } from '@/components/Header';

interface ServiciosBlockProps {
  onNavigate: (page: PageType) => void;
}

const FONT_BODY    = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const FONT_HEADING = "'Avenir LT Pro 85 Heavy',  'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const RED          = '#f32735';

const servicios = [
  {
    icon: Home,
    title: 'Arrendamientos',
    description: 'Encuentra tu próximo hogar o local. Te acompañamos desde la búsqueda hasta la firma.',
    page: 'propiedades' as PageType,
    colSpan: 'lg:col-span-2',
    accent: false,
  },
  {
    icon: TrendingUp,
    title: 'Ventas',
    description: 'Vende al precio justo. Valoramos tu inmueble con criterio de mercado.',
    page: 'propiedades' as PageType,
    colSpan: 'lg:col-span-1',
    accent: false,
  },
  {
    icon: Key,
    title: 'Consignación',
    description: 'Nosotros conseguimos el arrendatario. Tú recibes el pago.',
    page: 'consignacion' as PageType,
    colSpan: 'lg:col-span-1',
    accent: false,
  },
  {
    icon: ClipboardList,
    title: 'Administración',
    description: 'Manejamos el cobro, los contratos y las reparaciones por ti.',
    page: 'servicios' as PageType,
    colSpan: 'lg:col-span-2',
    accent: true,
  },
  {
    icon: BadgeCheck,
    title: 'Avalúos',
    description: 'Recibe orientación sobre el valor comercial de tu inmueble.',
    page: 'servicios' as PageType,
    colSpan: 'lg:col-span-1',
    accent: false,
  },
  {
    icon: Calculator,
    title: 'Hipotecas',
    description: 'Conoce alternativas de préstamo sobre propiedad raíz.',
    page: 'hipotecas' as PageType,
    colSpan: 'lg:col-span-2',
    accent: false,
  },
];

export default function ServiciosBlock({ onNavigate }: ServiciosBlockProps) {
  return (
    <section style={{ background: '#0a0a0a' }} className="w-full overflow-hidden">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        style={{ gap: '3px' }}
      >
        {servicios.map((s) => {
          const Icon = s.icon;
          const bg   = s.accent ? RED : '#1a1a1a';
          const hoverBg = s.accent ? '#aa182c' : '#2d2d2d';

          return (
            <button
              key={s.title}
              type="button"
              onClick={() => {
                onNavigate(s.page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group text-left ${s.colSpan} flex flex-col justify-between gap-6 p-8 lg:p-10 transition-colors duration-200 min-h-[200px]`}
              style={{ background: bg }}
              onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = bg)}
            >
              <div className="flex items-start gap-4">
                <Icon
                  style={{ color: s.accent ? '#fff' : RED, flexShrink: 0 }}
                  className="w-7 h-7 mt-0.5"
                />
                <div>
                  <h3
                    style={{
                      fontFamily: FONT_HEADING,
                      fontWeight: 700,
                      fontSize: 'clamp(17px, 1.3vw, 22px)',
                      color: '#fff',
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: FONT_BODY,
                      fontWeight: 400,
                      fontSize: 'clamp(13px, 0.95vw, 15px)',
                      color: s.accent ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)',
                      marginTop: '8px',
                      lineHeight: 1.55,
                    }}
                  >
                    {s.description}
                  </p>
                </div>
              </div>

              <span
                className="inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200"
                style={{
                  fontFamily: FONT_BODY,
                  fontWeight: 600,
                  fontSize: '13px',
                  color: s.accent ? '#fff' : RED,
                }}
              >
                Ver más
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
