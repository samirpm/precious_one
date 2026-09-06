'use client';

import { useState } from 'react';
import SplitReveal from '@/components/ui/SplitReveal';

/**
 * Faq — a smooth accordion in the agency template's editorial style:
 * bordered rows, serif questions, a plus toggle that rotates to ×,
 * and answers that expand with a grid-rows height transition.
 */
const faqs: { q: string; a: string }[] = [
  {
    q: 'When should I book my newborn session?',
    a: 'Newborn portraits are best captured within the first two weeks — ideally between day 4 and day 14 — while your baby still sleeps deeply and curls easily. Because slots are limited, the most common time to book is towards the end of the pregnancy, and we schedule a provisional date around your due date.',
  },
  {
    q: 'How long does a session take?',
    a: 'A newborn session usually lasts two to three hours, entirely at your baby’s pace. Maternity, family, and celebration sessions run between sixty and ninety minutes. We never rush — comfort always comes first.',
  },
  {
    q: 'What should we bring or wear?',
    a: 'We provide everything for newborn sessions: wraps, outfits, and gentle props kept clean and disinfected. For family and maternity sessions we will share a simple style guide and keep a small collection of gowns and outfits on hand.',
  },
  {
    q: 'When is the best time for a maternity session?',
    a: 'Week 30 to week 36 is the sweet spot — the bump is beautifully full while you still feel comfortable. Sessions are relaxed and self-paced, and partners are always welcome to join the frame.',
  },
  {
    q: 'Is the studio private and comfortable?',
    a: 'Yes. Every part of the experience — photography, editing, and printing — is handled exclusively by a women-only team in a private, welcoming studio, so families can relax completely. We are also happy to arrange home sessions if you prefer.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section id="faq" className="overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 md:px-10 lg:px-16 py-20 md:py-28 lg:py-36">
        <div className="mb-12 grid gap-6 md:mb-16 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-champagne" />
              <span className="font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-champagne-dark">
                Questions, Answered
              </span>
            </div>
            <SplitReveal
              as="h2"
              emClassName="text-champagne-dark"
              className="font-serif text-4xl font-light leading-[0.95] tracking-[-0.02em] text-charcoal sm:text-5xl lg:text-6xl"
            >
              Frequently asked <em>questions.</em>
            </SplitReveal>
          </div>
          <p className="max-w-[440px] self-end font-sans text-[14px] font-light leading-7 text-charcoal-light lg:text-right">
            Everything you might want to know before booking. Something else
            on your mind? We&apos;re a message away —
            <a
              href="#contact"
              className="italic text-champagne-dark underline-offset-4 transition-colors hover:text-charcoal"
              data-cursor="link"
            >
              ask us anything.
            </a>
          </p>
        </div>

        <div className="border-t border-charcoal/15">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-charcoal/15">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
                  data-cursor="link"
                >
                  <span
                    className={`font-serif text-xl font-light transition-colors duration-300 md:text-2xl ${
                      isOpen ? 'text-champagne-dark' : 'text-charcoal group-hover:text-champagne-dark'
                    }`}
                  >
                    {item.q}
                  </span>
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-charcoal/15 transition-all duration-300 group-hover:border-champagne">
                    <span className="absolute h-px w-3.5 bg-charcoal transition-all duration-300 group-hover:bg-champagne" />
                    <span
                      className={`absolute h-[5px] w-px bg-charcoal transition-all duration-300 ${
                        isOpen ? 'rotate-90 opacity-0' : 'rotate-0'
                      } group-hover:bg-champagne`}
                    />
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-7 pl-0 font-sans text-[14px] font-light leading-7 text-charcoal-light">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}