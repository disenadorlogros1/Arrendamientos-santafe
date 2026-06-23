export type Sector = 'Norte' | 'Sur' | 'Oriente' | 'Occidente';

export interface InvestmentZone {
  id: string;
  slug: string;
  name: string;
  sector: Sector;
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
  /* ── Norte ─────────────────────────────────────────────────── */
  {
    id: 'bello',
    slug: 'bello',
    name: 'Bello',
    sector: 'Norte',
    rentability: '5-7%',
    pricePerM2: '$3,500,000 - $7,000,000',
    strata: '2-3',
    advantages: [
      'Precios de entrada más accesibles del área metropolitana',
      'Gran volumen de demanda de arrendamiento por densidad poblacional',
      'Crecimiento acelerado de nuevos proyectos residenciales',
      'Fácil acceso al metro y al sistema de transporte metropolitano',
      'Alta rentabilidad por precio bajo de adquisición',
    ],
    description:
      'Bello ofrece la mejor rentabilidad por precio de entrada del norte del área metropolitana. Su alta densidad poblacional garantiza demanda constante de arrendamiento para inversores que buscan flujo de caja.',
    seoTitle: 'Invertir en Bello | Rentabilidad Inmobiliaria Norte Medellín',
    seoDescription:
      'Invierte en Bello con rentabilidad de 5-7% anual. Precios accesibles y alta demanda de arrendamiento en el norte del área metropolitana de Medellín.',
    h1Title: 'Invertir en Bello — Norte del Área Metropolitana',
    keywords: [
      'invertir en bello',
      'apartamentos para inversión bello',
      'rentabilidad inmobiliaria bello',
      'propiedades bello medellín',
    ],
  },
  {
    id: 'copacabana',
    slug: 'copacabana',
    name: 'Copacabana',
    sector: 'Norte',
    rentability: '4-6%',
    pricePerM2: '$3,000,000 - $5,500,000',
    strata: '2-3',
    advantages: [
      'Municipio tranquilo con calidad de vida alta',
      'Precios muy competitivos para inversores de largo plazo',
      'Crecimiento urbano sostenido en los últimos años',
      'Demanda estable de familias y trabajadores de Medellín',
      'Entorno natural atractivo para residentes',
    ],
    description:
      'Copacabana es una opción emergente para inversionistas que buscan activos inmobiliarios a bajo costo con potencial de valorización en el mediano plazo, en un municipio en crecimiento al norte del valle.',
    seoTitle: 'Invertir en Copacabana | Propiedades Norte Antioquia',
    seoDescription:
      'Descubre oportunidades de inversión en Copacabana. Precios bajos y rentabilidad de 4-6% en uno de los municipios con mayor crecimiento al norte de Medellín.',
    h1Title: 'Invertir en Copacabana — Norte del Área Metropolitana',
    keywords: [
      'invertir en copacabana antioquia',
      'apartamentos inversión copacabana',
      'rentabilidad inmobiliaria copacabana',
      'propiedades copacabana medellín',
    ],
  },

  /* ── Sur ────────────────────────────────────────────────────── */
  {
    id: 'envigado',
    slug: 'envigado',
    name: 'Envigado',
    sector: 'Sur',
    rentability: '4-5%',
    pricePerM2: '$8,000,000 - $14,000,000',
    strata: '3-5',
    advantages: [
      'Municipio con administración independiente y seguro',
      'Precio de entrada más accesible que El Poblado',
      'Crecimiento urbano y comercial constante',
      'Buena oferta de colegios y servicios educativos',
      'Zona con demanda familiar y de profesionales',
    ],
    description:
      'Envigado es una alternativa segura para inversores que buscan menores precios de entrada sin comprometer rentabilidad y potencial de revalorización.',
    seoTitle: 'Invertir en Envigado | Propiedades de Inversión',
    seoDescription:
      'Invierte en Envigado con rentabilidad de 4-5% anual. Descubre propiedades para inversión inmobiliaria en este municipio seguro y en crecimiento.',
    h1Title: 'Invertir en Envigado — Sur del Área Metropolitana',
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
    sector: 'Sur',
    rentability: '4-6%',
    pricePerM2: '$7,200,000 - $12,800,000',
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
    h1Title: 'Invertir en Sabaneta — Sur del Área Metropolitana',
    keywords: [
      'invertir en sabaneta',
      'apartamentos para inversión sabaneta',
      'rentabilidad inmobiliaria sabaneta',
      'propiedades sabaneta medellín',
    ],
  },
  {
    id: 'itagui',
    slug: 'itagui',
    name: 'Itagüí',
    sector: 'Sur',
    rentability: '5-7%',
    pricePerM2: '$4,500,000 - $8,000,000',
    strata: '2-4',
    advantages: [
      'Mayor rentabilidad por precio de m² en el sur del área metropolitana',
      'Importante polo industrial y comercial',
      'Alta demanda de arrendamiento por empleados y profesionales',
      'Acceso directo al metro de Medellín',
      'Proyectos de renovación urbana en curso',
    ],
    description:
      'Itagüí combina precios competitivos con una sólida demanda de arrendamiento impulsada por su actividad industrial y comercial, ofreciendo una de las mejores rentabilidades del sur metropolitano.',
    seoTitle: 'Invertir en Itagüí | Alta Rentabilidad Sur Medellín',
    seoDescription:
      'Invierte en Itagüí con rentabilidad de 5-7% anual. Alta demanda de arrendamiento y precios competitivos en el polo industrial del sur del área metropolitana.',
    h1Title: 'Invertir en Itagüí — Sur del Área Metropolitana',
    keywords: [
      'invertir en itagüí',
      'apartamentos para inversión itagüí',
      'rentabilidad inmobiliaria itagüí',
      'propiedades itagüí medellín',
    ],
  },

  /* ── Oriente ────────────────────────────────────────────────── */
  {
    id: 'el-poblado',
    slug: 'el-poblado',
    name: 'El Poblado',
    sector: 'Oriente',
    rentability: '4-6%',
    pricePerM2: '$18,000,000 - $30,000,000',
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
    h1Title: 'Invertir en El Poblado — Oriente de Medellín',
    keywords: [
      'invertir en el poblado',
      'apartamentos para inversión el poblado',
      'rentabilidad inmobiliaria el poblado',
      'propiedades el poblado medellín',
    ],
  },
  {
    id: 'rionegro',
    slug: 'rionegro',
    name: 'Rionegro',
    sector: 'Oriente',
    rentability: '5-7%',
    pricePerM2: '$4,000,000 - $8,500,000',
    strata: '3-5',
    advantages: [
      'Aeropuerto Internacional José María Córdova a minutos',
      'Zona industrial y de servicios en fuerte expansión',
      'Alta demanda de ejecutivos, viajeros y empresarios',
      'Precios bajos con alta proyección de valorización',
      'Clima y calidad de vida excepcionales',
    ],
    description:
      'Rionegro es el mercado de mayor crecimiento del oriente antioqueño, impulsado por la expansión del aeropuerto y el traslado de empresas. Ideal para arrendamientos de corta y mediana duración.',
    seoTitle: 'Invertir en Rionegro | Oriente Antioqueño Inversión',
    seoDescription:
      'Invierte en Rionegro con rentabilidad de 5-7% anual. Zona aeroportuaria con alta demanda de arrendamiento y precios competitivos en el oriente antioqueño.',
    h1Title: 'Invertir en Rionegro — Oriente Antioqueño',
    keywords: [
      'invertir en rionegro',
      'apartamentos para inversión rionegro',
      'rentabilidad inmobiliaria rionegro',
      'propiedades rionegro antioquia',
    ],
  },

  /* ── Occidente ──────────────────────────────────────────────── */
  {
    id: 'laureles',
    slug: 'laureles',
    name: 'Laureles',
    sector: 'Occidente',
    rentability: '5-7%',
    pricePerM2: '$11,200,000 - $18,000,000',
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
    h1Title: 'Invertir en Laureles — Occidente de Medellín',
    keywords: [
      'invertir en laureles',
      'apartamentos para inversión laureles',
      'rentabilidad inmobiliaria laureles',
      'propiedades laureles medellín',
    ],
  },
  {
    id: 'belen',
    slug: 'belen',
    name: 'Belén',
    sector: 'Occidente',
    rentability: '5-6%',
    pricePerM2: '$6,500,000 - $11,000,000',
    strata: '3-4',
    advantages: [
      'Una de las comunas más grandes y consolidadas de Medellín',
      'Alta densidad de demanda de arrendamiento familiar',
      'Infraestructura comercial y de servicios completa',
      'Precio de adquisición moderado con buena rentabilidad',
      'Conectado al sistema de transporte masivo',
    ],
    description:
      'Belén combina un mercado consolidado con precios moderados, ofreciendo rentabilidades sólidas y bajo riesgo de vacancia para inversores que priorizan la estabilidad del flujo de caja.',
    seoTitle: 'Invertir en Belén Medellín | Rentabilidad Inmobiliaria',
    seoDescription:
      'Invierte en Belén con rentabilidad de 5-6% anual. Zona consolidada del occidente de Medellín con alta demanda de arrendamiento y precios moderados.',
    h1Title: 'Invertir en Belén — Occidente de Medellín',
    keywords: [
      'invertir en belén medellín',
      'apartamentos para inversión belén',
      'rentabilidad inmobiliaria belén medellín',
      'propiedades belén medellín',
    ],
  },
];

export function getZoneBySlug(slug: string): InvestmentZone | undefined {
  return investmentZones.find((zone) => zone.slug === slug);
}

export function getAllZoneSlugs(): string[] {
  return investmentZones.map((zone) => zone.slug);
}

export function getZonesBySector(sector: Sector): InvestmentZone[] {
  return investmentZones.filter((zone) => zone.sector === sector);
}

export const SECTORS: Sector[] = ['Norte', 'Sur', 'Oriente', 'Occidente'];
