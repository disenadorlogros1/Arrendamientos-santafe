'use client';

import { useRef } from 'react';
import type { PageType } from '@/components/Header';

interface PropietariosBlockProps {
  onNavigate: (page: PageType) => void;
}

const WHATSAPP_URL =
  'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consignar%20una%20propiedad%20con%20Arrendamientos%20Santa%20Fe.';

export default function PropietariosBlock({ onNavigate }: PropietariosBlockProps) {
  return (
    <section
      style={{
        background: '#000000',
        display: 'grid',
        gridTemplateColumns: '1fr 1.76fr 1fr 1fr',
        gap: '10px',
        padding: '80px 60px',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      {/* LEFT COLUMN - Textos y botones */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: '20px',
          paddingRight: '40px',
        }}
      >
        {/* Título línea 1 */}
        <div>
          <p
            style={{
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', sans-serif",
              fontSize: '32px',
              fontWeight: 400,
              color: '#FFFFFF',
              margin: '0 0 5px 0',
              lineHeight: 1.2,
            }}
          >
            ¿Tienes un inmueble para
          </p>
          <p
            style={{
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', sans-serif",
              fontSize: '32px',
              fontWeight: 700,
              color: '#D62828',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            arrendar o vender?
          </p>
        </div>

        {/* Párrafo descriptivo */}
        <p
          style={{
            fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', sans-serif",
            fontSize: '14px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Más de 60 años gestionando propiedades en Antioquia. Tu inmueble en manos de quienes conocen el
          mercado inmobiliario regional.
        </p>

        {/* Botones - GRANDES */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginTop: '20px',
          }}
        >
          <button
            onClick={() => onNavigate('consignacion')}
            style={{
              background: '#D62828',
              color: '#FFFFFF',
              padding: '16px 20px',
              fontSize: '16px',
              fontWeight: 600,
              border: 'none',
              borderRadius: '0px',
              cursor: 'pointer',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', sans-serif",
              width: '100%',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Consignar mi propiedad
          </button>

          <button
            onClick={() => window.open(WHATSAPP_URL, '_blank')}
            style={{
              background: '#D62828',
              color: '#FFFFFF',
              padding: '16px 20px',
              fontSize: '16px',
              fontWeight: 600,
              border: 'none',
              borderRadius: '0px',
              cursor: 'pointer',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', sans-serif",
              width: '100%',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Hablar con un asesor
          </button>
        </div>

        {/* Texto de aviso */}
        <p
          style={{
            fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', sans-serif",
            fontSize: '13px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.7)',
            margin: '20px 0 0 0',
            lineHeight: 1.5,
          }}
        >
          Te avisamos cuando haya un arrendatario interesado.{' '}
          <span style={{ fontWeight: 700, color: '#FFFFFF' }}>Sin demoras, sin contratiempos.</span>
        </p>
      </div>

      {/* RIGHT GRID - 3 columnas × 2 filas */}
      <div
        style={{
          display: 'grid',
          gridColumn: '2 / 5',
          gridTemplateColumns: '1.76fr 1fr 1fr',
          gridTemplateRows: '240px 360px',
          gap: '10px',
          height: 'fit-content',
        }}
      >
        {/* Tarjeta +1000 */}
        <div
          style={{
            gridArea: '1 / 1 / 2 / 2',
            background: 'linear-gradient(180deg, #222222 0%, #1A1A1A 100%)',
            borderRadius: '0px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px',
          }}
        >
          <div
            style={{
              fontSize: '56px',
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', sans-serif",
              lineHeight: 1,
            }}
          >
            +1000
          </div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 400,
              color: '#FFFFFF',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', sans-serif",
              marginTop: '12px',
            }}
          >
            inmuebles
          </div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', sans-serif",
              marginTop: '4px',
            }}
          >
            en gestión activa
          </div>
        </div>

        {/* Imagen 1 */}
        <div
          style={{
            gridArea: '1 / 2 / 2 / 3',
            backgroundImage:
              'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '0px',
          }}
        />

        {/* Imagen 2 */}
        <div
          style={{
            gridArea: '1 / 3 / 2 / 4',
            backgroundImage:
              'url(https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '0px',
          }}
        />

        {/* Imagen 3 - GRANDE (ocupa col 1) */}
        <div
          style={{
            gridArea: '2 / 1 / 3 / 2',
            backgroundImage:
              'url(https://images.unsplash.com/photo-1570129477492-45ac003f2e18?auto=format&fit=crop&w=400&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '0px',
          }}
        />

        {/* Tarjeta 60 años */}
        <div
          style={{
            gridArea: '2 / 2 / 3 / 3',
            background: 'linear-gradient(180deg, #222222 0%, #1A1A1A 100%)',
            borderRadius: '0px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px',
          }}
        >
          <div
            style={{
              fontSize: '56px',
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', sans-serif",
              lineHeight: 1,
            }}
          >
            60
          </div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 400,
              color: '#FFFFFF',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', sans-serif",
              marginTop: '12px',
            }}
          >
            años
          </div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', sans-serif",
              marginTop: '4px',
            }}
          >
            de experiencia
          </div>
        </div>

        {/* Tarjeta 3 sedes */}
        <div
          style={{
            gridArea: '2 / 3 / 3 / 4',
            background: 'linear-gradient(180deg, #222222 0%, #1A1A1A 100%)',
            borderRadius: '0px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px',
          }}
        >
          <div
            style={{
              fontSize: '56px',
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', sans-serif",
              lineHeight: 1,
            }}
          >
            3
          </div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 400,
              color: '#FFFFFF',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', sans-serif",
              marginTop: '12px',
            }}
          >
            sedes
          </div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', sans-serif",
              marginTop: '4px',
            }}
          >
            en Antioquia
          </div>
        </div>
      </div>
    </section>
  );
}
