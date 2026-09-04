'use client';

import { studioInfo, portfolio } from '@/lib/content';
import Image from 'next/image';
import { useFadeOnScroll } from '@/hooks/useFadeOnScroll';

export default function Instagram() {
  const { ref, style } = useFadeOnScroll({ translate: 'up' });
  const posts = portfolio.slice(0, 6);

  return (
    <section id="instagram" className="overflow-hidden">
      <div
        ref={ref}
        className="mx-auto max-w-[1440px] px-6 sm:px-8 md:px-10 lg:px-16 py-20 md:py-28 lg:py-36"
        style={style}
      >
        <div className="mb-14 flex flex-col justify-between gap-8 md:mb-20 md:flex-row md:items-end">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-[#C5A572]" />
              <p className="font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-[#B8956A]">
                From Our Journal
              </p>
            </div>
            <h2 className="font-serif text-4xl font-light leading-none text-[#2D2926] sm:text-5xl md:text-6xl">
              Follow the
              <br />
              <em className="text-[#B8956A]">moments.</em>
            </h2>
          </div>
          <p className="max-w-sm font-sans text-[13px] font-light leading-6 text-[#4A4543] md:pb-1">
            Discover our latest sessions, little personalities, and beautiful
            family moments on Instagram.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {posts.map((post, index) => (
            <a
              key={post.id}
              href={studioInfo.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative block overflow-hidden bg-[#E8D5C4] transition-transform duration-500 ease-out hover:scale-[1.02] ${
                index === 1
                  ? 'md:translate-y-12'
                  : index === 4
                    ? 'md:-translate-y-8'
                    : ''
              }`}
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 flex items-end bg-black/0 p-5 transition-colors duration-500 group-hover:bg-black/20">
                  <div className="translate-y-4 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-white">
                      View on Instagram ↗
                    </p>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16 text-center md:mt-24">
          <a
            href={studioInfo.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 border-b border-[#2D2926] pb-2 font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-[#2D2926] transition-all duration-300 hover:border-[#B8956A] hover:text-[#B8956A]"
          >
            @preciousonephotography
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}