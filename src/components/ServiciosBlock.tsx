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

interface Servicio {
  icon: typeof Home;
  title: string;
  description: string;
  page: PageType;
}

const servicios: Servicio[] = [
  {
    icon: Home,
    title: 'Arrendamientos',
    description: 'Encuentra tu próximo hogar o local. Te acompañamos desde la búsqueda hasta la firma.',
    page: 'propiedades',
  },
  {
    icon: TrendingUp,
    title: 'Ventas',
    description: 'Vende al precio justo. Valoramos tu inmueble con criterio de mercado.',
    page: 'propiedades',
  },
  {
    icon: Key,
    title: 'Consignación',
    description: 'Nosotros conseguimos el arrendatario. Tú recibes el pago.',
    page: 'consignacion',
  },
  {
    icon: ClipboardList,
    title: 'Administración',
    description: 'Manejamos el cobro, los contratos y las reparaciones por ti.',
    page: 'servicios',
  },
  {
    icon: BadgeCheck,
    title: 'Avalúos',
    description: 'Recibe orientación sobre el valor comercial de tu inmueble.',
    page: 'servicios',
  },
  {
    icon: Calculator,
    title: 'Hipotecas',
    description: 'Conoce alternativas de préstamo sobre propiedad raíz.',
    page: 'hipotecas',
  },
];

export default function ServiciosBlock({ onNavigate }: ServiciosBlockProps) {
  return (
    <section className="py-14 sm:py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {servicios.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.title}
                type="button"
                onClick={() => {
                  onNavigate(s.page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group text-left bg-white border border-gray-200 hover:border-brand-red rounded-lg p-6 transition-all hover:shadow-md min-h-[44px]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-md bg-brand-red/10 group-hover:bg-brand-red flex items-center justify-center transition-colors">
                    <Icon className="w-6 h-6 text-brand-red group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-brand-dark">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                      {s.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-red group-hover:gap-2 transition-all">
                      Ver más
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
