'use client';

import {
  Search,
  Tag,
  Key,
  CreditCard,
  FileText,
  Wrench,
  Calculator,
  MessageCircle,
} from 'lucide-react';
import type { PageType } from '@/components/Header';

interface QuickAccessGridProps {
  onNavigate: (page: PageType) => void;
}

const PSE_URL = 'https://www.psepagos.co/PSEHostingUI/ShowTicketOffice.aspx?ID=9011';
const SOLICITUD_URL =
  'https://wa.me/573006557529?text=Hola%2C%20quisiera%20solicitar%20un%20arrendamiento%20con%20Arrendamientos%20Santa%20Fe.';
const REPARACIONES_URL =
  'https://wa.me/573006557529?text=Hola%2C%20necesito%20reportar%20una%20reparaci%C3%B3n.';
const ASESOR_URL =
  'https://wa.me/573006557529?text=Hola%2C%20quisiera%20hablar%20con%20un%20asesor%20de%20Arrendamientos%20Santa%20Fe.';

interface AccessItem {
  icon: typeof Search;
  label: string;
  description: string;
  type: 'nav' | 'link';
  page?: PageType;
  href?: string;
}

export default function QuickAccessGrid({ onNavigate }: QuickAccessGridProps) {
  const items: AccessItem[] = [
    {
      icon: Search,
      label: 'Buscar en arriendo',
      description: 'Inmuebles disponibles para arrendar',
      type: 'nav',
      page: 'propiedades',
    },
    {
      icon: Tag,
      label: 'Buscar en venta',
      description: 'Inmuebles disponibles para comprar',
      type: 'nav',
      page: 'propiedades',
    },
    {
      icon: Key,
      label: 'Consignar mi propiedad',
      description: 'Pon tu inmueble en gestión',
      type: 'nav',
      page: 'consignacion',
    },
    {
      icon: CreditCard,
      label: 'Pagar en línea',
      description: 'Pago seguro a través de PSE',
      type: 'link',
      href: PSE_URL,
    },
    {
      icon: FileText,
      label: 'Solicitar arrendamiento',
      description: 'Inicia tu proceso de solicitud',
      type: 'link',
      href: SOLICITUD_URL,
    },
    {
      icon: Wrench,
      label: 'Reportar reparación',
      description: 'Comunícate con el área de mantenimiento',
      type: 'link',
      href: REPARACIONES_URL,
    },
    {
      icon: Calculator,
      label: 'Asesoría hipotecaria',
      description: 'Conoce alternativas de préstamo',
      type: 'nav',
      page: 'hipotecas',
    },
    {
      icon: MessageCircle,
      label: 'Hablar con un asesor',
      description: 'Te orientamos por WhatsApp',
      type: 'link',
      href: ASESOR_URL,
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h2
            className="text-3xl sm:text-4xl text-brand-dark"
            style={{
              fontFamily:
                "'Avenir LT Std', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
            }}
          >
            ¿Qué necesitas hacer hoy?
          </h2>
          <p
            className="mt-3 text-base text-gray-500 max-w-2xl mx-auto"
            style={{
              fontFamily:
                "'Avenir LT Std', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
            }}
          >
            Encuentra rápido lo que necesitas: búsqueda, pagos, solicitudes y
            asesoría.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {items.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className="group h-full bg-white border border-gray-200 hover:border-brand-red rounded-lg p-5 flex flex-col items-start gap-3 transition-all hover:shadow-md cursor-pointer min-h-[140px]">
                <div className="w-11 h-11 rounded-md bg-brand-red/10 group-hover:bg-brand-red flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5 text-brand-red group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-brand-dark leading-tight">
                  {item.label}
                </h3>
                <p className="text-xs text-gray-500 leading-snug">
                  {item.description}
                </p>
              </div>
            );

            if (item.type === 'link' && item.href) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block min-h-[44px]"
                >
                  {content}
                </a>
              );
            }

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  if (item.page) {
                    onNavigate(item.page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="block w-full text-left min-h-[44px]"
              >
                {content}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
