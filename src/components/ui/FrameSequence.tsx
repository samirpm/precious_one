'use client';

import { useEffect, useRef, useState } from 'react';

interface FrameSequenceProps {
  /** Base path, e.g. "/video-frames/frame_" */
  basePath: string;
  /** First frame number (inclusive) */
  startFrame: number;
  /** Last frame number (inclusive) */
  endFrame: number;
  /** Current scroll progress 0–1 (drives which frame to show) */
  progress: number;
  /** Opacity (0–1) */
  opacity?: number;
  className?: string;
}

/**
 * Detect mobile once (cheap: screen width + coarse pointer).
 * Returns a stable value that won't change within a session.
 */
function detectMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
}

/**
 * Scroll-driven frame-by-frame animation.
 *
 * On desktop: loads every frame (~590 WebP images) for buttery playback.
 * On mobile: samples every 3rd frame (~197 images) to reduce memory and
 * network overhead while keeping the animation smooth at scroll speed.
 *
 * Progressively loads: first ~20 frames for immediate display,
 * then fills in the rest in background batches.
 */
export default function FrameSequence({
  basePath,
  startFrame,
  endFrame,
  progress,
  opacity = 1,
  className = '',
}: FrameSequenceProps) {
  const fullTotal = endFrame - startFrame + 1;
  const isMobileRef = useRef(detectMobile());
  // Mobile: use every 3rd frame → ~197 frames instead of 590
  const step = isMobileRef.current ? 3 : 1;
  const sampledFrames = useRef<number[]>([]);

  // Build sampled frame list once
  if (sampledFrames.current.length === 0) {
    for (let i = 0; i < fullTotal; i += step) {
      sampledFrames.current.push(startFrame + i);
    }
  }
  const totalFrames = sampledFrames.current.length;

  const [ready, setReady] = useState(false);
  const framesRef = useRef<Map<number, string>>(new Map());
  const [reducedMotion, setReducedMotion] = useState(false);
  const [, forceRender] = useState(0);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Progressive frame loading
  useEffect(() => {
    let cancelled = false;
    const frames = sampledFrames.current;

    const pad = (n: number) => String(n).padStart(4, '0');

    const loadFrame = (num: number): Promise<void> =>
      new Promise((resolve) => {
        if (framesRef.current.has(num)) { resolve(); return; }
        const img = new Image();
        img.onload = () => {
          if (!cancelled) {
            framesRef.current.set(num, img.src);
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = `${basePath}${pad(num)}.webp`;
      });

    const loadAll = async () => {
      // Phase 1: load ~20 sample frames for instant display
      const initialStep = Math.max(1, Math.floor(totalFrames / 20));
      const initial: number[] = [];
      for (let i = 0; i < totalFrames; i += initialStep) initial.push(frames[i]);
      if (!initial.includes(frames[0])) initial.unshift(frames[0]);

      await Promise.all(initial.map(loadFrame));
      if (cancelled) return;
      setReady(true);
      forceRender((n) => n + 1);

      // Phase 2: fill remaining frames in batches
      const batchSize = isMobileRef.current ? 15 : 20;
      const remaining = frames.filter((n) => !framesRef.current.has(n));
      for (let batch = 0; batch < remaining.length; batch += batchSize) {
        if (cancelled) break;
        await Promise.all(remaining.slice(batch, batch + batchSize).map(loadFrame));
        if (!cancelled) forceRender((n) => n + 1);
      }
    };

    loadAll();
    return () => { cancelled = true; };
  }, [basePath, startFrame, endFrame, totalFrames]);

  // Map progress (0–1) → sampled frame index → actual frame number
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const frameIndex = reducedMotion
    ? 0
    : Math.min(Math.floor(clampedProgress * (totalFrames - 1)), totalFrames - 1);
  const currentFrameNum = sampledFrames.current[frameIndex] ?? startFrame;
  const src = framesRef.current.get(currentFrameNum);

  // Fallback: first frame while loading or at progress=0
  const fallbackSrc = framesRef.current.get(startFrame);

  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden="true">
      {(src || fallbackSrc) ? (
        <img
          src={src || fallbackSrc}
          alt=""
          className="h-full w-full object-cover"
          style={{ opacity }}
        />
      ) : (
        <div className="h-full w-full bg-[#F0E4D8]" />
      )}
    </div>
  );
}
