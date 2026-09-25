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

      // Perfect sync for ProMotion (120Hz) displays
      // We use gsap.ticker.add to drive Lenis raf.
      // gsap.ticker.lagSmoothing(0) ensures no artificial frame drops.
      gsap.ticker.lagSmoothing(0);
      gsap.ticker.add((time: number) => {
        (lenis as any).raf(time * 1000);
      });
    } else {
      requestAnimationFrame(syncLenis);
    }
  };
  requestAnimationFrame(syncLenis);
}

export { gsap, ScrollTrigger };
