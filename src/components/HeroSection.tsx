'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative z-0 w-full h-[70vh] flex items-center overflow-hidden">
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

      {/* Content - Avenir LT Pro 35 Light */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full text-left px-8 sm:px-12 md:px-16 lg:px-20 max-w-5xl mx-auto"
      >
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] text-white tracking-tight"
          style={{
            fontFamily: "'Avenir LT Pro 35 Light', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 300,
            lineHeight: '1.1',
          }}
        >
          El apartamento que siempre quisiste, en el lugar que siempre quisiste.
        </h1>
        <p
          className="mt-4 text-base sm:text-lg text-white/70"
          style={{ fontFamily: "'Avenir LT Pro 35 Light', 'Avenir', 'Outfit', system-ui, sans-serif", fontWeight: 300 }}
        >
          Sin vueltas, sin letras pequeñas, sin sorpresas.
        </p>
      </motion.div>
    </section>
  );
}
