'use client';

export default function HeroSection() {
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
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] text-white tracking-tight"
          style={{
            fontFamily: "'Avenir LT Pro 35 Light', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 200,
            lineHeight: '0.9',
            textShadow: '0 2px 20px rgba(0,0,0,0.4)',
          }}
        >
          <span
            style={{ display: 'inline-block', marginBottom: '-0.55em' }}
          >
            El apartamento{' '}
          </span>
          <span
            style={{
              display: 'inline-block',
              marginBottom: '-0.55em',
              background: 'linear-gradient(to bottom, transparent 60%, #CF0A2C 60%, #CF0A2C 84%, transparent 84%)',
              padding: '0 4px',
              boxDecorationBreak: 'clone',
              WebkitBoxDecorationBreak: 'clone',
            }}
          >que siempre quisiste, en el lugar</span>{' '}
          <span
            style={{ display: 'inline-block' }}
          >
            que siempre quisiste.
          </span>
        </h1>
        <p
          className="mt-4 text-base sm:text-lg text-white"
          style={{
            fontFamily: "'Avenir LT Pro 35 Light', 'Avenir Next Ultra Light', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 100,
            letterSpacing: '0.25em',
            textShadow: '0 1px 10px rgba(0,0,0,0.4)',
          }}
        >
          Sin vueltas, sin letras pequeñas, sin sorpresas.
        </p>
      </div>
    </section>
  );
}
