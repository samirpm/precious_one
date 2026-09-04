import { chromium } from '/tmp/node_modules/playwright/index.mjs';
import path from 'path';
import fs from 'fs';

const OUT = '/home/user/Desktop/precious_one/screenshots-portfolio';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 20000 });

// Get absolute position of portfolio BEFORE any scrolling
const portfolioInfo = await page.evaluate(() => {
  const el = document.querySelector('#portfolio');
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    height: rect.height,
    viewportHeight: window.innerHeight,
  };
});
console.log('Portfolio info:', JSON.stringify(portfolioInfo));

if (portfolioInfo) {
  const totalScroll = portfolioInfo.height - portfolioInfo.viewportHeight;
  console.log(`Total scroll range: ${totalScroll}px`);

  const fractions = [0, 0.05, 0.10, 0.15, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1.0];

  for (const frac of fractions) {
    const scrollTo = portfolioInfo.top + frac * totalScroll;
    await page.evaluate((pos) => window.scrollTo(0, pos), scrollTo);
    await new Promise(r => setTimeout(r, 500));

    // Get actual progress from element position
    const rect = await page.evaluate(() => {
      const el = document.querySelector('#portfolio');
      const r = el.getBoundingClientRect();
      return { top: r.top };
    });
    const actualProgress = Math.max(0, Math.min(1, -rect.top / totalScroll));

    await page.screenshot({ path: path.join(OUT, `frac-${String(frac).replace('.', '_')}.png`) });
    console.log(`  frac=${frac.toFixed(2)} scrollTo=${Math.round(scrollTo)} actualProgress=${actualProgress.toFixed(3)}`);
  }
}

await browser.close();
console.log('Done');
