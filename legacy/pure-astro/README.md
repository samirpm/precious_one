# Pure-Astro implementation (frozen reference)

This is a frozen snapshot of the site as it stood on **2026-09-09** on
`origin/main` (commits `9ea52f0`…`c634c87`), before the React-islands
rewrite became the active implementation.

It is a **self-contained, pure-Astro build** with no React:

- Vanilla GSAP ScrollTrigger choreography in `src/scripts/motion.ts`
- Everything rendered as `.astro` components (`Hero`, `WorkStrip`, `Intro`,
  `Marquee`, `Stats`, `Testimonials`, …)
- Astro's `fonts:` API + self-hosted woff2 (`cormorant-garamond`,
  `dm-sans`) with their SIL OFL licences
- Images in `src/assets/photos/`, data in `src/data/`

It is **not** wired into the active site — the active `src/` uses the
React-islands architecture. Its pages/components live only under this
directory, so `astro build` ignores them. Keep them here as reference; the
canonical copy of this state also lives on the `backup/astro-pure` branch.

To browse it as a working site you would need to swap `src/` — not worth it;
use `git show backup/astro-pure:src/pages/index.astro` etc. for reference.