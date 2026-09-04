import { chromium } from '/tmp/node_modules/playwright/index.mjs';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 20000 });

// Wait for logo intro to complete
await page.waitForTimeout(4500);

const heroTop = await page.evaluate(() => {
  const hero = document.querySelector('[style*="450vh"]') || document.querySelector('section.relative');
  if (!hero) {
    // Try finding CinematicHero by its sticky content
    const sections = document.querySelectorAll('section');
    for (const s of sections) {
      if (s.style.height === '450vh') return s.getBoundingClientRect().top + window.scrollY;
    }
    return null;
  }
  return hero.getBoundingClientRect().top + window.scrollY;
});

console.log('Hero section top:', heroTop);

if (heroTop === null) {
  console.log('Could not find hero section');
  await browser.close();
  process.exit(1);
}

// Test hero sticky at different scroll fractions (hero is 450vh = 350vh scroll range)
const totalScroll = 350 * (900 / 100); // 350vh in px
const testPositions = [0, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9];

for (const frac of testPositions) {
  const scrollTo = heroTop + frac * totalScroll;
  await page.evaluate((pos) => window.scrollTo(0, pos), scrollTo);
  await page.waitForTimeout(400);

  const info = await page.evaluate(() => {
    const sections = document.querySelectorAll('section');
    let heroSection = null;
    for (const s of sections) {
      if (s.style.height === '450vh') { heroSection = s; break; }
    }
    if (!heroSection) return { error: 'no hero found' };
    const sticky = heroSection.querySelector('.sticky');
    if (!sticky) return { error: 'no sticky found' };
    const stickyRect = sticky.getBoundingClientRect();
    return {
      sectionTop: Math.round(heroSection.getBoundingClientRect().top),
      stickyTop: Math.round(stickyRect.top),
      stickyH: Math.round(stickyRect.height),
      working: Math.abs(stickyRect.top) < 5,
    };
  });

  console.log(`hero frac=${frac.toFixed(1)}: section.top=${info.sectionTop} sticky.top=${info.stickyTop} stickyWorking=${info.working}`);
  await page.screenshot({ path: `/home/user/Desktop/precious_one/screenshots-portfolio/hero-${String(frac).replace('.', '_')}.png` });
}

await browser.close();
