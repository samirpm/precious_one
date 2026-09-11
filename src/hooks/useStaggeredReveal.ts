import { useEffect, useState, RefObject } from 'react';

/**
 * useStaggeredReveal
 *
 * Returns `true` once the referenced container first scrolls into view.
 * Children use this boolean (plus their own index-based delay) to stagger
 * their entrance animations. Reduces to a single IntersectionObserver
 * instead of one per child.
 */
export function useStaggeredReveal(
  ref: RefObject<HTMLElement | null>
): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return visible;
}
