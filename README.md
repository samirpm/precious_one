# Precious One Photography

Marketing site for Precious One Photography, a women-only newborn and family
photography studio in Abu Dhabi. Built with [Astro](https://astro.build) and
Tailwind CSS 4, and deployed as plain static files.

## Commands

| Command           | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `npm install`     | Install dependencies                           |
| `npm run dev`     | Start the dev server at `http://localhost:4321`|
| `npm run build`   | Build the production site into `dist/`         |
| `npm run preview` | Serve the built site locally                   |
| `npm run check`   | Type-check the project                         |

## Where things live

- `src/data/studio.ts` — studio contact details, session descriptions, packages
  and prices, FAQ, testimonials. **Update the phone number, WhatsApp number and
  email here before launch.**
- `src/data/photos.ts` — the photographs, their captions and which ones appear
  in the hero and the work strip. Add new photos to `src/assets/photos/` and
  register them here.
- `src/pages/index.astro` — the home page; `src/pages/services/[id].astro`
  builds one page per session type.
- `src/components/` — page sections. `Lightbox.astro` and `StickyCta.astro`
  are included on every page by `src/layouts/Base.astro`.
- `src/styles/global.css` — design tokens (colours, type) and shared styles.
- `astro.config.mjs` — set `site` to the real domain so canonical URLs, Open
  Graph images and the sitemap are correct.

## Deploying

`npm run build` produces a fully static site in `dist/`. Upload that folder to
any static host (Netlify, Vercel, Cloudflare Pages, or a plain web server). No
server runtime is required.
