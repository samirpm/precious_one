'use client';

import { useMemo, useEffect, useState } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import CinematicHero from '@/components/sections/CinematicHero';
import FrameSequence from '@/components/ui/FrameSequence';
import PortfolioShowcase from '@/components/sections/PortfolioShowcase';

/**
 * CinematicStage
 *
 * A single pinned viewport that orchestrates the cinematic transition:
 *   Hero → Camera Assembly → Portfolio Items (scroll-driven) → Next Section
 *
 * The outer section has enough scroll height to provide scroll progress.
 * The inner viewport is position:sticky so all content remains visually
 * anchored while scrolling only drives the timeline.
 *
 * Timeline (master progress p, 0–1):
 *  0.00–0.15  Hero translates upward (content scrolls above viewport)
 *  0.00–0.20  Camera enters from below, in continuous conveyor motion
 *  0.20–0.35  Camera holds and frames assemble
 *  0.35–0.45  Camera fades out
 *  0.45–0.55  Portfolio intro text appears
 *  0.55–0.92  Portfolio items scroll through (scroll-driven index)
 *  0.90–1.00  Portfolio fades out, next section begins
 *
 * After the stage completes, the site continues normally into Services /
 * About / Contact.
 */
export default function CinematicStage() {
  const { progress, containerRef } = useScrollProgress();

  // Gate the camera reel behind a "mounted" flag so it never appears in the
  // initial HTML (which would otherwise cause a hydration mismatch, since the
  // reel is removed on mobile). After hydration we decide: desktop mounts the
  // reel; mobile skips it entirely — no frames are ever requested on mobile.
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Timeline bounds (mobile skips the camera reel entirely) ──
  // Desktop: hero exit 0–0.15 → camera 0.15–0.45 → portfolio 0.45–1.0
  // Mobile:  hero exit 0–0.30 → portfolio 0.20–1.0
  const heroExitEnd = isMobile ? 0.30 : 0.15;
  const cameraStart = heroExitEnd;
  const cameraHoldEnd = isMobile ? 0.30 : 0.40;
  const cameraFadeEnd = isMobile ? 0.35 : 0.50;
  const portfolioIntroStart = isMobile ? 0.25 : 0.45;
  const portfolioIntroEnd = isMobile ? 0.45 : 0.55;
  const portfolioItemsStart = isMobile ? 0.35 : 0.55;
  const portfolioItemsEnd = isMobile ? 0.90 : 0.92;
  const portfolioExitStart = isMobile ? 0.88 : 0.90;

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
    if (progress <= cameraFadeEnd - 0.10) return 1;
    if (progress >= cameraFadeEnd) return 0;
    return 1 - (progress - (cameraFadeEnd - 0.10)) / 0.10;
  }, [progress, isMobile, cameraFadeEnd]);

  // ── Camera frame sub-progress (maps assembly range to 0–1) ──
  const cameraFrameProgress = useMemo(() => {
    if (progress <= cameraStart) return 0;
    if (progress >= cameraHoldEnd) return 1;
    return (progress - cameraStart) / (cameraHoldEnd - cameraStart);
  }, [progress, cameraStart, cameraHoldEnd]);

  // ── Portfolio layer opacity: intro fades in, items scroll, then exit ──
  const portfolioLayerOpacity = useMemo(() => {
    if (progress <= portfolioIntroStart) return 0;
    if (progress <= portfolioIntroEnd) {
      // Fade in during intro
      return (progress - portfolioIntroStart) / (portfolioIntroEnd - portfolioIntroStart);
    }
    if (progress <= portfolioExitStart) return 1;
    // Fade out at exit
    return 1 - (progress - portfolioExitStart) / (1 - portfolioExitStart);
  }, [progress, portfolioIntroStart, portfolioIntroEnd, portfolioExitStart]);

  // ── Portfolio item scroll index (maps scroll range → 0–14 fractional) ──
  const portfolioIndex = useMemo(() => {
    if (progress <= portfolioItemsStart) return 0;
    if (progress >= portfolioItemsEnd) return 14;
    const t = (progress - portfolioItemsStart) / (portfolioItemsEnd - portfolioItemsStart);
    return t * 14; // 15 items (0–14)
  }, [progress, portfolioItemsStart, portfolioItemsEnd]);

  return (
    <section
      ref={containerRef}
      className="relative bg-[#FAF8F5]"
      style={{ height: '1400vh' }}
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
        {mounted && !isMobile && (
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
            opacity: portfolioLayerOpacity,
            willChange: 'opacity',
            pointerEvents: portfolioLayerOpacity < 0.01 ? 'none' : 'auto',
          }}
        >
          <PortfolioShowcase
            introProgress={portfolioLayerOpacity}
            portfolioIndex={portfolioIndex}
          />
        </div>
      </div>
    </section>
  );
}
