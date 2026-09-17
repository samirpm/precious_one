import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  useIsMobile — synchronously detects mobile on first client render         */
/* -------------------------------------------------------------------------- */
function useIsMobile() {
  const [mobile, setMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 767;
  });
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setMobile(mql.matches);
    const fn = (e: MediaQueryListEvent) => setMobile(e.matches);
    mql.addEventListener("change", fn);
    return () => mql.removeEventListener("change", fn);
  }, []);
  return mobile;
}

/* -------------------------------------------------------------------------- */
/*  Shared image card                                                        */
/* -------------------------------------------------------------------------- */
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

/* ========================================================================== */
/*  Mobile: pure-CSS auto-scrolling vertical gallery — zero JS per frame     */
/* ========================================================================== */
function MobileAutoScrollGallery({
  images,
  overlay,
}: {
  images: string[];
  overlay?: string;
}) {
  /* Duplicate the image list so the CSS translateY(-50%) loop is seamless. */
  const doubled = useMemo(() => [...images, ...images], [images]);

  return (
    <section
      id="portfolio"
      aria-label="Our portfolio"
      className="relative h-[65vh] overflow-hidden bg-charcoal text-ivory selection:bg-champagne selection:text-charcoal"
    >
      {/* Small-screen eyebrow overlay */}
      {overlay && (
        <div className="absolute left-4 top-[3vh] z-30 flex items-center gap-3">
          <span className="h-px w-8 bg-champagne" />
          <p className="font-sans text-[9px] font-medium uppercase tracking-[0.3em] text-champagne-light">
            {overlay}
          </p>
        </div>
      )}

      {/* Vignette shadow masking the column edges */}
      <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_40px_60px_-30px_rgba(0,0,0,0.7),inset_0_-40px_60px_-30px_rgba(0,0,0,0.7)]" />
      <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_50px_0_80px_-30px_rgba(0,0,0,0.7),inset_-50px_0_80px_-30px_rgba(0,0,0,0.7)]" />

      {/* Two auto-scrolling columns — CSS marquee, GPU-composited */}
      <div className="flex h-full gap-4 px-4 pt-[8vh]">
        {/* Column 1: scrolls upward */}
        <div className="flex-1 overflow-hidden">
          <div
            className="marquee-v flex flex-col gap-4"
            style={{ "--marquee-v-duration": "25s" } as React.CSSProperties}
          >
            {doubled.map((src, i) => (
              <div
                key={`mv1-${i}`}
                className="h-[200px] flex-shrink-0 overflow-hidden bg-charcoal"
              >
                <img
                  src={src}
                  alt="Portfolio photograph"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-[0.82]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: scrolls downward (reverse direction) */}
        <div className="flex-1 overflow-hidden">
          <div
            className="marquee-v-reverse flex flex-col gap-4"
            style={{ "--marquee-v-duration": "32s" } as React.CSSProperties}
          >
            {doubled.map((src, i) => (
              <div
                key={`mv2-${i}`}
                className="h-[200px] flex-shrink-0 overflow-hidden bg-charcoal"
              >
                <img
                  src={src}
                  alt="Portfolio photograph"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-[0.75]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================================================================== */
/*  Desktop: full 3D matrix scroll-pinned gallery (existing behaviour)        */
/* ========================================================================== */
interface DesktopGalleryProps {
  images: string[];
  children?: React.ReactNode;
  overlay?: string;
  className?: string;
}

function DesktopGallery({
  images,
  children,
  overlay = "Our Work",
  className = "",
}: DesktopGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  });

  // ── Full 3D matrix ──
  const rotateY = useTransform(smooth, [0, 1], [-45, -8]);
  const rotateX = useTransform(smooth, [0, 1], [24, 4]);
  const rotateZ = useTransform(smooth, [0, 1], [15, 2]);
  const translateZ = useTransform(smooth, [0, 1], [-720, 0]);
  const scale = useTransform(smooth, [0, 0.18], [1.18, 1]);
  const opacity = useTransform(smooth, [0, 0.12], [0.5, 1]);

  // Column parallax — each track drifts at its own rate while scrolling.
  const yCol1 = useTransform(smooth, [0, 1], ["0%", "-40%"]);
  const yCol2 = useTransform(smooth, [0, 1], ["-40%", "10%"]);
  const yCol3 = useTransform(smooth, [0, 1], ["0%", "-40%"]);
  const yCol4 = useTransform(smooth, [0, 1], ["-30%", "20%"]);

  const cols = useMemo(() => {
    const pick = (i: number) => images.filter((_, idx) => idx % 4 === i);
    return [
      [...pick(0), ...pick(0)],
      [...pick(1), ...pick(1)],
      [...pick(2), ...pick(2)],
      [...pick(3), ...pick(3)],
    ];
  }, [images]);

  const matrixStyle = reduced
    ? undefined
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
      className={`relative h-[520vh] bg-charcoal text-ivory selection:bg-champagne selection:text-charcoal ${className}`}
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
            <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_120px_150px_-60px_rgba(0,0,0,0.85),inset_0_-120px_150px_-60px_rgba(0,0,0,0.85)]" />
            <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_140px_0_150px_-70px_rgba(0,0,0,0.85),inset_-140px_0_150px_-70px_rgba(0,0,0,0.85)]" />

            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ perspective: "1200px" }}
            >
              <motion.div
                style={matrixStyle}
                data-gallery-matrix
                className="flex items-center justify-center gap-6 pointer-events-auto w-[130vw] will-change-transform preserve-3d"
              >
                {cols.map((column, i) => (
                  <motion.div
                    key={`col-${i}`}
                    style={{ y: [yCol1, yCol2, yCol3, yCol4][i] }}
                    className="flex w-[20vw] min-w-[140px] flex-col gap-6"
                  >
                    {column.map((src, index) => (
                      <ImageCard key={`col-${i}-${index}`} src={src} />
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

/* ========================================================================== */
/*  ParallaxUnfurlingGallery — main export                                    */
/* ========================================================================== */
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
 * **Desktop:** A tall dark section pins a viewport for the duration of its
 * scroll range; the four photo columns sit in a 3D perspective matrix that
 * rotates and slides toward the viewer as the page scrolls. Rewinds on
 * scroll-up so the unfurling replays on every scroll-down pass.
 *
 * **Mobile:** A lightweight CSS-only auto-scrolling vertical gallery with two
 * columns scrolling in opposite directions. Zero JavaScript per frame — pure
 * `@keyframes` GPU-composited animation. No scroll-pinning.
 */
export default function ParallaxUnfurlingGallery({
  images,
  children,
  overlay = "Our Work",
  className = "",
}: ParallaxUnfurlingGalleryProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileAutoScrollGallery images={images} overlay={overlay} />;
  }

  return (
    <DesktopGallery
      images={images}
      children={children}
      overlay={overlay}
      className={className}
    />
  );
}
