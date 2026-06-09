'use client';

import { useRef } from 'react';
import type { PageType } from '@/components/Header';

interface PropietariosBlockProps {
  onNavigate: (page: PageType) => void;
}

const WHATSAPP_URL =
  'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consignar%20una%20propiedad%20con%20Arrendamientos%20Santa%20Fe.';

export default function PropietariosBlock({ onNavigate }: PropietariosBlockProps) {
  const containerRef = useRef<SVGSVGElement>(null);

  return (
    <section
      className="relative w-full overflow-hidden bg-black"
      style={{ padding: 'clamp(2rem, 5vw, 5rem) clamp(1rem, 4vw, 2rem)' }}
    >
      <div className="relative w-full flex justify-center">
        {/* SVG Background (sin textos) */}
        <div className="relative w-full max-w-6xl">
          <svg
            ref={containerRef}
            viewBox="0 0 1920 496.09"
            className="w-full"
            style={{ height: 'auto' }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <style>
                {`
                .cls-7 {
                  fill: #fff;
                }
                .cls-12 {
                  fill: #ce0e2d;
                }
                .cls-15 {
                  fill: none;
                }
                .cls-20 {
                  opacity: .2;
                }
                `}
              </style>
              <clipPath id="clippath">
                <rect className="cls-15" x="1160.82" y="58.95" width="321.12" height="186.73" />
              </clipPath>
              <clipPath id="clippath-1">
                <rect className="cls-15" x="1487.75" y="58.95" width="321.12" height="186.73" />
              </clipPath>
              <clipPath id="clippath-2">
                <rect className="cls-15" x="835" y="251.21" width="321.12" height="186.73" />
              </clipPath>
            </defs>

            {/* Background */}
            <g id="Vectores_de_fondo" data-name="Vectores de fondo">
              <rect x="1.05" y="-3.56" width="1917.89" height="501.75" fill="#000" />
            </g>

            {/* Shapes */}
            <g id="Vectores">
              {/* Button backgrounds */}
              <rect
                className="cls-12 cursor-pointer hover:opacity-90 transition-opacity"
                x="132.43"
                y="257.96"
                width="330.48"
                height="54"
                onClick={() => onNavigate('consignacion')}
              />
              <rect
                className="cls-12 cursor-pointer hover:opacity-90 transition-opacity"
                x="471.07"
                y="257.96"
                width="330.48"
                height="54"
                onClick={() => window.open(WHATSAPP_URL, '_blank')}
              />

              {/* Decorative boxes */}
              <g className="cls-20">
                <rect className="cls-7" x="833.99" y="58.95" width="321.12" height="186.73" />
                <rect className="cls-7" x="1160.82" y="250.42" width="321.12" height="186.73" />
                <rect className="cls-7" x="1487.64" y="58.95" width="321.12" height="186.73" />
                <rect className="cls-7" x="1487.64" y="250.42" width="321.12" height="186.73" />
              </g>
            </g>
          </svg>

          {/* HTML Texts - Overlay real */}
          <div className="absolute inset-0 flex items-start justify-start pointer-events-none">
            {/* Main Title */}
            <div
              className="absolute cursor-text pointer-events-auto"
              style={{
                left: 'clamp(60px, 7%, 132px)',
                top: 'clamp(85px, 29%, 145px)',
                maxWidth: '550px',
              }}
            >
              <h2
                style={{
                  fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: 'clamp(28px, 5vw, 39px)',
                  lineHeight: 1.2,
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                ¿Tienes un inmueble para{' '}
                <span style={{ color: '#ce0e2d', fontWeight: 700 }}>arrendar o vender?</span>
              </h2>
            </div>

            {/* Description */}
            <div
              className="absolute cursor-text pointer-events-auto"
              style={{
                left: 'clamp(60px, 7%, 134px)',
                top: 'clamp(150px, 43%, 212px)',
                maxWidth: '550px',
              }}
            >
              <p
                style={{
                  fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: 'clamp(14px, 2.5vw, 20px)',
                  lineHeight: 1.45,
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                Más de 60 años gestionando propiedades en Antioquia. Tu inmueble en manos de quienes
                conocen el mercado inmobiliario regional.
              </p>
            </div>

            {/* Bottom description */}
            <div
              className="absolute cursor-text pointer-events-auto"
              style={{
                left: 'clamp(60px, 7%, 134px)',
                top: 'clamp(280px, 70%, 348px)',
                maxWidth: '550px',
              }}
            >
              <p
                style={{
                  fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: 'clamp(12px, 2vw, 16px)',
                  lineHeight: 1.45,
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                Te avisamos cuando haya un arrendatario interesado.{' '}
                <span style={{ fontWeight: 700, color: '#ffffff' }}>Sin demoras, sin contratiempos.</span>
              </p>
            </div>

            {/* Button 1 Text */}
            <button
              onClick={() => onNavigate('consignacion')}
              className="absolute cursor-pointer pointer-events-auto hover:opacity-80 transition-opacity bg-transparent border-none p-0"
              style={{
                left: 'clamp(95px, 9.5%, 181px)',
                top: 'clamp(265px, 52.5%, 291px)',
                width: '180px',
              }}
            >
              <p
                style={{
                  fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: 'clamp(14px, 2.5vw, 20px)',
                  lineHeight: 1.2,
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                Consignar mi propiedad
              </p>
            </button>

            {/* Button 2 Text */}
            <button
              onClick={() => window.open(WHATSAPP_URL, '_blank')}
              className="absolute cursor-pointer pointer-events-auto hover:opacity-80 transition-opacity bg-transparent border-none p-0"
              style={{
                left: 'clamp(350px, 28%, 539px)',
                top: 'clamp(265px, 52.5%, 291px)',
                width: '200px',
              }}
            >
              <p
                style={{
                  fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: 'clamp(14px, 2.5vw, 20px)',
                  lineHeight: 1.2,
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                Hablar con un asesor
              </p>
            </button>

            {/* Metrics - 60 years */}
            <div
              className="absolute text-center cursor-text pointer-events-auto"
              style={{
                right: 'clamp(80px, 15%, 334px)',
                top: 'clamp(220px, 69%, 342px)',
              }}
            >
              <p
                style={{
                  fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(48px, 8vw, 70px)',
                  lineHeight: 1,
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                60
              </p>
              <p
                style={{
                  fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(28px, 4vw, 39px)',
                  lineHeight: 1.1,
                  color: '#ffffff',
                  marginTop: '4px',
                  margin: '4px 0 0 0',
                }}
              >
                años
              </p>
              <p
                style={{
                  fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: 'clamp(14px, 2.5vw, 20px)',
                  lineHeight: 1.2,
                  color: '#ffffff',
                  marginTop: '2px',
                  margin: '2px 0 0 0',
                }}
              >
                de experiencia
              </p>
            </div>

            {/* Metrics - +1000 */}
            <div
              className="absolute text-center cursor-text pointer-events-auto"
              style={{
                left: 'clamp(440px, 46%, 883px)',
                top: 'clamp(90px, 30%, 151px)',
              }}
            >
              <p
                style={{
                  fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(48px, 8vw, 70px)',
                  lineHeight: 1,
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                +1000
              </p>
              <p
                style={{
                  fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(28px, 4vw, 39px)',
                  lineHeight: 1.1,
                  color: '#ffffff',
                  marginTop: '4px',
                  margin: '4px 0 0 0',
                }}
              >
                inmuebles
              </p>
              <p
                style={{
                  fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: 'clamp(14px, 2.5vw, 20px)',
                  lineHeight: 1.2,
                  color: '#ffffff',
                  marginTop: '2px',
                  margin: '2px 0 0 0',
                }}
              >
                en gestión activa
              </p>
            </div>

            {/* Metrics - 3 sedes */}
            <div
              className="absolute text-center cursor-text pointer-events-auto"
              style={{
                right: 'clamp(80px, 15%, 294px)',
                top: 'clamp(250px, 68%, 337px)',
              }}
            >
              <p
                style={{
                  fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(48px, 8vw, 70px)',
                  lineHeight: 1,
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                3
              </p>
              <p
                style={{
                  fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(28px, 4vw, 39px)',
                  lineHeight: 1.1,
                  color: '#ffffff',
                  marginTop: '4px',
                  margin: '4px 0 0 0',
                }}
              >
                sedes
              </p>
              <p
                style={{
                  fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: 'clamp(14px, 2.5vw, 20px)',
                  lineHeight: 1.2,
                  color: '#ffffff',
                  marginTop: '2px',
                  margin: '2px 0 0 0',
                }}
              >
                en Antioquia
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
