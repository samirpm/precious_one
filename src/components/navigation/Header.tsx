'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MagneticButton from '@/components/ui/MagneticButton';

interface HeaderProps {
  isVisible: boolean;
}

export default function Header({ isVisible }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Portfolio', href: '/#portfolio' },
    { label: 'Services', href: '/#services' },
    { label: 'Our Story', href: '/#about' },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-out ${
          isVisible
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0'
        } ${
          isScrolled
            ? 'border-b border-charcoal/8 bg-ivory/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div
          className="mx-auto flex max-w-[1440px] items-center justify-between px-6 sm:px-8 md:px-10 lg:px-16"
          style={{ height: '80px' }}
        >
          {/* Brand - Left */}
          <Link
            href="/"
            className="group flex items-center gap-3 flex-shrink-0"
            aria-label="Precious One Photography"
            data-cursor="link"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-full transition-transform duration-500 group-hover:scale-105 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
              <Image
                src="/images/logo.png"
                alt="Precious One Photography"
                fill
                priority
                sizes="56px"
                className="object-cover"
              />
            </div>

            <div className="hidden sm:block">
              <span className="block font-serif text-[16px] leading-none tracking-[0.06em] text-charcoal lg:text-[18px]">
                Precious One
              </span>

              <span className="mt-1 block font-sans text-[8px] uppercase tracking-[0.28em] text-taupe lg:text-[9px]">
                Photography
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden items-center justify-center md:flex absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-8 lg:gap-10">
              {navItems.map((item) => (
                <MagneticButton key={item.label} intensity={0.25} threshold={60}>
                  <a
                    href={item.href}
                    className="group relative py-2 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal-light transition-colors duration-300 hover:text-champagne-dark lg:text-[12px]"
                    data-cursor="link"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-champagne-dark transition-all duration-300 group-hover:w-full" />
                  </a>
                </MagneticButton>
              ))}
            </div>
          </nav>

          {/* CTA Button - Right */}
          <MagneticButton intensity={0.2} threshold={70}>
            <a
              href="/#contact"
              className="hidden md:inline-flex items-center gap-3 px-6 py-3 rounded-full font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex-shrink-0 lg:px-8 lg:py-4 lg:text-[11px]"
              style={{
                background: 'linear-gradient(135deg, #B8977E 0%, #C9AB94 50%, #A8876E 100%)',
              }}
              data-cursor="link"
            >
              Book a Session
            </a>
          </MagneticButton>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="relative z-[60] flex h-10 w-10 items-center justify-center md:hidden"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 block h-px w-5 bg-charcoal transition-all duration-300 ${
                  isMobileMenuOpen ? 'top-2 rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-2 block h-px w-5 bg-charcoal transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-4 block h-px w-5 bg-charcoal transition-all duration-300 ${
                  isMobileMenuOpen ? 'top-2 -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-0 z-40 bg-ivory transition-all duration-500 ease-out md:hidden ${
          isMobileMenuOpen
            ? 'visible opacity-100'
            : 'invisible opacity-0'
        }`}
      >
        <div className="flex h-full flex-col justify-between px-6 pb-10 pt-32 sm:px-8">
          <nav className="flex flex-col">
            {navItems.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between border-b border-charcoal/10 py-6 font-serif text-3xl font-light text-charcoal transition-colors duration-300 hover:text-champagne-dark sm:text-4xl"
              >
                <span>{item.label}</span>
                <span className="font-sans text-sm text-champagne-dark">
                  0{index + 1}
                </span>
              </a>
            ))}

            <a
              href="/#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-8 inline-flex w-fit items-center gap-3 px-8 py-4 rounded-full font-sans text-[11px] uppercase tracking-[0.2em] text-white transition-all duration-300 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #B8977E 0%, #C9AB94 50%, #A8876E 100%)',
              }}
            >
              Book a Session
              <span>↗</span>
            </a>
          </nav>

          <div>
            <p className="font-serif text-xl italic text-taupe">
              Timeless memories of your
              <br />
              most precious moments.
            </p>

            <p className="mt-5 font-sans text-[9px] uppercase tracking-[0.22em] text-taupe-light">
              Abu Dhabi · UAE
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
