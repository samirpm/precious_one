import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Testimonials — cards seated around a true 3D ring.
 *
 * Each card is rotated `i * (360/n)` degrees around a vertical axis and pushed
 * out on `translateZ(R)`, so together they form a cylinder. The whole ring is
 * spun with a horizontal drag. Backfaces are NOT hidden, so the far side of
 * the ring stays visible through the gaps between the front cards — text and
 * all, read mirrored — which is what sells the cylinder over a flat fan.
 *
 * Two geometry presets keep the ring elegant on every screen:
 *  - Desktop: preserved look, narrow cards seated far out on a wide radius.
 *  - Mobile:  enlarged cards (label overlaid on the card bottom) on a tighter
 *    radius so all six remain in the wrap and every card's contents are legible.
 * A small toggle (mobile-only) lets you preview either orientation.
 *
 * Behaviours are deliberately isolated one-per-effect/state so nothing fights:
 * autoplay, drag, breakpoint detection, reduced-motion and reveal each live in
 * their own block.
 */
type Testimonial = {
  quote: string;
  name: string;
  role: string;
  image: string;
  alt: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      'They captured our baby’s very first days with such patience and tenderness. Every frame feels like a piece of art we will treasure forever.',
    name: 'Aisha M.',
    role: 'First-time mum · Al Reem Island',
    image: '/images/portfolio/photo-8.jpeg',
    alt: 'A peaceful newborn portrait in soft studio light',
  },
  {
    quote:
      'Warm, private, and completely stress-free. Our family photograph brought my parents to tears.',
    name: 'The Khan Family',
    role: 'Saadiyat Island',
    image: '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.13 PM (1).jpeg',
    alt: 'A family portrait against a floral backdrop',
  },
  {
    quote:
      'From the booking to the final prints, everything felt personal. We booked again for the cake smash before we even left.',
    name: 'Layla & Omar',
    role: 'Yas Island',
    image: '/images/portfolio/WhatsApp Image 2026-09-01 at 5.42.11 PM (3).jpeg',
    alt: 'A delicate newborn portrait in lace',
  },
  // Ring filler — consistent placeholder voice so the cylinder reads as full.
  {
    quote:
      'We left the session feeling like family. Every image we received felt effortless, candid, and full of light.',
    name: 'Fatima & Khaled',
    role: 'Parents · Baniyas',
    image: '/images/portfolio/photo-2.jpeg',
    alt: 'A serene newborn portrait with a delicate headband',
  },
  {
    quote:
      'The kind of care you cannot put a price on. She waited, she whispered, she caught the exact moment our daughter smiled.',
    name: 'Noor E.',
    role: 'New mum · Al Raha Beach',
    image: '/images/portfolio/photo-5.jpeg',
    alt: 'A swaddled newborn held in a warm embrace',
  },
  {
    quote:
      'We framed three prints for the nursery and one for the hall. Guests keep mistaking them for painted art.',
    name: 'Asma & Rakan',
    role: 'Parents · Corniche',
    image: '/images/portfolio/photo-11.jpeg',
    alt: 'A newborn with a dreamy, peaceful expression',
  },
];

const locations = ['Al Reem Island', 'Saadiyat Island', 'Yas Island', 'Baniyas', 'Al Raha', 'Corniche'];

const COUNT = testimonials.length;
const STEP = 360 / COUNT; // degrees between neighbouring cards
const DRAG_SCALE = 0.35; // degrees the ring turns per pixel dragged
const FLING_MS = 200; // inertia window applied to a fast swipe
const AUTOPLAY_MS = 5600;

/** Normalise an angle into [0, 360). */
const norm = (deg: number) => ((deg % 360) + 360) % 360;

/** Signed shortest distance `target - current` in [-180, 180). */
const signedDelta = (target: number, current: number) => {
  const d = norm(target - current);
  return d > 180 ? d - 360 : d;
};

/** Pick the geometry for the current effective orientation.
 *  stageH / stageMinH are raw CSS values applied via inline style (CSS min()
 *  doesn't work as a Tailwind class name). */
const geometry = (mobile: boolean) =>
  mobile
    ? {
        cardW: 'min(38vw, 175px)',
        ringR: 'min(66vw, 310px)',
        perspective: 'min(260vw, 1500px)',
        stageH: 'min(110vw, 480px)',
        stageMinH: '340px',
      }
    : {
        cardW: 'min(24vw, 300px)',
        ringR: 'min(32vw, 350px)',
        perspective: 'min(180vw, 1700px)',
        stageH: 'min(118vw, 620px)',
        stageMinH: '380px',
      };

type Layout = 'auto' | 'mobile' | 'desktop';

export default function Testimonials() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  // — Behaviour: breakpoint detection (isolated in its own effect) —
  const [isMobile, setIsMobile] = useState(false);
  // — Behaviour: manual orientation override (isolated state) —
  const [layout, setLayout] = useState<Layout>('auto');
  // — Behaviour: autoplay tick counter, drives the live "pop" indicator —
  const [autoplayCount, setAutoplayCount] = useState(0);

  const rotationRef = useRef(0); // mirror of `rotation`, safe to read in handlers
  const drag = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startRot: 0,
    lastX: 0,
    lastT: 0,
    vel: 0,
    moved: false,
  }).current;

  // Effective orientation: an explicit toggle wins; otherwise follow the viewport.
  const mobileLayout = layout === 'mobile' || (layout === 'auto' && isMobile);
  const g = geometry(mobileLayout);

  // — Behaviour: prefers-reduced-motion (isolated effect) — freeze autoplay.
  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // — Behaviour: breakpoint detection (isolated effect) — tracks viewport width.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const setRot = useCallback((deg: number) => {
    rotationRef.current = deg;
    setRotation(deg);
  }, []);

  /** Which card faces the viewer right now (mirror of `rotation`). */
  const activeIndex = useMemo(() => {
    const i = Math.round(norm(rotationRef.current) / STEP) % COUNT;
    return (COUNT - i) % COUNT;
  }, [rotation]);

  const spinTo = useCallback(
    (index: number) => {
      // Card `index` faces forward when rotation ≡ -index * STEP.
      const target = -index * STEP;
      setRot(rotationRef.current + signedDelta(target, rotationRef.current));
    },
    [setRot],
  );

  const goNext = useCallback(() => spinTo((activeIndex + 1) % COUNT), [spinTo, activeIndex]);
  const goPrev = useCallback(() => spinTo((COUNT + activeIndex - 1) % COUNT), [spinTo, activeIndex]);

  // — Behaviour: autoplay (isolated effect) — always on, pausing only during an
  // active drag or reduced-motion. Hover no longer pauses it. Each tick advances
  // one card and bumps the counter so the "pop" is observable to tests.
  useEffect(() => {
    if (reducedMotion || dragging) return;
    const t = window.setTimeout(() => {
      setRot(rotationRef.current + STEP);
      setAutoplayCount((c) => c + 1);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [rotation, dragging, reducedMotion, setRot]);

  // — Behaviour: scroll reveal (isolated effect) — one-time GSAP entrance.
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const targets = rootRef.current?.querySelectorAll('[data-reveal]');
      if (!targets?.length) return;
      gsap.fromTo(
        targets,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        },
      );
    },
    { scope: rootRef },
  );

  /* ─── Pointer drag → ring spin ─── */
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag.active = true;
    drag.pointerId = e.pointerId;
    drag.startX = e.clientX;
    drag.startRot = rotationRef.current;
    drag.lastX = e.clientX;
    drag.lastT = performance.now();
    drag.vel = 0;
    drag.moved = false;
    setDragging(true);
    stageRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.active || e.pointerId !== drag.pointerId) return;
    const dx = e.clientX - drag.startX;
    if (Math.abs(dx) > 2) drag.moved = true;
    const now = performance.now();
    const dt = now - drag.lastT;
    if (dt > 0) drag.vel = (e.clientX - drag.lastX) / dt; // px per ms
    drag.lastX = e.clientX;
    drag.lastT = now;
    setRot(drag.startRot + dx * DRAG_SCALE);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.active || e.pointerId !== drag.pointerId) return;
    drag.active = false;
    try {
      stageRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    const cur = rotationRef.current;
    const fling = reducedMotion ? 0 : drag.vel * FLING_MS * DRAG_SCALE;
    const idx = Math.round(norm(cur + fling) / STEP);
    setDragging(false);
    setRot(idx * STEP); // settle on the nearest card
  };

  const onPointerCancel = (e: React.PointerEvent) => {
    if (!drag.active || e.pointerId !== drag.pointerId) return;
    drag.active = false;
    setDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  };

  /**
   * 1 at the front, fading toward the far side — same curve every layout, so the
   * ring reads the same on PC and phone. Backfaces stay visible (reversed text
   * on the far side is part of the cylinder illusion).
   */
  const cardOpacity = (i: number) => {
    const a = norm(rotationRef.current + i * STEP); // card's angle from the viewer
    const c = Math.cos((a * Math.PI) / 180);
    return 0.45 + 0.55 * Math.pow(Math.max(0, c), 0.9);
  };

  const autoplayLive = !dragging && !reducedMotion;

  return (
    <section ref={rootRef} aria-label="What families say" className="overflow-hidden bg-charcoal">
      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-12 md:px-10 md:py-28 lg:px-16 lg:py-36">
        <div className="mb-6 flex items-center justify-between gap-4 md:mb-14" data-reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-champagne" />
            <span className="font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-champagne-light">
              Kind Words
            </span>
          </div>

          {/* Mobile-only orientation toggle (isolated behaviour) */}
          <button
            type="button"
            onClick={() => setLayout(mobileLayout ? 'desktop' : 'mobile')}
            aria-pressed={layout !== 'auto'}
            title="Toggle mobile / desktop ring layout"
            className="md:hidden flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 font-sans text-[8px] uppercase tracking-[0.2em] text-white/70 transition-colors duration-300 hover:border-champagne hover:text-champagne-light"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9 2h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {mobileLayout ? 'Desktop' : 'Mobile'}
          </button>
        </div>

        {/* ─── 3D ring stage ─── */}
        <div
          data-reveal
          ref={stageRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          data-layout={mobileLayout ? 'mobile' : 'desktop'}
          data-autoplay-count={autoplayCount}
          data-active={activeIndex}
          className="relative cursor-grab touch-pan-y select-none outline-none focus-visible:ring-1 focus-visible:ring-champagne/40 active:cursor-grabbing"
          style={{ perspective: g.perspective, height: g.stageH, minHeight: g.stageMinH }}
        >
          {/* Elliptical ground shadow — grounds the cylinder */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[76%] h-[12%] w-[min(46vw,540px)] -translate-x-1/2 rounded-[50%] bg-black/50 blur-2xl"
          />

          {/* The ring — rotates around its centre; backfaces stay visible */}
          <div
            className="absolute inset-0"
            style={{
              transform: `rotateY(${rotation}deg)`,
              transformStyle: 'preserve-3d',
              transition:
                dragging || reducedMotion ? 'none' : 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
              ['--ring-r' as string]: g.ringR,
              ['--card-w' as string]: g.cardW,
            }}
          >
            {testimonials.map((t, i) => (
              <figure
                key={t.name}
                aria-hidden={i === activeIndex ? undefined : true}
                className="absolute left-1/2 top-1/2 aspect-[4/5] w-[var(--card-w)] select-none overflow-hidden bg-[#16130F] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)] will-change-transform"
                style={{
                  marginLeft: 'calc(-1 * var(--card-w) / 2)',
                  marginTop: 'calc(-1 * var(--card-w) * 1.25 / 2)',
                  transform: `rotateY(${i * STEP}deg) translateZ(var(--ring-r))`,
                  backfaceVisibility: 'visible', // far side shows mirrored — that's the point
                  opacity: cardOpacity(i),
                  transition: 'opacity 0.4s ease',
                }}
              >
                {/* Portrait */}
                <div className={`relative overflow-hidden ${mobileLayout ? 'h-full' : 'h-[54%]'}`}>
                  {mobileLayout && <div className="absolute inset-0 bg-[#16130F]" />}
                  <img src={t.image} alt={t.alt} className="object-cover w-full h-full" sizes="(max-width: 768px) 50vw, 300px" draggable={false} />
                  {!mobileLayout && (
                    <div className="absolute inset-0 bg-gradient-to-t from-[#16130F] via-transparent to-transparent" />
                  )}
                </div>

                {/* Mobile: full-bleed portrait, quote overlaid, label bar on the bottom */}
                {mobileLayout ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#16130F]/20 via-[#16130F]/70 to-[#16130F]" />
                    <blockquote className="absolute inset-x-4 bottom-[72px] top-[14%] overflow-hidden font-serif text-[clamp(12px,3.6vw,15px)] font-light leading-snug text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.7)] line-clamp-5 bg-[#16130F]/70 backdrop-blur-md rounded-lg px-3 py-2">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="absolute inset-x-0 bottom-0 border-t border-white/25 bg-black/55 px-4 py-3 backdrop-blur-sm">
                      <p className="font-serif text-[clamp(14px,4vw,17px)] font-light italic text-champagne-light">
                        {t.name}
                      </p>
                      <p className="mt-0.5 font-sans text-[8px] uppercase tracking-[0.22em] text-[#CFC7BE]">
                        {t.role}
                      </p>
                    </figcaption>
                  </>
                ) : (
                  /* Desktop: portrait top, quote + attribution below */
                  <div className="flex h-[46%] flex-col justify-between px-5 py-4">
                    <blockquote className="font-serif text-[15px] font-light leading-snug text-[#EDE8E2] line-clamp-4">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="border-t border-white/10 pt-3">
                      <p className="font-serif text-base font-light italic text-champagne-light">{t.name}</p>
                      <p className="mt-0.5 font-sans text-[8px] uppercase tracking-[0.22em] text-[#8A8279]">
                        {t.role}
                      </p>
                    </figcaption>
                  </div>
                )}
              </figure>
            ))}
          </div>

          {/* Screen-reader progress */}
          <p className="sr-only" role="status">
            {testimonials[activeIndex].name} — {testimonials[activeIndex].role}
          </p>
        </div>

        {/* ─── Controls: prev · dots · next ─── */}
        <div className="mt-6 flex items-center md:mt-14" data-reveal>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous testimonial"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors duration-300 hover:border-champagne hover:text-champagne-light focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne/60"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex flex-1 items-center justify-center gap-3" role="tablist" aria-label="Choose testimonial">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Testimonial ${i + 1}: ${t.name}`}
                onClick={() => spinTo(i)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === activeIndex ? 'w-8 bg-champagne' : 'w-3 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next testimonial"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors duration-300 hover:border-champagne hover:text-champagne-light focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne/60"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Hint + live auto-scroll indicator (the "pop" readout) */}
        <p className="mt-4 flex items-center justify-center gap-2 text-center font-sans text-[8px] uppercase tracking-[0.3em] text-[#6F6964]" data-reveal>
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${autoplayLive ? 'animate-pulse bg-champagne' : 'bg-white/25'}`}
          />
          Drag to spin · arrow keys to browse
        </p>

        {/* Location row */}
        <div className="mt-10 border-t border-white/10 pt-8 md:mt-20" data-reveal>
          <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-[#6F6964]">
            Loved by families across the capital
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {locations.map((loc) => (
              <li
                key={loc}
                className="font-serif text-lg font-light italic text-[#8A8279] transition-colors duration-300 hover:text-champagne-light"
              >
                {loc}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
