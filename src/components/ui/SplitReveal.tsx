'use client';

import { useRef, type ElementType, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SplitRevealProps {
  as?: ElementType;
  className?: string;
  /** Whether to trigger on scroll. Default true */
  scrollTrigger?: boolean;
  /** Pixels to translate from. Default 60 */
  y?: number;
  /** Extra class applied to each emphasized (<em>) word */
  emClassName?: string;
  children: ReactNode;
}

/**
 * SplitReveal — splits children into words and animates each word
 * sliding up from below. Unlike RevealText it accepts JSX children,
 * so an italic-contrast emphasis can be marked up inline:
 *
 *   <SplitReveal emClassName="text-champagne-dark">
 *     Precious <em>moments,</em> captured.
 *   </SplitReveal>
 *
 * The <em> phrase survives while each word still reveals individually.
 */
export default function SplitReveal({
  as: Tag = 'h2',
  className = '',
  scrollTrigger = true,
  y = 60,
  emClassName = '',
  children,
}: SplitRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLElement[]>([]);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      gsap.set(wordsRef.current, { y, opacity: 0 });
      gsap.to(wordsRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: scrollTrigger
          ? {
              trigger: container,
              start: 'top 86%',
              toggleActions: 'play none none none',
            }
          : undefined,
      });
    },
    { scope: containerRef, dependencies: [y, scrollTrigger, emClassName] },
  );

  // Flatten children into word tokens, tracking which came from an <em>.
  const tokens: { word: string; emph?: boolean }[] = [];
  const flat: ReactNode[] = (Array.isArray(children) ? children : [children]).flat(10);
  flat.forEach((child) => {
    if (child == null || child === false || typeof child === 'boolean') return;
    if (typeof child === 'string') {
      child.split(/\s+/).filter(Boolean).forEach((w) => tokens.push({ word: w }));
      return;
    }
    if (typeof child === 'object' && 'type' in child) {
      const emph = (child as { type: unknown }).type === 'em';
      const text = String((child as { props?: { children?: ReactNode } }).props?.children ?? '').trim();
      if (!text) return;
      if (typeof text === 'string') {
        text.split(/\s+/).filter(Boolean).forEach((w) => tokens.push({ word: w, emph }));
      } else {
        tokens.push({ word: String(text), emph });
      }
    }
  });

  return (
    <Tag ref={containerRef} className={`flex flex-wrap ${className}`}>
      {tokens.map((token, i) => {
        const inner = token.emph ? (
          <em className={emClassName || undefined}>{token.word}</em>
        ) : (
          token.word
        );
        return (
          <span key={i} className="overflow-hidden align-bottom mr-[0.3em]">
            <span
              ref={(el) => {
                if (el) wordsRef.current.push(el);
              }}
              className="inline-block"
            >
              {inner}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}