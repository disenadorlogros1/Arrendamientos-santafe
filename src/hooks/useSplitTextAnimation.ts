import { useEffect, useRef, useState } from 'react';

export const useSplitTextAnimation = (
  selector: string,
  initialDelay: number = 0,
  scrollBased: boolean = false,
  disableOnMobile: boolean = false
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const hasAnimated = useRef(false);
  const splitRef = useRef<any>(null);
  const gsapRef = useRef<any>(null);

  // titleAnimating: true mientras el título es visible (zona estable)
  const [titleAnimating, setTitleAnimating] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    if (disableOnMobile && typeof window !== 'undefined' && window.innerWidth < 1024) {
      const mobileTarget = (ref.current?.querySelector(selector) ?? ref.current) as HTMLElement | null;
      if (mobileTarget) {
        mobileTarget.style.opacity = '1';
        mobileTarget.style.transform = 'none';
      }
      setTitleAnimating(true);
      return;
    }

    const setup = async () => {
      const target = (ref.current?.querySelector(selector) ?? ref.current) as HTMLElement | null;
      if (!target) return null;

      const gsapModule = await import('gsap');
      const gsap = gsapModule.default;
      const { SplitText } = await import('gsap/SplitText');

      if (!gsap.plugins.SplitText) gsap.registerPlugin(SplitText);

      gsapRef.current = gsap;

      if (!splitRef.current) {
        splitRef.current = new SplitText(target, {
          type: 'lines',
          linesClass: 'split-line',
        });
        gsap.set(target, { opacity: 0, y: 25 });
        gsap.set(splitRef.current.lines, { opacity: 0, y: 30 });
      }

      return { gsap, target, split: splitRef.current };
    };

    if (scrollBased) {
      // Animación de scrub vinculada al scroll con GSAP ScrollTrigger
      // IN:  top 80% → top 60%  (entra al 20% desde abajo, completa al 40%)
      // Estable: top 60% → top 40%
      // OUT: top 40% → top 20%  (sale desde 60% hasta 80% desde abajo)
      let cleanup: (() => void) | undefined;

      const setupScrub = async () => {
        const result = await setup();
        if (!result) return;
        const { gsap, target, split } = result;

        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        const PHASE = 1; // duración de cada fase (entrada / estable / salida)

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%', // top del elemento en 80% del viewport (20% desde abajo)
            end: 'top 20%',   // top del elemento en 20% del viewport (80% desde abajo)
            scrub: 1,
            onUpdate: (self: any) => {
              const inStableZone = self.progress > 0.15 && self.progress < 0.85;
              setTitleAnimating(inStableZone);
            },
          },
        });

        // Fase 1 – Entrada (scroll 0→33%): opacidad 0→1, y 25→0
        tl.to(target, { opacity: 1, y: 0, duration: PHASE, ease: 'none' }, 0);
        tl.to(
          split.lines,
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.85, ease: 'none' },
          0
        );

        // Fase 2 – Estable (scroll 33→67%): placeholder para mantener la duración
        tl.to({}, { duration: PHASE }, PHASE);

        // Fase 3 – Salida (scroll 67→100%): opacidad 1→0, y 0→-30
        tl.to(target, { opacity: 0, y: -30, duration: PHASE, ease: 'none' }, PHASE * 2);
        tl.to(
          split.lines,
          { opacity: 0, y: -40, stagger: 0.06, duration: 0.85, ease: 'none' },
          PHASE * 2
        );

        cleanup = () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      };

      setupScrub();
      return () => cleanup?.();
    } else {
      // Animación one-shot al entrar en viewport
      const animateIn = async () => {
        const result = await setup();
        if (!result) return;
        const { gsap, target, split } = result;

        setTitleAnimating(true);

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
  }, [selector, initialDelay, scrollBased, disableOnMobile]);

  return { ref, titleAnimating };
};
