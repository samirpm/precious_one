'use client';

import { useEffect, useState } from 'react';

interface PageCurtainProps {
  /** Called when the curtain animation completes */
  onComplete?: () => void;
}

/**
 * PageCurtain — two panels that split apart to reveal content.
 * Used after LogoIntro completes.
 */
export default function PageCurtain({ onComplete }: PageCurtainProps) {
  const [phase, setPhase] = useState<'visible' | 'opening' | 'done'>('visible');

  useEffect(() => {
    // Give LogoIntro time to finish, then start opening
    const timer = setTimeout(() => {
      setPhase('opening');
    }, 100);

    const doneTimer = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 95,
        display: 'flex',
        pointerEvents: 'none',
      }}
    >
      {/* Left panel */}
      <div
        style={{
          width: '50%',
          height: '100%',
          backgroundColor: '#1A1A1A',
          transform: phase === 'opening' ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      />
      {/* Right panel */}
      <div
        style={{
          width: '50%',
          height: '100%',
          backgroundColor: '#1A1A1A',
          transform: phase === 'opening' ? 'translateX(100%)' : 'translateX(0)',
          transition: 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      />
    </div>
  );
}
