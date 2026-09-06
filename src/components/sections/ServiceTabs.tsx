'use client';

import { useState } from 'react';
import Image from 'next/image';
import SplitReveal from '@/components/ui/SplitReveal';

/**
 * ServiceTabs — the agency-template "tabbed services" pattern.
 * A row of large serif tabs switches a supporting image + editorial copy.
 * Each tab pages through a session type with a few telling details.
 */
const tabs: {
  label: string;
  image: string;
  alt: string;
  intro: string;
  copy: string;
  details: { label: string; value: string }[];
  note: string;
}[] = [
  {
    label: 'Newborn & Baby',
    image: '/images/portfolio/photo-1.jpeg',
    alt: 'Wrapped newborn portrait in soft light',
    intro: 'The first days of life, kept forever.',
    copy: 'Within the first two weeks, newborns sleep deeply and curl naturally into those tiny, perfect poses. We capture every fold, every finger, every soft sigh in a warm, nursery-like studio.',
    details: [
      { label: 'Best window', value: 'Days 4 – 14' },
      { label: 'Session length', value: '2 – 3 hours' },
      { label: 'Studio stays warm', value: '26–28°C' },
    ],
    note: 'Book while you are expecting — slots fill quickly.',
  },
  {
    label: 'Maternity',
    image: '/images/portfolio/photo-10.jpeg',
    alt: 'Gentle maternity portrait with soft light',
    intro: 'The glow of anticipation, elegantly told.',
    copy: 'A quiet, graceful session that honours this fleeting chapter. Flowing gowns, gentle light, and a calm pace make these portraits feel like pages from a keepsake book.',
    details: [
      { label: 'Best window', value: 'Week 30 – 36' },
      { label: 'Session length', value: '90 minutes' },
      { label: 'Partner welcome', value: 'Included' },
    ],
    note: 'Perfect before your little one arrives.',
  },
  {
    label: 'Family',
    image: '/images/portfolio/photo-11.jpeg',
    alt: 'Tender family moment captured in frame',
    intro: 'The love you share, framed as art.',
    copy: 'Playful, unhurried and full of real moments — we photograph your family the way it truly is, not in stiff poses, but in the laughter and closeness you will want to remember.',
    details: [
      { label: 'Session length', value: '60 minutes' },
      { label: 'Outfits', value: '2 changes' },
      { label: 'Outdoor option', value: 'Available' },
    ],
    note: 'A yearly family portrait becomes a treasured tradition.',
  },
  {
    label: 'Cake Smash & Celebs',
    image: '/images/portfolio/photo-4.jpeg',
    alt: 'Playful celebration portrait on soft backdrop',
    intro: 'First birthdays, pure joy, zero stress.',
    copy: 'A smash cake, a little crown, and the biggest smiles of the year. We choreograph the mess, clean it up, and hand you the joy — a full celebration session for your little star.',
    details: [
      { label: 'Session length', value: '60 – 90 minutes' },
      { label: 'Cake included', value: 'Yes' },
      { label: 'Cleanup', value: 'We handle it' },
    ],
    note: 'Often paired with a pre-birthday portrait.',
  },
];

export default function ServiceTabs() {
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  return (
    <section id="sessions" className="overflow-hidden bg-ivory-warm">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 md:px-10 lg:px-16 py-20 md:py-28 lg:py-36">
        <div className="mb-10 md:mb-14">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-champagne" />
            <span className="font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-champagne-dark">
              Explore The Sessions
            </span>
          </div>
          <SplitReveal
            as="h2"
            emClassName="text-champagne-dark"
            className="max-w-3xl font-serif text-4xl font-light leading-[0.95] tracking-[-0.02em] text-charcoal sm:text-5xl lg:text-6xl"
          >
            Choose a story to <em>begin.</em>
          </SplitReveal>
        </div>

        {/* Tabs */}
        <div className="flex flex-col gap-1 border-b border-charcoal/15 sm:flex-row sm:items-end sm:gap-8">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={`group pb-4 text-left transition-colors duration-300 sm:pb-5 ${
                active === i ? 'text-charcoal' : 'text-charcoal-light/60 hover:text-charcoal'
              }`}
              data-cursor="link"
            >
              <span
                className={`font-serif text-2xl font-light sm:text-3xl ${
                  active === i ? 'italic' : 'group-hover:italic'
                }`}
              >
                {t.label}
              </span>
              <span
                className={`absolute mt-3 block h-px bg-champagne transition-all duration-500 ${
                  active === i ? 'w-full' : 'w-0'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Active content */}
        <div className="grid items-center gap-10 pt-10 md:grid-cols-[1fr_1fr] md:gap-14 lg:gap-20 md:pt-14">
          <div key={`${active}-img`} className="relative overflow-hidden" style={{ animation: 'fadeSlideUp 0.6s ease both' }}>
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={tab.image}
                alt={tab.alt}
                fill
                sizes="(max-width: 768px) 100vw, 48vw"
                className="object-cover"
                loading="eager"
              />
            </div>
          </div>

          <div key={`${active}-copy`} style={{ animation: 'fadeSlideUp 0.6s ease 0.05s both' }}>
            <h3 className="font-serif text-3xl font-light leading-tight text-charcoal sm:text-4xl">
              {tab.intro}
            </h3>
            <p className="mt-6 max-w-xl font-sans text-[14px] font-light leading-7 text-charcoal-light">
              {tab.copy}
            </p>

            <ul className="mt-8 grid gap-px border border-charcoal/10 bg-charcoal/10 sm:grid-cols-3">
              {tab.details.map((d) => (
                <li key={d.label} className="bg-ivory px-5 py-5">
                  <span className="block font-sans text-[9px] uppercase tracking-[0.22em] text-taupe">
                    {d.label}
                  </span>
                  <span className="mt-2 block font-serif text-[15px] font-light text-charcoal">
                    {d.value}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-8 font-serif text-[15px] font-light italic text-champagne-dark">
              {tab.note}
            </p>

            <a
              href="#contact"
              className="group mt-8 inline-flex items-center gap-4 border-b border-charcoal pb-2 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-charcoal transition-all duration-300 hover:border-champagne hover:text-champagne-dark"
              data-cursor="link"
            >
              Book This Session
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}