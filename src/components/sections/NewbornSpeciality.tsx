'use client';

import Image from 'next/image';
import { useFadeOnScroll } from '@/hooks/useFadeOnScroll';

export default function NewbornSpeciality() {
  const { ref: sectionRef, style: sectionStyle } = useFadeOnScroll({ translate: 'up' });
  const { ref: imageRef, style: imageStyle } = useFadeOnScroll({ translate: 'right', delay: 200 });
  const { ref: textRef, style: textStyle } = useFadeOnScroll({ translate: 'left', delay: 300 });

  return (
    <section id="newborn" className="overflow-hidden">
      <div
        ref={sectionRef}
        className="mx-auto max-w-[1440px] px-6 sm:px-8 md:px-10 lg:px-16 py-20 md:py-28 lg:py-36"
        style={sectionStyle}
      >
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div ref={imageRef} className="relative order-1" style={imageStyle}>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/portfolio/photo-3.jpeg"
                alt="Newborn photography at Precious One Photography"
                fill
                className="object-cover transition-transform duration-1000 ease-out hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>
            <div className="absolute -bottom-6 right-5 bg-[#FAF8F5] px-6 py-4 shadow-sm sm:right-10">
              <p className="font-serif text-xl font-light text-[#2D2926]">
                The little details.
              </p>
            </div>
          </div>

          <div ref={textRef} className="order-2 lg:pl-4" style={textStyle}>
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-[#B8956A]" />
              <p className="font-sans text-[9px] font-medium uppercase tracking-[0.3em] text-[#9C7654]">
                Our Speciality
              </p>
            </div>
            <h2 className="font-serif text-5xl font-light leading-[0.9] tracking-[-0.02em] text-[#2D2926] sm:text-6xl lg:text-7xl">
              Those first
              <br />
              <em className="text-[#9C7654]">little days.</em>
            </h2>
            <div className="mt-10 max-w-xl space-y-6 font-sans text-[14px] font-light leading-7 text-[#4A4543]">
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
              <span className="font-serif text-lg italic text-[#9C7654]">
                Tenderness
              </span>
              <span className="hidden sm:block h-px w-6 bg-[#B8956A]" />
              <span className="font-serif text-lg italic text-[#9C7654]">
                Patience
              </span>
              <span className="hidden sm:block h-px w-6 bg-[#B8956A]" />
              <span className="font-serif text-lg italic text-[#9C7654]">
                Artistry
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}