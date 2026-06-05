import { useEffect, useRef, useState } from 'react';

/**
 * Hook que detecta cuando un elemento entra en vista y retorna si debe estar animado.
 * Simula el comportamiento de whileInView pero con un delay antes de empezar.
 */
export function useSubtitleAnimation(delayMs: number = 1800) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationStartedRef = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animationStartedRef.current) {
            // Element entered view
            animationStartedRef.current = true;

            // Wait for the delay, then set visible to trigger animation
            const timer = setTimeout(() => {
              setIsVisible(true);
            }, delayMs);

            return () => clearTimeout(timer);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px',
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [delayMs]);

  return { ref, isVisible };
}
