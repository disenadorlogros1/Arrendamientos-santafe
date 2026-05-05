'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[350px] md:min-h-[392px] flex items-center justify-center overflow-hidden">
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

      {/* Dark overlay using brand-dark color */}
      <div className="absolute inset-0 hero-video-overlay" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-extrabold text-white leading-tight tracking-tight">
          El apartamento que siempre quisiste,{' '}
          <span className="text-brand-red">en el lugar</span> que siempre{' '}
          <span className="text-brand-red">quisiste.</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-white/70 font-light">
          Sin vueltas, sin letras pequeñas, sin sorpresas.
        </p>
      </motion.div>
    </section>
  );
}
