'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register once — safe to call multiple times
gsap.registerPlugin(ScrollTrigger);

// Sync Lenis smooth scroll with GSAP ScrollTrigger
// Lenis dispatches native scroll events; ScrollTrigger listens to those.
// This call ensures ScrollTrigger recalculates positions on every Lenis frame.
if (typeof window !== 'undefined') {
  // Lenis is instantiated later by LenisProvider; poll until available
  const syncLenis = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).__lenis as {
      on: (event: string, cb: () => void) => void;
    } | undefined;
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time: number) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (lenis as any).raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      requestAnimationFrame(syncLenis);
    }
  };
  requestAnimationFrame(syncLenis);
}

export { gsap, ScrollTrigger };
