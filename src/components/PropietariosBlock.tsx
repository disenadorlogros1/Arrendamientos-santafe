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
    <section className="relative w-full overflow-hidden bg-black" style={{ padding: 'clamp(2rem, 5vw, 5rem) clamp(1rem, 4vw, 2rem)' }}>
      <div className="flex w-full justify-center">
        <svg
          ref={containerRef}
          viewBox="0 0 1920 496.09"
          className="w-full"
          style={{ height: 'auto', maxWidth: '1400px' }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <style>
              {`
              .cls-1, .cls-2, .cls-3, .cls-4 {
                font-family: 'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif;
                font-weight: 800;
              }

              .cls-5, .cls-6, .cls-7, .cls-3, .cls-8, .cls-4 {
                fill: #fff;
              }

              .cls-5, .cls-6, .cls-9, .cls-10, .cls-11 {
                font-family: 'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif;
                font-weight: 300;
              }

              .cls-5, .cls-2, .cls-3 {
                font-size: clamp(28px, 5vw, 39px);
              }

              .cls-12, .cls-2 {
                fill: #ce0e2d;
              }

              .cls-6, .cls-8 {
                font-size: clamp(14px, 2.5vw, 20px);
              }

              .cls-13 {
                letter-spacing: 0em;
              }

              .cls-14 {
                letter-spacing: -.02em;
              }

              .cls-15 {
                fill: none;
              }

              .cls-16 {
                letter-spacing: .02em;
              }

              .cls-17 {
                clip-path: url(#clippath-1);
              }

              .cls-18, .cls-10 {
                letter-spacing: -.02em;
              }

              .cls-19 {
                letter-spacing: 0em;
              }

              .cls-20 {
                opacity: .2;
              }

              .cls-21 {
                letter-spacing: -.09em;
              }

              .cls-22 {
                letter-spacing: -.02em;
              }

              .cls-11 {
                letter-spacing: -.11em;
              }

              .cls-23 {
                clip-path: url(#clippath-2);
              }

              .cls-24 {
                clip-path: url(#clippath);
              }

              .cls-4 {
                font-size: clamp(48px, 8vw, 70px);
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

          {/* Vectors/Shapes */}
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

          {/* Texts */}
          <g id="Textos_inferiores" data-name="Textos inferiores">
            {/* Main title */}
            <text
              className="cls-5"
              transform="translate(132.16 145.13)"
              style={{ cursor: 'default' }}
            >
              <tspan x="0" y="0">
                ¿
              </tspan>
              <tspan className="cls-16" x="18.06" y="0">
                T
              </tspan>
              <tspan x="41.38" y="0">
                ienes un inmueble para{' '}
              </tspan>
            </text>

            {/* Red title */}
            <text className="cls-2" transform="translate(132.16 178.36)">
              <tspan x="0" y="0">
                ar
              </tspan>
              <tspan className="cls-14" x="36.82" y="0">
                r
              </tspan>
              <tspan x="51.99" y="0">
                endar o vender?
              </tspan>
            </text>

            {/* Button 1 text */}
            <text
              className="cls-6 cursor-pointer"
              transform="translate(181.26 291.59)"
              onClick={() => onNavigate('consignacion')}
            >
              <tspan x="0" y="0">
                Consignar mi p
              </tspan>
              <tspan className="cls-22" x="135.24" y="0">
                r
              </tspan>
              <tspan x="141.54" y="0">
                opiedad
              </tspan>
            </text>

            {/* Button 2 text */}
            <text
              className="cls-6 cursor-pointer"
              transform="translate(539.63 291.59)"
              onClick={() => window.open(WHATSAPP_URL, '_blank')}
            >
              <tspan x="0" y="0">
                Hablar con un asesor
              </tspan>
            </text>

            {/* Description text */}
            <text className="cls-6" transform="translate(133.57 212.26)">
              <tspan x="0" y="0">
                Más de 60 años ges
              </tspan>
              <tspan className="cls-19" x="175.38" y="0">
                t
              </tspan>
              <tspan x="182.06" y="0">
                ionando p
              </tspan>
              <tspan className="cls-18" x="272.88" y="0">
                r
              </tspan>
              <tspan x="279.18" y="0">
                opiedades en An
              </tspan>
              <tspan className="cls-13" x="431.11" y="0">
                t
              </tspan>
              <tspan x="437.79" y="0">
                ioquia.
              </tspan>
              <tspan className="cls-21" x="503.39" y="0">
                T
              </tspan>
              <tspan x="513.03" y="0">
                u inmueble en
              </tspan>
              <tspan x="0" y="20">
                manos de quienes conocen el me
              </tspan>
              <tspan className="cls-18" x="298.74" y="20">
                r
              </tspan>
              <tspan x="305.04" y="20">
                cado inmobi
              </tspan>
              <tspan className="cls-19" x="416.19" y="20">
                l
              </tspan>
              <tspan x="421.01" y="20">
                iario
              </tspan>
              <tspan className="cls-18" x="464.73" y="20">
                r
              </tspan>
              <tspan x="471.03" y="20">
                egional.
              </tspan>
            </text>

            {/* Bottom description */}
            <text className="cls-8" transform="translate(134.15 348.58)">
              <tspan className="cls-11" x="0" y="0">
                T
              </tspan>
              <tspan className="cls-9" x="9.26" y="0">
                e avisamos cuando haya un ar
              </tspan>
              <tspan className="cls-10" x="273.92" y="0">
                r
              </tspan>
              <tspan className="cls-9" x="280.22" y="0">
                endatario inte
              </tspan>
              <tspan className="cls-10" x="404.33" y="0">
                r
              </tspan>
              <tspan className="cls-9" x="410.63" y="0">
                esado.
              </tspan>
              <tspan className="cls-1" x="475.15" y="0">
                Sin demoras, sin{' '}
              </tspan>
              <tspan className="cls-1">
                <tspan x="0" y="20">
                  contratiempos.
                </tspan>
              </tspan>
            </text>

            {/* Metrics - 60 years */}
            <text className="cls-4" transform="translate(1286.7917 342.4838)">
              <tspan x="0" y="0">
                60
              </tspan>
            </text>
            <text className="cls-3" transform="translate(1285.6432 382.275)">
              <tspan x="0" y="0">
                años
              </tspan>
            </text>
            <text className="cls-6" transform="translate(1262.6715 403.6371)">
              <tspan x="0" y="0">
                de experiencia
              </tspan>
            </text>

            {/* Metrics - +1000 */}
            <text className="cls-4" transform="translate(883.8 151.01)">
              <tspan x="0" y="0">
                +1000
              </tspan>
            </text>
            <text className="cls-3" transform="translate(896.8 190.8)">
              <tspan x="0" y="0">
                inmuebles
              </tspan>
            </text>
            <text className="cls-6" transform="translate(914.94 212.16)">
              <tspan x="0" y="0">
                en ges
              </tspan>
              <tspan className="cls-19" x="59.3" y="0">
                t
              </tspan>
              <tspan x="65.98" y="0">
                ión ac
              </tspan>
              <tspan className="cls-19" x="118.98" y="0">
                t
              </tspan>
              <tspan x="125.66" y="0">
                iva
              </tspan>
            </text>

            {/* Metrics - 3 sedes */}
            <text className="cls-4" transform="translate(1625.973 337.7366)">
              <tspan x="0" y="0">
                3
              </tspan>
            </text>
            <text className="cls-3" transform="translate(1593.9647 377.5277)">
              <tspan x="0" y="0">
                sedes
              </tspan>
            </text>
            <text className="cls-6" transform="translate(1589.6229 398.8899)">
              <tspan x="0" y="0">
                en An
              </tspan>
              <tspan className="cls-19" x="52.26" y="0">
                t
              </tspan>
              <tspan x="58.94" y="0">
                ioquia
              </tspan>
            </text>
          </g>
        </svg>
      </div>
    </section>
  );
}
