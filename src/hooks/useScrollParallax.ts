import { useEffect, useRef, useState } from 'react';

interface UseScrollParallaxOptions {
  elementHeight?: number;
  contentHeight?: number;
}

export const useScrollParallax = (options: UseScrollParallaxOptions = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState(0);
  const [dimensions, setDimensions] = useState({
    windowHeight: 0,
    contentHeight: 0,
    totalHeight: 0,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const windowHeight = window.innerHeight;
      const contentHeight = document.querySelector('.parallax-content')?.clientHeight || 0;
      const totalHeight = windowHeight + contentHeight;

      setDimensions({
        windowHeight,
        contentHeight,
        totalHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScroll(scrollY);

      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(-${scrollY}px)`;
      }

      // Parallax effect para el header background
      const headerElement = document.querySelector('header');
      if (headerElement && dimensions.totalHeight > 0) {
        const parallaxValue = 50 - (scrollY * 100) / dimensions.totalHeight;
        (headerElement as HTMLElement).style.backgroundPositionY = `${parallaxValue}%`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [dimensions]);

  return { containerRef, scroll, dimensions };
};
