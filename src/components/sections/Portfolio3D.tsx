import ParallaxUnfurlingGallery from '@/components/ui/3d-parallax-unfurling-gallery';
import { portfolio } from '@/lib/content';

/** Distinct portfolio photographs (photo-1 … photo-15), deduplicated. */
const galleryImages = Array.from(
  new Set(portfolio.map((p) => p.imageUrl)),
).slice(0, 15);

/**
 * Portfolio3D — the home-page portfolio section.
 *
 * Editorial text sits on the left (30%); the 3D parallax unfurling gallery
 * fills the right (70%) and plays as the visitor scrolls down.
 */
export default function Portfolio3D() {
  return (
    <ParallaxUnfurlingGallery images={galleryImages} overlay="Our Work">
      <div className="mb-8 flex items-center gap-4">
        <span className="h-px w-10 bg-champagne" />
        <p className="font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-champagne-light">
          Our Work
        </p>
      </div>
      <h2 className="max-w-sm font-serif text-[clamp(2.4rem,3.6vw,4.5rem)] font-light leading-[0.95] tracking-[-0.02em] text-ivory">
        Unfolding, one frame at{' '}
        <em className="text-champagne">a time.</em>
      </h2>
      <p className="mt-6 max-w-xs font-sans text-[13px] font-light leading-6 text-ivory/60">
        Newborn, family, and maternity sessions — a scroll of recent work
        drawn toward you as the page moves.
      </p>
      <a
        href="#contact"
        data-cursor="link"
        className="group mt-10 inline-flex items-center gap-5 bg-champagne px-9 py-4 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-champagne-light"
      >
        Book Your Session
        <span
          aria-hidden="true"
          className="text-base transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </a>
    </ParallaxUnfurlingGallery>
  );
}