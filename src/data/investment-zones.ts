export type Sector = 'Norte' | 'Sur' | 'Oriente' | 'Occidente';

export interface InvestmentZone {
  id: string;
  slug: string;
  name: string;
  sector: Sector;
  rentability: string;
  pricePerM2: string;
  strata: string;
  subzones: string[];
  municipiosNames: string[];
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
    id: 'norte',
    slug: 'norte',
    name: 'Norte del Valle de Aburrá',
    sector: 'Norte',
    rentability: '5-8%',
    pricePerM2: '$2,500,000 - $6,500,000',
    strata: '1-3',
    subzones: [
      'Bello', 'Copacabana', 'Aranjuez', 'Castilla', 'Manrique',
      'Popular', 'Santa Cruz', 'Tricentenario', 'Campo Valdés',
      'Doce de Octubre', 'Caribe', 'Prado', 'Boyacá',
    ],
    municipiosNames: ['Bello', 'Copacabana', 'Barbosa', 'Girardota'],
    advantages: [
      'Mayor rentabilidad en arrendamiento del área metropolitana: hasta 8% anual',
      'Precios de entrada más accesibles — desde $2,500,000 por m²',
      'Alta densidad poblacional que garantiza demanda constante de arrendamiento',
      'Fácil acceso al sistema de transporte Metro y Metroplús',
      'Mercado en expansión con nuevos proyectos residenciales y comerciales',
      'Bajo riesgo de vacancia por volumen de demanda sostenido',
    ],
    description:
      'El norte del área metropolitana de Medellín concentra las mejores rentabilidades en arrendamiento del mercado gracias a sus precios de adquisición accesibles y su alta densidad poblacional. Municipios como Bello y Copacabana, junto con barrios como Aranjuez, Castilla y Manrique, ofrecen una demanda de arrendamiento constante con bajo riesgo de vacancia, ideal para inversores que priorizan el flujo de caja sobre la valorización a largo plazo.',
    seoTitle: 'Invertir en Norte de Medellín | Rentabilidad hasta 8% Inmobiliaria',
    seoDescription:
      'Invierte en el norte de Medellín con rentabilidades de 5-8% anual. Bello, Copacabana, Aranjuez y Castilla: precios accesibles y alta demanda de arrendamiento en el área metropolitana.',
    h1Title: 'Invertir en Norte de Antioquia',
    keywords: [
      'invertir norte medellín',
      'rentabilidad inmobiliaria norte medellín',
      'apartamentos inversión bello copacabana',
      'arrendamiento norte área metropolitana medellín',
      'inversión inmobiliaria aranjuez castilla medellín',
    ],
  },

  /* ── Sur ────────────────────────────────────────────────────── */
  {
    id: 'sur',
    slug: 'sur',
    name: 'Sur del Valle de Aburrá',
    sector: 'Sur',
    rentability: '4-7%',
    pricePerM2: '$4,500,000 - $14,000,000',
    strata: '2-5',
    subzones: [
      'Envigado', 'Sabaneta', 'Itagüí', 'La Estrella', 'Caldas',
      'Guayabal', 'San Antonio de Prado', 'Belencito',
    ],
    municipiosNames: ['Envigado', 'Sabaneta', 'Itagüí', 'La Estrella', 'Caldas', 'Amagá'],
    advantages: [
      'Zona con mayor crecimiento en valorización de los últimos 10 años',
      'Alternativa competitiva a El Poblado con precios entre 30-60% más bajos',
      'Envigado: municipio independiente con excelente calidad de vida y seguridad',
      'Itagüí: polo industrial con alta demanda de arrendamiento profesional',
      'Sabaneta: inversión temprana en zona de expansión comercial acelerada',
      'Acceso directo al Metro y al sistema de transporte masivo del sur',
    ],
    description:
      'El sur del área metropolitana de Medellín es la zona de mayor crecimiento en valorización de los últimos años. Municipios como Envigado, Sabaneta e Itagüí combinan calidad de vida, seguridad y precios aún competitivos respecto al mercado premium, ofreciendo rentabilidades de 4-7% para inversores que buscan tanto flujo de caja como revalorización patrimonial. La expansión comercial y el traslado de empresas hacia el sur mantienen una demanda robusta de arrendamiento.',
    seoTitle: 'Invertir en Sur de Medellín | Envigado, Sabaneta, Itagüí',
    seoDescription:
      'Invierte en el sur de Medellín con rentabilidades de 4-7%. Envigado, Sabaneta e Itagüí: la zona de mayor crecimiento en valorización con precios competitivos en el área metropolitana.',
    h1Title: 'Invertir en Sur de Antioquia',
    keywords: [
      'invertir sur medellín',
      'rentabilidad inmobiliaria envigado sabaneta',
      'apartamentos inversión itagüí',
      'propiedades sur área metropolitana medellín',
      'inversión inmobiliaria sur medellín',
    ],
  },

  /* ── Oriente ────────────────────────────────────────────────── */
  {
    id: 'oriente',
    slug: 'oriente',
    name: 'Oriente del Valle de Aburrá',
    sector: 'Oriente',
    rentability: '4-6%',
    pricePerM2: '$8,000,000 - $30,000,000',
    strata: '3-6',
    subzones: [
      'El Poblado', 'Castropol', 'Rosales', 'San Diego',
      'Rionegro', 'Llanogrande', 'Guarne', 'La Ceja', 'Retiro',
      'Marinilla', 'Santa Elena',
    ],
    municipiosNames: ['Rionegro', 'Guarne', 'La Ceja', 'Marinilla', 'El Carmen de Viboral', 'Guatapé'],
    advantages: [
      'El Poblado: mercado inmobiliario de mayor demanda turística e internacional de Colombia',
      'Rionegro y Llanogrande: crecimiento impulsado por el Aeropuerto José María Córdova',
      'Demanda de arrendamiento de corta temporada con rentabilidades hasta 6% anual',
      'Revalorización sostenida y constante en el tiempo en todas las zonas del oriente',
      'Zona con mayor concentración de proyectos de desarrollo premium de Antioquia',
      'Atractivo para inversores nacionales e internacionales de largo plazo',
    ],
    description:
      'El oriente de Medellín y el oriente antioqueño concentran el mercado inmobiliario de mayor dinamismo y prestigio de la región. El Poblado lidera la demanda de arrendamiento nacional e internacional, mientras Rionegro y Llanogrande se consolidan como destino de inversión impulsado por la expansión aeroportuaria y el traslado de empresas. Es la zona ideal para inversores que priorizan la revalorización patrimonial y la demanda de arrendamiento de perfil alto.',
    seoTitle: 'Invertir en Oriente de Medellín | El Poblado, Rionegro, Llanogrande',
    seoDescription:
      'Invierte en el oriente de Medellín con rentabilidades de 4-6%. El Poblado, Rionegro y Llanogrande: el mercado inmobiliario premium de Antioquia con alta demanda nacional e internacional.',
    h1Title: 'Invertir en Oriente de Antioquia',
    keywords: [
      'invertir oriente medellín',
      'rentabilidad inmobiliaria el poblado',
      'apartamentos inversión rionegro llanogrande',
      'propiedades oriente antioqueño',
      'inversión inmobiliaria oriente medellín',
    ],
  },

  /* ── Occidente ──────────────────────────────────────────────── */
  {
    id: 'occidente',
    slug: 'occidente',
    name: 'Occidente del Valle de Aburrá',
    sector: 'Occidente',
    rentability: '5-7%',
    pricePerM2: '$6,500,000 - $18,000,000',
    strata: '3-5',
    subzones: [
      'Laureles', 'Estadio', 'Florida Nueva', 'La América', 'Los Colores',
      'Castellana', 'Conquistadores', 'Belén', 'Campo Amor', 'Belencito',
      'Robledo', 'San Cristóbal', 'Calasanz', 'San Javier', 'Naranjal',
    ],
    municipiosNames: ['Santa Fe de Antioquia', 'Sopetrán', 'San Jerónimo', 'San Pedro de los Milagros'],
    advantages: [
      'Mejor relación precio-rentabilidad de Medellín: 5-7% con precios moderados',
      'Laureles y Estadio: demanda consolidada de profesionales y familias jóvenes',
      'Florida Nueva y La América: barrios en valorización acelerada y alta ocupación',
      'Belén: una de las comunas más grandes con mercado estable y diverso',
      'Robledo y San Cristóbal: precios accesibles con potencial de valorización alto',
      'Conectividad al Metro, Metroplús y vías principales del valle de Aburrá',
    ],
    description:
      'El occidente de Medellín ofrece la mejor combinación de precio de adquisición, rentabilidad en arrendamiento y estabilidad de mercado. Laureles, Belén y sus barrios adyacentes concentran una demanda robusta de familias, profesionales y estudiantes universitarios, con tasas de vacancia muy bajas. Es el sector preferido por Arrendamientos Santa Fe y donde contamos con mayor experiencia y portafolio de propiedades gestionadas.',
    seoTitle: 'Invertir en Occidente de Medellín | Laureles, Belén, Florida Nueva',
    seoDescription:
      'Invierte en el occidente de Medellín con rentabilidades de 5-7%. Laureles, Belén y Florida Nueva: la mejor relación precio-rentabilidad con demanda estable de arrendamiento en Medellín.',
    h1Title: 'Invertir en Occidente de Antioquia',
    keywords: [
      'invertir occidente medellín',
      'rentabilidad inmobiliaria laureles belén',
      'apartamentos inversión florida nueva medellín',
      'propiedades occidente medellín arrendamiento',
      'inversión inmobiliaria belén laureles medellín',
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
