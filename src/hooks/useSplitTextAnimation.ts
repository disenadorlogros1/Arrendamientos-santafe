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
          // Establecer estado inicial si es la primera vez
          if (!split.lines[0]._gsap) {
            gsap.set(target as HTMLElement, { opacity: 0, y: 80 });
            gsap.set(split.lines, { opacity: 0, y: 80 });
          }

          // Animar el padre (h1/h2) hacia arriba y fade in
          gsap.to(target as HTMLElement, {
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: 'power2.out',
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
          // Animar de vuelta a invisible (para scroll hacia arriba) - INMEDIATO, sin delay
          gsap.to(target as HTMLElement, {
            opacity: 0,
            y: 80,
            duration: 0.6,
            ease: 'power2.in',
          });

          gsap.to(split.lines, {
            duration: 0.6,
            y: 80,
            opacity: 0,
            stagger: 0.1,
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

            // Ejecutar inmediatamente sin delay, tanto entrada como salida
            animateText(entry.isIntersecting);
          });
        },
        {
          threshold: 0,
          rootMargin: '-33% 0px -33% 0px',
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
          threshold: 0.4,
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
