'use client';

import { useEffect, useRef, useState } from 'react';

interface UseFadeOnScrollOptions {
  threshold?: number;
  translate?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
}

export function useFadeOnScroll(options: UseFadeOnScrollOptions = {}) {
  const { threshold = 0.1, translate = 'up', delay = 0 } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, delay]);

  const getTransformStyle = (): React.CSSProperties => {
    const baseTransition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

    if (!isVisible) {
      const hiddenTransforms: Record<string, string> = {
        up: 'translateY(40px)',
        down: 'translateY(-40px)',
        left: 'translateX(50px)',
        right: 'translateX(-50px)',
        none: 'none',
      };
      return {
        opacity: 0,
        transform: hiddenTransforms[translate],
        transition: baseTransition,
      };
    }

    return {
      opacity: 1,
      transform: 'translate(0)',
      transition: baseTransition,
    };
  };

  return { ref, style: getTransformStyle() };
}