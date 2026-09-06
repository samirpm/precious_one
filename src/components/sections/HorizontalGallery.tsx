'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolio } from '@/lib/content';
import SplitReveal from '@/components/ui/SplitReveal';
import TiltCard from '@/components/ui/TiltCard';
import MagneticButton from '@/components/ui/MagneticButton';
import './HorizontalGallery.css';

gsap.registerPlugin(ScrollTrigger);

/** Curated 6-image selection for the horizontal gallery */
const galleryIds = [
  'newborn-1',
  'newborn-4',
  'wa-1',
  'wa-5',
  'wa-11',
  'wa-9',
];

const galleryItems = galleryIds
  .map((id) => portfolio.find((p) => p.id === id))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

const categoryLabel = (cat: string) =>
  cat
    .split('-')
    .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
    .join(' ');

/**
 * HorizontalGallery — the ScrollTide signature pattern.
 * A full-viewport charcoal section pins while the film strip glides
 * sideways: intro panel → 6 curated portfolio photographs → a booking CTA.
 * A slim champagne progress line tracks scroll position at the bottom.
 */
export default function HorizontalGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const getDistance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress.toFixed(4)})`;
            }
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      aria-label="Our portfolio"
      className="horizontal-gallery relative h-screen overflow-hidden bg-charcoal"
    >
      <div
        ref={trackRef}
        className="horizontal-gallery__track flex h-screen w-max items-center will-change-transform"
      >
        {/* Intro panel — editorially leads the strip */}
        <div className="horizontal-gallery__intro flex h-full w-[60vw] shrink-0 flex-col justify-start px-6 pt-[28vh] sm:px-8 md:px-10 lg:px-16">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-champagne" />
            <p className="font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-champagne-light">
              Our Work
            </p>
          </div>
          <SplitReveal
            as="h2"
            emClassName="text-champagne"
            className="max-w-3xl font-serif text-[clamp(2.6rem,6vw,5.5rem)] font-light leading-[0.92] tracking-[-0.025em] text-ivory"
          >
            A scroll through <em>precious</em>
            moments.
          </SplitReveal>
          <p className="mt-8 max-w-lg font-sans text-[13px] font-light leading-6 text-ivory/60">
            The studio moves sideways — keep scrolling and glide through a
            selection of recent newborn, family, and maternity sessions.
          </p>
        </div>

        {/* Film strip slides */}
        {galleryItems.map((item, index) => (
          <div
            key={item.id}
            className="horizontal-gallery__slide relative flex h-full w-[80vw] shrink-0 flex-col justify-center pl-[4vw] sm:w-[62vw] sm:pl-[3vw] lg:w-[58vw] lg:pl-[2vw] xl:w-[58vw]"
          >
            {/* Film-strip divider between cards */}
            {index > 0 && (
              <span
                aria-hidden="true"
                className="absolute left-0 top-[10%] h-[80%] w-px bg-champagne/30"
              />
            )}
            {/* Ghost index watermark */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-1 left-[1.5vw] z-0 font-serif text-[clamp(4rem,11vw,9rem)] font-light leading-none text-champagne/15"
            >
              {String(index + 1).padStart(2, '0')}
            </span>

            <div className="relative z-10">
              <TiltCard>
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-blush">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 62vw, 58vw"
                    className="object-cover"
                  />
                </div>
              </TiltCard>

              <div className="mt-6 flex items-end justify-between gap-6">
                <div>
                  <p className="font-sans text-[9px] font-medium uppercase tracking-[0.3em] text-champagne-light">
                    {categoryLabel(item.category)}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-light leading-none text-ivory sm:text-3xl">
                    {item.title}
                  </h3>
                </div>
                <span className="shrink-0 pb-1 font-serif text-sm font-light italic text-ivory/40">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* End-of-strip CTA */}
        <div className="horizontal-gallery__end flex h-full w-screen shrink-0 flex-col items-center justify-center gap-8 px-6 text-center">
          <p className="font-serif text-[clamp(2rem,5vw,4.5rem)] font-light leading-none text-ivory">
            Ready to create <em className="text-champagne">yours?</em>
          </p>
          <p className="max-w-md font-sans text-[13px] font-light leading-6 text-ivory/60">
            Newborn, family, or maternity — we plan every session around you
            and your little one.
          </p>
          <MagneticButton intensity={0.35} className="mt-2">
            <a
              href="#contact"
              className="group inline-flex items-center gap-5 bg-champagne px-9 py-4 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-champagne-light"
              data-cursor="link"
            >
              Book Your Session
              <span
                aria-hidden="true"
                className="text-base transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </MagneticButton>
        </div>
      </div>

      {/* Progress line */}
      <div className="horizontal-gallery__progress pointer-events-none absolute bottom-[5vh] left-0 right-0 z-20 hidden items-center justify-center md:flex">
        <div className="h-px w-40 overflow-hidden bg-white/15">
          <div
            ref={progressRef}
            className="h-px origin-left bg-champagne"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>
    </section>
  );
}