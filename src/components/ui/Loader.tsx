'use client';

export default function Loader() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'var(--color-ivory)' }}
    >
      {/* Logo */}
      <div className="relative mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'var(--color-champagne)' }}
        >
          <span
            className="text-2xl"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'white',
              fontWeight: 400,
            }}
          >
            PO
          </span>
        </div>
        {/* Pulse ring */}
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            border: '2px solid var(--color-champagne)',
            opacity: 0.3,
          }}
        />
      </div>

      {/* Loading text */}
      <p
        className="text-sm tracking-[0.3em] uppercase"
        style={{
          color: 'var(--color-champagne-dark)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        Preparing your memories
      </p>

      {/* Loading bar */}
      <div
        className="mt-6 w-32 h-0.5 rounded-full overflow-hidden"
        style={{ background: 'var(--color-blush)' }}
      >
        <div
          className="h-full rounded-full animate-pulse"
          style={{
            background: 'var(--color-champagne)',
            width: '60%',
          }}
        />
      </div>
    </div>
  );
}
