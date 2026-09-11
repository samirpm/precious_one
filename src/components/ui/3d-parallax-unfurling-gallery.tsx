import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/** Detect mobile viewport — used to strip expensive 3D down to 2D. */
function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setMobile(mql.matches);
    const fn = (e: MediaQueryListEvent) => setMobile(e.matches);
    mql.addEventListener("change", fn);
    return () => mql.removeEventListener("change", fn);
  }, []);
  return mobile;
}

interface ImageCardProps {
  src: string;
  onLoad?: () => void;
  isMobile?: boolean;
}

const ImageCard = ({ src, onLoad, isMobile }: ImageCardProps) => {
  return (
    <div
      className={`w-full h-[200px] sm:h-[300px] md:h-[400px] flex-shrink-0 bg-charcoal cursor-pointer relative overflow-hidden ${isMobile ? "" : "transition-transform duration-300 hover:scale-[1.02] will-change-transform"}`}
    >
      <img
        src={src}
        alt="Portfolio photograph"
        loading="lazy"
        onLoad={onLoad}
        className="w-full h-full object-cover opacity-[0.82] hover:opacity-100 transition-opacity duration-300"
      />
    </div>
  );
};

interface ParallaxUnfurlingGalleryProps {
  images: string[];
  /** Left-hand (30%) panel content, shown on lg+ screens. */
  children?: React.ReactNode;
  /** Short brand eyebrow shown as an overlay on small screens. */
  overlay?: string;
  className?: string;
}

/**
 * ParallaxUnfurlingGallery — the portfolio section's 3D scroll reveal.
 *
 * A tall dark section pins a viewport for the duration of its scroll range;
 * the four photo columns sit in a 3D perspective matrix that rotates and
 * slides toward the viewer as the page scrolls. Progress is linked both
 * ways — rewinds on scroll-up so the unfurling replays on every
 * scroll-down pass. The section is tall enough (520vh) that the unfurling
 * keeps moving for ~3+ seconds of steady scrolling.
 *
 * Layout: children (editorial text) on the left 30%, the animation on the
 * right 70%. On small screens the text hides and a slim `overlay` eyebrow
 * labels the gallery instead.
 */
export default function ParallaxUnfurlingGallery({
  images,
  children,
  overlay = "Our Work",
  className = "",
}: ParallaxUnfurlingGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  // Spring config — lighter on mobile to cut per-frame cost.
  // Desktop: progress spans the whole scroll-through. Mobile: progress maps
  // to the pinned window only (["start start","end end"]), so the gallery
  // animates WHILE it is pinned and doesn't finish before the pin starts —
  // otherwise a phone user scrolls a dead, static screen.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: isMobile ? ["start start", "end end"] : ["start end", "end end"],
  });

  const smooth = useSpring(scrollYProgress, isMobile
    ? { stiffness: 120, damping: 30, mass: 0.3 }
    : { stiffness: 100, damping: 20, mass: 0.5 },
  );

  // ── Desktop: full 3D matrix ──
  const rotateY = useTransform(smooth, [0, 1], [-45, -8]);
  const rotateX = useTransform(smooth, [0, 1], [24, 4]);
  const rotateZ = useTransform(smooth, [0, 1], [15, 2]);
  const translateZ = useTransform(smooth, [0, 1], [-720, 0]);
  const scale = useTransform(smooth, [0, 0.18], [1.18, 1]);
  const opacity = useTransform(smooth, [0, 0.12], [0.5, 1]);

  // ── Mobile: flat2D scroll — visible drift + fade while pinned ──
  const opacityM = useTransform(smooth, [0, 0.3], [0.3, 1]);
  const ySlide = useTransform(smooth, [0, 1], ["14%", "-14%"]);
  const scaleM = useTransform(smooth, [0, 1], [1.1, 0.98]);

  // Column parallax — each track drifts at its own rate while scrolling.
  // Mobile uses only 2 columns with simpler parallax.
  const yCol1 = useTransform(smooth, [0, 1], ["0%", "-40%"]);
  const yCol2 = useTransform(smooth, [0, 1], ["-40%", "10%"]);
  const yCol3 = useTransform(smooth, [0, 1], ["0%", "-40%"]);
  const yCol4 = useTransform(smooth, [0, 1], ["-30%", "20%"]);

  // Mobile: only 2 columns, no duplication (fewer DOM nodes).
  const cols = useMemo(() => {
    if (isMobile) {
      const pick = (i: number) => images.filter((_, idx) => idx % 2 === i);
      return [pick(0), pick(1)];
    }
    const pick = (i: number) => images.filter((_, idx) => idx % 4 === i);
    return [
      [...pick(0), ...pick(0)],
      [...pick(1), ...pick(1)],
      [...pick(2), ...pick(2)],
      [...pick(3), ...pick(3)],
    ];
  }, [images, isMobile]);

  // Mobile gets a flat2D style; desktop gets the full 3D matrix.
  const matrixStyle = reduced
    ? undefined
    : isMobile
      ? { opacity: opacityM, y: ySlide, scale: scaleM }
      : {
          rotateX,
          rotateY,
          rotateZ,
          z: translateZ,
          scale,
          opacity,
          transformStyle: "preserve-3d" as const,
        };

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      aria-label="Our portfolio"
      className={`relative h-[150vh] md:h-[520vh] bg-charcoal text-ivory selection:bg-champagne selection:text-charcoal ${className}`}
    >
      {/* Pinned viewport that plays the unfurling as the page scrolls past */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="grid h-full grid-cols-1 lg:grid-cols-[30%_70%]">
          {/* LEFT — editorial text (30%) */}
          <div className="relative z-30 hidden items-center lg:flex">
            <div className="flex flex-col items-start pl-[clamp(1.5rem,4vw,4.5rem)] pr-6">
              {children}
            </div>
          </div>

          {/* RIGHT — 3D gallery (70%) */}
          <div className="relative h-full overflow-hidden">
            {/* Small-screen eyebrow overlay */}
            {overlay && (
              <div className="absolute left-4 top-[9vh] z-30 flex items-center gap-3 lg:hidden">
                <span className="h-px w-8 bg-champagne" />
                <p className="font-sans text-[9px] font-medium uppercase tracking-[0.3em] text-champagne-light">
                  {overlay}
                </p>
              </div>
            )}

            {/* Vignette shadow masking the matrix edges */}
            <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_60px_80px_-40px_rgba(0,0,0,0.7),inset_0_-60px_80px_-40px_rgba(0,0,0,0.7)] md:shadow-[inset_0_120px_150px_-60px_rgba(0,0,0,0.85),inset_0_-120px_150px_-60px_rgba(0,0,0,0.85)]" />
            <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_80px_0_100px_-50px_rgba(0,0,0,0.7),inset_-80px_0_100px_-50px_rgba(0,0,0,0.7)] md:shadow-[inset_140px_0_150px_-70px_rgba(0,0,0,0.85),inset_-140px_0_150px_-70px_rgba(0,0,0,0.85)]" />

            <div
              className="absolute inset-0 flex items-center justify-center"
              style={isMobile ? undefined : { perspective: "1200px" }}
            >
              <motion.div
                style={matrixStyle}
                data-gallery-matrix
                className={`flex items-center justify-center gap-4 md:gap-6 pointer-events-auto ${isMobile ? "w-[160vw]" : "w-[130vw] will-change-transform preserve-3d"}`}
              >
                {cols.map((column, i) => (
                  <motion.div
                    key={`col-${i}`}
                    style={isMobile ? undefined : { y: [yCol1, yCol2, yCol3, yCol4][i] }}
                    className="flex w-[40vw] sm:w-[30vw] md:w-[20vw] min-w-[140px] flex-col gap-4 md:gap-6"
                  >
                    {column.map((src, index) => (
                      <ImageCard key={`col-${i}-${index}`} src={src} isMobile={isMobile} />
                    ))}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}