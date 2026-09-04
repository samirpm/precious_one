'use client';

import { useEffect, useRef, useState, RefObject } from 'react';

interface ScrollProgressOptions {
  /** Smoothing factor (0 = instant, 1 = never reaches). Default 0.12 */
  smoothing?: number;
  /** Offset: start fading before section top reaches viewport top. Default 0 */
  offset?: number;
}

interface ScrollProgressResult {
  progress: number;
  rawProgress: number;
  containerRef: RefObject<HTMLDivElement | null>;
}

/**
 * Returns a smoothed 0–1 scroll progress for a container element.
 *
 * progress = 0 when the container's top is at the viewport top (or offset).
 * progress = 1 when the container's bottom minus viewport height is at the viewport top.
 *
 * Uses requestAnimationFrame for 60fps interpolation. No React state
 * updates on every frame — progress is stored in a ref and only
 * re-rendered when the smoothed value changes by ≥ 0.001.
 */
export function useScrollProgress(
  options: ScrollProgressOptions = {}
): ScrollProgressResult {
  const { smoothing = 0.18, offset = 0 } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const rawRef = useRef(0);
  const smoothRef = useRef(0);
  const rafRef = useRef<number>(0);
  const ticking = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // For reduced motion, just show everything without animation
      setProgress(1);
      return;
    }

    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Raw progress: 0 when top of element is at viewport top, 1 when bottom - viewport is at top
      const totalScroll = el.offsetHeight - viewportHeight;
      if (totalScroll <= 0) {
        rawRef.current = 0;
      } else {
        rawRef.current = Math.max(
          0,
          Math.min(1, (-rect.top + offset) / totalScroll)
        );
      }

      // Smooth interpolation — use higher smoothing when scrolling up
      // to prevent the animation from feeling stuck
      const diff = rawRef.current - smoothRef.current;
      const direction = diff < 0 ? 1.4 : 1; // faster response on scroll-up
      smoothRef.current += diff * smoothing * direction;

      // Snap to 0 or 1 when very close
      if (Math.abs(smoothRef.current) < 0.0005) smoothRef.current = 0;
      if (Math.abs(smoothRef.current - 1) < 0.0005) smoothRef.current = 1;

      // Only update state when meaningfully different (avoids excessive re-renders)
      const currentProgress = smoothRef.current;
      setProgress((prev) => {
        if (Math.abs(currentProgress - prev) > 0.001) {
          return currentProgress;
        }
        return prev;
      });

      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        rafRef.current = requestAnimationFrame(update);
      }
    };

    // Fallback: poll every frame while there is a pending convergence
    // Catches cases where scroll events don't fire (programmatic scrollTo, etc.)
    let pollRaf = 0;
    const poll = () => {
      const diff = Math.abs(rawRef.current - smoothRef.current);
      if (diff > 0.0005) {
        update();
      }
      pollRaf = requestAnimationFrame(poll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Draw initial frame
    update();
    // Start fallback poll
    pollRaf = requestAnimationFrame(poll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(pollRaf);
    };
  }, [smoothing, offset]);

  return { progress, rawProgress: rawRef.current, containerRef };
}
