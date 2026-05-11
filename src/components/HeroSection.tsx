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
    <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
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

      {/* Content — centrado horizontalmente, texto alineado a la izquierda */}
      <div
        className="relative w-full px-6 sm:px-12 md:px-16 mx-auto"
        style={{ zIndex: 10, maxWidth: '56rem' }}
      >
        <div className="hero-title-wrap">
          <h1 className="hero-title-text text-3xl sm:text-4xl md:text-5xl lg:text-[48px] text-white tracking-tight">
            <span className="hero-line-seg hero-line-highlight">
              60 años
            </span>{' '}
            <span className="hero-line-seg hero-line-last">
              guiando tus decisiones inmobiliarias.
            </span>
          </h1>
        </div>
        <p
          className="mt-4 text-base sm:text-lg text-white max-w-2xl"
          style={{
            fontFamily:
              "'Avenir LT Pro 35 Light', 'Avenir Next Ultra Light', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 200,
            letterSpacing: '0.05em',
            textShadow: '0 1px 10px rgba(0,0,0,0.4)',
          }}
        >
          Respaldo y experiencia en Antioquia para encontrar o gestionar tu
          propiedad ideal.
        </p>

        {/* CTAs jerárquicos */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          {/* CTA Principal: Buscar inmueble */}
          <button
            type="button"
            onClick={scrollToSearch}
            className="inline-flex items-center justify-center h-12 px-6 bg-brand-red hover:bg-brand-red-hover text-white text-sm sm:text-base font-semibold rounded-md shadow-lg transition-colors"
          >
            Buscar inmueble
          </button>

          {/* CTA Secundario: Consignar mi propiedad */}
          <button
            type="button"
            onClick={() => onNavigate?.('consignacion')}
            className="inline-flex items-center justify-center h-12 px-6 bg-transparent hover:bg-white/10 text-white text-sm sm:text-base font-semibold border-2 border-white/80 rounded-md transition-colors"
          >
            Consignar mi propiedad
          </button>

          {/* CTA Operativo: Hablar con un asesor (WhatsApp) */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-10 px-4 bg-white/10 hover:bg-white/20 text-white text-sm rounded-md backdrop-blur-sm transition-colors"
          >
            <img src="/wpp-blanco.gif" alt="" className="w-4 h-4" />
            <span>Hablar con un asesor</span>
          </a>
        </div>
      </div>
    </section>
  );
}
