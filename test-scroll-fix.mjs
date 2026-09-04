import { createRequire } from 'module';
const require = createRequire('/home/user/.nvm/versions/node/v20.19.5/lib/node_modules/');
const { chromium } = require('playwright');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// Get stage dimensions
const totalScroll = await page.evaluate(() => {
  const stage = document.querySelector('section');
  return stage.offsetHeight - window.innerHeight;
});
console.log('Total scroll:', totalScroll);

const shots = [];

async function scrollTo(p, label) {
  const y = Math.round(totalScroll * p);
  await page.evaluate((pos) => window.scrollTo({ top: pos, behavior: 'instant' }), y);
  await page.waitForTimeout(800); // let smoothing converge
  const rawP = await page.evaluate(() => {
    const stage = document.querySelector('section');
    const rect = stage.getBoundingClientRect();
    const total = stage.offsetHeight - window.innerHeight;
    return Math.max(0, Math.min(1, -rect.top / total));
  });
  // Read React's smoothed progress from the DOM (FrameSequence sets data attributes)
  // Actually we can't read React state directly. Instead check visual state.
  await page.screenshot({ path: `/home/user/.claude/jobs/4f461d7d/tmp/fix-${label}.png` });
  console.log(`${label}: target_p=${p} raw_p=${rawP.toFixed(4)}`);
  shots.push(label);
}

// Scroll DOWN — full journey
await scrollTo(0, 'd0-top');
await scrollTo(0.10, 'd1-hero-exit');
await scrollTo(0.20, 'd2-camera-in');
await scrollTo(0.40, 'd3-camera-mid');
await scrollTo(0.68, 'd4-portfolio-reveal');
await scrollTo(0.85, 'd5-portfolio-track');
await scrollTo(1.0, 'd6-bottom');

// Scroll UP — reverse journey (the key test)
await scrollTo(0.85, 'u1-from-bottom');
await scrollTo(0.68, 'u2-portfolio-reveal-up');
await scrollTo(0.40, 'u3-camera-mid-up');
await scrollTo(0.20, 'u4-camera-in-up');
await scrollTo(0.10, 'u5-hero-exit-up');
await scrollTo(0.0, 'u6-top');

console.log('All shots:', shots.join(', '));
console.log('Done');
await browser.close();
