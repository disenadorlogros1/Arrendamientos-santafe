'use client';

import type { PageType } from '@/components/Header';

interface PropietariosBlockProps {
  onNavigate: (page: PageType) => void;
}

const WHATSAPP_URL =
  'https://wa.me/573006557529?text=Hola%2C%20quisiera%20consignar%20una%20propiedad%20con%20Arrendamientos%20Santa%20Fe.';

const FONT_LIGHT   = "'Avenir Next Ultra Light', 'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif";
const FONT_BODY    = "'Avenir LT Pro 65 Medium', 'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const FONT_HEADING = "'Avenir LT Pro 85 Heavy',  'Avenir LT Pro', 'Avenir', 'Outfit', system-ui, sans-serif";
const RED          = '#f32735';

/* ── Sub-componentes ─────────────────────────────────────────────── */

function StatCard({ number, label, sublabel }: { number: string; label: string; sublabel: string }) {
  return (
    <div
      style={{
        background: '#2d2d2d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ fontFamily: FONT_HEADING, fontSize: 'clamp(28px, 3.2vw, 56px)', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
        {number}
      </span>
      <span style={{ fontFamily: FONT_BODY, fontSize: 'clamp(12px, 1vw, 16px)', fontWeight: 300, color: '#fff', marginTop: '6px', lineHeight: 1 }}>
        {label}
      </span>
      <span style={{ fontFamily: FONT_BODY, fontSize: 'clamp(10px, 0.8vw, 12px)', fontWeight: 300, color: 'rgba(255,255,255,0.6)', marginTop: '3px', lineHeight: 1 }}>
        {sublabel}
      </span>
    </div>
  );
}

function PhotoCell({ url, position = 'center' }: { url: string; position?: string }) {
  return (
    <div
      style={{
        backgroundImage: `url(${url})`,
        backgroundSize: 'cover',
        backgroundPosition: position,
      }}
    />
  );
}

/* ── Componente principal ────────────────────────────────────────── */

export default function PropietariosBlock({ onNavigate }: PropietariosBlockProps) {
  return (
    <section className="bg-black w-full overflow-hidden" style={{ maxWidth: '1920px', margin: '0 auto' }}>

      {/* Layout: columna en móvil → dos columnas en desktop */}
      <div className="flex flex-col lg:flex-row lg:h-[460px]">

        {/* ── COLUMNA IZQUIERDA ─────────────────────────────────── */}
        <div
          className="flex flex-col justify-center gap-5 px-8 py-10 sm:px-14 sm:py-12 lg:py-0 lg:pl-16 lg:pr-14 lg:flex-shrink-0 lg:flex-grow-0"
          style={{ flexBasis: '560px' }}
        >
          {/* Título */}
          <div>
            <p style={{ fontFamily: FONT_LIGHT, fontSize: 'clamp(22px, 2.2vw, 34px)', fontWeight: 300, color: '#fff', margin: 0, lineHeight: 1.2 }}>
              ¿Tienes un inmueble para
            </p>
            <p style={{ fontFamily: FONT_LIGHT, fontSize: 'clamp(22px, 2.2vw, 34px)', fontWeight: 700, fontStyle: 'italic', color: RED, margin: 0, lineHeight: 1.2 }}>
              arrendar o vender?
            </p>
          </div>

          {/* Descripción */}
          <p style={{ fontFamily: FONT_BODY, fontSize: 'clamp(13px, 1vw, 15px)', fontWeight: 300, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.55 }}>
            Más de 60 años gestionando propiedades en Antioquia. Tu inmueble en
            manos de quienes conocen el mercado inmobiliario regional.
          </p>

          {/* Botones */}
          <div className="flex gap-2.5">
            <button
              onClick={() => onNavigate('consignacion')}
              className="flex-1 transition-colors duration-200"
              style={{ background: RED, color: '#fff', padding: '13px 16px', fontSize: 'clamp(13px, 0.9vw, 14px)', fontWeight: 500, border: 'none', borderRadius: '2px', cursor: 'pointer', fontFamily: FONT_BODY }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#aa182c')}
              onMouseLeave={(e) => (e.currentTarget.style.background = RED)}
            >
              Consignar mi propiedad
            </button>

            <button
              onClick={() => window.open(WHATSAPP_URL, '_blank')}
              className="flex-1 transition-colors duration-200"
              style={{ background: RED, color: '#fff', padding: '13px 16px', fontSize: 'clamp(13px, 0.9vw, 14px)', fontWeight: 500, border: 'none', borderRadius: '2px', cursor: 'pointer', fontFamily: FONT_BODY }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#aa182c')}
              onMouseLeave={(e) => (e.currentTarget.style.background = RED)}
            >
              Hablar con un asesor
            </button>
          </div>

          {/* Nota */}
          <p style={{ fontFamily: FONT_BODY, fontSize: 'clamp(12px, 0.85vw, 13px)', fontWeight: 300, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.5 }}>
            Te avisamos cuando haya un arrendatario interesado.{' '}
            <strong style={{ fontWeight: 700, color: '#fff' }}>Sin demoras, sin contratiempos.</strong>
          </p>
        </div>

        {/* ── GRID DERECHO 3 × 2 ───────────────────────────────── */}
        <div
          className="flex-1 grid grid-cols-3 grid-rows-2 h-[200px] sm:h-[260px] lg:h-full"
          style={{ gap: '3px' }}
        >
          {/* Fila 1 */}
          <StatCard number="+1000" label="inmuebles" sublabel="en gestión activa" />
          <PhotoCell url="/images/Banner_consigna_propiedad.png" position="center top" />
          <PhotoCell url="/images/banner_inversionistas.png" position="center top" />

          {/* Fila 2 */}
          <PhotoCell url="/images/banner_propietarios.png" />
          <StatCard number="60" label="años" sublabel="de experiencia" />
          <StatCard number="3" label="sedes" sublabel="en Antioquia" />
        </div>

      </div>
    </section>
  );
}
