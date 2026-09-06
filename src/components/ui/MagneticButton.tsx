'use client';

import { useRef, type ReactNode } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  /** Pull intensity 0–1. Default 0.3 */
  intensity?: number;
  /** Threshold in px for activation. Default 80 */
  threshold?: number;
  className?: string;
}

/**
 * MagneticButton — wraps any element and makes it pull
 * toward the cursor when nearby, creating a magnetic feel.
 * Desktop only; passes through on touch devices.
 */
export default function MagneticButton({
  children,
  intensity = 0.3,
  threshold = 80,
  className = '',
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < threshold) {
      const pull = (1 - dist / threshold) * intensity;
      el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
    }
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0, 0)';
    el.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
    setTimeout(() => {
      if (el) el.style.transition = '';
    }, 400);
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ display: 'inline-block' }}
    >
      {children}
    </div>
  );
}
