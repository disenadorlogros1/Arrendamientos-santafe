'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface UserLocationProps {
  mobileExpanded: boolean;
}

export default function UserLocation({ mobileExpanded }: UserLocationProps) {
  const label = 'Propiedades en Medellín, Antioquia';
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.5, ease: 'power2.out' }
    );
  }, []);

  return (
    <div
      ref={ref}
      className="relative mx-auto px-4 sm:px-6 lg:px-8 mt-3"
      style={{ maxWidth: '72rem', zIndex: 25, opacity: 0 }}
    >
      <div className="flex items-center gap-2 justify-center">
        <img
          src="/ubicacion.gif"
          alt="Ubicación"
          className={`w-4 h-4 user-location-icon-light ${mobileExpanded ? 'sm:!inline-block !inline-block' : ''}`}
        />
        <img
          src="/ubicacion-blanco.gif"
          alt=""
          aria-hidden="true"
          className={`w-4 h-4 user-location-icon-dark ${mobileExpanded ? '!hidden' : ''}`}
        />
        <span
          className={`user-location-text text-sm ${mobileExpanded ? 'on-light' : ''}`}
          style={{
            fontFamily: "'Avenir LT Pro 65 Medium', 'Avenir', 'Outfit', system-ui, sans-serif",
            fontWeight: 300,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}