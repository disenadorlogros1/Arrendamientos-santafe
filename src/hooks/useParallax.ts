import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxConfig {
  speed?: number;    // 0.5 = normal, 0.3 = slow, 0.7 = fast
  direction?: 'vertical' | 'both';
}

export function useParallax(config: ParallaxConfig = {}) {
  const { speed = 0.5, direction = 'vertical' } = config;

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const image     = imageRef.current;
    if (!container || !image) return;

    const yRange = 20 * speed;
    const xRange = direction === 'both' ? 5 * speed : 0;

    const ctx = gsap.context(() => {
      gsap.fromTo(image,
        { y: `${yRange}%`, x: `-${xRange}%` },
        {
          y: `-${yRange}%`,
          x: `${xRange}%`,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [speed, direction]);

  return { containerRef, imageRef };
}
