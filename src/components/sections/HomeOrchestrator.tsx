import { useState, useCallback } from 'react';
import LogoIntro from '@/components/sections/LogoIntro';
import Header from '@/components/navigation/Header';

/**
 * HomeOrchestrator — manages the logo-intro → persistent-header transition
 * for the home page. Rendered as a fixed overlay + fixed header, so the
 * sections below it (server-rendered siblings in index.astro) are covered
 * during the intro and revealed once it completes.
 */
export default function HomeOrchestrator() {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <>
      {/* SCENE 01: Logo Intro overlay */}
      {!introComplete && <LogoIntro onComplete={handleIntroComplete} />}

      {/* Persistent header */}
      <Header isVisible={introComplete} />
    </>
  );
}