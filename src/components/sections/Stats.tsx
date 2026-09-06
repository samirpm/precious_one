'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NumberTicker from '@/components/ui/NumberTicker';

gsap.registerPlugin(ScrollTrigger);

/**
 * Stats — a dark trust-metrics band, mirroring the agency template's
 * stat cards ("3x Faster", "+280%", "Top 1%", "5.0"). Each metric is an
 * oversized serif number with a quiet label, divided by hairlines.
 */
const stats: {
  to: number;
  decimals?: number;
  suffix?: string;
  label: string;
  sub?: string;
}[] = [
  { to: 1500, suffix: '+', label: 'Little moments', sub: 'captured with love' },
  { to: 10, suffix: '+', label: 'Years of artistry', sub: 'across Abu Dhabi' },
  { to: 5, decimals: 1, label: 'Family rated', sub: 'on Google reviews' },
  { to: 100, suffix: '%', label: 'Private studio', sub: 'women-only team' },
];

export default function Stats() {
  const gridRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      gsap.fromTo(
        itemsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      );
    },
    { scope: gridRef },
  );

  return (
    <section aria-label="Trusted by families" className="overflow-hidden bg-charcoal">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 md:px-10 lg:px-16 py-16 md:py-24">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-14">
          <span className="font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-champagne-light">
            Trusted by families
          </span>
          <span className="hidden font-serif text-lg italic text-[#6F6964] sm:block">
            Quiet confidence, earned one session at a time.
          </span>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              ref={(el) => {
                if (el) itemsRef.current[index] = el;
              }}
              className={`py-8 md:px-10 lg:py-10 lg:px-12 ${
                index % 2 === 1 ? 'border-l border-white/10' : ''
              } ${index >= 2 ? 'border-t border-white/10 lg:border-t-0' : ''} ${
                index === 2 ? 'lg:border-l lg:border-white/10' : ''
              }`}
            >
              <NumberTicker
                value={stat.to}
                decimals={stat.decimals ?? 0}
                suffix={stat.suffix ?? ''}
                duration={2.2}
                className="font-serif text-[clamp(3rem,6vw,5.5rem)] font-light leading-none tracking-[-0.02em] text-ivory"
              />
              <p className="mt-4 font-serif text-lg font-light text-champagne-light">
                {stat.label}
              </p>
              {stat.sub && (
                <p className="mt-1 font-sans text-[11px] font-light tracking-wide text-[#8A8279]">
                  {stat.sub}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}