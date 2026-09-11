import { studioInfo } from '@/lib/content';
import SplitReveal from '@/components/ui/SplitReveal';
import RevealImage from '@/components/ui/RevealImage';

export default function Contact() {
  const whatsappNumber = studioInfo.whatsapp.replace(/[^0-9]/g, '');

  return (
    <section id="contact" className="overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 md:px-10 lg:px-16 py-20 md:py-28 lg:py-32">

        {/* Heading */}
        <div className="mb-12 md:mb-16">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-champagne" />
            <p className="font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-champagne-dark">
              Let&apos;s Create Something Beautiful
            </p>
          </div>

          <SplitReveal
            as="h2"
            emClassName="text-champagne-dark"
            className="max-w-4xl font-serif text-[clamp(2.5rem,5vw,5rem)] font-light leading-[0.9] tracking-[-0.025em] text-charcoal"
          >
            Your story deserves to be <em>remembered.</em>
          </SplitReveal>
        </div>

        {/* Main Content */}
        <div className="grid border-t border-charcoal/10 pt-10 md:pt-12 md:grid-cols-[1fr_0.85fr] md:gap-16 lg:gap-24">

          {/* Left */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="max-w-xl font-sans text-[14px] font-light leading-7 text-charcoal-light">
                Every precious moment deserves to be beautifully preserved.
                Whether you are welcoming a newborn, celebrating a milestone,
                or gathering your family together, we would love to tell your
                story.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-5 bg-champagne px-8 py-4 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-champagne-light hover:shadow-lg"
                  data-cursor="link"
                >
                  Book via WhatsApp
                  <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                    ↗
                  </span>
                </a>

                <a
                  href={`mailto:${studioInfo.email}`}
                  className="group inline-flex items-center justify-center gap-5 border border-charcoal/20 px-8 py-4 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-charcoal transition-all duration-300 hover:border-champagne hover:text-champagne-dark hover:shadow-md"
                  data-cursor="link"
                >
                  Send an Email
                  <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                    ↗
                  </span>
                </a>
              </div>
            </div>

            {/* Desktop contact details */}
            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 md:mt-16 lg:max-w-2xl">
              <div>
                <p className="mb-2 font-sans text-[9px] font-medium uppercase tracking-[0.25em] text-taupe">
                  Phone
                </p>

                <a
                  href={`tel:${studioInfo.phone}`}
                  className="font-serif text-lg font-light text-charcoal transition-colors duration-300 hover:text-champagne-dark"
                  data-cursor="link"
                >
                  {studioInfo.phone}
                </a>
              </div>

              <div>
                <p className="mb-2 font-sans text-[9px] font-medium uppercase tracking-[0.25em] text-taupe">
                  Email
                </p>

                <a
                  href={`mailto:${studioInfo.email}`}
                  className="font-serif text-lg font-light text-charcoal transition-colors duration-300 hover:text-champagne-dark"
                  data-cursor="link"
                >
                  {studioInfo.email}
                </a>
              </div>

              <div>
                <p className="mb-2 font-sans text-[9px] font-medium uppercase tracking-[0.25em] text-taupe">
                  Studio Hours
                </p>

                <p className="font-serif text-lg font-light text-charcoal">
                  {studioInfo.openingHours}
                </p>
              </div>

              <div>
                <p className="mb-2 font-sans text-[9px] font-medium uppercase tracking-[0.25em] text-taupe">
                  Studio
                </p>

                <p className="max-w-xs font-serif text-lg font-light leading-6 text-charcoal">
                  {studioInfo.address}
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="mt-12 md:mt-0">
            <RevealImage
              direction="center"
              parallax
              src="/images/portfolio/photo-13.jpeg"
              alt="Reaching out to preserve a precious moment"
              className="aspect-[4/3] w-full"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
