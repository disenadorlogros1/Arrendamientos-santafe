'use client';

import { motion } from 'framer-motion';

interface UserLocationProps {
  mobileExpanded: boolean;
}

export default function UserLocation({ mobileExpanded }: UserLocationProps) {
  // Texto fijo, sin depender de geolocalización (evita strings raros como "Perímetro Urbano Medellín")
  const label = 'Propiedades en Medellín, Antioquia';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="relative mx-auto px-4 sm:px-6 lg:px-8 mt-3"
      style={{ maxWidth: '72rem', zIndex: 25 }}
    >
      <div className="flex items-center gap-2 justify-center">
        {/* Icono rojo (sobre fondo claro): desktop por defecto y mobile expandido */}
        <img
          src="/ubicacion.gif"
          alt="Ubicación"
          className={`w-4 h-4 user-location-icon-light ${mobileExpanded ? 'sm:!inline-block !inline-block' : ''}`}
        />
        {/* Icono blanco (sobre fondo oscuro): solo mobile cuando NO está expandido */}
        <img
          src="/ubicacion-blanco.gif"
          alt=""
          aria-hidden="true"
          className={`w-4 h-4 user-location-icon-dark ${mobileExpanded ? '!hidden' : ''}`}
        />
        <span
          className={`user-location-text text-sm ${mobileExpanded ? 'on-light' : ''}`}
          style={{
            fontFamily:
              "'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 300,
          }}
        >
          {label}
        </span>
      </div>
    </motion.div>
  );
}
