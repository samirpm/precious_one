'use client';

import { useRef } from 'react';
import { services } from '@/lib/content';
import { useFadeOnScroll } from '@/hooks/useFadeOnScroll';
import { useStaggeredReveal } from '@/hooks/useStaggeredReveal';

export default function Services() {
  const { ref: headerRef, style: headerStyle } = useFadeOnScroll({ translate: 'up' });
  const gridRef = useRef<HTMLDivElement>(null);
  const reveal = useStaggeredReveal(gridRef);

  return (
    <section id="services" className="overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 md:px-10 lg:px-16 py-20 md:py-28 lg:py-36">
        <div ref={headerRef} className="mb-12 md:mb-16" style={headerStyle}>
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-[#C5A572]" />
            <span className="font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-[#B8956A]">
              What We Offer
            </span>
          </div>
          <h2 className="font-serif text-[clamp(2.5rem,5vw,5rem)] font-light leading-[0.9] tracking-[-0.025em] text-[#2D2926]">
            Our Services
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-px bg-[#2D2926]/10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => {
            const hidden = reveal ? '' : 'opacity-0 translate-y-10';
            return (
              <div
                key={service.id}
                className={`group relative bg-[#FAF8F5] p-8 md:p-10 transition-all duration-700 ease-out hover:bg-[#F5F0E8] ${hidden}`}
                style={{
                  transitionDelay: reveal ? `${index * 90}ms` : '0ms',
                  transitionProperty: 'opacity, transform, background-color',
                }}
              >
                <span className="font-sans text-[9px] tracking-[0.2em] text-[#B8956A]/60 transition-colors duration-500 group-hover:text-[#C5A572]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 font-serif text-xl font-light text-[#2D2926] transition-transform duration-500 group-hover:translate-x-1">
                  {service.title}
                </h3>
                <p className="mt-4 max-w-[280px] font-sans text-[12px] font-light leading-5 text-[#5B5551]">
                  {service.description}
                </p>
                <div className="mt-8 h-px w-8 bg-[#C5A572]/40 transition-all duration-500 group-hover:w-14 group-hover:bg-[#C5A572]" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
