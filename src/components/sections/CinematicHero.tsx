'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/*  Slide data — each slide is a hero image with a category label             */
/* -------------------------------------------------------------------------- */
const SLIDES = [
  {
    src: '/images/portfolio/photo-5.jpeg',
    alt: 'Precious One Photography — newborn portrait',
    category: 'Newborn',
  },
  {
    src: '/images/portfolio/photo-1.jpeg',
    alt: 'Precious One Photography — family portrait',
    category: 'Family',
  },
  {
    src: '/images/portfolio/photo-3.jpeg',
    alt: 'Precious One Photography — maternity session',
    category: 'Maternity',
  },
  {
    src: '/images/portfolio/photo-7.jpeg',
    alt: 'Precious One Photography — milestone session',
    category: 'Milestones',
  },
  {
    src: '/images/portfolio/photo-10.jpeg',
    alt: 'Precious One Photography — cake smash',
    category: 'Cake Smash',
  },
] as const;

const INTERVAL = 5000; // ms between auto-cycles

/* -------------------------------------------------------------------------- */
/*  CinematicHero — full-viewport auto-cycling carousel, inspired by lieben.no */
/* -------------------------------------------------------------------------- */
export default function CinematicHero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  /* ---- auto-cycle timer ---- */
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  /* ---- parallax on the active image layer ---- */
  useGSAP(
    () => {
      if (!trackRef.current || !sectionRef.current) return;

      gsap.to(trackRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-charcoal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
      }}
      tabIndex={0}
      aria-label="Hero image carousel"
      role="region"
    >
      {/* ---- Slides (stacked, cross-faded via opacity) ---- */}
      <div ref={trackRef} className="absolute inset-0 -top-[8%] h-[116%]">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
            aria-hidden={i !== current}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* ---- Gradient scrim for text readability ---- */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/45 via-transparent to-black/55" />

      {/* ---- Centered overlay content ---- */}
      <div className="pointer-events-none relative z-[2] flex h-full flex-col items-center justify-center px-6">
        <div className="flex items-center gap-2.5 sm:gap-4">
          <span className="h-px w-6 sm:w-10 bg-champagne-light" />
          <span className="font-sans text-[8px] sm:text-[9px] font-medium uppercase tracking-[0.2em] sm:tracking-[0.35em] text-champagne-light">
            Abu Dhabi · UAE
          </span>
          <span className="h-px w-6 sm:w-10 bg-champagne-light" />
        </div>

        <p className="mt-5 sm:mt-6 max-w-2xl text-center font-serif text-[clamp(1.5rem,4.5vw,3.25rem)] font-light leading-[1.05] tracking-[-0.02em] text-white">
          Timeless memories,
          <br />
          <em className="text-champagne-light">beautifully preserved.</em>
        </p>

        <a
          href="#contact"
          className="pointer-events-auto mt-6 sm:mt-8 inline-block rounded-full border border-white/35 px-7 py-3 sm:px-9 sm:py-3.5 font-sans text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.22em] text-white backdrop-blur-sm transition-all duration-300 hover:border-champagne hover:bg-champagne/25 hover:text-white"
        >
          Book a Session
        </a>
      </div>

      {/* ---- Left / Right arrows (lieben.no style) — hidden on mobile, visible sm+ ---- */}
      <button
        type="button"
        onClick={prev}
        className="hidden sm:block absolute left-6 top-1/2 z-[3] -translate-y-1/2 p-3 text-white/50 transition-colors hover:text-white"
        aria-label="Previous slide"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        type="button"
        onClick={next}
        className="hidden sm:block absolute right-6 top-1/2 z-[3] -translate-y-1/2 p-3 text-white/50 transition-colors hover:text-white"
        aria-label="Next slide"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* ---- Bottom controls row ---- */}
      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-[3] flex items-center justify-between px-5 sm:px-7">
        {/* Slide counter — bottom left */}
        <div className="font-sans text-[10px] sm:text-[11px] tabular-nums tracking-wider text-white/60">
          <span className="text-white/90">
            {String(current + 1).padStart(2, '0')}
          </span>
          <span className="mx-1.5 text-white/30">/</span>
          <span>{String(SLIDES.length).padStart(2, '0')}</span>
        </div>

        {/* Category label — bottom center (mobile: hidden, replaced by dots) */}
        <div className="hidden sm:block text-center">
          <span
            key={current}
            className="inline-block font-sans text-[10px] font-medium uppercase tracking-[0.4em] text-white/70 animate-[fadeIn_0.6s_ease]"
          >
            {SLIDES[current].category}
          </span>
        </div>

        {/* Dot indicators — bottom right */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-[3px] rounded-full transition-all duration-500 ${
                i === current
                  ? 'w-5 bg-white/90'
                  : 'w-[3px] bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ---- Inline keyframe for category label fade-in ---- */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}