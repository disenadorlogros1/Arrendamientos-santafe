'use client';

import { useEffect } from 'react';

export default function ScrollTracker() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      document.documentElement.classList.add('is-scrolling');
      clearTimeout(timer);
      timer = setTimeout(() => {
        document.documentElement.classList.remove('is-scrolling');
      }, 180);
    };
    // capture: true catches scroll from any element (not just window)
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    return () => {
      document.removeEventListener('scroll', onScroll, { capture: true });
      clearTimeout(timer);
    };
  }, []);

  return null;
}
