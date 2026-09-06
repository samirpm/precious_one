// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const fontDir = './src/assets/fonts';

export default defineConfig({
  // Used for canonical URLs, Open Graph images and the sitemap.
  // Update this to the studio's real domain before launch.
  site: 'https://preciousonephotography.com',
  integrations: [sitemap()],
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  build: { inlineStylesheets: 'auto' },
  vite: {
    plugins: [tailwindcss()],
    // Lightning CSS folds `animation-timeline` into the `animation` shorthand,
    // which browsers reject, silently killing every scroll-driven animation.
    // esbuild leaves the longhands alone.
    build: { cssMinify: 'esbuild' },
  },

  // Self-hosted fonts (SIL Open Font License, see src/assets/fonts). Astro
  // generates metric-matched fallback faces so text does not jump when the
  // real fonts arrive.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Cormorant Garamond',
      cssVariable: '--font-cormorant',
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
      optimizedFallbacks: true,
      display: 'swap',
      options: {
        variants: [
          { weight: 300, style: 'normal', src: [`${fontDir}/cormorant-garamond-latin-300-normal.woff2`] },
          { weight: 300, style: 'italic', src: [`${fontDir}/cormorant-garamond-latin-300-italic.woff2`] },
          { weight: 400, style: 'normal', src: [`${fontDir}/cormorant-garamond-latin-400-normal.woff2`] },
          { weight: 400, style: 'italic', src: [`${fontDir}/cormorant-garamond-latin-400-italic.woff2`] },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'DM Sans',
      cssVariable: '--font-dm',
      fallbacks: ['system-ui', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
      optimizedFallbacks: true,
      display: 'swap',
      options: {
        variants: [
          { weight: 300, style: 'normal', src: [`${fontDir}/dm-sans-latin-300-normal.woff2`] },
          { weight: 400, style: 'normal', src: [`${fontDir}/dm-sans-latin-400-normal.woff2`] },
          { weight: 500, style: 'normal', src: [`${fontDir}/dm-sans-latin-500-normal.woff2`] },
        ],
      },
    },
  ],
});
