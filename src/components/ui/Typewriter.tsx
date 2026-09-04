'use client';

import { useState, useEffect, useCallback } from 'react';

interface TypewriterProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

export default function Typewriter({
  phrases,
  typingSpeed = 70,
  deletingSpeed = 40,
  pauseDuration = 2200,
  className = '',
}: TypewriterProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Reduced motion: show first phrase statically, no animation
  if (prefersReducedMotion) {
    return (
      <span className={className}>
        {phrases[0]}
      </span>
    );
  }

  const tick = useCallback(() => {
    const currentPhrase = phrases[currentPhraseIndex];

    if (!isDeleting) {
      setCurrentText(currentPhrase.substring(0, currentText.length + 1));

      if (currentText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
        return;
      }
    } else {
      setCurrentText(currentPhrase.substring(0, currentText.length - 1));

      if (currentText === '') {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        return;
      }
    }
  }, [currentText, currentPhraseIndex, isDeleting, phrases, pauseDuration]);

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, typingSpeed, deletingSpeed]);

  return (
    <span className={className}>
      {currentText}
      <span
        className="inline-block w-[2px] ml-0.5 align-middle"
        style={{
          height: '1em',
          backgroundColor: '#C5A572',
          animation: 'typewriter-cursor 1s step-end infinite',
        }}
        aria-hidden="true"
      />
    </span>
  );
}
