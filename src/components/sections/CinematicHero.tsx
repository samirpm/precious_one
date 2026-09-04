'use client';

import Image from 'next/image';
import Typewriter from '@/components/ui/Typewriter';

const TYPING_PHRASES = [
  'For the beginning of your',
  'For the story you will tell with your',
  "For the memories you'll carry with your",
  'For every chapter with your',
  'For the love that grows with your',
];

export default function CinematicHero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#FAF8F5]">
      {/* ---- MAIN GRID: text left · photos right ---- */}
      <div
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col items-center px-6 pt-[100px] md:flex-row md:items-center md:gap-[3vw] md:px-12 lg:px-20"
        style={{ paddingTop: 'max(100px, env(safe-area-inset-top, 20px) + 80px)' }}
      >
        {/* ============ LEFT: Typography ============ */}
        <div className="flex w-full flex-col items-center text-center md:w-[42%] md:items-start md:text-left lg:w-[40%]">
          {/* Typewriter line */}
          <div
            className="mb-4 font-sans text-[11px] sm:text-[12px] uppercase tracking-[0.28em] text-[#9C918A] hero-animate-left"
            style={{ animationDelay: '0.5s' }}
          >
            <Typewriter
              phrases={TYPING_PHRASES}
              typingSpeed={60}
              deletingSpeed={30}
              pauseDuration={2600}
            />
          </div>

          {/* Brand name */}
          <h1
            className="font-serif font-light leading-[0.88] tracking-[-0.03em] text-[#2D2926] hero-animate-left"
            style={{ fontSize: 'clamp(3.5rem, 7.5vw, 8rem)', animationDelay: '0.7s' }}
          >
            PRECIOUS
            <br />
            ONE
          </h1>

          {/* Decorative line */}
          <div
            className="my-5 h-px w-12 bg-[#C5A572]/50 hero-animate-left md:my-6"
            style={{ animationDelay: '0.9s' }}
          />

          {/* Tagline */}
          <p
            className="mb-8 max-w-xs font-sans text-[12px] sm:text-[13px] font-light leading-relaxed text-[#9C918A] hero-animate-left md:mb-10"
            style={{ animationDelay: '1.0s' }}
          >
            Timeless memories of your most precious moments
          </p>

          {/* CTA */}
          <a
            href="#contact"
            className="group inline-block font-sans text-[11px] sm:text-[12px] uppercase tracking-[0.25em] text-[#C5A572] transition-colors duration-300 hover:text-[#B8956A] hero-animate-left"
            style={{ animationDelay: '1.1s' }}
          >
            Book a Session
            <span className="mt-1.5 block h-px w-full origin-left scale-x-100 bg-[#C5A572]/40 transition-transform duration-300 group-hover:scale-x-110" />
          </a>
        </div>

        {/* ============ RIGHT: Overlapping photo prints ============ */}
        <div className="relative mt-12 h-[50vh] w-full md:mt-0 md:h-[70vh] md:w-[55%] lg:w-[58%]">
          {/* Back print — rotated editorial landscape */}
          <div
            className="hero-animate-right absolute"
            style={{
              width: 'min(48%, 340px)',
              top: '0%',
              left: '0%',
              transform: 'rotate(-7deg)',
              transformOrigin: 'center center',
              animationDelay: '0.8s',
            }}
          >
            <div className="relative w-full overflow-hidden rounded-sm bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:p-3 md:p-4">
              <div className="relative w-full overflow-hidden" style={{ paddingBottom: '66.67%' }}>
                <Image
                  src="/images/portfolio/photo-14.jpeg"
                  alt="Newborn photography by Precious One"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 340px"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Front print — straight portrait, overlapping back */}
          <div
            className="hero-animate-right absolute"
            style={{
              width: 'min(56%, 400px)',
              bottom: '0%',
              right: '0%',
              transform: 'rotate(0deg)',
              animationDelay: '1.0s',
            }}
          >
            <div className="relative w-full overflow-hidden rounded-sm bg-white p-2 shadow-[0_12px_40px_rgba(0,0,0,0.18)] sm:p-3 md:p-4">
              <div className="relative w-full overflow-hidden" style={{ paddingBottom: '125%' }}>
                <Image
                  src="/images/portfolio/photo-5.jpeg"
                  alt="Mother and newborn silhouette — Precious One Photography"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ ENTRANCE ANIMATIONS ============ */}
      <style>{`
        .hero-animate-left,
        .hero-animate-right {
          opacity: 0;
          animation-fill-mode: forwards;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
          animation-duration: 1s;
          will-change: opacity, transform;
        }
        .hero-animate-left {
          animation-name: heroSlideLeft;
        }
        .hero-animate-right {
          animation-name: heroSlideRight;
        }

        @keyframes heroSlideLeft {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heroSlideRight {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        /* Override rotation for back print once animation completes */
        .hero-animate-right[style*="rotate(-7deg)"] {
          animation-name: heroSlideRightRotated;
        }
        @keyframes heroSlideRightRotated {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97) rotate(-7deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(-7deg);
          }
        }
      `}</style>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center opacity-0 animate-[fadeIn_1s_ease_2s_forwards]">
        <p className="mb-2 font-sans text-[7px] sm:text-[8px] uppercase tracking-[0.3em] text-[#9C918A]">
          Scroll
        </p>
        <div className="mx-auto h-8 w-px bg-[#C5A572]/30" />
      </div>

      {/* Extra keyframes for scroll hint */}
      <style>{`
        @keyframes fadeIn {
          to { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}
