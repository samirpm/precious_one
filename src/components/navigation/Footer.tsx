'use client';

import Link from 'next/link';
import { studioInfo, services } from '@/lib/content';
import MagneticButton from '@/components/ui/MagneticButton';

export default function Footer() {
  const explore = [
    { label: 'Portfolio', href: '/#portfolio' },
    { label: 'Services', href: '/#services' },
    { label: 'Our Story', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ];

  const whatsappNumber = studioInfo.whatsapp.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-charcoal text-ivory">
      {/* CTA band */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 py-16 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-20 lg:px-16">
          <div>
            <p className="font-sans text-[9px] font-medium uppercase tracking-[0.28em] text-champagne-light">
              Let&apos;s begin
            </p>
            <h2 className="mt-4 max-w-xl font-serif text-3xl font-light leading-[0.95] tracking-[-0.02em] text-ivory sm:text-4xl">
              A new little one is
              <br />
              <em className="text-champagne-light">a once-in-a-lifetime story.</em>
            </h2>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <a
              href={`mailto:${studioInfo.email}`}
              className="group font-serif text-xl font-light text-ivory transition-colors duration-300 hover:text-champagne-light sm:text-2xl"
              data-cursor="link"
            >
              {studioInfo.email}
            </a>
            <MagneticButton intensity={0.25} threshold={70}>
              <a
                href="/#contact"
                className="inline-flex items-center gap-3 rounded-full bg-champagne px-8 py-4 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-champagne-light hover:shadow-lg"
                data-cursor="link"
              >
                Start Your Story
                <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-8 md:px-10 md:py-20 lg:px-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] md:gap-10 lg:gap-16">
          {/* Brand */}
          <div>
            <p className="font-serif text-2xl font-light text-ivory">
              Precious One
            </p>
            <p className="mt-2 font-sans text-[9px] font-medium uppercase tracking-[0.28em] text-[#6F6964]">
              Photography · Abu Dhabi
            </p>
            <p className="mt-6 max-w-xs font-sans text-[13px] font-light leading-6 text-taupe-light">
              {studioInfo.tagline}
            </p>
          </div>

          {/* Explore */}
          <nav aria-label="Footer">
            <p className="mb-5 font-sans text-[9px] font-medium uppercase tracking-[0.28em] text-[#6F6964]">
              Explore
            </p>
            <ul className="space-y-3">
              {explore.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-serif text-[17px] font-light text-[#EDE8E2] transition-colors duration-300 hover:text-champagne-light"
                    data-cursor="link"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sessions */}
          <nav aria-label="Sessions">
            <p className="mb-5 font-sans text-[9px] font-medium uppercase tracking-[0.28em] text-[#6F6964]">
              Sessions
            </p>
            <ul className="space-y-3">
              {services.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/services/${s.id}`}
                    className="font-serif text-[17px] font-light text-[#EDE8E2] transition-colors duration-300 hover:text-champagne-light"
                    data-cursor="link"
                  >
                    {s.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div>
            <p className="mb-5 font-sans text-[9px] font-medium uppercase tracking-[0.28em] text-[#6F6964]">
              Connect
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif text-[17px] font-light text-[#EDE8E2] transition-colors duration-300 hover:text-champagne-light"
                  data-cursor="link"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${studioInfo.email}`}
                  className="font-serif text-[17px] font-light text-[#EDE8E2] transition-colors duration-300 hover:text-champagne-light"
                  data-cursor="link"
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href={studioInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif text-[17px] font-light text-[#EDE8E2] transition-colors duration-300 hover:text-champagne-light"
                  data-cursor="link"
                >
                  Instagram
                </a>
              </li>
              <li className="pt-1">
                <a
                  href={`tel:${studioInfo.phone}`}
                  className="font-serif text-[17px] font-light text-[#EDE8E2] transition-colors duration-300 hover:text-champagne-light"
                  data-cursor="link"
                >
                  {studioInfo.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between md:mt-20">
          <p className="font-sans text-[9px] tracking-[0.08em] text-[#6F6964]">
            © {new Date().getFullYear()} {studioInfo.name}
          </p>
          <p className="font-serif text-[15px] font-light italic text-[#8A8279]">
            Made with love in Abu Dhabi.
          </p>
        </div>
      </div>
    </footer>
  );
}