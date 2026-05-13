'use client';

interface HeroSectionProps {
  onNavigate?: (page: 'propiedades' | 'consignacion') => void;
}

const WHATSAPP_URL =
  'https://wa.me/573006557529?text=Hola%2C%20quisiera%20hablar%20con%20un%20asesor%20de%20Arrendamientos%20Santa%20Fe.';

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const scrollToSearch = () => {
    const el = document.getElementById('buscador');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.7, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=1920&q=80"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 hero-video-overlay" />

      {/* Content — Centrado en la mitad del viewport */}
      <div
        className="relative w-full px-6 sm:px-12 md:px-16 mx-auto"
        style={{ zIndex: 10, maxWidth: '56rem' }}
      >
        <div className="hero-title-wrap">
          <h1 className="hero-title-text text-3xl sm:text-4xl md:text-5xl lg:text-[52px] text-white tracking-tight">
            <span className="hero-line-seg hero-line-first">
              60 años
            </span>{' '}
            <span className="hero-line-seg hero-line-highlight">
              guiando tus decisiones
            </span>{' '}
            <span className="hero-line-seg hero-line-last">
              inmobiliarias.
            </span>
          </h1>
        </div>
        <p
          className="mt-5 text-base sm:text-lg text-white max-w-2xl"
          style={{
            fontFamily:
              "'Avenir LT Pro 35 Light', 'Avenir Next Ultra Light', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 200,
            letterSpacing: '0em',
            lineHeight: '1.32',
            textShadow: '0 1px 10px rgba(0,0,0,0.4)',
          }}
        >
          Respaldo y experiencia para encontrar o gestionar tu propiedad ideal
          en Antioquia.
        </p>

        {/* CTAs jerárquicos — botones cápsula con hover blanco + resplandor rojo */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          {/* CTA Principal: Buscar inmueble */}
          <button
            type="button"
            onClick={scrollToSearch}
            className="hero-btn group inline-flex items-center justify-center h-[42px] px-6 bg-black/30 hover:bg-white text-white hover:text-brand-red text-sm sm:text-base rounded-full border border-white/30 transition-all duration-300 hover:scale-105"
            style={{
              textShadow: '0 1px 3px rgba(0,0,0,0.4)',
              fontFamily: "'Avenir LT Pro 35 Light', 'Avenir', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
            }}
          >
            Buscar inmueble
          </button>

          {/* CTA Secundario: Consignar mi propiedad */}
          <button
            type="button"
            onClick={() => onNavigate?.('consignacion')}
            className="hero-btn group inline-flex items-center justify-center h-[42px] px-6 bg-black/30 hover:bg-white text-white hover:text-brand-red text-sm sm:text-base rounded-full border border-white/30 transition-all duration-300 hover:scale-105"
            style={{
              textShadow: '0 1px 3px rgba(0,0,0,0.4)',
              fontFamily: "'Avenir LT Pro 35 Light', 'Avenir', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
            }}
          >
            Consignar mi propiedad
          </button>

          {/* CTA Operativo: Hablar con un asesor (WhatsApp) */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-btn group inline-flex items-center gap-2 h-[42px] px-5 bg-black/30 hover:bg-white text-white hover:text-brand-red text-sm sm:text-base rounded-full border border-white/30 transition-all duration-300 hover:scale-105"
            style={{
              textShadow: '0 1px 3px rgba(0,0,0,0.4)',
              fontFamily: "'Avenir LT Pro 35 Light', 'Avenir', 'Outfit', system-ui, sans-serif",
              fontWeight: 300,
            }}
          >
            <span>Hablar con un asesor</span>
          </a>
        </div>
      </div>
    </section>
  );
}
