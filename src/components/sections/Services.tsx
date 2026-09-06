'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services } from '@/lib/content';
import SplitReveal from '@/components/ui/SplitReveal';

gsap.registerPlugin(ScrollTrigger);

/**
 * Services — single section with a hero header + 3-column card grid.
 * All services displayed together, each linking to its detail page.
 */
export default function Services() {
  const cardsRef = useRef<HTMLAnchorElement[]>([]);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      },
    );
  }, []);

  return (
    <section id="services" className="overflow-hidden bg-ivory">
      <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-8 md:px-10 md:pt-28 lg:px-16 lg:pt-36">
        {/* ── Header ───────────────────────────────── */}
        <div className="mb-12 max-w-2xl md:mb-20">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-champagne" />
            <span className="font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-champagne-dark">
              What We Offer
            </span>
          </div>
          <SplitReveal
            as="h2"
            emClassName="text-champagne-dark"
            className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-light leading-[0.92] tracking-[-0.025em] text-charcoal"
          >
            Sessions that <em>tell your story.</em>
          </SplitReveal>
          <p className="mt-6 max-w-lg font-sans text-[14px] font-light leading-[1.8] text-charcoal-light">
            From the first breath to every milestone — each session is designed to preserve your
            family&apos;s most treasured moments.
          </p>
        </div>

        {/* ── Card grid ───────────────────────────── */}
        <div className="services-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Link
              key={service.id}
              ref={(el) => { if (el) cardsRef.current[index] = el; }}
              href={`/services/${service.id}`}
              className="group relative block aspect-[3/4] overflow-hidden bg-charcoal"
              data-cursor="view"
              aria-label={`Explore ${service.title}`}
            >
              <Image
                src={service.imageUrl}
                alt={service.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
                draggable={false}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />

              {/* Number badge */}
              <span className="absolute left-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 font-sans text-[10px] tracking-widest text-white/70 backdrop-blur-sm">
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Text content */}
              <div className="absolute inset-x-0 bottom-0 z-10 p-6">
                <p className="font-sans text-[8px] font-medium uppercase tracking-[0.3em] text-champagne-light">
                  {service.category}
                </p>
                <h3 className="mt-2 font-serif text-[clamp(1.5rem,2.5vw,2rem)] font-light leading-[1] text-white">
                  {service.shortTitle}
                </h3>
                <p className="mt-3 max-w-xs font-sans text-[12px] font-light leading-5 text-white/70">
                  {service.description}
                </p>

                {/* CTA */}
                <span className="mt-5 inline-flex items-center gap-3 font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-champagne-light transition-colors duration-300 group-hover:text-white">
                  View Details
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/40 transition-all duration-500 group-hover:bg-champagne-light group-hover:text-charcoal">
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
