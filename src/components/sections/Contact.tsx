'use client';

import { studioInfo } from '@/lib/content';
import { useFadeOnScroll } from '@/hooks/useFadeOnScroll';

export default function Contact() {
  const { ref, style } = useFadeOnScroll({ translate: 'up' });
  const whatsappNumber = studioInfo.whatsapp.replace(/[^0-9]/g, '');

  return (
    <section id="contact" className="overflow-hidden">
      <div
        ref={ref}
        className="mx-auto max-w-[1440px] px-6 sm:px-8 md:px-10 lg:px-16 py-20 md:py-28 lg:py-36"
        style={style}
      >
        <div className="max-w-4xl">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-[#C5A572]" />
            <p className="font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-[#B8956A]">
              Let&apos;s Create Something Beautiful
            </p>
          </div>
          <h2 className="font-serif text-[clamp(2.5rem,5vw,5rem)] font-light leading-[0.9] tracking-[-0.025em] text-[#2D2926]">
            Your story
            <br />
            <em className="text-[#B8956A]">deserves to be remembered.</em>
          </h2>
        </div>

        <div className="mt-16 grid gap-12 border-t border-[#2D2926]/10 pt-12 md:mt-20 md:grid-cols-[1.2fr_0.8fr] md:gap-16 lg:gap-24">
          <div>
            <p className="max-w-xl font-sans text-[14px] font-light leading-7 text-[#4A4543]">
              Every precious moment deserves to be beautifully preserved.
              Whether you are welcoming a newborn, celebrating a milestone,
              or gathering your family together, we would love to tell your
              story.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-5 bg-[#C5A572] px-8 py-4 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#D4BC8E] hover:shadow-lg"
              >
                Book via WhatsApp
                <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                  ↗
                </span>
              </a>
              <a
                href={`mailto:${studioInfo.email}`}
                className="group inline-flex items-center justify-center gap-5 border border-[#2D2926]/20 px-8 py-4 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#2D2926] transition-all duration-300 hover:border-[#C5A572] hover:text-[#B8956A] hover:shadow-md"
              >
                Send an Email
                <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                  ↗
                </span>
              </a>
            </div>
          </div>

          <div className="md:pl-8 lg:pl-12">
            <div className="space-y-8">
              <div>
                <p className="mb-2 font-sans text-[9px] font-medium uppercase tracking-[0.25em] text-[#9C918A]">
                  Studio
                </p>
                <p className="max-w-xs font-serif text-lg font-light leading-6 text-[#2D2926]">
                  {studioInfo.address}
                </p>
              </div>
              <div>
                <p className="mb-2 font-sans text-[9px] font-medium uppercase tracking-[0.25em] text-[#9C918A]">
                  Phone
                </p>
                <a
                  href={`tel:${studioInfo.phone}`}
                  className="font-serif text-lg font-light text-[#2D2926] transition-colors duration-300 hover:text-[#B8956A]"
                >
                  {studioInfo.phone}
                </a>
              </div>
              <div>
                <p className="mb-2 font-sans text-[9px] font-medium uppercase tracking-[0.25em] text-[#9C918A]">
                  Email
                </p>
                <a
                  href={`mailto:${studioInfo.email}`}
                  className="font-serif text-lg font-light text-[#2D2926] transition-colors duration-300 hover:text-[#B8956A]"
                >
                  {studioInfo.email}
                </a>
              </div>
              <div>
                <p className="mb-2 font-sans text-[9px] font-medium uppercase tracking-[0.25em] text-[#9C918A]">
                  Studio Hours
                </p>
                <p className="font-serif text-lg font-light text-[#2D2926]">
                  {studioInfo.openingHours}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}