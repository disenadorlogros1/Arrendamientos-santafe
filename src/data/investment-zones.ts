export interface InvestmentZone {
  id: string;
  slug: string;
  name: string;
  rentability: string;
  pricePerM2: string;
  strata: string;
  advantages: string[];
  description: string;
  seoTitle: string;
  seoDescription: string;
  h1Title: string;
  keywords: string[];
}

export const investmentZones: InvestmentZone[] = [
  {
    id: 'el-poblado',
    slug: 'el-poblado',
    name: 'El Poblado',
    rentability: '4-6%',
    pricePerM2: '$4,500 - $7,500 USD',
    strata: '5-6',
    advantages: [
      'Zona comercial y turística más dinámica de Medellín',
      'Mayor demanda de arrendamiento nacional e internacional',
      'Infraestructura completa: parques, restaurantes, comercio',
      'Revalorización constante y estable en el tiempo',
      'Fácil acceso a transporte y servicios',
    ],
    description:
      'El Poblado es la zona más codiciada para inversión inmobiliaria en Medellín, con una fuerte demanda de arrendamiento tanto de residentes como de turistas.',
    seoTitle: 'Invertir en El Poblado | Rentabilidad Inmobiliaria Medellín',
    seoDescription:
      'Descubre oportunidades de inversión inmobiliaria en El Poblado con rentabilidad de 4-6% anual y alta demanda de arrendamiento en Medellín.',
    h1Title: 'Invertir en El Poblado Medellín',
    keywords: [
      'invertir en el poblado',
      'apartamentos para inversión el poblado',
      'rentabilidad inmobiliaria el poblado',
      'propiedades el poblado medellín',
    ],
  },
  {
    id: 'laureles',
    slug: 'laureles',
    name: 'Laureles',
    rentability: '5-7%',
    pricePerM2: '$2,800 - $4,500 USD',
    strata: '4-5',
    advantages: [
      'Mejor relación precio-rentabilidad de Medellín',
      'Alto potencial de revalorización a medio plazo',
      'Demanda creciente de profesionales y familias jóvenes',
      'Zona segura con buena infraestructura residencial',
      'Acceso a transporte metropolitano y centros comerciales',
    ],
    description:
      'Laureles es una zona en constante crecimiento con excelente potencial de inversión, ofreciendo rentabilidades más altas que otras zonas consolidadas.',
    seoTitle: 'Invertir en Laureles | Mejor Rentabilidad Inmobiliaria',
    seoDescription:
      'Invierte en Laureles con rentabilidad de 5-7% anual. Descubre por qué es la mejor zona para invertir en Medellín con mejor relación precio-rentabilidad.',
    h1Title: 'Invertir en Laureles Medellín',
    keywords: [
      'invertir en laureles',
      'apartamentos para inversión laureles',
      'rentabilidad inmobiliaria laureles',
      'propiedades laureles medellín',
    ],
  },
  {
    id: 'envigado',
    slug: 'envigado',
    name: 'Envigado',
    rentability: '4-5%',
    pricePerM2: '$2,000 - $3,500 USD',
    strata: '3-5',
    advantages: [
      'Municipio con administración independiente y seguro',
      'Precio de entrada más accesible para inversores',
      'Crecimiento urbano y comercial constante',
      'Buena oferta de colegios y servicios educativos',
      'Zona con demanda familiar y de profesionales',
    ],
    description:
      'Envigado es una alternativa segura para inversores que buscan menores precios de entrada sin comprometer rentabilidad y potencial de revalorización.',
    seoTitle: 'Invertir en Envigado | Propiedades de Inversión',
    seoDescription:
      'Invierte en Envigado con rentabilidad de 4-5% anual. Descubre propiedades para inversión inmobiliaria en este municipio seguro y en crecimiento.',
    h1Title: 'Invertir en Envigado Medellín',
    keywords: [
      'invertir en envigado',
      'apartamentos para inversión envigado',
      'rentabilidad inmobiliaria envigado',
      'propiedades envigado medellín',
    ],
  },
  {
    id: 'sabaneta',
    slug: 'sabaneta',
    name: 'Sabaneta',
    rentability: '4-6%',
    pricePerM2: '$1,800 - $3,200 USD',
    strata: '3-4',
    advantages: [
      'Zona emergente con alto potencial de crecimiento',
      'Precios aún competitivos para inversión temprana',
      'Infraestructura en desarrollo y modernización',
      'Acceso a nuevos proyectos comerciales y residenciales',
      'Comunidad en crecimiento con demanda de arrendamiento',
    ],
    description:
      'Sabaneta representa una oportunidad de inversión temprana con potencial de revalorización significativa en los próximos años.',
    seoTitle: 'Invertir en Sabaneta | Propiedades Emergentes',
    seoDescription:
      'Descubre oportunidades de inversión en Sabaneta con rentabilidad de 4-6% anual. Invierte en una zona emergente con alto potencial de crecimiento.',
    h1Title: 'Invertir en Sabaneta Medellín',
    keywords: [
      'invertir en sabaneta',
      'apartamentos para inversión sabaneta',
      'rentabilidad inmobiliaria sabaneta',
      'propiedades sabaneta medellín',
    ],
  },
];

export function getZoneBySlug(slug: string): InvestmentZone | undefined {
  return investmentZones.find((zone) => zone.slug === slug);
}

export function getAllZoneSlugs(): string[] {
  return investmentZones.map((zone) => zone.slug);
}
