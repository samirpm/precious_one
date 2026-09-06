'use client';

import { useState, useCallback } from 'react';
import LogoIntro from '@/components/sections/LogoIntro';
import Header from '@/components/navigation/Header';
import CinematicHero from '@/components/sections/CinematicHero';
import Marquee from '@/components/sections/Marquee';
import HorizontalGallery from '@/components/sections/HorizontalGallery';
import Gallery from '@/components/sections/Instagram';

import Services from '@/components/sections/Services';
import ServiceTabs from '@/components/sections/ServiceTabs';
import Stats from '@/components/sections/Stats';
import NewbornSpeciality from '@/components/sections/NewbornSpeciality';
import Privacy from '@/components/sections/Privacy';
import Testimonials from '@/components/sections/Testimonials';
import Faq from '@/components/sections/Faq';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/navigation/Footer';
import FilmGrain from '@/components/ui/FilmGrain';
import CustomCursor from '@/components/ui/CustomCursor';
import ScrollProgress from '@/components/ui/ScrollProgress';
export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <main className="min-h-screen bg-ivory overflow-x-clip">
      {/* Overlays */}
      <FilmGrain />
      <CustomCursor />
      <ScrollProgress />

      {/* SCENE 01: Logo Intro */}
      {!introComplete && <LogoIntro onComplete={handleIntroComplete} />}

      {/* Persistent header */}
      <Header isVisible={introComplete} />

      {/* SCENE 02: ScrollExpand Hero — expands image on scroll */}
      <CinematicHero />

      {/* SCENE 03: Editorial marquee band */}
      <Marquee />

      {/* SCENE 04: Pinned horizontal-scroll gallery */}
      <HorizontalGallery />

      {/* Editorial content sections */}
      <Services />
      {/* <ServiceTabs /> */}
      <Stats />
      <NewbornSpeciality />
      <Privacy />
      <Testimonials />
      {/* <Faq /> */}
      {/* <Gallery /> */}
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
