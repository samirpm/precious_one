import '@/lib/gsap';

/**
 * GsapSync — render-nothing island that imports `src/lib/gsap.ts`,
 * whose module-scope side effect polls for `window.__lenis` (created by
 * LenisProvider) and hooks it into GSAP's ticker + ScrollTrigger updates.
 * Must be a client-loaded island so the side effect runs in the browser.
 */
export default function GsapSync() {
  return null;
}