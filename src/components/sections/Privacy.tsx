'use client';

import { useFadeOnScroll } from '@/hooks/useFadeOnScroll';

export default function Privacy() {
  const { ref, style } = useFadeOnScroll({ translate: 'up' });

  const promises = [
    {
      number: '01',
      title: 'Women-Only Team',
      description:
        'Photography, editing, and printing are handled exclusively by women.',
    },
    {
      number: '02',
      title: 'Private Environment',
      description:
        'A welcoming studio where families can feel relaxed and completely at ease.',
    },
    {
      number: '03',
      title: 'Cultural Respect',
      description:
        'Every part of the experience is thoughtfully designed with local culture and family privacy in mind.',
    },
    {
      number: '04',
      title: 'Baby & Family Comfort',
      description:
        'Patience, care, and a gentle approach come first throughout every session.',
    },
  ];

  return (
    <section id="privacy" className="overflow-hidden">
      <div
        ref={ref}
        className="mx-auto max-w-[1440px] px-6 sm:px-8 md:px-10 lg:px-16 py-20 md:py-28 lg:py-36"
        style={style}
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-[#B8956A]" />
              <p className="font-sans text-[9px] font-medium uppercase tracking-[0.3em] text-[#9C7654]">
                Your Comfort Matters
              </p>
            </div>
            <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[0.9] tracking-[-0.02em] text-[#2D2926]">
              A space where
              <br />
              you can feel
              <br />
              <em className="text-[#9C7654]">at ease.</em>
            </h2>
          </div>
          <div className="flex items-end lg:pb-2">
            <p className="max-w-[540px] font-sans text-[14px] font-light leading-7 text-[#4A4543]">
              Your comfort, privacy, and security are extremely important to
              us. We believe beautiful photography begins with an environment
              where families feel safe, respected, and completely comfortable.
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-[#2D2926]/15">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map((promise, index) => (
              <div
                key={promise.number}
                className={`group py-8 transition-colors duration-300 hover:bg-[#FAF8F5] lg:px-8 lg:py-10 ${
                  index !== 0
                    ? 'border-t border-[#2D2926]/15 sm:border-l sm:border-t-0'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-sans text-[9px] tracking-[0.2em] text-[#9C7654]">
                    {promise.number}
                  </span>
                  <span className="font-serif text-2xl font-light text-[#B8956A]/50 transition-transform duration-300 group-hover:scale-110">
                    +
                  </span>
                </div>
                <h3 className="mt-8 font-serif text-xl text-[#2D2926]">
                  {promise.title}
                </h3>
                <p className="mt-4 max-w-[260px] font-sans text-[12px] font-light leading-5 text-[#5B5551]">
                  {promise.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-[#2D2926]/15 pt-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl font-serif text-xl font-light italic leading-relaxed text-[#4A4543] sm:text-2xl">
              &ldquo;A comfortable family makes beautiful photographs.&rdquo;
            </p>
            <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#9C7654]">
              Precious One Photography
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
