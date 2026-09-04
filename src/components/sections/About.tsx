'use client';

import { studioInfo } from '@/lib/content';
import Image from 'next/image';
import { useFadeOnScroll } from '@/hooks/useFadeOnScroll';

export default function About() {
  const { ref: sectionRef, style: sectionStyle } = useFadeOnScroll({ translate: 'up' });
  const { ref: imageRef, style: imageStyle } = useFadeOnScroll({ translate: 'left', delay: 200 });
  const { ref: textRef, style: textStyle } = useFadeOnScroll({ translate: 'right', delay: 300 });

  return (
    <section id="about" className="overflow-hidden">
      <div
        ref={sectionRef}
        className="mx-auto max-w-[1440px] px-6 sm:px-8 md:px-10 lg:px-16 py-20 md:py-28 lg:py-36"
        style={sectionStyle}
      >
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div ref={imageRef} className="relative order-2 lg:order-1" style={imageStyle}>
            <div className="relative ml-auto aspect-[4/5] w-full max-w-[560px] overflow-hidden">
              <Image
                src="/images/portfolio/photo-1.jpeg"
                alt="Precious One Photography"
                fill
                className="object-cover transition-transform duration-1000 ease-out hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
            <div className="absolute -bottom-7 -left-3 hidden sm:block lg:-left-8">
              <div className="bg-[#E8D5C4] px-7 py-5 shadow-sm">
                <p className="font-serif text-2xl font-light text-[#2D2926]">
                  Made with
                  <br />
                  <em>love.</em>
                </p>
              </div>
            </div>
          </div>

          <div ref={textRef} className="order-1 lg:order-2 lg:pr-10" style={textStyle}>
            <div className="mb-8 flex items-center gap-4">
              <span className="h-px w-10 bg-[#C5A572]" />
              <p className="font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-[#B8956A]">
                About Precious One
              </p>
            </div>
            <h2 className="max-w-[650px] font-serif text-4xl font-light leading-[0.95] tracking-[-0.02em] text-[#2D2926] sm:text-5xl lg:text-6xl">
              Photographing
              <br />
              <em className="text-[#B8956A]">what matters most.</em>
            </h2>
            <div className="mt-10 max-w-[580px] space-y-6 font-sans text-[14px] font-light leading-7 text-[#4A4543]">
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
                className="group inline-flex items-center gap-4 border-b border-[#2D2926] pb-2 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#2D2926] transition-all duration-300 hover:border-[#C5A572] hover:text-[#B8956A]"
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