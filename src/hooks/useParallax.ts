import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface ParallaxConfig {
  speed?: number; // 0.5 = normal, 0.3 = slow, 0.7 = fast
  direction?: 'vertical' | 'both';
}

export function useParallax(config: ParallaxConfig = {}) {
  const { speed = 0.5, direction = 'vertical' } = config;

  // containerRef va en el <div> con overflow-hidden
  // imageRef va en el <motion.div> que se mueve
  const containerRef = useRef<HTMLDivElement>(null);

  // useScroll relativo al contenedor: progress va de 0 a 1
  // mientras el contenedor está visible en pantalla
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'], // desde que entra hasta que sale del viewport
  });

  // Y: imagen se mueve -20% → +20% mientras el contenedor pasa por el viewport
  const yRange = 20 * speed; // ej: 0.5 speed → ±10%
  const y = useTransform(scrollYProgress, [0, 1], [`${yRange}%`, `-${yRange}%`]);

  // X: movimiento lateral muy sutil
  const xRange = direction === 'both' ? 5 * speed : 0;
  const x = useTransform(scrollYProgress, [0, 1], [`-${xRange}%`, `${xRange}%`]);

  return {
    containerRef,
    y,
    x,
  };
}
