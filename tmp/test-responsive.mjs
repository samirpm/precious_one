import { chromium } from '/tmp/node_modules/playwright/index.mjs';
import path from 'path';
import fs from 'fs';

const OUT = '/home/user/Desktop/precious_one/screenshots-responsive';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

const viewports = [
  { w: 1280, h: 800, label: 'desktop-1280' },
  { w: 1024, h: 768, label: 'tablet-1024' },
  { w: 430, h: 932, label: 'mobile-430' },
  { w: 390, h: 844, label: 'mobile-390' },
];

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.w, height: vp.h });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 20000 });

  // Get absolute positions BEFORE any scrolling
  const positions = await page.evaluate(() => {
    const els = {
      hero: document.querySelector('section'),
      portfolio: document.querySelector('#portfolio'),
      services: document.querySelector('#services'),
    };
    const result = {};
    for (const [key, el] of Object.entries(els)) {
      if (el) {
        const rect = el.getBoundingClientRect();
        result[key] = { top: rect.top + window.scrollY, height: rect.height };
      }
    }
    result.scrollHeight = document.body.scrollHeight;
    return result;
  });
  console.log(`${vp.label} positions:`, JSON.stringify(positions));

  // Scroll to show hero (after intro clears)
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT, `01-hero-${vp.label}.png`) });

  // Scroll to show portfolio images (25% through portfolio section)
  if (positions.portfolio) {
    const scrollTo = positions.portfolio.top + positions.portfolio.height * 0.30;
    await page.evaluate((pos) => window.scrollTo(0, pos), scrollTo);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUT, `02-portfolio-${vp.label}.png`) });
  }

  // Scroll to show services
  if (positions.services) {
    await page.evaluate((pos) => window.scrollTo(0, pos - 100), positions.services.top);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUT, `03-services-${vp.label}.png`) });
  }

  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT, `04-footer-${vp.label}.png`) });

  console.log(`✅ ${vp.label} done`);
}

await browser.close();
