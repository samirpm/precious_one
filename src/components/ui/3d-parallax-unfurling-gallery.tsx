import React, { useMemo, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

interface ImageCardProps {
  src: string;
  onLoad?: () => void;
}

const ImageCard = ({ src, onLoad }: ImageCardProps) => {
  return (
    <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] flex-shrink-0 bg-charcoal transition-transform duration-300 hover:scale-[1.02] cursor-pointer relative will-change-transform preserve-3d backface-hidden overflow-hidden">
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

  // Scroll progress through the pinned section, driven by the page scroll.
  // Bidirectional — rewinds on the way up, so the unfurling plays again on
  // every scroll-down pass through the section.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 20, mass: 0.5 });

  // 3D matrix motion
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
                className="flex w-[130vw] items-center justify-center gap-4 md:gap-6 will-change-transform preserve-3d"
              >
                {cols.map((column, i) => (
                  <motion.div
                    key={`col-${i}`}
                    style={{ y: [yCol1, yCol2, yCol3, yCol4][i] }}
                    className="flex w-[20vw] min-w-[180px] flex-col gap-4 md:gap-6 pointer-events-auto"
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