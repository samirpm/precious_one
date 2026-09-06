'use client';

import { useCallback, useRef, type CSSProperties, type ReactNode } from 'react';
import './TiltCard.css';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Maximum tilt angle in degrees. Default 10 */
  maxTilt?: number;
  /** Show a glare highlight that follows the cursor. Default true */
  glare?: boolean;
  /** Hover scale amount. Default 1.02 */
  scale?: number;
}

/**
 * TiltCard — a 3D tilt-on-hover container (React Bits pattern).
 * Rotates toward the cursor with perspective and an optional glare
 * highlight. Desktop-only: ignored on touch via the (hover: none) query.
 */
export default function TiltCard({
  children,
  className = '',
  maxTilt = 10,
  glare = true,
  scale = 1.02,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el || e.pointerType !== 'mouse') return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      el.style.setProperty('--rx', `${((py - 0.5) * 2 * maxTilt).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${((px - 0.5) * 2 * maxTilt).toFixed(2)}deg`);
      if (glare) {
        el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
        el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
      }
    },
    [maxTilt, glare],
  );

  const onPointerLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.classList.add('tilt-card--settle');
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    window.setTimeout(() => el.classList.remove('tilt-card--settle'), 550);
  }, []);

  return (
    <div
      ref={cardRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`tilt-card ${className}`.trim()}
      style={
        {
          '--rx': '0deg',
          '--ry': '0deg',
          '--scale': String(scale),
        } as CSSProperties
      }
    >
      {children}
      {glare && <div className="tilt-card__glare" aria-hidden="true" />}
    </div>
  );
}