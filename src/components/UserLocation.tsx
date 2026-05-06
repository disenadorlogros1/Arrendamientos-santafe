'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function UserLocation() {
  const [location, setLocation] = useState('Detectando ubicación...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation('Medellín, Antioquia');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=es&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'ArrendamientosSantaFe/1.0',
              },
            }
          );
          const data = await res.json();
          const addr = data.address || {};
          const city =
            addr.city ||
            addr.town ||
            addr.municipality ||
            addr.village ||
            addr.hamlet ||
            '';
          const state = addr.state || '';
          const country = addr.country || '';

          if (city && state) {
            setLocation(`${city}, ${state}`);
          } else if (city && country) {
            setLocation(`${city}, ${country}`);
          } else if (state) {
            setLocation(state);
          } else {
            setLocation('Ubicación desconocida');
          }
        } catch {
          setLocation('Medellín, Antioquia');
        }
        setLoading(false);
      },
      () => {
        // Permission denied or error - default to Medellín
        setLocation('Medellín, Antioquia');
        setLoading(false);
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="relative z-20 mx-auto px-4 sm:px-6 lg:px-8 mt-3"
      style={{ maxWidth: '72rem' }}
    >
      <div className="flex items-center gap-2 justify-center">
        <img
          src="/ubicacion.gif"
          alt="Ubicación"
          className="w-4 h-4 opacity-70"
        />
        <span
          className="text-sm"
          style={{
            fontFamily: "'Avenir LT Pro 35 Light', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 300,
            color: '#ffffff',
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              Detectando ubicación
              <svg
                className="animate-spin w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
          ) : (
            `Propiedades en ${location}`
          )}
        </span>
      </div>
    </motion.div>
  );
}
