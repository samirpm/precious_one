'use client';

import { useRef, useState, useEffect } from 'react';
import { portfolio } from '@/lib/content';
import { CoverflowCarousel, type CoverflowSlide } from '@/components/ui/coverflow-carousel';

/**
 * PortfolioShowcase
 *
 * Maps the portfolio data to CoverflowSlide[] and renders the
 * CoverflowCarousel. Includes an intro title that fades out
 * when the user scrolls past the cinematic stage reveal,
 * then shows the interactive 3D carousel driven by scroll position.
 *
 * Scroll-driven: the `portfolioIndex` prop (0–14 fractional) controls
 * which slide is active, advancing as the user scrolls down.
 * Only after all portfolio items have scrolled through does the
 * section transition to the next part of the site.
 */

/** Precompute slides once — avoids re-mapping on every render. */
const slides: CoverflowSlide[] = portfolio.map((item) => ({
  src: item.imageUrl,
  alt: item.title,
  title: item.title,
  subtitle: item.category
    .replace('-', ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase()),
}));

export interface PortfolioShowcaseProps {
  /** When inside CinematicStage: intro fade-out trigger. */
  introProgress?: number;
  /** Scroll-driven fractional slide index (0–14). Controls carousel position. */
  portfolioIndex?: number;
}

export default function PortfolioShowcase({
  introProgress,
  portfolioIndex,
}: PortfolioShowcaseProps) {
  const showIntro = introProgress !== undefined;

  // Intro: hold until 0.15, fade 0.15→0.35
  const introOpacity = showIntro
    ? introProgress <= 0.15
      ? 1
      : introProgress >= 0.35
        ? 0
        : 1 - (introProgress - 0.15) / 0.2
    : 0;

  const introY = showIntro
    ? introProgress <= 0.15
      ? 0
      : -20 * ((introProgress - 0.15) / 0.2)
    : -20;

  // Carousel: fade in during the same window
  const carouselOpacity = showIntro
    ? introProgress <= 0.10
      ? 0
      : introProgress >= 0.30
        ? 1
        : (introProgress - 0.10) / 0.2
    : 1;

  // Reduced motion: show first slide statically, no settle animation
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    setReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }, []);

  return (
    <div className="relative h-full w-full bg-[#FAF8F5] flex items-center justify-center">
      {/* Intro text — holds, then fades */}
      {showIntro && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          style={{
            opacity: introOpacity,
            transform: `translateY(${introY}px)`,
            transition: 'opacity 0.08s linear, transform 0.08s linear',
          }}
        >
          <div className="text-center px-6">
            <div className="mb-5 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-[#C5A572]" />
              <span className="font-sans text-[9px] font-medium uppercase tracking-[0.35em] text-[#B8956A]">
                Our Work
              </span>
              <span className="h-px w-10 bg-[#C5A572]" />
            </div>
            <h2 className="font-serif text-[clamp(2.5rem,6vw,6rem)] font-light leading-[0.88] tracking-[-0.03em] text-[#2D2926]">
              Precious
              <br />
              <em className="text-[#B8956A]">Moments.</em>
            </h2>
            <p className="mt-6 max-w-md mx-auto font-sans text-[13px] font-light leading-relaxed text-[#9C918A]">
              Every photograph tells a story of love, tenderness, and the
              fleeting beauty of life&apos;s most precious stages.
            </p>
          </div>
        </div>
      )}

      {/* Coverflow Carousel — scroll-driven, no interactive controls */}
      <div
        className="relative z-5 w-full max-w-[90vw] mx-auto"
        style={{
          opacity: carouselOpacity,
          transition: 'opacity 0.2s ease',
          pointerEvents: 'none',
        }}
      >
        <CoverflowCarousel
          slides={slides}
          loop
          showCaption
          slideIndex={portfolioIndex}
          rotate={44}
          depth={0.6}
          perspective={3}
          falloff={0.56}
          fade={0.1}
          cardWidth={
            reducedMotion
              ? 'clamp(200px, 30vw, 340px)'
              : 'clamp(148px, 22vw, 260px)'
          }
          label="Photography portfolio"
        />
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#2D2926]/8">
        <div className="h-full bg-[#C5A572]/60 w-full" />
      </div>
    </div>
  );
}
