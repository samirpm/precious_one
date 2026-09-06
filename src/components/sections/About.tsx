'use client';

import { studioInfo } from '@/lib/content';
import SplitReveal from '@/components/ui/SplitReveal';
import RevealImage from '@/components/ui/RevealImage';

export default function About() {
  return (
    <section id="about" className="overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 md:px-10 lg:px-16 py-20 md:py-28 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="relative order-2 lg:order-1">
            <RevealImage
              src="/images/portfolio/photo-1.jpeg"
              alt="Precious One Photography"
              className="relative ml-auto aspect-[4/5] w-full max-w-[560px]"
              parallax
              direction="right"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute -bottom-7 -left-3 hidden sm:block lg:-left-8 z-10">
              <div className="bg-blush px-7 py-5 shadow-sm">
                <p className="font-serif text-2xl font-light text-charcoal">
                  Made with
                  <br />
                  <em>love.</em>
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:pr-10">
            <div className="mb-8 flex items-center gap-4">
              <span className="h-px w-10 bg-champagne" />
              <p className="font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-champagne-dark">
                About Precious One
              </p>
            </div>
            <SplitReveal
              as="h2"
              emClassName="text-champagne-dark"
              className="max-w-[650px] font-serif text-4xl font-light leading-[0.95] tracking-[-0.02em] text-charcoal sm:text-5xl lg:text-6xl"
            >
              Photographing <em>what matters</em> most.
            </SplitReveal>
            <div className="mt-10 max-w-[580px] space-y-6 font-sans text-[14px] font-light leading-7 text-charcoal-light">
              <p>{studioInfo.description}</p>
              <p>
                From the delicate details of a newborn to the joyful milestones
                of childhood and the love shared between family members, we
                believe every stage of life deserves to be beautifully
                preserved.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-5">
              <a
                href="#contact"
                className="group inline-flex items-center gap-4 border-b border-charcoal pb-2 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-charcoal transition-all duration-300 hover:border-champagne hover:text-champagne-dark"
                data-cursor="link"
              >
                Begin Your Story
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
