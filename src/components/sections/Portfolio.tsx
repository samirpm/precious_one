'use client';

import { portfolio } from '@/lib/content';
import SplitReveal from '@/components/ui/SplitReveal';
import { CoverflowCarousel, type CoverflowSlide } from '@/components/ui/coverflow-carousel';

const slides: CoverflowSlide[] = portfolio.map((item) => ({
  src: item.imageUrl,
  alt: item.title,
  title: item.title,
  subtitle: item.category
    .replace('-', ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase()),
}));

/**
 * Portfolio — the coverflow carousel as a standalone section.
 * Stands in for the removed CinematicStage (frame reel + scroll-driven
 * portfolio reveal) with a simpler, always-interactive presentation.
 */
export default function Portfolio() {
  return (
    <section id="portfolio" aria-label="Our portfolio" className="overflow-hidden bg-ivory">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 md:px-10 lg:px-16 py-20 md:py-28 lg:py-36">
        {/* Eyebrow */}
        <div className="mb-8 flex items-center gap-4">
          <span className="h-px w-10 bg-champagne" />
          <p className="font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-champagne-dark">
            Our Work
          </p>
        </div>

        {/* Heading */}
        <SplitReveal
          as="h2"
          emClassName="text-champagne-dark"
          className="font-serif text-[clamp(2.5rem,5vw,5rem)] font-light leading-[0.9] tracking-[-0.025em] text-charcoal"
        >
          Precious <em>moments,</em> beautifully kept.
        </SplitReveal>

        {/* Subtext */}
        <p className="mt-6 max-w-xl font-sans text-[13px] font-light leading-7 text-taupe">
          Every photograph tells a story of love, tenderness, and the
          fleeting beauty of life&apos;s most precious stages. Glide through a
          selection of moments from our studio.
        </p>

        {/* Coverflow carousel */}
        <div className="mt-14 md:mt-20">
          <CoverflowCarousel
            slides={slides}
            loop
            showCaption
            showPagination
            showNavigation
            rotate={44}
            depth={0.6}
            perspective={3}
            falloff={0.56}
            fade={0.1}
            cardWidth="clamp(180px, 24vw, 300px)"
            label="Photography portfolio"
          />
        </div>
      </div>
    </section>
  );
}