import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Service } from '@/types/photography';
import { studioInfo, services } from '@/lib/content';
import SplitReveal from '@/components/ui/SplitReveal';
import RevealImage from '@/components/ui/RevealImage';

gsap.registerPlugin(ScrollTrigger);

interface ServiceDetailProps {
  service: Service;
}

/**
 * ServiceDetail — full-bleed editorial service page.
 * Hero with parallax image → story section with ideal-for sidebar →
 * full-width gallery → 3-package tier cards → explore-more grid → footer.
 */
export default function ServiceDetail({ service }: ServiceDetailProps) {
  const packagesRef = useRef<HTMLDivElement>(null);
  const packageCards = useRef<HTMLDivElement[]>([]);
  const galleryRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      // Parallax on hero image
      const heroImg = document.querySelector('.service-hero-img');
      if (heroImg) {
        gsap.to(heroImg, {
          y: '12%',
          ease: 'none',
          scrollTrigger: {
            trigger: '.service-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Package cards stagger
      if (packagesRef.current) {
        gsap.fromTo(
          packageCards.current,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: packagesRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          },
        );
      }

      // Gallery images reveal
      if (galleryRef.current) {
        const imgs = galleryRef.current.querySelectorAll('.gallery-item');
        gsap.fromTo(
          imgs,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: galleryRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          },
        );
      }
    },
    [],
  );

  const whatsappNumber = studioInfo.whatsapp.replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi Precious One Photography! I'd love to book the ${service.title} session.`,
  )}`;

  // Get other services for the "explore more" section
  const otherServices = services.filter((s) => s.id !== service.id).slice(0, 3);

  return (
    <>
      {/* ── Hero — full-viewport with parallax ──────────── */}
      <section className="service-hero relative flex min-h-screen flex-col overflow-hidden bg-charcoal">
        {/* Background image with parallax */}
        <div className="service-hero-img absolute inset-0 -top-[10%] h-[120%]">
          <img src={service.imageUrl} alt={service.title} className="object-cover object-center w-full h-full" sizes="100vw" loading="eager" draggable={false} />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/60" />

        {/* Content overlay */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-6 pb-16 pt-28 sm:px-8 md:px-10 md:pb-20 lg:px-16">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-auto flex items-center gap-3 font-sans text-[9px] uppercase tracking-[0.24em] text-white/50"
          >
            <a href="/" className="transition-colors duration-300 hover:text-white/80" data-cursor="link">
              Home
            </a>
            <span>/</span>
            <a href="/#services" className="transition-colors duration-300 hover:text-white/80" data-cursor="link">
              Services
            </a>
            <span>/</span>
            <span className="text-champagne-light">{service.shortTitle}</span>
          </nav>

          {/* Title block */}
          <div className="mt-auto max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-champagne-light/60" />
              <span className="font-sans text-[9px] font-medium uppercase tracking-[0.3em] text-champagne-light">
                {service.category}
              </span>
            </div>
            <h1 className="font-serif text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.9] tracking-[-0.025em] text-white">
              {service.title.replace(/ Photography$/, '')}
              <br />
              <em className="text-champagne-light">Photography.</em>
            </h1>
            <p className="mt-5 max-w-lg font-sans text-[14px] font-light leading-6 text-white/70">
              {service.description}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-white/30 px-7 py-3.5 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-300 hover:border-champagne hover:bg-champagne/25"
                data-cursor="link"
              >
                Book This Session
                <span>↗</span>
              </a>
              <a
                href="#service-overview"
                className="inline-flex items-center gap-3 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white/60 transition-colors duration-300 hover:text-white"
                data-cursor="link"
              >
                Learn More
                <span className="h-px w-5 bg-white/40" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom category label */}
        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
          <span className="font-sans text-[9px] font-medium uppercase tracking-[0.4em] text-white/40">
            {service.category}
          </span>
        </div>
      </section>

      {/* ── Overview — editorial two-column ─────────────── */}
      <section id="service-overview" className="mx-auto max-w-[1440px] px-6 py-20 sm:px-8 md:px-10 md:py-28 lg:px-16">
        <div className="grid items-start gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          {/* Main story */}
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-champagne" />
              <span className="font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-champagne-dark">
                The Session
              </span>
            </div>
            <SplitReveal
              as="h2"
              emClassName="text-champagne-dark"
              className="font-serif text-[clamp(2rem,4vw,3.25rem)] font-light leading-[1.02] tracking-[-0.02em] text-charcoal"
            >
              An experience, <em>not just a photoshoot.</em>
            </SplitReveal>
            <p className="mt-8 max-w-prose font-sans text-[15px] font-light leading-[1.85] text-charcoal-light">
              {service.longDescription}
            </p>

            {/* Inline gallery — two small images beside the text */}
            <div className="mt-12 grid grid-cols-2 gap-4">
              {service.gallery.slice(0, 2).map((src, i) => (
                <RevealImage
                  key={src}
                  src={src}
                  alt={`${service.title} detail ${i + 1}`}
                  className="aspect-[3/4]"
                  imageClassName="w-full h-full object-cover"
                  sizes="(max-width: 768px) 50vw, 30vw"
                />
              ))}
            </div>
          </div>

          {/* Sidebar — ideal for + quick info */}
          <div className="lg:sticky lg:top-32">
            <div className="rounded-sm border border-champagne/25 bg-[#F4F0EA] p-8 md:p-10">
              <p className="font-sans text-[9px] font-medium uppercase tracking-[0.28em] text-champagne-dark">
                Ideal For
              </p>
              <p className="mt-4 font-serif text-[19px] font-light leading-[1.5] text-charcoal">
                {service.idealFor}
              </p>

              <div className="my-6 h-px bg-champagne/25" />

              <p className="font-sans text-[9px] font-medium uppercase tracking-[0.28em] text-champagne-dark">
                Studio Location
              </p>
              <p className="mt-3 font-sans text-[13px] font-light leading-5 text-charcoal-light">
                {studioInfo.name.replace(' Photography', '')} · {studioInfo.address.split(',').slice(-2).join(',').trim()}
              </p>

              <div className="my-6 h-px bg-champagne/25" />

              <p className="font-sans text-[9px] font-medium uppercase tracking-[0.28em] text-champagne-dark">
                Pricing From
              </p>
              <p className="mt-3 font-serif text-2xl font-light text-charcoal">
                {service.packages[0]?.price || 'Inquire'}
              </p>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-full px-7 py-4 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #B8977E 0%, #C9AB94 50%, #A8876E 100%)' }}
                data-cursor="link"
              >
                Book This Session
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery — full-width masonry-style ──────────── */}
      <section aria-label={`${service.title} gallery`} className="bg-charcoal py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 md:px-10 lg:px-16">
          <div className="mb-12 flex items-end justify-between md:mb-16">
            <div>
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px w-10 bg-champagne-light/40" />
                <span className="font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-champagne-light">
                  Moments
                </span>
              </div>
              <h2 className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[0.95] tracking-[-0.02em] text-ivory">
                A glimpse of what&apos;s
                <br />
                <em className="text-champagne-light">possible.</em>
              </h2>
            </div>
            <span className="hidden font-sans text-[10px] uppercase tracking-[0.24em] text-[#6F6964] md:block">
              {String(service.gallery.length).padStart(2, '0')} frames
            </span>
          </div>
        </div>

        {/* Full-bleed gallery grid */}
        <div ref={galleryRef} className="mx-auto grid max-w-[1440px] grid-cols-2 gap-3 px-6 sm:px-8 md:gap-4 md:px-10 lg:grid-cols-4 lg:px-16">
          {service.gallery.map((src, i) => {
            const isLarge = i === 0;
            return (
              <div
                key={src}
                className={`gallery-item relative overflow-hidden bg-charcoal-light ${
                  isLarge
                    ? 'col-span-2 row-span-2 aspect-[4/5] md:aspect-[3/4]'
                    : 'aspect-[3/4]'
                }`}
              >
                <img
                  src={src}
                  alt={`${service.title} sample ${i + 1}`}
                  sizes={isLarge ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                  className="object-cover transition-transform duration-[1.4s] ease-out hover:scale-[1.05] w-full h-full"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Packages — tiered pricing ───────────────────── */}
      <section aria-label="Packages" ref={packagesRef} className="bg-ivory">
        <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-8 md:px-10 md:py-28 lg:px-16">
          <div className="mb-14 text-center md:mb-20">
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-champagne" />
              <span className="font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-champagne-dark">
                Packages
              </span>
              <span className="h-px w-10 bg-champagne" />
            </div>
            <SplitReveal
              as="h2"
              emClassName="text-champagne-dark"
              className="font-serif text-[clamp(2.25rem,5vw,4.25rem)] font-light leading-[0.92] tracking-[-0.025em] text-charcoal"
            >
              Choose how <em>you&apos;d like to remember it.</em>
            </SplitReveal>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3 md:gap-5">
            {service.packages.map((pkg, index) => (
              <div
                key={pkg.name}
                ref={(el) => {
                  if (el) packageCards.current[index] = el;
                }}
                className={`relative flex flex-col rounded-sm border bg-white p-8 transition-shadow duration-500 md:p-9 ${
                  pkg.popular
                    ? 'border-champagne shadow-[0_16px_48px_-12px_rgba(184,151,126,0.4)]'
                    : 'border-charcoal/8 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-px left-0 right-0 h-[2px] rounded-t-sm bg-gradient-to-r from-champagne/0 via-champagne to-champagne/0" />
                )}
                {pkg.priceNote && (
                  <span className="absolute -top-3 left-8 rounded-full bg-champagne px-4 py-1.5 font-sans text-[8px] font-semibold uppercase tracking-[0.22em] text-white">
                    {pkg.priceNote}
                  </span>
                )}

                <p className="font-sans text-[9px] font-medium uppercase tracking-[0.28em] text-champagne-dark">
                  {pkg.name}
                </p>

                <p className="mt-5 font-serif text-4xl font-light tracking-[-0.02em] text-charcoal">
                  {pkg.price}
                </p>

                <ul className="mt-8 flex-1 space-y-3.5 border-t border-charcoal/8 pt-8">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 font-sans text-[12.5px] font-light leading-5 text-charcoal-light"
                    >
                      <span className="mt-0.5 text-champagne-dark">—</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-9 inline-flex w-full items-center justify-center gap-3 rounded-full py-3.5 font-sans text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                    pkg.popular
                      ? 'text-white'
                      : 'border border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-ivory hover:border-charcoal'
                  }`}
                  style={pkg.popular ? { background: 'linear-gradient(135deg, #B8977E 0%, #C9AB94 50%, #A8876E 100%)' } : undefined}
                  data-cursor="link"
                >
                  Book {pkg.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Explore more services ────────────────────────── */}
      <section className="border-t border-charcoal/8 bg-[#F4F0EA]">
        <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-8 md:px-10 md:py-28 lg:px-16">
          <div className="mb-12 flex items-end justify-between md:mb-16">
            <div>
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px w-10 bg-champagne" />
                <span className="font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-champagne-dark">
                  Explore
                </span>
              </div>
              <h2 className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[0.95] tracking-[-0.02em] text-charcoal">
                Continue your story.
              </h2>
            </div>
            <a href="/#services"
              className="hidden items-center gap-3 font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-champagne-dark transition-colors duration-300 hover:text-charcoal md:inline-flex"
              data-cursor="link"
            >
              All services
              <span>↗</span>
            </a>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {otherServices.map((s) => (
              <a key={s.id}
                href={`/services/${s.id}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-sm bg-charcoal"
                data-cursor="view"
              >
                <img src={s.imageUrl} alt={s.title} className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06] w-full h-full" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" draggable={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-6">
                  <span className="font-serif text-2xl font-light text-white">{s.shortTitle}</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/50 transition-all duration-500 group-hover:bg-champagne-light group-hover:text-charcoal">
                    ↗
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
