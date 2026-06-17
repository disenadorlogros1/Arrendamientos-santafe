export interface ArticleBlock {
  type: 'paragraph' | 'heading' | 'list' | 'highlight';
  text?: string;
  items?: string[];
}

export interface BlogArticle {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  intro: string;
  blocks: ArticleBlock[];
  ctaText: string;
  ctaPage: 'propiedades' | 'consignacion' | 'blog';
}

export const allArticles: BlogArticle[] = [
  {
    id: 1,
    title: '5 consejos para mantener tu propiedad en perfecto estado durante el arrendamiento',
    excerpt: 'Aprende cómo proteger tu inversión inmobiliaria con mantenimiento preventivo y cuidados esenciales que evitarán costosas reparaciones futuras.',
    date: 'Mayo 18, 2026',
    category: 'Arrendamiento',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
    readTime: '5 min',
    intro: 'La diferencia entre una propiedad que mantiene su valor y una que lo pierde está, en buena parte, en el mantenimiento preventivo. Si tienes un inmueble en arriendo, estos cinco hábitos te evitarán conflictos, gastos inesperados y pérdida de valor a largo plazo.',
    blocks: [
      { type: 'heading', text: '1. Realiza inspecciones periódicas' },
      { type: 'paragraph', text: 'Visita el inmueble al menos dos veces al año. Revisa tuberías, instalaciones eléctricas, humedades en paredes y techos, y el estado de puertas y ventanas. Una inspección a tiempo puede detectar problemas menores antes de que se conviertan en reparaciones mayores.' },
      { type: 'heading', text: '2. Documenta el estado inicial del inmueble' },
      { type: 'paragraph', text: 'Antes de entregar el inmueble a un nuevo arrendatario, toma fotografías y video de cada espacio. Este registro es tu mejor protección ante reclamaciones al final del contrato y elimina ambigüedades sobre el estado original.' },
      { type: 'highlight', text: 'Un inventario fotográfico detallado puede ahorrarte meses de conflictos legales al terminar el contrato de arrendamiento.' },
      { type: 'heading', text: '3. Define claramente las responsabilidades' },
      { type: 'paragraph', text: 'El contrato debe especificar qué reparaciones corresponden al arrendatario (daños por uso indebido) y cuáles al propietario (deterioro por uso normal, filtraciones estructurales). La claridad desde el inicio evita disputas costosas.' },
      { type: 'heading', text: '4. Mantén al día los sistemas críticos' },
      { type: 'paragraph', text: 'Calentadores, sistemas de gas, instalaciones eléctricas y redes de alcantarillado requieren revisión periódica independientemente de si el arrendatario reporta o no problemas. Un desperfecto en estos sistemas puede poner en riesgo la seguridad y generarte responsabilidades legales.' },
      { type: 'heading', text: '5. Responde rápido a los reportes de daños' },
      { type: 'paragraph', text: 'Cada daño menor que no se atiende a tiempo tiene el potencial de convertirse en uno mayor. Establece un canal de comunicación claro con tu arrendatario y comprométete a responder en tiempos razonables. La confianza mutua es la base de un arrendamiento largo y sin conflictos.' },
      { type: 'highlight', text: 'En Arrendamientos Santa Fe gestionamos el mantenimiento de tu propiedad como parte de nuestro servicio. Tú recibes los informes; nosotros coordinamos las reparaciones.' },
    ],
    ctaText: 'Consigna tu propiedad',
    ctaPage: 'consignacion',
  },
  {
    id: 2,
    title: 'El Poblado: Guía completa para invertir en el barrio más dinámico de Medellín',
    excerpt: 'Descubre por qué El Poblado es el barrio preferido de inversionistas y expatriados. Analiza rentabilidades, precios y oportunidades actuales.',
    date: 'Mayo 12, 2026',
    category: 'Mercado',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
    readTime: '7 min',
    intro: 'El Poblado concentra la mayor demanda de arrendamiento residencial premium en Medellín. Pero no todos sus sectores son iguales: entender sus diferencias es clave para tomar decisiones de inversión inteligentes.',
    blocks: [
      { type: 'heading', text: 'Por qué El Poblado sigue siendo referente' },
      { type: 'paragraph', text: 'Con más de 30 años de consolidación como el barrio de mayor valor en Medellín, El Poblado ofrece una combinación única de oferta gastronómica, seguridad, conectividad y acceso a vías principales. Su demanda incluye profesionales nacionales, ejecutivos de multinacionales y una comunidad de expatriados en crecimiento permanente.' },
      { type: 'heading', text: 'Los sub-sectores con mejor rentabilidad' },
      { type: 'list', items: [
        'Patio Bonito y Astorga: alta rotación, demanda corporativa y de corta estancia. Rentabilidad entre 0.6% y 0.8% mensual.',
        'Santa María de los Ángeles y Provenza: perfil más residencial, contratos más largos. Rentabilidad estable entre 0.5% y 0.7%.',
        'La Aguacatala y Manila: transición entre Poblado y el sur. Relación precio-arriendo más favorable, con rentabilidades que pueden superar el 0.8%.',
      ]},
      { type: 'heading', text: 'Qué perfil de arrendatario encontrarás' },
      { type: 'paragraph', text: 'En El Poblado, la demanda proviene principalmente de profesionales entre 28 y 45 años, ejecutivos de empresas medianas y grandes, y familias de estratos 5 y 6 que prefieren arrendar a comprometer capital. También hay una demanda creciente de extranjeros que trabajan en startups, BPO y el sector financiero.' },
      { type: 'heading', text: 'Qué buscar en una propiedad para arrendar aquí' },
      { type: 'list', items: [
        'Parqueadero cubierto: en El Poblado es casi no negociable para arrendatarios premium.',
        'Acabados de calidad: pisos, cocina y baños actualizados hacen la diferencia al momento del avalúo de arriendo.',
        'Seguridad del edificio: portería 24 horas y cámaras son estándar en la demanda actual.',
        'Cercanía a vías principales: acceso a la Avenida El Poblado mejora sustancialmente el perfil del inmueble.',
      ]},
      { type: 'highlight', text: 'Una propiedad bien ubicada en El Poblado con los acabados correctos puede generar rentabilidades por encima del promedio de la ciudad durante años consecutivos.' },
    ],
    ctaText: 'Ver propiedades disponibles',
    ctaPage: 'propiedades',
  },
  {
    id: 3,
    title: 'Cómo calcular la rentabilidad real de tu inversión inmobiliaria',
    excerpt: 'Detrás de un buen porcentaje hay cálculos precisos. Te enseñamos a evaluar correctamente si tu propiedad genera los retornos esperados.',
    date: 'Mayo 8, 2026',
    category: 'Inversión',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    readTime: '6 min',
    intro: 'El precio de compra de una propiedad no dice nada por sí solo sobre su rentabilidad como inversión. Detrás de un porcentaje atractivo puede haber costos ocultos que cambian completamente el panorama. Aquí te enseñamos a calcular correctamente.',
    blocks: [
      { type: 'heading', text: 'Rentabilidad bruta vs. rentabilidad neta' },
      { type: 'paragraph', text: 'La rentabilidad bruta es la más usada y la más engañosa. Se calcula dividiendo el arriendo anual entre el precio del inmueble. Pero la rentabilidad que realmente importa es la neta: la que queda después de descontar todos los costos reales.' },
      { type: 'heading', text: 'Fórmula para calcular la rentabilidad neta' },
      { type: 'paragraph', text: 'Rentabilidad neta = (Arriendo mensual × 12 − Costos anuales) ÷ Precio del inmueble × 100. Los costos que debes incluir siempre:' },
      { type: 'list', items: [
        'Cuotas de administración de propiedad horizontal.',
        'Predial anual.',
        'Mantenimiento y reparaciones (estima entre 0.5% y 1% del valor del inmueble por año).',
        'Seguros del inmueble.',
        'Periodos sin arrendatario (vacancia): promedio de 1 mes por año en Medellín.',
        'Comisión de administración inmobiliaria si aplica.',
      ]},
      { type: 'highlight', text: 'Un apartamento a $350 millones con arriendo de $2.000.000 tiene rentabilidad bruta del 6.8% anual. Si los costos suman $3.600.000 anuales, la rentabilidad neta baja al 5.8%. La diferencia es real y hay que calcularla.' },
      { type: 'heading', text: 'El benchmark del mercado en Medellín' },
      { type: 'paragraph', text: 'Una rentabilidad neta entre 0.4% y 0.6% mensual (equivalente a 4.8%–7.2% anual) se considera buena para Medellín. Por debajo del 0.4% mensual, la propiedad puede ser una apuesta de valorización, no de flujo de caja. Por encima del 0.6%, es una excelente oportunidad.' },
      { type: 'heading', text: 'Cuándo es mejor vender que arrendar' },
      { type: 'paragraph', text: 'Si la valorización anual del inmueble supera significativamente la rentabilidad del arriendo, puede ser el momento de vender y reinvertir. Evalúa el costo de oportunidad de tu capital al menos cada dos años para asegurarte de que tu inversión sigue trabajando para ti.' },
    ],
    ctaText: 'Consigna tu propiedad',
    ctaPage: 'consignacion',
  },
  {
    id: 4,
    title: 'Documentos y trámites necesarios para arrendar tu propiedad legalmente',
    excerpt: 'Conoce los requisitos legales, contratos y documentos indispensables para proteger tu propiedad y asegurar un arrendamiento seguro.',
    date: 'Abril 30, 2026',
    category: 'Arrendamiento',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80',
    readTime: '4 min',
    intro: 'Un contrato de arrendamiento bien soportado documentalmente protege a ambas partes y reduce drásticamente los conflictos. Antes de entregar las llaves, asegúrate de tener todo en orden.',
    blocks: [
      { type: 'heading', text: 'Documentos que debes tener como propietario' },
      { type: 'list', items: [
        'Escritura pública o certificado de tradición y libertad del inmueble (no mayor a 30 días).',
        'Recibo de predial al día.',
        'Paz y salvo de administración.',
        'Documentos de identidad del propietario o poder notariado si actúas por representación.',
      ]},
      { type: 'heading', text: 'Documentos que debes pedir al arrendatario' },
      { type: 'list', items: [
        'Cédula de ciudadanía o documento de identidad vigente.',
        'Certificado de ingresos o contrato de trabajo (ingresos mínimos de 3 veces el valor del arriendo).',
        'Extractos bancarios de los últimos 3 meses.',
        'Referencias personales y laborales verificables.',
        'Si aplica: documentos de codeudor o fiador con los mismos requisitos.',
      ]},
      { type: 'heading', text: 'El contrato: lo que no puede faltar' },
      { type: 'paragraph', text: 'El contrato de arrendamiento en Colombia es un documento jurídicamente vinculante. Debe incluir: identificación completa de las partes, descripción detallada del inmueble, valor del arriendo y forma de pago, duración del contrato (mínimo 12 meses en residencial), reajuste anual (máximo IPC), causales de terminación y procedimiento para la entrega del inmueble.' },
      { type: 'highlight', text: 'Un contrato mal redactado puede dejarte sin herramientas legales en caso de incumplimiento. Siempre usa contratos revisados por profesionales o asesórate con tu inmobiliaria.' },
      { type: 'heading', text: 'La póliza de arrendamiento: tu red de seguridad' },
      { type: 'paragraph', text: 'La póliza de arrendamiento es un seguro que cubre el no pago de arriendo, los daños al inmueble y los gastos legales en caso de necesitar un proceso de restitución. En Medellín, su costo oscila entre el 50% y el 80% del valor de un arriendo mensual como prima anual. Es una de las inversiones de protección más rentables que puedes hacer como propietario.' },
    ],
    ctaText: 'Consigna tu propiedad',
    ctaPage: 'consignacion',
  },
  {
    id: 5,
    title: 'Nuevas oportunidades de inversión: Proyectos de vivienda en Antioquia',
    excerpt: 'Explora los proyectos inmobiliarios más promisores del momento y descubre dónde colocar tu capital para máxima rentabilidad.',
    date: 'Abril 22, 2026',
    category: 'Inversión',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    readTime: '8 min',
    intro: 'Durante años, la inversión inmobiliaria en Antioquia estuvo concentrada en el Valle de Aburrá. Hoy, el mapa se ha expandido, y algunas de las oportunidades más interesantes están fuera de Medellín.',
    blocks: [
      { type: 'heading', text: 'El Oriente Antioqueño: el nuevo polo' },
      { type: 'paragraph', text: 'Rionegro, El Retiro, La Ceja y Marinilla han consolidado un corredor de inversión sólido impulsado por la expansión del Aeropuerto José María Córdova, la instalación de empresas de logística y manufactura, y el crecimiento de una clase media que prefiere vivir en zonas de menor densidad urbana.' },
      { type: 'heading', text: '¿Qué tipo de propiedad funciona mejor?' },
      { type: 'list', items: [
        'Apartamentos de 1 y 2 habitaciones cerca al aeropuerto en Rionegro: alta demanda de viajeros frecuentes y trabajadores de empresas instaladas en el oriente.',
        'Casas en conjuntos cerrados en El Retiro: perfil de arrendatario de ingresos altos que busca privacidad y contacto con la naturaleza.',
        'Locales comerciales en zonas de crecimiento en Marinilla y La Ceja: el comercio local se ha dinamizado con la migración poblacional sostenida.',
      ]},
      { type: 'highlight', text: 'Arrendamientos Santa Fe abrió su sede en Rionegro en 2026 precisamente por esta razón: el Oriente Antioqueño es uno de los mercados con más proyección en toda la región.' },
      { type: 'heading', text: 'Las cifras que respaldan el movimiento' },
      { type: 'paragraph', text: 'La valorización en municipios como Rionegro ha superado en varios periodos la valorización en zonas consolidadas de Medellín. El factor clave: oferta limitada frente a una demanda creciente. Esta dinámica es típica de mercados en desarrollo y puede representar ventanas de oportunidad que se cierran a medida que el mercado madura.' },
      { type: 'heading', text: 'Cómo evaluar una oportunidad antes de invertir' },
      { type: 'list', items: [
        'Investiga los proyectos de infraestructura planificados en la zona (vías, equipamientos, zonas francas).',
        'Compara el precio por metro cuadrado con el Valle de Aburrá: si la diferencia supera el 40%, el potencial de convergencia puede ser alto.',
        'Consulta la dinámica de arrendamiento local: ¿cuánto tiempo tarda en arrendarse un inmueble similar?',
        'Evalúa la accesibilidad vial y la oferta de servicios: colegios, salud y comercio definen la demanda residencial.',
      ]},
    ],
    ctaText: 'Ver propiedades disponibles',
    ctaPage: 'propiedades',
  },
  {
    id: 6,
    title: 'Tendencias en arrendamiento turístico: La nueva forma de rentabilizar tu propiedad',
    excerpt: 'Descubre cómo muchos propietarios en Medellín están multiplicando sus ingresos con arrendamiento turístico de corta duración.',
    date: 'Abril 15, 2026',
    category: 'Arrendamiento',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
    readTime: '6 min',
    intro: 'Medellín se ha convertido en uno de los destinos más visitados de Latinoamérica. Ese flujo de turistas ha creado una demanda creciente por alojamiento de corta duración que algunos propietarios ya están aprovechando con muy buenos resultados.',
    blocks: [
      { type: 'heading', text: 'Medellín en el mapa del turismo regional' },
      { type: 'paragraph', text: 'Con más de 3 millones de visitantes anuales y una oferta creciente de eventos internacionales, convenciones y turismo de bienestar, Medellín ha consolidado una demanda de alojamiento que no siempre puede satisfacer la oferta hotelera tradicional. Esto abre una ventana real para propietarios de apartamentos bien ubicados.' },
      { type: 'heading', text: '¿Cuánto más se puede ganar?' },
      { type: 'paragraph', text: 'Un apartamento de 2 habitaciones en El Poblado con arriendo tradicional de $2.500.000 mensuales puede generar entre $4.000.000 y $6.500.000 mensuales como alojamiento turístico en temporada alta, con una ocupación promedio del 70–80%. La diferencia es significativa, pero tiene costos que hay que calcular bien.' },
      { type: 'heading', text: 'Los costos reales del arriendo turístico' },
      { type: 'list', items: [
        'Plataformas (Airbnb, Booking): entre 3% y 15% de comisión por reserva.',
        'Limpieza entre huéspedes: $80.000 – $150.000 por rotación.',
        'Dotación y mantenimiento continuo: ropa de cama, amenities, electrodomésticos.',
        'Mayor desgaste del inmueble por la rotación frecuente.',
        'Gestión activa: atención al huésped, check-in/check-out, resolución de problemas 24/7.',
      ]},
      { type: 'highlight', text: 'La rentabilidad real del arriendo turístico está entre un 20% y un 40% por encima del arrendamiento tradicional, no en el doble que muestran los cálculos brutos. Con la gestión correcta, sigue siendo una opción muy atractiva.' },
      { type: 'heading', text: '¿En qué zonas de Medellín funciona mejor?' },
      { type: 'list', items: [
        'El Poblado (Parque Lleras, Provenza y Astorga): el 60% de la demanda turística se concentra aquí.',
        'Laureles y Estadio: crecimiento sostenido de turismo familiar y de negocios.',
        'El Centro Histórico: nicho en crecimiento para turismo cultural.',
        'Envigado: opción emergente con perfil más tranquilo y precios más competitivos.',
      ]},
      { type: 'heading', text: 'Lo que debes saber antes de empezar' },
      { type: 'paragraph', text: 'En Colombia, el arrendamiento turístico de corta duración no está prohibido, pero puede estar regulado por el reglamento de propiedad horizontal de tu edificio. Antes de publicar tu propiedad en plataformas, revisa el manual de convivencia y consulta a la administración. También es recomendable una póliza específica para este tipo de uso.' },
    ],
    ctaText: 'Consigna tu propiedad',
    ctaPage: 'consignacion',
  },
];
