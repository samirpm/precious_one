'use client';

import RevealImage from '@/components/ui/RevealImage';
import SplitReveal from '@/components/ui/SplitReveal';

export default function NewbornSpeciality() {
  return (
    <section id="newborn" className="overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 md:px-10 lg:px-16 py-20 md:py-28 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="relative order-1">
            <RevealImage
              src="/images/portfolio/photo-3.jpeg"
              alt="Newborn photography at Precious One Photography"
              className="aspect-[4/5] relative"
              parallax
              direction="left"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            <div className="absolute -bottom-6 right-5 bg-ivory px-6 py-4 shadow-sm sm:right-10 z-10">
              <p className="font-serif text-xl font-light text-charcoal">
                The little details.
              </p>
            </div>
          </div>

          <div className="order-2 lg:pl-4">
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-champagne-dark" />
              <p className="font-sans text-[9px] font-medium uppercase tracking-[0.3em] text-champagne-dark">
                Our Speciality
              </p>
            </div>
            <SplitReveal
              as="h2"
              emClassName="text-champagne-dark"
              className="font-serif text-5xl font-light leading-[0.9] tracking-[-0.02em] text-charcoal sm:text-6xl lg:text-7xl"
            >
              Those first <em>little days.</em>
            </SplitReveal>
            <div className="mt-10 max-w-xl space-y-6 font-sans text-[14px] font-light leading-7 text-charcoal-light">
              <p>
                We have a special love for newborn photography. Those first few
                days are incredibly precious and pass by so quickly.
              </p>
              <p>
                We focus on capturing your baby&apos;s tiny details, beautiful
                expressions, and those once-in-a-lifetime moments in a timeless
                and artistic way.
              </p>
              <p>
                Every session is thoughtfully planned with care, patience, and
                attention to detail to ensure a comfortable experience for both
                baby and family.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <span className="font-serif text-lg italic text-champagne-dark">
                Tenderness
              </span>
              <span className="hidden sm:block h-px w-6 bg-champagne-dark" />
              <span className="font-serif text-lg italic text-champagne-dark">
                Patience
              </span>
              <span className="hidden sm:block h-px w-6 bg-champagne-dark" />
              <span className="font-serif text-lg italic text-champagne-dark">
                Artistry
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
