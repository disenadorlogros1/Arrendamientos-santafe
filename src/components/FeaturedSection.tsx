'use client';

import { Button } from '@/components/ui/button';
import type { PageType } from '@/data/properties';

interface FeaturedSectionProps {
  onNavigate: (page: PageType) => void;
}

export default function FeaturedSection({ onNavigate }: FeaturedSectionProps) {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-red">
              Destacadas del mes
            </h2>
            <p className="mt-3 text-sm sm:text-base text-brand-gray max-w-xl leading-relaxed">
              Las mejores oportunidades vuelan. En estas propiedades ya está
              escrito tu futuro, ¡no las dejes pasar! Escríbenos por WhatsApp y
              agendamos tu visita de inmediato.
            </p>
          </div>
          <Button
            onClick={() => {
              onNavigate('propiedades');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="shrink-0 bg-gray-800 hover:bg-gray-700 text-white rounded-full px-6 py-2.5 text-sm font-medium"
          >
            Ver más
          </Button>
        </div>
      </div>
    </section>
  );
}
