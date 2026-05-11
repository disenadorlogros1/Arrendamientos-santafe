'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

const COLORS = [
  { bg: 'bg-green-500', hover: 'hover:bg-green-600' },
  { bg: 'bg-brand-red', hover: 'hover:bg-brand-red-hover' },
  { bg: 'bg-blue-500', hover: 'hover:bg-blue-600' },
];

export default function WhatsAppFloat() {
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % COLORS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const color = COLORS[colorIndex];

  return (
    <a
      href="https://wa.me/573006557529?text=Hola%2C%20quisiera%20hablar%20con%20un%20asesor%20de%20Arrendamientos%20Santa%20Fe."
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 ${color.bg} ${color.hover} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-700 animate-bounce-subtle`}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-6 w-6 text-white fill-white" />
    </a>
  );
}
