import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

export const useSplitTextAnimation = (selector: string) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Esperar a que las fuentes estén cargadas
    document.fonts.ready.then(() => {
      const target = ref.current?.querySelector(selector);
      if (!target) return;

      // Crear instancia de SplitText
      const split = new SplitText(target, {
        type: 'lines',
        linesClass: 'split-line',
      });

      // Animar líneas desde abajo hacia arriba
      gsap.from(split.lines, {
        duration: 0.6,
        yPercent: 100,
        opacity: 0,
        stagger: 0.1,
        ease: 'expo.out',
      });
    });
  }, [selector]);

  return ref;
};
