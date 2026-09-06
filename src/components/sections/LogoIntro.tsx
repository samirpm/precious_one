'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface LogoIntroProps {
  onComplete: () => void;
}

export default function LogoIntro({ onComplete }: LogoIntroProps) {
  const [phase, setPhase] = useState<'line' | 'logo' | 'text' | 'exit'>('line');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('logo'), 400),
      setTimeout(() => setPhase('text'), 1200),
      setTimeout(() => setPhase('exit'), 2000),
      setTimeout(() => onComplete(), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#F0EDE6] transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        phase === 'exit'
          ? 'pointer-events-none scale-[1.08] opacity-0'
          : 'scale-100 opacity-100'
      }`}
    >
      {/* Decorative gold line — draws from center */}
      <div
        className="absolute left-1/2 top-10 h-0 w-px bg-champagne transition-all duration-700 ease-out"
        style={{
          height: phase === 'line' ? '40px' : phase !== 'exit' ? '40px' : '0px',
          opacity: phase === 'line' ? 1 : 1,
          transform: 'translateX(-50%)',
        }}
      />

      {/* Logo */}
      <div
        className={`relative transition-all duration-1000 ease-out ${
          phase === 'logo' || phase === 'text'
            ? 'scale-100 opacity-100 blur-0'
            : phase === 'exit'
              ? 'scale-[1.15] opacity-0'
              : 'scale-[0.92] opacity-0 blur-[12px]'
        }`}
      >
        <div className="relative h-40 w-40 sm:h-48 sm:w-48 md:h-56 md:w-56 lg:h-64 lg:w-64">
          <Image
            src="/images/logo.png"
            alt="Precious One Photography"
            fill
            priority
            sizes="256px"
            className="object-contain"
          />
        </div>
      </div>

      {/* Bottom text */}
      <div
        className={`absolute bottom-10 left-0 right-0 text-center transition-all duration-700 ease-out ${
          phase === 'text'
            ? 'translate-y-0 opacity-100'
            : phase === 'exit'
              ? 'translate-y-5 opacity-0'
              : 'translate-y-3 opacity-0'
        }`}
      >
        <p className="font-sans text-[8px] font-medium uppercase tracking-[0.4em] text-taupe">
          Abu Dhabi · UAE
        </p>
      </div>
    </div>
  );
}
