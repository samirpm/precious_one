'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface LogoIntroProps {
  onComplete: () => void;
}

export default function LogoIntro({ onComplete }: LogoIntroProps) {
  const [phase, setPhase] = useState<'initial' | 'exit'>('initial');

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setPhase('exit');
    }, 1800);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#F5F0E8] transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        phase === 'exit'
          ? 'pointer-events-none scale-[1.08] opacity-0'
          : 'scale-100 opacity-100'
      }`}
    >
      {/* Logo */}
      <div
        className={`relative transition-all duration-1000 ease-out ${
          phase === 'exit'
            ? 'scale-[1.15] opacity-0'
            : 'scale-100 opacity-100'
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

      {/* Bottom typography */}
      <div
        className={`absolute bottom-10 left-0 right-0 text-center transition-all duration-700 ease-out ${
          phase === 'exit'
            ? 'translate-y-5 opacity-0'
            : 'translate-y-0 opacity-100'
        }`}
      >
        <p className="font-sans text-[8px] font-medium uppercase tracking-[0.4em] text-[#9C918A]">
          Abu Dhabi · UAE
        </p>
      </div>

      {/* Small top mark */}
      <div
        className={`absolute top-10 left-1/2 h-8 w-px bg-[#C5A572] transition-all duration-700 ease-out ${
          phase === 'exit'
            ? 'translate-y-[-15px] opacity-0'
            : 'translate-y-0 opacity-100'
        }`}
      />
    </div>
  );
}