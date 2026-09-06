'use client';

/**
 * Marquee — a horizontally scrolling band of session types.
 * The track renders two identical groups and animates translateX(-50%),
 * which loops seamlessly. Mirrors the agency template's "Selected Work"
 * marquee: oversized serif words with italic-contrast alternation.
 */
const items: { label: string; emph?: boolean }[] = [
  { label: 'Newborn' },
  { label: 'Maternity', emph: true },
  { label: 'Family' },
  { label: 'Cake Smash', emph: true },
  { label: 'Milestones' },
  { label: 'Portraits', emph: true },
];

function Group({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center">
          <span
            className={`font-serif text-4xl font-light tracking-[-0.01em] text-[#EDE8E2] md:text-6xl ${
              item.emph ? 'italic text-champagne-light' : ''
            }`}
          >
            {item.emph ? <em>{item.label}</em> : item.label}
          </span>
          <span className="mx-6 h-px w-10 bg-champagne/40 md:mx-10 md:w-16" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
}

export default function Marquee() {
  return (
    <section
      aria-label="Session types"
      className="marquee relative overflow-hidden border-y border-white/10 bg-charcoal py-8 md:py-11"
    >
      <div
        className="marquee-track flex w-max"
        style={{ '--marquee-duration': '36s' } as React.CSSProperties}
      >
        <Group />
        <Group ariaHidden />
      </div>
    </section>
  );
}