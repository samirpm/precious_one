import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Smooth wheel-scrolling is a desktop nicety. On touch devices native
    // scrolling is already smooth and interruptible — Lenis would only add
    // drag — so skip it entirely there (real phones and devtools emulation).
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Expose lenis globally for GSAP sync
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).__lenis;
    };
  }, []);

  return <>{children}</>;
}
