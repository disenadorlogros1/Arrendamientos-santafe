'use client';

import type { PageType } from '@/components/Header';

interface PropietariosBlockProps {
  onNavigate: (page: PageType) => void;
}

const WHATSAPP_URL =
  'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consignar%20una%20propiedad%20con%20Arrendamientos%20Santa%20Fe.';

const FONT_BODY = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const FONT_HEADING = "'Avenir LT Pro 85 Heavy', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const RED = '#f32735';

function StatCard({ number, label, sublabel }: { number: string; label: string; sublabel: string }) {
  return (
    <div
      style={{
        background: '#2d2d2d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
      }}
    >
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontSize: '64px',
          fontWeight: 800,
          color: '#FFFFFF',
          lineHeight: 1,
        }}
      >
        {number}
      </span>
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: '20px',
          fontWeight: 500,
          color: '#FFFFFF',
          marginTop: '10px',
          lineHeight: 1,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: '14px',
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.6)',
          marginTop: '5px',
          lineHeight: 1,
        }}
      >
        {sublabel}
      </span>
    </div>
  );
}

function PhotoCell({ url }: { url: string }) {
  return (
    <div
      style={{
        backgroundImage: `url(${url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}

export default function PropietariosBlock({ onNavigate }: PropietariosBlockProps) {
  return (
    <section
      style={{
        background: '#000000',
        display: 'grid',
        gridTemplateColumns: '615px 1fr',
        width: '1920px',
        height: '500px',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      {/* ── COLUMNA IZQUIERDA ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '20px',
          padding: '40px 55px 40px 65px',
        }}
      >
        {/* Título */}
        <div style={{ lineHeight: 1.2 }}>
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: '34px',
              fontWeight: 400,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            ¿Tienes un inmueble para
          </p>
          <p
            style={{
              fontFamily: FONT_HEADING,
              fontSize: '34px',
              fontWeight: 800,
              fontStyle: 'italic',
              color: RED,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            arrendar o vender?
          </p>
        </div>

        {/* Descripción */}
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: '15px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.75)',
            margin: 0,
            lineHeight: 1.55,
          }}
        >
          Más de 60 años gestionando propiedades en Antioquia. Tu inmueble en
          manos de quienes conocen el mercado inmobiliario regional.
        </p>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onNavigate('consignacion')}
            style={{
              background: RED,
              color: '#FFFFFF',
              padding: '13px 18px',
              fontSize: '14px',
              fontWeight: 500,
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
              fontFamily: FONT_BODY,
              flex: 1,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#aa182c')}
            onMouseLeave={(e) => (e.currentTarget.style.background = RED)}
          >
            Consignar mi propiedad
          </button>

          <button
            onClick={() => window.open(WHATSAPP_URL, '_blank')}
            style={{
              background: RED,
              color: '#FFFFFF',
              padding: '13px 18px',
              fontSize: '14px',
              fontWeight: 500,
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
              fontFamily: FONT_BODY,
              flex: 1,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#aa182c')}
            onMouseLeave={(e) => (e.currentTarget.style.background = RED)}
          >
            Hablar con un asesor
          </button>
        </div>

        {/* Nota */}
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: '13px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.55)',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Te avisamos cuando haya un arrendatario interesado.{' '}
          <strong style={{ fontWeight: 700, color: '#FFFFFF' }}>
            Sin demoras, sin contratiempos.
          </strong>
        </p>
      </div>

      {/* ── GRID DERECHO 3 × 2 ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '3px',
        }}
      >
        {/* Fila 1 */}
        <StatCard number="+1000" label="inmuebles" sublabel="en gestión activa" />
        <PhotoCell url="https://images.unsplash.com/photo-1570129477492-45ac003f2e18?auto=format&fit=crop&w=700&h=350&q=80" />
        <PhotoCell url="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=700&h=350&q=80" />

        {/* Fila 2 */}
        <PhotoCell url="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=700&h=350&q=80" />
        <StatCard number="60" label="años" sublabel="de experiencia" />
        <StatCard number="3" label="sedes" sublabel="en Antioquia" />
      </div>
    </section>
  );
}
