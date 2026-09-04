'use client';

import { useMemo, useEffect, useRef, useState } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import CinematicHero from '@/components/sections/CinematicHero';
import FrameSequence from '@/components/ui/FrameSequence';
import HorizontalPortfolio from '@/components/sections/HorizontalPortfolio';

/**
 * CinematicStage
 *
 * A single pinned viewport that orchestrates the cinematic transition:
 *   Hero → Camera Assembly → Portfolio Reveal
 *
 * The outer section has enough scroll height to provide scroll progress.
 * The inner viewport is position:sticky so all content remains visually
 * anchored while scrolling only drives the timeline.
 *
 * Timeline (master progress p, 0–1):
 *  0.00–0.20  Hero translates upward (content scrolls above viewport)
 *  0.00–0.20  Camera enters from below, in continuous conveyor motion
 *  0.20–0.62  Camera holds and frames assemble
 *  0.60–0.76  Camera fades out
 *  0.62–1.00  Real portfolio reveals, then scrolls horizontally
 *
 * After the stage completes, the site continues normally into Services /
 * About / Contact.
 */
export default function CinematicStage() {
  const { progress, containerRef } = useScrollProgress();

  // Detect mobile synchronously so the camera reel never mounts (and never
  // fires its frame-image requests) on mobile — avoids a flash + wasted loads.
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Timeline bounds (mobile skips the camera reel entirely) ──
  // Desktop: hero exit 0–0.20 → camera reel 0.20–0.62 → portfolio 0.62–1.0
  // Mobile:  hero exit 0–0.30 → portfolio reveal 0.20–0.45 → scroll 0.30–1.0
  const heroExitEnd = isMobile ? 0.30 : 0.20;
  const portfolioRevealStart = isMobile ? 0.20 : 0.62;
  const portfolioRevealEnd = isMobile ? 0.45 : 0.76;
  const portfolioScrollStart = isMobile ? 0.30 : 0.62;

  // ── Hero translates upward (no fade) ──
  // Hero moves 0 → -100vh as the user scrolls (content goes above).
  const heroTranslateY = useMemo(() => {
    if (progress <= 0) return 0;
    if (progress >= heroExitEnd) return -100;
    return -(progress / heroExitEnd) * 100;
  }, [progress, heroExitEnd]);

  // ── Camera enters from below, in sync with hero exit (conveyor) ──
  // Camera moves 100vh → 0 so there is never a gap as the hero leaves.
  const cameraTranslateY = useMemo(() => {
    if (progress <= 0) return 100;
    if (progress >= heroExitEnd) return 0;
    return (1 - progress / heroExitEnd) * 100;
  }, [progress, heroExitEnd]);

  // ── Camera opacity: fully visible once in, fades out to portfolio ──
  // Invisible on mobile (the reel is not rendered there).
  const cameraOpacity = useMemo(() => {
    if (isMobile) return 0;
    if (progress <= 0.60) return 1;
    if (progress >= 0.76) return 0;
    return 1 - (progress - 0.60) / 0.16;
  }, [progress, isMobile]);

  // ── Camera frame sub-progress (maps assembly range to 0–1) ──
  const cameraFrameProgress = useMemo(() => {
    if (progress <= heroExitEnd) return 0;
    if (progress >= 0.62) return 1;
    return (progress - heroExitEnd) / (0.62 - heroExitEnd);
  }, [progress, heroExitEnd]);

  // ── Portfolio sub-progress (maps portfolio portion of timeline to 0–1) ──
  const portfolioProgress = useMemo(() => {
    if (progress <= portfolioScrollStart) return 0;
    if (progress >= 1) return 1;
    return (progress - portfolioScrollStart) / (1 - portfolioScrollStart);
  }, [progress, portfolioScrollStart]);

  // ── Portfolio layer reveal (0 → 1) as the camera dissolves ──
  const portfolioRevealOpacity = useMemo(() => {
    if (progress <= portfolioRevealStart) return 0;
    if (progress >= portfolioRevealEnd) return 1;
    return (progress - portfolioRevealStart) / (portfolioRevealEnd - portfolioRevealStart);
  }, [progress, portfolioRevealStart, portfolioRevealEnd]);

  return (
    <section
      ref={containerRef}
      className="relative bg-[#FAF8F5]"
      style={{ height: '850vh' }}
    >
      {/* Sticky viewport — stays pinned while user scrolls */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#FAF8F5]">

        {/* ─── LAYER 1: Hero — scrolls upward, no fade ─── */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${heroTranslateY}vh)`,
            willChange: 'transform',
            pointerEvents: heroTranslateY <= -99 ? 'none' : 'auto',
          }}
        >
          <CinematicHero />
        </div>

        {/* ─── LAYER 2: Camera Assembly — enters from below (desktop only) ─── */}
        {!isMobile && (
        <div
          className="absolute inset-0 bg-[#FAF8F5]"
          style={{
            transform: `translateY(${cameraTranslateY}vh)`,
            opacity: cameraOpacity,
            willChange: 'transform, opacity',
            pointerEvents: cameraOpacity < 0.01 ? 'none' : 'auto',
          }}
        >
          <FrameSequence
            basePath="/video-frames/frame_"
            startFrame={11}
            endFrame={600}
            progress={cameraFrameProgress}
            opacity={1}
            className="h-full w-full"
          />
          {/* Warm vignette at edges for seamless blending */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[#FAF8F5]/20" />
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#FAF8F5]/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAF8F5]/60 to-transparent" />
            <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-[#FAF8F5]/40 to-transparent" />
            <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-[#FAF8F5]/40 to-transparent" />
          </div>
        </div>
        )}

        {/* ─── LAYER 3: Real Portfolio reveal ─── */}
        <div
          className="absolute inset-0 bg-[#FAF8F5]"
          style={{
            opacity: portfolioRevealOpacity,
            willChange: 'opacity',
            pointerEvents: portfolioRevealOpacity < 0.01 ? 'none' : 'auto',
          }}
        >
          <HorizontalPortfolio progress={portfolioProgress} />
        </div>
      </div>
    </section>
  );
}
