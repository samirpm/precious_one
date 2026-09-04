'use client';

import { studioInfo } from '@/lib/content';

export default function Footer() {
  const links = [
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Services', href: '#services' },
    { label: 'Our Story', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-[#25211E] text-[#FAF8F5]">
      {/* Main Footer */}
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 md:px-10 lg:px-16 py-20 md:py-24 lg:py-28">
        <div className="grid gap-12 md:grid-cols-[1.3fr_0.7fr] md:gap-16 lg:gap-20">
          {/* Brand Statement */}
          <div>
            <p className="mb-7 font-sans text-[9px] font-medium uppercase tracking-[0.3em] text-[#C5A572]">
              Precious One Photography
            </p>

            <h2 className="max-w-[700px] font-serif text-4xl font-light leading-[0.95] tracking-[-0.02em] text-[#FAF8F5] sm:text-5xl lg:text-6xl">
              The moments
              <br />
              <em className="font-light text-[#D4BC8E]">you'll treasure.</em>
            </h2>

            <p className="mt-8 max-w-md font-sans text-[13px] font-light leading-6 text-[#B5ACA5]">
              {studioInfo.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div className="md:pt-2">
            <p className="mb-6 font-sans text-[9px] font-medium uppercase tracking-[0.28em] text-[#6F6964]">
              Explore
            </p>

            <nav className="flex flex-col">
              {links.map((link, index) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="group flex items-center justify-between border-b border-white/10 py-4 transition-colors duration-300 hover:border-white/20"
                >
                  <span className="font-serif text-lg font-light text-[#EDE8E2] transition-transform duration-300 group-hover:translate-x-2 lg:text-xl">
                    {link.label}
                  </span>

                  <span className="font-sans text-[9px] tracking-[0.15em] text-[#6F6964] transition-colors duration-300 group-hover:text-[#C5A572]">
                    0{index + 1}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="my-16 h-px bg-white/10 md:my-20" />

        {/* Bottom */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-serif text-2xl font-light text-[#FAF8F5]">
              Precious One
            </p>

            <p className="mt-2 font-sans text-[9px] font-medium uppercase tracking-[0.25em] text-[#6F6964]">
              Abu Dhabi · UAE
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <a
              href="#contact"
              className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#C5A572] transition-colors duration-300 hover:text-[#D4BC8E]"
            >
              Start your story ↗
            </a>

            <p className="font-sans text-[9px] tracking-[0.08em] text-[#6F6964]">
              © {new Date().getFullYear()} {studioInfo.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}