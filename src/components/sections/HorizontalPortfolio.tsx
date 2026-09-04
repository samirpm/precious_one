'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import { portfolio } from '@/lib/content';
import Image from 'next/image';

/**
 * HorizontalPortfolio
 *
 * The full photography gallery. It renders its intro and horizontal
 * editorial track, and is driven by an external scroll `progress`
 * (0–1) supplied by the cinematic stage, so it can be embedded as a
 * pinned layer that reveals within the cinematic scene.
 *
 * Timeline (progress 0–1):
 *  0.00–0.30  Intro text fully visible (generous hold)
 *  0.30–0.45  Intro fades out
 *  0.38–0.52  Horizontal track fades in
 *  0.42–1.00  Track scrolls right-to-left (slower pace)
 */

interface HorizontalPortfolioProps {
  /** Scroll timeline 0–1 driving the reveal + horizontal scroll */
  progress: number;
}

// Uniform image dimensions — all cards same height and width
const IMAGE_HEIGHT = '60vh';
const IMAGE_MAX_HEIGHT = '520px';
const IMAGE_WIDTH = 'clamp(260px, 26vw, 400px)';

export default function HorizontalPortfolio({ progress }: HorizontalPortfolioProps) {
  // Intro text: generous hold, then fades out as the track takes over
  const introOpacity = useMemo(() => {
    if (progress <= 0.30) return 1;
    if (progress >= 0.45) return 0;
    return 1 - (progress - 0.30) / 0.15;
  }, [progress]);

  const introTranslateY = useMemo(() => {
    if (progress <= 0.30) return 0;
    if (progress >= 0.45) return -30;
    return -30 * ((progress - 0.30) / 0.15);
  }, [progress]);

  // Track scroll: starts later, slower pace (0.42 → 1.0)
  const trackProgress = useMemo(() => {
    if (progress <= 0.42) return 0;
    if (progress >= 1) return 1;
    return (progress - 0.42) / 0.58;
  }, [progress]);

  // Track fade-in: 0.38 → 0.52
  const imageOpacity = useMemo(() => {
    if (progress <= 0.38) return 0;
    if (progress >= 0.52) return 1;
    return (progress - 0.38) / 0.14;
  }, [progress]);

  // Calculate total track width
  const imageCount = portfolio.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.scrollWidth);
        setViewportWidth(window.innerWidth);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [imageCount]);

  // Horizontal translation: right-to-left (images enter from right, exit left)
  const trackTranslateX = useMemo(() => {
    if (trackWidth === 0 || viewportWidth === 0) return 0;
    const maxTranslate = trackWidth - viewportWidth;
    if (maxTranslate <= 0) return 0;
    return -trackProgress * maxTranslate;
  }, [trackProgress, trackWidth, viewportWidth]);

  // Reduced motion
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    setReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }, []);

  return (
    <>
      {/* Portfolio Intro — visible at reveal, fades out as track scrolls */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        style={{
          opacity: introOpacity,
          transform: `translateY(${introTranslateY}px)`,
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

      {/* Horizontal Track — images scroll right-to-left */}
      <div
        className="absolute inset-0 flex items-center"
        style={{
          opacity: imageOpacity,
          transition: 'opacity 0.15s ease',
        }}
      >
        <div
          ref={trackRef}
          className="flex items-center gap-8 sm:gap-10 md:gap-14 lg:gap-20 px-12 sm:px-16 md:px-24 lg:px-32"
          style={{
            transform: `translateX(${trackTranslateX}px)`,
            willChange: 'transform',
            transition: reducedMotion ? 'none' : undefined,
          }}
        >
          {Array.from({ length: imageCount }).map((_, i) => {
            const item = portfolio[i];
            if (!item) return null;

            return (
              <div
                key={item.id}
                className="shrink-0 relative group"
                style={{
                  height: IMAGE_HEIGHT,
                  maxHeight: IMAGE_MAX_HEIGHT,
                  width: IMAGE_WIDTH,
                }}
              >
                {/* Image */}
                <div className="relative h-full w-full overflow-hidden bg-[#F0E4D8]">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="30vw"
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
                </div>

                {/* Minimal caption */}
                <div className="mt-3 flex items-start justify-between">
                  <div>
                    <p className="font-sans text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-[#B8956A]">
                      {item.category.replace('-', ' ')}
                    </p>
                    <p className="mt-0.5 font-serif text-[13px] sm:text-[15px] font-light text-[#2D2926]">
                      {item.title}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtle progress line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#2D2926]/8">
        <div
          className="h-full bg-[#C5A572]/60"
          style={{
            width: `${trackProgress * 100}%`,
            transition: 'width 0.1s linear',
          }}
        />
      </div>
    </>
  );
}
