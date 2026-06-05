import { useScroll, useTransform, useMotionValue } from 'framer-motion';
import { useRef } from 'react';

interface ParallaxConfig {
  speed?: number; // 0.5 = normal, 0.3 = slow, 0.7 = fast
  direction?: 'vertical' | 'both';
}

export function useParallax(config: ParallaxConfig = {}) {
  const { speed = 0.5, direction = 'vertical' } = config;
  const ref = useRef(null);
  const { scrollY } = useScroll();

  // Y-axis parallax: moves slower than scroll
  // Negative because we want it to move UP when scrolling DOWN (typical parallax)
  const y = useTransform(scrollY, (latest) => {
    return -latest * speed;
  });

  // X-axis parallax: subtle side-to-side movement
  const x = useTransform(scrollY, (latest) => {
    // Oscillating X movement for interest
    return Math.sin(latest * 0.005) * 30 * speed;
  });

  return {
    ref,
    animate: direction === 'both' ? { x, y } : { y },
  };
}
