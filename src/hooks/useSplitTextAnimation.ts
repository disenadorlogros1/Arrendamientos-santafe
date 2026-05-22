import { useEffect, useRef } from 'react';

export const useSplitTextAnimation = (selector: string, initialDelay: number = 0, scrollBased: boolean = false) => {
  const ref = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const animateText = async (animateToVisible: boolean = true) => {
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

        // Crear instancia de SplitText (solo si no existe)
        let split = (target as any).__splitText;
        if (!split) {
          split = new SplitText(target, {
            type: 'lines',
            linesClass: 'split-line',
          });
          (target as any).__splitText = split;
        }

        console.log('[SplitText] Líneas encontradas:', split.lines.length);

        if (animateToVisible) {
          // Animar el padre (h1/h2) a opacity 1
          gsap.to(target as HTMLElement, {
            opacity: 1,
            duration: 1.4,
            ease: 'none',
          });

          // Animar líneas desde abajo hacia arriba
          gsap.to(split.lines, {
            duration: 1.4,
            y: 0,
            opacity: 1,
            stagger: 0.25,
            ease: 'expo.out',
          });
        } else {
          // Animar de vuelta a invisible (para scroll hacia arriba)
          gsap.to(target as HTMLElement, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.in',
          });

          gsap.to(split.lines, {
            duration: 0.8,
            y: 80,
            opacity: 0,
            stagger: 0.15,
            ease: 'power2.in',
          });
        }
      } catch (error) {
        console.error('[SplitText] Error en animación:', error);
      }
    };

    // Si es scroll-based, animar hacia/hacia atrás basado en scroll
    if (scrollBased) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            console.log('[SplitText] Elemento visible:', entry.isIntersecting);

            // Esperar a que las fuentes estén cargadas
            if (document.fonts && document.fonts.ready) {
              document.fonts.ready.then(() => {
                setTimeout(() => animateText(entry.isIntersecting), 100 + initialDelay);
              });
            } else {
              setTimeout(() => animateText(entry.isIntersecting), 300 + initialDelay);
            }
          });
        },
        {
          threshold: 0.3,
        }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        observer.disconnect();
      };
    } else {
      // Modo original: solo animar una vez cuando es visible
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated.current) {
              console.log('[SplitText] Elemento visible, iniciando animación');

              if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(() => {
                  setTimeout(() => animateText(true), 100 + initialDelay);
                });
              } else {
                setTimeout(() => animateText(true), 300 + initialDelay);
              }

              hasAnimated.current = true;
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.3,
        }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        observer.disconnect();
      };
    }
  }, [selector, initialDelay, scrollBased]);

  return ref;
};
