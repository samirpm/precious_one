'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface NumberTickerProps {
  value: number;
  /** Decimal places to display. 0 = integer */
  decimals?: number;
  /** Text after the number, e.g. '+' or '%' */
  suffix?: string;
  /** Text before the number */
  prefix?: string;
  /** Animation duration in seconds. Default 2 */
  duration?: number;
  className?: string;
}

/**
 * NumberTicker — counts up to `value` when scrolled into view,
 * formatted with locale separators and optional decimals/suffix.
 * Renders the final value immediately under reduced motion.
 */
export default function NumberTicker({
  value,
  decimals = 0,
  suffix = '',
  prefix = '',
  duration = 2,
  className = '',
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const readonly = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const format = (v: number) =>
        prefix +
        v.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }) +
        suffix;

      if (readonly) {
        el.textContent = format(value);
        return;
      }

      const state = { v: 0 };
      gsap.to(state, {
        v: value,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = format(state.v);
        },
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: ref, dependencies: [value, decimals, suffix, prefix, duration] },
  );

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${value}${suffix}`}>
      {prefix}
      {value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}