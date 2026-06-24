'use client';

import { useEffect } from 'react';

export default function ScrollTracker() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const activate = () => {
      document.documentElement.classList.add('is-scrolling');
      clearTimeout(timer);
      timer = setTimeout(() => {
        document.documentElement.classList.remove('is-scrolling');
      }, 200);
    };

    // Captura scroll nativo en window (Lenis llama window.scrollTo internamente)
    window.addEventListener('scroll', activate, { passive: true });
    // Captura scroll en cualquier elemento scrollable interno (listas, dropdowns…)
    document.addEventListener('scroll', activate, { passive: true, capture: true });

    return () => {
      window.removeEventListener('scroll', activate);
      document.removeEventListener('scroll', activate, { capture: true });
      clearTimeout(timer);
    };
  }, []);

  return null;
}
