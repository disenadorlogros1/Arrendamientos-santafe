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
      className="w-full"
      style={{
        background: '#000000',
        display: 'grid',
        gridTemplateColumns: '410px 1fr',
        gap: '10px',
        padding: '120px 65px',
        maxWidth: '1920px',
        minHeight: '1080px',
        margin: '0 auto',
      }}
    >
      {/* LEFT COLUMN - Textos y botones */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '25px',
        }}
      >
        {/* Título línea 1 */}
        <h2
          style={{
            fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontSize: '36px',
            fontWeight: 400,
            color: '#FFFFFF',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          ¿Tienes un inmueble para
        </h2>

        {/* Título línea 2 (rojo) */}
        <h2
          style={{
            fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontSize: '36px',
            fontWeight: 700,
            color: '#D62828',
            margin: 0,
            lineHeight: 1.2,
            marginTop: '-15px',
          }}
        >
          arrendar o vender?
        </h2>

        {/* Párrafo descriptivo */}
        <p
          style={{
            fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontSize: '16px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0,
            lineHeight: 1.45,
            marginTop: '10px',
          }}
        >
          Más de 60 años gestionando propiedades en Antioquia. Tu inmueble en manos de quienes conocen el
          mercado inmobiliario regional.
        </p>

        {/* Botones */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginTop: '5px',
          }}
        >
          <button
            onClick={() => onNavigate('consignacion')}
            style={{
              background: '#D62828',
              color: '#FFFFFF',
              padding: '14px 24px',
              fontSize: '15px',
              fontWeight: 500,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
              width: '190px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Consignar mi propiedad
          </button>

          <button
            onClick={() => window.open(WHATSAPP_URL, '_blank')}
            style={{
              background: '#D62828',
              color: '#FFFFFF',
              padding: '14px 24px',
              fontSize: '15px',
              fontWeight: 500,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
              width: '190px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Hablar con un asesor
          </button>
        </div>

        {/* Texto de aviso */}
        <p
          style={{
            fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontSize: '13px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.6)',
            margin: 0,
            lineHeight: 1.45,
            marginTop: '5px',
          }}
        >
          Te avisamos cuando haya un arrendatario interesado.{' '}
          <span style={{ fontWeight: 700, color: '#FFFFFF' }}>Sin demoras, sin contratiempos.</span>
        </p>
      </div>

      {/* RIGHT COLUMN - Grid de tarjetas e imágenes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.76fr 1fr 1fr',
          gridTemplateRows: '250px 380px',
          gap: '10px',
        }}
      >
        {/* Tarjeta +1000 */}
        <div
          style={{
            gridArea: '1 / 1 / 2 / 2',
            background: 'linear-gradient(180deg, #222222, #1A1A1A)',
            borderRadius: '0px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 50px',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
              lineHeight: 1,
            }}
          >
            +1000
          </div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 400,
              color: '#FFFFFF',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
              marginTop: '20px',
            }}
          >
            inmuebles
          </div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
              marginTop: '5px',
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

        {/* Imagen 3 */}
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
            background: 'linear-gradient(180deg, #222222, #1A1A1A)',
            borderRadius: '0px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 50px',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
              lineHeight: 1,
            }}
          >
            60
          </div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 400,
              color: '#FFFFFF',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
              marginTop: '20px',
            }}
          >
            años
          </div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
              marginTop: '5px',
            }}
          >
            de experiencia
          </div>
        </div>

        {/* Tarjeta 3 sedes */}
        <div
          style={{
            gridArea: '2 / 3 / 3 / 4',
            background: 'linear-gradient(180deg, #222222, #1A1A1A)',
            borderRadius: '0px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 50px',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
              lineHeight: 1,
            }}
          >
            3
          </div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 400,
              color: '#FFFFFF',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
              marginTop: '20px',
            }}
          >
            sedes
          </div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
              marginTop: '5px',
            }}
          >
            en Antioquia
          </div>
        </div>
      </div>
    </section>
  );
}
