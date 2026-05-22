import { useEffect, useRef } from 'react';

export const useSplitTextAnimation = (
  selector: string,
  initialDelay: number = 0,
  scrollBased: boolean = false
) => {
  const ref = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);
  const splitRef = useRef<any>(null);
  const gsapRef = useRef<any>(null);

  useEffect(() => {
    if (!ref.current) return;

    const setup = async () => {
      const target = ref.current?.querySelector(selector) as HTMLElement | null;
      if (!target) return null;

      const gsapModule = await import('gsap');
      const gsap = gsapModule.default;
      const { SplitText } = await import('gsap/SplitText');

      if (!gsap.plugins.SplitText) gsap.registerPlugin(SplitText);

      gsapRef.current = gsap;

      // Crear SplitText solo una vez
      if (!splitRef.current) {
        splitRef.current = new SplitText(target, {
          type: 'lines',
          linesClass: 'split-line',
        });
        // Estado inicial oculto
        gsap.set(target, { opacity: 0, y: 40 });
        gsap.set(splitRef.current.lines, { opacity: 0, y: 60 });
      }

      return { gsap, target, split: splitRef.current };
    };

    const animateIn = async () => {
      const result = await setup();
      if (!result) return;
      const { gsap, target, split } = result;

      gsap.killTweensOf([target, split.lines]);
      gsap.to(target, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' });
      gsap.to(split.lines, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'expo.out',
      });
    };

    const animateOut = async () => {
      const result = await setup();
      if (!result) return;
      const { gsap, target, split } = result;

      gsap.killTweensOf([target, split.lines]);
      gsap.to(target, { opacity: 0, y: 40, duration: 0.5, ease: 'power2.in' });
      gsap.to(split.lines, {
        opacity: 0,
        y: 60,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.in',
      });
    };

    if (scrollBased) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateIn();
            } else {
              animateOut();
            }
          });
        },
        {
          threshold: 0,
          rootMargin: '-25% 0px -25% 0px',
        }
      );

      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    } else {
      // Hero: anima una sola vez cuando es visible
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated.current) {
              hasAnimated.current = true;
              if (document.fonts?.ready) {
                document.fonts.ready.then(() =>
                  setTimeout(animateIn, 100 + initialDelay)
                );
              } else {
                setTimeout(animateIn, 300 + initialDelay);
              }
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );

      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [selector, initialDelay, scrollBased]);

  return ref;
};
