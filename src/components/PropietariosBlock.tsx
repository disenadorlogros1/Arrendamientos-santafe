'use client';

import type { PageType } from '@/components/Header';

interface PropietariosBlockProps {
  onNavigate: (page: PageType) => void;
}

const WHATSAPP_URL =
  'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consignar%20una%20propiedad%20con%20Arrendamientos%20Santa%20Fe.';

const FONT = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', sans-serif";

function StatCard({ number, label, sublabel }: { number: string; label: string; sublabel: string }) {
  return (
    <div
      style={{
        background: '#1E1E1E',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontSize: '78px',
          fontWeight: 800,
          color: '#FFFFFF',
          lineHeight: 1,
        }}
      >
        {number}
      </span>
      <span
        style={{
          fontFamily: FONT,
          fontSize: '22px',
          fontWeight: 400,
          color: '#FFFFFF',
          marginTop: '12px',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: FONT,
          fontSize: '15px',
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.6)',
          marginTop: '5px',
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
          gap: '22px',
          padding: '40px 55px 40px 65px',
        }}
      >
        {/* Título */}
        <div>
          <p
            style={{
              fontFamily: FONT,
              fontSize: '36px',
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
              fontFamily: FONT,
              fontSize: '36px',
              fontWeight: 700,
              fontStyle: 'italic',
              color: '#D62828',
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
            fontFamily: FONT,
            fontSize: '16px',
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
              background: '#D62828',
              color: '#FFFFFF',
              padding: '14px 20px',
              fontSize: '15px',
              fontWeight: 500,
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontFamily: FONT,
              flex: 1,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Consignar mi propiedad
          </button>

          <button
            onClick={() => window.open(WHATSAPP_URL, '_blank')}
            style={{
              background: '#D62828',
              color: '#FFFFFF',
              padding: '14px 20px',
              fontSize: '15px',
              fontWeight: 500,
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontFamily: FONT,
              flex: 1,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Hablar con un asesor
          </button>
        </div>

        {/* Nota */}
        <p
          style={{
            fontFamily: FONT,
            fontSize: '13px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.55)',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Te avisamos cuando haya un arrendatario interesado.{' '}
          <span style={{ fontWeight: 700, color: '#FFFFFF' }}>
            Sin demoras, sin contratiempos.
          </span>
        </p>
      </div>

      {/* ── GRID DERECHO 3 × 2 ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '5px',
        }}
      >
        {/* Fila 1 */}
        <StatCard number="+1000" label="inmuebles" sublabel="en gestión activa" />
        <PhotoCell url="https://images.unsplash.com/photo-1570129477492-45ac003f2e18?auto=format&fit=crop&w=600&h=400&q=80" />
        <PhotoCell url="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&h=400&q=80" />

        {/* Fila 2 */}
        <PhotoCell url="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&h=400&q=80" />
        <StatCard number="60" label="años" sublabel="de experiencia" />
        <StatCard number="3" label="sedes" sublabel="en Antioquia" />
      </div>
    </section>
  );
}
