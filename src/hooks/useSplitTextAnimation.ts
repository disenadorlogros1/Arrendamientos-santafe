import { useEffect, useRef } from 'react';

export const useSplitTextAnimation = (selector: string, initialDelay: number = 0) => {
  const ref = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const animateText = async () => {
      if (hasAnimated.current) return; // Evitar animar dos veces

      const target = ref.current?.querySelector(selector);
      if (!target) {
        console.warn(`[SplitText] No se encontró elemento con selector: ${selector}`);
        return;
      }

      try {
        // Importar GSAP dinámicamente
        const gsapModule = await import('gsap');
        const gsap = gsapModule.default;

        // Importar SplitText
        const { SplitText } = await import('gsap/SplitText');

        // Registrar plugin si no está registrado
        if (!gsap.plugins.SplitText) {
          gsap.registerPlugin(SplitText);
        }

        console.log('[SplitText] Inicializando animación para:', selector);

        // Crear instancia de SplitText
        const split = new SplitText(target, {
          type: 'lines',
          linesClass: 'split-line',
        });

        console.log('[SplitText] Líneas encontradas:', split.lines.length);

        // Establecer estado inicial en los .split-line divs
        gsap.set(split.lines, { y: 80, opacity: 0 });

        // Animar el padre (h1/h2) a opacity 1 y las líneas con sus propias animaciones
        gsap.to(target as HTMLElement, {
          opacity: 1,
          duration: 1.4,
          ease: 'none',
        });

        // Animar líneas desde abajo hacia arriba (lenta y dramática)
        gsap.to(split.lines, {
          duration: 1.4,
          y: 0,
          opacity: 1,
          stagger: 0.25,
          ease: 'expo.out',
          onComplete: () => {
            console.log('[SplitText] Animación completada');
          },
        });

        hasAnimated.current = true;
      } catch (error) {
        console.error('[SplitText] Error en animación:', error);
      }
    };

    // Usar IntersectionObserver para activar la animación al hacer scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Cuando el elemento entra en el viewport
          if (entry.isIntersecting && !hasAnimated.current) {
            console.log('[SplitText] Elemento visible, iniciando animación');

            // Esperar a que las fuentes estén cargadas
            if (document.fonts && document.fonts.ready) {
              document.fonts.ready.then(() => {
                setTimeout(animateText, 100 + initialDelay);
              });
            } else {
              setTimeout(animateText, 300 + initialDelay);
            }

            // Dejar de observar después de animar
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3, // Se activa cuando 30% del elemento es visible
      }
    );

    // Observar el elemento ref
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [selector]);

  return ref;
};
