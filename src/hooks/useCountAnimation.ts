import { useEffect, useRef, useState } from 'react';

export const useCountAnimation = (endValue: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const hasStartedRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    // Observar si el elemento está en la vista
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStartedRef.current) {
            hasStartedRef.current = true;

            // Limpiar intervalo anterior si existe
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }

            // Iniciar la animación de conteo
            let currentCount = 0;
            const increment = endValue / (duration / 16); // Aproximadamente 60fps
            intervalRef.current = setInterval(() => {
              currentCount += increment;
              if (currentCount >= endValue) {
                setCount(endValue);
                if (intervalRef.current) clearInterval(intervalRef.current);
              } else {
                setCount(Math.floor(currentCount));
              }
            }, 16);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(currentRef);

    // Retornar el observer para limpiar
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      observer.disconnect();
    };
  }, [endValue, duration]);

  return { ref, count };
};
