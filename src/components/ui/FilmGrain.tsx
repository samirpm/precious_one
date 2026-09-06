'use client';

import { useEffect, useState } from 'react';

/**
 * FilmGrain — a full-screen animated noise overlay that adds
 * cinematic texture to the page. Uses SVG feTurbulence filter
 * for performant animated grain. Hidden for reduced-motion users.
 */
export default function FilmGrain() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 0.035,
        mixBlendMode: 'overlay',
      }}
    >
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="film-grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          >
            <animate
              attributeName="seed"
              from="1"
              to="100"
              dur="8s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        style={{
          width: '100%',
          height: '100%',
          filter: 'url(#film-grain-filter)',
          WebkitFilter: 'url(#film-grain-filter)',
        }}
      />
    </div>
  );
}
