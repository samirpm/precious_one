'use client';

import { useState, useCallback } from 'react';
import LogoIntro from '@/components/sections/LogoIntro';
import Header from '@/components/navigation/Header';
import CinematicStage from '@/components/sections/CinematicStage';
import Services from '@/components/sections/Services';
import NewbornSpeciality from '@/components/sections/NewbornSpeciality';
import Privacy from '@/components/sections/Privacy';
import About from '@/components/sections/About';
import Instagram from '@/components/sections/Instagram';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/navigation/Footer';

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF8F5] overflow-x-clip">
      {/* SCENE 01: Logo Intro */}
      {!introComplete && <LogoIntro onComplete={handleIntroComplete} />}

      {/* Persistent header */}
      <Header isVisible={introComplete} />

      {/* SCENES 02-04: Pinned cinematic stage — Hero → Camera → Portfolio reveal + scroll */}
      <CinematicStage />

      {/* SCENE 05: Services, Story, Privacy, About */}
      <Services />
      <NewbornSpeciality />
      <Privacy />
      <About />

      {/* Additional sections */}
      {/* <Instagram /> */}
      <Contact />
      <Footer />
    </main>
  );
}
