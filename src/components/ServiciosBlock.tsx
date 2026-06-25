'use client';

import type { PageType } from '@/components/Header';

interface ServiciosBlockProps {
  onNavigate: (page: PageType) => void;
}

const FONT_BODY    = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const FONT_HEADING = "'Avenir LT Std', 'Outfit', system-ui, sans-serif";
const RED          = '#f32735';
const PHONE        = '573006557529';

function applyInkFill(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const size = Math.max(
    Math.hypot(x, y),
    Math.hypot(rect.width - x, y),
    Math.hypot(x, rect.height - y),
    Math.hypot(rect.width - x, rect.height - y),
  ) * 2;
  el.style.setProperty('--x', `${x}px`);
  el.style.setProperty('--y', `${y}px`);
  el.style.setProperty('--size', `${size}px`);
}

const servicios = [
  {
    icon: '/icons/icon-home-red.gif',
    title: 'Arrendamientos',
    description:
      'Sabemos que encontrar el inmueble indicado no es solo buscar, es encontrar el lugar donde vas a vivir o trabajar. Estamos aquí para que ese proceso sea fácil, seguro y a tu medida.',
    waMsg:
      'Hola, estoy buscando un inmueble para arrendar y me gustaría recibir asesoría. ¿Me pueden ayudar?',
  },
  {
    icon: '/icons/icon-credit-card-red.gif',
    title: 'Ventas',
    description:
      'Comprar un inmueble es una de las decisiones más importantes de tu vida. Te acompañamos con el conocimiento del mercado y la experiencia para que elijas con seguridad.',
    waMsg:
      'Hola, estoy interesado/a en comprar un inmueble y quisiera recibir orientación. ¿Me pueden ayudar?',
  },
  {
    icon: '/icons/icon-consult-red.gif',
    title: 'Consignación',
    description:
      'Tu propiedad merece estar en buenas manos. Nos encargamos de encontrar el cliente adecuado con la seriedad y el respaldo de 60 años en el mercado inmobiliario antioqueño.',
    waMsg:
      'Hola, tengo un inmueble disponible y me interesa consignarlo con Arrendamientos Santa Fe. ¿Me pueden dar más información sobre el proceso?',
  },
  {
    icon: '/icons/icon-area-red.gif',
    title: 'Avalúos',
    description:
      'Conocer el valor real de tu inmueble es el primer paso para tomar buenas decisiones. Te damos una valoración técnica, honesta y ajustada al mercado actual.',
    waMsg:
      'Hola, quisiera solicitar un avalúo comercial para mi inmueble. ¿Me pueden indicar cómo funciona el proceso?',
  },
  {
    icon: '/icons/icon-dollar-red.gif',
    title: 'Hipotecas',
    description:
      '¿Necesitas dinero? Préstamos en hipoteca al 1.5% de interés, pagos anticipados sin penalización y abonos a capital desde $1.000.000',
    waMsg:
      'Hola, tengo un inmueble y estoy explorando la posibilidad de obtener un préstamo hipotecario. Me gustaría saber cómo funciona el proceso con Arrendamientos Santa Fe.',
  },
];

export default function ServiciosBlock({ onNavigate: _onNavigate }: ServiciosBlockProps) {
  return (
    <section style={{ background: '#fff' }} className="w-full overflow-hidden">

      {/* Título */}
      <div
        className="px-6 sm:px-10 lg:px-14"
        style={{ paddingTop: '28px', paddingBottom: '28px', textAlign: 'center' }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontWeight: 300,
            fontSize: 'clamp(26px, 2.6vw, 46px)',
            color: '#555',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Nuestros <span style={{ fontWeight: 700 }}>servicios</span>
        </h2>
      </div>

      {/* Grid de servicios */}
      <div
        className="px-6 sm:px-10 lg:px-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        style={{ paddingBottom: '52px', gap: '20px' }}
      >
        {servicios.map((s) => {
          const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(s.waMsg)}`;
          return (
            <div
              key={s.title}
              className="flex flex-col"
              style={{
                gap: '14px',
                padding: '24px 20px 20px',
                borderRadius: '10px',
                border: '1px solid #eeeeee',
                background: '#fff',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              }}
            >
              {/* Ícono */}
              <img
                src={s.icon}
                alt=""
                width={40}
                height={40}
                style={{ flexShrink: 0, display: 'block' }}
              />

              {/* Título */}
              <h3
                style={{
                  fontFamily: FONT_HEADING,
                  fontWeight: 700,
                  fontSize: 'clamp(16px, 1.2vw, 20px)',
                  color: '#232222',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {s.title}
              </h3>

              {/* Descripción */}
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 'clamp(12.5px, 0.9vw, 14px)',
                  color: '#666',
                  margin: 0,
                  lineHeight: 1.65,
                  flexGrow: 1,
                }}
              >
                {s.description}
              </p>

              {/* CTA WhatsApp con hero-btn-fill */}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={applyInkFill}
                onMouseLeave={applyInkFill}
                className="hero-btn-fill inline-flex items-center justify-center rounded-full"
                style={{
                  fontFamily: FONT_BODY,
                  fontWeight: 300,
                  fontSize: 'clamp(13px, 0.95vw, 15px)',
                  textDecoration: 'none',
                  height: '42px',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  alignSelf: 'flex-start',
                  background: '#232222',
                }}
              >
                <span>Hablar con un asesor</span>
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
