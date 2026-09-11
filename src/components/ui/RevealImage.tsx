import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  /** Enable parallax float effect */
  parallax?: boolean;
  /** Clip-path wipe direction: 'left' | 'right' | 'center'. Default 'left' */
  direction?: 'left' | 'right' | 'center';
}

/**
 * RevealImage — image wipes in via clip-path animation on scroll,
 * with optional parallax Y float.
 */
export default function RevealImage({
  src,
  alt,
  className = '',
  imageClassName = '',
  sizes,
  parallax = false,
  direction = 'left',
}: RevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const imageWrap = imageWrapRef.current;
      if (!container || !imageWrap) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const clipFrom =
        direction === 'center'
          ? 'inset(50% 50% 50% 50% round 0px)'
          : direction === 'right'
            ? 'inset(0 0% 0 100% round 0px)'
            : 'inset(0 100% 0 0 round 0px)';

      const clipTo = 'inset(0 0% 0 0% round 0px)';

      gsap.fromTo(
        imageWrap,
        { clipPath: clipFrom },
        {
          clipPath: clipTo,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      );

      if (parallax) {
        gsap.fromTo(
          imageWrap.querySelector('img'),
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }
    },
    { scope: containerRef, dependencies: [parallax, direction] },
  );

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div ref={imageWrapRef} className="h-full w-full">
        <img
          src={src}
          alt={alt}
          sizes={sizes || '(max-width: 1024px) 100vw, 50vw'}
          className={`object-cover w-full h-full ${imageClassName}`}
        />
      </div>
    </div>
  );
}
