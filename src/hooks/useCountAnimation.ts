import { useEffect, useRef, useState } from 'react';

export const useCountAnimation = (endValue: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const hasStartedRef = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Observar si el elemento está en la vista
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStartedRef.current) {
            hasStartedRef.current = true;

            // Iniciar la animación de conteo
            let currentCount = 0;
            const increment = endValue / (duration / 16); // Aproximadamente 60fps
            const interval = setInterval(() => {
              currentCount += increment;
              if (currentCount >= endValue) {
                setCount(endValue);
                clearInterval(interval);
              } else {
                setCount(Math.floor(currentCount));
              }
            }, 16);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);

    // Retornar el observer para limpiar
    return () => {
      observer.disconnect();
    };
  }, [endValue, duration]);

  return { ref, count };
};
