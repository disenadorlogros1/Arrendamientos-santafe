'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  /** Retardo en segundos antes de iniciar la animación (default: 0) */
  delay?: number;
  /** Distancia vertical de entrada en px (default: 60) */
  y?: number;
  /** Cuándo empieza el trigger, e.g. 'top 90%' (default: 'top 88%') */
  start?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ScrollReveal({
  children,
  delay = 0,
  y = 60,
  start = 'top 88%',
  className = '',
  style,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Estado inicial invisible — evita flash antes de que ScrollTrigger cargue
    gsap.set(el, { opacity: 0, y });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay,
            ease: 'power3.out',
          });
        },
      });
    }, el);

    return () => ctx.revert();
  }, [delay, y, start]);

  return (
    <div ref={ref} className={`w-full ${className}`} style={style}>
      {children}
    </div>
  );
}
