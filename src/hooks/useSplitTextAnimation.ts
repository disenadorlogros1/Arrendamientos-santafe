import { useEffect, useRef } from 'react';

export const useSplitTextAnimation = (selector: string) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const animateText = async () => {
      const target = ref.current?.querySelector(selector);
      if (!target) {
        console.warn(`[SplitText] No se encontró elemento con selector: ${selector}`);
        return;
      }

      try {
        // Importar GSAP dinámicamente para asegurar que está disponible
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

        // Animar líneas desde abajo hacia arriba
        gsap.from(split.lines, {
          duration: 0.8,
          yPercent: 100,
          opacity: 0,
          stagger: 0.15,
          ease: 'expo.out',
          onComplete: () => {
            console.log('[SplitText] Animación completada');
          },
        });
      } catch (error) {
        console.error('[SplitText] Error en animación:', error);
      }
    };

    // Esperar a que las fuentes estén cargadas y luego animar
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        requestAnimationFrame(() => {
          setTimeout(animateText, 100);
        });
      });
    } else {
      // Fallback
      setTimeout(animateText, 300);
    }
  }, [selector]);

  return ref;
};
