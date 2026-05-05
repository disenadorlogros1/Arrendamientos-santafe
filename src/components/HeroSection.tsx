'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[500px] md:min-h-[560px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=1920&q=80)',
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/60" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-white leading-tight tracking-tight">
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
