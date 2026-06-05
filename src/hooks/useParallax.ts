import { useScroll, useTransform, MotionValue } from 'framer-motion';
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
  // Negative value = moves UP when scrolling DOWN (classic parallax effect)
  const y = useTransform(scrollY, (latest) => {
    return -latest * speed * 0.5; // Subtle vertical effect
  });

  // X-axis parallax: subtle side-to-side movement
  const x = useTransform(scrollY, (latest) => {
    // Oscillating X movement for interest
    return Math.sin(latest * 0.004) * 20 * speed;
  });

  return {
    ref,
    y,
    x,
  };
}
