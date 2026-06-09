'use client';

import { useRef } from 'react';
import { useSplitTextAnimation } from '@/hooks/useSplitTextAnimation';
import type { PageType } from '@/components/Header';

interface PropietariosBlockProps {
  onNavigate: (page: PageType) => void;
}

const WHATSAPP_URL =
  'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consignar%20una%20propiedad%20con%20Arrendamientos%20Santa%20Fe.';

export default function PropietariosBlock({ onNavigate }: PropietariosBlockProps) {
  const { ref: titleRef } = useSplitTextAnimation('.propietarios-title-split', 0, true);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#121212',
        padding: '20px',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Responsive styles with inline media queries */}
      <style>{`
        @media (max-width: 900px) {
          .propietarios-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .propietarios-cta {
            grid-column: span 2 !important;
          }
        }

        @media (max-width: 550px) {
          .propietarios-grid {
            grid-template-columns: 1fr !important;
          }
          .propietarios-cta,
          .propietarios-metric,
          .propietarios-image,
          .propietarios-data {
            grid-column: span 1 !important;
          }
          .propietarios-cta {
            grid-row: span 1 !important;
          }
          .propietarios-grid h1 {
            font-size: 1.2rem !important;
          }
          .propietarios-grid p {
            font-size: 0.75rem !important;
          }
          .propietarios-grid button,
          .propietarios-grid a {
            font-size: 0.75rem !important;
            padding: 8px 16px !important;
          }
        }
      `}</style>

      {/* Bento Grid Container */}
      <div
        ref={containerRef}
        className="propietarios-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridAutoRows: 'minmax(140px, auto)',
          gap: '12px',
          maxWidth: '1100px',
          width: '100%',
          backgroundColor: '#000000',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* CTA Block - Lado Izquierdo (2x2) */}
        <div
          className="propietarios-cta"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2',
            backgroundColor: '#000000',
            borderRadius: '8px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #2d2d2d',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,255,255,0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div>
            <h1
              ref={titleRef}
              className="propietarios-title-split"
              style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                lineHeight: 1.3,
                marginBottom: '12px',
                color: '#ffffff',
                fontFamily: "'Avenir Next Ultra Light', 'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif",
              }}
            >
              ¿Tienes un inmueble para <br />
              <span style={{ color: '#e53935' }}>arrendar o vender?</span>
            </h1>
            <p
              style={{
                fontSize: '0.85rem',
                color: '#b0b0b0',
                lineHeight: 1.5,
                marginBottom: '24px',
                fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
              }}
            >
              Más de 60 años gestionando propiedades en Antioquia. Tu inmueble en manos de quienes conocen el mercado inmobiliario regional.
            </p>
          </div>

          {/* Button Group */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onNavigate('consignacion')}
              style={{
                padding: '12px 20px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor: '#e53935',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d32f2f';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#e53935';
              }}
            >
              Consignar mi propiedad
            </button>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '12px 20px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1px solid #e53935',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                textDecoration: 'none',
                textAlign: 'center',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(229, 57, 53, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Hablar con un asesor
            </a>
          </div>
        </div>

        {/* Metric Block +1000 */}
        <div
          className="propietarios-metric"
          style={{
            gridColumn: 'span 1',
            gridRow: 'span 1',
            backgroundColor: '#262626',
            borderRadius: '8px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,255,255,0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff' }}>+1000</div>
          <div style={{ fontSize: '0.8rem', color: '#a0a0a0', marginTop: '4px' }}>inmuebles en gestión activa</div>
        </div>

        {/* Image Block 1 */}
        <div
          className="propietarios-image"
          style={{
            gridColumn: 'span 1',
            gridRow: 'span 1',
            backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,255,255,0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />

        {/* Image Block 2 */}
        <div
          className="propietarios-image"
          style={{
            gridColumn: 'span 1',
            gridRow: 'span 1',
            backgroundImage: 'url(https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,255,255,0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />

        {/* Data Block 60 años */}
        <div
          className="propietarios-data"
          style={{
            gridColumn: 'span 1',
            gridRow: 'span 1',
            backgroundColor: '#333333',
            borderRadius: '8px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,255,255,0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ffffff' }}>60</div>
          <div style={{ fontSize: '0.75rem', color: '#cccccc', marginTop: '2px' }}>años de experiencia</div>
        </div>

        {/* Data Block 3 sedes */}
        <div
          className="propietarios-data"
          style={{
            gridColumn: 'span 1',
            gridRow: 'span 1',
            backgroundColor: '#333333',
            borderRadius: '8px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,255,255,0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ffffff' }}>3</div>
          <div style={{ fontSize: '0.75rem', color: '#cccccc', marginTop: '2px' }}>sedes en Antioquia</div>
        </div>
      </div>
    </section>
  );
}
