import { useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services } from '@/lib/content';
import SplitReveal from '@/components/ui/SplitReveal';

gsap.registerPlugin(ScrollTrigger);

/**
 * Services — single section with layered animations.
 * Header reveals with staggered entrance → cards wipe in via clip-path →
 * content slides up → 3D tilt on hover → parallax on scroll.
 */
export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLAnchorElement[]>([]);
  const cardImagesRef = useRef<HTMLDivElement[]>([]);
  const cardContentsRef = useRef<HTMLDivElement[]>([]);
  const badgesRef = useRef<HTMLSpanElement[]>([]);
  const magneticRef = useRef<HTMLSpanElement[]>([]);

  // 3D tilt on hover — desktop only
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 8,
      rotateX: -y * 6,
      transformPerspective: 800,
      duration: 0.4,
      ease: 'power2.out',
    });

    // Move magnetic CTA toward cursor
    const magnetic = magneticRef.current[index];
    if (magnetic) {
      gsap.to(magnetic, {
        x: x * 18,
        y: y * 12,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, []);

  const handleMouseLeave = useCallback((index: number) => {
    const card = cardsRef.current[index];
    if (card) {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
    }

    const magnetic = magneticRef.current[index];
    if (magnetic) {
      gsap.to(magnetic, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
      });
    }
  }, []);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Scrub (scroll-linked) parallax is honest GPU-composited work that runs on
    // every scroll frame — skip it on mobile/touch where each frame is more
    // expensive, keeping the section smooth. One-time reveals still play.
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    const section = sectionRef.current;
    if (!section) return;

    // ── Header animations ──────────────────────────
    // Decorative line extends from 0 to full width
    if (lineRef.current) {
      gsap.fromTo(lineRef.current,
        { width: 0 },
        {
          width: 40,
          duration: 0.8,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      );
    }

    // Label fades in
    if (labelRef.current) {
      gsap.fromTo(labelRef.current,
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      );
    }

    // Description slides up
    if (descRef.current) {
      gsap.fromTo(descRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      );
    }

    // ── Card animations ──────────────────────────
    // Each card's image wipes in via clip-path, staggered across cards
    const cardDirections = ['left', 'right', 'left', 'right', 'left', 'right'];

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const imgWrap = cardImagesRef.current[i];
      const content = cardContentsRef.current[i];
      const badge = badgesRef.current[i];
      const dir = cardDirections[i % cardDirections.length];

      // Clip-path direction for image reveal
      const clipFrom = dir === 'left'
        ? 'inset(0 100% 0 0 round 0px)'
        : 'inset(0 0 0 100% round 0px)';
      const clipTo = 'inset(0 0% 0 0% round 0px)';

      // Image clip-path wipe
      if (imgWrap) {
        gsap.set(imgWrap, { clipPath: clipFrom });
        gsap.to(imgWrap, {
          clipPath: clipTo,
          duration: 1.0,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Parallax float on card image — desktop-only to keep mobile at 60fps
      if (!isMobile) {
        const img = card.querySelector('img');
        if (img) {
          gsap.fromTo(img,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          );
        }
      }

      // Content slides up with stagger after image reveals
      if (content) {
        const children = Array.from(content.children) as HTMLElement[];
        gsap.set(children, { opacity: 0, y: 20 });
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          delay: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Badge spring-in
      if (badge) {
        gsap.fromTo(badge,
          { scale: 0, rotation: -45, opacity: 0 },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.6,
            delay: 0.3,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: card,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          },
        );
      }
    });

    // ── Progress line at top of section ──────────
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
      });
    }
  }, []);

  return (
    <section ref={sectionRef} id="services" className="overflow-hidden bg-ivory">
      {/* Progress line — fills as user scrolls through the section */}
      <div
        ref={progressRef}
        className="absolute left-0 top-0 h-[2px] w-full origin-left bg-gradient-to-r from-champagne/0 via-champagne to-champagne/0"
        style={{ transform: 'scaleX(0)' }}
      />

      <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-8 md:px-10 md:pt-28 lg:px-16 lg:pt-36">
        {/* ── Header ───────────────────────────────── */}
        <div ref={headerRef} className="mb-12 max-w-2xl md:mb-20">
          <div className="mb-6 flex items-center gap-4">
            <span
              ref={lineRef}
              className="h-px bg-champagne"
              style={{ width: 0 }}
            />
            <span
              ref={labelRef}
              className="font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-champagne-dark opacity-0"
            >
              What We Offer
            </span>
          </div>
          <SplitReveal
            as="h2"
            emClassName="text-champagne-dark"
            className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-light leading-[0.92] tracking-[-0.025em] text-charcoal"
          >
            Sessions that <em>tell your story.</em>
          </SplitReveal>
          <p
            ref={descRef}
            className="mt-6 max-w-lg font-sans text-[14px] font-light leading-[1.8] text-charcoal-light opacity-0"
          >
            From the first breath to every milestone — each session is designed to preserve your
            family&apos;s most treasured moments.
          </p>
        </div>

        {/* ── Card grid ───────────────────────────── */}
        <div className="services-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <a key={service.id}
              ref={(el) => { if (el) cardsRef.current[index] = el; }}
              href={`/services/${service.id}`}
              className="group relative block aspect-[3/4] overflow-hidden bg-charcoal"
              data-cursor="view"
              aria-label={`Explore ${service.title}`}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              {/* Image with clip-path reveal */}
              <div
                ref={(el) => { if (el) cardImagesRef.current[index] = el; }}
                className="absolute inset-0"
              >
                <img src={service.imageUrl} alt={service.title} className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05] w-full h-full" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" draggable={false} />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 z-[1] bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

              {/* Number badge — spring-in */}
              <span
                ref={(el) => { if (el) badgesRef.current[index] = el; }}
                className="absolute left-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-charcoal/40 font-sans text-[10px] tracking-widest text-white/70 opacity-0 md:backdrop-blur-sm"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Text content — staggered entrance */}
              <div
                ref={(el) => { if (el) cardContentsRef.current[index] = el; }}
                className="absolute inset-x-0 bottom-0 z-10 p-6"
              >
                <p className="font-sans text-[8px] font-medium uppercase tracking-[0.3em] text-champagne-light">
                  {service.category}
                </p>
                <h3 className="mt-2 font-serif text-[clamp(1.5rem,2.5vw,2rem)] font-light leading-[1] text-white">
                  {service.shortTitle}
                </h3>
                <p className="mt-3 max-w-xs font-sans text-[12px] font-light leading-5 text-white/70">
                  {service.description}
                </p>

                {/* CTA — magnetic pull toward cursor */}
                <span
                  ref={(el) => { if (el) magneticRef.current[index] = el; }}
                  className="mt-5 inline-flex items-center gap-3 font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-champagne-light transition-colors duration-300 group-hover:text-white"
                >
                  View Details
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/40 transition-all duration-500 group-hover:bg-champagne-light group-hover:text-charcoal">
                    →
                  </span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
