import { useEffect, useRef } from 'react';

/**
 * CustomCursor — outer ring + inner dot that follow the mouse.
 * States change based on data-cursor attribute on hovered elements:
 * - default: small dot + ring
 * - "link": ring scales up (1.6x)
 * - "image": ring scales up (2.5x) with "View" label
 * Hidden on touch devices.
 */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    if (mq.matches) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let dotX = 0;
    let dotY = 0;
    let rafId = 0;

    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot) return;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const tick = () => {
      // Ring: slow follow (lerp ~0.1)
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      ring.style.transform = `translate(${ringX - 14}px, ${ringY - 14}px)`;

      // Dot: fast follow (lerp ~0.25)
      dotX += (mouseX - dotX) * 0.25;
      dotY += (mouseY - dotY) * 0.25;
      dot.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`;

      // Label follows ring
      if (label) {
        label.style.transform = `translate(${ringX - 14}px, ${ringY + 10}px)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target?.closest) return;
      const cursorType = target.closest('[data-cursor]')?.getAttribute('data-cursor');

      if (cursorType === 'link') {
        ring.style.width = '44px';
        ring.style.height = '44px';
        ring.style.borderColor = '#B8977E';
        dot.style.opacity = '0';
      } else if (cursorType === 'image') {
        ring.style.width = '70px';
        ring.style.height = '70px';
        ring.style.borderColor = '#fff';
        ring.style.backgroundColor = 'rgba(184,151,126,0.15)';
        dot.style.opacity = '0';
        if (label) label.style.opacity = '1';
      }
    };

    const onLeave = () => {
      ring.style.width = '28px';
      ring.style.height = '28px';
      ring.style.borderColor = '#B8977E';
      ring.style.backgroundColor = 'transparent';
      dot.style.opacity = '1';
      if (label) label.style.opacity = '0';
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);

    // Use event delegation for dynamically added elements
    document.addEventListener('mouseover', (e) => {
      const el = e.target as HTMLElement;
      if (!el?.closest) return;
      const cursorType = el.closest('[data-cursor]')?.getAttribute('data-cursor');
      if (cursorType === 'link') {
        ring.style.width = '44px';
        ring.style.height = '44px';
        ring.style.borderColor = '#B8977E';
        dot.style.opacity = '0';
        if (label) label.style.opacity = '0';
      } else if (cursorType === 'image') {
        ring.style.width = '70px';
        ring.style.height = '70px';
        ring.style.borderColor = '#fff';
        ring.style.backgroundColor = 'rgba(184,151,126,0.15)';
        dot.style.opacity = '0';
        if (label) label.style.opacity = '1';
      }
    });

    document.addEventListener('mouseout', (e) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (!related || !related.closest || !related.closest('[data-cursor]')) {
        ring.style.width = '28px';
        ring.style.height = '28px';
        ring.style.borderColor = '#B8977E';
        ring.style.backgroundColor = 'transparent';
        dot.style.opacity = '1';
        if (label) label.style.opacity = '0';
      }
    });

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 28,
          height: 28,
          border: '1.5px solid #B8977E',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, background-color 0.3s ease',
          willChange: 'transform',
          mixBlendMode: 'difference',
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          backgroundColor: '#B8977E',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          transition: 'opacity 0.2s ease',
        }}
      />
      <div
        ref={labelRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          fontSize: '9px',
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: '#fff',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: 0,
          transition: 'opacity 0.2s ease',
          width: 28,
          textAlign: 'center',
          fontFamily: 'var(--font-sans)',
        }}
      >
        View
      </div>
    </>
  );
}
