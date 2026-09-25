import React, { useState } from 'react';
import type { StudioInfo } from '@/types/photography';
import { studioInfo as fallbackStudioInfo } from '@/lib/content';
import SplitReveal from '@/components/ui/SplitReveal';
import RevealImage from '@/components/ui/RevealImage';

interface ContactProps {
  studioInfo?: StudioInfo | null;
  services?: Service[];
}

export default function Contact({ studioInfo, services = [] }: ContactProps) {
  const info = studioInfo ?? fallbackStudioInfo;
  const whatsappNumber = info.whatsapp.replace(/[^0-9]/g, '');

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unexpected error occurred');
      setStatus('error');
    }
  }

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
            <div className="mb-10">
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
                  href={`mailto:${info.email}`}
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
            <div className="grid grid-cols-2 gap-x-8 gap-y-8 md:mt-16 lg:max-w-2xl">
              <div>
                <p className="mb-2 font-sans text-[9px] font-medium uppercase tracking-[0.25em] text-taupe">
                  Phone
                </p>
                <a
                  href={`tel:${info.phone}`}
                  className="font-serif text-lg font-light text-charcoal transition-colors duration-300 hover:text-champagne-dark"
                  data-cursor="link"
                >
                  {info.phone}
                </a>
              </div>

              <div>
                <p className="mb-2 font-sans text-[9px] font-medium uppercase tracking-[0.25em] text-taupe">
                  Email
                </p>
                <a
                  href={`mailto:${info.email}`}
                  className="font-serif text-lg font-light text-charcoal transition-colors duration-300 hover:text-champagne-dark"
                  data-cursor="link"
                >
                  {info.email}
                </a>
              </div>

              <div>
                <p className="mb-2 font-sans text-[9px] font-medium uppercase tracking-[0.25em] text-taupe">
                  Studio Hours
                </p>
                <p className="font-serif text-lg font-light text-charcoal">
                  {info.openingHours}
                </p>
              </div>

              <div>
                <p className="mb-2 font-sans text-[9px] font-medium uppercase tracking-[0.25em] text-taupe">
                  Studio
                </p>
                <p className="max-w-xs font-serif text-lg font-light leading-6 text-charcoal">
                  {info.address}
                </p>
              </div>
            </div>
          </div>

          {/* Right - Booking Form */}
          <div className="flex flex-col gap-8">
            <div className="rounded-2xl border border-charcoal/10 bg-white p-6 md:p-8 shadow-sm">
              <h3 className="mb-6 font-serif text-xl font-light text-charcoal">Request a Session</h3>

              {status === 'success' ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                    ✓
                  </div>
                  <p className="font-serif text-lg text-charcoal">Request sent!</p>
                  <p className="text-sm text-taupe">We'll get back to you shortly.</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-xs uppercase tracking-wider text-champagne hover:underline"
                  >
                    Send another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-taupe" htmlFor="clientName">Name</label>
                      <input
                        id="clientName"
                        name="clientName"
                        type="text"
                        required
                        className="w-full border border-charcoal/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-champagne"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-taupe" htmlFor="clientEmail">Email</label>
                      <input
                        id="clientEmail"
                        name="clientEmail"
                        type="email"
                        required
                        className="w-full border border-charcoal/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-champagne"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-taupe" htmlFor="clientPhone">Phone</label>
                      <input
                        id="clientPhone"
                        name="clientPhone"
                        type="tel"
                        required
                        className="w-full border border-charcoal/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-champagne"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-taupe" htmlFor="serviceId">Service</label>
                      <select
                        id="serviceId"
                        name="serviceId"
                        required
                        className="w-full border border-charcoal/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-champagne"
                      >
                        <option value="">Select a service</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-taupe" htmlFor="bookingDate">Preferred Date</label>
                      <input
                        id="bookingDate"
                        name="bookingDate"
                        type="date"
                        required
                        className="w-full border border-charcoal/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-champagne"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-taupe" htmlFor="bookingTime">Preferred Time</label>
                      <input
                        id="bookingTime"
                        name="bookingTime"
                        type="text"
                        placeholder="e.g. 10:00 AM"
                        required
                        className="w-full border border-charcoal/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-champagne"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-taupe" htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      className="w-full border border-charcoal/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-champagne"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-champagne py-3 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-all hover:bg-champagne-light disabled:opacity-50"
                  >
                    {status === 'submitting' ? 'Sending...' : 'Request Session'}
                  </button>

                  {status === 'error' && (
                    <p className="mt-2 text-center text-xs text-red-600">{errorMessage}</p>
                  )}
                </form>
              )}
            </div>

            <RevealImage
              direction="center"
              parallax
              src="/images/portfolio/photo-13.jpeg"
              alt="Booking your session"
              className="aspect-video w-full"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
