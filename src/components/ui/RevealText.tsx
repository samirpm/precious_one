import { useRef, type ElementType, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealTextProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  delay?: number;
  stagger?: number;
  /** Pixels to translate from. Default 40 */
  y?: number;
  /** Whether to trigger on scroll. Default true */
  scrollTrigger?: boolean;
}

/**
 * RevealText — splits children into words and animates each
 * word sliding up from below with a stagger, triggered by scroll.
 */
export default function RevealText({
  as: Tag = 'h2',
  className = '',
  children,
  delay = 0,
  stagger = 0.06,
  y = 40,
  scrollTrigger = true,
}: RevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      // Reset
      gsap.set(wordsRef.current, { y, opacity: 0 });

      gsap.to(wordsRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger,
        ease: 'power3.out',
        delay,
        scrollTrigger: scrollTrigger
          ? {
              trigger: container,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          : undefined,
      });
    },
    { scope: containerRef, dependencies: [delay, stagger, y, scrollTrigger] },
  );

  // Split text into words on render
  const text = typeof children === 'string' ? children : '';
  const words = text.split(/(\s+)/).filter(Boolean);

  return (
    <Tag className={className} ref={containerRef}>
      {words.map((word, i) => {
        if (/^\s+$/.test(word)) {
          return <span key={i}>{word}</span>;
        }
        return (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <span
              ref={(el) => {
                if (el) wordsRef.current.push(el);
              }}
              className="inline-block"
            >
              {word}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
