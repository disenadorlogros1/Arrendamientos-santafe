'use client';

export default function HeroSection() {
  return (
    <section className="relative w-full h-[70vh] flex items-center justify-start overflow-hidden">
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

      {/* Content - centrado vertical, alineado a la izquierda */}
      <div
        className="relative w-full text-left pl-8 sm:pl-12 md:pl-16 lg:pl-20"
        style={{ zIndex: 10, maxWidth: '48rem' }}
      >
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] text-white tracking-tight"
          style={{
            fontFamily: "'Avenir LT Pro 35 Light', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 300,
            lineHeight: '1.15',
            textShadow: '0 2px 20px rgba(0,0,0,0.4)',
          }}
        >
          El apartamento que siempre quisiste, en el lugar que siempre quisiste.
        </h1>
        <p
          className="mt-4 text-base sm:text-lg text-white/80"
          style={{
            fontFamily: "'Avenir LT Pro 35 Light', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 300,
            textShadow: '0 1px 10px rgba(0,0,0,0.4)',
          }}
        >
          Sin vueltas, sin letras pequeñas, sin sorpresas.
        </p>
      </div>
    </section>
  );
}
